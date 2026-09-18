#!/usr/bin/env bash
# Build ALP Plants library from high-res Gemini side-by-side PNG sources.
set -euo pipefail

ROOT="$(cd "$(dirname "$0")/.." && pwd)"
SRC_DIR="${1:-$HOME/Downloads/ALP Plant Library Images/Trans PNG}"
LIB="$ROOT/libraries/ALP-Plants-2.0.0"
BUILD="$LIB/build"
SH3F="$LIB/ALP-Plants-2.0.0.sh3f"
BATCH="$ROOT/scripts/batch-split-gemini-plants.py"
CATALOG_GEN="$ROOT/scripts/generate-plants-catalog-json.py"
CATALOG="$LIB/plants.catalog.json"
MANIFEST="$BUILD/gemini-manifest.json"
ORDER="$LIB/gemini-stem-order.json"
MATCHED="$ROOT/scripts/add-gemini-matched-pairs.py"
PLANT15="$ROOT/scripts/add-gemini-plant15-pairs.py"

mkdir -p "$BUILD/staging"

echo "Generating plants.catalog.json..."
python3 "$CATALOG_GEN"

echo "Splitting standard Gemini plant pairs (fixed stem order 01-25)..."
python3 "$BATCH" "$SRC_DIR" "$BUILD" --manifest "$MANIFEST" --order-file "$ORDER"

echo "Adding Plant 14 matched pairs (26-30)..."
python3 "$MATCHED" "$SRC_DIR" "$BUILD" \
  --line-prefix "Gemini Various Plant 14b copy " \
  --color-prefix "Gemini Various Plant 14c copy " \
  --series-name "Various Plant 14" \
  --manifest "$MANIFEST" \
  --start-num 26

echo "Adding Plant 15 matched pairs (31-33)..."
python3 "$PLANT15" "$SRC_DIR" "$BUILD" --manifest "$MANIFEST" --start-num 31

PROPS="$BUILD/staging/PluginFurnitureCatalog.properties"
MODEL="$ROOT/libraries/ALP-Plants-1.0.0/models/plant-placeholder.obj"
MODEL_SIZE=$(wc -c < "$MODEL" | tr -d ' ')

python3 - "$PROPS" "$MODEL_SIZE" "$CATALOG" <<'PY'
import json
import sys

out_path, model_size, catalog_path = sys.argv[1:4]
catalog = json.loads(open(catalog_path, encoding="utf-8").read())
entries = catalog["entries"]
lib_version = catalog.get("libraryVersion", "2.1.0")

lines = [
    "id=alp-plants-gemini-2",
    "name=ALP Plants - Gemini Collection",
    "description=High-resolution plant symbols from Gemini artwork (line + watercolor pairs).",
    f"version={lib_version}",
    "license=Proprietary - ALP CAD (symbol artwork - verify license before redistribution)",
    "provider=ALP CAD",
    "",
]

for n, entry in enumerate(entries, start=1):
    stem = entry["stem"]
    num = stem.split("-", 1)[1]
    name = entry["name"]
    piece_id = entry["id"]
    width = entry["widthCm"]
    depth = entry["depthCm"]
    height = entry["heightCm"]
    lines.extend([
        f"name#{n}={name}",
        f"id#{n}={piece_id}",
        f"category#{n}=ALP Plants",
        f"description#{n}={name}. High-res Gemini symbol; resize on plan as needed.",
        f"tags#{n}=plant, landscape, alp, gemini",
        f"creator#{n}=ALP CAD",
        f"width#{n}={width}",
        f"depth#{n}={depth}",
        f"height#{n}={height}",
        f"model#{n}=/models/plant-placeholder.obj",
        f"modelSize#{n}={model_size}",
        f"icon#{n}=/icons/plant-{num}.png",
        f"planIcon#{n}=/plan-icons-line/plant-{num}.png",
        f"planIconLine#{n}\\:CONTENT=/plan-icons-line/plant-{num}.png",
        f"planIconFill#{n}\\:CONTENT=/plan-icons/plant-{num}.png",
        f"movable#{n}=true",
        f"doorOrWindow#{n}=false",
        f"resizable#{n}=true",
        f"deformable#{n}=false",
        f"texturable#{n}=false",
        f"alp.plant.assetType#{n}=png",
        f"alp.plant.supportsTint#{n}=true",
        f"alp.plant.isSymmetrical#{n}=true",
        f"alp.plant.supportsRandomRotation#{n}=true",
        f"alp.plant.supportsRandomScale#{n}=true",
        f"alp.plant.defaultSpacing#{n}=137.2",
        f"alp.plant.scheduleName#{n}={name}",
        "",
    ])

with open(out_path, "w", encoding="iso-8859-1", newline="\n") as f:
    f.write("\n".join(lines))
print(f"Wrote catalog properties for {len(entries)} plant variants")
PY

echo "Packaging .sh3f..."
rm -f "$SH3F"
(
  cd "$BUILD/staging"
  mkdir -p models icons plan-icons plan-icons-line
  cp "$MODEL" models/
  while IFS= read -r stem; do
    num="${stem#plant-}"
    cp "$BUILD/icons/plant-${num}.png" icons/
    cp "$BUILD/plan-icons/plant-${num}.png" plan-icons/
    cp "$BUILD/plan-icons-line/plant-${num}.png" plan-icons-line/
  done < <(python3 - "$MANIFEST" <<'PY'
import json, sys
manifest = json.loads(open(sys.argv[1], encoding="utf-8").read())
for entry in manifest["processed"]:
    print(entry["stem"])
PY
)
  zip -rq "$SH3F" PluginFurnitureCatalog.properties models icons plan-icons plan-icons-line
)

count=$(python3 - "$CATALOG" <<'PY'
import json, sys
print(len(json.loads(open(sys.argv[1], encoding="utf-8").read())["entries"]))
PY
)

echo "Built: $SH3F ($count catalog entries from 33 artwork stems)"
echo "Catalog: $CATALOG"
echo "Manifest: $MANIFEST"
echo "Re-import: Furniture -> Import furniture library..."
