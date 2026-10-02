import { NextResponse } from "next/server";
import { getSecretForMode2 as getSecretOfTheDay, evaluateCountryGuess } from "../gameLogic";

export async function POST(request) {
  const { guess } = await request.json();
  const secret = getSecretOfTheDay();
  const result = evaluateCountryGuess(guess, secret);

  if (result.error) {
    return NextResponse.json({ error: result.error }, { status: 400 });
  }

  return NextResponse.json({
    ...result,
    revealedCountry: result.won ? secret.country : null,
  });
}