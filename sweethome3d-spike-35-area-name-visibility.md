# SPIKE-35 — Area Name Visibility (Display Name)

**Date:** August 21, 2026  
**Status:** **COMPLETED** — Aug 21, 2026  
**Branch:** follow-on from `cursor/areas-inventory-and-level-locking` (or dedicated UI branch)  
**Parent:** SPIKE-19 / SPIKE-21 (docked area inspector — name field shipped Aug 19, 2026)  
**Related:** `Room.java`, `RoomController.java`, `PlanComponent.java`, `SelectionInspectorPane.java`, `RoomPanel.java`, `HomeXMLHandler.java`, `HomeXMLExporter.java`

---

## Goal

Allow users to **name an area** (for inventory, selection, schedules, and editing) while **optionally hiding that name on the 2D plan**. Add a per-area **Display name** toggle — independent of the existing **Display area** control (which only toggles the **square-footage label**).

---

## Problem

### Names always draw on plan today

Areas (`Room`) store a `name` string and **always render it on the plan** when non-empty:

```3457:3465:source/SweetHome3D-7.5-src/src/com/eteks/sweethome3d/swing/PlanComponent.java
        String name = room.getName();
        if (name != null) {
          name = name.trim();
          if (name.length() > 0) {
            paintText(g2D, room.getClass(), name, room.getNameStyle(), null,
                xRoomCenter + room.getNameXOffset(),
                yRoomCenter + room.getNameYOffset(),
                room.getNameAngle(), previousFont);
```

There is **no visibility flag** for the name. Users who want a clean plan (e.g. property line areas named for the Context deck but not labeled on the drawing) must leave the name field empty — losing the name everywhere else.

### “Display area” is not “display name”

The inspector already has **Display area** (`room.areaVisible`), which controls only the **area size text** (e.g. `1,240 sq ft`), not the name:

| Control | Property | What it hides/shows on plan |
|---------|----------|------------------------------|
| Name field | `room.name` | Name text (always on if non-empty) |
| **Display area** | `room.areaVisible` | **Size label only** |

This naming collision confuses users who expect **Display area** to suppress all area text.

### Furniture already has the right pattern

`HomePieceOfFurniture.nameVisible` + **Display name in plan** checkbox hides plan text while keeping the name in the model. Areas should follow the same pattern with ALP-appropriate labeling.

---

## Locked decisions (Aug 21, 2026)

### Approach

| Topic | Decision |
|-------|----------|
| **Option chosen** | **Option A** — add `nameVisible` boolean on `Room` (mirror furniture) |
| **Checkbox label** | **Display name** (not “Display name in plan”) |
| **Property key** | `RoomPanel.nameVisibleCheckBox.text=Display name` |
| **Separate from area size** | **Display name** and **Display area** are independent toggles |

### Semantics

| Topic | Decision |
|-------|----------|
| **Name field** | Always editable; value **always stored** in model and XML `name` attribute |
| **Display name = on** | Name text drawn on plan (when name non-empty) — **current behavior** |
| **Display name = off** | Name **not drawn** on plan; still shown in inspector title, Context deck, layer items, selection summary, auto-complete |
| **Empty name** | Nothing drawn on plan regardless of checkbox (unchanged) |
| **Default (new areas)** | **`true`** — show name on plan (backward compatible with all existing homes) |
| **Legacy files** | Missing `nameVisible` attribute → treat as **`true`** |

### Print / export

| Topic | Decision |
|-------|----------|
| **Plan print** | Respect per-area `nameVisible` (hidden names stay hidden on printed plan) |
| **Presentation preset override** | **No** v1 override — no global “force show names on print” |
| **3D view** | Out of scope — room names are plan-first; 3D room labeling unchanged unless broken |

### Selection feedback

| Topic | Decision |
|-------|----------|
| **Name position handles** | Hide name drag indicators when `nameVisible` is false (mirror `areaVisible` + area offset indicators) |
| **Area size handles** | Unchanged — still gated on `areaVisible` |

### Scope

| Surface | In scope | Notes |
|---------|----------|-------|
| **Docked inspector** — Name and area section | Yes | Add **Display name** checkbox below name field |
| **Modify area** dialog (`RoomPanel`) | Yes | Same checkbox for parity with **Display area** |
| **Plan rendering** | Yes | `PlanComponent.paintRoomsNameAndArea`, bounds, name indicators |
| **XML** load/save | Yes | `nameVisible="true/false"` on `<room>` |
| **Layer defaults** | No | No auto-hide by layer (Reference vs Proposed) in v1 |
| **Global preference** | No | Per-area only |
| **Draft mode** | No | Draft mode does not add a separate name-hiding rule in v1 |

---

## Inspector UI — after SPIKE-35

### Name and area section

```text
Name and area
┌─────────────────────────────────────────────────────────────┐
│  Name:              [ Lawn ............................... ] │
│  Layer:             Proposed                               │
│  [✓] Display name                                           │  ← new
│  [ ] Display area                                           │  ← existing (size label)
└─────────────────────────────────────────────────────────────┘
```

**Label note:** Furniture uses “Display name in plan” (`HomeFurniturePanel.nameVisibleCheckBox.text`). Areas use the shorter **Display name** per product preference — plan context is implicit for site/area workflow.

---

## Implementation phases

### Phase 1 — Model + plan rendering (~2 h) ✓

| Step | Scope |
|------|--------|
| 1.1 | Add `nameVisible` (`boolean`, default `true`) to `Room`; add `Property.NAME_VISIBLE` |
| 1.2 | `RoomController`: `getNameVisible` / `setNameVisible` (`Boolean` for multi-select null); wire `refreshProperties()` + `modifyRooms()` |
| 1.3 | `PlanComponent.paintRoomsNameAndArea`: skip name when `!room.isNameVisible()` |
| 1.4 | `PlanComponent.paintRoomNameOffsetIndicator` + bounds calculation: respect `nameVisible` |
| 1.5 | `HomeXMLHandler` / `HomeXMLExporter`: read/write `nameVisible`; DTD comment default `true` |

**Deliverable:** Setting `nameVisible=false` programmatically hides plan name; legacy files load as visible.

### Phase 2 — Inspector UI (~1.5 h) ✓

| Step | Scope |
|------|--------|
| 2.1 | `package.properties`: `RoomPanel.nameVisibleCheckBox.text=Display name`, mnemonic |
| 2.2 | `SelectionInspectorPane.RoomInspectorPanel`: `NullableCheckBox` bound to `RoomController.NAME_VISIBLE`; layout between name/level row and **Display area** |
| 2.3 | `RoomPanel`: same checkbox (mirror `areaVisibleCheckBox` wiring) |
| 2.4 | Live apply + undo via existing `applyRoomChanges()` / modal OK path |

**Deliverable:** User toggles **Display name** in docked inspector and full editor.

### Phase 3 — Persistence + QA (~0.5 h) ✓

| Step | Scope |
|------|--------|
| 3.1 | Round-trip test in `HomeFileRecorderTest` (name hidden, name visible, legacy file without attribute) |
| 3.2 | Manual QA: name in Context deck while hidden on plan; print preview |
| 3.3 | Mark spike **SHIPPED** |

**Deliverable:** Persistence verified; spike complete.

---

## Technical approach

### Files to touch

| File | Change |
|------|--------|
| **`Room.java`** | `nameVisible` field; getter/setter; `Property.NAME_VISIBLE`; constructor default `true` |
| **`RoomController.java`** | Controller property; multi-select merge; `modifyRooms` apply |
| **`PlanComponent.java`** | Conditional name paint, indicators, bounds |
| **`HomeXMLHandler.java`** | Parse `nameVisible`; DTD comment |
| **`HomeXMLExporter.java`** | `writeBooleanAttribute("nameVisible", …, true)` |
| **`SelectionInspectorPane.java`** | Checkbox + refresh |
| **`RoomPanel.java`** | Checkbox |
| **`package.properties`** | Label + mnemonic |
| **`HomeFileRecorderTest.java`** | Round-trip test (optional but recommended) |

**Reference implementation:** `HomePieceOfFurniture.nameVisible` + `HomeFurniturePanel.nameVisibleCheckBox` — same boolean pattern; areas use `Boolean` nullable controller field like `areaVisible`.

### XML

```xml
<room name="Lawn" nameVisible="false" areaVisible="true" … />
```

Legacy (no attribute):

```xml
<room name="Lawn" … />
```

→ loads as `nameVisible=true`.

### Interaction with SPIKE-33

Transparent fill/outline (**None**) does **not** affect name visibility. A area with hidden fill still shows its **name** when **Display name** is on. User hides name separately via this spike.

---

## Test plan

### Display name toggle

- [x] Name **“Lawn”**, **Display name** on → “Lawn” on plan.
- [x] **Display name** off → no name on plan; inspector title / Context deck still show “Lawn”.
- [ ] **Display area** on, **Display name** off → size label only (if area > 0).
- [ ] **Display name** on, **Display area** off → name only (current common case).
- [ ] Both off → no text on plan (outline/fill unchanged).
- [ ] Empty name → nothing on plan; checkbox state preserved.

### Inspector + editor

- [x] Docked inspector: toggle applies immediately; undo restores.
- [ ] **Modify area** dialog: same checkbox; OK/Cancel behavior matches **Display area**.
- [ ] Multi-select areas with mixed `nameVisible` → checkbox shows indeterminate/null until user picks a state.

### Persistence

- [ ] Save/reopen with `nameVisible="false"` → name stays hidden on plan.
- [x] Legacy file without attribute → names still visible (backward compat) — `HomeFileRecorderTest.testRoomNameVisibleRoundTrip()`.
- [x] `HomeFileRecorderTest.testRoomNameVisibleRoundTrip()` — visible + hidden round-trip; legacy XML default.

### Regression

- [x] Name drag handles hidden when **Display name** off.
- [ ] Area size handles still follow **Display area** only.
- [ ] Fill, outline, texture (SPIKE-32/33/34) unchanged.
- [ ] Print preview respects hidden names.

---

## Out of scope (SPIKE-35)

- Renaming **Display area** to “Display size” (clarity improvement — separate spike if desired)
- Layer-level default name visibility
- Global preference “Show all area names”
- Draft/presentation preset forcing names on/off
- 3D room name labels
- Separate `Label` objects instead of room name

---

## Dependencies & ordering

| Relation | Notes |
|----------|-------|
| **After SPIKE-19 P0** | Name field already in docked inspector |
| **Independent of SPIKE-33/34** | Composes cleanly |
| **Parallel SPIKE-23** | Add “Display name” to terminology audit if needed |

**Suggested order:** Phase 1 → Phase 2 → Phase 3 (~**0.5 day** total).

---

## Effort estimate

| Phase | Estimate |
|-------|----------|
| Phase 1 — Model + rendering | ~2 h |
| Phase 2 — Inspector UI | ~1.5 h |
| Phase 3 — Persistence + QA | ~0.5 h |
| **Total** | **~0.5 day** |

---

## Next steps

1. ~~**Review** this spike — confirm label **Display name** and default `true`.~~
2. ~~**Implement** Phase 1 → 2 → 3.~~
3. ~~**Mark SHIPPED** in execution plan when complete.~~
