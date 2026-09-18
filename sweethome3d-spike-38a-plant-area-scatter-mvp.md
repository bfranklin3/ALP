# SPIKE-38A — Plant Area Scatter MVP

**Date:** August 27, 2026  
**Status:** Shipped — pending QA  
**Parent:** [SPIKE-38](sweethome3d-spike-38-plant-object-area-fill-behavior.md)  
**Path:** A (40A → **38A** → 45A → 42 polish)

---

## Goal

Single-species planting area fill that creates editable plant instances (not a baked texture), with stable random layout, spacing control, and light size/rotation variation from SPIKE-40 metadata.

---

## Delivered

### Model

- `AlpPlantAreaFill.java` — recipe on room (`alp.plantFill.*`), scatter placement, generated-plant tagging
- Reads `AlpPlantMetadata` for default spacing, random rotation/scale rules
- Stored recipe: symbol id, spacing, seed, size variation, edge offset, fill id

### UI

- **Plan → Fill area with plants...** (single area selected)
- **Plan → Regenerate plant fill...** (area with existing recipe)
- Plan context menu entries (same commands)
- `AlpPlantAreaFillDialog` — plant picker, spacing, size variation %

### Controller

- `HomeController.applyPlantAreaFill(...)` — delete prior generated plants, place new instances on area level, save recipe, undo support
- `FurnitureController.addFurnitureOnLevel(...)` — place scatter on area's layer

---

## Workflow

1. Draw or select a planting **area** on a planting layer (or any layer for MVP).
2. Optionally select an ALP **plant** as the default template.
3. **Plan → Fill area with plants...**
4. Choose plant, spacing (defaults from metadata), size variation.
5. OK → editable plant instances appear inside the area.
6. **Regenerate plant fill...** re-runs the same seed/recipe (manual edits to individual plants are replaced).

---

## Manual QA

1. `./scripts/update-dev-app.sh`
2. Re-import **ALP-Plants** v1.0.6 if needed
3. New site plan → draw a planting bed area on **Proposed Plants**
4. Select area → **Fill area with plants...** → Hydrangea, default spacing → OK
5. Plants appear inside area; each is selectable/moveable
6. **Context → Plants** schedule counts generated instances
7. **Regenerate plant fill...** → same layout (same seed)
8. Change spacing and regenerate → count/layout updates; undo works

---

## Out of scope (38 full spec)

- Mixed-species fills
- Inspector fill relationship (SPIKE-42) — **shipped in 42A**
- Detach plant from recipe — **shipped in 42A**
- New seed / shuffle control in UI
- Tight fill toggle — **shipped in [SPIKE-38B](sweethome3d-spike-38b-tight-fill-toggle.md)**

---

## Next: SPIKE-45A

Duplicate plant type from template into user library.
