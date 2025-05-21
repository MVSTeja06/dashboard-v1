"use client";
import CustomChartComponent from "@/components/custom-alpaca-chart-component";
import { Time } from "lightweight-charts";
import { useEffect, useState } from "react";
import { AlpacaBar } from "../stock-market-prices/page";

export interface IAlpacaChartSeriesData {
  open?: number;
  high?: number;
  low?: number;
  close?: number;
  time?: Time | number;
  volume?: number;
}

const ALPACA_API_URL = "/api/alpaca-bars?symbol=SPY&timeframe=1Day&limit=100"; // Proxy route

function convertAlpacaBarData(data: AlpacaBar[]): IAlpacaChartSeriesData[] {
  return data.map((bar) => ({
    time: new Date(bar.t).getTime() / 1000, // Convert ISO to epoch seconds
    open: bar.o,
    high: bar.h,
    low: bar.l,
    close: bar.c,
    volume: bar.v,
  }));
}

export default function Page() {
  const [chartData, setChartData] = useState<IAlpacaChartSeriesData[]>([]);

  useEffect(() => {
    (async () => {
      const res = await fetch(ALPACA_API_URL);
      const json = await res.json();
      const converted = convertAlpacaBarData(json.bars || []);
      setChartData(converted);
    })();
  }, []);

  return <CustomChartComponent data={chartData} />;
}