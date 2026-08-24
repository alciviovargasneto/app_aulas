import { MILESTONES, PRIZES, brl } from "../lib/questions";
import { IconCheck, IconShield } from "./icons";

interface Props {
  qIndex: number;
  skipped: number[];
}

/** Escada de prêmios, da pergunta 16 (topo) até a 1. */
export default function Ladder({ qIndex, skipped }: Props) {
  const rows = PRIZES.map((value, index) => ({ value, index })).reverse();

  return (
    <div className="flex flex-col gap-[3px]">
      <div className="mb-2 flex items-center justify-between px-1">
        <span className="font-display text-lg tracking-[0.18em] text-iceblue">
          ESCADA DE PRÊMIOS
        </span>
        <IconShield size={18} className="text-gold-400" />
      </div>

      <ul className="flex flex-col gap-[3px]">
        {rows.map(({ value, index }) => {
          const isCurrent = index === qIndex;
          const isMilestone = MILESTONES.includes(index);
          const isDone = index < qIndex && !skipped.includes(index);
          const isSkipped = index < qIndex && skipped.includes(index);
          const isFinal = index === PRIZES.length - 1;

          return (
            <li
              key={index}
              className={[
                "relative flex items-center justify-between rounded-full border px-3 py-[5px] transition-all duration-300",
                isCurrent
                  ? "anim-ladder-current border-gold-300 text-navy-950 scale-[1.03] shadow-[0_0_22px_rgba(255,196,46,0.5)]"
                  : isMilestone
                    ? "border-gold-600/70 bg-navy-800/80 text-gold-300"
                    : "border-navy-600/40 bg-navy-900/60 text-iceblue",
                isDone && !isCurrent ? "border-win/40 text-win/90" : "",
                isSkipped ? "border-dashed border-iceblue/30 text-iceblue/45" : "",
                isFinal && !isCurrent ? "border-gold-400/80 text-gold-300 bg-navy-800" : "",
              ].join(" ")}
            >
              <span
                className={[
                  "font-display w-7 text-base tracking-wider",
                  isCurrent ? "text-navy-900" : "opacity-75",
                ].join(" ")}
              >
                {index + 1}
              </span>

              <span
                className={[
                  "font-display text-lg tracking-wide",
                  isFinal ? "text-xl" : "",
                  isCurrent ? "text-navy-900" : "",
                ].join(" ")}
              >
                {brl(value)}
              </span>

              <span className="flex w-6 items-center justify-end">
                {isMilestone && !isDone ? (
                  <IconShield
                    size={14}
                    className={isCurrent ? "text-navy-900" : "text-gold-400"}
                  />
                ) : null}
                {isDone ? <IconCheck size={14} className="text-win" /> : null}
                {isSkipped ? (
                  <span className="text-[9px] font-bold uppercase tracking-widest text-iceblue/60">
                    pulou
                  </span>
                ) : null}
              </span>
            </li>
          );
        })}
      </ul>

      <p className="mt-3 px-1 text-[11px] leading-snug text-iceblue/60">
        <IconShield size={12} className="mr-1 inline text-gold-400" />
        Perguntas com escudo garantem o valor mesmo se você errar depois.
      </p>
    </div>
  );
}
