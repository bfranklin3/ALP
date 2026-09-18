#!/usr/bin/env bash
# Build ALP-Plants-Line-1.0.0.sh3f — black line-art plan icons only.
# No planIconFill: open SVG strokes cannot produce a paired wash layer (avoids solid-square fills).
# For SPIKE-28 default wash / custom tint / None, use libraries/ALP-Plants-1.0.0 instead.
set -euo pipefail

ROOT="$(cd "$(dirname "$0")/.." && pwd)"
LIB="$ROOT/libraries/ALP-Plants-Line-1.0.0"
BUILD="$LIB/build"
SH3F="$LIB/ALP-Plants-Line-1.0.0.sh3f"
RASTER="$ROOT/scripts/rasterize-svg-symbols.py"
PLACEHOLDER="$ROOT/libraries/ALP-Plants-1.0.0/models/plant-placeholder.obj"

SRC="${SRC:-/Users/billfranklin/Documents/Misc/Landspace LIBRARY Files/AdobeStock_2112452647 Trees top view 1-separated}"

if [[ ! -d "$SRC" ]]; then
  echo "SVG source not found: $SRC" >&2
  exit 1
fi

mkdir -p "$BUILD/staging"
SYMBOL_COUNT=$(find "$SRC" -maxdepth 1 -name '*.svg' | wc -l | tr -d ' ')

echo "Rasterizing $SYMBOL_COUNT SVG(s) from: $SRC"
python3 "$RASTER" "$SRC" "$BUILD" --size 2048 --pad 14

MODEL_SIZE=$(wc -c < "$PLACEHOLDER" | tr -d ' ')
PROPS="$BUILD/staging/PluginFurnitureCatalog.properties"

python3 - "$PROPS" "$MODEL_SIZE" "$SYMBOL_COUNT" <<'PY'
import sys
out_path, model_size, count = sys.argv[1], sys.argv[2], int(sys.argv[3])
spread_cm, height_cm = "182.88", "243.84"
lines = [
    "id=alp-plants-line-1",
    "name=ALP Plants - Line",
    "description=Black line-art tree plan symbols (outline only). Use ALP Plants for watercolor wash and Plan fill color.",
    "version=1.0.4",
    "license=Proprietary - ALP CAD (Adobe Stock artwork - verify license before redistribution)",
    "provider=ALP CAD",
    "",
]
for n in range(1, count + 1):
    num = f"{n:02d}"
    lines.extend([
        f"name#{n}=Line Tree {num}",
        f"id#{n}=alp-line-tree-{num}",
        f"category#{n}=ALP Plants Line",
        f"description#{n}=Line Tree {num}. Black outline only; pair with area/polyline fills on plan.",
        f"tags#{n}=plant, tree, landscape, line, alp",
        f"creator#{n}=ALP CAD",
        f"width#{n}={spread_cm}",
        f"depth#{n}={spread_cm}",
        f"height#{n}={height_cm}",
        f"model#{n}=/models/plant-placeholder.obj",
        f"modelSize#{n}={model_size}",
        f"icon#{n}=/icons/tree-{num}.png",
        f"planIcon#{n}=/plan-icons/tree-{num}.png",
        f"planIconLine#{n}\\:CONTENT=/plan-icons-line/tree-{num}.png",
        f"movable#{n}=true",
        f"doorOrWindow#{n}=false",
        f"resizable#{n}=true",
        f"deformable#{n}=false",
        f"texturable#{n}=false",
        "",
    ])
with open(out_path, "w", encoding="iso-8859-1", newline="\n") as f:
    f.write("\n".join(lines))
PY

echo "Packaging .sh3f..."
rm -f "$SH3F"
(
  cd "$BUILD/staging"
  mkdir -p models icons plan-icons plan-icons-line
  cp "$PLACEHOLDER" models/
  cp "$BUILD/icons"/tree-*.png icons/
  cp "$BUILD/plan-icons"/tree-*.png plan-icons/
  cp "$BUILD/plan-icons"/tree-*.png plan-icons-line/
  zip -rq "$SH3F" PluginFurnitureCatalog.properties models icons plan-icons plan-icons-line
)

echo "Built: $SH3F (v1.0.4, line only — no planIconFill; avoids square wash artifacts)"
