import { NextResponse } from "next/server";
import { getSecretOfTheDay } from "../gameLogic";

export async function GET() {
  const secret = getSecretOfTheDay();
  const neighbors = [...secret.neighbors].sort((a, b) =>
    a.localeCompare(b, "pt-BR"),
  );
  return NextResponse.json({ neighbors });
}