"use client";
import {
  CandlestickSeries,
  createChart,
  CrosshairMode,
  Time,
} from "lightweight-charts";
import { useTheme } from "next-themes";
import { useEffect, useRef } from "react";

export interface IAlpacaChartSeriesData {
  open?: number;
  high?: number;
  low?: number;
  close?: number;
  time?: Time | number;
  volume?: number;
}

interface IChartDataType {
  data: IAlpacaChartSeriesData[];
  symbol?: string;
}

const CustomAlpacaChartComponent = (props: IChartDataType) => {
  const { data = [], symbol = "SPY" } = props;
  const { resolvedTheme } = useTheme();
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
          color: resolvedTheme === "light" ? "#fff" : "#000",
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
        tickMarkFormatter: (time: number) => {
          const date = new Date(time * 1000);
          return date.toLocaleDateString("en-US", {
            month: "numeric",
            day: "2-digit",
            hour: "2-digit",
            minute: "2-digit",
            hour12: false,
          });
        },
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

    return () => {
      window.removeEventListener("resize", handleResize);
      chart.remove();
    };
  }, [data, resolvedTheme]);

  return (
    <div className="chart-container">
      <div className="bg-card text-card-foreground flex flex-col gap-6  w-50 shadow-sm m-4">
        <p className="text-4xl font-bold">{symbol}</p>
      </div>
      <div
        className="bg-card text-card-foreground flex flex-col gap-6 rounded-xl shadow-sm m-4"
        ref={chartContainerRef}
      />
    </div>
  );
};

export default CustomAlpacaChartComponent;
