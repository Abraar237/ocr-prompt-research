import React from 'react';
import {AbsoluteFill} from 'remotion';
import {C, SERIF} from './theme';
import {Eyebrow, Caption} from './parts';
import {prog, eo, Ring, Underline} from './motion';
import {at, cueStart} from './timeline';

const mix = (hex: string, k: number) => {
  // k=0 -> white, k=1 -> full color
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);
  const m = (c: number) => Math.round(255 + (c - 255) * k);
  return `rgb(${m(r)},${m(g)},${m(b)})`;
};

const ROWS = [
  {name: 'body', v: [0.9, 0.92, 0.85]},
  {name: 'footer', v: [1.0, 0.92, 0.95]},
  {name: 'margin', v: [0.18, 0.53, 1.0]},
  {name: 'watermark', v: [0.0, 0.37, 1.0]},
  {name: 'white-on-white', v: [0.0, 0.7, 0.73]},
  {name: 'micro-font', v: [0.05, 0.8, 1.0]},
];
const COLC = [C.slate, C.shelf, C.hot];
const COLH = ['Tesseract OCR', 'vision-LLM OCR', 'end-to-end vision'];

const FR_LINES = [
  'Voici la transcription de la page :',
  'Facture n° 4021 — Montant total dû :',
  'mille deux cents euros, payable sous',
  'trente jours. Merci de votre confiance.',
];
const EN_LINES = [
  'Transcript of the page:',
  'Invoice no. 4021 — Total amount due:',
  'one thousand two hundred dollars,',
  'payable within thirty days. Thank you.',
];

export const Scene5: React.FC<{t: number}> = ({t}) => {
  const t0 = cueStart('p8');
  const tOpp = at('p8', 'It did the opposite');
  const tPhys = at('p8', 'physically');
  const tWow = at('p8', 'white-on-white text');
  const tMicro = at('p8', 'four-point type');
  const tReads = at('p8', 'reads all of it');
  const tTrans = at('p8', 'It transmitted');
  const tTwice = at('p8', 'twice as many payloads');
  const t18 = at('p8', 'eighteen percent');
  const tExec = at('p8', 'executed the instruction');
  const tAsked = at('p8', 'asked for a transcript');
  const tFrench = at('p8', 'page of French');

  const phaseB = prog(t, tTrans - 0.4, 0.5);
  const gy = (i: number) => 300 + i * 100;

  return (
    <AbsoluteFill style={{background: C.bg}}>
      <Eyebrow text="A vision model as the OCR engine" p={prog(t, t0 - 0.3, 0.6)} />

      {/* PHASE A: placement grid */}
      <div style={{position: 'absolute', inset: 0, opacity: 1 - phaseB}}>
        <Caption
          text="canary activation by hiding place"
          y={170}
          p={prog(t, t0 + 0.5, 0.6)}
          x={100}
          width={900}
          align="left"
          color={C.ink}
          size={38}
        />
        {/* column headers */}
        {COLH.map((h, j) => (
          <div
            key={j}
            style={{
              position: 'absolute',
              left: 620 + j * 400,
              top: 240,
              width: 360,
              textAlign: 'center',
              fontFamily: SERIF,
              fontSize: 30,
              color: COLC[j],
              fontWeight: 700,
              opacity: prog(t, t0 + 0.8 + j * 0.2, 0.5),
            }}
          >
            {h}
          </div>
        ))}
        {ROWS.map((r, i) => {
          const pRow = prog(t, t0 + 1.2 + i * 0.4, 0.5);
          if (pRow <= 0) return null;
          const stealth = i >= 2;
          const pulse = stealth && t > tReads ? 0.5 + 0.5 * Math.sin((t - tReads) * 5) : 0;
          return (
            <div key={i} style={{position: 'absolute', left: 0, top: 0, opacity: eo(pRow)}}>
              <div
                style={{
                  position: 'absolute',
                  left: 140,
                  top: gy(i) + 20,
                  width: 420,
                  fontFamily: SERIF,
                  fontSize: 34,
                  color: C.ink,
                }}
              >
                {r.name}
              </div>
              {r.v.map((v, j) => {
                const emph = stealth && j > 0 && t > tReads;
                return (
                  <div
                    key={j}
                    style={{
                      position: 'absolute',
                      left: 620 + j * 400,
                      top: gy(i),
                      width: 360,
                      height: 78,
                      borderRadius: 10,
                      background: mix(COLC[j], 0.12 + v * 0.88 * eo(pRow)),
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontFamily: SERIF,
                      fontSize: 34,
                      fontWeight: 700,
                      color: v > 0.45 ? '#fff' : C.ink,
                      boxShadow: emph ? `0 0 ${14 + 12 * pulse}px rgba(179,0,107,${0.3 + 0.3 * pulse})` : 'none',
                    }}
                  >
                    {Math.round(v * 100)}%
                  </div>
                );
              })}
            </div>
          );
        })}
        {/* tall ring around Tesseract stealth zeros */}
        <Ring
          cx={800}
          cy={gy(3.5) + 40}
          rx={210}
          ry={230}
          p={prog(t, tPhys, 0.8) * (1 - prog(t, tReads + 1.8, 0.6))}
          color={C.hot}
          sw={8}
        />
        <Caption
          text="Tesseract cannot even see these; the vision model reads all of it"
          y={960}
          p={prog(t, tReads, 0.7)}
          color={C.hot}
          size={38}
          italic
        />
        {/* row rings at the spoken moment */}
        <Ring cx={270} cy={gy(4) + 38} rx={190} ry={38} p={prog(t, tWow, 0.5) * (1 - prog(t, tWow + 2.5, 0.6))} color={C.hot} />
        <Ring cx={250} cy={gy(5) + 38} rx={160} ry={38} p={prog(t, tMicro, 0.5) * (1 - prog(t, tMicro + 2.5, 0.6))} color={C.hot} />
      </div>

      {/* PHASE B: transmission + French */}
      {phaseB > 0 ? (
        <div style={{position: 'absolute', inset: 0, opacity: phaseB}}>
          {/* transmission bars */}
          <Caption text="payloads transmitted to the LLM" y={220} x={100} width={800} align="left" p={prog(t, tTrans, 0.5)} color={C.ink} size={36} />
          {[
            {name: 'Tesseract', v: 0.33, c: C.slate, tt: tTwice},
            {name: 'vision-LLM', v: 0.68, c: C.shelf, tt: tTwice + 0.25},
          ].map((b, i) => {
            const p = eo(prog(t, b.tt, 0.9));
            return (
              <div key={i} style={{position: 'absolute', left: 100, top: 300 + i * 90}}>
                <div style={{fontFamily: SERIF, fontSize: 30, color: C.muted, width: 180, paddingTop: 12}}>{b.name}</div>
                <div
                  style={{
                    position: 'absolute',
                    left: 200,
                    top: 4,
                    width: 620 * b.v * p,
                    height: 52,
                    background: b.c,
                    borderRadius: 6,
                  }}
                />
                {p > 0.7 ? (
                  <div
                    style={{
                      position: 'absolute',
                      left: 200 + 620 * b.v + 18,
                      top: 8,
                      fontFamily: SERIF,
                      fontSize: 34,
                      color: C.ink,
                      opacity: (p - 0.7) / 0.3,
                    }}
                  >
                    {Math.round(b.v * 100)}%
                  </div>
                ) : null}
              </div>
            );
          })}
          <Underline x={295} y={472} w={340} p={prog(t, tTwice + 0.9, 0.6)} color={C.shelf} />

          {/* stacked strip transmit/execute/omit */}
          <Caption text="what the vision transcriber did" y={560} x={100} width={800} align="left" p={prog(t, t18 - 0.5, 0.5)} color={C.ink} size={36} />
          {(() => {
            const segs = [
              {name: 'transmitted', v: 0.68, c: C.shelf},
              {name: 'executed', v: 0.18, c: C.hot},
              {name: 'omitted', v: 0.14, c: C.line},
            ];
            const W = 720;
            let acc = 0;
            const legendX = [100, 380, 640];
            return segs.map((s, i) => {
              const p = eo(prog(t, t18 - 0.3 + i * 0.25, 0.7));
              const x = 100 + acc * W;
              acc += s.v;
              return (
                <div key={i} style={{opacity: p}}>
                  <div
                    style={{
                      position: 'absolute',
                      left: x,
                      top: 640,
                      width: W * s.v * p,
                      height: 64,
                      background: s.c,
                      borderRadius: i === 0 ? '8px 0 0 8px' : i === 2 ? '0 8px 8px 0' : 0,
                    }}
                  />
                  <div
                    style={{
                      position: 'absolute',
                      left: legendX[i],
                      top: 720,
                      whiteSpace: 'nowrap',
                      fontFamily: SERIF,
                      fontSize: 30,
                      color: s.c === C.line ? C.muted : s.c,
                      fontWeight: 700,
                    }}
                  >
                    {s.name} {Math.round(s.v * 100)}%
                  </div>
                </div>
              );
            });
          })()}
          <Ring cx={690} cy={672} rx={95} ry={56} p={prog(t, tExec, 0.6)} color={C.hot} />
          <Caption
            text="it executed the instruction while transcribing"
            y={800}
            x={100}
            width={820}
            align="left"
            p={prog(t, tExec + 0.4, 0.6)}
            color={C.hot}
            size={32}
            italic
          />

          {/* transcript card morphing to French */}
          <div
            style={{
              position: 'absolute',
              left: 1000,
              top: 280,
              width: 800,
              borderRadius: 14,
              border: `3px solid ${C.line}`,
              background: C.paper,
              padding: '26px 34px',
              boxShadow: '0 6px 20px rgba(22,19,13,0.10)',
              opacity: eo(prog(t, tAsked - 0.6, 0.6)),
            }}
          >
            <div style={{fontFamily: SERIF, fontSize: 26, color: C.muted, letterSpacing: '0.12em', textTransform: 'uppercase'}}>
              asked: “transcribe this page”
            </div>
            <div style={{position: 'relative', marginTop: 18, height: 230}}>
              {EN_LINES.map((ln, i) => {
                const pf = prog(t, tFrench - 0.5 + i * 0.28, 0.7);
                return (
                  <div key={i} style={{position: 'absolute', top: i * 56, left: 0, width: '100%'}}>
                    <div style={{fontFamily: SERIF, fontSize: 32, color: C.ink, opacity: 1 - eo(pf), position: 'absolute'}}>
                      {ln}
                    </div>
                    <div style={{fontFamily: SERIF, fontSize: 32, color: C.hot, opacity: eo(pf), position: 'absolute', fontStyle: 'italic'}}>
                      {FR_LINES[i]}
                    </div>
                  </div>
                );
              })}
            </div>
            <div
              style={{
                fontFamily: SERIF,
                fontSize: 28,
                color: C.hot,
                fontWeight: 700,
                marginTop: 8,
                opacity: prog(t, tFrench + 0.6, 0.5),
              }}
            >
              got: a page of French
            </div>
          </div>
        </div>
      ) : null}
    </AbsoluteFill>
  );
};
