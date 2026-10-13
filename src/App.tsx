import { useCallback, useEffect, useRef, useState } from "react";
import confetti from "canvas-confetti";
import Background from "./components/Background";
import SpinningList from "./components/SpinningList";
import ResultList from "./components/ResultList";
import { drawThemes, shuffle, THEMES, type DrawnAssignment } from "./lib/themes";

const SPIN_DURATION_MS = 1500;
const SPIN_TICK_MS = 260; // troca de posições lenta: movimento rápido "fantasma" no projetor

type Phase = "idle" | "spinning" | "done";

export default function App() {
  const [phase, setPhase] = useState<Phase>("idle");
  const [assignments, setAssignments] = useState<DrawnAssignment[]>([]);
  const [previewNames, setPreviewNames] = useState<string[]>(() =>
    THEMES.map((t) => t.name),
  );
  const [drawCount, setDrawCount] = useState(0);
  const [lightMode, setLightMode] = useState(false);
  const [showDesc, setShowDesc] = useState(true);
  const spinTimer = useRef<number | null>(null);
  const tickTimer = useRef<number | null>(null);

  /* aplica modo claro no <html> (CSS global proj-safe) */
  useEffect(() => {
    document.documentElement.classList.toggle("mode-light", lightMode);
  }, [lightMode]);

  const clearTimers = () => {
    if (spinTimer.current !== null) window.clearTimeout(spinTimer.current);
    if (tickTimer.current !== null) window.clearInterval(tickTimer.current);
    spinTimer.current = null;
    tickTimer.current = null;
  };

  useEffect(() => clearTimers, []);

  const handleDraw = useCallback(() => {
    if (phase === "spinning") return;

    // Resultado calculado no instante do clique (sorteio justo),
    // revelado após a animação discreta de "embaralhamento".
    const result = drawThemes(THEMES);

    setPhase("spinning");
    setAssignments([]);

    tickTimer.current = window.setInterval(() => {
      setPreviewNames(shuffle(THEMES).map((t) => t.name));
    }, SPIN_TICK_MS);

    spinTimer.current = window.setTimeout(() => {
      clearTimers();
      setAssignments(result);
      setDrawCount((c) => c + 1);
      setPhase("done");
      void confetti({
        particleCount: 90,
        spread: 70,
        origin: { y: 0.55 },
        colors: ["#ffd23f", "#5ee1ff", "#cfe0ff", "#2ee66b"],
        disableForReducedMotion: true,
      });
    }, SPIN_DURATION_MS);
  }, [phase]);

  /* atalhos para uso em sala: Enter/Espaço sorteia, L alterna modo claro,
     D mostra/esconde descrições, F tela cheia */
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const tag = (e.target as HTMLElement | null)?.tagName;
      if (tag === "INPUT" || tag === "TEXTAREA") return;

      if ((e.key === "Enter" || e.key === " ") && tag !== "BUTTON") {
        e.preventDefault();
        handleDraw();
      } else if (e.key.toLowerCase() === "l") {
        setLightMode((v) => !v);
      } else if (e.key.toLowerCase() === "d") {
        setShowDesc((v) => !v);
      } else if (e.key.toLowerCase() === "f") {
        if (document.fullscreenElement) void document.exitFullscreen();
        else void document.documentElement.requestFullscreen();
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [handleDraw]);

  return (
    <div className="relative min-h-screen font-body text-white selection:bg-gold-400 selection:text-navy-950">
      <Background />

      <main className="relative z-10 mx-auto flex min-h-screen w-full max-w-[1500px] flex-col items-center px-6 py-6 sm:py-8">
        {/* Cabeçalho compacto — o protagonismo é da lista */}
        <header className="anim-rise mb-5 text-center sm:mb-7">
          <p className="proj-chip mb-3 inline-block rounded-full border-2 border-neoncyan bg-navy-800 px-6 py-1.5 text-note font-bold uppercase tracking-[0.18em] text-neoncyan">
            Letramento em Inteligência Artificial
          </p>
          <h1 className="proj-title title-proj font-display text-hero uppercase leading-none">
            Sorteio de Temas
          </h1>
          <p className="text-sub proj-muted mt-3 font-semibold text-iceblue">
            Trabalho avaliativo ·{" "}
            <span className="proj-accent font-extrabold text-gold-300">
              Técnicas avançadas de prompt
            </span>
          </p>
        </header>

        {/* Painel principal */}
        <section className="proj-card w-full flex-1 rounded-2xl border-2 border-white/20 bg-navy-900/85 p-5 shadow-[0_20px_60px_rgba(0,0,0,0.6)] sm:p-8">
          {phase !== "done" ? (
            <>
              <h2 className="proj-title text-sub font-display mb-4 uppercase tracking-wider text-gold-300 sm:mb-5">
                Temas participantes ({THEMES.length})
              </h2>
              <SpinningList
                names={previewNames}
                spinning={phase === "spinning"}
              />
            </>
          ) : (
            <>
              <h2 className="proj-title text-sub font-display mb-1 uppercase tracking-wider text-gold-300">
                Resultado do sorteio{drawCount > 1 ? ` — ${drawCount}º sorteio` : ""}
              </h2>
              <p className="text-note proj-muted mb-4 font-medium text-iceblue">
                A = primeiro tema do ordenamento aleatório · B = segundo · assim
                sucessivamente até H.
              </p>
              <ResultList
                assignments={
                  showDesc
                    ? assignments
                    : assignments.map((a) => ({ ...a, theme: { ...a.theme, description: "" } }))
                }
              />
            </>
          )}

          {/* Botão de sorteio — grande e centralizado na base do painel */}
          <div className="mt-6 flex flex-col items-center gap-3 sm:mt-8">
            <button
              type="button"
              onClick={handleDraw}
              disabled={phase === "spinning"}
              className={`proj-btn anim-pulse-soft w-full max-w-2xl rounded-full border-4 px-10 py-4 font-display uppercase tracking-[0.12em] transition-colors sm:py-5 ${
                phase === "spinning"
                  ? "cursor-wait border-neoncyan bg-navy-700 text-neoncyan"
                  : "border-gold-300 bg-gradient-to-b from-gold-300 to-gold-600 text-navy-950 hover:from-gold-200 hover:to-gold-500"
              }`}
            >
              <span className="text-button font-black">
                {phase === "spinning"
                  ? "SORTEANDO…"
                  : phase === "idle"
                    ? "SORTEAR TEMAS"
                    : "SORTEAR NOVAMENTE"}
              </span>
            </button>
          </div>
        </section>

        {/* Rodapé com controles de projeção */}
        <footer className="mt-5 flex w-full flex-wrap items-center justify-between gap-3">
          <p className="text-note proj-muted font-medium text-iceblue/90">
            Enter/Espaço = sortear · F = tela cheia · teclas abaixo ajustam a projeção
          </p>
          <div className="flex gap-3">
            <button
              type="button"
              onClick={() => setLightMode((v) => !v)}
              className="proj-chip rounded-lg border-2 border-iceblue/60 bg-navy-800 px-5 py-2 text-note font-bold text-iceblue hover:border-gold-400 hover:text-gold-300"
              title="Fundo branco com texto preto — ideal para projetores fracos ou salas claras (tecla L)"
            >
              {lightMode ? "🌑 Modo escuro (L)" : "☀️ Modo claro (L)"}
            </button>
            <button
              type="button"
              onClick={() => setShowDesc((v) => !v)}
              className="proj-chip rounded-lg border-2 border-iceblue/60 bg-navy-800 px-5 py-2 text-note font-bold text-iceblue hover:border-gold-400 hover:text-gold-300"
              title="Mostra apenas as letras e os nomes dos temas — menos texto na tela (tecla D)"
            >
              {showDesc ? "🧹 Ocultar descrições (D)" : "📄 Mostrar descrições (D)"}
            </button>
            <button
              type="button"
              onClick={() => {
                if (document.fullscreenElement) void document.exitFullscreen();
                else void document.documentElement.requestFullscreen();
              }}
              className="proj-chip rounded-lg border-2 border-iceblue/60 bg-navy-800 px-5 py-2 text-note font-bold text-iceblue hover:border-gold-400 hover:text-gold-300"
              title="Tela cheia (tecla F)"
            >
              ⛶ Tela cheia (F)
            </button>
          </div>
        </footer>
      </main>
    </div>
  );
}
