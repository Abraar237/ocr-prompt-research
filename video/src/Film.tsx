import React from 'react';
import {AbsoluteFill, Audio, staticFile, useCurrentFrame} from 'remotion';
import {C} from './theme';
import {FPS, TOTAL, cueStart} from './timeline';
import {Scene1} from './Scene1Pipeline';
import {Scene2} from './Scene2Boundary';
import {Scene3} from './Scene3Experiment';
import {Scene4} from './Scene4Factorial';
import {Scene5} from './Scene5Vlm';
import {Scene6} from './Scene6Decoupling';
import {Scene7} from './Scene7Close';

// scene boundaries on the absolute film clock (seconds)
const bounds = () => {
  const b = [
    0,
    cueStart('p3'),
    cueStart('p5'),
    cueStart('p6'),
    cueStart('p8'),
    cueStart('p9'),
    cueStart('p10'),
    TOTAL + 1,
  ];
  return b;
};

const FADE = 0.45;
// crossfades happen inside the narration gap just before each cue start
const fadeIn = (t: number, start: number) =>
  start === 0 ? 1 : Math.min(1, Math.max(0, (t - (start - 0.55)) / FADE));
const fadeOut = (t: number, end: number, isLast: boolean) =>
  isLast ? 1 : Math.min(1, Math.max(0, ((end - 0.1) - t) / FADE));

export const Film: React.FC = () => {
  const frame = useCurrentFrame();
  const t = frame / FPS;
  const b = bounds();
  const scenes = [Scene1, Scene2, Scene3, Scene4, Scene5, Scene6, Scene7];

  return (
    <AbsoluteFill style={{background: C.bg}}>
      {scenes.map((S, i) => {
        const start = b[i];
        const end = b[i + 1];
        const vis0 = i === 0 ? 0 : start - 0.55;
        const vis1 = i === scenes.length - 1 ? end : end - 0.55 + FADE + 0.1;
        if (t < vis0 || t > vis1) return null;
        const o = fadeIn(t, start) * fadeOut(t, end, i === scenes.length - 1);
        if (o <= 0) return null;
        return (
          <AbsoluteFill key={i} style={{opacity: o}}>
            <S t={t} />
          </AbsoluteFill>
        );
      })}
      <Audio src={staticFile('narration.m4a')} />
    </AbsoluteFill>
  );
};
