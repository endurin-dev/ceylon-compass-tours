import { NextResponse } from "next/server";

export async function POST() {
  return NextResponse.json({ received: false, message: "No webhook provider configured." }, { status: 501 });
}
