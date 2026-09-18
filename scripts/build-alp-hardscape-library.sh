#!/usr/bin/env bash
# Build ALP-Hardscape-1.0.0.sh3f — stepping stones and pavers (SPIKE-11 hardscape pack).
set -euo pipefail

ROOT="$(cd "$(dirname "$0")/.." && pwd)"
LIB="$ROOT/libraries/ALP-Hardscape-1.0.0"
SH3F="$LIB/ALP-Hardscape-1.0.0.sh3f"
GENERATOR="$ROOT/scripts/generate-alp-hardscape-library.py"

echo "Generating hardscape catalog assets..."
python3 "$GENERATOR" "$LIB"

echo "Packaging .sh3f..."
rm -f "$SH3F"
(
  cd "$LIB/build/staging"
  zip -rq "$SH3F" PluginFurnitureCatalog.properties models icons plan-icons-fill plan-icons-line
)

count=$(grep -c '^name#' "$LIB/build/staging/PluginFurnitureCatalog.properties")
echo "Built: $SH3F ($count catalog entries, layered line + fill, v1.0.4)"
echo "Re-import: Furniture -> Import furniture library..."
