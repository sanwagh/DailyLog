function spiralPath(size, rating) {
  const cx = size / 2;
  const cy = size / 2;
  const rMax = size / 2 - 2;
  const turns = 0.15 + rating * 0.34;
  const rMin = rMax * Math.max(0.08, 0.5 - rating * 0.045);
  const steps = Math.max(24, Math.round(turns * 26));

  let d = "";
  for (let i = 0; i <= steps; i++) {
    const t = i / steps;
    const theta = t * turns * Math.PI * 2;
    const r = rMax - (rMax - rMin) * t;
    const x = cx + r * Math.cos(theta - Math.PI / 2);
    const y = cy + r * Math.sin(theta - Math.PI / 2);
    d += `${i === 0 ? "M" : "L"}${x.toFixed(2)},${y.toFixed(2)} `;
  }
  return d;
}

export default function LoopGlyph({ rating, size = 24, className }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox={`0 0 ${size} ${size}`}
      className={className}
      role="img"
      aria-label={`Rumination rating ${rating} out of 10`}
    >
      <path
        d={spiralPath(size, rating)}
        fill="none"
        stroke="currentColor"
        strokeWidth="1.75"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
