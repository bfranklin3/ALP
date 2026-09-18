#!/usr/bin/env python3
"""Process pre-split Gemini line + color PNG pairs and append to the library manifest."""
from __future__ import annotations

import argparse
import importlib.util
import json
import re
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


def slugify(text: str) -> str:
    slug = re.sub(r"[^a-zA-Z0-9]+", "-", text.strip().lower())
    return re.sub(r"-+", "-", slug).strip("-") or "plant"


def main() -> None:
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("source_dir", type=Path)
    parser.add_argument("output_dir", type=Path)
    parser.add_argument("--line-prefix", required=True, help="Filename prefix for line art PNGs")
    parser.add_argument("--color-prefix", required=True, help="Filename prefix for color PNGs")
    parser.add_argument("--series-name", required=True, help="Display name prefix, e.g. 'Various Plant 14'")
    parser.add_argument("--manifest", type=Path, required=True)
    parser.add_argument("--start-num", type=int, default=1, help="Next plant number if manifest is empty")
    parser.add_argument("--pad", type=int, default=14)
    parser.add_argument("--crop-margin", type=int, default=4)
    args = parser.parse_args()

    manifest = {"processed": [], "skipped": []}
    if args.manifest.exists():
        manifest = json.loads(args.manifest.read_text(encoding="utf-8"))

    next_num = args.start_num
    if manifest["processed"]:
        next_num = max(int(entry["num"]) for entry in manifest["processed"]) + 1

    line_files = sorted(args.source_dir.glob(f"{args.line_prefix}*.png"))
    added: list[dict[str, object]] = []

    for line_path in line_files:
        suffix = line_path.name[len(args.line_prefix) :]
        if not suffix.lower().endswith(".png"):
            continue
        color_path = args.source_dir / f"{args.color_prefix}{suffix}"
        if not color_path.exists():
            manifest["skipped"].append(
                {"file": line_path.name, "reason": f"missing color pair: {color_path.name}"}
            )
            continue

        copy_match = re.search(r"copy\s*(\d+)", suffix, flags=re.IGNORECASE)
        copy_num = copy_match.group(1) if copy_match else str(len(added) + 1)
        num = f"{next_num:02d}"
        stem = f"plant-{num}"
        name = f"{args.series_name} - {copy_num}"

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
            "source": f"{line_path.name} + {color_path.name}",
            "slug": slugify(f"{args.series_name}-{copy_num}"),
            "name": name,
            "line_size": info["line_size"],
            "color_size": info["color_size"],
            "pair": [line_path.name, color_path.name],
        }
        manifest["processed"].append(entry)
        added.append(entry)
        next_num += 1
        print(f"[{num}] {name} ({info['line_size'][0]}px)")

    args.manifest.parent.mkdir(parents=True, exist_ok=True)
    args.manifest.write_text(json.dumps(manifest, indent=2) + "\n", encoding="utf-8")
    print(f"Added {len(added)} plants; manifest now has {len(manifest['processed'])} total")


if __name__ == "__main__":
    main()
