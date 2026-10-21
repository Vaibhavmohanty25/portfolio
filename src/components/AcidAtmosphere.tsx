// Decorative artwork stays local, resolution independent, and silent to screen readers.
export function AcidWaves() {
  return <svg className="acid-waves" viewBox="0 0 1200 650" fill="none" aria-hidden="true" focusable="false">
    <defs>
      <linearGradient id="wave-ink" x1="100" y1="0" x2="1100" y2="650" gradientUnits="userSpaceOnUse">
        <stop stopColor="var(--accent)" /><stop offset=".38" stopColor="#00f0ff" />
        <stop offset=".65" stopColor="#ff2e9a" /><stop offset="1" stopColor="var(--accent)" />
      </linearGradient>
      <filter id="acid-warp" x="-20%" y="-30%" width="140%" height="160%">
        <feTurbulence type="fractalNoise" baseFrequency=".005 .009" numOctaves="2" seed="8" result="noise" />
        <feDisplacementMap in="SourceGraphic" in2="noise" scale="65" xChannelSelector="R" yChannelSelector="B" />
      </filter>
    </defs>
    <g className="wave-lines" stroke="url(#wave-ink)" filter="url(#acid-warp)">
      {Array.from({ length: 25 }, (_, i) => <ellipse key={i} cx="750" cy="320" rx={95 + i * 25} ry={32 + i * 12} strokeWidth={i % 5 === 0 ? 3 : 1.2} transform="rotate(-24 750 320)" />)}
    </g>
  </svg>;
}

export function AcidTicker() {
  const text = "ACID WAVE // HUMAN IDEAS. MACHINE INTELLIGENCE. // OPEN TO OPPORTUNITIES // ENTER THE SIGNAL // ";
  return <div className="acid-ticker" aria-label="Acid wave. Human ideas. Machine intelligence. Open to opportunities.">
    <div className="ticker-track" aria-hidden="true"><span>{text}</span><span>{text}</span></div>
  </div>;
}
