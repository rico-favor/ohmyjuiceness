#!/usr/bin/env bash
# OMJ preview image pipeline: recrop (rule of thirds) + brand grade + derivatives.
# Re-runnable. Requires ImageMagick 7 (`magick`) at /opt/homebrew/bin/magick (falls back to PATH).
#
# Usage: build/scripts/process-preview-images.sh
#
# All crop geometries and grade-variant choices below were settled by visually
# reviewing each raw photo (see build/preview/assets/img/CROPS.md for the
# per-image rationale and curation notes).

set -euo pipefail

MAGICK="$(command -v /opt/homebrew/bin/magick || command -v magick)"
ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/../.." && pwd)"
REV="$ROOT/revisions"
PROC="$ROOT/build/assets/photos"
PROC2="$ROOT/build/assets/omj-revision"
OUT="$ROOT/build/preview/assets/img"
TMP="$(mktemp -d)"
trap 'rm -rf "$TMP"' EXIT

mkdir -p "$OUT/locations/greenhills" "$OUT/locations/uptown" "$OUT/locations/parqal" "$OUT/locations/eastwood" "$OUT/machine" "$OUT/people"

# ---------------------------------------------------------------------------
# Grade recipes
# ---------------------------------------------------------------------------

# Standard (daylight) grade — warm brand tint.
grade_standard () {
  local in="$1" out="$2"
  local t1="$TMP/$(basename "$out").t1.jpg"
  "$MAGICK" "$in" -linear-stretch 0.3%x0.3% -auto-gamma "$t1"
  # NOTE: the brief's literal `-fill '#FF8E06' -tint 3` combo blows out to a
  # posterized near-black/neon result on these photos (verified: -tint behaves
  # as a destructive duotone blend here, not a subtle wash). -colorize 3%
  # delivers the intended subtle brand-warm wash without the artifact.
  "$MAGICK" "$t1" -modulate 102,114,100 -sigmoidal-contrast 2.5x50% -fill '#FF8E06' -colorize 3% "$out"
}

# Low-light / fluorescent-interior / Eastwood grade — no tint, denoise via -enhance.
grade_lowlight () {
  local in="$1" out="$2"
  local t1="$TMP/$(basename "$out").t1.jpg"
  "$MAGICK" "$in" -linear-stretch 0.3%x0.3% -auto-gamma "$t1"
  "$MAGICK" "$t1" -modulate 102,110,99 -enhance "$out"
}

# Minimal grade for the flat vector machine-wrap graphic (preserve exact brand hex).
grade_graphic () {
  local in="$1" out="$2"
  "$MAGICK" "$in" -linear-stretch 0.3%x0.3% -auto-gamma "$out"
}

# ---------------------------------------------------------------------------
# Derivatives: primary (1600w) + -800 variant, jpg q82 / webp q78.
# ---------------------------------------------------------------------------
derivatives () {
  local graded="$1" destdir="$2" name="$3" primary_w="${4:-1600}"
  "$MAGICK" "$graded" -filter Lanczos -resize "${primary_w}x" -unsharp 0x0.6 -quality 82 "$destdir/$name.jpg"
  "$MAGICK" "$graded" -filter Lanczos -resize "${primary_w}x" -unsharp 0x0.6 -quality 78 "$destdir/$name.webp"
  "$MAGICK" "$graded" -filter Lanczos -resize 800x -unsharp 0x0.6 -quality 82 "$destdir/$name-800.jpg"
  "$MAGICK" "$graded" -filter Lanczos -resize 800x -unsharp 0x0.6 -quality 78 "$destdir/$name-800.webp"
}

# Eastwood derivatives: ONLY the <=800 pair, primary IS the 800 (or native) width.
derivatives_eastwood () {
  local graded="$1" destdir="$2" name="$3" width="$4"
  "$MAGICK" "$graded" -filter Lanczos -resize "${width}x" -unsharp 0x0.6 -quality 82 "$destdir/$name.jpg"
  "$MAGICK" "$graded" -filter Lanczos -resize "${width}x" -unsharp 0x0.6 -quality 78 "$destdir/$name.webp"
}

crop () {
  local in="$1" geom="$2" out="$3"
  "$MAGICK" "$in" -auto-orient -crop "$geom" +repage "$out"
}

echo "== Greenhills =="
crop "$REV/omj-greenhills1.jpeg" 4284x3213+0+558 "$TMP/gh1.jpg"
grade_standard "$TMP/gh1.jpg" "$TMP/gh1.g.jpg"
derivatives "$TMP/gh1.g.jpg" "$OUT/locations/greenhills" "loc-greenhills-01"

crop "$REV/omj-greenhills1.jpeg" 4284x5712+0+0 "$TMP/gh1p.jpg"
grade_standard "$TMP/gh1p.jpg" "$TMP/gh1p.g.jpg"
derivatives "$TMP/gh1p.g.jpg" "$OUT/locations/greenhills" "loc-greenhills-01-portrait"

crop "$REV/omj-greenhills2.jpeg" 4284x3213+0+550 "$TMP/gh2.jpg"
grade_standard "$TMP/gh2.jpg" "$TMP/gh2.g.jpg"
derivatives "$TMP/gh2.g.jpg" "$OUT/locations/greenhills" "loc-greenhills-02"

echo "== Uptown =="
crop "$REV/omj-uptown-bgc1.jpeg" 4284x3213+0+250 "$TMP/up1.jpg"
grade_standard "$TMP/up1.jpg" "$TMP/up1.g.jpg"
derivatives "$TMP/up1.g.jpg" "$OUT/locations/uptown" "loc-uptown-01"

crop "$REV/omj-uptown-bgc2.jpeg" 4284x3213+0+600 "$TMP/up2.jpg"
grade_lowlight "$TMP/up2.jpg" "$TMP/up2.g.jpg"
derivatives "$TMP/up2.g.jpg" "$OUT/locations/uptown" "loc-uptown-02"

crop "$REV/omj-uptown-bgc3.jpeg" 4284x3213+0+1050 "$TMP/up3.jpg"
grade_lowlight "$TMP/up3.jpg" "$TMP/up3.g.jpg"
derivatives "$TMP/up3.g.jpg" "$OUT/locations/uptown" "loc-uptown-03"

echo "== Parqal =="
crop "$REV/omj-parqal2.jpeg" 4284x3213+0+804 "$TMP/pq1.jpg"
grade_lowlight "$TMP/pq1.jpg" "$TMP/pq1.g.jpg"
derivatives "$TMP/pq1.g.jpg" "$OUT/locations/parqal" "loc-parqal-01"

crop "$REV/omj-parqal3.jpeg" 4284x3213+0+2304 "$TMP/pq2.jpg"
grade_lowlight "$TMP/pq2.jpg" "$TMP/pq2.g.jpg"
derivatives "$TMP/pq2.g.jpg" "$OUT/locations/parqal" "loc-parqal-02"

crop "$REV/omj-parqal4.jpeg" 4284x3213+0+1209 "$TMP/pq3.jpg"
grade_lowlight "$TMP/pq3.jpg" "$TMP/pq3.g.jpg"
derivatives "$TMP/pq3.g.jpg" "$OUT/locations/parqal" "loc-parqal-03"

crop "$REV/omj-parqal5.jpeg" 4284x3213+0+1185 "$TMP/pq4.jpg"
grade_lowlight "$TMP/pq4.jpg" "$TMP/pq4.g.jpg"
derivatives "$TMP/pq4.g.jpg" "$OUT/locations/parqal" "loc-parqal-04"

crop "$REV/omj-abaca-bldg-parqal1.jpeg" 4284x3213+0+550 "$TMP/pq5.jpg"
grade_lowlight "$TMP/pq5.jpg" "$TMP/pq5.g.jpg"
derivatives "$TMP/pq5.g.jpg" "$OUT/locations/parqal" "loc-parqal-05"

echo "== Eastwood (curated 8 of 13) =="
# Selection rationale lives in CROPS.md. Geometry: 480x360 (native 4:3 crop from
# the 480x640 portrait source; source is too small to crop-then-upscale safely
# per test, so we keep native width and only mildly upscale to 800 if it holds up).
ew_process () {
  local src="$1" geom="$2" name="$3"
  crop "$REV/omjeastwood/$src.jpeg" "$geom" "$TMP/$name.jpg"
  grade_lowlight "$TMP/$name.jpg" "$TMP/$name.g.jpg"
  derivatives_eastwood "$TMP/$name.g.jpg" "$OUT/locations/eastwood" "loc-eastwood-$name" 800
}
ew_process IMG_6757 480x360+0+20  01
ew_process IMG_6767 480x360+0+0   02
ew_process IMG_6779 480x360+0+90  03
ew_process IMG_7347 480x360+0+20  04
ew_process IMG_7349 480x360+0+40  05
ew_process IMG_7353 480x360+0+30  06
ew_process IMG_7356 480x360+0+70  07
ew_process IMG_7359 480x360+0+40  08

echo "== Machine (already-cropped, grade only) =="
# machine-parqal.jpg / machine-parqal-2.jpg carry an EXIF Orientation=6 tag AND
# store genuinely sideways pixel data (the Read/preview tool used during QA
# auto-rotates for display, which masked this) — apply -auto-orient to
# physically rotate them upright, then the tag is normalized/dropped so
# downstream tools (montage, browsers) render them correctly.
"$MAGICK" "$PROC/machine-vendo-1.jpg" -auto-orient "$TMP/mv1.src.jpg"
"$MAGICK" "$PROC/machine-parqal.jpg" -auto-orient "$TMP/mp1.src.jpg"
"$MAGICK" "$PROC/machine-parqal-2.jpg" -auto-orient "$TMP/mp2.src.jpg"
"$MAGICK" "$PROC2/omj-2026-process-parqal-kids.jpg" -auto-orient "$TMP/kids.src.jpg"

grade_graphic "$TMP/mv1.src.jpg" "$TMP/mv1.g.jpg"
derivatives "$TMP/mv1.g.jpg" "$OUT/machine" "machine-vendo-1" 1600

grade_lowlight "$TMP/mp1.src.jpg" "$TMP/mp1.g.jpg"
derivatives "$TMP/mp1.g.jpg" "$OUT/machine" "machine-parqal" 1600

grade_lowlight "$TMP/mp2.src.jpg" "$TMP/mp2.g.jpg"
derivatives "$TMP/mp2.g.jpg" "$OUT/machine" "machine-parqal-2" 1600

echo "== People (already-cropped, grade only) =="
grade_lowlight "$TMP/kids.src.jpg" "$TMP/kids.g.jpg"
derivatives "$TMP/kids.g.jpg" "$OUT/people" "omj-process-parqal-kids" 1600

echo "== Contact sheet =="
shopt -s nullglob
PRIMARIES=(
  "$OUT"/locations/greenhills/loc-greenhills-01.jpg
  "$OUT"/locations/greenhills/loc-greenhills-01-portrait.jpg
  "$OUT"/locations/greenhills/loc-greenhills-02.jpg
  "$OUT"/locations/uptown/loc-uptown-01.jpg
  "$OUT"/locations/uptown/loc-uptown-02.jpg
  "$OUT"/locations/uptown/loc-uptown-03.jpg
  "$OUT"/locations/parqal/loc-parqal-01.jpg
  "$OUT"/locations/parqal/loc-parqal-02.jpg
  "$OUT"/locations/parqal/loc-parqal-03.jpg
  "$OUT"/locations/parqal/loc-parqal-04.jpg
  "$OUT"/locations/parqal/loc-parqal-05.jpg
  "$OUT"/locations/eastwood/loc-eastwood-01.jpg
  "$OUT"/locations/eastwood/loc-eastwood-02.jpg
  "$OUT"/locations/eastwood/loc-eastwood-03.jpg
  "$OUT"/locations/eastwood/loc-eastwood-04.jpg
  "$OUT"/locations/eastwood/loc-eastwood-05.jpg
  "$OUT"/locations/eastwood/loc-eastwood-06.jpg
  "$OUT"/locations/eastwood/loc-eastwood-07.jpg
  "$OUT"/locations/eastwood/loc-eastwood-08.jpg
  "$OUT"/machine/machine-vendo-1.jpg
  "$OUT"/machine/machine-parqal.jpg
  "$OUT"/machine/machine-parqal-2.jpg
  "$OUT"/people/omj-process-parqal-kids.jpg
)
"$MAGICK" montage "${PRIMARIES[@]}" -tile 5x -geometry 300x225+4+4 -background '#222' "$OUT/contact-sheet.jpg"

echo "Done. Outputs in $OUT"
