/** Marca original: arcada em ferradura (camada de imagem) com feixe rotacional. */
export function LogoMark({ className = "size-8" }: { className?: string }) {
  return (
    <svg viewBox="0 0 32 32" className={className} aria-hidden focusable="false">
      <rect width="32" height="32" rx="8" fill="#062a2e" />
      <path
        d="M6 12c0 8 4.5 13 10 13s10-5 10-13"
        fill="none"
        stroke="#2dd4bf"
        strokeOpacity="0.35"
        strokeWidth="6"
        strokeLinecap="round"
      />
      <path
        d="M6 12c0 8 4.5 13 10 13s10-5 10-13"
        fill="none"
        stroke="#e6fffb"
        strokeWidth="1.8"
        strokeLinecap="round"
      />
      <circle cx="16" cy="13" r="1.8" fill="#5eead4" />
      <path d="M16 13 L9 5" stroke="#5eead4" strokeWidth="1.4" strokeLinecap="round" />
      <path d="M16 13 L25 5" stroke="#5eead4" strokeOpacity="0.5" strokeWidth="1.4" strokeLinecap="round" />
    </svg>
  );
}
