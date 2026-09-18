# SPIKE-38 — Plant Object + Area Fill Behavior

**Date:** August 27, 2026  
**Status:** Draft  
**Parent:** ALP plant workflow; follows plant-library and area-fill direction  
**Related:** `alp-phase-1-library-schema.md`, `Building ALP CAD  Libraries.md`, `sweethome3d-phase-1-mvp-feature-list.md`

---

## Goal

Define how plant symbols should behave as real placeable objects and how planting areas can be filled with repeated plant instances in a way that feels natural, editable, and presentation-ready.

---

## Short Answer

Plants should not behave like static stamped graphics only.

They should behave as object instances with:

- a default real-world size
- a placed size
- a rotation
- editable plant metadata
- optional variation rules when generated inside an area

Area fill should generate many plant instances from one recipe, not one baked texture.

---

## Locked decisions

| Topic | Decision |
|-------|----------|
| **Single plant placement** | A plant is placed as an object instance with default width/depth from the library |
| **Default size** | Every plant symbol carries an absolute default size in plan units |
| **Resize** | Users may resize a placed plant; preserve proportions by default |
| **Rotate** | Users may rotate plant instances |
| **Variation** | Area-generated plants may vary slightly in size and orientation |
| **Random stability** | Area fills should use a stored random seed so a planting layout stays stable until regenerated |
| **Area fill output** | Fill creates editable plant instances, not a flattened image |
| **MVP fill type** | Start with single-species fills |
| **MVP realism** | Support slight random size and rotation variation |
| **Later expansion** | Mixed species, smarter spacing, edge-aware planting, and drift patterns can follow later |

---

## Plant object behavior

## Core plant properties

Each placed plant instance should support:

- `symbolId`
- `commonName`
- `botanicalName`
- `category`
- `defaultWidth`
- `defaultDepth`
- `placedWidth`
- `placedDepth`
- `rotation`
- `level`
- `notes`

Optional later properties:

- `matureWidth`
- `potSize`
- `spacing`
- `takeoffCode`
- `isSymmetrical`
- `supportsRandomRotation`
- `supportsRandomScale`

## Size behavior

### Library default size

Each plant symbol should have a real-world default size.

Examples:

- canopy tree: `12' x 12'`
- shrub: `3' x 3'`
- accent plant: `2' x 2'`
- hedge segment: `4' x 2'`

This is the size used when the plant is first placed.

### Instance size

After placement, the user may resize the plant instance.

Expected behavior:

- resize from grips or inspector fields
- preserve proportions by default
- allow explicit width/depth override when needed
- update the plan immediately as size changes

### Size variation

Area fill may apply slight per-instance size variation.

MVP range:

- `0%` to `+/- 10%`

Recommended default:

- `+/- 5%`

This should make grouped plantings feel less mechanical without making the schedule inaccurate in a misleading way.

---

## Orientation behavior

Each plant instance should support rotation.

### Manual placement

Users may:

- place with default orientation
- rotate afterward
- optionally use a rotate handle or inspector angle field

### Area fill orientation

Area-generated plants may use:

- fixed angle
- random angle
- constrained random angle

Recommended MVP behavior:

- symmetrical plants: random rotation allowed but visually low impact
- directional plants: random rotation only when enabled by the symbol

---

## Area fill behavior

## Concept

A planting area fill is not just a colored polygon.

It is a recipe that places many plant instances inside an area boundary using spacing and variation rules.

## Fill recipe properties

Each plant fill recipe should support:

- `areaId`
- `plantSymbolId`
- `targetSpacing`
- `edgeOffset`
- `density`
- `sizeVariationPercent`
- `rotationVariation`
- `randomSeed`

Later properties:

- `speciesMix`
- `clusterBias`
- `rowPattern`
- `followEdge`
- `avoidZones`

## MVP fill workflow

1. User draws or selects a planting area.
2. User chooses a plant symbol.
3. User enters spacing and optional variation.
4. App generates plant instances inside the area.
5. Generated plants remain individually selectable and editable.
6. App stores the fill recipe so the layout may be regenerated later.

## Placement rules

MVP generation rules:

- keep plants inside the area boundary
- respect a simple minimum spacing
- avoid obvious heavy overlap
- allow slight random offset from a simple grid or scatter pattern

This does not need to be botanically perfect in MVP.

It only needs to feel believable and editable.

---

## Editing behavior

## Single plant editing

Users should be able to:

- move a plant
- rotate a plant
- resize a plant
- duplicate a plant
- delete a plant
- edit plant properties from the inspector

## Area-generated plant editing

Users should be able to:

- select any generated plant individually
- resize or rotate one plant without destroying the full area fill
- regenerate the full fill from its recipe
- detach a plant from the recipe later if needed

Recommended MVP simplification:

- allow individual edits
- keep recipe regeneration as an explicit command
- if regenerated, manual overrides may be replaced unless detached

---

## Visual behavior

## Draft mode

In draft mode, plants should favor:

- simple outline
- light gray wash or muted hatch
- crisp readability at print scale

## Color mode

In color mode, plants should favor:

- soft green wash
- darker outline
- optional inner detail
- restrained realism, not photo clutter

## Variation effect

Random size and rotation should be subtle.

The goal is:

- less repetitive appearance

not:

- chaotic planting graphics

---

## Schedule / takeoff impact

Area fill should still support takeoff and scheduling.

Because the fill creates real instances, the app can count:

- quantity
- symbol type
- botanical name
- size class
- level

Important rule:

visual size variation should not change the plant count.

It is a display refinement, not a different species or different item type.

---

## MVP scope

## In scope

- place single plant objects with absolute default size
- move, resize, rotate single plants
- single-species planting area fill
- spacing control
- slight random size variation
- slight random rotation variation
- stable random seed
- regenerate fill command
- generated plants remain editable

## Out of scope

- mixed-species automated fills
- intelligent horticultural spacing by mature spread
- path-following hedge logic
- collision-aware mass planting solver
- sun/shade-aware placement
- automatic botanical design rules

---

## Recommendation

`SPIKE-38` is a good next spike.

It is a clean bridge between:

- library content quality
- object-based plant behavior
- more realistic planting presentation
- future plant schedules and takeoffs

The best next follow-on after this spec would be one of:

1. a **Plant Symbol Asset Spec**
2. a **Plant Fill Recipe Data Model**
3. a small prototype for **single-species area scatter generation**

