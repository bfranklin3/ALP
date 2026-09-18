#!/usr/bin/env python3
"""Generate ALP Hardscape stepping stone / paver library assets (SPIKE-11 style pack).

Creates colored catalog thumbnails and layered plan symbols (SPIKE-28 style):
black line art (planIcon + Draft), greyscale fill wash (planIconFill, tinted via
inspector Color), and PluginFurnitureCatalog.properties for ALP-Hardscape-1.0.0/.
"""
from __future__ import annotations

import random
import sys
from pathlib import Path

from PIL import Image, ImageChops, ImageDraw, ImageFilter

MAX_PLAN_PX = 256
ICON_PX = 128
PAVER_HEIGHT_CM = 3.81
# Neutral grey used as a luminance mask for SH3D plan-icon color tinting.
PLAN_GREY = (175, 175, 172)

COLORS = [
    ("terra", "Terracotta", (178, 95, 62)),
    ("grey", "Medium Grey", (142, 142, 138)),
    ("white", "Off-White", (228, 226, 218)),
    ("sand", "Sandstone", (208, 178, 138)),
    ("charcoal", "Charcoal", (48, 50, 54)),
]

ORGANIC_POLYGONS = {
    "organic-1": [
        (0.06, 0.14), (0.48, 0.04), (0.94, 0.10), (0.96, 0.58),
        (0.82, 0.94), (0.28, 0.96), (0.04, 0.52),
    ],
    "organic-2": [
        (0.08, 0.08), (0.52, 0.02), (0.96, 0.18), (0.92, 0.88),
        (0.62, 0.96), (0.10, 0.78), (0.02, 0.42),
    ],
    "organic-3": [
        (0.04, 0.20), (0.44, 0.06), (0.90, 0.08), (0.98, 0.50),
        (0.88, 0.92), (0.36, 0.98), (0.06, 0.70),
    ],
}

# kind, slug, display base, width in, depth in
SHAPES = [
    ("step", "12x12", "Stepping Stone 12 x 12", 12, 12),
    ("step", "24x16", "Stepping Stone 24 x 16", 24, 16),
    ("step", "12x5", "Stepping Stone 12 x 5", 12, 5),
    ("step", "16x16", "Stepping Stone 16 x 16", 16, 16),
    ("step", "20x20", "Stepping Stone 20 x 20", 20, 20),
    ("paver", "12x3", "Paver 12 x 3", 12, 3),
    ("paver", "8x4", "Paver 8 x 4", 8, 4),
    ("step", "organic-1", "Stepping Stone 18 x 14 Organic", 18, 14),
    ("step", "organic-2", "Stepping Stone 20 x 16 Organic", 20, 16),
    ("step", "organic-3", "Stepping Stone 22 x 18 Organic", 22, 18),
]


def in_to_cm(value: float) -> float:
    return round(value * 2.54, 1)


def plan_canvas_size(width_in: float, depth_in: float) -> tuple[int, int]:
    aspect = width_in / depth_in
    if aspect >= 1:
        w = MAX_PLAN_PX
        h = max(32, int(round(MAX_PLAN_PX / aspect)))
    else:
        h = MAX_PLAN_PX
        w = max(32, int(round(MAX_PLAN_PX * aspect)))
    return w, h


def make_rect_mask(w: int, h: int) -> Image.Image:
    mask = Image.new("L", (w, h), 0)
    draw = ImageDraw.Draw(mask)
    radius = max(4, int(min(w, h) * 0.10))
    draw.rounded_rectangle([1, 1, w - 2, h - 2], radius=radius, fill=255)
    return mask


def make_organic_mask(w: int, h: int, slug: str) -> Image.Image:
    points = ORGANIC_POLYGONS[slug]
    mask = Image.new("L", (w, h), 0)
    draw = ImageDraw.Draw(mask)
    pad = max(4, int(min(w, h) * 0.04))
    poly = [
        (pad + x * (w - 2 * pad), pad + y * (h - 2 * pad))
        for x, y in points
    ]
    draw.polygon(poly, fill=255)
    return mask.filter(ImageFilter.GaussianBlur(radius=1.2)).point(
        lambda p: 255 if p > 110 else 0
    )


def make_shape_mask(w: int, h: int, slug: str) -> Image.Image:
    if slug.startswith("organic-"):
        return make_organic_mask(w, h, slug)
    return make_rect_mask(w, h)


def plan_stroke_width(w: int, h: int) -> int:
    """Solid plan-outline weight that stays >= ~2 px when scaled onto the footprint."""
    return max(6, min(12, int(round(min(w, h) * 0.045))))


def organic_polygon(w: int, h: int, slug: str) -> list[tuple[float, float]]:
    pad = max(4, int(min(w, h) * 0.04))
    return [
        (pad + x * (w - 2 * pad), pad + y * (h - 2 * pad))
        for x, y in ORGANIC_POLYGONS[slug]
    ]


def rect_geometry(w: int, h: int) -> tuple[int, tuple[int, int, int, int]]:
    radius = max(4, int(min(w, h) * 0.10))
    return radius, (1, 1, w - 2, h - 2)


def add_grain(base: Image.Image, mask: Image.Image, seed: int) -> Image.Image:
    rng = random.Random(seed)
    w, h = base.size
    noise = Image.new("L", (w, h))
    noise.putdata([rng.randint(0, 255) for _ in range(w * h)])
    noise = noise.filter(ImageFilter.GaussianBlur(radius=0.9))
    overlay = Image.new("RGBA", (w, h), (255, 255, 255, 0))
    npx = noise.load()
    opx = overlay.load()
    mpx = mask.load()
    for y in range(h):
        for x in range(w):
            if mpx[x, y] > 0:
                v = npx[x, y]
                alpha = 28 if v > 128 else 18
                opx[x, y] = (255, 255, 255, alpha)
    return Image.alpha_composite(base, overlay)


def render_fill_mask(mask: Image.Image, seed: int) -> Image.Image:
    """Greyscale interior wash without stroke (drawn under black line art)."""
    w, h = mask.size
    base = Image.new("RGBA", (w, h), (0, 0, 0, 0))
    fill = Image.new("RGBA", (w, h), PLAN_GREY + (255,))
    base.paste(fill, mask=mask)
    return add_grain(base, mask, seed)


def render_presentation(mask: Image.Image, rgb: tuple[int, int, int], seed: int) -> Image.Image:
    w, h = mask.size
    dark = tuple(max(0, c - 35) for c in rgb)
    base = Image.new("RGBA", (w, h), (0, 0, 0, 0))
    fill = Image.new("RGBA", (w, h), rgb + (255,))
    base.paste(fill, mask=mask)
    edge = mask.filter(ImageFilter.MaxFilter(3))
    inner = mask.filter(ImageFilter.MinFilter(3))
    border = ImageChops.subtract(edge, inner)
    border_rgba = Image.new("RGBA", (w, h), dark + (255,))
    base.paste(border_rgba, mask=border)
    return add_grain(base, mask, seed)


def render_line(w: int, h: int, slug: str) -> Image.Image:
    """Solid black vector outline (Draft + Presentation line layer)."""
    stroke = plan_stroke_width(w, h)
    img = Image.new("RGBA", (w, h), (0, 0, 0, 0))
    draw = ImageDraw.Draw(img)
    ink = (12, 12, 12, 255)
    if slug.startswith("organic-"):
        draw.polygon(organic_polygon(w, h, slug), outline=ink, width=stroke)
    else:
        radius, box = rect_geometry(w, h)
        inset = max(1, stroke // 2)
        draw.rounded_rectangle(
            [box[0] + inset, box[1] + inset, box[2] - inset, box[3] - inset],
            radius=max(2, radius - inset),
            outline=ink,
            width=stroke,
        )
    return img


def fit_icon(source: Image.Image) -> Image.Image:
    icon = Image.new("RGBA", (ICON_PX, ICON_PX), (0, 0, 0, 0))
    sw, sh = source.size
    scale = min((ICON_PX - 16) / sw, (ICON_PX - 16) / sh)
    nw, nh = max(1, int(sw * scale)), max(1, int(sh * scale))
    resized = source.resize((nw, nh), Image.Resampling.LANCZOS)
    icon.paste(resized, ((ICON_PX - nw) // 2, (ICON_PX - nh) // 2), resized)
    return icon


def asset_slug(kind: str, shape_slug: str, color_slug: str) -> str:
    return f"{kind}-{shape_slug}-{color_slug}"


def shape_plan_slug(kind: str, shape_slug: str) -> str:
    return f"{kind}-{shape_slug}"


def catalog_id(kind: str, shape_slug: str, color_slug: str) -> str:
    return f"alp-hrd-{kind}-{shape_slug}-{color_slug}"


def write_properties(staging: Path, entries: list[dict], model_size: int) -> None:
    lines = [
        "id=alp-hardscape-phase1",
        "name=ALP Hardscape - Stepping Stones and Pavers",
        "description=Stepping stones and pavers for site plans (standard and organic shapes, five finish colors).",
        "version=1.0.4",
        "license=Proprietary - ALP CAD",
        "provider=ALP CAD",
        "",
    ]
    for n, entry in enumerate(entries, start=1):
        kind = entry["kind"]
        tag_kind = "paver" if kind == "paver" else "stepping stone"
        lines.extend([
            f"name#{n}={entry['name']}",
            f"id#{n}={entry['id']}",
            f"category#{n}=ALP Site - Hardscape",
            f"description#{n}={entry['description']}",
            f"tags#{n}=hardscape, {tag_kind}, {entry['color_name'].lower()}, landscape, alp",
            f"creator#{n}=ALP CAD",
            f"width#{n}={entry['width_cm']}",
            f"depth#{n}={entry['depth_cm']}",
            f"height#{n}={PAVER_HEIGHT_CM}",
            f"model#{n}=/models/paver-slab.obj",
            f"modelSize#{n}={model_size}",
            f"icon#{n}=/icons/{entry['asset']}.png",
            f"planIcon#{n}=/plan-icons-line/{entry['plan_asset']}.png",
            f"planIconLine#{n}\\:CONTENT=/plan-icons-line/{entry['plan_asset']}.png",
            f"planIconFill#{n}\\:CONTENT=/plan-icons-fill/{entry['plan_asset']}.png",
            f"movable#{n}=true",
            f"doorOrWindow#{n}=false",
            f"resizable#{n}=true",
            f"deformable#{n}=false",
            f"texturable#{n}=true",
            f"horizontallyRotatable#{n}=true",
            f"elevation#{n}=0",
            "",
        ])
    props_path = staging / "PluginFurnitureCatalog.properties"
    with props_path.open("w", encoding="iso-8859-1", newline="\n") as handle:
        handle.write("\n".join(lines))


def main() -> int:
    if len(sys.argv) != 2:
        print(f"Usage: {sys.argv[0]} <library-dir>", file=sys.stderr)
        return 1

    lib_dir = Path(sys.argv[1]).resolve()
    build_dir = lib_dir / "build"
    staging = build_dir / "staging"
    icons_dir = staging / "icons"
    fill_dir = staging / "plan-icons-fill"
    line_dir = staging / "plan-icons-line"
    models_dir = staging / "models"

    for path in (icons_dir, fill_dir, line_dir, models_dir):
        path.mkdir(parents=True, exist_ok=True)
        for stale in path.glob("*.png"):
            stale.unlink()

    model_src = lib_dir / "models" / "paver-slab.obj"
    model_dst = models_dir / "paver-slab.obj"
    model_dst.write_bytes(model_src.read_bytes())
    model_size = model_dst.stat().st_size

    entries: list[dict] = []
    plan_assets: dict[tuple[str, str], str] = {}
    seed = 4900
    for kind, shape_slug, base_name, width_in, depth_in in SHAPES:
        w_px, h_px = plan_canvas_size(width_in, depth_in)
        mask = make_shape_mask(w_px, h_px, shape_slug)
        width_cm = in_to_cm(width_in)
        depth_cm = in_to_cm(depth_in)
        shape_key = (kind, shape_slug)
        if shape_key not in plan_assets:
            plan_asset = shape_plan_slug(kind, shape_slug)
            render_fill_mask(mask, seed).save(fill_dir / f"{plan_asset}.png")
            render_line(w_px, h_px, shape_slug).save(line_dir / f"{plan_asset}.png")
            plan_assets[shape_key] = plan_asset
            seed += 1
        plan_asset = plan_assets[shape_key]
        for color_slug, color_name, rgb in COLORS:
            asset = asset_slug(kind, shape_slug, color_slug)
            icon = fit_icon(render_presentation(mask, rgb, seed))
            icon.save(icons_dir / f"{asset}.png")
            entries.append({
                "kind": kind,
                "asset": asset,
                "plan_asset": plan_asset,
                "id": catalog_id(kind, shape_slug, color_slug),
                "name": f"{base_name} - {color_name}",
                "description": (
                    f"{base_name} in {color_name}. "
                    f"Footprint {width_in} x {depth_in} in on plan. "
                    f"Finish color applies on placement; adjust with Color in the inspector."
                ),
                "color_name": color_name,
                "width_cm": width_cm,
                "depth_cm": depth_cm,
            })
            seed += 1

    write_properties(staging, entries, model_size)
    print(f"Generated {len(entries)} catalog entries in {staging}")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
