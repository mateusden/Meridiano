import { NextResponse } from "next/server";
import { getSecretForMode1 as getSecretOfTheDay } from "../gameLogic";

export async function GET() {
  const secret = getSecretOfTheDay();
  return NextResponse.json({ country: secret.country, continent: secret.continent });
}