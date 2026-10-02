import Link from "next/link";
import { Globe, Sparkles, Flag, BookOpen, Clock, Save, UserX } from "lucide-react";
import { GAMES_INFO } from "../gamesInfo";

const HOW_IT_WORKS = [
  {
    icon: Clock,
    title: "Um desafio por dia",
    text: "Todo jogo muda à meia-noite, no horário de Brasília.",
  },
  {
    icon: Save,
    title: "Progresso no navegador",
    text: "Seu andamento fica salvo só no seu aparelho, sem banco de dados.",
  },
  {
    icon: UserX,
    title: "Sem cadastro",
    text: "Abriu, jogou. De graça e sem login.",
  },
];

export default function Sobre() {
  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col items-center justify-between p-4 sm:p-8">
      <div className="w-full max-w-2xl my-auto bg-[#f6f0e8] border-4 border-slate-950 rounded-3xl p-6 sm:p-10 shadow-[8px_8px_0px_0px_rgba(15,23,42,1)] space-y-8 text-slate-950">
        <div className="space-y-3">
          <span className="inline-flex items-center gap-2 px-3 py-1 bg-amber-400 text-slate-950 font-black text-xs tracking-wider uppercase rounded-md border-2 border-slate-950 shadow-[2px_2px_0px_0px_#000]">
            <Globe className="w-3.5 h-3.5" strokeWidth={2.5} />
            Jogos Diários
          </span>
          <h1
            className="text-4xl sm:text-5xl font-black tracking-tight text-slate-950"
            style={{ fontFamily: "var(--font-title)" }}
          >
            Sobre o Meridiano
          </h1>
        </div>

        <p className="text-slate-900 text-base sm:text-lg font-semibold leading-relaxed">
          O{" "}
          <strong className="text-slate-950 bg-amber-300 px-1.5 py-0.5 rounded border border-slate-950">
            Meridiano
          </strong>{" "}
          é um conjunto de jogos diários sobre geografia, idiomas e história.
          Cada jogo é rápido, leva só alguns minutos, e traz um desafio novo
          todo dia.
        </p>

        {/* Jogos */}
        <div className="space-y-3">
          <h2 className="font-black text-xl">Os jogos</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {GAMES_INFO.map((g) => {
              const Icon = g.icon;
              return (
                <Link
                  key={g.slug}
                  href={`/${g.slug}`}
                  className={`flex items-center gap-3 p-3 rounded-2xl border-3 border-slate-950 shadow-[3px_3px_0px_0px_#0f172a] hover:-translate-y-1 transition-all ${g.cardBg}`}
                >
                  <div
                    className={`p-2 rounded-xl border-2 border-slate-950 text-slate-950 shadow-[1.5px_1.5px_0px_0px_#000] shrink-0 ${g.badgeBg}`}
                  >
                    <Icon className="w-6 h-6" strokeWidth={2.5} />
                  </div>
                  <div className="min-w-0">
                    <p className="font-black text-slate-950 leading-tight">{g.name}</p>
                    <p className="text-xs font-semibold text-slate-800 leading-snug">
                      {g.summary}
                    </p>
                  </div>
                </Link>
              );
            })}
          </div>
        </div>

        {/* Como funciona */}
        <div className="space-y-3">
          <h2 className="font-black text-xl">Como funciona</h2>
          <ul className="space-y-2.5">
            {HOW_IT_WORKS.map(({ icon: Icon, title, text }) => (
              <li
                key={title}
                className="flex items-start gap-3 bg-white border-2 border-slate-950 rounded-2xl p-3 shadow-[2px_2px_0px_0px_#000]"
              >
                <Icon className="w-5 h-5 mt-0.5 shrink-0" strokeWidth={2.5} />
                <div>
                  <p className="font-black text-sm">{title}</p>
                  <p className="text-xs sm:text-sm font-semibold text-slate-700">{text}</p>
                </div>
              </li>
            ))}
          </ul>
        </div>

        <hr className="border-2 border-slate-950/20" />

        <div className="flex flex-col sm:flex-row gap-3">
          <Link
            href="/como-jogar"
            className="inline-flex items-center justify-center gap-2 bg-amber-300 hover:bg-amber-200 text-slate-950 font-black text-sm px-4 py-2.5 rounded-xl border-2 border-slate-950 shadow-[2px_2px_0px_0px_#000] active:translate-y-0.5 transition-all"
          >
            <BookOpen className="w-4 h-4" strokeWidth={2.5} />
            Como jogar
          </Link>
          <Link
            href="/creditos"
            className="inline-flex items-center justify-center gap-2 bg-sky-300 hover:bg-sky-200 text-slate-950 font-black text-sm px-4 py-2.5 rounded-xl border-2 border-slate-950 shadow-[2px_2px_0px_0px_#000] active:translate-y-0.5 transition-all"
          >
            <Flag className="w-4 h-4" strokeWidth={2.5} />
            Créditos das bandeiras
          </Link>
        </div>

        <hr className="border-2 border-slate-950/20" />

        <div className="flex items-center gap-3 p-4 rounded-2xl bg-amber-200 border-3 border-slate-950 text-slate-950 font-bold text-sm shadow-[3px_3px_0px_0px_#0f172a]">
          <Sparkles className="w-5 h-5 text-slate-950 shrink-0" strokeWidth={2.5} />
          <p>Feito por curiosidade e paixão por mapas, línguas e histórias do mundo.</p>
        </div>
      </div>

      <footer className="w-full max-w-2xl pt-6 text-center text-slate-400 text-xs sm:text-sm">
        <p className="text-slate-500 font-medium">Meridiano · {new Date().getFullYear()}</p>
      </footer>
    </div>
  );
}