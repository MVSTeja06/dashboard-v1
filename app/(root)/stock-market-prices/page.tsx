"use client";
import CustomChartComponent from "@/components/custom-alpaca-chart-component";
import StockSearchComponent from "@/components/stock-search-component";
import { Time, UTCTimestamp } from "lightweight-charts";
import { useEffect, useRef, useState } from "react";

export interface IAlpacaChartSeriesData {
  open?: number;
  high?: number;
  low?: number;
  close?: number;
  time?: Time | number;
  volume?: number;
}

const LIMIT = 1000;

export interface AlpacaBar {
  t: string; // ISO date string
  o: number;
  h: number;
  l: number;
  c: number;
  v: number;
}

function convertAlpacaBarData(data: AlpacaBar[]): IAlpacaChartSeriesData[] {
  return data.map((bar) => {
    const localDate = new Date(bar.t);
    const localEpochSeconds = Math.floor(
      localDate.getTime() / 1000
    ) as UTCTimestamp;

    return {
      time: localEpochSeconds, // Convert ISO to epoch seconds
      open: bar.o,
      high: bar.h,
      low: bar.l,
      close: bar.c,
      volume: bar.v,
    };
  });
}

// Helper to get ISO date string for N days ago
function getDateNDaysAgo(days: number) {
  const d = new Date();
  d.setMinutes(d.getMinutes() - 15); // End 15 min ago
  d.setDate(d.getDate() - days);
  d.setHours(0, 0, 0, 0);
  return d.toISOString();
}

export default function Page() {
  const [open, setOpen] = useState(false);

  const [chartData, setChartData] = useState<IAlpacaChartSeriesData[]>([]);
  const wsRef = useRef<WebSocket | null>(null);
  
  const [query, setQuery] = useState({
    symbol: "NVDA",
    name: "",
  });

  const prevSymbolRef = useRef<string>(query.symbol);

  // Fetch historical bars for the selected symbol
  useEffect(() => {
    const fetchBars = async () => {
      const start = getDateNDaysAgo(5);
      const url = `/api/alpaca-bars?symbol=${query.symbol}&limit=${LIMIT}&start=${start}`;
      const res = await fetch(url);
      const json = await res.json();
      const converted = convertAlpacaBarData(json.bars || []);
      setChartData(converted);
    };

    if (!open) fetchBars();
  }, [query.symbol, open]);

  // WebSocket for real-time bars
  useEffect(() => {
    if (wsRef.current) {
      wsRef.current.close();
    }
    if (!open) return;

    if (typeof window === "undefined") return;

    const WS_URL = "wss://stream.data.alpaca.markets/v2/iex";
    const API_KEY = process.env.NEXT_PUBLIC_ALPACA_KEY;
    const API_SECRET = process.env.NEXT_PUBLIC_ALPACA_SECRET;
    if (!API_KEY || !API_SECRET) return;

    const ws = new WebSocket(WS_URL);
    wsRef.current = ws;

    ws.onopen = () => {
      ws.send(
        JSON.stringify({
          action: "auth",
          key: API_KEY,
          secret: API_SECRET,
        })
      );
    };

    ws.onmessage = (event) => {
      const msg = JSON.parse(event.data);
      if (Array.isArray(msg)) {
        msg.forEach((item) => {
          if (item.T === "b" && item.S === query.symbol) {
            setChartData((prev) => {
              const newBar = {
                time: (new Date(item.t).getTime() / 1000) as UTCTimestamp,
                open: item.o,
                high: item.h,
                low: item.l,
                close: item.c,
                volume: item.v,
              };
              if (prev.length && prev[prev.length - 1].time === newBar.time) {
                return [...prev.slice(0, -1), newBar];
              } else {
                return [...prev, newBar].slice(-LIMIT);
              }
            });
          }
        });
      } else if (msg.msg === "authenticated") {
        // Unsubscribe from previous symbol if needed
        if (prevSymbolRef.current && prevSymbolRef.current !== query.symbol) {
          ws.send(
            JSON.stringify({
              action: "unsubscribe",
              bars: [prevSymbolRef.current],
            })
          );
        }
        // Subscribe to new symbol
        ws.send(
          JSON.stringify({
            action: "subscribe",
            bars: [query.symbol],
          })
        );
        prevSymbolRef.current = query.symbol;
      }
    };

    ws.onerror = (e) => {
      console.error("WebSocket error:", e);
      // Optionally handle errors
    };

    return () => {
      ws.close();
    };
  }, [query.symbol, open]);

  return (
    <div>
      {/* <div className="flex gap-4 items-center m-4">
        <label htmlFor="symbol" className="font-bold">
          Symbol:
        </label>
        <Select value={symbol} onValueChange={setSymbol}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="symbol" />
          </SelectTrigger>
          <SelectContent className="rounded-xl">
            {SYMBOLS.map((s) => (
              <SelectItem className="rounded-lg" key={s} value={s}>
                {s}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div> */}
      <StockSearchComponent
        query={query}
        setQuery={setQuery}
        open={open}
        setOpen={setOpen}
      />
      <CustomChartComponent data={chartData} symbol={query.symbol} />
    </div>
  );
}
