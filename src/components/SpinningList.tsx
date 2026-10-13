import { AnimatePresence, motion } from "framer-motion";
import { shuffle } from "../lib/themes";

interface SpinningListProps {
  names: string[];
  spinning: boolean;
}

/**
 * Lista que "gira" durante o sorteio: os nomes trocam de posição em
 * intervalos curtos enquanto `spinning` for true, simulando um sorteio
 * ao vivo antes do resultado final.
 */
export default function SpinningList({ names, spinning }: SpinningListProps) {
  return (
    <ul className="grid gap-2 sm:grid-cols-2">
      <AnimatePresence mode="popLayout">
        {(spinning ? shuffle(names) : names).map((name, i) => (
          <motion.li
            key={name}
            layout
            initial={{ opacity: 0, y: 10, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.96 }}
            transition={{ duration: 0.18 }}
            className={`flex items-center gap-3 rounded-xl border px-4 py-3 text-sm font-semibold ${
              spinning
                ? "border-neoncyan/40 bg-navy-800/70 text-neoncyan"
                : "border-white/10 bg-white/[0.04] text-slate-200"
            }`}
          >
            <span
              className={`grid h-7 w-7 shrink-0 place-items-center rounded-full font-display text-base ${
                spinning ? "bg-neoncyan/20 text-neoncyan" : "bg-white/10 text-iceblue"
              }`}
            >
              {i + 1}
            </span>
            <span>{name}</span>
          </motion.li>
        ))}
      </AnimatePresence>
    </ul>
  );
}
