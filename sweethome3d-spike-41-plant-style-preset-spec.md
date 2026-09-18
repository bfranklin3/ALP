# SPIKE-41 — Plant Style Preset Spec

**Date:** August 27, 2026  
**Status:** Draft  
**Parent:** [SPIKE-38](sweethome3d-spike-38-plant-object-area-fill-behavior.md), [SPIKE-39](sweethome3d-spike-39-plant-symbol-asset-format-and-tinting.md), [SPIKE-40](sweethome3d-spike-40-plant-symbol-metadata-schema.md)  
**Related:** `alp-phase-1-library-schema.md`, `Building ALP CAD  Libraries.md`

---

## Goal

Define a simple, reusable style preset system for plant symbols so the app can switch plants between draft and presentation looks without forcing users to manually restyle every plant instance.

---

## Short Answer

A plant style preset is a named visual recipe applied to a plant symbol instance.

It should control things like:

- fill color / tint
- fill opacity
- outline color
- detail color
- shadow visibility or strength

The first version should prefer a few curated presets over a full freeform styling system.

---

## Locked decisions

| Topic | Decision |
|-------|----------|
| **Preset scope** | Presets apply to plant symbols only |
| **Primary purpose** | Support quick switching between draft and presentation looks |
| **Initial UX** | Use a small curated preset list, not a full style editor |
| **Metadata dependency** | Presets operate only on slots the asset and metadata say are supported |
| **Fallback behavior** | Legacy PNG plants may use coarse preset mapping or no-op fallback |
| **Per-instance override** | Defer arbitrary manual per-slot styling; presets first |
| **MVP preset count** | Keep initial set small and opinionated |

---

## What a preset controls

A style preset may affect these visual slots:

- `fill`
- `fillOpacity`
- `outline`
- `detail`
- `shadow`
- `highlight`

Not every plant asset needs every slot.

Presets should only affect slots that the asset and metadata actually support.

---

## Preset application rules

## Rule 1 — Metadata-driven behavior

A preset must respect symbol metadata from `SPIKE-40`.

Important fields include:

- `supportsTint`
- `assetType`
- optional future slot metadata like `fillSlot`, `outlineSlot`, `detailSlot`

If a symbol does not support tinting, the preset should fall back gracefully.

## Rule 2 — Asset-safe changes only

A preset should not assume every symbol has the same structure.

For example:

- a simple outline-only symbol may only react to outline and wash fallback
- a structured SVG may react to fill, outline, and detail separately

## Rule 3 — Fast switching

A user should be able to change plant appearance quickly without reopening a deep editor for every item.

## Rule 4 — Stable scheduling

Changing a preset must never change:

- plant identity
- schedule count
- category
- takeoff behavior

Presets are visual only.

---

## Recommended initial preset set

## 1. `Draft Gray`

Purpose:

- monochrome or near-monochrome construction / permit style output

Behavior:

- light gray fill
- dark gray or black outline
- detail reduced
- shadow off or minimal

Best use:

- printable draft plans
- black-and-white export

## 2. `Soft Green`

Purpose:

- calm presentation default for landscape plans

Behavior:

- soft muted green fill
- dark green or black outline
- subtle detail
- no harsh shadow

Best use:

- everyday design presentations
- mixed architecture + landscape plans

## 3. `Dark Evergreen`

Purpose:

- stronger visual weight for featured plants or denser planting graphics

Behavior:

- deeper green fill
- darker outline
- slightly richer detail
- subtle shadow optional

Best use:

- larger shrubs
- emphasis planting
- presentation mode when stronger contrast is desired

## 4. `Existing Muted`

Purpose:

- visually de-emphasize existing planting while keeping it readable

Behavior:

- desaturated green-gray fill
- medium gray outline
- low contrast detail
- minimal shadow

Best use:

- existing conditions plans
- before / after drawings

## 5. `Proposed Brighter`

Purpose:

- visually emphasize proposed planting

Behavior:

- brighter controlled green fill
- crisp darker outline
- moderate detail
- no heavy shadow

Best use:

- proposal plans
- design-option presentations

---

## Preset behavior by asset type

## PNG assets

For legacy PNG assets:

- presets may map to pre-rendered variants when available
- if no alternate variant exists, preset may have limited or no visible effect

Recommended MVP behavior:

- allow preset assignment
- apply only if variant support exists
- otherwise keep appearance unchanged and avoid breaking the symbol

## SVG assets

For structured SVG assets:

- presets should map directly to supported slots
- fill, outline, detail, and shadow may all be controlled separately when present

This is the preferred long-term path.

---

## Draft mode interaction

If the app later supports a global plan-wide draft mode, plant presets should integrate cleanly.

### Recommended rule

When global draft mode is active:

- all plant instances should either switch to `Draft Gray`
- or render through a global grayscale transform that approximates `Draft Gray`

Preferred approach:

- explicit preset substitution is cleaner and more predictable for structured plant symbols

---

## Level / role interaction

Plant presets may later interact with level role metadata.

Examples:

- plants on `Existing` layer default to `Existing Muted`
- plants on `Proposed` layer default to `Soft Green` or `Proposed Brighter`

This should be treated as a defaulting rule, not a lock.

Users should still be able to override the preset when needed.

---

## UI recommendation

## MVP UI

Use a simple preset selector in the plant inspector.

Example:

- `Style: [ Soft Green v ]`

This is better than exposing many separate color controls too early.

## Later UI

Possible later additions:

- advanced style editor
- user-defined presets
- save current visual style as preset
- preview swatches in the library

These are out of scope for the first pass.

---

## Fallback behavior

If a preset targets a slot the symbol does not support:

- ignore that slot
- do not fail the whole preset application

If a legacy PNG symbol cannot be restyled meaningfully:

- keep the original appearance
- optionally show the preset as assigned but visually limited

This keeps compatibility without promising more than the asset can deliver.

---

## Suggested conceptual data shape

A preset might conceptually look like this:

```json
{
  "presetId": "soft-green",
  "displayName": "Soft Green",
  "fill": "#9BCB8E",
  "fillOpacity": 0.65,
  "outline": "#2F4A2F",
  "detail": "#5F8758",
  "shadow": "off"
}
```

This is an example only, not a required final serialization format.

---

## MVP scope

## In scope

- named built-in presets
- inspector preset picker
- draft vs presentation oriented presets
- metadata-aware slot application
- graceful fallback for non-tintable assets

## Out of scope

- full custom style editor
- arbitrary user color picking for every plant slot
- user-authored preset management
- procedural seasonal color simulation

---

## Recommendation

`SPIKE-41` is the right follow-on to `SPIKE-40`.

It completes the first clean plant stack:

- `SPIKE-38` — behavior
- `SPIKE-39` — asset format
- `SPIKE-40` — metadata schema
- `SPIKE-41` — visual preset system

That gives us a coherent foundation for future plant libraries, area fills, and plan presentation modes.

---

## Best next step

After this spike, the strongest next follow-on would likely be one of:

1. a **Plant Inspector UX Spec**
2. a **Plant Area Scatter / Fill Recipe Spec** implementation-oriented follow-up
3. a small technical spike proving one SVG plant can switch between `Draft Gray` and `Soft Green`
