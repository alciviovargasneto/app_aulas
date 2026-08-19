import { motion } from "framer-motion";
import { sfx } from "../lib/sounds";
import {
  IconArrow,
  IconCards,
  IconCrowd,
  IconMegaphone,
  IconShield,
  IconSkip,
  IconSpark,
  IconVolume,
} from "./icons";

const TICKER = [
  "BRANDING", "SEO", "CAC", "LTV", "FUNIL AIDA", "SWOT", "INBOUND", "ROI",
  "PERSONA", "GROWTH HACKING", "NEUROMARKETING", "CTR", "CONVERSÃO", "4 PS",
  "POSICIONAMENTO", "BACKLINKS", "ENGAGEMENT", "BRAND EQUITY",
];

export default function StartScreen({ onStart }: { onStart: () => void }) {
  return (
    <div className="relative z-10 mx-auto flex min-h-screen w-full max-w-6xl flex-col px-5 py-8">
      {/* topo */}
      <motion.header
        initial={{ opacity: 0, y: -18 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="flex items-center justify-between"
      >
        <div className="flex items-center gap-2 rounded-full border border-lose/60 bg-navy-900/70 px-3 py-1.5 text-[11px] font-bold uppercase tracking-[0.22em] text-lose">
          <span className="relative flex h-2 w-2">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-lose opacity-75" />
            <span className="relative inline-flex h-2 w-2 rounded-full bg-lose" />
          </span>
          Ao vivo do palco
        </div>
        <div className="flex items-center gap-2 text-[11px] font-bold uppercase tracking-[0.22em] text-iceblue/70">
          <IconMegaphone size={15} className="text-gold-400" />
          Quiz show de marketing
        </div>
      </motion.header>

      {/* corpo */}
      <main className="grid flex-1 items-center gap-10 py-8 lg:grid-cols-[1.15fr_0.85fr]">
        {/* título + CTA */}
        <div>
          <motion.p
            initial={{ opacity: 0, x: -24 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.15 }}
            className="mb-3 font-display text-xl tracking-[0.3em] text-neoncyan"
          >
            O SHOW DO CONHECIMENTO
          </motion.p>

          <motion.h1
            initial={{ opacity: 0, scale: 0.92 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.25, type: "spring", stiffness: 120, damping: 14 }}
            className="font-display leading-[0.86]"
          >
            <span className="block text-[19vw] text-white drop-shadow-[0_6px_24px_rgba(43,74,192,0.7)] sm:text-8xl lg:text-[7.5rem]">
              Marketing
            </span>
            <span className="title-3d block text-[19vw] sm:text-8xl lg:text-[7.5rem]">
              do Milhão
            </span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.45 }}
            className="mt-5 max-w-md text-lg font-medium leading-snug text-iceblue"
          >
            16 perguntas sobre marketing, 3 ajudas do auditório e{" "}
            <strong className="text-gold-300">R$ 1.000.000</strong> no topo da escada.
            Vai encarar?
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className="mt-8 flex flex-wrap items-center gap-5"
          >
            <button
              onClick={() => {
                sfx.click();
                onStart();
              }}
              className="anim-pulse-gold group flex items-center gap-3 rounded-full bg-gradient-to-b from-gold-300 to-gold-600 px-9 py-4 font-display text-3xl tracking-[0.12em] text-navy-950 transition-transform duration-200 hover:scale-105 active:scale-95"
            >
              Começar o jogo
              <IconArrow size={26} className="transition-transform group-hover:translate-x-1.5" />
            </button>
            <span className="flex items-center gap-2 text-sm font-semibold text-iceblue/70">
              <IconVolume size={18} className="text-neoncyan" />
              Ligue o som para a experiência completa
            </span>
          </motion.div>
        </div>

        {/* moeda + regras em ingressos */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.6 }}
          className="relative flex flex-col items-center gap-8"
        >
          {/* moeda do milhão */}
          <div className="relative">
            <div className="coin-shine anim-floaty relative flex h-48 w-48 items-center justify-center rounded-full border-[6px] border-gold-300 bg-[radial-gradient(circle_at_32%_28%,#ffe07a,#ffc42e_45%,#a86f00_95%)] shadow-[0_0_70px_rgba(255,196,46,0.45)] sm:h-56 sm:w-56">
              <div className="flex h-[82%] w-[82%] flex-col items-center justify-center rounded-full border-[3px] border-dashed border-navy-900/40">
                <span className="font-display text-6xl leading-none text-navy-950 sm:text-7xl">
                  R$
                </span>
                <span className="font-display mt-1 text-2xl tracking-wide text-navy-900 sm:text-3xl">
                  1.000.000
                </span>
              </div>
              <IconSpark size={20} className="anim-sparkle absolute -right-2 top-3 text-gold-200" />
              <IconSpark size={13} className="anim-sparkle absolute -left-3 bottom-8 text-gold-200" style={{ animationDelay: "0.9s" }} />
            </div>
          </div>

          {/* ingressos de regras */}
          <div className="flex w-full max-w-sm flex-col gap-3">
            <Ticket delay={0.55} rotate="-rotate-2" icon={<IconCards size={20} />} tone="text-gold-300 border-gold-500/50">
              <b>16 perguntas</b> em 4 níveis — de CTR básico a neuromarketing raiz.
            </Ticket>
            <Ticket delay={0.7} rotate="rotate-1" icon={<IconCrowd size={20} />} tone="text-neoncyan border-neoncyan/50">
              <b>3 ajudas do palco:</b> cartas, placas do auditório e 3 pulos.
            </Ticket>
            <Ticket delay={0.85} rotate="-rotate-1" icon={<IconShield size={20} />} tone="text-win border-win/50">
              <b>Errar não zera tudo:</b> marcos garantem R$ 5 mil, R$ 50 mil e R$ 500 mil.
            </Ticket>
          </div>
        </motion.div>
      </main>

      {/* ticker */}
      <motion.footer
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1 }}
        className="relative -mx-5 overflow-hidden border-y border-gold-500/25 bg-navy-900/80 py-2.5"
      >
        <div className="anim-marquee flex w-max items-center gap-8 whitespace-nowrap">
          {[...TICKER, ...TICKER].map((t, i) => (
            <span key={i} className="flex items-center gap-8 font-display text-lg tracking-[0.25em] text-iceblue/55">
              {t}
              <IconSkip size={12} className="text-gold-500/70" />
            </span>
          ))}
        </div>
      </motion.footer>
    </div>
  );
}

function Ticket({
  children,
  rotate,
  icon,
  tone,
  delay,
}: {
  children: React.ReactNode;
  rotate: string;
  icon: React.ReactNode;
  tone: string;
  delay: number;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, x: 34 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay, type: "spring", stiffness: 140, damping: 16 }}
      whileHover={{ rotate: 0, scale: 1.03 }}
      className={`flex items-center gap-3 rounded-xl border bg-navy-900/85 px-4 py-3 text-sm font-medium leading-snug text-iceblue shadow-lg backdrop-blur-sm ${rotate} ${tone}`}
    >
      <span className="shrink-0">{icon}</span>
      <span>{children}</span>
    </motion.div>
  );
}
