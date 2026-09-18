#!/usr/bin/env python3
"""Split a side-by-side Gemini plant PNG into line + color plan icons."""
from __future__ import annotations

import argparse
import importlib.util
from pathlib import Path

from PIL import Image

ROOT = Path(__file__).resolve().parents[1]
_sheet_spec = importlib.util.spec_from_file_location(
    "split_plant_symbol_sheet",
    ROOT / "scripts" / "split-plant-symbol-sheet.py",
)
assert _sheet_spec and _sheet_spec.loader
_sheet = importlib.util.module_from_spec(_sheet_spec)
_sheet_spec.loader.exec_module(_sheet)
make_catalog_icon = _sheet.make_catalog_icon
strengthen_plan_line_icon = _sheet.strengthen_plan_line_icon
to_rgba = _sheet.to_rgba
white_and_watermark_to_alpha = _sheet.white_and_watermark_to_alpha

INK_THRESHOLD = 250


def visible_column_counts(img: Image.Image) -> list[int]:
    px = img.load()
    w, h = img.size
    counts: list[int] = []
    for x in range(w):
        n = 0
        for y in range(h):
            if px[x, y][3] > 16:
                n += 1
        counts.append(n)
    return counts


def content_runs(img: Image.Image) -> list[tuple[int, int]]:
    """Return inclusive x-ranges where any visible pixel exists."""
    counts = visible_column_counts(img)
    runs: list[tuple[int, int]] = []
    in_run = False
    start = 0
    for x, count in enumerate(counts):
        if count and not in_run:
            start = x
            in_run = True
        elif not count and in_run:
            runs.append((start, x - 1))
            in_run = False
    if in_run:
        runs.append((start, len(counts) - 1))
    return runs


def detect_gutter_bounds(img: Image.Image) -> tuple[int, int, int, int]:
    """Return left_end, right_start, gutter_x0, gutter_x1 (inclusive)."""
    w, _ = img.size
    runs = content_runs(img)
    if len(runs) < 2:
        mid = w // 2
        return mid, mid, mid, mid

    # Side-by-side pair: pick the empty gap between the two widest blobs.
    scored = sorted(runs, key=lambda r: r[1] - r[0], reverse=True)
    left_run = scored[0]
    right_run = scored[1]
    if left_run[0] > right_run[0]:
        left_run, right_run = right_run, left_run

    gutter_x0 = left_run[1] + 1
    gutter_x1 = right_run[0] - 1
    if gutter_x1 < gutter_x0:
        mid = w // 2
        return mid, mid, mid, mid
    return left_run[1] + 1, right_run[0], gutter_x0, gutter_x1


def strip_center_line(img: Image.Image, gutter_x0: int, gutter_x1: int) -> Image.Image:
    """Remove opaque dark divider pixels only inside the empty gutter."""
    out = img.copy()
    px = out.load()
    _, h = out.size
    for x in range(gutter_x0, gutter_x1 + 1):
        for y in range(h):
            r, g, b, a = px[x, y]
            if a < 128:
                continue
            if max(r, g, b) < 48:
                px[x, y] = (0, 0, 0, 0)
    return out


def split_halves(img: Image.Image, left_end: int, right_start: int) -> tuple[Image.Image, Image.Image]:
    """Split at content bounds without shaving pixels off either symbol."""
    w, h = img.size
    left_end = max(1, min(left_end, w - 1))
    right_start = max(left_end, min(right_start, w))
    return img.crop((0, 0, left_end, h)), img.crop((right_start, 0, w, h))


def visible_bbox(img: Image.Image, *, alpha_min: int = 16) -> tuple[int, int, int, int] | None:
    px = img.load()
    w, h = img.size
    minx, miny, maxx, maxy = w, h, 0, 0
    found = False
    for yy in range(h):
        for xx in range(w):
            if px[xx, yy][3] >= alpha_min:
                found = True
                minx = min(minx, xx)
                miny = min(miny, yy)
                maxx = max(maxx, xx)
                maxy = max(maxy, yy)
    if not found:
        return None
    return minx, miny, maxx + 1, maxy + 1


def ink_bbox(img: Image.Image, *, white_threshold: int = INK_THRESHOLD) -> tuple[int, int, int, int] | None:
    px = img.load()
    w, h = img.size
    minx, miny, maxx, maxy = w, h, 0, 0
    found = False
    for yy in range(h):
        for xx in range(w):
            r, g, b, a = px[xx, yy]
            if a < 16:
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


def expand_bbox(
    box: tuple[int, int, int, int],
    *,
    img_size: tuple[int, int],
    margin: int,
) -> tuple[int, int, int, int]:
    w, h = img_size
    x0, y0, x1, y1 = box
    return (
        max(0, x0 - margin),
        max(0, y0 - margin),
        min(w, x1 + margin),
        min(h, y1 + margin),
    )


def trim_and_pad_half(
    img: Image.Image,
    *,
    crop_box: tuple[int, int, int, int],
    pad: int,
    square: bool = True,
) -> Image.Image:
    trimmed = img.crop(crop_box)
    tw, th = trimmed.size
    if square:
        side = max(tw, th) + 2 * pad
        canvas = Image.new("RGBA", (side, side), (255, 255, 255, 0))
        ox = (side - tw) // 2
        oy = (side - th) // 2
        # Do not pass RGBA as paste mask onto a transparent canvas: Pillow
        # alpha-composites against white and wipes semi-transparent gray strokes.
        canvas.paste(trimmed, (ox, oy))
        return canvas
    canvas = Image.new("RGBA", (tw + 2 * pad, th + 2 * pad), (255, 255, 255, 0))
    canvas.paste(trimmed, (pad, pad))
    return canvas


def trim_and_pad_gemini_pair(
    line_raw: Image.Image,
    color_raw: Image.Image,
    *,
    pad: int,
    crop_margin: int = 4,
    square: bool = True,
) -> tuple[Image.Image, Image.Image]:
    """Trim each half using full silhouette so line strokes are not clipped."""
    line_visible = to_rgba(line_raw)
    color_visible = to_rgba(color_raw)

    line_silhouette = visible_bbox(line_visible)
    color_silhouette = visible_bbox(color_visible)
    if line_silhouette is None or color_silhouette is None:
        return line_visible, color_visible

    line_silhouette = expand_bbox(line_silhouette, img_size=line_visible.size, margin=crop_margin)
    color_silhouette = expand_bbox(color_silhouette, img_size=color_visible.size, margin=crop_margin)

    line_processed = white_and_watermark_to_alpha(line_visible.crop(line_silhouette))
    color_processed = white_and_watermark_to_alpha(color_visible.crop(color_silhouette))

    # Keep line crop generous: silhouette box, not stroke-only ink box.
    line_box = expand_bbox(
        visible_bbox(line_processed) or ink_bbox(line_processed) or (0, 0, *line_processed.size),
        img_size=line_processed.size,
        margin=0,
    )
    color_box = expand_bbox(
        visible_bbox(color_processed) or ink_bbox(color_processed) or (0, 0, *color_processed.size),
        img_size=color_processed.size,
        margin=0,
    )

    line_out = trim_and_pad_half(line_processed, crop_box=line_box, pad=pad, square=square)
    color_out = trim_and_pad_half(color_processed, crop_box=color_box, pad=pad, square=square)

    # Match output canvas size so Draft/Presentation stay aligned in the catalog.
    side = max(line_out.size[0], color_out.size[0], line_out.size[1], color_out.size[1])
    if line_out.size != (side, side):
        aligned = Image.new("RGBA", (side, side), (255, 255, 255, 0))
        aligned.paste(line_out, ((side - line_out.size[0]) // 2, (side - line_out.size[1]) // 2))
        line_out = aligned
    if color_out.size != (side, side):
        aligned = Image.new("RGBA", (side, side), (255, 255, 255, 0))
        aligned.paste(color_out, ((side - color_out.size[0]) // 2, (side - color_out.size[1]) // 2))
        color_out = aligned
    return line_out, color_out


def make_preview(
    source: Image.Image,
    cleaned: Image.Image,
    line: Image.Image,
    color: Image.Image,
    *,
    gutter: tuple[int, int],
) -> Image.Image:
    """Side-by-side before/after preview for visual QA."""
    thumb_h = 240
    panels = [source, cleaned, line, color]
    labels = ["source", "center stripped", "line (draft)", "color (presentation)"]
    scaled: list[Image.Image] = []
    for panel in panels:
        copy = panel.copy()
        ratio = thumb_h / copy.height
        copy = copy.resize((max(1, int(copy.width * ratio)), thumb_h), Image.Resampling.LANCZOS)
        scaled.append(copy)

    gap = 12
    label_h = 22
    total_w = sum(p.width for p in scaled) + gap * (len(scaled) - 1)
    canvas = Image.new("RGBA", (total_w, thumb_h + label_h + 8), (240, 240, 240, 255))
    x = 0
    for panel, label in zip(scaled, labels):
        canvas.paste(panel, (x, label_h + 4), panel)
        x += panel.width + gap
    return canvas


def process_pair(
    src: Path,
    out_dir: Path,
    *,
    stem: str,
    pad: int = 14,
    crop_margin: int = 4,
    icon_size: int = 128,
) -> dict[str, object]:
    source = Image.open(src).convert("RGBA")
    left_end, right_start, gutter_x0, gutter_x1 = detect_gutter_bounds(source)
    cleaned = strip_center_line(source, gutter_x0, gutter_x1)
    line_raw, color_raw = split_halves(cleaned, left_end, right_start)

    line, color = trim_and_pad_gemini_pair(
        line_raw,
        color_raw,
        pad=pad,
        crop_margin=crop_margin,
        square=True,
    )
    line = strengthen_plan_line_icon(line)

    for sub in ("plan-icons", "plan-icons-line", "icons"):
        (out_dir / sub).mkdir(parents=True, exist_ok=True)

    line_path = out_dir / "plan-icons-line" / f"{stem}.png"
    color_path = out_dir / "plan-icons" / f"{stem}.png"
    icon_path = out_dir / "icons" / f"{stem}.png"
    preview_path = out_dir / f"{stem}-preview.png"

    line.save(line_path, optimize=True)
    color.save(color_path, optimize=True)
    make_catalog_icon(color, icon_size).save(icon_path, optimize=True)
    make_preview(source, cleaned, line, color, gutter=(gutter_x0, gutter_x1)).save(
        preview_path, optimize=True
    )

    return {
        "left_end": left_end,
        "right_start": right_start,
        "gutter": (gutter_x0, gutter_x1),
        "line_size": line.size,
        "color_size": color.size,
        "line_path": line_path,
        "color_path": color_path,
        "icon_path": icon_path,
        "preview_path": preview_path,
    }


def process_matched_pair(
    line_src: Path,
    color_src: Path,
    out_dir: Path,
    *,
    stem: str,
    pad: int = 14,
    crop_margin: int = 4,
    icon_size: int = 128,
) -> dict[str, object]:
    """Process an already-split line PNG + color PNG pair."""
    line_raw = Image.open(line_src).convert("RGBA")
    color_raw = Image.open(color_src).convert("RGBA")
    line, color = trim_and_pad_gemini_pair(
        line_raw,
        color_raw,
        pad=pad,
        crop_margin=crop_margin,
        square=True,
    )
    line = strengthen_plan_line_icon(line)

    for sub in ("plan-icons", "plan-icons-line", "icons"):
        (out_dir / sub).mkdir(parents=True, exist_ok=True)

    line_path = out_dir / "plan-icons-line" / f"{stem}.png"
    color_path = out_dir / "plan-icons" / f"{stem}.png"
    icon_path = out_dir / "icons" / f"{stem}.png"
    preview_path = out_dir / f"{stem}-preview.png"

    line.save(line_path, optimize=True)
    color.save(color_path, optimize=True)
    make_catalog_icon(color, icon_size).save(icon_path, optimize=True)
    make_preview(line_raw, color_raw, line, color, gutter=(0, 0)).save(
        preview_path, optimize=True
    )

    return {
        "line_source": line_src.name,
        "color_source": color_src.name,
        "line_size": line.size,
        "color_size": color.size,
        "line_path": line_path,
        "color_path": color_path,
        "icon_path": icon_path,
        "preview_path": preview_path,
    }


def main() -> None:
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("source", type=Path, help="Side-by-side Gemini plant PNG")
    parser.add_argument("output_dir", type=Path, help="Output directory")
    parser.add_argument("--stem", default="plant-test", help="Output filename stem")
    parser.add_argument("--pad", type=int, default=14, help="Square canvas padding (px)")
    parser.add_argument(
        "--crop-margin",
        type=int,
        default=4,
        help="Extra px kept around each symbol when trimming (px)",
    )
    args = parser.parse_args()

    info = process_pair(
        args.source,
        args.output_dir,
        stem=args.stem,
        pad=args.pad,
        crop_margin=args.crop_margin,
    )
    print(f"Split: left_end={info['left_end']} right_start={info['right_start']} gutter={info['gutter']}")
    print(f"Line:   {info['line_size']} -> {info['line_path']}")
    print(f"Color:  {info['color_size']} -> {info['color_path']}")
    print(f"Icon:   {info['icon_path']}")
    print(f"Preview: {info['preview_path']}")


if __name__ == "__main__":
    main()
