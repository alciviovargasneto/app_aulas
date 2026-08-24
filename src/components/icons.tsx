import type { SVGProps } from "react";

type P = SVGProps<SVGSVGElement> & { size?: number };

const base = (size = 20) => ({
  width: size,
  height: size,
  viewBox: "0 0 24 24",
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 2,
  strokeLinecap: "round" as const,
  strokeLinejoin: "round" as const,
});

export const IconMegaphone = ({ size, ...p }: P) => (
  <svg {...base(size)} {...p}>
    <path d="M3 11l14-6v14L3 13v-2z" />
    <path d="M11.6 16.8a3 3 0 1 1-5.8-1.6" />
    <path d="M17 8a4 4 0 0 1 0 8" />
  </svg>
);

export const IconTag = ({ size, ...p }: P) => (
  <svg {...base(size)} {...p}>
    <path d="M20.6 13.4 12 22 2 12V2h10l8.6 8.6a2 2 0 0 1 0 2.8z" />
    <circle cx="7" cy="7" r="1.6" fill="currentColor" stroke="none" />
  </svg>
);

export const IconChart = ({ size, ...p }: P) => (
  <svg {...base(size)} {...p}>
    <path d="M3 3v18h18" />
    <rect x="7" y="12" width="3" height="6" fill="currentColor" stroke="none" />
    <rect x="12" y="8" width="3" height="10" fill="currentColor" stroke="none" />
    <rect x="17" y="5" width="3" height="13" fill="currentColor" stroke="none" />
  </svg>
);

export const IconTarget = ({ size, ...p }: P) => (
  <svg {...base(size)} {...p}>
    <circle cx="12" cy="12" r="9" />
    <circle cx="12" cy="12" r="5" />
    <circle cx="12" cy="12" r="1.4" fill="currentColor" stroke="none" />
  </svg>
);

export const IconCards = ({ size, ...p }: P) => (
  <svg {...base(size)} {...p}>
    <rect x="3" y="6" width="11" height="15" rx="2" transform="rotate(-8 8.5 13.5)" />
    <rect x="10" y="4" width="11" height="15" rx="2" transform="rotate(8 15.5 11.5)" />
  </svg>
);

export const IconCrowd = ({ size, ...p }: P) => (
  <svg {...base(size)} {...p}>
    <circle cx="9" cy="8" r="3.2" />
    <path d="M2.8 20a6.2 6.2 0 0 1 12.4 0" />
    <circle cx="17" cy="9" r="2.4" />
    <path d="M14.9 20a4.8 4.8 0 0 1 6.6-3.4" />
  </svg>
);

export const IconSkip = ({ size, ...p }: P) => (
  <svg {...base(size)} {...p}>
    <path d="M4 5v14l8-7-8-7z" fill="currentColor" stroke="none" />
    <path d="M13 5v14l8-7-8-7z" fill="currentColor" stroke="none" />
  </svg>
);

export const IconHand = ({ size, ...p }: P) => (
  <svg {...base(size)} {...p}>
    <path d="M7 11V6.5a1.5 1.5 0 0 1 3 0V11m0-5.5v-1a1.5 1.5 0 0 1 3 0V11m0-4.5a1.5 1.5 0 0 1 3 0V13" />
    <path d="M16 13V9.8a1.5 1.5 0 0 1 3 0V14a8 8 0 0 1-8 8h-1c-3 0-4.5-1.5-6-4l-2.2-4A1.6 1.6 0 0 1 4.5 12L7 13.5" />
  </svg>
);

export const IconBulb = ({ size, ...p }: P) => (
  <svg {...base(size)} {...p}>
    <path d="M9 18h6M10 21h4" />
    <path d="M12 3a6 6 0 0 1 3.7 10.7c-.8.7-.7 1.6-.7 2.3h-6c0-.7.1-1.6-.7-2.3A6 6 0 0 1 12 3z" />
  </svg>
);

export const IconShield = ({ size, ...p }: P) => (
  <svg {...base(size)} {...p}>
    <path d="M12 2 4.5 5v6c0 5 3.2 8.6 7.5 11 4.3-2.4 7.5-6 7.5-11V5L12 2z" />
    <path d="m8.8 11.6 2.3 2.3 4.2-4.4" />
  </svg>
);

export const IconTrophy = ({ size, ...p }: P) => (
  <svg {...base(size)} {...p}>
    <path d="M8 4h8v6a4 4 0 0 1-8 0V4z" />
    <path d="M8 5H4.5a0 0 0 0 0 0 0c0 3 1.5 5 3.5 5M16 5h3.5c0 3-1.5 5-3.5 5" />
    <path d="M12 14v3M8 21h8M9.5 17h5l.5 4H9l.5-4z" />
  </svg>
);

export const IconTimer = ({ size, ...p }: P) => (
  <svg {...base(size)} {...p}>
    <circle cx="12" cy="13" r="8" />
    <path d="M12 9v4l2.5 2.5M9 2h6" />
  </svg>
);

export const IconVolume = ({ size, ...p }: P) => (
  <svg {...base(size)} {...p}>
    <path d="M11 5 6.5 9H3v6h3.5L11 19V5z" fill="currentColor" stroke="none" />
    <path d="M15 9a4 4 0 0 1 0 6M17.7 6.5a8 8 0 0 1 0 11" />
  </svg>
);

export const IconVolumeOff = ({ size, ...p }: P) => (
  <svg {...base(size)} {...p}>
    <path d="M11 5 6.5 9H3v6h3.5L11 19V5z" fill="currentColor" stroke="none" />
    <path d="m15.5 9.5 5 5m0-5-5 5" />
  </svg>
);

export const IconCheck = ({ size, ...p }: P) => (
  <svg {...base(size)} {...p}>
    <path d="m4.5 12.5 5 5 10-11" />
  </svg>
);

export const IconX = ({ size, ...p }: P) => (
  <svg {...base(size)} {...p}>
    <path d="m6 6 12 12M18 6 6 18" />
  </svg>
);

export const IconArrow = ({ size, ...p }: P) => (
  <svg {...base(size)} {...p}>
    <path d="M4 12h15M13 6l6 6-6 6" />
  </svg>
);

export const IconSpark = ({ size, ...p }: P) => (
  <svg {...base(size)} {...p}>
    <path
      d="M12 2c.6 4.9 2.4 7.2 8 8-5.6.8-7.4 3.1-8 8-.6-4.9-2.4-7.2-8-8 5.6-.8 7.4-3.1 8-8z"
      fill="currentColor"
      stroke="none"
    />
  </svg>
);

export const IconCoin = ({ size, ...p }: P) => (
  <svg {...base(size)} {...p}>
    <circle cx="12" cy="12" r="9" />
    <circle cx="12" cy="12" r="6" strokeDasharray="2.5 2.5" />
    <path d="M12 8v8M9.8 9.5c.5-.9 1.3-1.3 2.2-1.3 1.2 0 2 .7 2 1.7 0 2.2-4 1.7-4 3.9 0 1 .8 1.7 2 1.7.9 0 1.7-.4 2.2-1.3" strokeWidth="1.6" />
  </svg>
);
