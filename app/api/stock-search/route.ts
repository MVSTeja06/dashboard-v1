import { NextResponse } from "next/server";

const ALPACA_KEY = process.env.ALPACA_KEY!;
const ALPACA_SECRET = process.env.ALPACA_SECRET!;

export async function GET() {
  const options = {
    method: "GET",
    headers: {
      accept: "application/json",
      "APCA-API-KEY-ID": ALPACA_KEY,
      "APCA-API-SECRET-KEY": ALPACA_SECRET,
    },
  };

  try {
    const response = await fetch(
      "https://paper-api.alpaca.markets/v2/assets?status=active&exchange=NASDAQ&attributes=",
      options
    );
    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    return NextResponse.json(
      { error: "Failed to fetch data", details: errorMessage },
      { status: 500 }
    );
  }
}
