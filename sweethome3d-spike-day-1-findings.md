# Sweet Home 3D Spike Day 1 Findings

Date: August 14, 2026

## Test Build Notes

- `Sweet Home 3D 7.6.6` is installed, but this build is the commercialized product and blocks full library-object use until payment is made.
- `Sweet Home 3D 7.5` is also installed and is the full open-source build.
- Day 1 testing should therefore use `Sweet Home 3D 7.5`.

## Block 1: Architectural Object Editing

### Verdict

- `Strong`

### User observations

- Doors and windows do feel like real hosted objects.
- This is already clearly better than the `QCAD` prototype.
- Moving doors felt very easy.
- Double-clicking an object to open its properties felt straightforward.

### Awkward points noted

- Resizing was slightly awkward because the resize hotspot is small and must be clicked very precisely.
- In the tested example, the active resize affordance was the small right-angle style handle at the lower-right of the selected door.
- It may be better in the product to expose selected-object properties in a persistent side inspector instead of relying only on a double-click modal workflow.

### Additional door behavior learned

- `Mirrored shape` changes left/right hinge direction.
- Inward vs outward swing is changed by pulling the object slightly perpendicular to the wall:
  - pulling inward creates an inward-swinging door
  - pulling outward creates an outward-swinging door

### Implication

This is a strong early signal that `Sweet Home 3D` solves the core semantic architectural-editing problem much more naturally than the `QCAD` path.


## Block 2: Reference Image and Scale Workflow

### Verdict

- `Strong`

### User observations

- Calibration of a background image worked successfully.
- The workflow felt easy.
- The resulting geometry appeared to respect the expected scale.
- Nothing about the setup felt hidden or confusing.

### Positive notes

- Being able to define the grid / ruler origin was a nice feature.
- This was noted as a meaningful advantage because many similar apps do not support origin placement as cleanly.

### Friction point noted

- The calibration input was limited to inches.
- For both landscape work and house planning, the ability to calibrate directly in feet would be preferable.

### Implication

The underlay and calibration workflow appears strong enough for MVP use, with unit-entry refinement as a desirable improvement rather than a blocker.


## Block 3: Levels as Visibility Groups

### Verdict

- `Mixed`, leaning `Strong`

### User observations

- Objects could be selected, moved, and placed across levels successfully.
- Renaming levels is easy by double-clicking the level tab to open its properties.
- Visibility and viewable behavior are present and usable.

### Missing or weak points noted

- Lock behavior appears to be missing, and this was identified as an important feature to add.
- Print control was not found.
- Reordering is not possible, though it would be useful.
- The default elevation for a new level is `8'4 3/4"`, which fits architectural floors better than landscape planning.
- If the user knows to change elevation to `0`, the level behaves more like a flat layer group.

### Implication

Levels look workable enough for Phase 1 visibility grouping, but they are not yet a full substitute for CAD-style layers. The most important gaps are lock behavior, better flat-default behavior for landscape use, and possibly print-related controls.
