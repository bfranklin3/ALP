# Sweet Home 3D Pivot Architecture: Phase 1

Date: August 14, 2026

## Goal

Document a practical Phase 1 pivot strategy for using `Sweet Home 3D` as the foundation for an easy-to-use 2D architectural and landscape planning app.

This note answers three questions:

1. What can we reuse unchanged?
2. What should we adapt in Phase 1?
3. What should we avoid touching yet?

## Recommendation Summary

Use `Sweet Home 3D` as a semantic object foundation, not as a blank slate.

That means:

- reuse its object model wherever it already matches the desired product behavior
- adapt its terminology, rendering, and editing workflows where they feel too interior-design-specific
- delay deep model surgery until we prove the simpler product layer is not enough

This is a lower-risk path than trying to make a primitive-first CAD engine behave like an object-based architectural editor.

## Reuse Unchanged in Phase 1

These parts appear close enough to the product vision that we should keep them largely intact at first.

### 1. Wall / door / window object model

Reuse:

- `Wall`
- `HomeDoorOrWindow`
- wall-hosted opening behavior
- wall alignment / rotation logic

Why:

- this is the strongest semantic advantage of `Sweet Home 3D`
- it already matches the desired user mental model
- it reduces custom hosted-opening logic dramatically

### 2. Core 2D plan editing foundation

Reuse:

- plan canvas
- selection model
- object movement
- resizing handles
- dimension objects
- labels
- polylines

Why:

- this gives us a usable 2D editor immediately
- it is much closer to the intended UX than raw CAD primitives

### 3. Levels as named visibility groups

Reuse:

- `Level`
- level naming
- visible / viewable level controls

Why:

- levels are already functional enough to stand in for simple layer groups in Phase 1
- they may not be perfect CAD layers, but they are good enough to test the product direction

Important note:

- do not rewrite `Level` into a fully custom layer system in Phase 1
- instead, use levels as flat named groups and hide as much vertical-story terminology as possible

### 4. Furniture / catalog infrastructure

Reuse:

- furniture catalogs
- categories
- importable libraries
- metadata-bearing placed objects

Why:

- this is the best starting point for plants, outdoor objects, and reusable symbols
- it should also support future schedule and legend generation

### 5. Background image and scale setup workflow

Reuse:

- imported background image workflow
- known-distance calibration
- dimensioning / scale-aware setup

Why:

- this already aligns well with the required underlay + calibration workflow

## Adapt in Phase 1

These areas should be customized early because they affect product feel directly, but they do not require rewriting the full data model first.

### 1. Product framing and terminology

Adapt:

- app branding
- menu labels
- panel labels
- inspector wording

Examples:

- avoid interior-only language where possible
- prefer terms like `Building`, `Plants`, `Outdoor`, `Reference`, `Schedule`, and `Output`

Why:

- product feel will matter immediately
- users should not feel like they are operating a house-furniture tool with a few hacks

### 2. Library organization

Adapt:

- separate architectural and landscape content visually
- add categories such as:
  - `Doors`
  - `Windows`
  - `Plants`
  - `Beds / Areas`
  - `Outdoor Living`
  - `Hardscape`

Why:

- the underlying catalog can stay the same at first
- the presentation layer should reflect the target workflow

### 3. 2D rendering styles for non-interior content

Adapt:

- plant symbols
- hedge appearance
- bed / lawn / patio fills
- presentation-friendly linework

Why:

- landscape objects should not feel like repurposed indoor furniture
- the app needs recognizable 2D symbols and textures for landscape work

Phase 1 approach:

- prefer custom 2D rendering rules and symbol assets before inventing many new model classes

### 4. Area-based outdoor objects

Adapt:

- use `Room`-like polygon behavior for:
  - planting beds
  - lawn areas
  - patios
  - mulch / gravel areas

Why:

- enclosed outdoor regions map well onto polygon / area objects
- these objects can later support quantity calculations such as area and material estimates

Phase 1 approach:

- begin with room/polygon reuse plus better naming and rendering
- delay a full `LandscapeArea` inheritance hierarchy until needed

### 5. Plant metadata and schedule output

Adapt:

- add plant-oriented metadata fields
- group plant instances by plant identity
- generate schedule / legend output

Why:

- automated plant counts and schedules are one of the most valuable differentiators for the landscape side of the product

Phase 1 approach:

- build this on top of catalog + placed-object metadata before rewriting the whole object framework

### 6. Add simple layer-like protections

Adapt:

- introduce app-level concepts such as:
  - locked visibility group
  - non-selectable reference group
  - print-on / print-off group

Why:

- some CAD-like workflow protections may be needed even if the stock `Level` model does not expose them directly

Phase 1 approach:

- implement lightweight controller rules first
- do not start by refactoring the base model

## Do Not Touch Yet in Phase 1

These are tempting, but they add too much architectural risk too early.

### 1. Do not rewrite `Level` deeply

Avoid:

- removing elevation concepts from the core model
- replacing level internals with a new custom layer engine

Why:

- `Level` is already threaded through object visibility and edit behavior
- deep changes here are likely to create broad regressions

### 2. Do not immediately create many new subclasses

Avoid starting with:

- `HedgePiece extends Wall`
- `LandscapeArea extends Room`
- `PlantPiece` as a large custom hierarchy
- `IrrigationZone` as a full new object family

Why:

- the product should first prove which custom object types are truly necessary
- too many early subclasses will increase rendering, editing, persistence, and controller complexity at once

Better Phase 1 rule:

- first reuse stock semantics
- then introduce custom subclasses only where the stock abstraction clearly breaks

### 3. Do not chase 3D customization

Avoid:

- major work on 3D rendering
- terrain modeling
- realistic outdoor visualization

Why:

- the product focus is 2D
- 3D work would consume time without helping the core workflow enough

### 4. Do not overbuild CAD interchange first

Avoid:

- large early effort on DWG / DXF parity
- permit-grade CAD output goals in Phase 1

Why:

- the current product direction prioritizes ease of use and semantic editing over traditional CAD workflows
- output can be improved later once the editing model is validated

## Phase 1 Product Shape

If this pivot is successful, the first Sweet Home 3D-based MVP should feel like:

- a guided 2D planner
- object-based editing first
- fast placement of walls, doors, windows, plants, and outdoor objects
- simple named visibility groups
- dimensions, labels, schedules, and printable plan output

It should not yet try to be:

- a full CAD replacement
- a BIM system
- a complete landscape architecture suite

## Best Early Proof Points

Before committing to a full pivot, Phase 1 should prove:

1. We can present a simpler, landscape-friendly shell without the app feeling trapped in interior-design language.
2. We can use levels as practical visibility groups for real plan workflows.
3. We can make plants and outdoor objects feel native in the 2D plan.
4. We can generate a useful plant schedule / legend from placed objects.
5. We can produce acceptable black-and-white and color plan output from the same project.

## Bottom Line

`Sweet Home 3D` should be treated as a semantic editing foundation to reshape carefully, not as something to rewrite wholesale at the start.

Phase 1 should:

- reuse its strongest architectural object behaviors unchanged
- adapt its UI, rendering, and library organization quickly
- postpone deep model refactors until they are clearly justified by product evidence

This gives the best chance of reaching a native-feeling 2D architectural and landscape planner faster than continuing to force that behavior onto a primitive-based CAD engine.
