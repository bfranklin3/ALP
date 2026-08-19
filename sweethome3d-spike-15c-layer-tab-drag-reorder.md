# SPIKE-15c — Drag-Reorder Level Tabs

**Date:** August 19, 2026  
**Status:** Complete (QA Aug 19, 2026)  
**Branch:** `cursor/areas-inventory-and-level-locking`  
**Parent:** [SPIKE-15](ALP%20CAD%20%20Detailed%20Execution%20Plan.md) (level reorder UX); builds on **15a** (tab menu) and **15b** (Manage layers)  
**Related:** `MultipleLevelsPlanPanel.java`, `LevelController.java`, `PlanController.java`

---

## Goal

Let users **reorder layers by dragging level tabs** on the plan tab bar — e.g. drag **Proposed** to the far left so it becomes the leftmost tab — without opening Modify level or Manage layers.

This closes the discoverability gap called out in SPIKE-15 (“drag-reorder optional later”) while reusing the existing **`elevationIndex`** stack model (no new reorder semantics).

---

## Background (already shipped)

| Mechanism | What it does |
|-----------|----------------|
| **`elevationIndex`** | Overlay draw order among levels at the same **elevation** |
| **`Home.LEVEL_ELEVATION_COMPARATOR`** | Sorts `home.getLevels()` → tab left-to-right order |
| **Flat site plans (ALP)** | All starter layers at elevation `0`; tab order = stack order |
| **SPIKE-15a** | Tab context menu → Move layer up / down (±1) |
| **SPIKE-15b** | Manage layers dialog → ▲/▼ (±1 per click) |
| **`LevelController.updateLevelElevationIndex()`** | Engine: set arbitrary index, shift neighbors |
| **`LevelController.moveLevelElevationIndex()`** | ±1 move + undo (used by 15a/15b) |

**Tab bar implementation:** `MultipleLevelsPlanPanel` — stock `JTabbedPane`, one tab per level, trailing disabled **+** tab for Add layer. Tabs rebuild on `Level.Property.ELEVATION_INDEX` change.

**Gap:** `JTabbedPane` has **no built-in drag-reorder**. Custom mouse handling required.

---

## Scope

### In scope (v1)

- **Drag** a level tab horizontally to a new position among sibling tabs at the **same elevation**
- **Drop** updates `elevationIndex` once; tabs and plan draw order refresh immediately (existing listeners)
- **Single undo** per completed drag (not one undo per intermediate slot)
- **Drag threshold** (~5 px) so normal **click** (select tab) and **double-click** (Modify level) still work
- Exclude the **+** tab from drag source and drop target
- Keep **SPIKE-15a/15b** paths unchanged (context menu, Manage layers)

### Out of scope (v1)

- Drag across **different elevations** (multi-story homes)
- Drag-reorder inside **Manage layers** table rows
- Left-column docked layer manager
- Reordering by dragging **level tabs between multiple tab rows** when tabs wrap (v1: treat wrapped row as one logical strip if feasible; otherwise document single-row-only)
- Changing default SPIKE-16 starter order for new site plans

---

## Stack order semantics (user-facing)

Tab bar reads **left → right** = **bottom → top** of overlay stack (underlay on the left, topmost layer on the right):

```
Reference … Existing … Proposed … Plants … Annotations (+)
  ↑ underlay                              ↑ on top
```

Dragging **Proposed** to the **far left** makes it the **leftmost tab** and moves it **under** layers that remain to its right (lower in stack / drawn first). No change to SPIKE-16 defaults — only user-initiated reorder.

*Optional v1 polish:* brief tooltip or status hint on first drag (“Tab order is draw order: left = under, right = on top”) — defer if noisy.

---

## Drag UX sketch

```
Before drag                          While dragging
┌──────┬──────┬──────────┬─── …     ┌──────┬──────┬──────────┬─── …
│ Ref  │ Exist│ Proposed │ …  [+]   │ Ref  │ Exist│ | Proposed (ghost) │ … [+]
└──────┴──────┴──────────┴───       └──────┴──────┴───|──────────┴───
                              ↑ insert indicator (vertical line between tabs)
```

### Interaction flow

1. **Mouse pressed** on tab header (`indexAtLocation`) — if index is a level tab (not **+**), record source index and start point.
2. **Mouse dragged** past threshold — enter drag mode:
   - Optional: semi-transparent **ghost** label following cursor
   - **Insert indicator** at nearest drop index (between tab bounds from `getBoundsAt` / hit testing)
   - Suppress tab selection change until drop (or select dragged level only)
3. **Mouse released** — if drop index ≠ source index and drop is valid:
   - Call controller to move level to target stack index
   - Select the moved tab
4. **Mouse released** without threshold — normal click (existing behavior)
5. **Double-click** — only if no drag occurred since press (existing → Modify level)

### Gesture conflicts (must preserve)

| Gesture | Current behavior | Drag mode rule |
|---------|------------------|----------------|
| Single click tab | Select level | Unchanged if no drag |
| Double-click tab | Modify level | Fire only if drag did not start |
| Click **+** tab | Add level | Never start drag on **+** |
| Right-click tab | Context menu (Move up/down, …) | Unchanged |

### Visual feedback (minimum viable)

- **Insert line** between tabs at drop index (preferred over reordering tabs live during drag — simpler, less `JTabbedPane` fighting)
- **Cursor:** `Cursor.MOVE_CURSOR` while dragging
- Ghost label optional for v1 if insert line alone is clear enough

---

## Controller / undo behavior

### New API (proposed)

Add to **`LevelController`** (static, mirrors `moveLevelElevationIndex`):

```text
moveLevelToStackIndex(Home home, UserPreferences preferences,
                      UndoableEditSupport undoSupport, Level level, int targetStackIndex)
```

- **`targetStackIndex`:** index in `home.getLevels()` after move (0 = leftmost tab / bottom of stack at that elevation)
- **Validation:** level must stay among levels with the same `elevation`; reject **+** tab indices; no-op if `targetStackIndex == current index`
- **Implementation:** map target list index → target `elevationIndex`; call existing **`updateLevelElevationIndex(level, targetElevationIndex, home.getLevels())`** once
- **PlanController** wrapper: `reorderSelectedLevelToStackIndex(int targetStackIndex)` for view layer

### Undo

- **One `UndoableEdit` per completed drag** storing `oldElevationIndex` and `newElevationIndex` (extend or generalize `LevelElevationIndexUndoableEdit`)
- **Undo menu label:** e.g. “Move layer” / ALP string `undoMoveLayerName` (not “up”/“down”)
- **Redo:** symmetric re-apply of target index
- **No** compound undo for intermediate positions during drag

### What we do *not* reuse as-is

- **`moveLevelElevationIndex(…, ±1)`** — wrong for jumping multiple slots (would require multiple undos or a loop)
- **Live `JTabbedPane` tab reorder during drag** — do not mutate model until drop; let `ELEVATION_INDEX` listener rebuild tabs (existing path)

---

## Likely files

| File | Change |
|------|--------|
| `MultipleLevelsPlanPanel.java` | MouseListener / MouseMotionListener on `multipleLevelsTabbedPane`; drag threshold; insert indicator paint |
| `LevelController.java` | `moveLevelToStackIndex`, generalized undo edit |
| `PlanController.java` | Thin delegate + enable checks if needed |
| `package.properties` | Undo string; optional cursor/tooltip strings |

**No** changes to `Home` model, `ManageLayersPanel`, or SPIKE-16 defaults.

---

## Effort estimate

| Piece | Size |
|-------|------|
| Controller + undo | **Small** |
| Tab drag UI + conflict handling | **Medium** |
| QA (Mac + wrapped tabs) | **Small** |
| **Total** | **~1–2 days** |

---

## Test plan

- [ ] **New site plan** — drag **Proposed** to left of **Reference** → tab order updates; Proposed draws under Reference
- [ ] Drag **Proposed** to right of **Annotations** → Proposed becomes top of stack
- [ ] Drop on same index → no model change, no undo entry
- [ ] **Undo / redo** after drag — single step restores prior tab order and draw order
- [ ] **Click** without drag still selects tab; **double-click** still opens Modify level
- [ ] **+** tab still adds level; cannot drag **+**
- [ ] Right-click tab → Move layer up/down still works
- [ ] **Manage layers** ▲/▼ still works and stays in sync with tabs
- [ ] Multi-story home (if available): cannot drop level onto slot that would cross elevation boundary

---

## Sequencing

- **Independent of SPIKE-21** (right inspector) — can run in parallel or after inspector P0
- **Suggested slot:** after SPIKE-21 P0 (fill/opacity) or as a small polish sprint before SPIKE-22 catalog L&F
- **Decision:** **GO** to implement when scheduled; spec sufficient to start coding without re-spike

---

## Next step

Implement v1 in ALP-Core per this spec; rebuild dev app; manual QA against checklist above.
