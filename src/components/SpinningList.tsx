interface SpinningListProps {
  names: string[];
  spinning: boolean;
}

/**
 * Lista dos temas participantes antes/de durante o sorteio.
 * Formato para projeção: coluna única, texto grande, sem grade 2x1
 * (que obrigaria a inclinar a cabeça / perderia largura na tela).
 */
export default function SpinningList({ names, spinning }: SpinningListProps) {
  return (
    <ul className="flex flex-col gap-2.5 sm:gap-3">
      {names.map((name, i) => (
        <li
          key={name}
          className={`proj-row flex items-center gap-4 rounded-xl border-2 px-5 py-2.5 font-bold sm:py-3 ${
            spinning
              ? "border-neoncyan bg-navy-800 text-neoncyan"
              : "border-white/25 bg-navy-850 text-white"
          }`}
        >
          <span
            className={`text-letter grid h-[clamp(2.6rem,4vw,3.8rem)] w-[clamp(2.6rem,4vw,3.8rem)] shrink-0 place-items-center rounded-full border-2 font-display font-black ${
              spinning
                ? "border-neoncyan bg-neoncyan/20 text-neoncyan"
                : "border-iceblue/60 bg-white/10 text-iceblue"
            }`}
          >
            {i + 1}
          </span>
          <span className="text-item">{name}</span>
        </li>
      ))}
    </ul>
  );
}
