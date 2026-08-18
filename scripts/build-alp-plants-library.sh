#!/usr/bin/env bash
# Split plant symbol sheet and build ALP-Plants-1.0.0.sh3f (SPIKE-10 / SPIKE-10b).
set -euo pipefail

ROOT="$(cd "$(dirname "$0")/.." && pwd)"
LIB="$ROOT/libraries/ALP-Plants-1.0.0"
SRC="$LIB/source/plant-symbol-sheet.png"
BUILD="$LIB/build"
SH3F="$LIB/ALP-Plants-1.0.0.sh3f"
SPLIT="$ROOT/scripts/split-plant-symbol-sheet.py"

mkdir -p "$BUILD/staging"

echo "Splitting symbol sheet (trim, alpha, square pad)..."
python3 "$SPLIT" "$SRC" "$BUILD"

# grid_idx|slug|name|width cm|depth cm|height cm
entries=(
  "0|oak-deciduous-30|Live Oak - 30 ft spread|914.4|914.4|1219.2"
  "1|palm-accent-20|Palm - accent tree|609.6|609.6|914.4"
  "2|cedar-evergreen-25|Eastern Red Cedar - 25 ft|762.0|762.0|1066.8"
  "4|pear-ornamental-18|Ornamental Pear - 18 ft|548.6|548.6|762.0"
  "5|boxwood-hedge-3|Boxwood Hedge - 3 ft|914.4|91.4|91.4"
  "10|hydrangea-mass-5|Hydrangea Mass - 5 ft|152.4|152.4|152.4"
  "11|juniper-mound-4|Juniper Mound - 4 ft|121.9|121.9|121.9"
  "15|hosta-groundcover|Hosta Groundcover Patch|121.9|121.9|30.5"
  "16|liriope-edging|Liriope Edging Patch|152.4|152.4|25.4"
  "20|grass-ornamental|Ornamental Grass Clump|91.4|91.4|121.9"
  "22|lavender-accent|Lavender Accent|76.2|76.2|45.7"
  "25|shrub-generic-6|Mixed Shrub - 6 ft|182.9|182.9|182.9"
)

PROPS="$BUILD/staging/PluginFurnitureCatalog.properties"
MODEL_SIZE=$(wc -c < "$LIB/models/plant-placeholder.obj" | tr -d ' ')

python3 - "$PROPS" "$MODEL_SIZE" <<'PY'
import sys

out_path, model_size = sys.argv[1], sys.argv[2]
raw_entries = [
    ("0", "oak-deciduous-30", "Live Oak - 30 ft spread", "914.4", "914.4", "1219.2"),
    ("1", "palm-accent-20", "Palm - accent tree", "609.6", "609.6", "914.4"),
    ("2", "cedar-evergreen-25", "Eastern Red Cedar - 25 ft", "762.0", "762.0", "1066.8"),
    ("4", "pear-ornamental-18", "Ornamental Pear - 18 ft", "548.6", "548.6", "762.0"),
    ("5", "boxwood-hedge-3", "Boxwood Hedge - 3 ft", "914.4", "91.4", "91.4"),
    ("10", "hydrangea-mass-5", "Hydrangea Mass - 5 ft", "152.4", "152.4", "152.4"),
    ("11", "juniper-mound-4", "Juniper Mound - 4 ft", "121.9", "121.9", "121.9"),
    ("15", "hosta-groundcover", "Hosta Groundcover Patch", "121.9", "121.9", "30.5"),
    ("16", "liriope-edging", "Liriope Edging Patch", "152.4", "152.4", "25.4"),
    ("20", "grass-ornamental", "Ornamental Grass Clump", "91.4", "91.4", "121.9"),
    ("22", "lavender-accent", "Lavender Accent", "76.2", "76.2", "45.7"),
    ("25", "shrub-generic-6", "Mixed Shrub - 6 ft", "182.9", "182.9", "182.9"),
]

lines = [
    "id=alp-plants-phase1",
    "name=ALP Plants - Phase 1",
    "description=Starter plant symbols for ALP CAD site plans (trimmed transparent plan icons).",
    "version=1.0.2",
    "license=Proprietary - ALP CAD (symbol artwork - verify license before redistribution)",
    "provider=ALP CAD",
    "",
]

for n, (grid_idx, slug, name, width, depth, height) in enumerate(raw_entries, start=1):
    num = f"{int(grid_idx) + 1:02d}"
    lines.extend([
        f"name#{n}={name}",
        f"id#{n}=alp-plt-{slug}",
        f"category#{n}=ALP Plants",
        f"description#{n}={name}. Default plan footprint; resize on plan as needed.",
        f"tags#{n}=plant, landscape, alp",
        f"creator#{n}=ALP CAD",
        f"width#{n}={width}",
        f"depth#{n}={depth}",
        f"height#{n}={height}",
        f"model#{n}=/models/plant-placeholder.obj",
        f"modelSize#{n}={model_size}",
        f"icon#{n}=/icons/plant-{num}.png",
        f"planIcon#{n}=/plan-icons/plant-{num}.png",
        f"planIconLine#{n}\\:CONTENT=/plan-icons-line/plant-{num}.png",
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
  cp "$LIB/models/plant-placeholder.obj" models/
  for entry in "${entries[@]}"; do
    IFS='|' read -r grid_idx _ _ _ _ _ <<< "$entry"
    num=$(printf "%02d" "$((grid_idx + 1))")
    cp "$BUILD/icons/plant-${num}.png" icons/
    cp "$BUILD/plan-icons/plant-${num}.png" plan-icons/
    cp "$BUILD/plan-icons-line/plant-${num}.png" plan-icons-line/
  done
  zip -rq "$SH3F" PluginFurnitureCatalog.properties models icons plan-icons plan-icons-line
)

echo "Built: $SH3F (v1.0.2)"
echo "Re-import: Furniture -> Import furniture library... (replace existing)"
