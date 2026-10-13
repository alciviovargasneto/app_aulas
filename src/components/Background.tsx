const FLOATING_GLYPHS = [
  { text: "prompt", top: "12%", left: "6%", delay: "0s", tilt: "-8deg", size: "text-lg" },
  { text: "tokens", top: "72%", left: "9%", delay: "1.4s", tilt: "5deg", size: "text-base" },
  { text: "CoT", top: "22%", left: "86%", delay: "0.7s", tilt: "7deg", size: "text-xl" },
  { text: "AI", top: "82%", left: "82%", delay: "2.1s", tilt: "-4deg", size: "text-lg" },
  { text: "ReAct", top: "48%", left: "92%", delay: "1.1s", tilt: "3deg", size: "text-sm" },
  { text: "zero-shot", top: "88%", left: "38%", delay: "0.4s", tilt: "-6deg", size: "text-sm" },
  { text: "SoT", top: "8%", left: "44%", delay: "1.8s", tilt: "4deg", size: "text-base" },
  { text: "LLM", top: "34%", left: "2%", delay: "2.6s", tilt: "-3deg", size: "text-lg" },
];

export default function Background() {
  return (
    <div aria-hidden className="pointer-events-none fixed inset-0 overflow-hidden">
      {/* Base gradient */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,#0a1540_0%,#081034_45%,#050a24_100%)]" />

      {/* Rotating light beams */}
      <div className="anim-beam absolute left-1/2 top-[-60%] h-[160%] w-[160%] -translate-x-1/2 opacity-40">
        <div className="h-full w-full [background:conic-gradient(from_0deg,transparent_0deg,rgba(43,74,192,0.28)_20deg,transparent_55deg,transparent_120deg,rgba(255,196,46,0.16)_150deg,transparent_190deg,transparent_300deg,rgba(63,216,255,0.18)_330deg,transparent_360deg)]" />
      </div>

      {/* Dot grid */}
      <div className="stage-dots absolute inset-0 opacity-60" />

      {/* Glowing orbs */}
      <div className="absolute -left-24 top-1/3 h-72 w-72 rounded-full bg-navy-500/30 blur-3xl" />
      <div className="absolute -right-24 bottom-10 h-80 w-80 rounded-full bg-gold-500/10 blur-3xl" />

      {/* Floating AI-themed glyphs */}
      {FLOATING_GLYPHS.map((g, i) => (
        <span
          key={i}
          className={`anim-floaty absolute font-display tracking-widest text-iceblue/15 ${g.size}`}
          style={{
            top: g.top,
            left: g.left,
            animationDelay: g.delay,
            ["--tilt" as never]: g.tilt,
          }}
        >
          {g.text}
        </span>
      ))}

      {/* Vignette */}
      <div className="absolute inset-0 [background:radial-gradient(ellipse_at_center,transparent_55%,rgba(5,10,36,0.85)_100%)]" />
    </div>
  );
}
