import { motion } from "framer-motion";
import type { DrawnAssignment } from "../lib/themes";

interface ResultListProps {
  assignments: DrawnAssignment[];
}

/**
 * Resultado do sorteio: A = primeiro tema do ordenamento aleatório,
 * B = segundo, e assim sucessivamente até H.
 */
export default function ResultList({ assignments }: ResultListProps) {
  return (
    <ol className="space-y-2.5">
      {assignments.map(({ letter, theme }, i) => (
        <motion.li
          key={letter}
          initial={{ opacity: 0, x: -24 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.12 + i * 0.16, duration: 0.45, ease: "easeOut" }}
          className="group flex items-center gap-4 rounded-xl border border-gold-400/25 bg-gradient-to-r from-navy-800/80 to-navy-850/60 px-4 py-3 shadow-[inset_0_1px_0_rgba(255,255,255,0.06)]"
        >
          <span className="coin-shine relative grid h-12 w-12 shrink-0 place-items-center rounded-full border-2 border-gold-400/70 bg-gradient-to-b from-gold-300 to-gold-600 font-display text-2xl text-navy-950 shadow-[0_0_18px_rgba(255,196,46,0.35)]">
            {letter}
          </span>
          <div className="flex flex-col">
            <span className="text-base font-bold leading-tight text-white sm:text-lg">
              {theme.name}
            </span>
            <span className="text-xs leading-snug text-iceblue/70">{theme.description}</span>
          </div>
        </motion.li>
      ))}
    </ol>
  );
}
