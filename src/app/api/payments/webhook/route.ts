import { NextResponse } from "next/server";

export async function POST() {
  return NextResponse.json(
    { error: "Webhook verification is not configured." },
    { status: 501 }
  );
}
