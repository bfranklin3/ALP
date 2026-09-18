# SPIKE-38B — Tight Fill Toggle

**Date:** August 27, 2026  
**Status:** Shipped — pending QA  
**Parent:** [SPIKE-38A](sweethome3d-spike-38a-plant-area-scatter-mvp.md) · [SPIKE-38](sweethome3d-spike-38-plant-object-area-fill-behavior.md)

---

## Problem

38A scatter fill uses a **square grid** on the area bounding box with **25% spacing jitter** and a **generous edge inset** (~30% of spacing plus 35% of plant radius). That produces natural-looking beds with visible gaps — good for presentation sketches — but users filling dense groundcover or mass plantings often want **more coverage** with fewer holes along edges and between rows.

---

## Goal

Add an optional **Tight fill** mode to the fill dialog that:

1. Uses a **hex (staggered) grid** instead of a square grid
2. Applies **reduced jitter** so cells stay closer to their grid positions
3. Applies **reduced edge inset** so plants can sit nearer to the area boundary

Default remains **off** so existing fills and new “natural” fills behave exactly as 38A shipped.

---

## UX

| Location | Change |
|----------|--------|
| **Fill area with plants...** | Checkbox: **Tight fill** (default unchecked) |
| **Regenerate plant fill...** | Checkbox restored from stored recipe |
| **Inspector → Area fill** (42A) | Recipe line shows `· tight fill` suffix when enabled |

Tooltip / helper text (checkbox): *Denser hex grid with less edge gap and jitter.*

---

## Algorithm

### Standard mode (38A — unchanged)

| Parameter | Value |
|-----------|-------|
| Grid | Square; step = spacing on both axes |
| Jitter | ±25% of spacing per axis |
| Edge offset (default) | `spacing × 0.30` |
| Radius inset | `plantRadius × 0.35` |
| Valid center | Inside polygon **and** `distanceToBoundary ≥ edgeOffset + radiusInset` |

### Tight fill mode (38B)

| Parameter | Value |
|-----------|-------|
| Grid | Hex staggered; column step = spacing, row step = `spacing × √3/2` |
| Row offset | Odd rows shifted by `spacing / 2` |
| Jitter | ±8% of spacing per axis |
| Edge offset (default) | `spacing × 0.12` |
| Radius inset | `plantRadius × 0.15` |

Hex row spacing uses equilateral-triangle packing so center-to-center distance along both nearest-neighbor directions stays approximately **spacing**.

### Random seed

Same stored seed drives jitter and size/rotation variation. Toggling **Tight fill** changes grid geometry, so **regenerate** produces a different layout even with the same seed — expected.

---

## Persistence

New room property on the fill recipe:

| Property | Value |
|----------|-------|
| `alp.plantFill.tightFill` | `"true"` when enabled; omitted or `"false"` for standard |

Stored alongside existing `alp.plantFill.*` keys. Old plans without this property load as **standard** fill.

---

## Code touchpoints

| File | Change |
|------|--------|
| `AlpPlantAreaFill.java` | `Recipe.tightFill`, constants, `scatterCenters(..., tightFill)`, save/load/clear |
| `AlpPlantAreaFillDialog.java` | `JCheckBox` for tight fill |
| `SelectionInspectorPane.java` | Recipe summary suffix |
| `package.properties` | Dialog + inspector strings |

---

## Out of scope

- Per-area jitter / inset sliders
- Mixed-species fills
- Circle packing or Poisson-disk sampling
- Automatic “tight” when spacing is below a threshold

---

## Manual QA

1. `./scripts/update-dev-app.sh`
2. Draw planting area → **Fill area with plants...** with tight fill **off** → note gap pattern (baseline)
3. Same area, regenerate with **Tight fill** on → visibly denser, hex stagger, fewer edge gaps
4. Save plan, reopen → tight flag restored; regenerate matches
5. Inspector on a generated plant → recipe shows `· tight fill` when applicable
6. Old plan (pre-38B) → fill still works; checkbox off by default
7. **Copy/paste area:** fill area A, copy/paste to area B → fill B → A's plants remain (each area gets its own fill id)

---

## Bug fix (copy/paste fill id collision)

Pasted areas duplicated the room's `alp.plantFill.id` via `HomeObject.duplicate()` → `clone()`. Filling the copy reused the source's fill id, so `findGeneratedPlants` deleted the original area's plants.

**Fix:** `Room.duplicate()` clears the fill recipe; `createRecipe(..., preserveFillId)` only reuses an id on **Regenerate plant fill**.

---

## Related

- Gap discussion in Path A handoff (rectangular bbox grid limits)
- SPIKE-42A inspector panel displays recipe summary
