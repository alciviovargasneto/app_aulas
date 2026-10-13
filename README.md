# Sorteio de Temas — Letramento em IA (interface para projeção)

Sorteio dos 8 temas do trabalho avaliativo de "Técnicas avançadas de prompt"
(disciplina: Letramento em Inteligência Artificial). Ao pressionar o botão,
a lista é ordenada aleatoriamente e exibida como A = 1º tema, B = 2º, ... H = 8º.

## Otimizações para retroprojetor / projetor

- Tipografia fluida gigante (`clamp()` com vw): legível da última fileira.
- Fundo quase preto sólido + texto branco/dourado de altíssimo contraste
  (projetores perdem contraste; sem brilhos, feixes, vinheta ou glows).
- Fonte do título com fallback local (Arial Black) — funciona sem internet.
- Animações lentas e discretas (sem flicker/ghosting na projeção).
- **Modo claro (tecla L)**: fundo branco + texto preto para projetores fracos
  ou salas iluminadas.
- **Ocultar descrições (tecla D)**: mostra só letras A–H e nomes dos temas.
- **Tela cheia (tecla F)** e **Enter/Espaço** para acionar o sorteio.
- Uma coluna única larga no lugar de grades compactas.

## Scripts

```bash
npm run dev      # desenvolvimento
npm run build    # build de produção
npm run typecheck
```
