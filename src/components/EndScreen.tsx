import { useEffect } from "react";
import { motion } from "framer-motion";
import confetti from "canvas-confetti";
import type { GameResult } from "./GameScreen";
import { brl } from "../lib/questions";
import { sfx } from "../lib/sounds";
import { IconArrow, IconCheck, IconCoin, IconShield, IconTimer, IconTrophy, IconX } from "./icons";

const COPY: Record<
  GameResult["reason"],
  { kicker: string; title: string; label: string; tone: string }
> = {
  win: {
    kicker: "CHUVA DE PAPEL PICADO NO PALCO",
    title: "Você é o milionário do marketing!",
    label: "Prêmio máximo conquistado",
    tone: "text-gold-300",
  },
  wrong: {
    kicker: "A ESCADA PAROU POR AQUI",
    title: "Não foi dessa vez…",
    label: "Você garante o marco",
    tone: "text-lose",
  },
  timeout: {
    kicker: "45 SEGUNDOS NÃO FORAM SUFICIENTE",
    title: "O relógio travou você!",
    label: "Você garante o marco",
    tone: "text-[#ff9f43]",
  },
  stop: {
    kicker: "DECISÃO DE MESTRE OU MEDO?",
    title: "Você parou e levou o dinheiro",
    label: "Levou para casa",
    tone: "text-win",
  },
};

export default function EndScreen({
  result,
  onRestart,
  onHome,
}: {
  result: GameResult;
  onRestart: () => void;
  onHome: () => void;
}) {
  const c = COPY[result.reason];
  const isWin = result.reason === "win";

  useEffect(() => {
    if (isWin) {
      sfx.win();
      const colors = ["#ffd23f", "#ffc42e", "#3fd8ff", "#2ee66b", "#ffffff"];
      const burst = () =>
        confetti({
          particleCount: 90,
          spread: 85,
          startVelocity: 42,
          origin: { x: Math.random() * 0.6 + 0.2, y: 0.25 },
          colors,
        });
      const side = (angle: number, x: number) =>
        confetti({ particleCount: 60, angle, spread: 60, startVelocity: 55, origin: { x, y: 0.7 }, colors });
      const ids = [
        window.setTimeout(burst, 0),
        window.setTimeout(burst, 400),
        window.setTimeout(() => side(60, 0), 800),
        window.setTimeout(() => side(120, 1), 1000),
        window.setTimeout(burst, 1500),
        window.setTimeout(() => side(60, 0), 2200),
        window.setTimeout(() => side(120, 1), 2400),
      ];
      return () => ids.forEach(window.clearTimeout);
    }
    if (result.reason === "stop") sfx.click();
    // errado/tempo esgotado já tocam a buzina na revelação da resposta
  }, [isWin, result.reason]);

  return (
    <div className="relative z-10 mx-auto flex min-h-screen w-full max-w-3xl flex-col items-center justify-center px-5 py-10">
      <motion.div
        initial={{ opacity: 0, scale: 0.9, y: 30 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ type: "spring", stiffness: 120, damping: 15 }}
        className="w-full rounded-[2.2rem] border-2 border-gold-500/50 bg-gradient-to-b from-navy-800/95 to-navy-900/95 p-7 text-center shadow-[0_24px_90px_rgba(3,6,22,0.9)] sm:p-10"
      >
        {/* selo */}
        <motion.div
          initial={{ rotate: -18, scale: 0 }}
          animate={{ rotate: 0, scale: 1 }}
          transition={{ delay: 0.15, type: "spring", stiffness: 200, damping: 12 }}
          className={`mx-auto flex h-24 w-24 items-center justify-center rounded-full border-4 ${
            isWin
              ? "anim-pulse-gold border-gold-300 bg-gradient-to-b from-gold-300 to-gold-600 text-navy-950"
              : result.reason === "stop"
                ? "border-win/70 bg-navy-800 text-win"
                : "border-lose/70 bg-navy-800 text-lose"
          }`}
        >
          {isWin ? (
            <IconTrophy size={48} />
          ) : result.reason === "stop" ? (
            <IconCoin size={44} />
          ) : result.reason === "timeout" ? (
            <IconTimer size={44} />
          ) : (
            <IconX size={46} />
          )}
        </motion.div>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="font-display mt-5 text-base tracking-[0.3em] text-neoncyan"
        >
          {c.kicker}
        </motion.p>

        <motion.h1
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className={`font-display mt-2 text-5xl leading-[0.95] sm:text-6xl ${isWin ? "title-3d" : c.tone}`}
        >
          {c.title}
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.55 }}
          className="mt-3 text-sm font-bold uppercase tracking-[0.2em] text-iceblue/60"
        >
          {c.label}
        </motion.p>

        <motion.p
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.65, type: "spring", stiffness: 160, damping: 13 }}
          className={`font-display mt-1 text-7xl sm:text-8xl ${isWin ? "text-gold-300" : "text-white"}`}
        >
          {brl(result.amount)}
        </motion.p>

        {/* pergunta perdida */}
        {result.missed && (
          <motion.div
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8 }}
            className="mt-6 rounded-2xl border border-lose/40 bg-navy-950/60 p-4 text-left"
          >
            <p className="text-sm font-semibold text-iceblue">
              <span className="font-display mr-2 tracking-widest text-lose">A DERRADEIRA</span>
              {result.missed.question}
            </p>
            <p className="mt-2 flex items-center gap-2 text-sm font-bold text-win">
              <IconCheck size={16} />
              {result.missed.answer}
            </p>
          </motion.div>
        )}

        {/* estatísticas */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.95 }}
          className="mt-6 flex flex-wrap items-center justify-center gap-2.5"
        >
          <Stat icon={<IconCheck size={15} className="text-win" />} label="Certas" value={`${result.correctCount}/16`} />
          <Stat icon={<IconArrow size={15} className="text-neoncyan" />} label="Perguntas vistas" value={`${result.answered}`} />
          <Stat icon={<IconShield size={15} className="text-gold-400" />} label="Marco seguro" value={brl(result.secured)} />
        </motion.div>

        {/* ações */}
        <motion.div
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.1 }}
          className="mt-8 flex flex-col justify-center gap-3 sm:flex-row"
        >
          <button
            onClick={() => {
              sfx.click();
              onRestart();
            }}
            className="anim-pulse-gold flex items-center justify-center gap-2 rounded-full bg-gradient-to-b from-gold-300 to-gold-600 px-9 py-3.5 font-display text-2xl tracking-[0.12em] text-navy-950 transition-transform hover:scale-105 active:scale-95"
          >
            JOGAR DE NOVO
            <IconArrow size={22} />
          </button>
          <button
            onClick={() => {
              sfx.click();
              onHome();
            }}
            className="rounded-full border-2 border-iceblue/50 px-8 py-3.5 font-display text-2xl tracking-[0.12em] text-iceblue transition-all hover:border-iceblue hover:bg-navy-800"
          >
            TELA INICIAL
          </button>
        </motion.div>
      </motion.div>
    </div>
  );
}

function Stat({ icon, label, value }: { icon: React.ReactNode; label: string; value: string }) {
  return (
    <span className="flex items-center gap-2 rounded-full border border-navy-500/60 bg-navy-900/70 px-4 py-2">
      {icon}
      <span className="text-xs font-bold uppercase tracking-wider text-iceblue/60">{label}</span>
      <span className="font-display text-lg text-white">{value}</span>
    </span>
  );
}
