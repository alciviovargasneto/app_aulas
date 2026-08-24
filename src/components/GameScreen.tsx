import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import Ladder from "./Ladder";
import {
  IconBulb,
  IconCards,
  IconCheck,
  IconCoin,
  IconCrowd,
  IconHand,
  IconShield,
  IconSkip,
  IconVolume,
  IconVolumeOff,
  IconX,
} from "./icons";
import { LETTERS, MILESTONES, PRIZES, QUESTIONS, brl } from "../lib/questions";
import { sfx } from "../lib/sounds";

export type EndReason = "win" | "wrong" | "stop" | "timeout";

export interface GameResult {
  reason: EndReason;
  amount: number;
  correctCount: number;
  answered: number;
  secured: number;
  missed?: { question: string; answer: string };
}

const TIME_PER_Q = 45;
const RING = 2 * Math.PI * 24;

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

export default function GameScreen({ onFinish }: { onFinish: (r: GameResult) => void }) {
  const [qIndex, setQIndex] = useState(0);
  const [stage, setStage] = useState<"answering" | "suspense" | "reveal">("answering");
  const [selected, setSelected] = useState<number | null>(null);
  const [showConfirm, setShowConfirm] = useState(false);
  const [showStop, setShowStop] = useState(false);
  const [showCards, setShowCards] = useState(false);
  const [deck, setDeck] = useState<number[]>([1, 1, 2, 2]);
  const [pickedCard, setPickedCard] = useState<number | null>(null);
  const [eliminated, setEliminated] = useState<number[]>([]);
  const [votes, setVotes] = useState<number[] | null>(null);
  const [lifelines, setLifelines] = useState({ cartas: true, univer: true, pulos: 3 });
  const [skipped, setSkipped] = useState<number[]>([]);
  const [wonValue, setWonValue] = useState(0);
  const [secured, setSecured] = useState(0);
  const [timeLeft, setTimeLeft] = useState(TIME_PER_Q);
  const [muted, setMuted] = useState(sfx.muted);

  const correctRef = useRef(0);
  const [correctCount, setCorrectCount] = useState(0);
  const finishedRef = useRef(false);
  const timers = useRef<number[]>([]);

  const q = QUESTIONS[qIndex];
  const prize = PRIZES[qIndex];

  const after = (fn: () => void, ms: number) => {
    const id = window.setTimeout(fn, ms);
    timers.current.push(id);
  };

  useEffect(() => () => timers.current.forEach((t) => window.clearTimeout(t)), []);

  const finish = (reason: EndReason, amount: number, missed?: GameResult["missed"]) => {
    if (finishedRef.current) return;
    finishedRef.current = true;
    onFinish({
      reason,
      amount,
      correctCount: correctRef.current,
      answered:
        reason === "wrong" || reason === "timeout"
          ? qIndex + 1
          : reason === "win"
            ? QUESTIONS.length
            : qIndex,
      secured,
      missed,
    });
  };

  /* ---------------- timer ---------------- */
  useEffect(() => {
    if (stage !== "answering" || showConfirm || showCards || showStop) return;
    if (timeLeft <= 0) {
      setStage("reveal");
      sfx.wrong();
      after(
        () =>
          finish("timeout", secured, {
            question: q.text,
            answer: `${LETTERS[q.correct]}: ${q.options[q.correct]}`,
          }),
        2800,
      );
      return;
    }
    const id = window.setTimeout(() => {
      setTimeLeft((t) => {
        if (t - 1 <= 5 && t - 1 > 0) sfx.tick();
        return t - 1;
      });
    }, 1000);
    return () => window.clearTimeout(id);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [stage, timeLeft, showConfirm, showCards, showStop, qIndex]);

  /* ---------------- flow ---------------- */
  const select = (i: number) => {
    if (stage !== "answering" || showConfirm || showCards || showStop) return;
    if (eliminated.includes(i)) return;
    setSelected(i);
    sfx.select();
    setShowConfirm(true);
  };

  const backOut = () => {
    setShowConfirm(false);
    setSelected(null);
    sfx.click();
  };

  const confirmAnswer = () => {
    setShowConfirm(false);
    setStage("suspense");
    let beat = 0;
    const iv = window.setInterval(() => sfx.suspenseBeat(beat++), 270);
    timers.current.push(iv);
    after(() => {
      window.clearInterval(iv);
      const isRight = selected === q.correct;
      setStage("reveal");
      if (isRight) {
        sfx.correct();
        correctRef.current += 1;
        setCorrectCount(correctRef.current);
        setWonValue(prize);
        if (MILESTONES.includes(qIndex)) setSecured(prize);
        after(() => {
          if (qIndex === QUESTIONS.length - 1) finish("win", PRIZES[PRIZES.length - 1]);
          else nextQuestion();
        }, 2700);
      } else {
        sfx.wrong();
        after(
          () =>
            finish("wrong", secured, {
              question: q.text,
              answer: `${LETTERS[q.correct]}: ${q.options[q.correct]}`,
            }),
          3100,
        );
      }
    }, 1900);
  };

  const nextQuestion = () => {
    setQIndex((i) => i + 1);
    setStage("answering");
    setSelected(null);
    setEliminated([]);
    setVotes(null);
    setTimeLeft(TIME_PER_Q);
  };

  /* ---------------- ajudas ---------------- */
  const openCards = () => {
    if (!lifelines.cartas || stage !== "answering") return;
    sfx.click();
    setDeck(shuffle([1, 1, 2, 2]));
    setPickedCard(null);
    setShowCards(true);
  };

  const pickCard = (idx: number) => {
    if (pickedCard !== null) return;
    setPickedCard(idx);
    sfx.flip();
    after(() => {
      const n = deck[idx];
      setEliminated((prev) => {
        const candidates = shuffle(
          [0, 1, 2, 3].filter((i) => i !== q.correct && !prev.includes(i)),
        );
        return [...prev, ...candidates.slice(0, Math.min(n, candidates.length))];
      });
      setLifelines((l) => ({ ...l, cartas: false }));
      setShowCards(false);
      sfx.click();
    }, 1300);
  };

  const useUniver = () => {
    if (!lifelines.univer || stage !== "answering" || votes) return;
    sfx.click();
    const v = [0, 0, 0, 0];
    v[q.correct] = 42 + Math.floor(Math.random() * 34);
    const others = [0, 1, 2, 3].filter((i) => i !== q.correct && !eliminated.includes(i));
    const rest = 100 - v[q.correct];
    const weights = others.map(() => 1 + Math.random() * 2);
    const wsum = weights.reduce((a, b) => a + b, 0);
    others.forEach((idx, k) => {
      v[idx] = Math.floor((rest * weights[k]) / wsum);
    });
    v[q.correct] += 100 - v.reduce((a, b) => a + b, 0);
    setVotes(v);
    setLifelines((l) => ({ ...l, univer: false }));
  };

  const useSkip = () => {
    if (lifelines.pulos <= 0 || stage !== "answering" || qIndex === QUESTIONS.length - 1) return;
    sfx.click();
    setLifelines((l) => ({ ...l, pulos: l.pulos - 1 }));
    setSkipped((s) => [...s, qIndex]);
    nextQuestion();
  };

  const confirmStop = () => {
    setShowStop(false);
    sfx.click();
    finish("stop", wonValue);
  };

  /* ---------------- teclado ---------------- */
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (showStop || showCards) {
        if (e.key === "Escape") {
          setShowStop(false);
          if (pickedCard === null) setShowCards(false);
        }
        return;
      }
      if (showConfirm) {
        if (e.key === "Enter") confirmAnswer();
        if (e.key === "Escape") backOut();
        return;
      }
      if (stage !== "answering") return;
      const map: Record<string, number> = { a: 0, b: 1, c: 2, d: 3, "1": 0, "2": 1, "3": 2, "4": 3 };
      const k = e.key.toLowerCase();
      if (k in map) select(map[k]);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  });

  /* ---------------- render helpers ---------------- */
  const timerTone =
    timeLeft > 15 ? "text-gold-300" : timeLeft > 7 ? "text-[#ff9f43]" : "text-lose";
  const panic = timeLeft <= 7 && stage === "answering";

  const answerClass = (i: number) => {
    const isSel = selected === i;
    const isCorrect = i === q.correct;
    if (eliminated.includes(i) && stage !== "reveal")
      return "pointer-events-none border-dashed border-iceblue/30 bg-navy-900/40 text-iceblue/30 line-through decoration-2";
    if (stage === "reveal") {
      if (isCorrect)
        return "border-win bg-gradient-to-b from-[#0e6b35] to-[#073d1d] text-white shadow-[0_0_34px_rgba(46,230,107,0.55)] scale-[1.02]";
      if (isSel)
        return "anim-shake border-lose bg-gradient-to-b from-[#7a1626] to-[#470c16] text-white shadow-[0_0_30px_rgba(255,77,94,0.5)]";
      return "border-navy-600/40 bg-navy-900/50 text-iceblue/45";
    }
    if (stage === "suspense" && isSel) return "suspense-blink border-gold-300";
    if (isSel)
      return "border-gold-300 bg-gradient-to-b from-navy-700 to-navy-800 text-gold-200 shadow-[0_0_28px_rgba(255,196,46,0.45)]";
    return "cursor-pointer border-navy-500/70 bg-gradient-to-b from-navy-800 to-navy-900 text-white hover:scale-[1.02] hover:border-gold-400/80 hover:from-navy-700 hover:to-navy-800 hover:shadow-[0_0_20px_rgba(255,196,46,0.25)]";
  };

  const badgeClass = (i: number) => {
    const isSel = selected === i;
    const isCorrect = i === q.correct;
    if (eliminated.includes(i) && stage !== "reveal") return "bg-navy-800 text-iceblue/30";
    if (stage === "reveal") {
      if (isCorrect) return "bg-win text-navy-950";
      if (isSel) return "bg-lose text-white";
      return "bg-navy-800 text-iceblue/40";
    }
    if (isSel) return "bg-gold-400 text-navy-950";
    return "bg-navy-600 text-gold-300 group-hover:bg-gold-500 group-hover:text-navy-950";
  };

  return (
    <div className="relative z-10 mx-auto flex min-h-screen w-full max-w-7xl flex-col px-4 pb-6 pt-4 sm:px-6">
      {/* ---------- topo ---------- */}
      <header className="mb-5 flex items-center justify-between gap-3">
        <div className="flex items-center gap-2.5">
          <span className="flex h-10 w-10 items-center justify-center rounded-full border-2 border-gold-400 bg-gradient-to-b from-gold-300 to-gold-600 text-navy-950 shadow-[0_0_18px_rgba(255,196,46,0.45)]">
            <IconCoin size={22} />
          </span>
          <div className="leading-none">
            <p className="font-display text-lg tracking-[0.14em] text-white">MARKETING</p>
            <p className="font-display text-lg tracking-[0.14em] text-gold-400">DO MILHÃO</p>
          </div>
        </div>

        <div className="flex items-center gap-3 sm:gap-5">
          <div className="hidden items-center gap-2 rounded-full border border-navy-500/60 bg-navy-900/70 px-4 py-1.5 md:flex">
            <span className="font-display text-lg tracking-widest text-iceblue">
              PERGUNTA <span className="text-gold-300">{qIndex + 1}</span>/16
            </span>
          </div>

          {/* timer */}
          <div className={`relative flex items-center justify-center ${panic ? "anim-panic" : ""}`}>
            <svg width="64" height="64" viewBox="0 0 64 64" className="-rotate-90">
              <circle cx="32" cy="32" r="24" fill="#081034" stroke="#14276e" strokeWidth="6" />
              <circle
                cx="32" cy="32" r="24" fill="none"
                stroke="currentColor" strokeWidth="6" strokeLinecap="round"
                className={timerTone}
                strokeDasharray={RING}
                strokeDashoffset={RING * (1 - timeLeft / TIME_PER_Q)}
                style={{ transition: "stroke-dashoffset 1s linear" }}
              />
            </svg>
            <span className={`font-display absolute text-2xl ${timerTone}`}>{timeLeft}</span>
          </div>

          <button
            onClick={() => setMuted(sfx.toggleMuted())}
            className="flex h-10 w-10 items-center justify-center rounded-full border border-navy-500/60 bg-navy-900/70 text-iceblue transition-colors hover:border-gold-400 hover:text-gold-300"
            title={muted ? "Ativar som" : "Silenciar"}
          >
            {muted ? <IconVolumeOff size={19} /> : <IconVolume size={19} />}
          </button>
        </div>
      </header>

      {/* ---------- corpo ---------- */}
      <div className="grid flex-1 gap-6 lg:grid-cols-[1fr_300px]">
        <section className="flex flex-col">
          {/* ajudas */}
          <div className="mb-4 flex flex-wrap items-center gap-2.5">
            <span className="font-display mr-1 text-base tracking-[0.2em] text-iceblue/70">
              AJUDAS
            </span>
            <HelpButton
              label="Cartas"
              icon={<IconCards size={19} />}
              used={!lifelines.cartas}
              onClick={openCards}
            />
            <HelpButton
              label="Placas"
              icon={<IconCrowd size={19} />}
              used={!lifelines.univer}
              onClick={useUniver}
            />
            <button
              onClick={useSkip}
              disabled={lifelines.pulos <= 0 || stage !== "answering" || qIndex === QUESTIONS.length - 1}
              className={`group relative flex items-center gap-2 rounded-full border px-4 py-2 font-semibold transition-all duration-200 ${
                lifelines.pulos <= 0 || stage !== "answering" || qIndex === QUESTIONS.length - 1
                  ? "cursor-not-allowed border-navy-600/40 bg-navy-900/40 text-iceblue/30"
                  : "border-neoncyan/60 bg-navy-800/80 text-neoncyan hover:scale-105 hover:shadow-[0_0_18px_rgba(63,216,255,0.3)]"
              }`}
            >
              <IconSkip size={19} />
              Pular
              <span className="ml-1 flex gap-1">
                {[0, 1, 2].map((n) => (
                  <span
                    key={n}
                    className={`h-2 w-2 rounded-full ${n < lifelines.pulos ? "bg-neoncyan" : "bg-navy-600"}`}
                  />
                ))}
              </span>
            </button>
          </div>

          {/* pergunta */}
          <motion.div
            key={`q-${qIndex}`}
            initial={{ opacity: 0, y: 26, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ type: "spring", stiffness: 160, damping: 18 }}
            className="rounded-[2.4rem] border-2 border-gold-500/70 bg-gradient-to-b from-gold-500/20 to-transparent p-[3px] shadow-[0_10px_50px_rgba(8,16,52,0.8)]"
          >
            <div className="rounded-[2.2rem] border border-navy-500/40 bg-gradient-to-b from-navy-800/95 to-navy-900/95 px-6 py-6 text-center sm:px-10">
              <p className="font-display mb-2 text-base tracking-[0.28em] text-neoncyan sm:text-lg">
                VALENDO <span className="text-gold-300">{brl(prize)}</span>
                {MILESTONES.includes(qIndex) && (
                  <span className="ml-2 inline-flex items-center gap-1 text-win">
                    <IconShield size={15} /> MARCO SEGURO
                  </span>
                )}
              </p>
              <h2 className="text-xl font-bold leading-snug text-white sm:text-2xl">
                {q.text}
              </h2>
            </div>
          </motion.div>

          {/* respostas */}
          <div className="mt-5 grid gap-3 sm:grid-cols-2 sm:gap-4">
            {q.options.map((opt, i) => (
              <motion.button
                key={`${qIndex}-${i}`}
                initial={{ opacity: 0, x: i % 2 === 0 ? -26 : 26 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.08 + i * 0.07, type: "spring", stiffness: 200, damping: 20 }}
                onClick={() => select(i)}
                className={`group relative flex items-center gap-3 rounded-full border-2 px-4 py-3 text-left text-sm font-semibold transition-all duration-200 sm:px-5 sm:text-base ${answerClass(i)}`}
              >
                <span
                  className={`font-display flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-xl transition-colors duration-200 ${badgeClass(i)}`}
                >
                  {LETTERS[i]}
                </span>
                <span className="flex-1">{opt}</span>
                {stage === "reveal" && i === q.correct && <IconCheck size={20} className="shrink-0 text-win" />}
                {stage === "reveal" && selected === i && i !== q.correct && (
                  <IconX size={20} className="shrink-0 text-lose" />
                )}
              </motion.button>
            ))}
          </div>

          {/* placas do auditório */}
          <AnimatePresence>
            {votes && (
              <motion.div
                initial={{ opacity: 0, y: 18 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                className="mt-5 rounded-2xl border border-neoncyan/40 bg-navy-900/85 p-4 sm:p-5"
              >
                <p className="font-display mb-3 flex items-center gap-2 text-lg tracking-[0.18em] text-neoncyan">
                  <IconCrowd size={19} /> O AUDITÓRIO DIZ…
                </p>
                <div className="grid grid-cols-4 items-end gap-3">
                  {votes.map((pct, i) => (
                    <div key={i} className="flex flex-col items-center gap-1.5">
                      <span className="font-display text-xl text-gold-300">{pct}%</span>
                      <div className="flex h-24 w-full items-end overflow-hidden rounded-lg bg-navy-800">
                        <motion.div
                          initial={{ height: 0 }}
                          animate={{ height: `${pct}%` }}
                          transition={{ duration: 0.9, delay: 0.15 + i * 0.1, ease: "easeOut" }}
                          className={`w-full rounded-t-md ${
                            i === q.correct && stage === "reveal"
                              ? "bg-gradient-to-t from-[#0e6b35] to-win"
                              : "bg-gradient-to-t from-navy-500 to-neoncyan"
                          }`}
                        />
                      </div>
                      <span className="font-display text-base text-iceblue">{LETTERS[i]}</span>
                    </div>
                  ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* curiosidade na revelação */}
          <AnimatePresence>
            {stage === "reveal" && (
              <motion.div
                initial={{ opacity: 0, y: 14 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.45 }}
                exit={{ opacity: 0 }}
                className={`mt-5 flex items-start gap-3 rounded-2xl border p-4 ${
                  selected === q.correct
                    ? "border-win/40 bg-[#073d1d]/40"
                    : "border-gold-500/40 bg-navy-900/80"
                }`}
              >
                <IconBulb size={22} className="mt-0.5 shrink-0 text-gold-300" />
                <p className="text-sm font-medium leading-snug text-iceblue sm:text-base">
                  {selected !== q.correct && selected !== null && (
                    <strong className="mr-1 text-lose">
                      A resposta certa era {LETTERS[q.correct]}.
                    </strong>
                  )}
                  {selected === null && (
                    <strong className="mr-1 text-lose">Tempo esgotado!</strong>
                  )}
                  <span className="text-gold-300">Sabia? </span>
                  {q.trivia}
                </p>
              </motion.div>
            )}
          </AnimatePresence>
        </section>

        {/* ---------- escada ---------- */}
        <aside className="hidden lg:block">
          <div className="sticky top-4 rounded-3xl border border-navy-500/50 bg-navy-900/70 p-4 shadow-[0_10px_40px_rgba(5,10,36,0.7)]">
            <Ladder qIndex={qIndex} skipped={skipped} />
          </div>
        </aside>
      </div>

      {/* ---------- rodapé ---------- */}
      <footer className="mt-6 flex flex-wrap items-center justify-between gap-3 rounded-full border border-navy-500/50 bg-navy-900/80 px-5 py-3">
        <div className="flex flex-wrap items-center gap-2.5">
          <span className="flex items-center gap-2 rounded-full border border-win/50 bg-navy-800/80 px-4 py-1.5">
            <IconShield size={15} className="text-win" />
            <span className="text-xs font-bold uppercase tracking-wider text-iceblue/70">Garantido</span>
            <span className="font-display text-lg text-win">{brl(secured)}</span>
          </span>
          <span className="flex items-center gap-2 rounded-full border border-gold-500/50 bg-navy-800/80 px-4 py-1.5">
            <IconCoin size={15} className="text-gold-400" />
            <span className="text-xs font-bold uppercase tracking-wider text-iceblue/70">Na mesa</span>
            <span className="font-display text-lg text-gold-300">{brl(wonValue)}</span>
          </span>
          <span className="hidden items-center gap-1.5 text-xs font-semibold text-iceblue/50 sm:flex">
            <IconCheck size={14} className="text-win" /> {correctCount} certas
          </span>
        </div>
        <button
          onClick={() => {
            if (wonValue <= 0 || stage !== "answering") return;
            sfx.click();
            setShowStop(true);
          }}
          disabled={wonValue <= 0 || stage !== "answering"}
          className={`flex items-center gap-2 rounded-full border-2 px-5 py-2 font-display text-xl tracking-[0.1em] transition-all duration-200 ${
            wonValue <= 0 || stage !== "answering"
              ? "cursor-not-allowed border-navy-600/40 text-iceblue/30"
              : "border-lose/70 bg-lose/10 text-lose hover:scale-105 hover:bg-lose/20 hover:shadow-[0_0_20px_rgba(255,77,94,0.35)]"
          }`}
        >
          <IconHand size={18} />
          PARAR E LEVAR {brl(wonValue)}
        </button>
      </footer>

      {/* ================= modais ================= */}
      <AnimatePresence>
        {showConfirm && selected !== null && (
          <Modal key="confirm">
            <p className="font-display text-center text-3xl tracking-[0.08em] text-gold-300 sm:text-4xl">
              É a sua resposta definitiva?
            </p>
            <div className="mt-5 flex items-center gap-3 rounded-full border-2 border-gold-400 bg-gradient-to-b from-navy-700 to-navy-800 px-5 py-3 shadow-[0_0_26px_rgba(255,196,46,0.35)]">
              <span className="font-display flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-gold-400 text-xl text-navy-950">
                {LETTERS[selected]}
              </span>
              <span className="font-semibold text-gold-200">{q.options[selected]}</span>
            </div>
            <div className="mt-7 flex flex-col justify-center gap-3 sm:flex-row">
              <button
                onClick={backOut}
                className="rounded-full border-2 border-iceblue/50 px-7 py-3 font-display text-xl tracking-[0.12em] text-iceblue transition-all hover:border-iceblue hover:bg-navy-800"
              >
                VOLTAR
              </button>
              <button
                onClick={confirmAnswer}
                className="anim-pulse-gold rounded-full bg-gradient-to-b from-gold-300 to-gold-600 px-9 py-3 font-display text-xl tracking-[0.12em] text-navy-950 transition-transform hover:scale-105 active:scale-95"
              >
                CONFIRMAR
              </button>
            </div>
            <p className="mt-4 text-center text-xs font-semibold text-iceblue/50">
              Enter confirma · Esc volta atrás
            </p>
          </Modal>
        )}

        {showCards && (
          <Modal key="cards">
            <p className="font-display text-center text-3xl tracking-[0.08em] text-gold-300">
              Cartas do destino
            </p>
            <p className="mt-2 text-center text-sm font-medium text-iceblue/80">
              Escolha uma carta: ela elimina <b className="text-gold-300">1 ou 2</b> respostas
              erradas desta pergunta.
            </p>
            <div className="mt-6 grid grid-cols-4 gap-3">
              {deck.map((value, i) => {
                const isPicked = pickedCard === i;
                const dimmed = pickedCard !== null && !isPicked;
                return (
                  <button
                    key={i}
                    onClick={() => pickCard(i)}
                    disabled={pickedCard !== null}
                    className={`group relative h-28 rounded-xl border-2 transition-all duration-300 ${
                      isPicked
                        ? "scale-105 border-gold-300 bg-gradient-to-b from-gold-300 to-gold-600 shadow-[0_0_30px_rgba(255,196,46,0.5)]"
                        : dimmed
                          ? "border-navy-600/40 bg-navy-900/60 opacity-30"
                          : "cursor-pointer border-gold-500/60 bg-gradient-to-b from-navy-700 to-navy-800 hover:scale-105 hover:border-gold-300 hover:shadow-[0_0_22px_rgba(255,196,46,0.35)]"
                    }`}
                  >
                    {isPicked ? (
                      <motion.span
                        initial={{ rotateY: 90, opacity: 0 }}
                        animate={{ rotateY: 0, opacity: 1 }}
                        transition={{ duration: 0.4 }}
                        className="font-display flex h-full flex-col items-center justify-center text-navy-950"
                      >
                        <span className="text-4xl leading-none">−{value}</span>
                        <span className="mt-1 text-xs tracking-[0.18em]">
                          {value === 1 ? "ERRADA" : "ERRADAS"}
                        </span>
                      </motion.span>
                    ) : (
                      <span className="font-display flex h-full items-center justify-center text-4xl text-gold-400/80 transition-colors group-hover:text-gold-300">
                        ?
                      </span>
                    )}
                  </button>
                );
              })}
            </div>
          </Modal>
        )}

        {showStop && (
          <Modal key="stop">
            <p className="font-display text-center text-3xl tracking-[0.08em] text-lose sm:text-4xl">
              Quer parar por aqui?
            </p>
            <p className="mt-3 text-center font-medium text-iceblue">
              Você sai do palco levando{" "}
              <span className="font-display text-2xl text-gold-300">{brl(wonValue)}</span>
              <br />
              <span className="text-sm text-iceblue/70">
                …mas o milhão continua ali em cima, brilhando.
              </span>
            </p>
            <div className="mt-7 flex flex-col justify-center gap-3 sm:flex-row">
              <button
                onClick={() => {
                  setShowStop(false);
                  sfx.click();
                }}
                className="rounded-full border-2 border-win/60 px-7 py-3 font-display text-xl tracking-[0.12em] text-win transition-all hover:bg-win/10"
              >
                CONTINUAR JOGANDO
              </button>
              <button
                onClick={confirmStop}
                className="rounded-full bg-gradient-to-b from-gold-300 to-gold-600 px-9 py-3 font-display text-xl tracking-[0.12em] text-navy-950 transition-transform hover:scale-105 active:scale-95"
              >
                PARAR E LEVAR
              </button>
            </div>
          </Modal>
        )}
      </AnimatePresence>
    </div>
  );
}

/* ---------------- subcomponentes ---------------- */

function Modal({ children }: { children: React.ReactNode }) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center bg-navy-950/85 p-4 backdrop-blur-sm"
    >
      <motion.div
        initial={{ scale: 0.86, y: 24 }}
        animate={{ scale: 1, y: 0 }}
        exit={{ scale: 0.9, y: 12, opacity: 0 }}
        transition={{ type: "spring", stiffness: 240, damping: 22 }}
        className="anim-rise w-full max-w-lg rounded-[1.8rem] border-2 border-gold-500/60 bg-gradient-to-b from-navy-800 to-navy-900 p-6 shadow-[0_20px_80px_rgba(3,6,22,0.9)] sm:p-8"
      >
        {children}
      </motion.div>
    </motion.div>
  );
}

function HelpButton({
  label,
  icon,
  used,
  onClick,
}: {
  label: string;
  icon: React.ReactNode;
  used: boolean;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      disabled={used}
      className={`relative flex items-center gap-2 rounded-full border px-4 py-2 font-semibold transition-all duration-200 ${
        used
          ? "cursor-not-allowed border-navy-600/40 bg-navy-900/40 text-iceblue/30"
          : "border-gold-500/60 bg-navy-800/80 text-gold-300 hover:scale-105 hover:shadow-[0_0_18px_rgba(255,196,46,0.3)]"
      }`}
    >
      {icon}
      {label}
      {used && (
        <span className="absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center rounded-full bg-lose text-white">
          <IconX size={11} />
        </span>
      )}
    </button>
  );
}
