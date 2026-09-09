import React from 'react';
import {AbsoluteFill} from 'remotion';
import {C, SERIF} from './theme';
import {Eyebrow, Caption} from './parts';
import {prog, eo, Ring, MarkerArrow, Underline} from './motion';
import {at, cueStart} from './timeline';

const BASE = 810; // baseline y
const TOP = 330; // y of rate 0.8
const SCALE = (BASE - TOP) / 0.8; // px per unit rate

const Bar: React.FC<{
  x: number;
  rate: number;
  p: number;
  color: string;
  label: string;
  valueLabel: string;
  w?: number;
}> = ({x, rate, p, color, label, valueLabel, w = 110}) => {
  const h = rate * SCALE * eo(p);
  return (
    <>
      <div
        style={{
          position: 'absolute',
          left: x,
          top: BASE - h,
          width: w,
          height: h,
          background: color,
          borderRadius: '4px 4px 0 0',
        }}
      />
      {p > 0.75 ? (
        <div
          style={{
            position: 'absolute',
            left: x - 40,
            top: BASE - h - 64,
            width: w + 80,
            textAlign: 'center',
            fontFamily: SERIF,
            fontSize: 34,
            color: C.ink,
            opacity: (p - 0.75) / 0.25,
          }}
        >
          {valueLabel}
        </div>
      ) : null}
      <div
        style={{
          position: 'absolute',
          left: x - 30,
          top: BASE + 16,
          width: w + 60,
          textAlign: 'center',
          fontFamily: SERIF,
          fontSize: 28,
          color: C.muted,
          opacity: Math.min(1, p * 2),
        }}
      >
        {label}
      </div>
    </>
  );
};

/** mini pipeline with a sliding filter chip */
const MiniPipe: React.FC<{t: number; tSlide: number; p: number}> = ({t, tSlide, p}) => {
  const y = 150;
  const slide = eo(prog(t, tSlide, 1.0));
  const nodes = [
    {x: 560, label: 'image'},
    {x: 880, label: 'OCR'},
    {x: 1200, label: 'LLM'},
  ];
  const slotA = 745; // between image and OCR
  const slotB = 1115; // between OCR and LLM
  const fx = slotA + (slotB - slotA) * slide;
  if (p <= 0) return null;
  return (
    <div style={{position: 'absolute', left: 0, top: 0, opacity: eo(p)}}>
      {nodes.map((n, i) => (
        <div
          key={i}
          style={{
            position: 'absolute',
            left: n.x,
            top: y,
            width: 150,
            height: 64,
            border: `3px solid ${C.slate}`,
            borderRadius: 10,
            background: C.paper,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontFamily: SERIF,
            fontSize: 28,
            color: C.slate,
            fontWeight: 700,
          }}
        >
          {n.label}
        </div>
      ))}
      <div style={{position: 'absolute', left: 710, top: y + 30, width: 170, height: 4, background: C.line}} />
      <div style={{position: 'absolute', left: 1030, top: y + 30, width: 170, height: 4, background: C.line}} />
      <div
        style={{
          position: 'absolute',
          left: fx - 62,
          top: y - 44,
          width: 124,
          height: 48,
          borderRadius: 8,
          background: C.good,
          color: '#fff',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontFamily: SERIF,
          fontSize: 26,
          fontWeight: 700,
          boxShadow: '0 3px 10px rgba(28,122,85,0.35)',
        }}
      >
        filter
      </div>
      <svg style={{position: 'absolute', left: 0, top: 0, overflow: 'visible'}} width={1} height={1}>
        <path d={`M ${fx} ${y + 6} L ${fx} ${y + 28}`} stroke={C.good} strokeWidth={4} />
      </svg>
    </div>
  );
};

export const Scene4: React.FC<{t: number}> = ({t}) => {
  const t0 = cueStart('p6');
  const tFront = at('p6', 'front of OCR');
  const tZero = at('p6', 'zero percent');
  const tThird = at('p6', 'a third of Tesseract');
  const tNinety = at('p6', 'over ninety percent');
  const tMoved = at('p7', 'moved the same filter');
  const tCollapse = at('p7', 'Activation collapsed');
  const t35 = at('p7', 'thirty-five percent to one');
  const t97 = at('p7', 'Ninety-seven percent');
  const tClassifier = at('p7', 'classifier call');
  const tWrong = at('p7', 'wrong place');

  const pBars = prog(t, tThird, 0.9);
  const pAfter = prog(t, tCollapse, 0.9);

  const p1x = [170, 360, 550, 740];
  const p2x = [1120, 1310, 1500, 1690];

  return (
    <AbsoluteFill style={{background: C.bg}}>
      <Eyebrow text="Filter position × pipeline" p={prog(t, t0 - 0.3, 0.6)} />
      <MiniPipe t={t} tSlide={tMoved} p={prog(t, tFront, 0.6)} />

      {/* filter catch 0% badge under slot A */}
      {t > tZero ? (
        <div
          style={{
            position: 'absolute',
            left: 615,
            top: 228,
            fontFamily: SERIF,
            fontSize: 34,
            color: C.hot,
            fontWeight: 700,
            opacity: eo(prog(t, tZero, 0.4)) * (1 - prog(t, tMoved, 0.6)),
          }}
        >
          caught: 0%
        </div>
      ) : null}
      <Ring cx={710} cy={248} rx={125} ry={40} p={prog(t, tZero + 0.25, 0.6) * (1 - prog(t, tMoved, 0.6))} color={C.hot} />

      {/* recovered badge near slot B */}
      {t > tClassifier ? (
        <div
          style={{
            position: 'absolute',
            left: 1380,
            top: 108,
            fontFamily: SERIF,
            fontSize: 32,
            color: C.good,
            fontWeight: 700,
            opacity: eo(prog(t, tClassifier, 0.5)),
          }}
        >
          one cheap classifier call
        </div>
      ) : null}

      {/* panel titles */}
      <Caption text="P1 · Tesseract OCR" y={258} x={120} width={780} p={prog(t, tThird - 0.4, 0.5)} color={C.slate} size={36} />
      <Caption text="P2 · vision-LLM as OCR" y={258} x={1070} width={780} p={prog(t, tThird - 0.4, 0.5)} color={C.shelf} size={36} />

      {/* baselines */}
      <div style={{position: 'absolute', left: 130, top: BASE, width: 760, height: 3, background: C.line}} />
      <div style={{position: 'absolute', left: 1080, top: BASE, width: 760, height: 3, background: C.line}} />

      {/* P1 bars */}
      <Bar x={p1x[0]} rate={0.356} p={pBars} color={C.slate} label="no filter" valueLabel="35.6%" />
      <Bar x={p1x[1]} rate={0.356} p={prog(t, tThird + 0.25, 0.9)} color={C.slate} label="before OCR" valueLabel="35.6%" />
      <Bar x={p1x[2]} rate={0.011} p={pAfter} color={C.hot} label="after OCR" valueLabel="1.1%" />
      <Bar x={p1x[3]} rate={0.011} p={prog(t, tCollapse + 0.25, 0.9)} color={C.hot} label="both" valueLabel="1.1%" />

      {/* P2 bars */}
      <Bar x={p2x[0]} rate={0.706} p={prog(t, tThird + 0.5, 0.9)} color={C.shelf} label="no filter" valueLabel="70.6%" />
      <Bar x={p2x[1]} rate={0.706} p={prog(t, tThird + 0.75, 0.9)} color={C.shelf} label="before OCR" valueLabel="70.6%" />
      <Bar x={p2x[2]} rate={0.058} p={prog(t, tCollapse + 0.4, 0.9)} color={C.hot} label="after OCR" valueLabel="5.8%" />
      <Bar x={p2x[3]} rate={0.058} p={prog(t, tCollapse + 0.6, 0.9)} color={C.hot} label="both" valueLabel="5.8%" />

      {/* underline "a third" on P1 bars */}
      <Underline x={p1x[0] - 20} y={BASE - 0.356 * SCALE - 2} w={340} p={prog(t, tThird + 0.4, 0.6) * (1 - prog(t, tMoved, 0.6))} color={C.slate} />

      {/* end-to-end vision chip at "ninety percent" */}
      {t > tNinety ? (
        <div
          style={{
            position: 'absolute',
            left: 1400,
            top: 470,
            whiteSpace: 'nowrap',
            padding: '12px 26px',
            borderRadius: 12,
            border: `3px solid ${C.hot}`,
            background: '#fdeef6',
            fontFamily: SERIF,
            fontSize: 34,
            color: C.hot,
            fontWeight: 700,
            opacity: eo(prog(t, tNinety, 0.5)) * (1 - prog(t, tCollapse, 0.6)),
          }}
        >
          end-to-end vision: 92.2%
        </div>
      ) : null}

      {/* collapse arrows */}
      <MarkerArrow
        x1={p1x[1] + 100}
        y1={BASE - 0.356 * SCALE - 10}
        x2={p1x[2] + 55}
        y2={BASE - 0.011 * SCALE - 70}
        p={prog(t, tCollapse + 0.3, 0.8)}
        color={C.ink}
        curve={60}
      />
      <MarkerArrow
        x1={p2x[1] + 100}
        y1={BASE - 0.706 * SCALE - 10}
        x2={p2x[2] + 55}
        y2={BASE - 0.058 * SCALE - 70}
        p={prog(t, tCollapse + 0.5, 0.8)}
        color={C.ink}
        curve={70}
      />

      {/* 35 -> 1 ring on the 1.1% label */}
      <Ring cx={p1x[2] + 55} cy={BASE - 0.011 * SCALE - 36} rx={95} ry={40} p={prog(t, t35 + 0.3, 0.6)} color={C.hot} />

      {/* recovery annotations */}
      <Caption
        text="96.9% of the miss recovered"
        y={470}
        x={330}
        width={560}
        p={prog(t, t97, 0.6)}
        color={C.ink}
        size={34}
        italic
      />
      <Caption
        text="91.7% recovered"
        y={430}
        x={1330}
        width={500}
        p={prog(t, t97 + 0.5, 0.6)}
        color={C.ink}
        size={34}
        italic
      />

      <Caption
        text="the same filter, moved after OCR: it was standing in the wrong place"
        y={950}
        p={prog(t, tWrong - 1.2, 0.8)}
        color={C.hot}
        size={40}
        italic
      />
    </AbsoluteFill>
  );
};
