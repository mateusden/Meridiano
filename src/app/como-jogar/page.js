import Link from "next/link";
import { ArrowLeft, ArrowUpRight } from "lucide-react";
import { GAMES_INFO } from "../gamesInfo";

export const metadata = {
  title: "Como jogar · Meridiano",
};

export default function ComoJogar() {
  return (
    <div className="min-h-screen bg-slate-950 text-slate-950 p-4 sm:p-8 flex justify-center items-start">
      <div className="w-full max-w-2xl bg-[#f6f0e8] border-4 border-slate-950 rounded-3xl p-5 sm:p-8 shadow-[6px_6px_0px_0px_#000] my-4">
        <Link
          href="/sobre"
          className="bg-amber-400 hover:bg-amber-300 text-slate-950 font-black text-sm border-2 border-slate-950 rounded-xl px-4 py-2 shadow-[2px_2px_0px_0px_#000] active:translate-y-0.5 transition-all inline-flex items-center gap-2 mb-6"
        >
          <ArrowLeft size={18} strokeWidth={3} /> Voltar
        </Link>

        <h1
          className="text-3xl sm:text-4xl font-black mb-3 tracking-tight"
          style={{ fontFamily: "var(--font-title)" }}
        >
          Como jogar
        </h1>
        <p className="text-slate-800 font-medium mb-6 leading-relaxed text-sm sm:text-base">
          Todos os jogos têm 6 tentativas e um desafio novo por dia. Aqui está o
          que cada pista significa.
        </p>

        {/* Índice rápido */}
        <div className="flex flex-wrap gap-2 mb-8">
          {GAMES_INFO.map((g) => (
            <a
              key={g.slug}
              href={`#${g.slug}`}
              className={`px-3 py-1 rounded-lg border-2 border-slate-950 text-xs font-black shadow-[1.5px_1.5px_0px_0px_#000] ${g.badgeBg}`}
            >
              {g.name}
            </a>
          ))}
        </div>

        <div className="space-y-6">
          {GAMES_INFO.map((g) => {
            const Icon = g.icon;
            return (
              <section
                key={g.slug}
                id={g.slug}
                className="scroll-mt-24 bg-white border-3 border-slate-950 rounded-2xl p-4 sm:p-5 shadow-[4px_4px_0px_0px_#000]"
              >
                <div className="flex items-center gap-3 mb-3">
                  <div
                    className={`p-2 rounded-xl border-2 border-slate-950 shadow-[1.5px_1.5px_0px_0px_#000] ${g.badgeBg}`}
                  >
                    <Icon className="w-6 h-6" strokeWidth={2.5} />
                  </div>
                  <div>
                    <h2 className="font-black text-xl leading-tight">{g.name}</h2>
                    <p className="text-xs font-bold text-slate-600">{g.summary}</p>
                  </div>
                </div>

                <ol className="list-decimal list-inside space-y-1.5 text-sm font-semibold text-slate-800 mb-4">
                  {g.rules.map((r, i) => (
                    <li key={i}>{r}</li>
                  ))}
                </ol>

                <div className="space-y-2">
                  {g.legend.map((l, i) => (
                    <div key={i} className="flex items-center gap-2.5">
                      <span
                        className={`w-5 h-5 rounded-md border-2 border-slate-950 shrink-0 ${l.color}`}
                      />
                      <span className="text-xs sm:text-sm font-bold text-slate-800">
                        {l.text}
                      </span>
                    </div>
                  ))}
                </div>

                <Link
                  href={`/${g.slug}`}
                  className="mt-4 inline-flex items-center gap-1.5 bg-slate-950 text-white font-bold text-xs px-4 py-2 rounded-xl border-2 border-slate-950 hover:bg-slate-800 transition-colors"
                >
                  Jogar {g.name} <ArrowUpRight size={14} />
                </Link>
              </section>
            );
          })}
        </div>
      </div>
    </div>
  );
}