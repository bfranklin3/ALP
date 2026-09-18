# ALP Plants Watercolor — build notes

Presentation-only library: color watercolor plan icons, no Draft line-art pack yet.

## Build

```bash
./scripts/build-alp-plants-watercolor-library.sh
```

Optional: point at a different SVG folder:

```bash
SRC="/path/to/separated/svgs" ./scripts/build-alp-plants-watercolor-library.sh
```

Output: `libraries/ALP-Plants-Watercolor-1.0.0/ALP-Plants-Watercolor-1.0.0.sh3f` (catalog **version 1.0.1** — 6 ft × 6 ft default footprint, 8 ft height).

## Source

Default SVG folder (22 trees):

`/Users/billfranklin/Documents/Misc/Landspace LIBRARY Files/AdobeStock_2047851833 Water Color Trees-separated`

## Assets per symbol

| Folder | Catalog property | Mode |
|--------|------------------|------|
| `build/plan-icons/` | `planIcon#N` | **Presentation** (color) |
| `build/icons/` | `icon#N` | Catalog thumbnail |
| `models/plant-placeholder.obj` | `model#N` | 3D placeholder |

**No `planIconLine`** — Draft mode (⌘⇧D) falls back to the same color icon until line art is added later.

## Import and test

1. Sweet Home 3D Dev → **Furniture → Import furniture library…** → `ALP-Plants-Watercolor-1.0.0.sh3f`
2. **Settings → Furniture icons in plan: Top view**
3. Category **ALP Plants Watercolor** — drag a new piece onto the plan
4. **Presentation** and **Draft** both show color (expected for this release)
