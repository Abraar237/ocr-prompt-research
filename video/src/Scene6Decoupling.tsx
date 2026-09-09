import React from 'react';
import {AbsoluteFill} from 'remotion';
import {C, SERIF} from './theme';
import {Eyebrow, Caption} from './parts';
import {prog, eo, Ring, Underline} from './motion';
import {at, cueStart} from './timeline';

// chart geometry
const CH = {x0: 760, x1: 1680, y0: 830, y1: 300}; // y0 = rate 0, y1 = rate 1
const X = (k: number) => CH.x0 + 140 + k * (CH.x1 - CH.x0 - 280);
const Y = (r: number) => CH.y0 + (CH.y1 - CH.y0) * r;

const Line: React.FC<{a: number; b: number; p: number; color: string; sw?: number}> = ({a, b, p, color, sw = 8}) => {
  if (p <= 0) return null;
  const x1 = X(0);
  const y1 = Y(a);
  const x2 = X(1);
  const y2 = Y(b);
  const len = Math.hypot(x2 - x1, y2 - y1);
  return (
    <svg style={{position: 'absolute', left: 0, top: 0, overflow: 'visible'}} width={1} height={1}>
      <path
        d={`M ${x1} ${y1} L ${x2} ${y2}`}
        stroke={color}
        strokeWidth={sw}
        strokeLinecap="round"
        strokeDasharray={len}
        strokeDashoffset={len * (1 - eo(p))}
        fill="none"
      />
      <circle cx={x1} cy={y1} r={11} fill={color} />
      {p > 0.95 ? <circle cx={x2} cy={y2} r={11} fill={color} opacity={(p - 0.95) / 0.05} /> : null}
    </svg>
  );
};

export const Scene6: React.FC<{t: number}> = ({t}) => {
  const t0 = cueStart('p9');
  const tRuin = at('p9', 'Ruining the scan');
  const tDouble = at('p9', 'Noise doubles');
  const tFlat = at('p9', "doesn't move");
  const tSurvive = at('p9', 'survive damage');

  const pWer = prog(t, tDouble, 1.1);
  const pAct = prog(t, tFlat - 0.6, 1.1);
  const est = prog(t, t0 - 0.3, 0.6);

  // noisy doc: deterministic speckles that accumulate
  const nSpeck = Math.floor(eo(prog(t, tRuin, 1.6)) * 90);

  return (
    <AbsoluteFill style={{background: C.bg}}>
      <Eyebrow text="Ruining the scan" p={est} />

      {/* clean vs noisy doc */}
      {[0, 1].map((k) => (
        <div
          key={k}
          style={{
            position: 'absolute',
            left: 140 + k * 260,
            top: 330,
            width: 200,
            height: 264,
            background: C.paper,
            border: `3px solid ${C.line}`,
            borderRadius: 8,
            opacity: eo(prog(t, t0 - 0.2 + k * 0.3, 0.6)),
            boxShadow: '0 4px 14px rgba(22,19,13,0.10)',
            overflow: 'hidden',
          }}
        >
          {Array.from({length: 8}).map((_, i) => (
            <div
              key={i}
              style={{
                position: 'absolute',
                left: 22,
                top: 28 + i * 28,
                width: 156 * [0.9, 1, 0.7, 0.95, 0.6, 0.85, 0.75, 0.5][i],
                height: 8,
                background: C.line,
                borderRadius: 4,
              }}
            />
          ))}
          {k === 1
            ? Array.from({length: nSpeck}).map((_, i) => {
                const sx = ((i * 137 + 41) % 190) + 5;
                const sy = ((i * 89 + 17) % 250) + 6;
                const tw = 0.6 + 0.4 * Math.sin(t * 7 + i);
                return (
                  <div
                    key={i}
                    style={{
                      position: 'absolute',
                      left: sx,
                      top: sy,
                      width: 4 + ((i * 7) % 5),
                      height: 4 + ((i * 11) % 5),
                      background: C.ink,
                      opacity: 0.5 * tw,
                      borderRadius: 1,
                    }}
                  />
                );
              })
            : null}
          <div
            style={{
              position: 'absolute',
              bottom: 6,
              width: '100%',
              textAlign: 'center',
              fontFamily: SERIF,
              fontSize: 24,
              color: C.muted,
              background: 'rgba(255,255,255,0.85)',
            }}
          >
            {k === 0 ? 'clean scan' : 'heavy noise'}
          </div>
        </div>
      ))}

      {/* chart frame */}
      <div style={{position: 'absolute', left: CH.x0, top: Y(1) - 20, width: 4, height: CH.y0 - CH.y1 + 20, background: C.line, opacity: est}} />
      <div style={{position: 'absolute', left: CH.x0, top: CH.y0, width: CH.x1 - CH.x0, height: 4, background: C.line, opacity: est}} />
      {[0, 0.25, 0.5, 0.75, 1].map((r) => (
        <div key={r} style={{position: 'absolute', left: CH.x0 - 74, top: Y(r) - 16, fontFamily: SERIF, fontSize: 26, color: C.muted, opacity: est, width: 60, textAlign: 'right'}}>
          {r.toFixed(2).replace('0.00', '0').replace('1.00', '1')}
        </div>
      ))}
      {['clean scan', 'noisy scan'].map((lab, k) => (
        <div key={k} style={{position: 'absolute', left: X(k) - 110, top: CH.y0 + 22, width: 220, textAlign: 'center', fontFamily: SERIF, fontSize: 30, color: C.muted, opacity: est}}>
          {lab}
        </div>
      ))}

      {/* WER line rising */}
      <Line a={0.196} b={0.385} p={pWer} color={C.shelf} />
      <Caption text="OCR word error rate" y={Y(0.196) + 26} x={X(0) - 130} width={420} p={prog(t, tDouble + 0.4, 0.5)} color={C.shelf} size={30} align="left" />
      <Caption text="0.20" y={Y(0.196) - 52} x={X(0) - 60} width={120} p={prog(t, tDouble + 0.3, 0.5)} color={C.shelf} size={32} />
      <Caption text="0.39" y={Y(0.385) - 60} x={X(1) - 60} width={120} p={prog(t, tDouble + 0.9, 0.5)} color={C.shelf} size={32} />
      <Ring cx={X(1)} cy={Y(0.385)} rx={70} ry={48} p={prog(t, tDouble + 1.1, 0.6)} color={C.shelf} />

      {/* activation flat */}
      <Line a={0.611} b={0.611} p={pAct} color={C.hot} />
      <Caption text="attack success (no filter)" y={Y(0.611) - 66} x={X(0) - 130} width={460} p={prog(t, tFlat, 0.5)} color={C.hot} size={30} align="left" />
      <Caption text="61%" y={Y(0.611) + 20} x={X(0) - 60} width={120} p={prog(t, tFlat, 0.5)} color={C.hot} size={32} />
      <Caption text="61%" y={Y(0.611) + 20} x={X(1) - 60} width={120} p={prog(t, tFlat + 0.4, 0.5)} color={C.hot} size={32} />
      <Underline x={X(0)} y={Y(0.611) - 14} w={X(1) - X(0)} p={prog(t, tFlat + 0.5, 0.8)} color={C.hot} opacity={0.25} sw={14} />

      <Caption
        text="instructions survive damage better than content does"
        y={950}
        p={prog(t, tSurvive - 0.4, 0.7)}
        color={C.ink}
        size={40}
        italic
      />
    </AbsoluteFill>
  );
};
