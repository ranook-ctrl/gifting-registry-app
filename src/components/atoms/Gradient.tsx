import React, { useId } from 'react';

export interface GradientStop {
  offset: number; // 0..1
  color: string;
  opacity?: number;
}

const fillStyle: React.CSSProperties = {
  position: 'absolute',
  inset: 0,
  width: '100%',
  height: '100%',
};

/**
 * An absolutely-positioned rounded rectangle filled with a linear gradient,
 * sized to its parent. Direction defaults to top→bottom.
 */
export function LinearGradientFill({
  stops,
  radius = 0,
  start = { x: 0.5, y: 0 },
  end = { x: 0.5, y: 1 },
}: {
  stops: GradientStop[];
  radius?: number;
  start?: { x: number; y: number };
  end?: { x: number; y: number };
}) {
  const id = useId();
  return (
    <svg style={fillStyle} preserveAspectRatio="none" aria-hidden>
      <defs>
        <linearGradient id={id} x1={start.x} y1={start.y} x2={end.x} y2={end.y}>
          {stops.map((s, i) => (
            <stop key={i} offset={s.offset} stopColor={s.color} stopOpacity={s.opacity ?? 1} />
          ))}
        </linearGradient>
      </defs>
      <rect x={0} y={0} width="100%" height="100%" rx={radius} ry={radius} fill={`url(#${id})`} />
    </svg>
  );
}

/** Absolutely-positioned rectangle filled with a radial gradient. */
export function RadialGradientFill({
  stops,
  cx = '50%',
  cy = '50%',
  r = '70%',
}: {
  stops: GradientStop[];
  cx?: string;
  cy?: string;
  r?: string;
}) {
  const id = useId();
  return (
    <svg style={fillStyle} preserveAspectRatio="none" aria-hidden>
      <defs>
        <radialGradient id={id} cx={cx} cy={cy} r={r}>
          {stops.map((s, i) => (
            <stop key={i} offset={s.offset} stopColor={s.color} stopOpacity={s.opacity ?? 1} />
          ))}
        </radialGradient>
      </defs>
      <rect x={0} y={0} width="100%" height="100%" fill={`url(#${id})`} />
    </svg>
  );
}
