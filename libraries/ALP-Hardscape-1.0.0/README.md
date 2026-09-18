# ALP Hardscape 1.0.0 — Stepping Stones and Pavers

Sample furniture library for site-plan hardscape: standard rectangles, organic stepping stones, and narrow pavers in five finish colors.

## Contents

- **50 catalog entries** — 10 shapes x 5 colors
- **Category:** `ALP Site - Hardscape`
- **Shapes:**
  - Stepping stones: 12x12, 24x16, 12x5, 16x16, 20x20 in
  - Pavers: 12x3, 8x4 in
  - Organic stepping stones: 18x14, 20x16, 22x18 in (procedural rounded footprints)
- **Colors:** Terracotta, Medium Grey, Off-White, Sandstone, Charcoal

Plan symbols use layered assets (SPIKE-28 style, like plants):

- **Presentation:** greyscale fill (`planIconFill`) tinted by inspector **Color**, with black line art on top
- **Draft (⌘⇧D):** line art only (`planIconLine`)

One fill + line pair per shape (10 total); catalog thumbnails stay pre-colored by finish name. Size fields are editable (`resizable=true`).

When you drag a named finish from the catalog (e.g. Terracotta), the Dev app applies that finish color automatically from the catalog ID (`alp-hrd-*-{color}`).

After updating the library, re-import the `.sh3f` and **re-drag** pieces from the catalog — existing placed stones keep their old flags.

## Build

From repo root:

```bash
./scripts/build-alp-hardscape-library.sh
```

Output: `libraries/ALP-Hardscape-1.0.0/ALP-Hardscape-1.0.0.sh3f`

## Import

1. **Furniture -> Import furniture library...**
2. Select `ALP-Hardscape-1.0.0.sh3f`
3. Restart Dev app if the catalog looks stale
4. Settings -> Furniture icons in plan -> **Top view**

## Usage with SPIKE-49

Select one stone, then use **Replicate in Line** or **Fit Copies Between Points** to lay out paths at exact spacing.
