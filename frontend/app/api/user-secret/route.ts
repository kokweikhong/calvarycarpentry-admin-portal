import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  const data = await req.json();

  const SECRET = process.env.CREATE_USER_SECRET;

  if (data.secret !== SECRET) {
    return NextResponse.json(false);
  }

  return NextResponse.json(true);
}
