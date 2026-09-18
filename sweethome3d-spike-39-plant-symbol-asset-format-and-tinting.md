# SPIKE-39 — Plant Symbol Asset Format + Tinting

**Date:** August 27, 2026  
**Status:** Draft  
**Parent:** [SPIKE-38](sweethome3d-spike-38-plant-object-area-fill-behavior.md) — Plant Object + Area Fill Behavior  
**Related:** `alp-phase-1-library-schema.md`, `Building ALP CAD  Libraries.md`

---

## Goal

Define the artwork format and rendering strategy for plant symbols so they can support:

- absolute default sizes
- clean scaling
- draft and color presentation modes
- optional tinting / recoloring
- future area-fill variation without blurry or repetitive results

---

## Short Answer

The plant behavior in `SPIKE-38` should stay format-agnostic.

But the preferred long-term asset strategy is **not** flat PNG-only symbols.

The cleanest long-term approach is a disciplined **tintable SVG workflow** where the app knows which parts of the symbol are:

- outline
- fill / wash
- inner detail
- optional shadow / accent

For MVP, a **hybrid workflow** is the safest recommendation:

- support existing PNG plant symbols
- allow improved PNG variants for quick wins
- define a new preferred SVG structure for better future tinting and scaling

---

## Locked decisions

| Topic | Decision |
|-------|----------|
| **MVP compatibility** | Existing PNG plant assets remain supported |
| **Preferred future format** | Structured SVG plant symbols |
| **Immediate fallback** | PNG variant workflow is acceptable for Phase 1 |
| **Tint model** | App-side tinting should target named visual layers, not arbitrary pixels |
| **Default plant look** | Symbols should support a light wash + darker outline |
| **Draft mode** | Gray / monochrome wash should be available |
| **Color mode** | Soft green or user-selected presentation tint should be available |
| **Asset discipline** | SVGs must follow a strict layer/class convention, not freeform arbitrary artwork |
| **Recommendation** | Use a hybrid path first, migrate plant library toward SVG over time |

---

## Asset strategy options

## Option A — PNG-only workflow

Each plant symbol is delivered as one or more flat raster files.

Examples:

- outline-only PNG
- gray-wash PNG
- green-wash PNG
- dark-green PNG

### Pros

- easiest to produce now
- works with the current library approach
- no advanced renderer work required for basic use

### Cons

- recoloring is baked in
- scaling quality is limited
- draft/color switching needs duplicate assets
- many variants become hard to manage

### Best use

- near-term content production
- fast MVP library upgrades

---

## Option B — Tintable SVG workflow

Each plant symbol is authored as structured vector artwork.

The app renders and tints visual parts at draw time.

### Pros

- crisp scaling at many sizes
- one symbol can support multiple visual styles
- cleaner draft/color mode switching
- much better long-term maintainability

### Cons

- more engineering work
- requires disciplined asset prep
- arbitrary stock SVGs will not be reliable enough without cleanup

### Best use

- long-term ALP-native plant system
- higher-quality professional library

---

## Option C — Hybrid workflow

Support both:

- PNG plant symbols for compatibility and speed
- SVG plant symbols for preferred future behavior

### Pros

- lowest migration risk
- existing library work is still usable
- better symbols can gradually replace weaker ones

### Cons

- two asset paths to maintain
- renderer and import rules must distinguish legacy vs preferred symbols

### Best use

- recommended Phase 1 to Phase 2 transition path

---

## Recommended approach

Use **Option C: Hybrid**.

### Phase 1

- keep PNG compatibility
- improve weak symbols with better pre-made washed PNG variants
- define the SVG standard now even if only a subset of plants use it first

### Phase 2+

- add app-side tint support for structured SVG symbols
- migrate important plant categories first:
  - canopy trees
  - shrubs
  - accent plants
  - hedge modules

---

## Preferred SVG structure

A tintable plant SVG should not be arbitrary art.

It should use a small known structure.

### Required visual parts

- `outline`
- `fill`

### Optional visual parts

- `detail`
- `shadow`
- `highlight`

### Recommended naming

Use SVG `id` or `class` names such as:

- `outline`
- `fill`
- `detail`
- `shadow`

The renderer should look for those known names only.

If they are missing, the symbol should fall back gracefully.

---

## Rendering rules

## Outline

- darker stroke
- usually not user-tinted in MVP
- may switch between black / dark gray / dark green by style preset later

## Fill

- primary tint target
- should support opacity control
- used for gray wash in draft mode and green wash in color mode

## Detail

- optional darker or lighter accent tint
- should not overpower small printed plans

## Shadow

- optional and subtle
- may be ignored in draft mode

---

## Style presets

Rather than exposing a full freeform color picker immediately, the best early product path is preset styles.

Recommended presets:

- `Draft Gray`
- `Soft Green`
- `Dark Evergreen`
- `Existing Muted`
- `Proposed Brighter`

This keeps the UI simpler while still making one symbol reusable in multiple contexts.

Later, user-selected custom tinting can be added on top.

---

## Size and scaling rules

This spike supports `SPIKE-38` sizing behavior.

Each symbol asset should be authored to scale cleanly from its default real-world size.

### Asset expectations

- transparent background
- centered drawing
- normalized canvas / viewBox
- no unnecessary extra margins
- no photographic texture baked into the core fill unless intentionally stylized

### Why this matters

Plant instances may:

- be resized manually
- receive +/- variation in area fills
- appear in both small and large presentation scales

Vector assets handle this better than raster assets.

---

## Orientation and symmetry metadata

Some plant symbols are nearly radial and some are directional.

Each symbol should be able to declare:

- `isSymmetrical`
- `supportsRandomRotation`
- `supportsRandomScale`

### Examples

- round canopy tree: symmetrical, random rotation optional
- agave / accent plant: directional, rotation meaningful
- hedge module: directional, rotation usually constrained

This metadata can live in library/catalog metadata even if the image itself is PNG or SVG.

---

## Draft mode vs color mode

## Draft mode

Preferred appearance:

- white or transparent background
- black or dark gray outline
- light gray wash
- minimal detail

## Color mode

Preferred appearance:

- dark outline
- soft green wash or selected plant tone
- optional subdued detail

## Important rule

Draft mode should not require a separate completely different library if SVG tinting is available.

That is one of the main reasons SVG is the better long-term format.

---

## Fallback behavior

If a symbol is legacy PNG-only:

- display it normally
- do not promise arbitrary recoloring
- allow choosing among pre-rendered variants if available

If a symbol is SVG but lacks the expected structure:

- render as-is
- disable advanced tint controls
- treat it as non-tintable until cleaned up

---

## MVP scope

## In scope

- support current PNG plant assets
- define preferred SVG layer/class convention
- define style preset behavior
- define fallback behavior for non-tintable symbols
- allow the library to contain both PNG and SVG assets

## Out of scope

- full arbitrary SVG import with no normalization rules
- full Illustrator-grade live color editing
- procedural botanical rendering
- automatic conversion of all legacy PNG plants to SVG

---

## Recommendation

`SPIKE-39` should be treated as the asset-foundation companion to `SPIKE-38`.

Together they divide the problem cleanly:

- `SPIKE-38` = how plants behave
- `SPIKE-39` = how plant symbols should be authored and rendered so that behavior looks good

The best next follow-on after this spike would be either:

1. a **Plant Symbol Metadata Schema**
2. a **Plant Style Preset Spec**
3. a small prototype using one or two SVG plants with draft/color tint switching
