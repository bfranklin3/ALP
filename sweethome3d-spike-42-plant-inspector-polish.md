# SPIKE-42 — Plant Inspector Polish (42A + 42B + 42C)

**Date:** August 27, 2026  
**Status:** Implemented — pending QA  
**Parent:** [SPIKE-42 spec](sweethome3d-spike-42-plant-inspector-ux-spec.md)

## Shipped

### 42A — Area Fill panel

When a **generated** scatter-fill plant is selected (`alp.plantFill.generated=true`), the furniture inspector shows:

- Parent area name
- Recipe (symbol @ spacing)
- Size variation summary
- **Select parent area** — selects the owning room
- **Regenerate fill** — opens 38A regenerate dialog
- **Detach this plant** — removes fill linkage; plant becomes standalone

### 42B — Plant identity header

Single ALP plant selection shows:

- Title: **Plant — {display name}**
- Subtitle: schedule name · category · catalog ID · layer

**Open full editor** is hidden for layered ALP plants (appearance is in sidebar via 46B).

### 42C — Collapsed Details

**Show plant details** toggle reveals read-only metadata from SPIKE-40A:

- Schedule name, common name, botanical name
- Default spacing
- Fill variation flags (symmetry, random rotation/scale)

Collapsed by default; resets when selection changes.

## Key files

| File | Role |
|------|------|
| `model/AlpPlantAreaFill.java` | `isGeneratedPlant`, `findParentRoom` |
| `swing/SelectionInspectorPane.java` | Furniture inspector panels |
| `swing/package.properties` | Localized strings |

## QA steps

1. `./scripts/update-dev-app.sh`
2. Scatter-fill an area (38A); select one generated plant
3. Inspector → **Area fill** section visible with correct recipe
4. **Select parent area** → room selected on plan
5. **Detach this plant** → section hides; plant remains on plan
6. Select any ALP plant → header shows **Plant — …** and schedule/category/id/layer line
7. **Show plant details** → metadata matches catalog; **Hide** collapses again

## Path A

Completes Path A step 4 (42 polish) after 40A, 38A, and 45A.
