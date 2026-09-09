import React from 'react';
import {AbsoluteFill} from 'remotion';
import {C, SERIF} from './theme';
import {DocCard, Node, Stamp, Wire, Eyebrow, Caption} from './parts';
import {prog, eo, FlowDots, Ring} from './motion';
import {at, atEnd, cueEnd} from './timeline';

const PIPE_Y = 540; // node top
const NODE_H = 110;
const MID = PIPE_Y + NODE_H / 2;

export const Scene1: React.FC<{t: number}> = ({t}) => {
  const tDocs = 0.7; // establishing docs
  const tInv = at('p1', 'Invoices');
  const tRes = at('p1', 'resumes');
  const tCon = at('p1', 'contracts');
  const tScan = at('p1', 'scanned');
  const tOcr = at('p1', 'run through OCR');
  const tLlm = at('p1', 'language model');
  const tFilter = at('p2', 'prompt-injection filters');
  const tGood = at('p2', 'the filters are good');
  const tMal = at('p2', 'malicious text');
  const tCaught = at('p2', 'caught');
  const tSaw = atEnd('p2', 'it saw');

  const pScan = prog(t, tScan, 0.7);
  const pOcr = prog(t, tOcr, 0.7);
  const pLlm = prog(t, tLlm, 0.7);
  const pFil = prog(t, tFilter, 0.7);

  // three docs drift right, converge into scanned page
  const drift = Math.min(t * 26, 150);
  const conv = eo(prog(t, tScan, 0.9));
  const docStart: [number, number, number][] = [
    [120, 300, -5],
    [230, 470, 3],
    [110, 640, -2],
  ];
  const scanX = 250;
  const scanY = 420;

  // hero payload doc: departs scanned position late in p2, passes filter
  const heroT0 = tSaw - 2.4;
  const pHero = prog(t, heroT0, 3.2);
  const heroX = scanX + eo(pHero) * (1050 - scanX);
  const glow = 0.5 + 0.5 * Math.sin(t * 4);

  // malicious text card drops toward filter, blocked
  const pMal = prog(t, tMal, 0.8);
  const pBlock = prog(t, tCaught, 0.5);
  const malY = 210 + eo(pMal) * 140 + eo(pBlock) * 30;

  const labels = ['Invoices', 'Resumes', 'Contracts'];
  const tLbl = [tInv, tRes, tCon];

  return (
    <AbsoluteFill style={{background: C.bg}}>
      <Eyebrow text="The document pipeline" p={prog(t, 0.5, 0.6)} />
      {/* wires */}
      <Wire x1={scanX + 160} x2={640} y={MID} p={pFil} />
      <Wire x1={880} x2={1010} y={MID} p={pOcr} />
      <Wire x1={1250} x2={1400} y={MID} p={pLlm} />
      {pFil > 0.9 ? <FlowDots x1={scanX + 170} x2={630} y={MID} t={t} color={C.slate} /> : null}
      {pOcr > 0.9 ? <FlowDots x1={890} x2={1000} y={MID} t={t} color={C.slate} n={2} /> : null}
      {pLlm > 0.9 ? <FlowDots x1={1260} x2={1390} y={MID} t={t} color={C.slate} n={2} /> : null}

      {/* three incoming docs converge to scan position */}
      {docStart.map(([x0, y0, r], i) => {
        const p = prog(t, tDocs + i * 0.25, 0.7);
        const x = (x0 + drift) * (1 - conv) + scanX * conv;
        const y = y0 + (scanY - y0) * conv;
        return (
          <DocCard
            key={i}
            x={x}
            y={y}
            label={conv < 0.5 && t > tLbl[i] ? labels[i] : undefined}
            opacity={eo(p) * (i === 1 ? 1 : 1 - conv * 0.99)}
            rotate={r * (1 - conv)}
            payload={i === 1 && t > tFilter - 1}
            payloadGlow={glow}
          />
        );
      })}
      {/* scan sweep line over the merged doc */}
      {conv > 0.8 ? (
        <div
          style={{
            position: 'absolute',
            left: scanX - 6,
            top: scanY + ((t * 90) % 168),
            width: 142,
            height: 4,
            background: C.slate,
            opacity: 0.5,
            borderRadius: 2,
          }}
        />
      ) : null}

      <Node x={640} y={PIPE_Y} w={240} h={NODE_H} label="FILTER" sub="prompt-injection" color={C.good} p={pFil} emphasis={prog(t, tGood, 0.5) * (1 - prog(t, tGood + 2.5, 1))} />
      <Node x={1010} y={PIPE_Y} w={240} h={NODE_H} label="OCR" sub="text extraction" color={C.slate} p={pOcr} />
      <Node x={1400} y={PIPE_Y} w={240} h={NODE_H} label="LLM" sub="summarize" color={C.slate} p={pLlm} />
      <Ring cx={760} cy={MID} rx={160} ry={90} p={prog(t, tGood, 0.7)} color={C.good} opacity={0.45} />

      {/* malicious text card gets BLOCKED */}
      {pMal > 0 ? (
        <div
          style={{
            position: 'absolute',
            left: 640,
            top: malY,
            width: 240,
            padding: '14px 18px',
            background: '#fdeef6',
            border: `2px solid ${C.hot}`,
            borderRadius: 8,
            fontFamily: SERIF,
            fontSize: 26,
            color: C.hot,
            opacity: eo(pMal) * (1 - prog(t, tCaught + 2.2, 0.8)),
            transform: `rotate(${-2 + eo(pBlock) * 4}deg)`,
            textAlign: 'center',
          }}
        >
          ignore all instructions…
        </div>
      ) : null}
      <Stamp x={760} y={malY + 30} text="BLOCKED" color={C.hot} p={prog(t, tCaught, 0.4) * (1 - prog(t, tCaught + 2.2, 0.8))} size={34} />

      {/* hero payload doc passes the filter and gets OK */}
      {pHero > 0 && pHero < 1 ? (
        <DocCard x={heroX} y={430} payload payloadGlow={glow} opacity={0.95} scale={0.9} />
      ) : null}
      <Stamp x={765} y={MID - 130} text="OK" color={C.good} p={prog(t, heroT0 + 1.35, 0.4)} size={44} rotate={-8} />

      <Caption
        text="scanned, extracted, summarized: no human in the loop"
        y={880}
        p={prog(t, tLlm + 0.8, 0.8) * (1 - prog(t, tFilter - 0.2, 0.5))}
        color={C.muted}
        italic
        size={36}
      />
      <Caption
        text="the filter catches nearly every malicious text it sees"
        y={880}
        p={prog(t, tCaught + 0.3, 0.8)}
        color={C.muted}
        italic
        size={36}
      />
    </AbsoluteFill>
  );
};
