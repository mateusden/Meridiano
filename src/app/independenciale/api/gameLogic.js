import { COUNTRIES_DATA } from "../data";

function getBrazilDateString() {
  const now = new Date();
  const formatter = new Intl.DateTimeFormat("en-CA", {
    timeZone: "America/Sao_Paulo",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  });
  return formatter.format(now);
}

export function dailySeed() {
  const dateStr = getBrazilDateString() + "-independenciale";
  let hash = 0;
  for (let i = 0; i < dateStr.length; i++) {
    hash = (hash * 31 + dateStr.charCodeAt(i)) >>> 0;
  }
  return hash;
}

function getSeedForMode(modeSuffix) {
  const dateStr = getBrazilDateString() + "-independenciale-" + modeSuffix;
  let hash = 0;
  for (let i = 0; i < dateStr.length; i++) {
    hash = (hash * 31 + dateStr.charCodeAt(i)) >>> 0;
  }
  return hash;
}

export function getSecretForMode1() {
  const idx = getSeedForMode("year") % COUNTRIES_DATA.length;
  return COUNTRIES_DATA[idx];
}

export function getSecretForMode2() {
  const idx = getSeedForMode("country") % COUNTRIES_DATA.length;
  return COUNTRIES_DATA[idx];
}

function normalizeText(s) {
  return s
    .toUpperCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "");
}

function getProximity(diff) {
  const abs = Math.abs(diff);
  if (abs === 0) return "correct";
  if (abs <= 5) return "muito perto";
  if (abs <= 20) return "perto";
  if (abs <= 50) return "longe";
  return "muito longe";
}

// MODO 1: mostra o país, pessoa chuta o ano
export function evaluateYearGuess(guessYear, secret) {
  const diff = secret.independenceYear - guessYear;
  const won = diff === 0;
  const direction = diff === 0 ? "correct" : diff > 0 ? "depois" : "antes";
  const proximity = getProximity(diff);
  return { guessYear, direction, proximity, won };
}

// MODO 2: mostra o ano + dicas, pessoa chuta o país
export function evaluateCountryGuess(guessCountryName, secret) {
  const guessEntry = COUNTRIES_DATA.find(
    (c) => normalizeText(c.country) === normalizeText(guessCountryName)
  );

  if (!guessEntry) {
    return { error: "País não encontrado na lista." };
  }

  const won = normalizeText(guessEntry.country) === normalizeText(secret.country);
  const continentMatch = guessEntry.continent === secret.continent;
  const colonizerMatch = guessEntry.colonizer === secret.colonizer;

  let populationHint = null;
  if (!won) {
    populationHint = guessEntry.population < secret.population ? "higher" : "lower";
  }

  return {
    guessCountry: guessEntry.country,
    continentMatch,
    colonizerMatch,
    populationHint,
    won,
  };
}