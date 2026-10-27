/**
 * Hand-built, animated illustrations for the four services. Pure SVG + CSS,
 * drawn in the business-card palette. Animations pause for reduced motion.
 */

const V = "#7c5cff";
const L = "#ccff00";
const T = "#00e0c6";
const INK = "rgba(236,235,228,";

function Defs({ id }: { id: string }) {
  return (
    <defs>
      <linearGradient id={`${id}-g`} x1="0" y1="0" x2="1" y2="1">
        <stop offset="0" stopColor={V} />
        <stop offset="0.55" stopColor={L} />
        <stop offset="1" stopColor={T} />
      </linearGradient>
      <radialGradient id={`${id}-glow`} cx="0.5" cy="0.5" r="0.5">
        <stop offset="0" stopColor={V} stopOpacity="0.45" />
        <stop offset="1" stopColor={V} stopOpacity="0" />
      </radialGradient>
    </defs>
  );
}

function CodeWindow() {
  const id = "sg-code";
  const lines = [
    { x: 40, w: 90, c: V },
    { x: 56, w: 150, c: INK + "0.35)" },
    { x: 56, w: 110, c: T },
    { x: 72, w: 170, c: INK + "0.35)" },
    { x: 72, w: 70, c: L },
    { x: 56, w: 130, c: INK + "0.35)" },
    { x: 40, w: 60, c: V },
  ];
  return (
    <svg viewBox="0 0 320 240" className="h-full w-full" aria-hidden="true">
      <Defs id={id} />
      <circle cx="250" cy="60" r="90" fill={`url(#${id}-glow)`} />
      <rect x="20" y="24" width="280" height="192" rx="14" fill="rgba(14,13,18,0.85)" stroke={INK + "0.12)"} />
      <line x1="20" y1="52" x2="300" y2="52" stroke={INK + "0.1)"} />
      {[38, 52, 66].map((cx) => (
        <circle key={cx} cx={cx} cy="38" r="4" fill={INK + "0.18)"} />
      ))}
      <rect x="230" y="31" width="56" height="14" rx="7" fill="none" stroke={`url(#${id}-g)`} strokeWidth="1" />
      {lines.map((l, i) => (
        <g key={i}>
          <text x="28" y={80 + i * 19} fontSize="8" fill={INK + "0.25)"} fontFamily="monospace">
            {i + 1}
          </text>
          <rect
            className="sg-type"
            style={{ animationDelay: `${i * 0.35}s`, transformOrigin: `${l.x}px 0` }}
            x={l.x}
            y={73 + i * 19}
            width={l.w}
            height="8"
            rx="4"
            fill={l.c}
            opacity="0.85"
          />
        </g>
      ))}
      <rect className="sg-caret" x="140" y="187" width="2" height="12" fill={L} />
    </svg>
  );
}

function Network() {
  const id = "sg-net";
  return (
    <svg viewBox="0 0 320 240" className="h-full w-full" aria-hidden="true">
      <Defs id={id} />
      <circle cx="160" cy="120" r="110" fill={`url(#${id}-glow)`} />
      <g className="sg-spin" style={{ transformOrigin: "160px 120px" }}>
        <circle cx="160" cy="120" r="62" fill="none" stroke={INK + "0.22)"} />
        <ellipse cx="160" cy="120" rx="26" ry="62" fill="none" stroke={INK + "0.14)"} />
        <ellipse cx="160" cy="120" rx="48" ry="62" fill="none" stroke={INK + "0.1)"} />
        <ellipse cx="160" cy="120" rx="62" ry="20" fill="none" stroke={INK + "0.14)"} />
        <line x1="98" y1="120" x2="222" y2="120" stroke={INK + "0.14)"} />
      </g>
      {[
        { x: 46, y: 60, c: V },
        { x: 276, y: 84, c: T },
        { x: 236, y: 208, c: L },
        { x: 60, y: 196, c: T },
      ].map((n, i) => (
        <g key={i}>
          <line
            className="sg-dash"
            style={{ animationDelay: `${i * 0.4}s` }}
            x1={n.x}
            y1={n.y}
            x2="160"
            y2="120"
            stroke={n.c}
            strokeOpacity="0.6"
            strokeDasharray="3 6"
          />
          <rect x={n.x - 14} y={n.y - 10} width="28" height="20" rx="5" fill="rgba(14,13,18,0.95)" stroke={n.c} strokeOpacity="0.8" />
          <circle cx={n.x - 6} cy={n.y} r="2" fill={n.c} className="sg-blink" style={{ animationDelay: `${i * 0.3}s` }} />
          <line x1={n.x - 1} y1={n.y} x2={n.x + 8} y2={n.y} stroke={INK + "0.4)"} />
        </g>
      ))}
      <circle cx="160" cy="120" r="9" fill={L} />
      <circle cx="160" cy="120" r="9" fill="none" stroke={L} className="sg-ping" style={{ transformOrigin: "160px 120px" }} />
      <text x="160" y="152" textAnchor="middle" fontSize="8" letterSpacing="2" fill={INK + "0.5)"} fontFamily="monospace">
        HTTPS · 200 OK
      </text>
    </svg>
  );
}

function Wireframe() {
  const id = "sg-ui";
  return (
    <svg viewBox="0 0 320 240" className="h-full w-full" aria-hidden="true">
      <Defs id={id} />
      <circle cx="90" cy="180" r="100" fill={`url(#${id}-glow)`} />
      <rect x="30" y="24" width="260" height="192" rx="12" fill="rgba(14,13,18,0.85)" stroke={INK + "0.12)"} />
      <rect x="46" y="40" width="60" height="8" rx="4" fill={INK + "0.3)"} />
      <rect x="214" y="38" width="60" height="12" rx="6" fill={L} opacity="0.9" />
      <rect x="46" y="66" width="130" height="14" rx="3" fill={INK + "0.5)"} />
      <rect x="46" y="86" width="100" height="14" rx="3" fill={INK + "0.5)"} />
      <rect x="46" y="110" width="110" height="6" rx="3" fill={INK + "0.18)"} />
      <rect x="46" y="122" width="90" height="6" rx="3" fill={INK + "0.18)"} />
      <rect x="190" y="66" width="84" height="72" rx="8" fill="none" stroke={`url(#${id}-g)`} strokeDasharray="4 4" />
      {[0, 1, 2].map((i) => (
        <rect key={i} x={46 + i * 78} y="156" width="70" height="44" rx="6" fill={INK + "0.05)"} stroke={INK + "0.12)"} />
      ))}
      <path
        className="sg-draw"
        d="M 196 128 C 210 80, 250 140, 266 76"
        fill="none"
        stroke={`url(#${id}-g)`}
        strokeWidth="2.5"
        strokeLinecap="round"
      />
      {[
        [196, 128],
        [266, 76],
      ].map(([x, y], i) => (
        <rect key={i} x={x - 3.5} y={y - 3.5} width="7" height="7" fill="#08070a" stroke={L} />
      ))}
      <g className="sg-pointer">
        <path d="M0 0 L0 16 L4.5 12 L8 19 L10.5 18 L7 11 L13 11 Z" fill="#ecebe4" stroke="#08070a" strokeWidth="1" />
      </g>
    </svg>
  );
}

function Gauge() {
  const id = "sg-perf";
  const r = 70;
  const circ = 2 * Math.PI * r;
  const arc = circ * 0.75;
  return (
    <svg viewBox="0 0 320 240" className="h-full w-full" aria-hidden="true">
      <Defs id={id} />
      <circle cx="160" cy="118" r="110" fill={`url(#${id}-glow)`} />
      <g transform="rotate(135 160 118)">
        <circle cx="160" cy="118" r={r} fill="none" stroke={INK + "0.1)"} strokeWidth="10" strokeDasharray={`${arc} ${circ}`} strokeLinecap="round" />
        <circle
          className="sg-gauge"
          cx="160"
          cy="118"
          r={r}
          fill="none"
          stroke={`url(#${id}-g)`}
          strokeWidth="10"
          strokeLinecap="round"
          strokeDasharray={`${arc} ${circ}`}
          style={{ ["--arc" as string]: `${arc}` }}
        />
      </g>
      <text x="160" y="128" textAnchor="middle" fontSize="40" fontWeight="600" fill="#ecebe4" fontFamily="Clash Display, sans-serif">
        100
      </text>
      <text x="160" y="148" textAnchor="middle" fontSize="8" letterSpacing="2.5" fill={INK + "0.5)"} fontFamily="monospace">
        PERFORMANCE
      </text>
      {[
        ["LCP", 0.7, T],
        ["CLS", 0.9, L],
        ["INP", 0.8, V],
      ].map(([label, w, col], i) => (
        <g key={label as string} transform={`translate(${70 + i * 66} 206)`}>
          <text x="0" y="-6" fontSize="7" letterSpacing="1.5" fill={INK + "0.45)"} fontFamily="monospace">
            {label}
          </text>
          <rect width="52" height="4" rx="2" fill={INK + "0.1)"} />
          <rect
            className="sg-bar"
            style={{ animationDelay: `${0.4 + i * 0.2}s` }}
            width={52 * (w as number)}
            height="4"
            rx="2"
            fill={col as string}
          />
        </g>
      ))}
    </svg>
  );
}

const GRAPHICS = [CodeWindow, Network, Wireframe, Gauge];

export function ServiceGraphic({ index }: { index: number }) {
  const G = GRAPHICS[index % GRAPHICS.length];
  return <G />;
}
