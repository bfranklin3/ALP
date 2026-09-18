#!/usr/bin/env python3
"""Append Gemini Plant 15 matched line+color pairs to the library manifest."""
from __future__ import annotations

import argparse
import importlib.util
import json
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
_spec = importlib.util.spec_from_file_location(
    "split_gemini_plant_pair",
    ROOT / "scripts" / "split-gemini-plant-pair.py",
)
assert _spec and _spec.loader
_sgp = importlib.util.module_from_spec(_spec)
_spec.loader.exec_module(_sgp)
process_matched_pair = _sgp.process_matched_pair

PAIRS = [
    ("Gemini Plant 15-1b.png", "Gemini Plant 15-1c.png", "1"),
    ("Gemini Plant 15-2b.png", "Gemini Plant 15-2c.png", "2"),
    ("Gemini Plant 15-3b.png", "Gemini Plant 15-3c.png", "3"),
]


def main() -> None:
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("source_dir", type=Path)
    parser.add_argument("output_dir", type=Path)
    parser.add_argument("--manifest", type=Path, required=True)
    parser.add_argument("--start-num", type=int, default=31)
    parser.add_argument("--pad", type=int, default=14)
    parser.add_argument("--crop-margin", type=int, default=4)
    args = parser.parse_args()

    manifest = {"processed": [], "skipped": []}
    if args.manifest.exists():
        manifest = json.loads(args.manifest.read_text(encoding="utf-8"))

    next_num = args.start_num
    if manifest["processed"]:
        next_num = max(int(entry["num"]) for entry in manifest["processed"]) + 1

    added = 0
    for line_name, color_name, copy_num in PAIRS:
        line_path = args.source_dir / line_name
        color_path = args.source_dir / color_name
        if not line_path.exists() or not color_path.exists():
            missing = color_name if not color_path.exists() else line_name
            manifest["skipped"].append({"file": missing, "reason": "missing Plant 15 pair file"})
            continue

        num = f"{next_num:02d}"
        stem = f"plant-{num}"
        info = process_matched_pair(
            line_path,
            color_path,
            args.output_dir,
            stem=stem,
            pad=args.pad,
            crop_margin=args.crop_margin,
        )
        entry = {
            "num": num,
            "stem": stem,
            "source": f"{line_name} + {color_name}",
            "slug": f"plant-15-{copy_num}",
            "name": f"Plant 15 - {copy_num}",
            "line_size": info["line_size"],
            "color_size": info["color_size"],
            "pair": [line_name, color_name],
        }
        manifest["processed"].append(entry)
        next_num += 1
        added += 1
        print(f"[{num}] Plant 15 - {copy_num} ({info['line_size'][0]}px)")

    args.manifest.parent.mkdir(parents=True, exist_ok=True)
    args.manifest.write_text(json.dumps(manifest, indent=2) + "\n", encoding="utf-8")
    print(f"Added {added} Plant 15 pairs; manifest now has {len(manifest['processed'])} stems")


if __name__ == "__main__":
    main()
