# SPIKE-42 — Plant Inspector UX Spec

**Date:** August 27, 2026  
**Status:** Draft  
**Parent:** [SPIKE-38](sweethome3d-spike-38-plant-object-area-fill-behavior.md), [SPIKE-39](sweethome3d-spike-39-plant-symbol-asset-format-and-tinting.md), [SPIKE-40](sweethome3d-spike-40-plant-symbol-metadata-schema.md), [SPIKE-41](sweethome3d-spike-41-plant-style-preset-spec.md)  
**Related:** `sweethome3d-spike-19-inspector-feasibility.md`, `sweethome3d-spike-29-right-column-context-deck.md`

---

## Goal

Define a plant-specific inspector experience that makes plant placement, sizing, rotation, style, and basic area-fill editing feel fast and natural without pushing users into a modal dialog for routine work.

---

## Short Answer

When a plant is selected, the right inspector should become the primary editing surface.

It should expose:

- plant identity
- size
- rotation
- style preset
- variation eligibility
- area-fill relationship when relevant

The inspector should be optimized for quick edits first, with deeper metadata or special-case controls deferred to a secondary dialog only when needed.

---

## Locked decisions

| Topic | Decision |
|-------|----------|
| **Primary edit surface** | Use the right inspector for routine plant edits |
| **Modal reliance** | Avoid requiring double-click dialogs for common tasks |
| **Direct manipulation** | Plant resize / rotate / move should also work on-canvas when available |
| **Inspector priority** | Show the most common controls first: size, rotation, style |
| **Preset editing** | Preset choice belongs in inspector; full custom styling is deferred |
| **Area-fill context** | If a plant belongs to a generated fill, show that relationship clearly |
| **Advanced metadata** | Botanical / schedule details may live in a secondary section or dialog |
| **Selection model** | Single-plant selection is the primary case; multi-select can be simplified later |

---

## Design intent

The plant inspector should feel lighter than a general-purpose object properties form.

It should answer these questions immediately:

- what plant is this?
- how big is it?
- what style is it using?
- can I rotate it?
- is it just a single placed plant, or part of a generated planting area?

---

## Inspector structure

## Recommended top-level sections

1. `Plant`
2. `Appearance`
3. `Placement`
4. `Area Fill` when applicable
5. `Details` optional / collapsed

---

## Section 1 — Plant

Purpose:

- identify the selected plant clearly

Recommended contents:

- symbol preview thumbnail
- `Display name`
- optional `Botanical name`
- category
- level / layer name

Example:

```text
Plant
[ preview ]  Foundation Shrub
Ilex vomitoria
Category: Shrubs
Layer: Plants / Proposed
```

### Notes

- this section should be mostly read-only in MVP
- library reassignment is out of scope for the first pass

---

## Section 2 — Appearance

Purpose:

- control visual styling quickly

Recommended controls:

- `Style preset` dropdown
- optional `Draft / Color` indicator if global mode exists later
- optional `Tintable` badge or status line

Example:

```text
Appearance
Style: [ Soft Green v ]
Asset: SVG tintable
```

### MVP behavior

- selecting a preset updates the plant immediately
- if the symbol is PNG-only or not tintable, preset handling falls back gracefully

### Out of scope for MVP

- per-slot custom color editor
- user-authored presets

---

## Section 3 — Placement

Purpose:

- expose the most common geometric edits

Recommended controls:

- `Width`
- `Depth`
- `Keep proportions` toggle
- `Rotation`
- optional `X / Y` position fields only if consistent with broader ALP inspector patterns

Example:

```text
Placement
Width:   [ 3' 0" ]
Depth:   [ 3' 0" ]
[x] Keep proportions
Rotation: [ 15° ]
```

### Expected behavior

- editing width updates the plant immediately
- editing depth updates the plant immediately when proportions are unlocked
- rotation updates immediately
- inspector values stay in sync with on-canvas grip edits

### Important rule

This section should support both:

- precise field-based editing
- direct manipulation on canvas

The inspector should not replace on-canvas editing; it should complement it.

---

## Section 4 — Area Fill

Show this section only if the selected plant belongs to a generated planting area recipe.

Purpose:

- clarify relationship to the fill
- reduce confusion when a plant is one instance of a generated cluster

Recommended contents:

- source area name
- source fill recipe name or symbol
- random variation summary
- actions:
  - `Regenerate Fill`
  - `Detach This Plant`
  - `Select Parent Area`

Example:

```text
Area Fill
Parent area: Front Bed A
Recipe: Foundation Shrub @ 36"
Variation: +/-5% size, random rotation
[ Regenerate Fill ] [ Detach This Plant ]
```

### MVP simplification

- section may be collapsed by default
- only show for generated plants

---

## Section 5 — Details

Purpose:

- hold secondary metadata without cluttering common editing

Suggested contents:

- common name
- botanical name
- schedule name
- notes
- takeoff code
- default spacing

### UX recommendation

This section should be collapsed by default in MVP.

---

## Single selection behavior

When one plant is selected:

- show full plant inspector
- update preview and metadata for that plant
- enable style, size, and rotation controls

This is the primary design target.

---

## Multi-selection behavior

When multiple plants are selected:

Recommended MVP behavior:

- show a simplified bulk inspector
- allow only safe shared edits

Suggested shared controls:

- style preset
- rotation reset or rotate by value
- width / scale if compatible
- delete

If selected plants differ too much, show mixed values instead of forcing all details.

---

## Empty or non-plant selection behavior

If no plant is selected:

- hide the plant inspector
- or show a lightweight empty state such as:
  - `Select a plant to edit size, style, and placement.`

If a non-plant object is selected:

- defer to the relevant object inspector instead

---

## Interaction with on-canvas editing

The inspector should coordinate with direct manipulation.

### Expected on-canvas interactions

- drag plant to move
- drag side grip to resize
- drag rotate handle to rotate

### Inspector sync rules

- if the user resizes on canvas, width/depth fields update live
- if the user rotates on canvas, rotation field updates live
- if the user changes style in inspector, plan appearance updates live

This is important so the app feels like one coherent system, not two separate editing modes.

---

## Relation to earlier spikes

### `SPIKE-38`

Provides behavior rules:

- plant instances
- absolute size
- rotation
- area-fill variation

### `SPIKE-39`

Provides asset rendering constraints:

- PNG fallback
- structured SVG preference
- tintable slots

### `SPIKE-40`

Provides metadata fields the inspector can surface.

### `SPIKE-41`

Provides the style preset model the inspector should expose.

---

## MVP scope

## In scope

- single-plant inspector
- plant identity section
- style preset dropdown
- width / depth / keep proportions / rotation controls
- generated-fill relationship section when applicable
- optional collapsed details section

## Out of scope

- full plant-library reassignment from inspector
- arbitrary slot-by-slot manual style editing
- rich nursery inventory management
- advanced bulk-edit rules for every field
- fully custom user preset authoring UI

---

## Recommendation

`SPIKE-42` should precede the proof spike.

Reason:

- it defines where users will actually touch the plant system
- it keeps the proof spike grounded in a real editing workflow
- it will help us judge whether the plant system is feeling product-like or just technically possible

---

## Best next step

After this spec, the strongest follow-on is:

1. a small proof spike showing one structured plant symbol switching between `Draft Gray` and `Soft Green`

That proof should ideally validate both:

- rendering behavior
- how the inspector would expose the preset switch
