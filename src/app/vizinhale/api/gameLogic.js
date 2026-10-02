import { VIZINHALE_DATA } from "../data";

function getBrazilDateString() {
  const formatter = new Intl.DateTimeFormat("en-CA", {
    timeZone: "America/Sao_Paulo",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  });
  return formatter.format(new Date());
}

export function normalizeText(s) {
  return s
    .toUpperCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .trim();
}

export function dailySeed() {
  const dateStr = getBrazilDateString() + "-vizinhale";
  let hash = 0;
  for (let i = 0; i < dateStr.length; i++) {
    hash = (hash * 31 + dateStr.charCodeAt(i)) >>> 0;
  }
  return hash;
}

export function getSecretOfTheDay() {
  return VIZINHALE_DATA[dailySeed() % VIZINHALE_DATA.length];
}

export function evaluateGuess(guessName, secret) {
  const guessEntry = VIZINHALE_DATA.find(
    (c) => normalizeText(c.name) === normalizeText(guessName),
  );

  if (!guessEntry) {
    return { error: "País não encontrado. Escolha uma das sugestões." };
  }

  const secretNeighbors = secret.neighbors.map(normalizeText);

  // vizinhos da resposta que o país chutado também tem
  const shared = secret.neighbors.filter((n) =>
    guessEntry.neighbors.some((g) => normalizeText(g) === normalizeText(n)),
  );

  return {
    guessName: guessEntry.name,
    won: guessEntry.name === secret.name,
    borders: secretNeighbors.includes(normalizeText(guessEntry.name)),
    shared,
  };
}