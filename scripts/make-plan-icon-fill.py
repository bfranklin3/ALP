#!/usr/bin/env python3
"""Generate canopy wash PNGs from line plan icons (SPIKE-28 planIconFill).

Synthetic washes are a dev fallback only — paired watercolor art (symbol sheet right
column) is the production source. This script:
  1. Dilates ink until branch gaps close (moderate, stops before canvas edge)
  2. Fills holes *inside* that silhouette (never floods from center)
  3. Blurs the solid silhouette for outward bleed (not a stroke halo)
"""
from __future__ import annotations

import argparse
from collections import deque
from pathlib import Path

from PIL import Image, ImageFilter

INK_THRESHOLD = 250
MAX_COVERAGE = 0.62  # reject fills that cover too much of the square canvas


def line_mask(line: Image.Image) -> Image.Image:
    rgba = line.convert("RGBA")
    px = rgba.load()
    w, h = rgba.size
    mask = Image.new("L", (w, h), 0)
    mpx = mask.load()
    for yy in range(h):
        for xx in range(w):
            r, g, b, a = px[xx, yy]
            if a == 0:
                continue
            if r < INK_THRESHOLD or g < INK_THRESHOLD or b < INK_THRESHOLD:
                mpx[xx, yy] = 255
    return mask


def touches_border(mask: Image.Image) -> bool:
    w, h = mask.size
    px = mask.load()
    for x in range(w):
        if px[x, 0] or px[x, h - 1]:
            return True
    for y in range(h):
        if px[0, y] or px[w - 1, y]:
            return True
    return False


def dilate_mask(mask: Image.Image, *, passes: int, size: int = 5) -> Image.Image:
    if passes <= 0:
        return mask.copy()
    filt_size = size if size % 2 == 1 else size + 1
    out = mask
    for _ in range(passes):
        out = out.filter(ImageFilter.MaxFilter(filt_size))
    return out


def fill_holes_in_silhouette(ink: Image.Image) -> Image.Image:
    """Fill enclosed gaps inside ink; background reachable from border stays empty."""
    w, h = ink.size
    ink_px = ink.load()
    exterior = bytearray(w * h)
    q: deque[tuple[int, int]] = deque()

    def seed(x: int, y: int) -> None:
        if ink_px[x, y] == 0 and not exterior[y * w + x]:
            exterior[y * w + x] = 1
            q.append((x, y))

    for x in range(w):
        seed(x, 0)
        seed(x, h - 1)
    for y in range(h):
        seed(0, y)
        seed(w - 1, y)

    while q:
        x, y = q.popleft()
        for nx, ny in ((x - 1, y), (x + 1, y), (x, y - 1), (x, y + 1)):
            if nx < 0 or ny < 0 or nx >= w or ny >= h:
                continue
            idx = ny * w + nx
            if exterior[idx] or ink_px[nx, ny] != 0:
                continue
            exterior[idx] = 1
            q.append((nx, ny))

    filled = ink.copy()
    fpx = filled.load()
    for yy in range(h):
        for xx in range(w):
            if ink_px[xx, yy] == 0 and not exterior[yy * w + xx]:
                fpx[xx, yy] = 255
    return filled


def coverage_fraction(mask: Image.Image) -> float:
    px = mask.load()
    w, h = mask.size
    on = sum(1 for yy in range(h) for xx in range(w) if px[xx, yy] > 0)
    return on / (w * h)


def build_silhouette(ink: Image.Image, *, max_passes: int = 14) -> Image.Image | None:
    """Dilate just enough to close canopy gaps without touching canvas edges."""
    for passes in range(max_passes, 0, -1):
        dilated = dilate_mask(ink, passes=passes, size=5)
        if touches_border(dilated):
            continue
        solid = fill_holes_in_silhouette(dilated)
        if coverage_fraction(solid) <= MAX_COVERAGE:
            return solid
    return None


def make_fill_from_line(
    line_path: Path,
    out_path: Path,
    *,
    max_dilate_passes: int = 14,
    bleed: int = 14,
    bleed_dilate: int = 4,
) -> bool:
    line = Image.open(line_path)
    ink = line_mask(line)
    silhouette = build_silhouette(ink, max_passes=max_dilate_passes)
    if silhouette is None:
        print(f"  SKIP {line_path.name} (cannot build canopy silhouette)")
        return False

    wash_mask = silhouette
    if bleed_dilate > 0:
        wash_mask = dilate_mask(wash_mask, passes=bleed_dilate, size=5)
    if bleed > 0:
        wash_mask = wash_mask.filter(ImageFilter.GaussianBlur(radius=bleed))

    fill = Image.new("RGBA", line.size, (0, 0, 0, 0))
    fpx = fill.load()
    wpx = wash_mask.load()
    w, h = fill.size
    for yy in range(h):
        for xx in range(w):
            intensity = wpx[xx, yy]
            if intensity > 0:
                fpx[xx, yy] = (120, 180, 90, intensity)
    fill.save(out_path, optimize=True)
    return True


def process_folder(
    input_dir: Path,
    output_dir: Path,
    *,
    max_dilate_passes: int = 14,
    bleed: int = 14,
    bleed_dilate: int = 4,
    pattern: str = "*.png",
) -> tuple[int, int]:
    output_dir.mkdir(parents=True, exist_ok=True)
    ok = skipped = 0
    for src in sorted(input_dir.glob(pattern)):
        if src.parent.name == "icons":
            continue
        if make_fill_from_line(
            src,
            output_dir / src.name,
            max_dilate_passes=max_dilate_passes,
            bleed=bleed,
            bleed_dilate=bleed_dilate,
        ):
            ok += 1
            print(f"  {src.name} -> {output_dir.name}/{src.name}")
        else:
            skipped += 1
    return ok, skipped


def main() -> None:
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("line_dir", type=Path)
    parser.add_argument("output_dir", type=Path)
    parser.add_argument("--max-dilate-passes", type=int, default=14)
    parser.add_argument("--bleed", type=int, default=14, help="Blur radius for outer soft edge")
    parser.add_argument("--bleed-dilate", type=int, default=4, help="Outward expand before blur")
    args = parser.parse_args()
    if not args.line_dir.is_dir():
        raise SystemExit(f"Not a directory: {args.line_dir}")
    print(f"Generating canopy wash fills from {args.line_dir} ...")
    ok, skipped = process_folder(
        args.line_dir,
        args.output_dir,
        max_dilate_passes=args.max_dilate_passes,
        bleed=args.bleed,
        bleed_dilate=args.bleed_dilate,
    )
    print(f"Done. {ok} fill(s), {skipped} skipped -> {args.output_dir}")


if __name__ == "__main__":
    main()
