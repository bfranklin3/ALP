# SPIKE-48 — Plan Display Bounds & Display Name (Furniture / Plants)

**Date:** August 31, 2026  
**Status:** **SHIPPED** — 48A model/render/XML + 48B inspector UI  
**Parent:** [SPIKE-35](sweethome3d-spike-35-area-name-visibility.md) (area display toggles), [SPIKE-46](sweethome3d-spike-46-plant-inspector-appearance-polish.md), [SPIKE-47](sweethome3d-spike-47-plant-plan-fill-opacity.md)  
**Related:** `HomePieceOfFurniture.java`, `HomeFurnitureController.java`, `PlanComponent.java`, `SelectionInspectorPane.java`, `HomeFurniturePanel.java`, `HomeXMLHandler.java`, `HomeXMLExporter.java`

---

## Goal

Give users per-piece control over two kinds of plan “chrome” on **plants and all top-view furniture**:

1. **Display bounds** — hide the faint always-on placement rectangle when not needed (dense plantings, presentation plans).
2. **Display name** — expose the existing `nameVisible` toggle in the **docked inspector** (areas already have this; furniture only had it in the full Modify dialog).

Both toggles default **off** (`false`). Selection feedback (outline + resize handles when selected) stays on regardless of **Display bounds**.

---

## Problem

### Faint box outlines clutter dense plantings

In top-view plan mode, Sweet Home draws a semi-transparent rotated rectangle around every piece’s width × depth — even when not selected:

```4386:4390:source/SweetHome3D-7.5-src/src/com/eteks/sweethome3d/swing/PlanComponent.java
              if (paintMode == PaintMode.PAINT) {
                // Draw selection outline rectangle
                g2D.setStroke(pieceBorderStroke);
                g2D.setPaint(furnitureOutlineColor);
                g2D.draw(pieceShape);
```

This is **separate** from the thicker **selection outline** drawn in `paintFurnitureOutline()` when a piece is selected. There is **no per-piece property** to suppress the always-on box today.

Plant style **None** removes the **wash fill** inside the symbol — it does **not** remove this bounding rectangle.

### Display name exists on the model but not in the docked inspector

`HomePieceOfFurniture.nameVisible` + **Display name in plan** checkbox already exist in `HomeFurniturePanel` (full editor). `PlanComponent.paintFurnitureName()` respects `piece.isNameVisible()`.

The docked `FurnitureInspectorPanel` has a **Name** field but **no Display name checkbox**. Users editing plants from the sidebar cannot toggle plan name visibility without opening Modify furniture.

XML import already defaults missing `nameVisible` to **`false`** for furniture (unlike areas, which default **`true`**).

---

## Locked decisions (Aug 31, 2026)

### Scope

| Topic | Decision |
|-------|----------|
| **Display bounds applies to** | All **`HomePieceOfFurniture`** rendered in **top-view** plan mode — plants, benches, tables, and other catalog furniture with plan icons |
| **Not in v1** | Layer-wide “hide all bounds”; bulk apply; preset bundles; 3D view |
| **Groups** | Property on leaf pieces only (same as size/name); group selection shows merged checkbox state |

### Display bounds (`planBoundsVisible`)

| Topic | Decision |
|-------|----------|
| **Property name (Java)** | `planBoundsVisible` (`boolean`) |
| **Property enum** | `HomePieceOfFurniture.Property.PLAN_BOUNDS_VISIBLE` |
| **Checkbox label** | **Display bounds** |
| **Default (new pieces)** | **`false`** — bounds hidden |
| **Legacy XML (missing attribute)** | **`false`** — omitting attribute = hidden (clean plan by default; **existing homes lose faint boxes on first open after upgrade**) |
| **Unselected + off** | Draw symbol/icon only; **skip** `furnitureOutlineColor` rectangle |
| **Selected + off** | **Still draw** selection outline in `paintFurnitureOutline()` (resize/pick feedback) |
| **Non-top-view render path** | Unchanged in v1 (icon-mode foreground border not gated) |
| **Print / export / clipboard** | Respect `planBoundsVisible` wherever `paintFurniture()` runs with `PaintMode.PAINT` |
| **Draft mode** | Same rule — bounds toggle applies whenever top-view faint box would draw |

### Display name (`nameVisible` — existing property)

| Topic | Decision |
|-------|----------|
| **Model** | Reuse existing `nameVisible` on `HomePieceOfFurniture` — **no new field** |
| **Checkbox label (inline inspector)** | **Display name** (match areas; shorter than full editor’s “Display name in plan”) |
| **Default** | **`false`** (already Java + XML default for furniture) |
| **Full editor (`HomeFurniturePanel`)** | Keep existing label **Display name in plan** — no rename in v1 |
| **Print / export** | Already respected by `paintFurnitureName()` |

### Inspector UX

| Topic | Decision |
|-------|----------|
| **Surface** | Docked **`FurnitureInspectorPanel`** (`SelectionInspectorPane`) |
| **Placement** | **Name** panel — below name field, above Size panel |
| **Controls** | `[ ] Display name` then `[ ] Display bounds` |
| **Live edit** | Checkbox changes apply immediately (mirror area inspector + existing plant fill live edit) |
| **Multi-select** | `NullableCheckBox` indeterminate when mixed |
| **Non-plant furniture** | Same checkboxes shown (not plant-only) |

---

## Inspector UI — after SPIKE-48

### Name section (all furniture / plants)

```text
Name
┌─────────────────────────────────────────────────────────────┐
│  Name:              [ Crape Myrtle ...................... ] │
│  [ ] Display name                                           │  ← new (inline)
│  [ ] Display bounds                                         │  ← new
└─────────────────────────────────────────────────────────────┘
```

Parity with areas:

| Object | Display name | Display bounds | Display area |
|--------|--------------|----------------|--------------|
| **Area** | ✓ (SPIKE-35) | — (uses outline color) | ✓ |
| **Plant / furniture** | ✓ (SPIKE-48) | ✓ (SPIKE-48) | — |

---

## Property spec

### New field — `planBoundsVisible`

| Field | Type | Default | Notes |
|-------|------|---------|-------|
| `planBoundsVisible` | `boolean` | `false` | When `false`, skip faint top-view placement box |

| Constant | Value |
|----------|-------|
| `Property.PLAN_BOUNDS_VISIBLE` | `"PLAN_BOUNDS_VISIBLE"` |

Mirror `nameVisible` API: `isPlanBoundsVisible()` / `setPlanBoundsVisible(boolean)`.

### Existing field — `nameVisible` (no model change)

Already on `HomePieceOfFurniture`. SPIKE-48 adds **inline inspector wiring only**.

### Persistence (home XML)

```xml
<furniture name="Crape Myrtle"
           nameVisible="false"
           planBoundsVisible="false"
           … />
```

| Attribute | Export when | Import missing |
|-----------|-------------|----------------|
| `nameVisible` | `true` only (existing) | `false` (existing) |
| `planBoundsVisible` | `true` only | **`false`** |

Omit both attributes on new placements with defaults — file stays compact.

---

## Rendering rules

```text
Top-view PAINT pass (paintFurniture)
├── Always: plan icon / wash / line art (unchanged)
├── If planBoundsVisible OR (future: never) → draw furnitureOutlineColor box
└── If !planBoundsVisible → skip faint box

Selection pass (paintFurnitureOutline) — UNCHANGED
├── Selected → selectionOutlinePaint + resize indicators
└── Independent of planBoundsVisible
```

**Name pass** (`paintFurnitureName`) — unchanged; gated on `nameVisible` only.

---

## Implementation phases

### Phase 48A — Model + plan rendering (~2 h)

| Step | Scope |
|------|--------|
| A.1 | Add `planBoundsVisible` to `HomePieceOfFurniture`; `Property.PLAN_BOUNDS_VISIBLE`; clone/copy ctor |
| A.2 | `HomeFurnitureController`: `Boolean planBoundsVisible`; `refreshProperties()` merge; `modifyFurniture()` apply |
| A.3 | `PlanComponent.paintFurniture()`: wrap faint-box draw (~4386–4390) with `piece.isPlanBoundsVisible()` |
| A.4 | `HomeXMLHandler` / `HomeXMLExporter`: read/write `planBoundsVisible`; DTD comment default `false` |
| A.5 | Undo: include in `ModifiedFurniture` snapshot / restore |

**Deliverable:** Programmatic `planBoundsVisible=false` hides faint box; selection outline still draws.

### Phase 48B — Docked inspector UI (~1.5 h)

| Step | Scope |
|------|--------|
| B.1 | `package.properties`: `SelectionInspectorPane.planBoundsVisibleCheckBox.text=Display bounds` (+ mnemonic) |
| B.2 | Reuse or alias **Display name** label (`Display name` — can share `RoomPanel.nameVisibleCheckBox.text` or furniture-specific key) |
| B.3 | `FurnitureInspectorPanel`: two `NullableCheckBox` controls in name panel; refresh + live apply |
| B.4 | `applyFurnitureChanges(...)`: extend partial-modify flags so checkbox edits do not replay stale size/color (same pattern as SPIKE-47 dimension guard) |
| B.5 | `HomeFurniturePanel`: optional parity — add **Display bounds** next to existing **Display name in plan** (recommended for modal/full-editor parity) |

**Deliverable:** User toggles both checkboxes from sidebar without opening Modify furniture.

### Phase 48C — QA (~0.5 h)

| Step | Scope |
|------|--------|
| C.1 | Manual: dense planting — bounds off → clean; select one plant → selection outline visible |
| C.2 | Manual: toggle Display name; name in model/Context deck unchanged when hidden on plan |
| C.3 | Save/reopen; legacy file without `planBoundsVisible` → boxes hidden |
| C.4 | Print preview respects both toggles |
| C.5 | Multi-select mixed states → indeterminate checkboxes |
| C.6 | `HomeFileRecorderTest` round-trip for `planBoundsVisible` (recommended) |

**Deliverable:** Spike marked **SHIPPED**.

---

## Technical approach

### Files to touch

| File | Change |
|------|--------|
| **`HomePieceOfFurniture.java`** | `planBoundsVisible` field, accessors, property change |
| **`HomeFurnitureController.java`** | Controller property; refresh/apply/undo |
| **`PlanComponent.java`** | Conditional faint-box draw |
| **`HomeXMLHandler.java`** | Parse `planBoundsVisible`; DTD |
| **`HomeXMLExporter.java`** | `writeBooleanAttribute("planBoundsVisible", …, false)` |
| **`SelectionInspectorPane.java`** | `FurnitureInspectorPanel` checkboxes + live apply |
| **`HomeFurniturePanel.java`** | Optional **Display bounds** checkbox (parity) |
| **`package.properties`** | Labels + mnemonics |
| **`HomeFileRecorderTest.java`** | Round-trip (optional) |

### Reference implementations

| Pattern | Source |
|---------|--------|
| Boolean visibility + plan paint gate | `Room.nameVisible` + SPIKE-35 |
| Controller nullable multi-select | `HomeFurnitureController.nameVisible` |
| Partial live-edit apply | `FurnitureInspectorPanel.applyFurnitureChanges(...)` (SPIKE-47 dimension guard) |
| Faint box render site | `PlanComponent.paintFurniture()` lines ~4386–4390 |

### Interaction with other spikes

| Spike | Interaction |
|-------|-------------|
| **SPIKE-47** (plan fill opacity) | Independent — opacity affects wash only |
| **SPIKE-41/46** (plant style presets) | Presets do **not** auto-toggle bounds or name in v1 |
| **SPIKE-35** (area display name) | Parallel UX — same checkbox vocabulary |
| **SPIKE-36** (plan Z-order) | Independent |

---

## Test plan

### Display bounds

- [ ] Place plant with default → **no** faint box on plan.
- [ ] Enable **Display bounds** → faint rectangle appears at width × depth.
- [ ] Disable again → box gone; **symbol unchanged**.
- [ ] Select plant with bounds off → **selection outline + handles** still visible.
- [ ] Dense bed (20+ plants, bounds off) → no rectangle clutter.
- [ ] Top-view bench/table → same toggle behavior.
- [ ] Save/reopen with `planBoundsVisible="true"` → box returns.
- [ ] Legacy `<furniture>` without attribute → **no** faint box after open.
- [ ] Print preview with bounds off → no faint box on print.

### Display name (inline inspector)

- [ ] Plant with name set, **Display name** off → name hidden on plan; still in inspector title / selection summary.
- [ ] Turn **Display name** on → name appears at default offset.
- [ ] Multi-select plants with mixed `nameVisible` → indeterminate until user picks state.
- [ ] Full editor checkbox and inline checkbox stay in sync after refresh.

### Live edit / regression

- [ ] Toggle bounds/name only → width/depth/fill color **unchanged** (no stale dimension replay).
- [ ] Mixed furniture + plant selection → empty inspector; no accidental apply (existing guards).

---

## Effort estimate

| Phase | Estimate |
|-------|----------|
| 48A Model + render + XML | ~2 h |
| 48B Inspector UI | ~1.5 h |
| 48C QA | ~0.5 h |
| **Total** | **~4 h** |

---

## Deferred (post-v1)

- Layer action: “Hide bounds on all plants on layer”
- Plant style preset field bundling bounds visibility
- Global preference: “Show furniture bounds on plan”
- Gate non-top-view foreground border for consistency
- Rename full-editor label to **Display name** for vocabulary alignment

---

## Acceptance criteria

1. **Display bounds** defaults **off** for new and legacy-imported furniture/plants.
2. Faint top-view placement box draws **only** when `planBoundsVisible == true`.
3. Selection outline always draws when selected, regardless of bounds setting.
4. **Display name** checkbox in docked inspector controls existing `nameVisible` (default off).
5. Print/export matches on-screen plan for both toggles.
6. Per-piece checkbox only — no layer bulk in v1.
