import words from './words.json';

export type Cue = {
  id: string;
  text: string;
  start: number;
  dur: number;
  words: {w: string; s: number; e: number}[];
};

export const CUES: Cue[] = (words as any).cues;
export const TOTAL: number = (words as any).total;
export const FPS = 60;

const norm = (s: string) =>
  s
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, '')
    .trim();

const cueById = new Map(CUES.map((c) => [c.id, c]));

// tokens with empty entries (bare em dashes) filtered out, keeping word refs
const tokCache = new Map<string, {tok: string; w: {w: string; s: number; e: number}}[]>();
const toksOf = (cue: Cue) => {
  let t = tokCache.get(cue.id);
  if (!t) {
    t = cue.words
      .map((w) => ({tok: norm(w.w), w}))
      .filter((x) => x.tok.length > 0);
    tokCache.set(cue.id, t);
  }
  return t;
};

const find = (id: string, phrase: string) => {
  const cue = cueById.get(id);
  if (!cue) throw new Error(`no cue ${id}`);
  const target = norm(phrase).split(/\s+/).filter(Boolean);
  const toks = toksOf(cue);
  for (let i = 0; i + target.length <= toks.length; i++) {
    let ok = true;
    for (let j = 0; j < target.length; j++) {
      if (toks[i + j].tok !== target[j]) {
        ok = false;
        break;
      }
    }
    if (ok) return {cue, first: toks[i].w, last: toks[i + target.length - 1].w};
  }
  throw new Error(`anchor not found: [${id}] "${phrase}"`);
};

/** Absolute film-clock second at which `phrase` begins in cue `id`. */
export const at = (id: string, phrase: string): number => {
  const m = find(id, phrase);
  return m.cue.start + m.first.s;
};

/** Absolute second at which `phrase` ENDS in cue `id`. */
export const atEnd = (id: string, phrase: string): number => {
  const m = find(id, phrase);
  return m.cue.start + m.last.e;
};

export const cueStart = (id: string) => {
  const c = cueById.get(id);
  if (!c) throw new Error(`no cue ${id}`);
  return c.start;
};
export const cueEnd = (id: string) => {
  const c = cueById.get(id);
  if (!c) throw new Error(`no cue ${id}`);
  return c.start + c.dur;
};

export const sec = (f: number) => f / FPS;
