#!/usr/bin/env python3
"""Generate libraries/ALP-Plants-2.0.0/plants.catalog.json from confirmed variant table."""
from __future__ import annotations

import json
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
OUT = ROOT / "libraries/ALP-Plants-2.0.0/plants.catalog.json"


def ft(value: float) -> float:
    return round(value * 30.48, 1)


def inches(value: float) -> float:
    return round(value * 2.54, 1)


def catalog_entry(stem: str, name: str, slug: str, height_cm: float, width_cm: float) -> dict:
    return {
        "id": f"alp-plt-{slug}",
        "name": name,
        "stem": stem,
        "heightCm": height_cm,
        "widthCm": width_cm,
        "depthCm": width_cm,
    }


# (stem, name, slug, height_cm, width_cm)
VARIANTS: list[tuple[str, str, str, float, float]] = [
    ("plant-01", "Magnolia", "magnolia", ft(30), ft(15)),
    ("plant-01", "Awabuki Viburnum", "awabuki-viburnum", ft(12), ft(8)),
    ("plant-02", "Indian Hawthorn", "indian-hawthorn", ft(3), ft(5)),
    ("plant-02", "Japanese Blueberry Tree", "japanese-blueberry-tree", ft(30), ft(15)),
    ("plant-02", "Sweet Viburnum", "sweet-viburnum", ft(20), ft(12)),
    ("plant-03", "Saw Palmetto 2", "saw-palmetto-2", ft(8), ft(8)),
    ("plant-04", "Live Oak", "live-oak", ft(40), ft(60)),
    ("plant-04", "Crape Myrtle", "crape-myrtle", ft(15), ft(15)),
    ("plant-04", "Holly", "holly", ft(20), ft(10)),
    ("plant-05", "Fiddle-Leaf Fig", "fiddle-leaf-fig", ft(12), ft(8)),
    ("plant-05", "Clusia", "clusia", ft(20), ft(15)),
    ("plant-06", "Royal Poinciana", "royal-poinciana", ft(30), ft(40)),
    ("plant-06", "Walter's Viburnum", "walters-viburnum", ft(15), ft(10)),
    ("plant-07", "Podocarpus", "podocarpus", ft(15), ft(10)),
    ("plant-08", "Dwarf Banana", "dwarf-banana", ft(10), ft(5)),
    ("plant-08", "Cardboard Palm", "cardboard-palm", ft(4), ft(5)),
    ("plant-09", "Monkey Grass", "monkey-grass", inches(18), inches(24)),
    ("plant-09", "African Iris", "african-iris", ft(3), ft(3)),
    ("plant-09", "Coontie", "coontie-p09", ft(3), ft(5)),
    ("plant-10", "White Bird of Paradise", "white-bird-of-paradise", ft(20), ft(10)),
    ("plant-10", "Orange Bird of Paradise", "orange-bird-of-paradise", ft(4), ft(3)),
    ("plant-11", "Areca Palm", "areca-palm", ft(12), ft(8)),
    ("plant-11", "European Fan Palm 2", "european-fan-palm-2", ft(8), ft(6)),
    ("plant-11", "Yucca", "yucca-p11", ft(15), ft(6)),
    ("plant-12", "Allamanda", "allamanda", ft(5), ft(6)),
    ("plant-12", "Lantana", "lantana", ft(1), ft(3)),
    ("plant-13", "Gardenia", "gardenia", ft(5), ft(6)),
    ("plant-13", "White Plumbago", "white-plumbago", ft(3), ft(4)),
    ("plant-14", "Hibiscus", "hibiscus-p14", ft(5), ft(6)),
    ("plant-15", "Blue Plumbago", "blue-plumbago", ft(3), ft(4)),
    ("plant-16", "Begonia", "begonia", ft(1), ft(2)),
    ("plant-16", "Hibiscus", "hibiscus-p16", ft(5), ft(6)),
    ("plant-16", "Red Ixora", "red-ixora", ft(5), ft(4)),
    ("plant-17", "Viburnum", "viburnum-p17", ft(10), ft(6)),
    ("plant-17", "Podocarpus", "podocarpus-p17", ft(8), ft(4)),
    ("plant-18", "Agave", "agave-p18", ft(4), ft(4)),
    ("plant-18", "Bromeliad", "bromeliad", ft(1.5), ft(1)),
    ("plant-18", "Crinum Lily", "crinum-lily", ft(5), ft(6)),
    ("plant-19", "Xanadu Philodendron", "xanadu-philodendron", ft(4), ft(5)),
    ("plant-20", "Saw Palmetto", "saw-palmetto", ft(5), ft(6)),
    ("plant-20", "European Fan Palm", "european-fan-palm", ft(8), ft(6)),
    ("plant-21", "Queen Palm", "queen-palm", ft(30), ft(20)),
    ("plant-21", "Roebelenii Palm", "roebelenii-palm", ft(6), ft(6)),
    ("plant-22", "Muhly Grass", "muhly-grass", ft(2), ft(3)),
    ("plant-22", "Moundlily Yucca", "moundlily-yucca-p22", ft(8), ft(6)),
    ("plant-23", "Sabal Palm", "sabal-palm", ft(30), ft(10)),
    ("plant-23", "Washingtonia Palm", "washingtonia-palm", ft(70), ft(15)),
    ("plant-24", "Chinese Fan Palm", "chinese-fan-palm", ft(25), ft(12)),
    ("plant-25", "Split-Leaf Philodendron", "split-leaf-philodendron", ft(10), ft(8)),
    ("plant-26", "Smooth Agave", "smooth-agave", ft(3), ft(3)),
    ("plant-26", "Arboricola", "arboricola", ft(4), ft(5)),
    ("plant-27", "Bougainvillea", "bougainvillea", ft(5), ft(5)),
    ("plant-28", "Tree Philodendron", "tree-philodendron", ft(8), ft(10)),
    ("plant-28", "Papaya Tree", "papaya-tree", ft(10), ft(5)),
    ("plant-29", "Moundlily Yucca", "moundlily-yucca-p29", ft(8), ft(6)),
    ("plant-29", "Caribbean Agave", "caribbean-agave", ft(3), ft(3)),
    ("plant-30", "Macho Fern", "macho-fern", ft(3), ft(4)),
    ("plant-31", "Generic Tree 1", "generic-tree-1", ft(12), ft(8)),
    ("plant-31", "Generic Bush 1", "generic-bush-1", ft(6), ft(4)),
    ("plant-32", "Generic Tree 2", "generic-tree-2", ft(12), ft(18)),
    ("plant-32", "Generic Bush 2", "generic-bush-2", ft(6), ft(9)),
    ("plant-33", "Generic Tree 3", "generic-tree-3", ft(12), ft(8)),
    ("plant-33", "Generic Bush 3", "generic-bush-3", ft(6), ft(4)),
]


def main() -> None:
    entries = [catalog_entry(*row) for row in VARIANTS]
    ids = [e["id"] for e in entries]
    if len(ids) != len(set(ids)):
        dupes = sorted({i for i in ids if ids.count(i) > 1})
        raise SystemExit(f"Duplicate catalog IDs: {dupes}")

    doc = {
        "libraryVersion": "2.1.0",
        "description": "ALP Plants Gemini Collection — catalog variants (one artwork stem, many names/sizes).",
        "entries": entries,
    }
    OUT.parent.mkdir(parents=True, exist_ok=True)
    OUT.write_text(json.dumps(doc, indent=2) + "\n", encoding="utf-8")
    print(f"Wrote {len(entries)} catalog entries to {OUT}")


if __name__ == "__main__":
    main()
