#!/usr/bin/env python3
"""Batch-split standard side-by-side Gemini plant PNGs into library assets."""
from __future__ import annotations

import argparse
import importlib.util
import json
import re
import sys
from pathlib import Path

from PIL import Image

ROOT = Path(__file__).resolve().parents[1]
_spec = importlib.util.spec_from_file_location(
    "split_gemini_plant_pair",
    ROOT / "scripts" / "split-gemini-plant-pair.py",
)
assert _spec and _spec.loader
_sgp = importlib.util.module_from_spec(_spec)
_spec.loader.exec_module(_sgp)
process_pair = _sgp.process_pair
content_runs = _sgp.content_runs

DEFAULT_EXCLUDES = {
    "Gemini Plant 15.png",
    "Gemini Plant 15a.png",
    "Gemini Plant 15b.png",
    "Gemini Plant 15c.png",
    "Gemini Plant 15d.png",
    "Gemini Plant 15e.png",
    "Gemini Plant 15f.png",
    "Gemini Various Plant 14a.png",
    "Gemini Various Plant 14b.png",
    "Gemini Various Plant 14c.png",
}


def is_excluded_filename(name: str) -> bool:
    if name in DEFAULT_EXCLUDES:
        return True
    lowered = name.lower()
    if lowered.startswith("gemini plant 15-"):
        return True
    if "various plant 14b copy" in lowered or "various plant 14c copy" in lowered:
        return True
    return False


def is_standard_pair(path: Path) -> tuple[bool, str]:
    img = Image.open(path).convert("RGBA")
    w, _ = img.size
    runs = content_runs(img)
    if len(runs) < 2:
        return False, "single blob"

    areas = [((r[1] - r[0] + 1), r, (r[0] + r[1]) / 2) for r in runs]
    areas.sort(reverse=True)
    mid = w / 2
    left_candidates = [a for a in areas if a[2] < mid]
    right_candidates = [a for a in areas if a[2] >= mid]
    if not left_candidates or not right_candidates:
        return False, "no left/right pair"

    left = max(left_candidates, key=lambda a: a[0])[1]
    right = max(right_candidates, key=lambda a: a[0])[1]
    if left[0] > right[0]:
        return False, "overlap"

    gutter = right[0] - left[1] - 1
    lw, rw = left[1] - left[0] + 1, right[1] - right[0] + 1
    ratio = min(lw, rw) / max(lw, rw)
    if gutter < 4:
        return False, f"tight gutter ({gutter}px)"
    if ratio < 0.45:
        return False, f"width mismatch ({ratio:.2f})"
    return True, f"gutter={gutter}px"


def slug_from_filename(name: str) -> str:
    stem = Path(name).stem
    stem = re.sub(r"^Gemini[_\s]+", "", stem, flags=re.IGNORECASE)
    stem = re.sub(r"\s+", " ", stem).strip()
    slug = re.sub(r"[^a-zA-Z0-9]+", "-", stem).strip("-").lower()
    slug = re.sub(r"-+", "-", slug)
    return slug or "plant"


def display_name_from_filename(name: str) -> str:
    stem = Path(name).stem
    stem = re.sub(r"^Gemini[_\s]+", "", stem, flags=re.IGNORECASE)
    stem = re.sub(r"\s+", " ", stem).strip()
    return stem or "Plant"


def main() -> None:
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument(
        "source_dir",
        type=Path,
        help="Folder containing Gemini side-by-side PNGs",
    )
    parser.add_argument(
        "output_dir",
        type=Path,
        help="Build output directory (plan-icons/, plan-icons-line/, icons/)",
    )
    parser.add_argument("--pad", type=int, default=14)
    parser.add_argument("--crop-margin", type=int, default=4)
    parser.add_argument(
        "--manifest",
        type=Path,
        help="Write JSON manifest of processed plants",
    )
    parser.add_argument(
        "--dry-run",
        action="store_true",
        help="List files only; do not write PNG outputs",
    )
    parser.add_argument(
        "--order-file",
        type=Path,
        help="JSON file with fixed [{stem, source}, ...] side-by-side mapping",
    )
    args = parser.parse_args()

    processed: list[dict[str, object]] = []
    skipped: list[dict[str, str]] = []

    if args.order_file:
        order = json.loads(args.order_file.read_text(encoding="utf-8"))
        ordered = order["sideBySide"]
        paths: list[tuple[str, Path]] = []
        for item in ordered:
            path = args.source_dir / item["source"]
            if not path.exists():
                skipped.append({"file": item["source"], "reason": "missing source file"})
                continue
            paths.append((item["stem"], path))
    else:
        paths = []
        for path in sorted(args.source_dir.glob("*.png")):
            if is_excluded_filename(path.name):
                skipped.append({"file": path.name, "reason": "excluded variant"})
                continue
            ok, reason = is_standard_pair(path)
            if not ok:
                skipped.append({"file": path.name, "reason": reason})
                continue
            num = f"{len(paths) + 1:02d}"
            paths.append((f"plant-{num}", path))

    for stem, path in paths:
        if is_excluded_filename(path.name):
            skipped.append({"file": path.name, "reason": "excluded variant"})
            continue

        ok, reason = is_standard_pair(path)
        if not ok:
            skipped.append({"file": path.name, "reason": reason})
            continue

        num = stem.split("-", 1)[1]
        entry = {
            "num": num,
            "stem": stem,
            "source": path.name,
            "slug": slug_from_filename(path.name),
            "name": display_name_from_filename(path.name),
        }

        if args.dry_run:
            entry["status"] = reason
            processed.append(entry)
            continue

        info = process_pair(
            path,
            args.output_dir,
            stem=stem,
            pad=args.pad,
            crop_margin=args.crop_margin,
        )
        entry.update(
            {
                "line_size": info["line_size"],
                "color_size": info["color_size"],
                "gutter": info["gutter"],
                "split": [info["left_end"], info["right_start"]],
            }
        )
        processed.append(entry)
        print(f"[{num}] {path.name} -> {stem} ({info['line_size'][0]}px)")

    print(f"\nProcessed: {len(processed)}")
    print(f"Skipped:   {len(skipped)}")
    for item in skipped:
        print(f"  - {item['file']}: {item['reason']}")

    if args.manifest:
        args.manifest.parent.mkdir(parents=True, exist_ok=True)
        args.manifest.write_text(
            json.dumps({"processed": processed, "skipped": skipped}, indent=2) + "\n",
            encoding="utf-8",
        )
        print(f"Manifest: {args.manifest}")


if __name__ == "__main__":
    main()
