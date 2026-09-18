# SPIKE-40 — Plant Symbol Metadata Schema

**Date:** August 27, 2026  
**Status:** Accepted — **SPIKE-40A shipped** (catalog + Java API)  
**Parent:** [SPIKE-38](sweethome3d-spike-38-plant-object-area-fill-behavior.md), [SPIKE-39](sweethome3d-spike-39-plant-symbol-asset-format-and-tinting.md)  
**Related:** `alp-phase-1-library-schema.md`, `Building ALP CAD  Libraries.md`

---

## Goal

Define the minimum metadata each plant symbol should carry so the app can support:

- correct default size
- predictable placement behavior
- realistic area-fill variation
- draft / color rendering choices
- plant takeoff and scheduling
- compatibility across PNG and SVG plant assets

---

## Short Answer

Each plant symbol should be more than an image file.

It should have a small metadata record that tells the app:

- what the symbol represents
- how large it should be by default
- how it may rotate or vary
- whether it supports tinting
- how it should participate in schedules and fills

This metadata is the bridge between:

- `SPIKE-38` plant behavior
- `SPIKE-39` plant asset format
- future plant schedules / counts / presets

---

## Locked decisions

| Topic | Decision |
|-------|----------|
| **Asset independence** | Metadata should work with both PNG and SVG assets |
| **Default size required** | Every plant symbol must define a real-world default size |
| **Behavior flags** | Rotation / scale variation support should be explicit metadata |
| **Scheduling** | Plant symbols should carry enough identity for takeoff and schedules |
| **Tint support** | Tintability is metadata-driven, not assumed from file type alone |
| **Symmetry** | Symmetry should be explicit so random rotation can behave intelligently |
| **MVP scope** | Keep schema small and practical; defer botanical over-modeling |

---

## Required metadata

Each plant symbol should define at minimum:

- `symbolId`
- `displayName`
- `category`
- `assetType`
- `assetPath`
- `defaultWidth`
- `defaultDepth`
- `keepProportions`
- `isSymmetrical`
- `supportsRandomRotation`
- `supportsRandomScale`
- `supportsTint`
- `scheduleName`

### Field definitions

#### `symbolId`

Stable internal identifier.

Example:

- `tree-canopy-round-001`
- `shrub-foundation-012`

#### `displayName`

User-facing symbol name shown in the library.

Examples:

- `Round Canopy Tree`
- `Foundation Shrub`

#### `category`

High-level library grouping.

Examples:

- `Canopy Trees`
- `Shrubs`
- `Accent Plants`
- `Hedges`
- `Palms`

#### `assetType`

How the symbol artwork is stored.

Allowed MVP values:

- `png`
- `svg`

#### `assetPath`

Path or catalog reference to the symbol artwork.

#### `defaultWidth` / `defaultDepth`

Real-world default placed size in plan units.

Examples:

- `12' x 12'` for a canopy tree
- `3' x 3'` for a shrub
- `4' x 2'` for a hedge module

#### `keepProportions`

Whether resizing should preserve proportions by default.

Recommended default:

- `true` for most plants

#### `isSymmetrical`

Whether the symbol is visually radial enough that rotation has little visible effect.

Examples:

- round canopy tree: `true`
- spiky accent plant: `false`

#### `supportsRandomRotation`

Whether area fill may rotate instances automatically.

#### `supportsRandomScale`

Whether area fill may apply slight size variation automatically.

#### `supportsTint`

Whether the asset supports app-side recoloring / style presets.

This is especially important for:

- structured SVG symbols
- PNG fallback symbols that do not support tinting

#### `scheduleName`

Name used in takeoff / schedule tables.

This may match `displayName`, but does not have to.

---

## Recommended optional metadata

These fields are not required for the first pass, but are good to support soon:

- `botanicalName`
- `commonName`
- `defaultSpacing`
- `matureWidth`
- `matureDepth`
- `notes`
- `styleFamily`
- `rotationStep`
- `preferredFillPattern`
- `takeoffCode`

### Most useful near-term optional fields

#### `botanicalName`

Example:

- `Ilex vomitoria`

#### `commonName`

Example:

- `Yaupon Holly`

#### `defaultSpacing`

Helpful for area fill generation.

Example:

- `36 in`

#### `matureWidth`

Useful later for better design and estimating.

#### `styleFamily`

Lets multiple symbols share rendering presets.

Examples:

- `soft-canopy`
- `spiky-accent`
- `hedge-mass`

#### `rotationStep`

Useful when a symbol should rotate only in discrete increments.

Examples:

- `0` or `free`
- `15 deg`
- `90 deg`

---

## Rendering-related metadata

This schema should support both legacy assets and future tintable ones.

### For PNG symbols

Recommended metadata behavior:

- `assetType = png`
- `supportsTint = false` unless a special tint workflow exists

### For SVG symbols

Recommended metadata behavior:

- `assetType = svg`
- `supportsTint = true` only if the SVG follows the structured layer/class convention from `SPIKE-39`

### Optional future render fields

- `outlineSlot`
- `fillSlot`
- `detailSlot`
- `shadowSlot`

These are not required in MVP, but could help the renderer map tint targets later.

---

## Area-fill metadata use

Area-fill generation should read plant metadata directly.

Important fields for fills:

- `defaultWidth`
- `defaultDepth`
- `defaultSpacing`
- `isSymmetrical`
- `supportsRandomRotation`
- `supportsRandomScale`

### Example behavior

A fill recipe using a shrub symbol might do this:

- start from `defaultWidth = 3'`
- use `defaultSpacing = 36 in`
- apply `supportsRandomScale = true`
- apply `size variation = +/- 5%`
- apply `supportsRandomRotation = false`

That gives believable results without the user having to configure every rule manually.

---

## Scheduling / takeoff metadata use

The plant schedule should not depend only on the image filename.

It should read explicit metadata like:

- `scheduleName`
- `botanicalName`
- `commonName`
- `takeoffCode`

This makes schedules cleaner and more stable even if artwork changes later.

---

## Suggested data shape

A simple conceptual record might look like this:

```json
{
  "symbolId": "shrub-foundation-012",
  "displayName": "Foundation Shrub",
  "category": "Shrubs",
  "assetType": "svg",
  "assetPath": "plants/shrubs/foundation-shrub-012.svg",
  "defaultWidth": "3ft",
  "defaultDepth": "3ft",
  "keepProportions": true,
  "isSymmetrical": true,
  "supportsRandomRotation": true,
  "supportsRandomScale": true,
  "supportsTint": true,
  "scheduleName": "Foundation Shrub",
  "botanicalName": "Ilex vomitoria",
  "commonName": "Yaupon Holly",
  "defaultSpacing": "36in"
}
```

This is only an example shape, not a final serialization requirement.

---

## MVP scope

## In scope

- required identity fields
- required size fields
- basic behavior flags
- tint support flag
- basic schedule naming fields
- support for both PNG and SVG asset types

## Out of scope

- full nursery inventory data
- cost estimating fields
- growth-rate simulation
- climate-zone intelligence
- full botanical taxonomy model

---

## Recommendation

`SPIKE-40` should come before a Plant Style Preset spec.

Reason:

- presets need metadata to know what they can safely affect
- area fill needs metadata to know what it may vary
- schedules need metadata to know what a plant actually is

So the order should be:

1. `SPIKE-38` — behavior
2. `SPIKE-39` — asset format + tinting
3. `SPIKE-40` — metadata schema
4. follow-on style preset spec

---

## Best next step

After this spike, the cleanest follow-on is:

- a short **Plant Style Preset Spec**

That next spec can define how presets like:

- `Draft Gray`
- `Soft Green`
- `Dark Evergreen`
- `Existing Muted`
- `Proposed Brighter`

interact with the metadata fields defined here.
