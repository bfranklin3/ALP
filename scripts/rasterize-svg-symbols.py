#!/usr/bin/env python3
"""Rasterize one SVG per file into plan-icons + catalog icons (Presentation PNGs).

Uses macOS Quick Look (qlmanage) when available. Trims near-white margins to alpha
and pads to a square canvas — same idea as split-plant-symbol-sheet.py.
"""
from __future__ import annotations

import argparse
import re
import shutil
import subprocess
import sys
import tempfile
from pathlib import Path

from PIL import Image

NUMBER_SUFFIX = re.compile(r"(\d+)\s*$")


def ink_bbox(img: Image.Image, white_threshold: int = 250) -> tuple[int, int, int, int] | None:
    px = img.load()
    w, h = img.size
    minx, miny, maxx, maxy = w, h, 0, 0
    found = False
    for yy in range(h):
        for xx in range(w):
            r, g, b, a = px[xx, yy]
            if a == 0:
                continue
            if r < white_threshold or g < white_threshold or b < white_threshold:
                found = True
                minx = min(minx, xx)
                miny = min(miny, yy)
                maxx = max(maxx, xx)
                maxy = max(maxy, yy)
    if not found:
        return None
    return minx, miny, maxx + 1, maxy + 1


def to_rgba(img: Image.Image) -> Image.Image:
    return img.convert("RGBA") if img.mode != "RGBA" else img.copy()


def white_to_alpha(img: Image.Image, white_threshold: int = 248) -> Image.Image:
    rgba = to_rgba(img)
    px = rgba.load()
    w, h = rgba.size
    for yy in range(h):
        for xx in range(w):
            r, g, b, a = px[xx, yy]
            if a == 0:
                continue
            if r >= white_threshold and g >= white_threshold and b >= white_threshold:
                px[xx, yy] = (255, 255, 255, 0)
    return rgba


def trim_and_pad(img: Image.Image, *, pad: int, square: bool = True) -> Image.Image:
    img = white_to_alpha(img)
    box = ink_bbox(img)
    if box is None:
        return img
    trimmed = img.crop(box)
    tw, th = trimmed.size
    if square:
        side = max(tw, th) + 2 * pad
        canvas = Image.new("RGBA", (side, side), (255, 255, 255, 0))
        ox = (side - tw) // 2
        oy = (side - th) // 2
        canvas.paste(trimmed, (ox, oy), trimmed)
        return canvas
    canvas = Image.new("RGBA", (tw + 2 * pad, th + 2 * pad), (255, 255, 255, 0))
    canvas.paste(trimmed, (pad, pad), trimmed)
    return canvas


def make_catalog_icon(plan_icon: Image.Image, size: int = 128) -> Image.Image:
    icon = plan_icon.copy()
    icon.thumbnail((size, size), Image.Resampling.LANCZOS)
    return icon


def qlmanage_path() -> str | None:
    return shutil.which("qlmanage")


def rasterize_svg(svg_path: Path, *, size: int, tmp_dir: Path) -> Path:
    ql = qlmanage_path()
    if ql is None:
        raise SystemExit("qlmanage not found (macOS Quick Look). Export PNGs manually or install rsvg-convert.")
    subprocess.run(
        [ql, "-t", "-s", str(size), "-o", str(tmp_dir), str(svg_path)],
        check=True,
        capture_output=True,
    )
    png = tmp_dir / f"{svg_path.name}.png"
    if not png.exists():
        matches = list(tmp_dir.glob(f"{svg_path.stem}*.png"))
        if not matches:
            raise SystemExit(f"qlmanage produced no PNG for {svg_path}")
        png = matches[0]
    return png


def sort_key(path: Path) -> tuple[int, str]:
    match = NUMBER_SUFFIX.search(path.stem)
    if match:
        return int(match.group(1)), path.name
    return 10_000, path.name


def process_folder(
    input_dir: Path,
    output_dir: Path,
    *,
    raster_size: int = 2048,
    pad: int = 14,
    icon_size: int = 128,
) -> list[tuple[int, Path]]:
    svgs = sorted(input_dir.glob("*.svg"), key=sort_key)
    if not svgs:
        raise SystemExit(f"No SVG files in {input_dir}")

    plan_dir = output_dir / "plan-icons"
    icon_dir = output_dir / "icons"
    plan_dir.mkdir(parents=True, exist_ok=True)
    icon_dir.mkdir(parents=True, exist_ok=True)

    written: list[tuple[int, Path]] = []
    with tempfile.TemporaryDirectory(prefix="alp-svg-raster-") as tmp:
        tmp_dir = Path(tmp)
        for index, svg in enumerate(svgs, start=1):
            raw_png = rasterize_svg(svg, size=raster_size, tmp_dir=tmp_dir)
            raw = Image.open(raw_png)
            plan = trim_and_pad(raw, pad=pad, square=True)
            num = f"{index:02d}"
            plan_path = plan_dir / f"tree-{num}.png"
            icon_path = icon_dir / f"tree-{num}.png"
            plan.save(plan_path, optimize=True)
            make_catalog_icon(plan, icon_size).save(icon_path, optimize=True)
            written.append((index, plan_path))
            print(f"  {svg.name} -> tree-{num}.png")
    return written


def main() -> None:
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("input_dir", type=Path, help="Directory of single-symbol SVG files")
    parser.add_argument("output_dir", type=Path, help="Build output (plan-icons/, icons/)")
    parser.add_argument("--size", type=int, default=2048, help="Raster long edge via qlmanage (default: 2048)")
    parser.add_argument("--pad", type=int, default=14, help="Transparent padding after trim (default: 14)")
    parser.add_argument("--icon-size", type=int, default=128, help="Catalog icon max dimension (default: 128)")
    args = parser.parse_args()
    if not args.input_dir.is_dir():
        raise SystemExit(f"Not a directory: {args.input_dir}")
    print(f"Rasterizing {args.input_dir} ...")
    items = process_folder(
        args.input_dir,
        args.output_dir,
        raster_size=args.size,
        pad=args.pad,
        icon_size=args.icon_size,
    )
    print(f"Done. {len(items)} symbol(s) -> {args.output_dir}")


if __name__ == "__main__":
    main()
