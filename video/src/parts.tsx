import React from 'react';
import {C, SERIF} from './theme';
import {eo} from './motion';

/** A small document card with text lines. */
export const DocCard: React.FC<{
  x: number;
  y: number;
  w?: number;
  h?: number;
  label?: string;
  payload?: boolean; // glowing hot strip inside
  payloadGlow?: number; // 0..1 pulse
  opacity?: number;
  rotate?: number;
  scale?: number;
}> = ({x, y, w = 130, h = 168, label, payload, payloadGlow = 0, opacity = 1, rotate = 0, scale = 1}) => {
  const lines = [0.82, 0.95, 0.7, 0.9, 0.6, 0.88, 0.75];
  return (
    <div
      style={{
        position: 'absolute',
        left: x,
        top: y,
        width: w,
        height: h,
        background: C.paper,
        border: `2px solid #d9d2c6`,
        borderRadius: 6,
        boxShadow: '0 4px 14px rgba(22,19,13,0.14)',
        opacity,
        transform: `rotate(${rotate}deg) scale(${scale})`,
        padding: w * 0.1,
        boxSizing: 'border-box',
      }}
    >
      {lines.map((f, i) => {
        const isPayload = payload && i === 4;
        return (
          <div
            key={i}
            style={{
              height: Math.max(5, h * 0.045),
              width: `${f * 100}%`,
              marginBottom: h * 0.045,
              borderRadius: 3,
              background: isPayload ? C.hot : C.line,
              opacity: isPayload ? 0.55 + 0.45 * payloadGlow : 1,
              boxShadow: isPayload
                ? `0 0 ${10 + 14 * payloadGlow}px rgba(179,0,107,${0.35 + 0.45 * payloadGlow})`
                : 'none',
            }}
          />
        );
      })}
      {label ? (
        <div
          style={{
            position: 'absolute',
            bottom: -40,
            left: 0,
            width: '100%',
            textAlign: 'center',
            fontFamily: SERIF,
            fontSize: 26,
            color: C.muted,
          }}
        >
          {label}
        </div>
      ) : null}
    </div>
  );
};

/** Pipeline node: rounded rect with a label. */
export const Node: React.FC<{
  x: number;
  y: number;
  w: number;
  h: number;
  label: string;
  sub?: string;
  color?: string;
  p?: number; // appear progress
  emphasis?: number; // 0..1 border glow
  dashed?: boolean;
  fontSize?: number;
}> = ({x, y, w, h, label, sub, color = C.slate, p = 1, emphasis = 0, dashed, fontSize = 32}) => {
  if (p <= 0) return null;
  const e = eo(p);
  return (
    <div
      style={{
        position: 'absolute',
        left: x,
        top: y,
        width: w,
        height: h,
        borderRadius: 12,
        border: `3px ${dashed ? 'dashed' : 'solid'} ${color}`,
        background: dashed ? 'transparent' : C.paper,
        boxShadow: emphasis > 0 ? `0 0 ${24 * emphasis}px rgba(179,0,107,${0.5 * emphasis})` : '0 3px 10px rgba(22,19,13,0.07)',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        opacity: e,
        transform: `translateY(${(1 - e) * 18}px)`,
      }}
    >
      <div style={{fontFamily: SERIF, fontSize, color, fontWeight: 700, letterSpacing: '0.04em'}}>{label}</div>
      {sub ? (
        <div style={{fontFamily: SERIF, fontSize: fontSize * 0.68, color: C.muted, marginTop: 4}}>{sub}</div>
      ) : null}
    </div>
  );
};

/** Rubber stamp: OK / BLOCKED. */
export const Stamp: React.FC<{
  x: number;
  y: number;
  text: string;
  color?: string;
  p: number;
  size?: number;
  rotate?: number;
}> = ({x, y, text, color = C.good, p, size = 40, rotate = -10}) => {
  if (p <= 0) return null;
  const s = 1 + (1 - eo(p)) * 1.6;
  return (
    <div
      style={{
        position: 'absolute',
        left: x,
        top: y,
        transform: `translate(-50%,-50%) rotate(${rotate}deg) scale(${s})`,
        opacity: Math.min(1, p * 2) * 0.92,
        border: `${Math.max(3, size * 0.09)}px solid ${color}`,
        color,
        borderRadius: 10,
        padding: `${size * 0.14}px ${size * 0.38}px`,
        fontFamily: SERIF,
        fontWeight: 700,
        fontSize: size,
        letterSpacing: '0.08em',
      }}
    >
      {text}
    </div>
  );
};

/** Straight connector line between nodes. */
export const Wire: React.FC<{x1: number; x2: number; y: number; p?: number; color?: string}> = ({
  x1,
  x2,
  y,
  p = 1,
  color = C.line,
}) => {
  if (p <= 0) return null;
  return (
    <div
      style={{
        position: 'absolute',
        left: x1,
        top: y - 2,
        width: (x2 - x1) * eo(p),
        height: 4,
        background: color,
        borderRadius: 2,
      }}
    />
  );
};

export const Eyebrow: React.FC<{text: string; p?: number; x?: number; y?: number}> = ({text, p = 1, x = 100, y = 72}) => {
  if (p <= 0) return null;
  return (
    <div
      style={{
        position: 'absolute',
        left: x,
        top: y,
        fontFamily: SERIF,
        fontSize: 30,
        letterSpacing: '0.18em',
        textTransform: 'uppercase',
        color: C.muted,
        opacity: eo(p),
      }}
    >
      {text}
    </div>
  );
};

/** Big caption line, serif. */
export const Caption: React.FC<{
  text: string;
  y: number;
  p: number;
  color?: string;
  size?: number;
  italic?: boolean;
  x?: number;
  align?: 'center' | 'left';
  width?: number;
}> = ({text, y, p, color = C.ink, size = 44, italic, x = 0, align = 'center', width = 1920}) => {
  if (p <= 0) return null;
  const e = eo(p);
  return (
    <div
      style={{
        position: 'absolute',
        left: x,
        top: y,
        width,
        textAlign: align,
        fontFamily: SERIF,
        fontSize: size,
        fontStyle: italic ? 'italic' : 'normal',
        color,
        opacity: e,
        transform: `translateY(${(1 - e) * 16}px)`,
      }}
    >
      {text}
    </div>
  );
};
