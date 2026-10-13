import type { DrawnAssignment } from "../lib/themes";

interface ResultListProps {
  assignments: DrawnAssignment[];
}

/**
 * Resultado do sorteio em tela cheia, formatado para projeção:
 * A = primeiro tema do ordenamento aleatório, B = segundo, ... até H.
 * Uma única coluna larga (nada de grade apertada), letras enormes e
 * nomes em peso 800 — legível da última fileira da sala.
 */
export default function ResultList({ assignments }: ResultListProps) {
  return (
    <ol className="flex flex-col gap-3 sm:gap-4">
      {assignments.map(({ letter, theme }, i) => (
        <li
          key={letter}
          className="proj-row anim-rise flex items-center gap-4 rounded-xl border-2 border-gold-400/60 bg-navy-800 px-5 py-3 sm:px-7 sm:py-4"
          style={{ animationDelay: `${i * 90}ms` }}
        >
          <span className="proj-badge text-letter grid h-[clamp(3rem,5vw,4.6rem)] w-[clamp(3rem,5vw,4.6rem)] shrink-0 place-items-center rounded-full border-[3px] border-gold-300 bg-gradient-to-b from-gold-300 to-gold-600 font-display font-black text-navy-950">
            {letter}
          </span>
          <div className="flex min-w-0 flex-col">
            <span className="proj-row-name text-item font-extrabold leading-tight text-white">
              {theme.name}
            </span>
            {/* Descrição opcional: some no modo "limpo" (tecla D) para
                reduzir poluição visual na projeção. */}
            {theme.description && (
              <span className="proj-row-desc text-note mt-1 font-medium text-iceblue">
                {theme.description}
              </span>
            )}
          </div>
        </li>
      ))}
    </ol>
  );
}
