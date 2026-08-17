# Building Mode Scope Clarification

Date: August 13, 2026

## Why this note exists

The product direction expanded from landscape-oriented building outlines to also include floor-plan style drawing with interior walls.

That means the wall workflow is no longer only about drawing a house footprint on a site plan.

## Decision

For MVP direction, the top-level mode label should move from `Hardscape` to `Building`.

`Building` should include both:

- architectural building drawing
- built site / hardscape drawing

## What belongs in Building mode

- exterior house walls
- interior room walls
- garages
- lanais
- additions
- hosted doors
- hosted windows
- patios
- pools
- retaining walls
- paving and built edge geometry

## Why this is the better MVP label

If the user is drawing a floor plan only, `Hardscape` feels wrong.

If the user is drawing a landscape plan with a house footprint and outdoor built features, `Building` is still acceptable as long as the mode clearly includes site-built geometry and not only interior architecture.

This avoids forcing the MVP to split into too many top-level modes too early.

## UX implication

Inside `Building`, the UI should likely separate tools visually into at least two groups:

- `Architecture`
- `Site Features`

This preserves one broad mode while still helping users understand where walls, doors, windows, patios, pools, and retaining walls belong.

## Follow-up implication

The next focused mockup for walls and hosted doors/windows should assume:

- exterior walls are supported
- interior walls are supported
- doors and windows are hosted on both
- the product is not limited to landscape-only house outlines
