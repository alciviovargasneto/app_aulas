/**
 * Fundo otimizado para retroprojetor/projetor:
 * - fundo QUASE PRETO e sólido: projetores têm pouco contraste nativo,
 *   então quanto mais escuro o fundo, mais "acesas" as cores aparecem na tela;
 * - sem brilhos animados, feixes de luz, gradientes fortes ou vinheta —
 *   esses efeitos viram "chuva" e borram o texto projetado;
 * - apenas um grid discreto para dar profundidade sem poluir a leitura.
 */
export default function Background() {
  return (
    <div aria-hidden className="pointer-events-none fixed inset-0 overflow-hidden bg-[#02040c]">
      {/* Grid sutil (linhas finas, baixíssimo contraste) */}
      <div
        className="absolute inset-0 opacity-[0.14]"
        style={{
          backgroundImage:
            "linear-gradient(to right, rgba(159,184,255,0.35) 1px, transparent 1px), linear-gradient(to bottom, rgba(159,184,255,0.35) 1px, transparent 1px)",
          backgroundSize: "72px 72px",
        }}
      />
    </div>
  );
}
