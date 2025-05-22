import { NextRequest, NextResponse } from "next/server";

const USER_API = process.env.USER_API!; // e.g. https://usermanagementapi-k9md.onrender.com/api

export async function POST(req: NextRequest) {
  const body = await req.json();

  // Ensure only username and password are sent
  const payload = {
    username: body.username,
    password: body.password,
    email: body.email,
    firstName: "John",
    lastName: "Doe",
    roles: ["team_member"],
    teamId: 1,
  };
  let data;

  console.log("Payload", payload, `${USER_API}/auth/signup`);

  try {
    // Forward credentials to USER API
    const apiRes = await fetch(`${USER_API}/auth/signup`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    data = await apiRes.json();
    if (!apiRes.ok) {
      return NextResponse.json(
        { error: "Authentication failed", details: data },
        { status: apiRes.status }
      );
    }
  } catch (err) {
    return NextResponse.json({ error: err }, { status: 502 });
  }

  const jwt = data.token || data.jwt || data.accessToken;
  if (!jwt) {
    return NextResponse.json({ error: "No token received" }, { status: 500 });
  }

  // Set JWT as HTTP-only cookie
  const response = NextResponse.json({ success: true });
  response.cookies.set("jwt", jwt, {
    httpOnly: false,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 24 * 7, // 7 days
  });

  return response;
}
