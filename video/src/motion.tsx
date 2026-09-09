import React from 'react';
import {interpolate} from 'remotion';
import {C} from './theme';

/** 0..1 progress starting at absolute second `from`, lasting `dur`. t = film clock sec */
export const prog = (t: number, from: number, dur = 0.6) =>
  interpolate(t, [from, from + dur], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

/** ease-out cubic */
export const eo = (p: number) => 1 - Math.pow(1 - p, 3);
/** ease-in-out */
export const eio = (p: number) => (p < 0.5 ? 4 * p * p * p : 1 - Math.pow(-2 * p + 2, 3) / 2);

/** springy pop for stamps */
export const pop = (p: number) => {
  if (p <= 0) return 0;
  if (p >= 1) return 1;
  return 1 + Math.pow(2, -8 * p) * Math.sin((p * 8 - 0.75) * 2.0944) * 0.6 > 0
    ? 1 - Math.pow(2, -8 * p) * Math.cos(p * 12)
    : p;
};

export const rise = (p: number, px = 24) => ({
  opacity: p,
  transform: `translateY(${(1 - eo(p)) * px}px)`,
});

/** Marker-pen underline: slightly wavy, draw-on via dashoffset. */
export const Underline: React.FC<{
  x: number;
  y: number;
  w: number;
  p: number; // 0..1 draw progress
  color?: string;
  sw?: number;
  opacity?: number;
}> = ({x, y, w, p, color = C.hot, sw = 9, opacity = 0.5}) => {
  const len = w * 1.05;
  const d = `M ${x} ${y} q ${w * 0.25} ${-4} ${w * 0.5} ${-1} q ${w * 0.25} ${3} ${w} ${-3}`;
  if (p <= 0) return null;
  return (
    <svg style={{position: 'absolute', left: 0, top: 0, overflow: 'visible', pointerEvents: 'none'}} width={1} height={1}>
      <path
        d={d}
        stroke={color}
        strokeWidth={sw}
        fill="none"
        strokeLinecap="round"
        opacity={opacity}
        strokeDasharray={len}
        strokeDashoffset={len * (1 - eo(p))}
      />
    </svg>
  );
};

/** Marker-pen ring (ellipse) drawn on with dashoffset. */
export const Ring: React.FC<{
  cx: number;
  cy: number;
  rx: number;
  ry: number;
  p: number;
  color?: string;
  sw?: number;
  opacity?: number;
}> = ({cx, cy, rx, ry, p, color = C.hot, sw = 7, opacity = 0.55}) => {
  if (p <= 0) return null;
  const circ = Math.PI * (3 * (rx + ry) - Math.sqrt((3 * rx + ry) * (rx + 3 * ry)));
  const d = `M ${cx - rx} ${cy}
    a ${rx} ${ry} 0 1 0 ${2 * rx} 0
    a ${rx * 1.04} ${ry * 1.06} -4 1 0 ${-2 * rx * 1.02} ${-ry * 0.06}`;
  return (
    <svg style={{position: 'absolute', left: 0, top: 0, overflow: 'visible', pointerEvents: 'none'}} width={1} height={1}>
      <path
        d={d}
        stroke={color}
        strokeWidth={sw}
        fill="none"
        strokeLinecap="round"
        opacity={opacity}
        strokeDasharray={circ * 1.6}
        strokeDashoffset={circ * 1.6 * (1 - eo(p))}
      />
    </svg>
  );
};

/** Hand-drawn arrow (marker style). */
export const MarkerArrow: React.FC<{
  x1: number;
  y1: number;
  x2: number;
  y2: number;
  p: number;
  color?: string;
  sw?: number;
  curve?: number; // perpendicular bow
  opacity?: number;
}> = ({x1, y1, x2, y2, p, color = C.ink, sw = 5, curve = 30, opacity = 0.8}) => {
  if (p <= 0) return null;
  const mx = (x1 + x2) / 2;
  const my = (y1 + y2) / 2;
  const dx = x2 - x1;
  const dy = y2 - y1;
  const len = Math.hypot(dx, dy);
  const nx = -dy / len;
  const ny = dx / len;
  const cx = mx + nx * curve;
  const cy = my + ny * curve;
  const d = `M ${x1} ${y1} Q ${cx} ${cy} ${x2} ${y2}`;
  const approx = len * 1.2;
  const pp = eo(p);
  // arrowhead direction from control point to end
  const ang = Math.atan2(y2 - cy, x2 - cx);
  const ah = 14;
  return (
    <svg style={{position: 'absolute', left: 0, top: 0, overflow: 'visible', pointerEvents: 'none'}} width={1} height={1}>
      <path
        d={d}
        stroke={color}
        strokeWidth={sw}
        fill="none"
        strokeLinecap="round"
        opacity={opacity}
        strokeDasharray={approx}
        strokeDashoffset={approx * (1 - pp)}
      />
      {pp > 0.92 ? (
        <g opacity={opacity * (pp - 0.92) / 0.08}>
          <path
            d={`M ${x2 - ah * Math.cos(ang - 0.45)} ${y2 - ah * Math.sin(ang - 0.45)} L ${x2} ${y2} L ${x2 - ah * Math.cos(ang + 0.45)} ${y2 - ah * Math.sin(ang + 0.45)}`}
            stroke={color}
            strokeWidth={sw}
            fill="none"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </g>
      ) : null}
    </svg>
  );
};

/** Flowing dots along a horizontal segment; continuous motion. */
export const FlowDots: React.FC<{
  x1: number;
  x2: number;
  y: number;
  t: number;
  n?: number;
  speed?: number; // px per second
  color?: string;
  r?: number;
  opacity?: number;
}> = ({x1, x2, y, t, n = 4, speed = 120, color = C.slate, r = 5, opacity = 0.7}) => {
  const len = x2 - x1;
  const dots = [];
  for (let i = 0; i < n; i++) {
    const phase = ((t * speed) / len + i / n) % 1;
    const fade = Math.min(phase / 0.12, (1 - phase) / 0.12, 1);
    dots.push(
      <circle key={i} cx={x1 + phase * len} cy={y} r={r} fill={color} opacity={opacity * Math.max(0, fade)} />
    );
  }
  return (
    <svg style={{position: 'absolute', left: 0, top: 0, overflow: 'visible', pointerEvents: 'none'}} width={1} height={1}>
      {dots}
    </svg>
  );
};

/** Rolling number counter. */
export const countUp = (t: number, from: number, dur: number, target: number) => {
  const p = eo(prog(t, from, dur));
  return Math.round(p * target);
};
