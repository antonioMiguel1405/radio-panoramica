/** Arte do topo (SVG original): camada em ferradura com feixe girando — estilo negatoscópio. */
export function HeroArt() {
  return (
    <div className="relative overflow-hidden rounded-3xl border border-[#1d3b44] bg-[#041015] p-4 shadow-card">
      <svg viewBox="0 0 400 300" className="block h-auto w-full" aria-hidden focusable="false">
        <defs>
          <radialGradient id="hero-glow" cx="50%" cy="45%" r="60%">
            <stop offset="0%" stopColor="#0f3b40" />
            <stop offset="100%" stopColor="#041015" />
          </radialGradient>
          <linearGradient id="hero-beam" x1="0" x2="1">
            <stop offset="0%" stopColor="#f59e0b" stopOpacity="0" />
            <stop offset="35%" stopColor="#fbbf24" stopOpacity="0.55" />
            <stop offset="100%" stopColor="#5eead4" stopOpacity="0.15" />
          </linearGradient>
        </defs>
        <rect width="400" height="300" fill="url(#hero-glow)" />
        {/* grade sutil */}
        {Array.from({ length: 9 }, (_, i) => (
          <line key={i} x1={i * 50} y1="0" x2={i * 50} y2="300" stroke="#0e2a30" strokeWidth="1" />
        ))}
        {/* camada de imagem */}
        <path
          d="M 92 262 C 84 150, 130 58, 200 54 C 270 58, 316 150, 308 262 L 268 262 C 272 170, 244 86, 200 82 C 156 86, 128 170, 132 262 Z"
          fill="#2dd4bf"
          opacity="0.18"
        />
        <path d="M 92 262 C 84 150, 130 58, 200 54 C 270 58, 316 150, 308 262" fill="none" stroke="#2dd4bf" strokeOpacity="0.6" strokeWidth="1.5" />
        <path d="M 132 262 C 128 170, 156 86, 200 82 C 244 86, 272 170, 268 262" fill="none" stroke="#2dd4bf" strokeOpacity="0.6" strokeWidth="1.5" />
        {/* dentes (vista oclusal) */}
        {Array.from({ length: 14 }, (_, i) => {
          const t = (i + 0.5) / 14;
          const ang = Math.PI * (1.05 - 1.1 * t);
          const x = 200 + Math.cos(ang) * 92;
          const y = 190 - Math.sin(ang) * 120;
          const w = i < 3 || i > 10 ? 15 : i < 5 || i > 8 ? 12 : 10;
          return (
            <ellipse
              key={i}
              cx={x.toFixed(1)}
              cy={y.toFixed(1)}
              rx={w / 2}
              ry={w / 2.4}
              fill="#e6fffb"
              opacity="0.88"
              transform={`rotate(${((-ang * 180) / Math.PI + 90).toFixed(1)} ${x.toFixed(1)} ${y.toFixed(1)})`}
            />
          );
        })}
        {/* feixe giratório */}
        <g className="origin-[200px_175px] animate-[spin_9s_linear_infinite] motion-reduce:animate-none">
          <polygon points="20,168 20,182 380,178 380,172" fill="url(#hero-beam)" />
          <rect x="6" y="160" width="20" height="30" rx="5" fill="#f59e0b" />
          <rect x="380" y="140" width="8" height="70" rx="3" fill="#38bdf8" />
        </g>
        <circle cx="200" cy="175" r="4" fill="#5eead4" />
      </svg>
      <div className="pointer-events-none absolute right-4 bottom-3 left-4 flex justify-between text-[0.7rem] font-medium text-[#8fb3bb]">
        <span>
          <span className="mr-1 inline-block size-2 rounded-full bg-[#f59e0b]" /> fonte
        </span>
        <span>camada de imagem (ferradura)</span>
        <span>
          receptor <span className="ml-1 inline-block size-2 rounded-full bg-[#38bdf8]" />
        </span>
      </div>
    </div>
  );
}
