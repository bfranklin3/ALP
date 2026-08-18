#!/usr/bin/env python3
"""Split plant symbol sheet into trimmed transparent PNGs (SPIKE-10b)."""
from __future__ import annotations

import argparse
from pathlib import Path

from PIL import Image

COLS = 5
ROWS = 6
COL_W = [99, 99, 99, 99, 100]
ROW_H = [93, 93, 93, 93, 93, 92]
HALF_X = sum(COL_W)


def cell_origin(index: int) -> tuple[int, int, int, int]:
    row, col = divmod(index, COLS)
    x = sum(COL_W[:col])
    y = sum(ROW_H[:row])
    return x, y, COL_W[col], ROW_H[row]


def ink_bbox(img: Image.Image, white_threshold: int = 250) -> tuple[int, int, int, int] | None:
    px = img.load()
    w, h = img.size
    minx, miny, maxx, maxy = w, h, 0, 0
    found = False
    for yy in range(h):
        for xx in range(w):
            r, g, b = px[xx, yy][:3]
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


def white_and_watermark_to_alpha(img: Image.Image, white_threshold: int = 248) -> Image.Image:
    """Make white paper and faint gray watermark pixels transparent."""
    rgba = to_rgba(img)
    px = rgba.load()
    w, h = rgba.size
    for yy in range(h):
        for xx in range(w):
            r, g, b, a = px[xx, yy]
            if a == 0:
                continue
            mx = max(r, g, b)
            mn = min(r, g, b)
            # Pure/near white background
            if r >= white_threshold and g >= white_threshold and b >= white_threshold:
                px[xx, yy] = (255, 255, 255, 0)
                continue
            # Faint neutral watermark (dreamstime-style gray), keep green wash
            if mx - mn < 18 and mx > 185 and g < max(r, b) + 8:
                px[xx, yy] = (r, g, b, 0)
    return rgba


def trim_and_pad(
    img: Image.Image,
    *,
    pad: int,
    square: bool = True,
    rotate: int = 0,
) -> Image.Image:
    img = to_rgba(img)
    if rotate:
        img = img.rotate(rotate, expand=True, fillcolor=(255, 255, 255, 0))
    img = white_and_watermark_to_alpha(img)
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


def crop_cell(sheet: Image.Image, index: int, *, color_half: bool) -> Image.Image:
    x, y, w, h = cell_origin(index)
    if color_half:
        x += HALF_X
    return sheet.crop((x, y, x + w, y + h))


def make_catalog_icon(plan_icon: Image.Image, size: int = 128) -> Image.Image:
    icon = plan_icon.copy()
    icon.thumbnail((size, size), Image.Resampling.LANCZOS)
    return icon


def process_sheet(
    src: Path,
    out_dir: Path,
    *,
    color_pad: int = 14,
    line_pad: int = 6,
    icon_size: int = 128,
) -> None:
    sheet = Image.open(src)
    for d in ("plan-icons", "plan-icons-line", "icons"):
        (out_dir / d).mkdir(parents=True, exist_ok=True)

    for index in range(COLS * ROWS):
        num = f"{index + 1:02d}"
        line_raw = crop_cell(sheet, index, color_half=False)
        color_raw = crop_cell(sheet, index, color_half=True)

        line = trim_and_pad(line_raw, pad=line_pad, square=True)
        color = trim_and_pad(color_raw, pad=color_pad, square=True)

        line_path = out_dir / "plan-icons-line" / f"plant-{num}.png"
        color_path = out_dir / "plan-icons" / f"plant-{num}.png"
        icon_path = out_dir / "icons" / f"plant-{num}.png"

        line.save(line_path, optimize=True)
        color.save(color_path, optimize=True)
        make_catalog_icon(color, icon_size).save(icon_path, optimize=True)


def main() -> None:
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("source", type=Path, help="plant-symbol-sheet.png")
    parser.add_argument("output_dir", type=Path, help="build output directory")
    args = parser.parse_args()
    process_sheet(args.source, args.output_dir)
    print(f"Wrote 30 symbols x 3 assets under {args.output_dir}")


if __name__ == "__main__":
    main()
