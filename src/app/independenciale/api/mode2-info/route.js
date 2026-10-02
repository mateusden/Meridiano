import { NextResponse } from "next/server";
import { getSecretForMode2 as getSecretOfTheDay } from "../gameLogic";

export async function GET() {
  const secret = getSecretOfTheDay();
  return NextResponse.json({ year: secret.independenceYear });
}