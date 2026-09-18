# ALP Plants Line — build notes

Black line-art tree symbols from Adobe Stock SVGs. **Outline only** — no watercolor wash layer.

## Why no wash layer?

Open-stroke line SVGs cannot be converted reliably into interior wash PNGs. Earlier catalog versions (≤1.0.2) shipped synthetic `planIconFill` assets that produced **solid green squares** when tinted. v1.0.4 removes `planIconFill` entirely.

For SPIKE-28 plan fill (default wash, custom tint, or None / outline-only with paired art), use **`libraries/ALP-Plants-1.0.0/ALP-Plants-1.0.0.sh3f`** instead.

## Build

```bash
./scripts/build-alp-plants-line-library.sh
```

Output: `libraries/ALP-Plants-Line-1.0.0/ALP-Plants-Line-1.0.0.sh3f` (catalog **version 1.0.4**).

## Assets per symbol

| Folder | Catalog property | Use |
|--------|------------------|-----|
| `build/plan-icons/` | `planIcon#N` | Plan view (Presentation) — black lines |
| `build/plan-icons-line/` | `planIconLine#N` | Draft view — same line art |
| `build/icons/` | `icon#N` | Catalog thumbnail |

There is **no** `planIconFill`. The **Plan fill color** panel does not appear for these pieces (`hasPlanIconFill()` is false).

## Import and test

1. **Furniture → Import furniture library…** → replace with `ALP-Plants-Line-1.0.0.sh3f`
2. Confirm **About → Libraries** shows **version 1.0.4**
3. **Delete and re-drag** any trees imported from v1.0.2 (content props copy at drag time)
4. **Presentation:** black outline only — no square fill behind the tree
5. **Draft (⌘⇧D):** same line art
6. Draw custom bed/mass fills with **area** or **polyline** tools underneath the symbol

## Source SVGs

`/Users/billfranklin/Documents/Misc/Landspace LIBRARY Files/AdobeStock_2112452647 Trees top view 1-separated`

## Phase C (future)

Paired watercolor wash for these Adobe line trees requires separate hand-authored or stock wash art — not synthetic generation from strokes.
