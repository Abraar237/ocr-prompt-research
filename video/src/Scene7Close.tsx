import React from 'react';
import {AbsoluteFill} from 'remotion';
import {C, SERIF} from './theme';
import {Node, Wire, Eyebrow, Caption, DocCard, Stamp} from './parts';
import {prog, eo, FlowDots, Underline} from './motion';
import {at, atEnd, cueStart, TOTAL} from './timeline';

const Y = 400;
const MID = Y + 55;

export const Scene7: React.FC<{t: number}> = ({t}) => {
  const t0 = cueStart('p10');
  const tReentry = at('p10', 'point of re-entry');
  const tDoor = at('p10', 'front door');
  const tUntrust = at('p10', 'untrusted output');
  const tE2E = at('p10', 'end-to-end vision');
  const tNoText = at('p10', 'no text to filter');
  const tPlan = at('p10', 'Plan accordingly');
  const tFine = at('p11', 'The filter is fine');
  const tCheck = at('p11', 'Check where');
  const tStand = atEnd('p11', 'standing');
  const tEnd = TOTAL - 4.1;

  const est = prog(t, t0 - 0.4, 0.6);
  const slide = eo(prog(t, tReentry, 1.0));
  const slotA = 590;
  const slotB = 1210;
  const fx = slotA + (slotB - slotA) * slide;

  const dimClose = prog(t, tFine - 0.4, 0.6);
  const endP = prog(t, tEnd, 0.8);

  return (
    <AbsoluteFill style={{background: C.bg}}>
      <Eyebrow text="Where the filter should stand" p={est * (1 - dimClose)} />

      <div style={{position: 'absolute', inset: 0, opacity: (1 - dimClose * 0.94) * eo(est)}}>
        {/* main pipeline */}
        <DocCard x={220} y={Y - 25} w={130} h={168} label="scanned page" opacity={1} />
        <Wire x1={360} x2={780} y={MID} />
        <Wire x1={1020} x2={1440} y={MID} />
        <FlowDots x1={370} x2={770} y={MID} t={t} n={3} />
        <FlowDots x1={1030} x2={1430} y={MID} t={t} n={3} />
        <Node x={780} y={Y} w={240} h={110} label="OCR" sub="text re-enters here" color={C.slate} />
        <Node x={1440} y={Y} w={240} h={110} label="LLM" color={C.slate} />

        {/* filter chip sliding from front door to re-entry */}
        <div
          style={{
            position: 'absolute',
            left: fx - 80,
            top: Y - 100,
            width: 160,
            height: 62,
            borderRadius: 10,
            background: C.good,
            color: '#fff',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontFamily: SERIF,
            fontSize: 32,
            fontWeight: 700,
            boxShadow: `0 4px 16px rgba(28,122,85,${0.3 + slide * 0.3})`,
          }}
        >
          FILTER
        </div>
        <svg style={{position: 'absolute', left: 0, top: 0, overflow: 'visible'}} width={1} height={1}>
          <path d={`M ${fx} ${Y - 36} L ${fx} ${MID - 10}`} stroke={C.good} strokeWidth={5} />
        </svg>

        {/* crossed-out front-door ghost */}
        {t > tDoor ? (
          <>
            <div
              style={{
                position: 'absolute',
                left: slotA - 80,
                top: Y - 100,
                width: 160,
                height: 62,
                borderRadius: 10,
                border: `3px dashed ${C.muted}`,
                opacity: 0.5 * eo(prog(t, tDoor, 0.4)),
              }}
            />
            <svg style={{position: 'absolute', left: 0, top: 0, overflow: 'visible'}} width={1} height={1}>
              <path
                d={`M ${slotA - 70} ${Y - 92} L ${slotA + 70} ${Y - 46} M ${slotA + 70} ${Y - 92} L ${slotA - 70} ${Y - 46}`}
                stroke={C.hot}
                strokeWidth={8}
                strokeLinecap="round"
                opacity={0.75}
                pathLength={100}
                strokeDasharray={100}
                strokeDashoffset={100 * (1 - eo(prog(t, tDoor + 0.15, 0.5)))}
              />
            </svg>
            <div
              style={{
                position: 'absolute',
                left: slotA - 130,
                top: Y - 160,
                width: 260,
                textAlign: 'center',
                fontFamily: SERIF,
                fontSize: 28,
                color: C.muted,
                opacity: eo(prog(t, tDoor, 0.5)),
              }}
            >
              not the front door
            </div>
          </>
        ) : null}
        {t > tReentry + 0.6 ? (
          <div
            style={{
              position: 'absolute',
              left: slotB - 190,
              top: Y - 160,
              width: 380,
              textAlign: 'center',
              fontFamily: SERIF,
              fontSize: 28,
              color: C.good,
              fontWeight: 700,
              opacity: eo(prog(t, tReentry + 0.6, 0.5)),
            }}
          >
            at the point of re-entry
          </div>
        ) : null}

        {/* untrusted transcript chip */}
        {t > tUntrust - 0.5 ? (
          <>
            <div
              style={{
                position: 'absolute',
                left: 820,
                top: 640,
                width: 400,
                borderRadius: 12,
                border: `3px solid ${C.shelf}`,
                background: C.paper,
                padding: '16px 24px',
                fontFamily: SERIF,
                fontSize: 30,
                color: C.ink,
                opacity: eo(prog(t, tUntrust - 0.5, 0.6)),
              }}
            >
              vision-model transcript
            </div>
            <Stamp x={1330} y={655} text="UNTRUSTED" color={C.shelf} p={prog(t, tUntrust + 0.2, 0.5)} size={30} rotate={-12} />
          </>
        ) : null}

        {/* end-to-end vision mini pipeline */}
        {t > tE2E - 0.3 ? (
          <div style={{position: 'absolute', left: 0, top: 0, opacity: eo(prog(t, tE2E - 0.3, 0.6))}}>
            <DocCard x={340} y={790} w={90} h={116} opacity={1} />
            <Wire x1={440} x2={1440} y={848} />
            <FlowDots x1={450} x2={1430} y={848} t={t} n={5} color={C.hot} />
            <Node x={1440} y={795} w={200} h={100} label="LLM" sub="vision" color={C.slate} fontSize={28} />
            <Node x={860} y={800} w={190} h={90} label="filter?" color={C.muted} dashed p={prog(t, tNoText - 0.2, 0.5)} fontSize={28} />
            <Caption
              text="no text to filter"
              y={905}
              x={760}
              width={390}
              p={prog(t, tNoText, 0.5)}
              color={C.hot}
              size={30}
              italic
            />
          </div>
        ) : null}
        <Caption
          text="plan accordingly"
          y={975}
          p={prog(t, tPlan, 0.6) * (1 - dimClose)}
          color={C.muted}
          size={34}
          italic
        />
      </div>

      {/* closing lines */}
      {t > tFine - 0.2 ? (
        <div style={{position: 'absolute', inset: 0, opacity: 1 - endP * 0.25}}>
          <Caption text="The filter is fine." y={430} p={prog(t, tFine, 0.6)} color={C.ink} size={74} />
          <Caption text="Check where it's standing." y={560} p={prog(t, tCheck, 0.6)} color={C.ink} size={74} />
          <Underline x={772} y={650} w={500} p={prog(t, tStand - 0.15, 0.7)} color={C.hot} sw={12} />
        </div>
      ) : null}

      {/* endcard */}
      {endP > 0 ? (
        <div
          style={{
            position: 'absolute',
            left: 0,
            top: 740,
            width: 1920,
            textAlign: 'center',
            opacity: eo(endP),
            transform: `translateY(${(1 - eo(endP)) * 24}px)`,
          }}
        >
          <div style={{fontFamily: SERIF, fontSize: 44, color: C.ink, fontWeight: 700, letterSpacing: '0.04em'}}>
            Your Lab or Affiliation
          </div>
          <div style={{fontFamily: SERIF, fontSize: 34, color: C.slate, marginTop: 14}}>your-project-site.example</div>
        </div>
      ) : null}
    </AbsoluteFill>
  );
};
