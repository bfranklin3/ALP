# SPIKE-36 — Plan Z-Order (Bring to Front / Send to Back)

**Date:** August 22, 2026  
**Status:** **Shipped** — Aug 23, 2026 (Phases 1–4 complete)  
**Branch:** follow-on from `cursor/areas-inventory-and-level-locking` (or dedicated UI branch)  
**Parent:** ALP site-plan editing (SPIKE-14 levels, SPIKE-25 layer selection, SPIKE-29 Context deck)  
**Related:** `Home.java`, `PlanComponent.java`, `PlanController.java`, `HomePrintableComponent.java`, `HomeXMLHandler.java`, `HomeXMLExporter.java`, `HomePane.java`

**Not the same as:**
- **[SPIKE-27](ALP%20CAD%20%20Detailed%20Execution%20Plan.md#spike-27-plan-assembly-grouping-walls--openings--furniture)** — persistent **assemblies** of walls + doors/windows + furniture (architectural shells).
- **[SPIKE-37](sweethome3d-spike-37-plan-graphics-grouping.md)** — **grouping** plan graphics for move/select-as-unit (depends on this spike for stack semantics).

---

## Goal

Let users control **2D plan draw order** for site-plan objects — **Bring to Front**, **Send to Back**, **Bring Forward**, **Send Backward** — so overlapping linework, plants, labels, dimensions, and areas stack correctly on screen **and in print**.

Stack order is **global among visible stackable items**, including **cross-layer** (e.g. a Reference polyline can draw above a Proposed area fill when both are visible).

---

## Problem

### Fixed type-based paint order today

`PlanComponent.paintHomeItems()` paints categories in a **hard-coded sequence** (rooms → walls → furniture → polylines → dimension lines → text passes). Within each category, order is mostly **list insertion order** or **furniture ground elevation** — not user-controlled plan Z-order.

There is **no** `planZOrder`, `displayOrder`, or Arrange menu for plan objects. Furniture table drag-reorder only affects **furniture list order** (same-elevation tie-break). Layer **Move up/down** reorders **levels** (`elevationIndex`), not individual objects.

### Hit-test order ≠ paint order

`PlanController.getSelectableItemsAt()` uses its own reverse-list rules (e.g. furniture by elevation). Any Z-order feature must **align pick order with paint order**.

### Landscape need

Site plans overlap constantly: property lines over fill, plant symbols over hatches, labels over linework, Reference imagery over Proposed geometry. Users expect CAD/Illustrator-style stacking independent of which **layer tab** owns an object.

Area **pattern fills** must stay **under wall lines** by default so wall strokes stay clean — not buried under hatch.

---

## Locked decisions (Aug 22, 2026)

### Scope — Phase A (this spike)

| Topic | Decision |
|-------|----------|
| **Stackable types** | **Areas** (`Room`), **polylines**, **plants** (`HomePieceOfFurniture`), **labels** (`Label`), **dimension lines** (`DimensionLine`) |
| **Cross-layer** | **Yes** — one global `planDrawOrder`; layer controls **visibility**, not stack slot |
| **Dimension lines** | **In stack** v1 — same Arrange commands as other linework |
| **Walls** | **In stack** v1 — **one block per level** (all walls on that level move together in the stack; not per-wall in v1) |
| **Areas — stack model** | **One ID per area** in `planDrawOrder`; renderer uses **split paint** (see below) |
| **Areas — split paint** | **Yes (Option C):** at stack slot → **fill only** (pattern/texture/solid); **outline + name + area-size text** → **area chrome pass** after wall blocks (always above fills, default above walls) |
| **Whole area above walls** | **No in v1** — no command to move fill + outline together above walls; avoids burying wall lines under hatch |
| **Print** | **Must match screen** — same paint path as interactive plan |
| **Compass, grid, background image** | Unchanged — below stack per existing rules |

### UI — v1

| Topic | Decision |
|-------|----------|
| **Primary surface** | Plan **context menu → Arrange** submenu |
| **Commands** | Bring to Front, Send to Back, Bring Forward, Send Backward |
| **Multi-select** | Move selected block **preserving relative order** within the selection |
| **Wall blocks** | Arrange applies when wall block selected (via selecting any wall on that level, or explicit wall-block pick — implementation detail) |
| **Keyboard shortcuts** | **Defer to v2** |
| **Edit menu duplicate** | **Defer to v2** |
| **Inspector controls** | **Out of scope** v1 |

### New & pasted objects

| Topic | Decision |
|-------|----------|
| **New stackable object** | Append to **end of `planDrawOrder`** (top of user-controlled stack — linework/plant/label/dimension band) |
| **New area** | Same list entry; fill paints at slot; chrome in area chrome pass |
| **Clipboard paste** | Pasted stackable items append as a **block at stack top**, preserving relative order within the paste |

### Legacy files

| Topic | Decision |
|-------|----------|
| **Missing `planDrawOrder`** | Synthesize order for **visual parity** with today (see default stack below) |

### Per-wall wall ordering

| Topic | Decision |
|-------|----------|
| **v1** | **Per-level wall block only** |
| **v2 / SPIKE-27 adjacency** | Per-wall stack slots if architectural workflows require it |

---

## Architecture — unified `planDrawOrder`

Store an ordered list of **stable refs** on `Home`:

```xml
<planDrawOrder>
  <item ref="room-1"/>
  <item ref="walls@level-proposed"/>
  <item ref="polyline-3"/>
  <item ref="piece-7"/>
  <item ref="dimensionLine-4"/>
  <item ref="label-2"/>
  <item ref="walls@level-reference"/>
</planDrawOrder>
```

- **Normal objects** — `ref` = selectable id (`room-1`, `polyline-3`, …).
- **Wall blocks** — `ref` = `walls@<levelId>` (pseudo-entry; paints all walls on that level using existing batched wall-area logic).

### Paint pipeline (locked)

```text
background / grid / other-level ghosts          (unchanged)

Pass 1 — iterate planDrawOrder (visible items):
  Room ref           → fill only (pattern / texture / solid)
  walls@level ref    → wall fill + stroke (batched per level)
  Polyline           → full stroke
  HomePieceOfFurniture → plan icon / color
  DimensionLine      → full dimension paint
  Label              → full label paint

Pass 2 — area chrome (fixed order, not user-reorderable in v1):
  For each visible Room (respect SPIKE-35 name/area visibility):
    outline + name + area-size text

selection chrome
```

**User Arrange** moves refs in `planDrawOrder`. Split area paint is enforced by the renderer — moving a room ref moves **when the fill paints**, not when chrome paints (chrome always in Pass 2).

### Default synthesized order (legacy migration)

When `planDrawOrder` is absent, build list so the file **looks like today**:

```text
1. All area refs          (room sort: floor/ceiling visibility, then elevationIndex)
2. All wall block refs    (per level, elevationIndex ascending)
3. All other stackables   (furniture by ground elevation, then polylines, dimensions, labels — list order)
```

Pass 2 (area chrome) matches current “text after geometry” behavior.

### Per-type paint at stack slot

| Type | At stack slot | Pass 2 |
|------|---------------|--------|
| `Room` | Fill only | Outline + name + area text |
| `walls@level` | Wall hatch + wall stroke | — |
| `Polyline` | Full | — |
| `HomePieceOfFurniture` | Full | — |
| `DimensionLine` | Full | — |
| `Label` | Full | — |

### Arrange commands

- **Bring to Front** — move ref(s) to end of `planDrawOrder`
- **Send to Back** — move ref(s) to start of list
- **Bring Forward / Send Backward** — swap one step with neighbor

**Membership:** Append on add; remove on delete; undo/redo restores list snapshots.

---

## Relationship to other spikes

| Spike | Relationship |
|-------|----------------|
| **SPIKE-25** (layer selection) | Orthogonal — pick/visibility unchanged |
| **SPIKE-15c** (layer tab order) | `elevationIndex` still affects default migration sort; user stack can override |
| **SPIKE-35** (area name visibility) | Chrome pass respects `nameVisible` / `areaVisible` |
| **SPIKE-33/34** | Fill/outline/line presets unchanged |
| **SPIKE-37** (plan graphics grouping) | **After SPIKE-36** — group as one or contiguous stack refs |
| **SPIKE-27** (plan assembly) | Separate; per-wall stack is v2 if needed |
| **SPIKE-26** (measure) | Independent — ephemeral, no stack entry |

**Suggested ship order:** SPIKE-36 → SPIKE-26 / SPIKE-37 (either order OK) → SPIKE-27 when prioritized.

---

## Implementation phases

### Phase 1 — Model + persistence (~2 d)

| Step | Scope |
|------|--------|
| 1.1 | `Home.planDrawOrder` + helpers: append, remove, move, resolve ref → paint target |
| 1.2 | Wall block refs `walls@levelId`; sync on add/delete level / walls |
| 1.3 | Maintain list on add/delete of stackable items |
| 1.4 | Legacy synthesizer (default stack above) |
| 1.5 | `HomeXMLHandler` / `HomeXMLExporter` + `HomeFileRecorderTest.testPlanDrawOrderRoundTrip()` |

### Phase 2 — Plan paint + print (~3–4 d)

| Step | Scope |
|------|--------|
| 2.1 | Refactor `PlanComponent` — Pass 1 iterates `planDrawOrder` |
| 2.2 | Split `paintRooms` — fill at slot vs chrome Pass 2 |
| 2.3 | Wall block paint — delegate to existing batched `paintWalls` per level |
| 2.4 | Per-type paint at slot (polyline, plant, label, dimension) |
| 2.5 | Verify `HomePrintableComponent` / export |

### Phase 3 — Interaction + UI (~1.5 d)

| Step | Scope |
|------|--------|
| 3.1 | `PlanController` — Arrange four commands + undo |
| 3.2 | Align `getSelectableItemsAt()` with paint order |
| 3.3 | Wall block selection semantics |
| 3.4 | `HomePane` — context menu **Arrange** + `package.properties` |

### Phase 4 — QA (~0.5 d)

| Step | Scope |
|------|--------|
| 4.1 | Cross-layer, multi-select, paste-to-top, undo, save/reopen |
| 4.2 | Print preview parity |
| 4.3 | Mark spike **SHIPPED** |

**Total estimate:** ~6–8 days

---

## Files to touch

| File | Change |
|------|--------|
| **`Home.java`** | `planDrawOrder`; wall block refs; sync |
| **`PlanComponent.java`** | Two-pass paint; split room fill/chrome; stack iteration |
| **`PlanController.java`** | Arrange; hit-test; wall block selection |
| **`HomePane.java`** | Context menu Arrange |
| **`HomeXMLHandler.java`** / **`HomeXMLExporter.java`** | Persistence + DTD |
| **`HomePrintableComponent.java`** | Verify parity |
| **`package.properties`** | Arrange strings |
| **`HomeFileRecorderTest.java`** | Round-trip + legacy migration test |

---

## Test plan

### Arrange commands

- [ ] Polyline above area **fill** after **Bring to Front**; wall lines still visible over fill.
- [ ] Label below plant after **Send to Back**.
- [ ] Multi-select → **Bring Forward** preserves relative order within selection.
- [ ] Dimension line reordered relative to polyline.

### Walls & areas

- [ ] Area hatch does **not** cover wall strokes at default migration order.
- [ ] Moving **wall block** in stack changes wall vs polyline overlap; fill still under walls unless fill ref moved above wall block explicitly.
- [ ] Area **outline + name + size** appear in chrome pass (readable on top of linework).
- [ ] No v1 command puts whole area (fill + outline) above walls.

### Cross-layer

- [ ] Reference polyline above Proposed area fill when higher in stack and both visible.

### Persistence

- [ ] Save/reopen preserves `planDrawOrder`.
- [ ] Legacy file without attribute — visual parity with pre-spike.
- [ ] `HomeFileRecorderTest` round-trip.
- [ ] Paste appends block at stack top.

### Print

- [ ] Print preview matches on-screen stack and wall-over-fill default.

### Regression

- [ ] SPIKE-33 / 34 / 35 unchanged.
- [ ] SPIKE-25 layer pick rules unchanged.

---

## Out of scope (SPIKE-36)

- Per-wall stack slots (v2)
- Whole-area-above-walls command
- Keyboard shortcuts / Edit menu Arrange (v2)
- Group / ungroup (**SPIKE-37**)
- Wall + opening assemblies (**SPIKE-27**)
- 3D view draw order
- Layer-default Z-order templates
- Numeric Z-index spinners

---

## Next steps

1. ~~Lock open questions~~ ✓ Aug 22, 2026
2. ~~Implement Phase 1 → 4~~ ✓ Aug 23, 2026
3. ~~Mark **SHIPPED** in execution plan when complete~~ ✓ Aug 23, 2026

### Phase 4 QA notes (Aug 23, 2026)

- **Print parity:** `HomePrintableComponent` delegates to `PlanComponent.print()` → `paintContent()` → same `paintHomeItems()` two-pass pipeline as on-screen plan.
- **Paste to top:** `HomeController.addPastedItems()` reorders pasted stackable refs to the front of `planDrawOrder`, preserving clipboard list order.
- **Automated tests:** `HomeFileRecorderTest.testPlanDrawOrderRoundTrip()`, `testPlanDrawOrderLegacyMigration()`, `testPlanDrawOrderArrangeCommands()`, `testPlanDrawOrderPasteOrder()`.
- **Manual QA:** cross-layer Arrange, multi-select relative order, undo/redo, save/reopen — verify in dev app before release.
