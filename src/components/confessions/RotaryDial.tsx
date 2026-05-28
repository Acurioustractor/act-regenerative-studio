// A rotary telephone dial, rendered as a faint engraving. Decorative only.
// Uses currentColor so the caller sets tone + opacity via className.
const HOLES = Array.from({ length: 10 }, (_, i) => {
  // Ten finger holes swept across ~270 degrees, like a real dial (1..9, 0).
  const ang = ((-128 + i * 28.5) * Math.PI) / 180;
  const r = 37;
  return { x: 50 + Math.cos(ang) * r, y: 50 + Math.sin(ang) * r, n: (i + 1) % 10 };
});

export function RotaryDial({ className = '' }: { className?: string }) {
  return (
    <svg viewBox="0 0 100 100" className={className} aria-hidden="true" fill="none" stroke="currentColor">
      <circle cx="50" cy="50" r="48.5" strokeWidth="0.35" />
      <circle cx="50" cy="50" r="44" strokeWidth="0.2" />
      <circle cx="50" cy="50" r="29" strokeWidth="0.3" />
      <circle cx="50" cy="50" r="8" strokeWidth="0.4" />
      {/* finger stop near the lower right */}
      <line x1="78" y1="74" x2="83" y2="78" strokeWidth="0.6" strokeLinecap="round" />
      {HOLES.map((h, i) => (
        <g key={i}>
          <circle cx={h.x} cy={h.y} r="3.6" strokeWidth="0.5" />
          <text
            x={h.x}
            y={h.y + 1.4}
            fontSize="3.4"
            textAnchor="middle"
            stroke="none"
            fill="currentColor"
            fontFamily="ui-monospace, monospace"
          >
            {h.n}
          </text>
        </g>
      ))}
    </svg>
  );
}
