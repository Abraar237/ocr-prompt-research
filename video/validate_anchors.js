// Validate every at()/atEnd() anchor phrase in scene files against words.json
const fs = require('fs');
const path = require('path');
const db = JSON.parse(fs.readFileSync(path.join(__dirname, 'src', 'words.json')));
const norm = (s) => s.toLowerCase().replace(/[^a-z0-9\s]/g, '').trim();
const cues = new Map(db.cues.map((c) => [c.id, c]));

const findAnchor = (id, phrase) => {
  const cue = cues.get(id);
  if (!cue) return `no cue ${id}`;
  const target = norm(phrase).split(/\s+/).filter(Boolean);
  const toks = cue.words.map((w) => ({tok: norm(w.w), w})).filter((x) => x.tok.length > 0);
  for (let i = 0; i + target.length <= toks.length; i++) {
    let ok = true;
    for (let j = 0; j < target.length; j++) if (toks[i + j].tok !== target[j]) { ok = false; break; }
    if (ok) return null;
  }
  return `NOT FOUND: [${id}] "${phrase}"`;
};

let bad = 0;
for (const f of fs.readdirSync(path.join(__dirname, 'src'))) {
  if (!f.endsWith('.tsx')) continue;
  const src = fs.readFileSync(path.join(__dirname, 'src', f), 'utf8');
  const re = /at(?:End)?\(\s*'(p\d+)'\s*,\s*(?:'([^']*)'|"([^"]*)")\s*\)/g;
  let m;
  while ((m = re.exec(src))) {
    const err = findAnchor(m[1], m[2] ?? m[3]);
    if (err) { console.log(`${f}: ${err}`); bad++; }
  }
}
console.log(bad === 0 ? 'ALL ANCHORS OK' : `${bad} bad anchors`);
process.exit(bad ? 1 : 0);
