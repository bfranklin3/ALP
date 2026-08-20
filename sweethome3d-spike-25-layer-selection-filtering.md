# SPIKE-25 — Layer Selection Filtering (Current Layer Only + Lock)

**Date:** August 19, 2026  
**Status:** Spec locked — pending implementation  
**Branch:** `cursor/areas-inventory-and-level-locking`  
**Parent:** ALP flat overlay layer workflow (SPIKE-14, SPIKE-16); complements [SPIKE-24](sweethome3d-spike-24-layer-docked-inspector.md)  
**Related:** `PlanController.java`, `Home.java`, `Level.java`, `AlpLevelDefaults.java`, `UserPreferences.java`

---

## Goal

Fix **marquee and click selection picking objects across overlay layers** on flat ALP site plans (Reference / Existing / Proposed at the same elevation).

Users should be able to **drag a selection rectangle on the active layer** and get only that layer’s geometry — without turning off visibility of other layers.

---

## Problem (root cause)

Marquee selection already uses `getVisibleItemsAtSelectedLevel()`, but “at selected level” is implemented via **`Elevatable.isAtLevel()`**, not strict layer membership.

On flat overlays (all layers at elevation `0`), when the active tab is **Proposed**, items on **Existing** and **Reference** (lower `elevationIndex`, same elevation) still pass `isAtLevel()` — by design for stock SH3D multi-story floor plans (lower floors show through).

**Result:** Rectangle select grabs everything geometrically inside the box across visible overlay layers.

**Layer lock today:** blocks move/edit only; **does not** block selection (`PlanController.isItemLocked()`).

---

## Locked decisions (Aug 19, 2026)

| Topic | Decision |
|-------|----------|
| **Default mode** | **`selectCurrentLayerOnly = true`** for **all new homes** (not site-plan-only) |
| **User override** | Preference and/or SPIKE-24 layer inspector toggle to turn off |
| **Normal click / marquee** | Select only items where **`item.getLevel() == home.getSelectedLevel()`** when mode is on |
| **Shift + marquee** | **Cross-layer add/remove** — can include objects from other **visible, unlocked** layers in the rectangle (power-user escape hatch while toggle is on) |
| **Toggle off** | Restore broader stock SH3D pick behavior (`isAtLevel()` semantics) for multi-story / cross-layer workflows |
| **Lock semantics (Phase 1)** | **Extend lock to block selection** — locked layers remain visible but are **not pickable** (click or marquee) |
| **Separate “Selectable” flag** | **Deferred** — not a third checkbox in Phase 1; lock covers Reference-underlay use case |
| **Non-viewable layers** | Already excluded from pick lists — unchanged |

---

## How this compares to other CAD apps

| Pattern | ALP SPIKE-25 mapping |
|---------|----------------------|
| Active / current layer edit context | Active tab + `selectCurrentLayerOnly` |
| Lock layer → not editable **or** selectable | Extend **Locked** to block pick |
| Layer off/frozen → not pickable | **Visible** (existing) |
| Cross-layer select as explicit gesture | **Shift+marquee** while mode on; toggle off for full stock behavior |

Defaulting **current layer only for all new homes** matches common CAD “active layer” mental models better than a site-plan-only exception.

---

## UX summary

### With `selectCurrentLayerOnly` on (default)

| Action | Result |
|--------|--------|
| Click object on active layer | Selects it |
| Click object on another visible layer | Ignored (unless shift-click policy added later — **out of scope v1**) |
| Marquee on active layer | Selects only active-layer items in box |
| **Shift + marquee** | Adds/removes items from **any visible, unlocked** layer in box |
| Object on **locked** layer | Not pickable |
| Toggle off (pref / inspector) | Marquee/click use stock `isAtLevel()` rules |

### Reference underlay workflow

1. **Reference** layer: **Visible ✓**, **Locked ✓** → visible, not selectable.  
2. **Proposed** tab active + default mode → marquee selects Proposed geometry only.  
3. Need cross-layer tweak → **Shift+marquee** or turn toggle off temporarily.

---

## Scope

### In scope (v1)

- **`selectCurrentLayerOnly`** flag on `Home` and/or `UserPreferences` (persist in home XML if home-scoped; default via `AlpLevelDefaults` on **New** and **New site plan**)
- Filter **`PlanController.getSelectableItemsAt()`** and **`getVisibleItemsAtSelectedLevel()`** (marquee path) when mode is on:
  - Require **`getLevel() == getSelectedLevel()`** instead of **`isAtLevel()`**
  - Exclude items on **locked** layers
- **Shift+marquee** in `RectangleSelectionState.updateSelectedItems()` — when mode on, allow items from other visible unlocked layers in rectangle (preserve shift toggle semantics)
- **`selectItems(..., allLevelsSelection)`** — ensure cross-layer shift marquee sets `allLevelsSelection` appropriately when selection spans layers (align with existing tab outline feedback)
- **Lock blocks selection** — central helper used by hit test + marquee (extend `isItemLocked()` usage or add `isItemSelectable()`)
- **UI surfacing** (minimal v1):
  - User preference checkbox (Plan or Layers section)
  - Optional: same toggle in SPIKE-24 layer inspector when that ships
- **Strings** in `package.properties`

### Out of scope (v1)

- Separate per-layer **Selectable** checkbox (Phase 2 if needed)
- **Reference layer** dedicated property (lock covers underlay for now)
- Shift+**click** cross-layer select
- **Select all on visible layers** menu command (optional later; Shift+marquee covers v1)
- Changing **render** stack / `isAtLevel()` drawing rules (visibility unchanged — only pick filtering)

---

## Technical approach

### 1. Selection filter helper

Add something like:

```java
protected boolean isItemSelectableAtCurrentLevel(Selectable item) {
  if (isItemLocked(item)) {
    return false;
  }
  if (!home.isSelectCurrentLayerOnly()) {
    // stock path: isAtLevel + viewable
    ...
  }
  Level selected = home.getSelectedLevel();
  if (item instanceof Elevatable) {
    return ((Elevatable) item).getLevel() == selected;
  }
  ...
}
```

Use in `getSelectableItemsAt()`, `getVisibleItemsAtSelectedLevel()`, and `getSelectableItemsIntersectingRectangle()`.

### 2. Shift+marquee cross-layer

In `RectangleSelectionState.updateSelectedItems()`:

- When `selectCurrentLayerOnly && shiftDown`: build candidate set from **`getSelectableViewableItems()`** filtered by **not locked** and **intersects rectangle** (strict `getLevel()` match optional per-item — include all visible unlocked layers in box).
- When `selectCurrentLayerOnly && !shiftDown`: strict active-layer only (current helper).

### 3. Defaults

`AlpLevelDefaults.applyNewHomeDefaults()` (or equivalent): `home.setSelectCurrentLayerOnly(true)`.

Existing homes: default **false** or **true** on first open — recommend **false** for saved SH3D files (avoid behavior change); **true** only for newly created homes.

### 4. Lock semantics change

Audit call sites of `isItemLocked()` — selection paths must respect lock; ensure locked items **drop out of existing selection** when layer is locked (optional polish: deselect on lock).

**Likely touchpoints:**

| Layer | Files |
|-------|--------|
| Controller | `PlanController.java` (hit test, marquee, `selectItems`) |
| Model | `Home.java` (new property + XML), `Level.java` |
| Defaults | `AlpLevelDefaults.java`, `HomeApplication.java` |
| View / prefs | `UserPreferencesPanel.java` or layer inspector (SPIKE-24) |
| I/O | `HomeXMLExporter.java`, `HomeXMLHandler.java` (if home-scoped) |

**Effort estimate:** ~1–2 days.

---

## Relationship to SPIKE-24

| SPIKE-24 | SPIKE-25 |
|----------|----------|
| Layer **settings** in right panel (name, visible, locked) | Layer **selection rules** on plan |
| Live edit lock checkbox | Lock **also** blocks pick |
| Layer list UI | Optional home for **“Select current layer only”** toggle |

**Suggested order:** SPIKE-25 can ship **before or with** SPIKE-24 — selection filtering is independent of inspector UI. Inspector toggle is polish.

---

## Success criteria

- New home: marquee on **Proposed** selects **only Proposed** items (not Existing/Reference underneath).
- **Reference** layer locked + visible: objects not selectable.
- **Shift+marquee** can add items from another visible unlocked layer.
- Toggle off: behavior matches pre-SPIKE-25 stock rules for that home.
- Undo/redo and existing tools unaffected.
- Multi-story homes (distinct elevations): toggle off restores stock cross-level behavior if needed.

---

## QA checklist (manual)

- [ ] **New home** (regular New): default mode on; marquee on active layer excludes other overlay layers.
- [ ] **New site plan:** same default.
- [ ] **Open existing .sh3d:** no surprise behavior change (or document migration default).
- [ ] Marquee Proposed only → selection contains only Proposed items.
- [ ] **Shift+marquee** spanning Proposed + Existing → both layers’ items in selection; tab outline / `allLevelsSelection` feedback correct.
- [ ] Lock Reference → cannot click or marquee Reference items; still visible.
- [ ] Unlock Reference → pickable only if toggle off or item on active layer (per strict mode rules).
- [ ] Toggle off in preferences → cross-layer marquee behaves like stock SH3D on flat overlay test file.
- [ ] Locked layer items not in inspector edit path (existing SPIKE-21 empty/locked states still correct).

---

## Sequencing

- **After:** SPIKE-14 (flat levels), SPIKE-16 (starter layers) — already shipped
- **Parallel OK with:** SPIKE-23 (scope doc), SPIKE-24 (layer inspector)
- **Before or after SPIKE-24:** either; inspector toggle can follow core filter

---

## Next steps

1. Add `selectCurrentLayerOnly` property + new-home default in `AlpLevelDefaults`.
2. Implement filter in `PlanController` pick/marquee paths; extend lock to block selection.
3. Wire Shift+marquee cross-layer behavior.
4. Add preference (and SPIKE-24 toggle when available).
5. Rebuild dev app; run QA checklist.
