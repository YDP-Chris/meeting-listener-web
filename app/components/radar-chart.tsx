"use client";

type RadarProps = {
  dimensions: { name: string; score: number }[];
  size?: number;
};

export function RadarChart({ dimensions, size = 280 }: RadarProps) {
  const cx = size / 2;
  const cy = size / 2;
  const r = size * 0.38;
  const n = dimensions.length;
  const angleStep = (2 * Math.PI) / n;

  const point = (i: number, pct: number) => ({
    x: cx + r * pct * Math.sin(i * angleStep - Math.PI / 2),
    y: cy - r * pct * Math.cos(i * angleStep - Math.PI / 2),
  });

  // Grid rings
  const rings = [0.2, 0.4, 0.6, 0.8, 1.0];

  // Data polygon
  const dataPoints = dimensions.map((d, i) => point(i, d.score / 10));
  const dataPath = dataPoints.map((p, i) => `${i === 0 ? 'M' : 'L'}${p.x},${p.y}`).join(' ') + ' Z';

  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
      {/* Grid rings */}
      {rings.map((pct) => {
        const pts = Array.from({ length: n }, (_, i) => point(i, pct));
        const path = pts.map((p, i) => `${i === 0 ? 'M' : 'L'}${p.x},${p.y}`).join(' ') + ' Z';
        return <path key={pct} d={path} fill="none" stroke="#2a2a30" strokeWidth="1" />;
      })}

      {/* Axis lines */}
      {dimensions.map((_, i) => {
        const p = point(i, 1);
        return <line key={i} x1={cx} y1={cy} x2={p.x} y2={p.y} stroke="#2a2a30" strokeWidth="1" />;
      })}

      {/* Data fill */}
      <path d={dataPath} fill="#d4a85318" stroke="#d4a853" strokeWidth="2" strokeLinejoin="round" />

      {/* Data dots + labels */}
      {dimensions.map((d, i) => {
        const p = point(i, d.score / 10);
        const lp = point(i, 1.18);
        const color = d.score >= 8 ? '#6bc77c' : d.score >= 6 ? '#d4a853' : '#e86b5a';
        return (
          <g key={d.name}>
            <circle cx={p.x} cy={p.y} r="4" fill={color} />
            <circle cx={p.x} cy={p.y} r="7" fill={color} opacity="0.15" />
            <text x={lp.x} y={lp.y} textAnchor="middle" dominantBaseline="middle"
              fill="#6e6a65" fontSize="10" fontFamily="Inter, sans-serif" fontWeight="500">
              {d.name.replace(/_/g, ' ').replace(/\b\w/g, c => c.toUpperCase()).slice(0, 12)}
            </text>
            <text x={p.x} y={p.y - 12} textAnchor="middle"
              fill={color} fontSize="11" fontFamily="Inter, sans-serif" fontWeight="700">
              {d.score}
            </text>
          </g>
        );
      })}
    </svg>
  );
}
