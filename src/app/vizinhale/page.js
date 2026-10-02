"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import { ArrowLeft, Check, X, Send, Sparkles } from "lucide-react";
import VizinhaleTitle from "./VizinhaleTitle";
import { VIZINHALE_DATA } from "./data";

const MAX_GUESSES = 6;

function todayKeyVizinhale() {
  const formatter = new Intl.DateTimeFormat("en-CA", {
    timeZone: "America/Sao_Paulo",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  });
  return `vizinhale-${formatter.format(new Date())}`;
}

const norm = (s) =>
  s.toUpperCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").trim();

export default function Vizinhale() {
  const [neighbors, setNeighbors] = useState(null);
  const [showDropdown, setShowDropdown] = useState(false);
  const [current, setCurrent] = useState("");
  const [guesses, setGuesses] = useState([]);
  const [gameOver, setGameOver] = useState(false);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    async function load() {
      const res = await fetch("/vizinhale/api/neighbor-info");
      const data = await res.json();
      setNeighbors(data.neighbors);

      const saved = localStorage.getItem(todayKeyVizinhale());
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
      todayKeyVizinhale(),
      JSON.stringify({ guesses, gameOver, message }),
    );
  }, [guesses, gameOver, message]);

  // vizinhos que já "acenderam" em algum palpite
  const lit = new Set(guesses.flatMap((g) => g.shared.map(norm)));

  const filtered = current.trim()
    ? VIZINHALE_DATA.filter((c) => norm(c.name).includes(norm(current))).slice(0, 6)
    : [];

  const submitGuess = useCallback(async () => {
    if (gameOver || !current.trim() || loading) return;

    if (guesses.some((g) => norm(g.guessName) === norm(current))) {
      setMessage("Você já tentou esse país.");
      return;
    }

    setLoading(true);
    const res = await fetch("/vizinhale/api/guess", {
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
    setShowDropdown(false);
    setMessage("");

    if (data.won) {
      setGameOver(true);
      setMessage(`Mandou bem! Era ${data.revealedSecret}.`);
    } else if (newGuesses.length >= MAX_GUESSES) {
      setGameOver(true);
      const revealRes = await fetch("/vizinhale/api/reveal");
      const revealData = await revealRes.json();
      setMessage(`Não foi dessa vez. Era ${revealData.secret}.`);
    }
  }, [current, guesses, gameOver, loading]);

  const handleKeyDown = (e) => {
    if (e.key === "Enter") submitGuess();
  };

  if (!neighbors) {
    return (
      <div className="min-h-screen bg-slate-900 text-slate-100 flex items-center justify-center p-4">
        <div className="bg-[#f6f0e8] border-4 border-slate-950 rounded-2xl p-6 shadow-[6px_6px_0px_0px_#000] text-slate-950 font-black flex items-center gap-3">
          <Sparkles className="animate-spin w-5 h-5 text-violet-600" />
          <span>Carregando as fronteiras do dia...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-900 text-slate-100 flex flex-col items-center justify-between p-4 sm:p-6">
      <div className="w-full max-w-2xl flex flex-col items-center gap-4">
        <div className="w-full flex items-center justify-between">
          <Link
            href="/"
            className="inline-flex items-center gap-2 px-3 py-1.5 bg-amber-400 text-slate-950 font-black text-xs uppercase tracking-wider rounded-xl border-2 border-slate-950 shadow-[3px_3px_0px_0px_#000] hover:-translate-y-0.5 hover:bg-amber-300 transition-all"
          >
            <ArrowLeft size={16} strokeWidth={2.5} />
            <span>Hub</span>
          </Link>
          <span className="px-3 py-1 bg-violet-200 text-slate-950 font-black text-xs uppercase tracking-wider rounded-xl border-2 border-slate-950 shadow-[2px_2px_0px_0px_#000]">
            Desafio de Fronteiras
          </span>
        </div>

        <div className="w-full bg-[#f6f0e8] border-4 border-slate-950 rounded-3xl p-5 sm:p-8 shadow-[8px_8px_0px_0px_rgba(15,23,42,1)] flex flex-col items-center gap-6 text-slate-950">
          <VizinhaleTitle />
          <p className="text-slate-800 font-bold text-sm text-center -mt-2">
            Que país faz fronteira com todos estes?
          </p>

          {/* Lista completa de vizinhos */}
          <div className="relative w-full bg-violet-100 border-3 border-slate-950 rounded-2xl p-5 text-center shadow-[4px_4px_0px_0px_#000] my-1">
            <span className="absolute -top-3.5 left-1/2 -translate-x-1/2 bg-violet-400 text-slate-950 border-2 border-slate-950 px-3 py-0.5 rounded-md text-xs font-black uppercase tracking-wider shadow-[1.5px_1.5px_0px_0px_#000]">
              {neighbors.length} vizinhos
            </span>
            <div className="flex flex-wrap justify-center gap-2 pt-2">
              {neighbors.map((n) => (
                <span
                  key={n}
                  className={`px-3 py-1.5 border-2 border-slate-950 rounded-xl font-black text-sm sm:text-base shadow-[2px_2px_0px_0px_#000] transition-colors ${
                    lit.has(norm(n)) ? "bg-emerald-400" : "bg-white"
                  }`}
                >
                  {n}
                </span>
              ))}
            </div>
            <p className="text-xs font-bold text-slate-700 mt-3">
              Verde = vizinho que o seu palpite também tem
            </p>
          </div>

          {guesses.length > 0 && (
            <div className="w-full flex items-center justify-between text-xs font-black text-slate-800 px-1 border-b-2 border-slate-950/20 pb-2">
              <span>
                Palpites ({guesses.length}/{MAX_GUESSES})
              </span>
              <div className="flex gap-2 text-[11px] uppercase">
                <span className="px-1.5 py-0.5 bg-white border border-slate-950 rounded">
                  🤝 Em comum
                </span>
                <span className="px-1.5 py-0.5 bg-white border border-slate-950 rounded">
                  🧭 Fronteira
                </span>
              </div>
            </div>
          )}

          <div className="w-full flex flex-col gap-2.5">
            {guesses.map((g, i) => (
              <div
                key={i}
                className="flex items-center justify-between bg-white border-3 border-slate-950 rounded-2xl p-3 shadow-[3px_3px_0px_0px_#000]"
              >
                <span className="font-black text-slate-950 text-base sm:text-lg pl-1">
                  {g.guessName}
                </span>
                <div className="flex gap-2">
                  <div
                    className="min-w-9 h-9 px-2 flex items-center justify-center rounded-xl bg-amber-300 border-2 border-slate-950 font-black text-sm shadow-[1.5px_1.5px_0px_0px_#000]"
                    title="Vizinhos em comum com a resposta"
                  >
                    {g.won ? <Check size={20} strokeWidth={3} /> : `${g.shared.length}/${neighbors.length}`}
                  </div>
                  <div
                    className={`w-9 h-9 flex items-center justify-center rounded-xl border-2 border-slate-950 font-black shadow-[1.5px_1.5px_0px_0px_#000] ${
                      g.won || g.borders
                        ? "bg-emerald-400 text-slate-950"
                        : "bg-slate-200 text-slate-500"
                    }`}
                    title="Faz fronteira com a resposta?"
                  >
                    {g.won || g.borders ? (
                      <Check size={20} strokeWidth={3} />
                    ) : (
                      <X size={20} strokeWidth={3} />
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>

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
                  className="inline-flex items-center justify-center gap-2 bg-violet-400 hover:bg-violet-300 disabled:opacity-50 text-slate-950 font-black text-base px-6 py-3 rounded-xl border-3 border-slate-950 shadow-[3px_3px_0px_0px_#000] hover:-translate-y-0.5 active:translate-y-0 transition-all cursor-pointer whitespace-nowrap"
                >
                  <Send className="w-4 h-4" strokeWidth={2.5} />
                  <span>{loading ? "..." : "Enviar"}</span>
                </button>
              </div>

              {showDropdown && filtered.length > 0 && (
                <div className="absolute top-full left-0 right-0 mt-2 bg-white border-3 border-slate-950 rounded-xl overflow-hidden z-20 shadow-[5px_5px_0px_0px_#000]">
                  {filtered.map((c) => (
                    <button
                      key={c.name}
                      onClick={() => {
                        setCurrent(c.name);
                        setShowDropdown(false);
                      }}
                      className="w-full text-left px-4 py-2.5 font-black text-slate-950 text-sm hover:bg-violet-200 uppercase border-b border-slate-200 last:border-b-0 transition-colors"
                    >
                      {c.name}
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
      </div>

      <footer className="pt-6 text-center text-slate-500 text-xs">
        Meridiano Vizinhale · Desafio Diário
      </footer>
    </div>
  );
}