import { NextResponse } from "next/server";

export async function GET() {
  const options = {
    method: "GET",
    headers: {
      accept: "application/json",
      "APCA-API-KEY-ID": "PK2ONCRL0XS41R2OV80P",
      "APCA-API-SECRET-KEY": "vGAtMI2LziHSypAZF2iSUcKhqmRTgLPtdKdaD5Mq",
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
