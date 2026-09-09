#!/bin/bash
# QA protocol on the final render
set -e
V="$1"
OUT=qa/final
mkdir -p $OUT
# 1. contact sheet frames every ~4s
DUR=$(ffprobe -v quiet -show_entries format=duration -of csv=p=0 "$V")
echo "duration: $DUR"
i=0
for t in $(seq 2 4 163); do
  ffmpeg -y -v quiet -ss $t -i "$V" -frames:v 1 $OUT/cs_$(printf %03d $t).png
done
# montage into sheets of 12
cd $OUT && ls cs_*.png | head -60 > /dev/null && cd ../..
# 4. motion audit: frame diffs at 1s intervals
python3 - "$V" <<'EOF'
import subprocess, sys, os
v = sys.argv[1]
os.makedirs('qa/diff', exist_ok=True)
subprocess.run(['ffmpeg','-y','-v','quiet','-i',v,'-vf','fps=2,scale=192:108','qa/diff/f%05d.png'],check=True)
from PIL import Image, ImageChops
import glob
files = sorted(glob.glob('qa/diff/f*.png'))
prev = None
flat = []
run_start = None
for i,f in enumerate(files):
    im = Image.open(f).convert('L')
    if prev is not None:
        import math
        diff = ImageChops.difference(im, prev)
        h = diff.histogram()
        changed = sum(h[8:])  # pixels changed by >=8 levels
        t = i/2.0
        if changed < 40:
            if run_start is None: run_start = t
        else:
            if run_start is not None and t - run_start > 6:
                print(f'STATIC {run_start:.1f}s -> {t:.1f}s')
            run_start = None
    prev = im
if run_start is not None and len(files)/2.0 - run_start > 6:
    print(f'STATIC {run_start:.1f}s -> end')
print('motion audit done')
EOF
