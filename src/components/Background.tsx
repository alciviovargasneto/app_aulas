import { IconChart, IconCoin, IconMegaphone, IconSpark, IconTag, IconTarget } from "./icons";

/** Fundo ambiente do programa: holofotes girando, ícones flutuando e palco pontilhado. */
export default function Background() {
  return (
    <div aria-hidden className="pointer-events-none fixed inset-0 overflow-hidden">
      {/* base em gradiente de auditório */}
      <div className="absolute inset-0 bg-[radial-gradient(120%_90%_at_50%_-10%,#1d3695_0%,#0d1c50_42%,#081034_70%,#050a24_100%)]" />

      {/* feixes de holofote */}
      <div className="absolute left-1/2 top-[-42vh] h-[130vh] w-[130vh] -translate-x-1/2 anim-beam">
        <div className="absolute inset-0 bg-[conic-gradient(from_0deg,transparent_0deg,rgba(255,210,63,0.10)_14deg,transparent_30deg,transparent_95deg,rgba(63,216,255,0.09)_112deg,transparent_132deg,transparent_200deg,rgba(255,210,63,0.08)_215deg,transparent_236deg,transparent_300deg,rgba(63,216,255,0.08)_318deg,transparent_338deg)]" />
      </div>

      {/* textura de palco */}
      <div className="absolute inset-0 stage-dots opacity-70" />

      {/* vinheta */}
      <div className="absolute inset-0 bg-[radial-gradient(90%_70%_at_50%_40%,transparent_55%,rgba(3,6,22,0.75)_100%)]" />

      {/* ícones flutuantes */}
      <Floating className="left-[6%] top-[16%] text-gold-400/50" tilt="-10deg" delay="0s" dur="8s">
        <IconMegaphone size={54} />
      </Floating>
      <Floating className="right-[8%] top-[12%] text-neoncyan/40" tilt="12deg" delay="0.8s" dur="9s">
        <IconTarget size={46} />
      </Floating>
      <Floating className="left-[12%] bottom-[18%] text-neoncyan/35" tilt="8deg" delay="1.6s" dur="10s">
        <IconChart size={50} />
      </Floating>
      <Floating className="right-[14%] bottom-[24%] text-gold-400/40" tilt="-14deg" delay="0.4s" dur="7.5s">
        <IconTag size={42} />
      </Floating>
      <Floating className="left-[46%] top-[70%] text-iceblue/30" tilt="6deg" delay="2.2s" dur="11s">
        <IconCoin size={40} />
      </Floating>
      <Floating className="left-[28%] top-[8%] text-gold-300/45" tilt="0deg" delay="3s" dur="6.5s">
        <IconSpark size={22} />
      </Floating>
      <Floating className="right-[32%] top-[58%] text-gold-300/35" tilt="18deg" delay="1.1s" dur="8.5s">
        <IconSpark size={16} />
      </Floating>
      <Floating className="left-[4%] top-[52%] text-gold-400/30" tilt="-6deg" delay="2.7s" dur="9.5s">
        <IconSpark size={14} />
      </Floating>
    </div>
  );
}

function Floating({
  children,
  className = "",
  tilt = "0deg",
  delay = "0s",
  dur = "8s",
}: {
  children: React.ReactNode;
  className?: string;
  tilt?: string;
  delay?: string;
  dur?: string;
}) {
  return (
    <div
      className={`absolute anim-floaty ${className}`}
      style={{ ["--tilt" as string]: tilt, animationDelay: delay, animationDuration: dur }}
    >
      {children}
    </div>
  );
}
