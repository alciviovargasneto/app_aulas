/** Pequeno sintetizador WebAudio para dar clima de programa de auditório. */

let ctx: AudioContext | null = null;
let muted = false;

function ac(): AudioContext | null {
  if (typeof window === "undefined") return null;
  try {
    if (!ctx) {
      const Ctor =
        window.AudioContext ||
        (window as unknown as { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
      if (!Ctor) return null;
      ctx = new Ctor();
    }
    if (ctx.state === "suspended") void ctx.resume();
    return ctx;
  } catch {
    return null;
  }
}

function tone(
  freq: number,
  dur: number,
  opts: {
    type?: OscillatorType;
    vol?: number;
    delay?: number;
    slideTo?: number;
  } = {},
) {
  if (muted) return;
  const c = ac();
  if (!c) return;
  const { type = "sine", vol = 0.16, delay = 0, slideTo } = opts;
  const t0 = c.currentTime + delay;
  const osc = c.createOscillator();
  const gain = c.createGain();
  osc.type = type;
  osc.frequency.setValueAtTime(freq, t0);
  if (slideTo) osc.frequency.exponentialRampToValueAtTime(Math.max(30, slideTo), t0 + dur);
  gain.gain.setValueAtTime(0.0001, t0);
  gain.gain.exponentialRampToValueAtTime(vol, t0 + 0.015);
  gain.gain.exponentialRampToValueAtTime(0.0001, t0 + dur);
  osc.connect(gain).connect(c.destination);
  osc.start(t0);
  osc.stop(t0 + dur + 0.05);
}

export const sfx = {
  get muted() {
    return muted;
  },
  toggleMuted() {
    muted = !muted;
    return muted;
  },
  /** clique curto de interface */
  click() {
    tone(640, 0.07, { type: "triangle", vol: 0.1 });
  },
  /** resposta selecionada */
  select() {
    tone(480, 0.09, { type: "triangle", vol: 0.14 });
    tone(720, 0.12, { type: "triangle", vol: 0.12, delay: 0.07 });
  },
  /** batidas de suspense antes da revelação */
  suspenseBeat(i: number) {
    tone(i % 2 === 0 ? 220 : 277, 0.16, { type: "sawtooth", vol: 0.13 });
  },
  /** acerto — arpejo ascendente */
  correct() {
    [523, 659, 784, 1047].forEach((f, i) =>
      tone(f, 0.22, { type: "triangle", vol: 0.16, delay: i * 0.09 }),
    );
  },
  /** erro — buzina descendente */
  wrong() {
    tone(196, 0.5, { type: "sawtooth", vol: 0.16, slideTo: 82 });
    tone(185, 0.5, { type: "square", vol: 0.07, slideTo: 78, delay: 0.02 });
  },
  /** vitória — fanfarra */
  win() {
    const seq = [523, 659, 784, 1047, 784, 1047, 1319, 1568];
    seq.forEach((f, i) => tone(f, 0.3, { type: "triangle", vol: 0.16, delay: i * 0.12 }));
    seq.forEach((f, i) => tone(f / 2, 0.3, { type: "sine", vol: 0.08, delay: i * 0.12 }));
  },
  /** carta virando */
  flip() {
    tone(300, 0.16, { type: "triangle", vol: 0.12, slideTo: 900 });
  },
  /** tick do relógio nos segundos finais */
  tick() {
    tone(1050, 0.05, { type: "square", vol: 0.06 });
  },
};
