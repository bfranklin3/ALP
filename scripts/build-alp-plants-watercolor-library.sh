#!/usr/bin/env bash
# Build ALP-Plants-Watercolor-1.0.0.sh3f — Presentation (color) plan icons only.
set -euo pipefail

ROOT="$(cd "$(dirname "$0")/.." && pwd)"
LIB="$ROOT/libraries/ALP-Plants-Watercolor-1.0.0"
BUILD="$LIB/build"
SH3F="$LIB/ALP-Plants-Watercolor-1.0.0.sh3f"
RASTER="$ROOT/scripts/rasterize-svg-symbols.py"
PLACEHOLDER="$ROOT/libraries/ALP-Plants-1.0.0/models/plant-placeholder.obj"

# Override with SRC=... to point at your separated SVG folder.
SRC="${SRC:-/Users/billfranklin/Documents/Misc/Landspace LIBRARY Files/AdobeStock_2047851833 Water Color Trees-separated}"

if [[ ! -d "$SRC" ]]; then
  echo "SVG source not found: $SRC" >&2
  echo "Set SRC= to your separated SVG folder." >&2
  exit 1
fi

mkdir -p "$BUILD/staging"
SYMBOL_COUNT=$(find "$SRC" -maxdepth 1 -name '*.svg' | wc -l | tr -d ' ')
if [[ "$SYMBOL_COUNT" -eq 0 ]]; then
  echo "No SVG files in $SRC" >&2
  exit 1
fi

echo "Rasterizing $SYMBOL_COUNT SVG(s) from:"
echo "  $SRC"
python3 "$RASTER" "$SRC" "$BUILD" --size 2048 --pad 14

MODEL_SIZE=$(wc -c < "$PLACEHOLDER" | tr -d ' ')
PROPS="$BUILD/staging/PluginFurnitureCatalog.properties"

python3 - "$PROPS" "$MODEL_SIZE" "$SYMBOL_COUNT" <<'PY'
import sys

out_path, model_size, count = sys.argv[1], sys.argv[2], int(sys.argv[3])
# Default 6 ft × 6 ft plan footprint; height keeps prior 4:3 spread:height ratio (8 ft).
spread_cm = "182.88"
height_cm = "243.84"

lines = [
    "id=alp-plants-watercolor-1",
    "name=ALP Plants - Watercolor",
    "description=Watercolor tree plan symbols for ALP CAD (Presentation color icons; Draft uses same color until line art is added).",
    "version=1.0.1",
    "license=Proprietary - ALP CAD (Adobe Stock artwork - verify license before redistribution)",
    "provider=ALP CAD",
    "",
]

for n in range(1, count + 1):
    num = f"{n:02d}"
    name = f"Watercolor Tree {num}"
    lines.extend([
        f"name#{n}={name}",
        f"id#{n}=alp-wc-tree-{num}",
        f"category#{n}=ALP Plants Watercolor",
        f"description#{n}={name}. Watercolor presentation symbol; resize on plan as needed.",
        f"tags#{n}=plant, tree, landscape, watercolor, alp",
        f"creator#{n}=ALP CAD",
        f"width#{n}={spread_cm}",
        f"depth#{n}={spread_cm}",
        f"height#{n}={height_cm}",
        f"model#{n}=/models/plant-placeholder.obj",
        f"modelSize#{n}={model_size}",
        f"icon#{n}=/icons/tree-{num}.png",
        f"planIcon#{n}=/plan-icons/tree-{num}.png",
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
  mkdir -p models icons plan-icons
  cp "$PLACEHOLDER" models/
  cp "$BUILD/icons"/tree-*.png icons/
  cp "$BUILD/plan-icons"/tree-*.png plan-icons/
  zip -rq "$SH3F" PluginFurnitureCatalog.properties models icons plan-icons
)

echo "Built: $SH3F (v1.0.1, $SYMBOL_COUNT trees, 6 ft x 6 ft footprint, Presentation-only)"
echo "Import: Furniture -> Import furniture library..."
echo "Note: Draft mode (Cmd-Shift-D) shows the same color icons until planIconLine assets are added."
