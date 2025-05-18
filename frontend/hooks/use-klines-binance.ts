import { useEffect } from "react";
import { Spot, SpotWebsocketAPI } from "@binance/spot";

const configurationWebsocketAPI = {
  apiKey: "your-api-key",
  apiSecret: "your-api-secret",
};
const client = new Spot({ configurationWebsocketAPI });

export const useKlinesBinance = () => {
  console.log('imhit>>>')
  const handleKlines = async () => {
    let connection;

    console.log({ SpotWebsocketAPI })
    try {
      connection = await client.websocketAPI.connect();

      const response = await connection.klines({
        symbol: "BNBUSDT",
        interval: SpotWebsocketAPI.KlinesIntervalEnum!.INTERVAL_1s,
      });

      const rateLimits = response.rateLimits!;
      console.log("klines() rate limits:", rateLimits);

      const data = response.data;
      console.log("klines() response:", data);
    } catch (error) {
      console.error("klines() error:", error);
    } finally {
      await connection!.disconnect();
    }
  };

  useEffect(() => {
    handleKlines();
  }, []);

  return [];
};
