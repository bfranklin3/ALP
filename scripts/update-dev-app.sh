#!/usr/bin/env bash
# Build ALP-Core and refresh the local Sweet Home 3D Dev.app bundle.
# On recent macOS, in-place JAR updates inside a signed .app can fail with
# "Operation not permitted" (com.apple.macl) after reboot. This script falls
# back to rebuilding the bundle via ditto + re-sign.
set -euo pipefail

ROOT="$(cd "$(dirname "$0")/.." && pwd)"
SRC="$ROOT/source/SweetHome3D-7.5-src"
APP="$SRC/install/Sweet Home 3D Dev.app"
REBUILD="$SRC/install/Sweet Home 3D Dev-rebuild.app"
JAR_SRC="$SRC/install/SweetHome3D-7.5-modern.jar"
JAR_DEST="$APP/Contents/app/SweetHome3D.jar"

if [[ "$(uname -s)" != "Darwin" ]]; then
  echo "This script is for macOS (codesign / .app bundle)." >&2
  exit 1
fi

if [[ ! -d "$APP" ]]; then
  if [[ -d "$REBUILD" ]]; then
    echo "Dev app missing; promoting rebuild bundle..."
    mv "$REBUILD" "$APP"
  else
    echo "Dev app not found: $APP" >&2
    exit 1
  fi
fi

refresh_bundle() {
  local target="$1"
  echo "Refreshing macOS bundle (quarantine, signature, modified date)..."
  xattr -cr "$target" 2>/dev/null || true
  codesign --force --deep --sign - "$target"
  touch "$target"
  codesign --verify --deep --strict "$target"
}

install_jar_into() {
  local jar_dest="$1"
  cp "$JAR_SRC" "$jar_dest"
}

echo "Building modern desktop JAR..."
(cd "$SRC" && ant -f build.xml buildModernDesktop jarExecutableModernDesktop)

if [[ ! -f "$JAR_SRC" ]]; then
  echo "Build output not found: $JAR_SRC" >&2
  exit 1
fi

echo "Installing JAR into Dev app..."
if install_jar_into "$JAR_DEST" 2>/dev/null; then
  echo "In-place JAR update succeeded."
  refresh_bundle "$APP"
else
  echo ""
  echo "In-place update blocked by macOS file protection (com.apple.macl)."
  echo "Rebuilding app bundle from a copy..."
  rm -rf "$REBUILD"
  ditto "$APP" "$REBUILD"
  install_jar_into "$REBUILD/Contents/app/SweetHome3D.jar"
  refresh_bundle "$REBUILD"

  if rm -rf "$APP" 2>/dev/null; then
    mv "$REBUILD" "$APP"
    echo "Replaced locked Dev app with rebuilt bundle."
  else
    echo ""
    echo "Could not remove the old Dev app automatically."
    echo "1. Move this to Trash in Finder:"
    echo "     $APP"
    echo "2. Then run:"
    echo "     mv \"$REBUILD\" \"$APP\""
    echo ""
    echo "You can use the rebuilt app immediately:"
    echo "     open \"$REBUILD\""
    exit 1
  fi
fi

echo ""
echo "Done. Dev app ready:"
echo "  $APP"
stat -f "  Date Modified: %Sm" -t "%Y-%m-%d %H:%M:%S" "$APP"
