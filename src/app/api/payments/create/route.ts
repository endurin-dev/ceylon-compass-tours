import { NextResponse } from "next/server";

export async function POST() {
  return NextResponse.json(
    { error: "Payment provider is not configured. Do not accept live payments until provider integration is implemented." },
    { status: 501 }
  );
}
