export interface Theme {
  id: string;
  name: string;
  short: string;
  description: string;
}

/**
 * Temas sorteados para o trabalho avaliativo da disciplina
 * "Letramento em Inteligência Artificial" —
 * Técnicas avançadas de prompt.
 */
export const THEMES: Theme[] = [
  {
    id: "cot",
    name: "Chain-of-Thought (CoT)",
    short: "CoT",
    description:
      "Guiar o modelo a raciocinar passo a passo antes de entregar a resposta final.",
  },
  {
    id: "stepback",
    name: "Step-Back Prompting",
    short: "Step-Back",
    description:
      "Pedir primeiro um princípio/conceito geral e só depois aplicar ao problema específico.",
  },
  {
    id: "vs",
    name: "Verbalized Sampling (VS)",
    short: "VS",
    description:
      "Solicitar que o modelo verbalize múltiplas respostas candidatas e suas probabilidades.",
  },
  {
    id: "analogical",
    name: "Analogical Prompting",
    short: "Analógico",
    description:
      "Usar exemplos/analogias geradas pelo próprio modelo para estruturar a solução.",
  },
  {
    id: "dsp",
    name: "Directional Stimulus Prompting (DSP)",
    short: "DSP",
    description:
      "Fornecer um 'estímulo' direcional (dica-chave) que conduz a saída desejada.",
  },
  {
    id: "sot",
    name: "Skeleton-of-Thought (SoT)",
    short: "SoT",
    description:
      "Gerar primeiro um esqueleto/resumo da resposta e expandir os pontos em paralelo.",
  },
  {
    id: "reflexion",
    name: "Reflexion-Self-Refine",
    short: "Reflexion",
    description:
      "O modelo reflete sobre a própria resposta e a refina em iterativas autocríticas.",
  },
  {
    id: "react",
    name: "ReAct (Reasoning + Acting)",
    short: "ReAct",
    description:
      "Intercalar raciocínio, ações (ferramentas) e observações em um loop iterativo.",
  },
];

const LETTERS = ["A", "B", "C", "D", "E", "F", "G", "H"];

export interface DrawnAssignment {
  letter: string;
  theme: Theme;
}

/** Fisher–Yates shuffle (não destrutivo). */
export function shuffle<T>(input: readonly T[]): T[] {
  const arr = [...input];
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

/**
 * Realiza o sorteio: embaralha os temas e atribui as letras A..H na ordem
 * resultante (A = primeiro tema do ordenamento aleatório, B = segundo, ...).
 */
export function drawThemes(themes: readonly Theme[] = THEMES): DrawnAssignment[] {
  const shuffled = shuffle(themes);
  return shuffled.map((theme, index) => ({
    letter: LETTERS[index] ?? String(index + 1),
    theme,
  }));
}
