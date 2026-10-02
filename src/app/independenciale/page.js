"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import { ArrowLeft, Check, X, ArrowUp, ArrowDown, Send, Globe2 } from "lucide-react";
import IndependencialeTitle from "./IndependencialeTitle";
import { COUNTRIES_DATA } from "./data";

const MAX_GUESSES = 6;

function todayKey(mode) {
  const now = new Date();
  const formatter = new Intl.DateTimeFormat("en-CA", {
    timeZone: "America/Sao_Paulo",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  });
  return `independenciale-${mode}-${formatter.format(now)}`;
}

export default function Independenciale() {
  const [mode, setMode] = useState("year"); // "year" ou "country"

  return (
    <div className="min-h-screen bg-slate-900 text-slate-100 flex flex-col items-center justify-between p-4 sm:p-6">
      
      <div className="w-full max-w-2xl flex flex-col items-center gap-4">
        
        {/* Topo com Voltar ao Hub e Badge (FORA DO CARD) */}
        <div className="w-full flex items-center justify-between">
          <Link
            href="/"
            className="inline-flex items-center gap-2 px-3 py-1.5 bg-amber-400 text-slate-950 font-black text-xs uppercase tracking-wider rounded-xl border-2 border-slate-950 shadow-[3px_3px_0px_0px_#000] hover:-translate-y-0.5 hover:bg-amber-300 transition-all"
          >
            <ArrowLeft size={16} strokeWidth={2.5} />
            <span>Hub</span>
          </Link>

          <span className="px-3 py-1 bg-amber-200 text-slate-950 font-black text-xs uppercase tracking-wider rounded-xl border-2 border-slate-950 shadow-[2px_2px_0px_0px_#000]">
            Desafio Histórico
          </span>
        </div>

        {/* Card Principal Bege Neobrutalista */}
        <div className="w-full bg-[#f6f0e8] border-4 border-slate-950 rounded-3xl p-5 sm:p-8 shadow-[8px_8px_0px_0px_rgba(15,23,42,1)] flex flex-col items-center gap-6 text-slate-950">
          
          <IndependencialeTitle />

          {/* Seletor de Modos */}
          <div className="flex gap-2 bg-slate-200 border-2 border-slate-950 rounded-2xl p-1.5 shadow-[2px_2px_0px_0px_#000] w-full max-w-xs justify-center">
            <button
              onClick={() => setMode("year")}
              className={`flex-1 py-1.5 px-3 rounded-xl text-xs sm:text-sm font-black transition-all border-2 cursor-pointer ${
                mode === "year"
                  ? "bg-amber-400 text-slate-950 border-slate-950 shadow-[1.5px_1.5px_0px_0px_#000]"
                  : "border-transparent text-slate-700 hover:text-slate-950"
              }`}
            >
              Adivinhe o Ano
            </button>
            <button
              onClick={() => setMode("country")}
              className={`flex-1 py-1.5 px-3 rounded-xl text-xs sm:text-sm font-black transition-all border-2 cursor-pointer ${
                mode === "country"
                  ? "bg-amber-400 text-slate-950 border-slate-950 shadow-[1.5px_1.5px_0px_0px_#000]"
                  : "border-transparent text-slate-700 hover:text-slate-950"
              }`}
            >
              Adivinhe o País
            </button>
          </div>

          {mode === "year" ? <YearMode /> : <CountryMode />}

        </div>
      </div>

      {/* Footer */}
      <footer className="pt-6 text-center text-slate-500 text-xs">
        Meridiano Independênciale · Desafio Diário
      </footer>

    </div>
  );
}

function YearMode() {
  const [country, setCountry] = useState("");
  const [continent, setContinent] = useState("");
  const [current, setCurrent] = useState("");
  const [guesses, setGuesses] = useState([]);
  const [gameOver, setGameOver] = useState(false);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    async function load() {
      const res = await fetch("/independenciale/api/mode1-info");
      const data = await res.json();
      setCountry(data.country);
      setContinent(data.continent);

      const saved = localStorage.getItem(todayKey("year"));
      if (saved) {
        const parsed = JSON.parse(saved);
        setGuesses(parsed.guesses);
        setGameOver(parsed.gameOver);
        setMessage(parsed.message);
      }
    }
    load();
  }, []);

  useEffect(() => {
    if (guesses.length === 0) return;
    localStorage.setItem(
      todayKey("year"),
      JSON.stringify({ guesses, gameOver, message })
    );
  }, [guesses, gameOver, message]);

  const submitGuess = useCallback(async () => {
    if (gameOver || !current.trim() || loading) return;
    setLoading(true);
    const res = await fetch("/independenciale/api/mode1-guess", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ guess: current.trim() }),
    });
    const data = await res.json();
    setLoading(false);

    if (data.error) {
      setMessage(data.error);
      return;
    }

    const newGuesses = [...guesses, data];
    setGuesses(newGuesses);
    setCurrent("");
    setMessage("");

    if (data.won) {
      setGameOver(true);
      setMessage(`Isso! Foi em ${data.revealedYear}.`);
    } else if (newGuesses.length >= MAX_GUESSES) {
      setGameOver(true);
      const revealRes = await fetch("/independenciale/api/revea?mode=year");
      const revealData = await revealRes.json();
      setMessage(`Não foi dessa vez. Foi em ${revealData.year}.`);
    }
  }, [current, guesses, gameOver, loading]);

  const handleKeyDown = (e) => {
    if (e.key === "Enter") submitGuess();
  };

  if (!country)
    return <p className="text-slate-700 font-bold animate-pulse">Carregando...</p>;

  const PROXIMITY_STYLE = {
    correct: "bg-emerald-400 text-slate-950 border-slate-950",
    "muito perto": "bg-amber-400 text-slate-950 border-slate-950",
    perto: "bg-amber-300 text-slate-950 border-slate-950",
    longe: "bg-slate-200 text-slate-800 border-slate-950",
    "muito longe": "bg-slate-300 text-slate-900 border-slate-950",
  };

  return (
    <div className="w-full flex flex-col items-center gap-4">
      <p className="text-slate-800 font-bold text-sm text-center -mt-2">
        Em que ano esse país se tornou independente?
      </p>

      {/* Card do País do Dia */}
      <div className="relative bg-amber-100 border-3 border-slate-950 rounded-2xl p-6 w-full shadow-[4px_4px_0px_0px_#000] text-center flex flex-col items-center gap-2 my-1">
        <span className="absolute -top-3.5 left-1/2 -translate-x-1/2 bg-amber-400 border-2 border-slate-950 rounded-md px-3 py-0.5 text-xs font-black text-slate-950 shadow-[1.5px_1.5px_0px_0px_#000] uppercase tracking-wider">
          País do Dia
        </span>
        <p className="text-2xl sm:text-3xl font-black text-slate-950 mt-1">{country}</p>
        
        <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-white border-2 border-slate-950 rounded-full font-bold text-xs text-slate-950 shadow-[1.5px_1.5px_0px_0px_#000]">
          <Globe2 size={14} strokeWidth={2.5} />
          {continent}
        </span>
      </div>

      {/* Legenda e Tentativas */}
      <div className="w-full flex items-center justify-between text-xs font-black text-slate-800 px-1 border-b-2 border-slate-950/20 pb-2">
        <span className="text-sm">Tentativas ({guesses.length}/{MAX_GUESSES})</span>
        <span className="uppercase text-[11px]">Dica de Proximidade</span>
      </div>

      {/* Histórico de Palpites */}
      <div className="flex flex-col gap-2.5 w-full">
        {guesses.map((g, i) => (
          <div
            key={i}
            className="flex items-center justify-between bg-white border-3 border-slate-950 rounded-2xl p-3 shadow-[3px_3px_0px_0px_#000]"
          >
            <span className="font-black text-lg text-slate-950 pl-1">{g.guessYear}</span>
            <div className="flex items-center gap-2">
              <span
                className={`px-3 py-1 rounded-xl text-xs font-black border-2 border-slate-950 shadow-[1.5px_1.5px_0px_0px_#000] ${
                  PROXIMITY_STYLE[g.proximity] ||
                  "bg-slate-200 text-slate-950"
                }`}
              >
                {g.proximity === "correct" ? "Acertou!" : g.proximity}
              </span>
              {g.direction === "antes" && (
                <ArrowDown size={20} strokeWidth={3} className="text-slate-950" />
              )}
              {g.direction === "depois" && (
                <ArrowUp size={20} strokeWidth={3} className="text-slate-950" />
              )}
              {g.direction === "correct" && (
                <Check size={20} strokeWidth={3} className="text-emerald-600" />
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Input de Envio */}
      {!gameOver && (
        <div className="flex flex-col sm:flex-row gap-2 w-full mt-2">
          <input
            type="number"
            value={current}
            onChange={(e) => setCurrent(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="EX: 1950 OU 1822"
            className="w-full sm:flex-1 bg-white border-3 border-slate-950 focus:bg-amber-100 outline-none rounded-xl px-4 py-3 text-slate-950 font-black placeholder:text-slate-400 placeholder:font-bold text-sm shadow-[3px_3px_0px_0px_#000] transition-all"
          />
          <button
            onClick={submitGuess}
            disabled={loading}
            className="inline-flex items-center justify-center gap-2 bg-amber-400 hover:bg-amber-300 disabled:opacity-50 text-slate-950 font-black text-base px-6 py-3 rounded-xl border-3 border-slate-950 shadow-[3px_3px_0px_0px_#000] hover:-translate-y-0.5 active:translate-y-0 transition-all cursor-pointer whitespace-nowrap"
          >
            <Send className="w-4 h-4" strokeWidth={2.5} />
            <span>{loading ? "..." : "Enviar"}</span>
          </button>
        </div>
      )}

      {message && (
        <div className="w-full bg-amber-200 border-3 border-slate-950 rounded-xl p-3 text-center text-slate-950 font-black text-sm sm:text-base shadow-[3px_3px_0px_0px_#000] animate-bounce mt-2">
          {message}
        </div>
      )}
    </div>
  );
}

function CountryMode() {
  const [year, setYear] = useState(null);
  const [current, setCurrent] = useState("");
  const [guesses, setGuesses] = useState([]);
  const [gameOver, setGameOver] = useState(false);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);

  useEffect(() => {
    async function load() {
      const res = await fetch("/independenciale/api/mode2-info");
      const data = await res.json();
      setYear(data.year);

      const saved = localStorage.getItem(todayKey("country"));
      if (saved) {
        const parsed = JSON.parse(saved);
        setGuesses(parsed.guesses);
        setGameOver(parsed.gameOver);
        setMessage(parsed.message);
      }
    }
    load();
  }, []);

  useEffect(() => {
    if (guesses.length === 0) return;
    localStorage.setItem(
      todayKey("country"),
      JSON.stringify({ guesses, gameOver, message })
    );
  }, [guesses, gameOver, message]);

  const filtered = current.trim()
    ? COUNTRIES_DATA.filter((c) =>
        c.country.toLowerCase().includes(current.trim().toLowerCase())
      ).slice(0, 6)
    : [];

  const submitGuess = useCallback(async () => {
    if (gameOver || !current.trim() || loading) return;
    setLoading(true);
    const res = await fetch("/independenciale/api/mode2-guess", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ guess: current.trim() }),
    });
    const data = await res.json();
    setLoading(false);

    if (data.error) {
      setMessage(data.error);
      return;
    }

    const newGuesses = [...guesses, data];
    setGuesses(newGuesses);
    setCurrent("");
    setMessage("");

    if (data.won) {
      setGameOver(true);
      setMessage(`Isso! Era ${data.revealedCountry}.`);
    } else if (newGuesses.length >= MAX_GUESSES) {
      setGameOver(true);
      const revealRes = await fetch("/independenciale/api/reveal?mode=country");
      const revealData = await revealRes.json();
      setMessage(`Não foi dessa vez. Era ${revealData.country}.`);
    }
  }, [current, guesses, gameOver, loading]);

  const handleKeyDown = (e) => {
    if (e.key === "Enter") submitGuess();
  };

  if (!year)
    return <p className="text-slate-700 font-bold animate-pulse">Carregando...</p>;

  return (
    <div className="w-full flex flex-col items-center gap-4">
      <p className="text-slate-800 font-bold text-sm text-center -mt-2">
        Que país se tornou independente nesse ano?
      </p>

      {/* Card Ano do Dia */}
      <div className="relative bg-amber-100 border-3 border-slate-950 rounded-2xl p-6 w-full shadow-[4px_4px_0px_0px_#000] text-center my-1">
        <span className="absolute -top-3.5 left-1/2 -translate-x-1/2 bg-amber-400 border-2 border-slate-950 rounded-md px-3 py-0.5 text-xs font-black text-slate-950 shadow-[1.5px_1.5px_0px_0px_#000] uppercase tracking-wider">
          Ano do Dia
        </span>
        <p className="text-3xl sm:text-4xl font-black text-slate-950 mt-1">{year}</p>
      </div>

      {/* Contador e Dicas */}
      <div className="w-full flex items-center justify-between text-xs font-black text-slate-800 px-1 border-b-2 border-slate-950/20 pb-2">
        <span className="text-sm">Tentativas ({guesses.length}/{MAX_GUESSES})</span>
        <div className="flex gap-2 text-[11px] uppercase">
          <span className="px-1.5 py-0.5 bg-white border border-slate-950 rounded">🌍 Cont.</span>
          <span className="px-1.5 py-0.5 bg-white border border-slate-950 rounded">🏳️ Colon.</span>
          <span className="px-1.5 py-0.5 bg-white border border-slate-950 rounded">👥 Pop.</span>
        </div>
      </div>

      {/* Histórico de Palpites */}
      <div className="flex flex-col gap-2.5 w-full">
        {guesses.map((g, i) => (
          <div
            key={i}
            className="flex items-center justify-between bg-white border-3 border-slate-950 rounded-2xl p-3 shadow-[3px_3px_0px_0px_#000]"
          >
            <span className="font-black text-slate-950 text-base sm:text-lg pl-1">{g.guessCountry}</span>
            {!g.won && (
              <div className="flex gap-2">
                <div
                  className={`w-9 h-9 flex items-center justify-center rounded-xl border-2 border-slate-950 font-black shadow-[1.5px_1.5px_0px_0px_#000] ${
                    g.continentMatch
                      ? "bg-emerald-400 text-slate-950"
                      : "bg-slate-200 text-slate-500"
                  }`}
                >
                  {g.continentMatch ? <Check size={20} strokeWidth={3} /> : <X size={20} strokeWidth={3} />}
                </div>
                <div
                  className={`w-9 h-9 flex items-center justify-center rounded-xl border-2 border-slate-950 font-black shadow-[1.5px_1.5px_0px_0px_#000] ${
                    g.colonizerMatch
                      ? "bg-emerald-400 text-slate-950"
                      : "bg-slate-200 text-slate-500"
                  }`}
                >
                  {g.colonizerMatch ? <Check size={20} strokeWidth={3} /> : <X size={20} strokeWidth={3} />}
                </div>
                <div className="w-9 h-9 flex items-center justify-center rounded-xl bg-amber-300 text-slate-950 border-2 border-slate-950 shadow-[1.5px_1.5px_0px_0px_#000]">
                  {g.populationHint === "higher" ? (
                    <ArrowUp size={20} strokeWidth={3} />
                  ) : (
                    <ArrowDown size={20} strokeWidth={3} />
                  )}
                </div>
              </div>
            )}
            {g.won && (
              <div className="w-9 h-9 flex items-center justify-center rounded-xl bg-emerald-400 text-slate-950 border-2 border-slate-950 shadow-[1.5px_1.5px_0px_0px_#000]">
                <Check size={20} strokeWidth={3} />
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Input de Envio com Autocomplete */}
      {!gameOver && (
        <div className="w-full relative mt-2">
          <div className="flex flex-col sm:flex-row gap-2 w-full">
            <input
              type="text"
              value={current}
              onChange={(e) => {
                setCurrent(e.target.value);
                setShowDropdown(true);
              }}
              onFocus={() => setShowDropdown(true)}
              onKeyDown={handleKeyDown}
              placeholder="DIGITE O NOME DO PAÍS..."
              className="w-full sm:flex-1 bg-white border-3 border-slate-950 focus:bg-amber-100 outline-none rounded-xl px-4 py-3 text-slate-950 font-black placeholder:text-slate-400 placeholder:font-bold text-sm uppercase shadow-[3px_3px_0px_0px_#000] transition-all"
            />
            <button
              onClick={submitGuess}
              disabled={loading}
              className="inline-flex items-center justify-center gap-2 bg-amber-400 hover:bg-amber-300 disabled:opacity-50 text-slate-950 font-black text-base px-6 py-3 rounded-xl border-3 border-slate-950 shadow-[3px_3px_0px_0px_#000] hover:-translate-y-0.5 active:translate-y-0 transition-all cursor-pointer whitespace-nowrap"
            >
              <Send className="w-4 h-4" strokeWidth={2.5} />
              <span>{loading ? "..." : "Enviar"}</span>
            </button>
          </div>

          {showDropdown && filtered.length > 0 && (
            <div className="absolute top-full left-0 right-0 mt-2 bg-white border-3 border-slate-950 rounded-xl overflow-hidden z-20 shadow-[5px_5px_0px_0px_#000]">
              {filtered.map((c) => (
                <button
                  key={c.country}
                  onClick={() => {
                    setCurrent(c.country);
                    setShowDropdown(false);
                  }}
                  className="w-full text-left px-4 py-2.5 font-black text-slate-950 text-sm hover:bg-amber-200 uppercase border-b border-slate-200 last:border-b-0 transition-colors cursor-pointer"
                >
                  {c.country}
                </button>
              ))}
            </div>
          )}
        </div>
      )}

      {message && (
        <div className="w-full bg-amber-200 border-3 border-slate-950 rounded-xl p-3 text-center text-slate-950 font-black text-sm sm:text-base shadow-[3px_3px_0px_0px_#000] animate-bounce mt-2">
          {message}
        </div>
      )}
    </div>
  );
}