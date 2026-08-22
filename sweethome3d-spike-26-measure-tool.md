# SPIKE-26 — Measure tool (ephemeral two-point ruler)

**Status:** Shipped (Aug 22, 2026)

## Problem

Create dimensions always leaves a persistent `DimensionLine`. There was no quick point-to-point readout for site-plan checks.

## Solution (v1)

| Feature | Implementation |
|---------|------------------|
| Dedicated **Measure** mode | `PlanController.Mode.MEASUREMENT` + `MeasurementState` |
| Toolbar / menu / shortcut | `HomeView.ActionType.MEASURE` — draw strip after Create dimensions; ⌘⇧M / Ctrl⇧M |
| Two-click flow | Start → live dashed line + length label → end → final reading; next click starts again |
| Esc | Clears current measurement; tool stays active |
| Alt-drag overlay | `MeasurementOverlayDragState` from Select/Pan when Alt (Option on macOS) held on empty plan |
| Ephemeral | `DimensionLine` used only in `setDimensionLinesFeedback`; never `home.addDimensionLine` |
| Units | `preferences.getLengthUnit().getFormatWithUnit()` |
| Snap | Free placement; magnetism/alignment optional via existing toggles |

## Files touched

- `PlanController.java` — mode, states, feedback helpers
- `PlanComponent.java` — Alt overlay flag on mouse press
- `HomeView.java`, `HomePane.java`, `HomeController.java` — action wiring
- `package.properties` — labels, shortcut, tip
- `resources/actions/plan-measure.{svg,png,@2x.png}` — toolbar icon

## Out of scope (v1)

Convert to dimension, chain measure, area/angle, 3D measure.

## Test plan

1. Activate Measure → click two points → verify length readout; save `.sh3d` → no new dimension lines.
2. Esc clears readout; further clicks measure again.
3. Select mode → Alt-drag on empty plan → same readout; Esc clears.
4. Repeat in metric and imperial preferences.
