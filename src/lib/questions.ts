export interface Question {
  text: string;
  options: [string, string, string, string];
  correct: number;
  trivia: string;
}

/** Valores do placar, da pergunta 1 à 16 (estilo Show do Milhão). */
export const PRIZES = [
  1_000, 2_000, 3_000, 4_000, 5_000, 10_000, 20_000, 30_000, 50_000, 100_000,
  150_000, 200_000, 300_000, 400_000, 500_000, 1_000_000,
];

/** Índices (0-based) das perguntas que garantem prêmio em caso de erro depois. */
export const MILESTONES = [4, 8, 14];

export const LETTERS = ["A", "B", "C", "D"] as const;

export const brl = (v: number) => "R$ " + v.toLocaleString("pt-BR");

export const QUESTIONS: Question[] = [
  {
    text: "No marketing digital, o que significa a sigla CTR?",
    options: [
      "Click-Through Rate, a taxa de cliques",
      "Customer Tracking Report",
      "Conversion Target Reach",
      "Click Time Response",
    ],
    correct: 0,
    trivia: "O CTR mede quantas pessoas clicaram num anúncio em relação a quantas o viram.",
  },
  {
    text: "Quais são os famosos “4 Ps” do marketing?",
    options: [
      "Pesquisa, Planejamento, Publicidade e Parceria",
      "Produto, Preço, Praça e Promoção",
      "Produto, Propaganda, Pessoas e Processos",
      "Preço, Performance, Público e Ponto",
    ],
    correct: 1,
    trivia: "O mix de marketing foi popularizado por Jerome McCarthy ainda nos anos 1960.",
  },
  {
    text: "Em redes sociais, o que é “engajamento”?",
    options: [
      "O número total de seguidores do perfil",
      "O valor investido em anúncios patrocinados",
      "As interações do público com o conteúdo",
      "A frequência de postagens da marca",
    ],
    correct: 2,
    trivia: "Curtidas, comentários, saves e compartilhamentos são as métricas clássicas de engajamento.",
  },
  {
    text: "Qual plataforma ficou famosa pelos vídeos curtos e pelo feed “Para Você”?",
    options: ["LinkedIn", "Pinterest", "Orkut", "TikTok"],
    correct: 3,
    trivia: "O algoritmo do TikTok entrega conteúdo por interesse — não só por quem você segue.",
  },
  {
    text: "A análise SWOT (ou FOFA) estuda…",
    options: [
      "Forças, Fraquezas, Oportunidades e Ameaças",
      "Vendas, Lucro, Custos e Impostos",
      "Segmento, Target, Orçamento e Timing",
      "Produto, Canal, Mídia e Conversão",
    ],
    correct: 0,
    trivia: "SWOT vem do inglês: Strengths, Weaknesses, Opportunities e Threats.",
  },
  {
    text: "No funil AIDA, o primeiro “A” significa…",
    options: ["Audiência", "Atenção", "Autoridade", "Aquisição"],
    correct: 1,
    trivia: "AIDA = Atenção, Interesse, Desejo e Ação: a jornada clássica do consumidor.",
  },
  {
    text: "O que significa a sigla CAC?",
    options: [
      "Canal de Atendimento ao Cliente",
      "Campanha de Alto Custo",
      "Custo de Aquisição de Cliente",
      "Ciclo de Análise de Conversão",
    ],
    correct: 2,
    trivia: "CAC = investimento total em marketing e vendas ÷ número de novos clientes.",
  },
  {
    text: "Em marketing, “persona” é…",
    options: [
      "A mascote oficial de uma marca",
      "O influenciador contratado pela empresa",
      "O cargo do gestor de redes sociais",
      "A representação semifictícia do cliente ideal",
    ],
    correct: 3,
    trivia: "A persona vai além do público-alvo: tem nome, dores, objetivos e comportamento.",
  },
  {
    text: "O LTV (Lifetime Value) mede…",
    options: [
      "O valor total que um cliente gera durante seu relacionamento com a marca",
      "O tempo médio de carregamento de um site",
      "A quantidade de leads gerados por mês",
      "O valor pago por cada clique em anúncio",
    ],
    correct: 0,
    trivia: "Regra de ouro do growth: o LTV deve ser pelo menos 3x maior que o CAC.",
  },
  {
    text: "Inbound marketing é a estratégia de…",
    options: [
      "Interromper a programação com comerciais",
      "Atrair clientes com conteúdo relevante",
      "Comprar listas de e-mail para disparo em massa",
      "Anunciar apenas em outdoors e rádio",
    ],
    correct: 1,
    trivia: "Em vez de ir atrás do cliente, o inbound faz o cliente vir até a marca.",
  },
  {
    text: "O que é “brand equity”?",
    options: [
      "O patrimônio físico da empresa",
      "O orçamento anual de publicidade",
      "O valor da marca percebido pelo consumidor",
      "A soma dos salários da equipe de marketing",
    ],
    correct: 2,
    trivia: "Marcas fortes cobram mais caro só pelo peso do nome — isso é brand equity.",
  },
  {
    text: "Em SEO, “backlinks” são…",
    options: [
      "Links quebrados dentro da sua página",
      "Atalhos de teclado para buscadores",
      "Anúncios pagos no topo da busca",
      "Links de outros sites apontando para o seu",
    ],
    correct: 3,
    trivia: "O Google entende backlinks como “votos de confiança” vindos de outros sites.",
  },
  {
    text: "A métrica que indica o percentual de visitantes que realizam a ação desejada é a…",
    options: [
      "Taxa de conversão",
      "Taxa de rejeição",
      "Taxa de abertura",
      "Taxa de churn",
    ],
    correct: 0,
    trivia: "Se 100 pessoas visitam a página e 3 compram, a taxa de conversão é de 3%.",
  },
  {
    text: "No neuromarketing, “ancoragem” é o viés em que…",
    options: [
      "As pessoas escolhem sempre a opção do meio",
      "A primeira informação recebida influencia as decisões seguintes",
      "Cores quentes geram fome imediata",
      "Preços altos afastam todo tipo de cliente",
    ],
    correct: 1,
    trivia: "É por isso que lojas exibem o item mais caro primeiro: o seguinte parece barato.",
  },
  {
    text: "Segundo Al Ries e Jack Trout, “posicionamento” é…",
    options: [
      "Escolher o ponto comercial mais movimentado",
      "Definir a posição do logotipo na embalagem",
      "Ocupar um lugar único na mente do consumidor",
      "Ordenar os produtos na gôndola do mercado",
    ],
    correct: 2,
    trivia: "O clássico “Posicionamento: A Batalha por Sua Mente” foi publicado em 1981.",
  },
  {
    text: "O Dropbox cresceu exponencialmente com um growth hacking baseado em…",
    options: [
      "Comercial no intervalo do reality show",
      "Desconto de 90% no primeiro ano",
      "Parceria exclusiva com fabricantes de PC",
      "Indicação: espaço extra para quem convidasse amigos",
    ],
    correct: 3,
    trivia: "O programa de indicação levou o Dropbox de 100 mil a 4 milhões de cadastros em 15 meses.",
  },
];
