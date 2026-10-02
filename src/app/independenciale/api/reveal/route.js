import { NextResponse } from "next/server";
import { getSecretForMode1, getSecretForMode2 } from "../gameLogic";

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const mode = searchParams.get("mode");

  const secret = mode === "country" ? getSecretForMode2() : getSecretForMode1();
  return NextResponse.json({ country: secret.country, year: secret.independenceYear });
}