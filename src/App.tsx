import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import confetti from "canvas-confetti";
import Background from "./components/Background";
import SpinningList from "./components/SpinningList";
import ResultList from "./components/ResultList";
import { drawThemes, THEMES, type DrawnAssignment } from "./lib/themes";

const SPIN_DURATION_MS = 1800;

type Phase = "idle" | "spinning" | "done";

export default function App() {
  const [phase, setPhase] = useState<Phase>("idle");
  const [assignments, setAssignments] = useState<DrawnAssignment[]>([]);
  const [drawCount, setDrawCount] = useState(0);
  const spinTimer = useRef<number | null>(null);

  useEffect(() => {
    return () => {
      if (spinTimer.current !== null) window.clearTimeout(spinTimer.current);
    };
  }, []);

  const handleDraw = () => {
    if (phase === "spinning") return;

    // Resultado já calculado no instante do clique (sorteio justo),
    // revelado após a animação de "embaralhamento".
    const result = drawThemes(THEMES);

    setPhase("spinning");
    setAssignments([]);

    spinTimer.current = window.setTimeout(() => {
      setAssignments(result);
      setDrawCount((c) => c + 1);
      setPhase("done");
      void confetti({
        particleCount: 130,
        spread: 75,
        origin: { y: 0.6 },
        colors: ["#ffd23f", "#3fd8ff", "#9fb8ff", "#2ee66b"],
        disableForReducedMotion: true,
      });
    }, SPIN_DURATION_MS);
  };

  const themeNames = THEMES.map((t) => t.name);

  return (
    <div className="relative min-h-screen font-body text-white selection:bg-gold-400 selection:text-navy-950">
      <Background />

      <main className="relative z-10 mx-auto flex min-h-screen w-full max-w-3xl flex-col items-center px-4 py-10 sm:py-14">
        {/* Cabeçalho */}
        <header className="anim-rise mb-8 text-center">
          <p className="mb-2 inline-block rounded-full border border-neoncyan/40 bg-navy-800/70 px-4 py-1 text-xs font-bold uppercase tracking-[0.25em] text-neoncyan">
            Letramento em Inteligência Artificial
          </p>
          <h1 className="title-3d font-display text-5xl leading-none tracking-wide sm:text-6xl">
            Sorteio de Temas
          </h1>
          <p className="mt-3 text-sm text-iceblue/80 sm:text-base">
            Trabalho avaliativo ·{" "}
            <span className="font-semibold text-gold-300">
              Técnicas avançadas de prompt
            </span>
          </p>
        </header>

        {/* Painel principal */}
        <section className="w-full rounded-2xl border border-white/10 bg-navy-900/70 p-5 shadow-[0_20px_60px_rgba(0,0,0,0.45)] backdrop-blur-sm sm:p-7">
          <AnimatePresence mode="wait">
            {phase !== "done" ? (
              <motion.div
                key={phase === "spinning" ? "spinning" : "idle"}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.25 }}
              >
                <h2 className="mb-4 font-display text-2xl tracking-wider text-gold-300">
                  Temas participantes ({THEMES.length})
                </h2>
                <SpinningList names={themeNames} spinning={phase === "spinning"} />
              </motion.div>
            ) : (
              <motion.div
                key="result"
                initial={{ opacity: 0, y: 14 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.35 }}
              >
                <h2 className="mb-1 font-display text-2xl tracking-wider text-gold-300">
                  Resultado do sorteio — {drawCount}º
                </h2>
                <p className="mb-4 text-xs text-iceblue/70">
                  A = primeiro tema do ordenamento aleatório, B = segundo, e assim
                  sucessivamente até H.
                </p>
                <ResultList assignments={assignments} />
              </motion.div>
            )}
          </AnimatePresence>

          {/* Botão de sorteio */}
          <div className="mt-7 flex flex-col items-center gap-3">
            <motion.button
              type="button"
              onClick={handleDraw}
              disabled={phase === "spinning"}
              whileTap={{ scale: 0.96 }}
              className={`anim-pulse-gold relative w-full max-w-md rounded-full border-2 px-8 py-4 font-display text-2xl tracking-[0.15em] transition-colors sm:text-3xl ${
                phase === "spinning"
                  ? "cursor-wait border-neoncyan/60 bg-navy-700 text-neoncyan"
                  : "border-gold-400 bg-gradient-to-b from-gold-300 to-gold-600 text-navy-950 hover:from-gold-200 hover:to-gold-500"
              }`}
            >
              {phase === "spinning"
                ? "SORTEANDO..."
                : phase === "idle"
                  ? "SORTEAR TEMAS"
                  : "SORTEAR NOVAMENTE"}
            </motion.button>
            {drawCount > 0 && phase !== "spinning" && (
              <p className="text-xs text-iceblue/60">
                Último sorteio realizado com sucesso · cada clique gera um novo
                ordenamento aleatório
              </p>
            )}
          </div>
        </section>

        <footer className="mt-8 text-center text-xs text-iceblue/50">
          Disciplina: Letramento em Inteligência Artificial · Sorteador de temas para o
          trabalho avaliativo de Técnicas avançadas de prompt
        </footer>
      </main>
    </div>
  );
}
