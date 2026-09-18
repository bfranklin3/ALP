#!/usr/bin/env python3
"""Split plant symbol sheet into trimmed transparent PNGs (SPIKE-10b)."""
from __future__ import annotations

import argparse
from pathlib import Path

from PIL import Image, ImageFilter

COLS = 5
ROWS = 6
COL_W = [99, 99, 99, 99, 100]
ROW_H = [93, 93, 93, 93, 93, 92]
HALF_X = sum(COL_W)
INK_THRESHOLD = 250


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


def _visible_pixel_count(img: Image.Image) -> int:
    return sum(1 for p in img.getdata() if p[3] > 10)


def thicken_plan_line_icon(img: Image.Image, *, passes: int = 1, size: int = 3) -> Image.Image:
    """Widen thin pencil strokes so sparse draft icons stay readable on plan."""
    rgba = to_rgba(img)
    alpha = rgba.split()[3]
    filt_size = size if size % 2 == 1 else size + 1
    for _ in range(passes):
        alpha = alpha.filter(ImageFilter.MaxFilter(filt_size))
    out = Image.new("RGBA", rgba.size, (255, 255, 255, 0))
    out.paste((0, 0, 0, 255), (0, 0), alpha)
    return out


def strengthen_plan_line_icon(
    img: Image.Image,
    *,
    ink_floor: int = 8,
    sparse_threshold: int = 25000,
    thicken_passes: int = 1,
) -> Image.Image:
    """Normalize faint pencil strokes to solid black ink for Draft plan view."""
    rgba = to_rgba(img)
    px = rgba.load()
    w, h = rgba.size
    for yy in range(h):
        for xx in range(w):
            r, g, b, a = px[xx, yy]
            if a < 16:
                continue
            mx = max(r, g, b)
            if mx >= 248:
                px[xx, yy] = (255, 255, 255, 0)
                continue
            strength = (255 - mx) * a / 255
            if strength < ink_floor:
                px[xx, yy] = (255, 255, 255, 0)
                continue
            px[xx, yy] = (0, 0, 0, 255)
    if _visible_pixel_count(rgba) < sparse_threshold and thicken_passes > 0:
        rgba = thicken_plan_line_icon(rgba, passes=thicken_passes)
    return rgba


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
    crop_box: tuple[int, int, int, int] | None = None,
) -> Image.Image:
    img = to_rgba(img)
    if rotate:
        img = img.rotate(rotate, expand=True, fillcolor=(255, 255, 255, 0))
    img = white_and_watermark_to_alpha(img)
    box = crop_box if crop_box is not None else ink_bbox(img)
    if box is None:
        return img
    trimmed = img.crop(box)
    tw, th = trimmed.size
    if square:
        side = max(tw, th) + 2 * pad
        canvas = Image.new("RGBA", (side, side), (255, 255, 255, 0))
        ox = (side - tw) // 2
        oy = (side - th) // 2
        canvas.paste(trimmed, (ox, oy))
        return canvas
    canvas = Image.new("RGBA", (tw + 2 * pad, th + 2 * pad), (255, 255, 255, 0))
    canvas.paste(trimmed, (pad, pad))
    return canvas


def paired_crop_box(line: Image.Image, color: Image.Image) -> tuple[int, int, int, int] | None:
    """Shared crop box so line and wash layers stay aligned (SPIKE-28)."""
    line = white_and_watermark_to_alpha(line)
    color = white_and_watermark_to_alpha(color)
    line_box = ink_bbox(line)
    color_box = ink_bbox(color)
    if line_box is None and color_box is None:
        return None
    if line_box is None:
        return color_box
    if color_box is None:
        return line_box
    return (
        min(line_box[0], color_box[0]),
        min(line_box[1], color_box[1]),
        max(line_box[2], color_box[2]),
        max(line_box[3], color_box[3]),
    )


def ink_mask(img: Image.Image) -> Image.Image:
    mask = Image.new("L", img.size, 0)
    px = img.load()
    mp = mask.load()
    for yy in range(img.size[1]):
        for xx in range(img.size[0]):
            r, g, b, a = px[xx, yy]
            if a and (r < INK_THRESHOLD or g < INK_THRESHOLD or b < INK_THRESHOLD):
                mp[xx, yy] = 255
    return mask


def align_to_reference(
    reference: Image.Image,
    layer: Image.Image,
    *,
    max_shift: int = 12,
) -> Image.Image:
    """Shift wash layer to maximize ink overlap with the line layer."""
    ref_m = ink_mask(reference)
    lay_m = ink_mask(layer)
    rw, rh = reference.size
    lw, lh = layer.size
    rp = ref_m.load()
    lp = lay_m.load()
    best_score = -1
    best_shift = (0, 0)
    for sx in range(-max_shift, max_shift + 1):
        for sy in range(-max_shift, max_shift + 1):
            score = 0
            for yy in range(rh):
                for xx in range(rw):
                    if not rp[xx, yy]:
                        continue
                    lx, ly = xx - sx, yy - sy
                    if 0 <= lx < lw and 0 <= ly < lh and lp[lx, ly]:
                        score += 1
            if score > best_score:
                best_score = score
                best_shift = (sx, sy)
    sx, sy = best_shift
    if sx == 0 and sy == 0:
        return layer
    aligned = Image.new("RGBA", layer.size, (255, 255, 255, 0))
    aligned.paste(layer, (sx, sy))
    return aligned


def trim_and_pad_paired(
    line_raw: Image.Image,
    color_raw: Image.Image,
    *,
    pad: int,
    square: bool = True,
) -> tuple[Image.Image, Image.Image]:
    """Trim line + wash with identical crop and padding for layered compositing."""
    line = white_and_watermark_to_alpha(to_rgba(line_raw))
    color = white_and_watermark_to_alpha(to_rgba(color_raw))
    box = paired_crop_box(line, color)
    if box is None:
        return line, color
    line_trim = line.crop(box)
    color_trim = color.crop(box)
    color_trim = align_to_reference(line_trim, color_trim)
    tw, th = line_trim.size
    if square:
        side = max(tw, th) + 2 * pad
        line_out = Image.new("RGBA", (side, side), (255, 255, 255, 0))
        color_out = Image.new("RGBA", (side, side), (255, 255, 255, 0))
        ox = (side - tw) // 2
        oy = (side - th) // 2
        line_out.paste(line_trim, (ox, oy))
        color_out.paste(color_trim, (ox, oy))
        return line_out, color_out
    line_out = Image.new("RGBA", (tw + 2 * pad, th + 2 * pad), (255, 255, 255, 0))
    color_out = Image.new("RGBA", (tw + 2 * pad, th + 2 * pad), (255, 255, 255, 0))
    line_out.paste(line_trim, (pad, pad))
    color_out.paste(color_trim, (pad, pad))
    return line_out, color_out


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
    pad: int = 14,
    icon_size: int = 128,
) -> None:
    sheet = Image.open(src)
    for d in ("plan-icons", "plan-icons-line", "icons"):
        (out_dir / d).mkdir(parents=True, exist_ok=True)

    for index in range(COLS * ROWS):
        num = f"{index + 1:02d}"
        line_raw = crop_cell(sheet, index, color_half=False)
        color_raw = crop_cell(sheet, index, color_half=True)

        line, color = trim_and_pad_paired(line_raw, color_raw, pad=pad, square=True)
        line = strengthen_plan_line_icon(line)

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
