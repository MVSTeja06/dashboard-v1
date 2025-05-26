"use client";
import { useTheme } from 'next-themes';
import React, { useEffect, useRef, memo } from 'react';

function TradingViewWidget() {
  const container = useRef<HTMLDivElement>(null);

  const { resolvedTheme } = useTheme();
  // const systemTheme = useSystemTheme();
  // console.log({ resolvedTheme })
  useEffect(
    () => {
      if(container.current?.querySelector("#tradingview-widget-iframe")) {
        container.current?.querySelector("#tradingview-widget-iframe")?.remove();
      };

      const script = document.createElement("script");
      script.src = "https://s3.tradingview.com/external-embedding/embed-widget-advanced-chart.js";
      script.type = "text/javascript";
      script.async = true;
      script.id = "tradingview-widget-iframe";
      script.innerHTML = `
         {
          "autosize": true,
          "symbol": "NASDAQ:AAPL",
          "timezone": "America/New_York",
          "theme": "${resolvedTheme}",
          "style": "1",
          "locale": "en",
          "withdateranges": true,
          "range": "YTD",
          "hide_side_toolbar": false,
          "allow_symbol_change": true,
          "watchlist": [
            "BITSTAMP:BTCUSD",
            "NASDAQ:NVDA"
          ],
          "compareSymbols": [
            {
              "symbol": "NASDAQ:MSFT",
              "position": "SameScale"
            }
          ],
          "details": true,
          "hotlist": true,
          "studies": [
            "STD;Price%1Target",
            "Volume@tv-basicstudies"
          ],
          "show_popup_button": true,
          "popup_width": "1000",
          "popup_height": "650",
          "support_host": "https://www.tradingview.com"
        }`;
      container?.current?.appendChild?.(script);
    },
    [resolvedTheme]
  );

  return (
    <div className="tradingview-widget-container" ref={container} style={{ height: "100%", width: "100%" }}>
      <div className="tradingview-widget-container__widget" style={{ height: "calc(100% - 32px)", width: "100%" }}></div>
      <div className="tradingview-widget-copyright"><a href="https://www.tradingview.com/" rel="noopener nofollow" target="_blank"><span className="blue-text">Track all markets on TradingView</span></a></div>
    </div>
  );
}

export default memo(TradingViewWidget);
