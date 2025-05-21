import { NextRequest, NextResponse } from "next/server";
import { formatISO, setMilliseconds, setSeconds, subMinutes } from 'date-fns';

const ALPACA_KEY = process.env.ALPACA_KEY!;
const ALPACA_SECRET = process.env.ALPACA_SECRET!;
const BASE_URL = "https://data.alpaca.markets/v2/stocks";

function getEndDate20MinAgo() {
  const date = setMilliseconds(setSeconds(subMinutes(new Date(), 15), 0), 0);
  return formatISO(date);
}

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const symbol = searchParams.get("symbol") || "SPY";
  const timeframe = "5Min";
  const limit = searchParams.get("limit") || "1000";
  const start = searchParams.get("start");
  const end = getEndDate20MinAgo();

  let url = `${BASE_URL}/${symbol}/bars?timeframe=${timeframe}&limit=${limit}`;
  if (start) url += `&start=${start}`;
  if (end) url += `&end=${end}`;
  
  const resp = await fetch(url, {
    headers: {
      "APCA-API-KEY-ID": ALPACA_KEY,
      "APCA-API-SECRET-KEY": ALPACA_SECRET,
    },
  });

  const data = await resp.json();
  return NextResponse.json(data);
}


// const API_KEY = process.env.NEXT_PUBLIC_ALPACA_KEY;
    // const API_SECRET = process.env.NEXT_PUBLIC_ALPACA_SECRET;