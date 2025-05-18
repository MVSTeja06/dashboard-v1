"use client";
import {
  CandlestickSeries,
  createChart,
  CrosshairMode,
  Time,
  UTCTimestamp,
} from "lightweight-charts";
import { useEffect, useRef, useState } from "react";

export interface IchartSeriesData {
  open?: number;
  high?: number;
  low?: number;
  close?: number;
  time?: Time | number;
  openTime?: number; // Open time
  volume?: number; // Volume
  closeTime?: Time | number; // Close time
  quoteAssetVolume?: number; // Quote asset volume
  numberOfTrades?: number; // Number of trades
  takerBuyBaseAssetVolume?: number; // Taker buy base asset volume
  takerBuyQuoteAssetVolume?: number; // Taker buy quote asset volume
}

interface IChartDataType {
  data: IchartSeriesData[];
  colors?: {
    backgroundColor: string;
    lineColor: string;
    textColor: string;
    areaTopColor: string;
    areaBottomColor: string;
  };
}

const WS_URL = "wss://stream.binance.us:9443/ws/btcusdt@kline_1m";
const INIT_DATA_URL =
  "https://www.binance.us/api/v1/klines?symbol=BTCUSDT&interval=1d&limit=1000&startTime=1707195600000&endTime=1747598630400";

export const ChartComponent = (props: IChartDataType) => {
  const { data = {} } = props;

  const chartContainerRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const handleResize = () => {
      if (chartContainerRef.current) {
        chart.applyOptions({ width: chartContainerRef.current.clientWidth });
      }
    };

    if (!chartContainerRef.current) return;

    const chart = createChart(chartContainerRef.current, {
      height: 500,
      layout: {
        background: {
          color: "#000000",
        },
        textColor: "rgba(255, 255, 255, 0.9)",
      },
      grid: {
        vertLines: {
          color: "rgba(197, 203, 206, 0.5)",
        },
        horzLines: {
          color: "rgba(197, 203, 206, 0.5)",
        },
      },
      crosshair: {
        mode: CrosshairMode.Normal,
      },
      overlayPriceScales: {
        borderColor: "rgba(197, 203, 206, 0.8)",
      },
      timeScale: {
        borderColor: "rgba(197, 203, 206, 0.8)",
        timeVisible: true,
        secondsVisible: false,
      },
    });
    chart.timeScale().fitContent();

    const candleSeries = chart.addSeries(CandlestickSeries, {
      upColor: "#00ff00",
      downColor: "#ff0000",
      borderDownColor: "rgba(255, 144, 0, 1)",
      borderUpColor: "rgba(255, 144, 0, 1)",
      wickDownColor: "rgba(255, 144, 0, 1)",
      wickUpColor: "rgba(255, 144, 0, 1)",
    });

    candleSeries.setData(data as []);
    window.addEventListener("resize", handleResize);

    const binanceSocket = new WebSocket(WS_URL);

    binanceSocket.onmessage = function (event) {
      const message = JSON.parse(event.data);
      const candlestick = message.k;

      candleSeries.update({
        time: (candlestick.t / 1000) as UTCTimestamp,
        open: Number(candlestick.o),
        high: Number(candlestick.h),
        low: Number(candlestick.l),
        close: Number(candlestick.c),
      });
    };
    return () => {
      binanceSocket.close();
      window.removeEventListener("resize", handleResize);
      chart.remove();
    };
  }, [data]);

  return (
    <div className="chart-container">
      <div className="bg-card text-card-foreground flex flex-col gap-6 rounded-xl w-50 shadow-sm m-4">
        <p className="text-4xl font-bold">
          BTC US DT
        </p>
      </div>
      <div
        className="bg-card text-card-foreground flex flex-col gap-6 rounded-xl shadow-sm m-4"
        ref={chartContainerRef}
      />
    </div>
  );
};

function convertBinanceKlineData(data: unknown[]): IchartSeriesData[] {
  return data.map((item: unknown) => {
    // Type assertion to treat item as an array of primitives
    const klineArray = item as (string | number)[];
    return {
      openTime: Number(klineArray[0]), // Open time
      time: Number(klineArray[0]) / 1000, // Open time
      open: Number(klineArray[1]), // Open
      high: Number(klineArray[2]), // High
      low: Number(klineArray[3]), // Low
      close: Number(klineArray[4]), // Close
      volume: Number(klineArray[5]), // Volume
      closeTime: Number(klineArray[6]), // Close time
      quoteAssetVolume: Number(klineArray[7]), // Quote asset volume
      numberOfTrades: Number(klineArray[8]), // Number of trades
      takerBuyBaseAssetVolume: Number(klineArray[9]), // Taker buy base asset volume
      takerBuyQuoteAssetVolume: Number(klineArray[10]), // Taker buy quote asset volume
    };
  });
}

export default function Page() {
  // Store converted data properly in state
  const [chartData, setChartData] = useState<IchartSeriesData[]>([]);

  useEffect(() => {
    (async () => {
      const iniData = await fetch(INIT_DATA_URL);
      const response = await iniData.json();

      const convertedData = convertBinanceKlineData(response);
      console.log(convertedData);
      setChartData(convertedData);
    })();
  }, []);

  // Use fetched data if available, otherwise use initialData
  return <ChartComponent data={chartData} />;
}
