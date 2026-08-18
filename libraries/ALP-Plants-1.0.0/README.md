# ALP Plants Phase 1 — build notes

## Build

```bash
./scripts/build-alp-plants-library.sh
```

Output: `libraries/ALP-Plants-1.0.0/ALP-Plants-1.0.0.sh3f` (internal `version=` in properties — currently **1.0.2**).

## Source

- `source/plant-symbol-sheet.png` — 30 symbols; left half = line art, right half = presentation (color wash).

## Assets per symbol

| Folder | Catalog property | Mode |
|--------|------------------|------|
| `build/plan-icons/` | `planIcon#N` | **Presentation** (color) |
| `build/plan-icons-line/` | `planIconLine#N\:CONTENT` | **Draft** (line art) |
| `build/icons/` | `icon#N` | Catalog list thumbnail (128px) |
| `models/plant-placeholder.obj` | `model#N` | Minimal 3D placeholder |

**Catalog folder:** all 12 pieces appear under a single category **`ALP Plants`** (Sweet Home 3D uses flat category names, not nested folders).

## Import and test

1. Sweet Home 3D Dev → **Furniture → Import furniture library…** → select `ALP-Plants-1.0.0.sh3f` (confirm replace if re-importing).
2. **Settings** (Sweet Home 3D menu → Settings…) → **Furniture icons in plan: Top view**.
3. Drag a **new** piece from **ALP Plants** onto the plan (re-drag after library updates — placed pieces do not pick up new properties).
4. **Presentation** (Draft off): color watercolor `planIcon`.
5. **Draft** (⌘⇧D): black line art from `planIconLine`.

## Draft / Presentation gotchas (documented Aug 2026)

- Property key must be `planIconLine#N\:CONTENT=...` (**escaped colon**). Wrong format → Draft shows color.
- Requires ALP-Core Dev app (SPIKE-12b engine change), not stock SH3D alone.
- See [alp-phase-1-library-schema.md](../../alp-phase-1-library-schema.md) — section **Draft vs Presentation plan icons**.

## Validation

See checklist in [alp-phase-1-library-schema.md](../../alp-phase-1-library-schema.md).
