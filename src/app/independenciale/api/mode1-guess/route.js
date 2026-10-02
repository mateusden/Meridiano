import { NextResponse } from "next/server";
import { getSecretForMode1 as getSecretOfTheDay, evaluateYearGuess } from "../gameLogic";

export async function POST(request) {
  const { guess } = await request.json();
  const guessYear = parseInt(guess, 10);

  if (isNaN(guessYear)) {
    return NextResponse.json({ error: "Digite um ano válido." }, { status: 400 });
  }

  const secret = getSecretOfTheDay();
  const result = evaluateYearGuess(guessYear, secret);

  return NextResponse.json({
    ...result,
    revealedYear: result.won ? secret.independenceYear : null,
  });
}