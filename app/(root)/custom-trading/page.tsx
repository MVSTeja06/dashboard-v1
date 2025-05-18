"use client";
import CustomChartComponent from "@/components/custom-chart-component";
import {
  Time
} from "lightweight-charts";
import { useEffect, useState } from "react";

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


const INIT_DATA_URL =
  "https://www.binance.us/api/v1/klines?symbol=BTCUSDT&interval=1d&limit=1000&startTime=1707195600000&endTime=1747598630400";

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
      setChartData(convertedData);
    })();
  }, []);

  // Use fetched data if available, otherwise use initialData
  return <CustomChartComponent data={chartData} />;
}
