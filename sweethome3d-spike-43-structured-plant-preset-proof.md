# SPIKE-43 — Structured Plant Preset Proof

**Date:** August 27, 2026  
**Status:** Draft — SPIKE-44A **COMPLETED** (QA passed Aug 27, 2026)  
**Parent:** [SPIKE-38](sweethome3d-spike-38-plant-object-area-fill-behavior.md), [SPIKE-39](sweethome3d-spike-39-plant-symbol-asset-format-and-tinting.md), [SPIKE-40](sweethome3d-spike-40-plant-symbol-metadata-schema.md), [SPIKE-41](sweethome3d-spike-41-plant-style-preset-spec.md), [SPIKE-42](sweethome3d-spike-42-plant-inspector-ux-spec.md)

---

## Goal

Prove that one structured plant symbol can switch cleanly between `Draft Gray` and `Soft Green` inside Sweet Home 3D using a simple inspector-style preset picker.

This spike should answer one practical question:

Can we get believable plant style switching with the current Sweet Home 3D 2D furniture rendering path, without first building a whole new plant object engine?

---

## Short Answer

Yes, this looks like a strong proof candidate.

Sweet Home 3D already has most of the plumbing we need:

- ALP plant identification via `AlpPlantUtils.java`
- per-object custom properties via `HomeObject.setProperty(...)`
- plan icon fill support via `HomePieceOfFurniture.PLAN_ICON_FILL_PROPERTY`
- fill tint application in `PlanComponent.java`
- an existing docked inspector surface in `SelectionInspectorPane.java`

That means the proof spike can stay intentionally small:

1. one structured plant asset
2. two named presets
3. one plant-only preset dropdown in the inspector
4. immediate repaint in plan view
5. persistence through save / reopen

---

## Proof scope

### In scope

- one ALP plant symbol only
- one structured top-view asset that supports tintable fill behavior
- two presets:
  - `Draft Gray`
  - `Soft Green`
- a simple preset picker in the inspector
- preset selection updates visible 2D appearance immediately
- preset survives file save / reopen

### Out of scope

- full plant inspector
- area-fill generation
- random variation
- per-slot manual style editing
- user-authored presets
- batch style editing across large selections
- non-plant furniture support

---

## Key finding from the source pass

The most important discovery is that Sweet Home 3D already supports a layered plan-icon model for furniture.

Relevant behavior:

- `PlanComponent.paintPieceOfFurnitureTop(...)` already checks `HomePieceOfFurniture.PLAN_ICON_FILL_PROPERTY`
- when a plan icon fill asset exists, the renderer can combine:
  - a base outline icon
  - a fill icon
  - a furniture `fillColor`
- `HomeObject` already supports arbitrary string/content properties
- `HomeFurniturePanel` already uses `fillColor` as a plan wash control

This is exactly the kind of seam we want for a proof.

---

## Recommended proof strategy

## 1. Use a structured plant symbol, not a flat PNG

The proof should use one plant symbol with:

- a clean outline plan icon
- a matching fill mask / wash icon

Conceptually:

- outline asset = black linework that stays stable
- fill asset = closed silhouette or wash shape that can be tinted gray or green

This can be delivered either as:

- two SVG-derived assets, or
- two plan-ready icon contents already supported by SH3D’s content model

For this proof, the important thing is not “SVG everywhere.”
The important thing is that the symbol is structured into:

- stable outline
- tintable fill

---

## 2. Drive preset choice through plant metadata plus fill color

The proof should store both:

- the named preset
- the concrete tint value used for rendering

Recommended per-piece properties:

- `alp.plantStylePreset = draftGray | softGreen`
- `fillColor = concrete tint color already used by SH3D rendering`

Why both?

- `fillColor` makes the render path easy
- `alp.plantStylePreset` preserves semantic intent
- later, if presets evolve, we still know which named style the user chose

---

## 3. Add one plant-only preset picker to the docked inspector

The smallest believable UI is a single dropdown shown only when:

- selection is furniture
- selection is an ALP plant
- selection is single-select, or all selected plants share a common preset

Suggested UI:

```text
Plant Appearance
Preset: [ Draft Gray v ]
```

Initial options:

- `Draft Gray`
- `Soft Green`

Behavior:

- choosing a preset updates the selected plant immediately
- changing preset should not require opening the full furniture dialog
- if the symbol is not an ALP plant, hide this control entirely

---

## Preset definitions for the proof

These can be approximate and refined later.

### `Draft Gray`

Intent:

- readable draft / permit / monochrome planning look

Recommended proof values:

- fill tint: light neutral gray
- outline: unchanged from asset
- no extra shadow behavior in this spike

Suggested proof tint:

- `#B8B8B8` or similar

### `Soft Green`

Intent:

- calm presentation planting look

Recommended proof values:

- fill tint: muted green wash
- outline: unchanged from asset
- no extra shadow behavior in this spike

Suggested proof tint:

- `#A8C78E` or similar

---

## Recommended implementation path

## A. Plant detection

Use existing helper:

- `com.eteks.sweethome3d.model.AlpPlantUtils`

This should decide whether the selected furniture qualifies for the plant preset UI.

No major architecture change needed here.

---

## B. Preset storage

Use existing custom property support on `HomeObject`.

Primary property:

- `alp.plantStylePreset`

Rendering value:

- use `HomeFurnitureController.setFillColor(...)` or direct piece fill update through the normal modification path

This is low risk because SH3D already persists custom string properties and `fillColor` in home XML.

---

## C. Inspector control

Best first insertion point:

- `SelectionInspectorPane.java`
- specifically `FurnitureInspectorPanel`

Why this is the right place:

- it already supports furniture-only controls
- it already has summary / size / color behavior
- it already refreshes with selection changes
- it avoids forcing a modal dialog

Recommended proof UI addition:

- add a small `Plant Appearance` titled section below the existing size / orientation controls or near paint controls
- show only for plant selection
- one dropdown only

Recommended proof behavior:

- selection refresh reads `alp.plantStylePreset` or infers from `fillColor`
- dropdown change writes both preset property and fill color
- use existing furniture modify flow so repaint and undo continue to work normally

---

## D. Rendering path

Best first rendering path:

- keep using `PlanComponent.paintPieceOfFurnitureTop(...)`
- keep using `PLAN_ICON_FILL_PROPERTY`
- keep using `fillColor`

This is the strongest part of the proof because it avoids inventing a separate plant renderer too early.

If the structured symbol is authored correctly, the current layered icon path should already do most of the visual work.

---

## E. Persistence

Expected persistence path:

- `fillColor` already persists in home XML
- custom properties already persist through SH3D object property serialization

Proof requirement:

- save file
- reopen file
- verify preset appearance remains correct
- verify preset dropdown restores correctly

---

## Concrete code touchpoints

### Likely files to touch

- `src/com/eteks/sweethome3d/model/AlpPlantUtils.java`
- `src/com/eteks/sweethome3d/swing/SelectionInspectorPane.java`
- `src/com/eteks/sweethome3d/swing/package.properties`
- optional localized string bundles if we want translations later

### Likely files to rely on mostly unchanged

- `src/com/eteks/sweethome3d/model/HomeObject.java`
- `src/com/eteks/sweethome3d/model/HomePieceOfFurniture.java`
- `src/com/eteks/sweethome3d/viewcontroller/HomeFurnitureController.java`
- `src/com/eteks/sweethome3d/swing/PlanComponent.java`

### Important rendering seam

- `PlanComponent.paintPieceOfFurnitureTop(...)`

This is where the proof should succeed or fail visually.

---

## Suggested property names

Recommended proof names:

- `alp.plantStylePreset`
- `alp.plantStylePresetVersion`

The version field is optional for the proof, but useful if presets later evolve.

---

## Suggested decision rules

### Rule 1

If the selected furniture is not an ALP plant, do not show plant preset UI.

### Rule 2

If the selected plant has no preset yet, default to `Soft Green` for presentation-friendly first behavior.

### Rule 3

`Draft Gray` and `Soft Green` should only change appearance, never identity, size, schedule count, or level.

### Rule 4

If a plant asset lacks structured fill support, the dropdown may be hidden or disabled rather than pretending to work.

For the proof spike, prefer using one asset known to support the effect.

---

## Acceptance criteria

The proof spike is successful if all of these are true:

1. A chosen ALP plant shows a visible difference between `Draft Gray` and `Soft Green` in 2D plan.
2. The change is driven from a small inspector dropdown, not only a modal dialog.
3. Switching presets repaints immediately.
4. The plant remains a normal movable / resizable SH3D object.
5. Save and reopen preserves the chosen preset and visible appearance.
6. The implementation does not break non-plant furniture rendering.

---

## Failure signals

This proof should be considered weak if any of these happen:

- the tint only affects a crude bounding box rather than the plant silhouette
- the outline is destroyed by the fill tint
- the inspector control requires awkward modal round-trips
- the preset does not persist reliably
- the code path starts requiring many special-case branches in `PlanComponent`

---

## Recommendation

Proceed with this proof spike.

This is a good next step because it is:

- visually meaningful
- small in scope
- grounded in real SH3D source seams
- directly aligned with your goal of object-based but easy-to-use 2D planning

It also gives us a better decision point afterward:

- if this works well, plant presentation can evolve inside Sweet Home 3D naturally
- if this feels brittle, we will know that before investing in a larger plant-system fork

---

## Next step after this spike

If this proof succeeds, the next logical follow-up is:

**SPIKE-44A — one actual code proof in the Sweet Home 3D fork**

Scope:

- one sample ALP plant asset
- one dropdown in inspector
- two presets wired to real rendering
- persistence test through save / reopen

That would move us from design confidence into a real implementation checkpoint.

---

## SPIKE-44A — implementation + QA (completed)

**Completed:** August 27, 2026  
**Code:** `AlpPlantUtils.java`, `SelectionInspectorPane.java` (Plant style preset dropdown), `package.properties`

### Delivered

- Plant-only **Plant style → Preset** dropdown in docked furniture inspector
- Presets: **Draft Gray**, **Soft Green**
- Writes `alp.plantStylePreset` + `fillColor`; layered plan wash repaints immediately
- Persistence through save / reopen

### Manual QA (Aug 27, 2026) — **PASSED**

| Test | Result |
|------|--------|
| Soft Green ↔ Draft Gray visual flip on plan | Pass |
| Black lines stable | Pass |
| Save / reopen | Pass |
| Undo | Pass |
| ALP Plants Line → panel hidden | Pass |
| Multi-select → panel hidden | Pass |
| Non-plant furniture unchanged | Pass |

### QA notes (fed SPIKE-46)

- **Color and texture** sidebar control has no plan effect on layered plants (uses `color`, not `fillColor`)
- **Modify furniture → Plan fill** can override preset wash while dropdown still showed stored preset name → addressed in **SPIKE-46A**

### Follow-up

- [SPIKE-46](sweethome3d-spike-46-plant-inspector-appearance-polish.md) — inspector appearance polish (46A hide noise + honest preset label; 46B Plan fill in sidebar)
