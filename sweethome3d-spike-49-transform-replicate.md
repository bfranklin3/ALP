# SPIKE-49 - Precision Move & Linear Replicate

**Date:** September 18, 2026  
**Status:** Proposed  
**Parent:** Landscape object placement; builds on object-based selection, plant metadata, and normal plan item duplication/move paths  
**Related:** `Home.duplicate(...)`, `HomeController.paste(...)`, `PlanController.addItems(...)`, `PlanController.moveItems(...)`, `AlpPlantMetadata`, `HomePane`, `HomeView.ActionType`

---

## Goal

Add a focused Transform / Replicate workflow for common landscape layout tasks:

1. Move selected objects by an exact distance.
2. Repeat selected objects in a straight line with exact spacing.
3. Fit repeated copies evenly between two points.

The primary use cases are hedges, rows of shrubs, stepping-stone paths, rows of chairs, and precise object nudging. V1 should feel like a landscape placement tool, not a full CAD transform matrix.

---

## Problem

Today users can drag-copy and manually align objects, but repeated placement requires too much hand work:

- Planting a hedge means placing many individual shrubs by eye.
- Stepping stones need consistent spacing and direction.
- Precise movement requires manual dragging or editing individual coordinates.
- Existing distribute/align actions help after multiple objects already exist, but do not create a row from one selected object.

Chief Architect's Transform/Replicate dialog proves the workflow value, but its full scope is broader than this app needs in the first pass.

---

## Recommended V1 Scope

### 49A - Move by Distance

Move the current selection by an exact offset.

| Field | Behavior |
|-------|----------|
| Horizontal | X delta in current length unit; positive = right/east on plan |
| Vertical | Y delta in current length unit; positive = down/south if matching current plan coordinates |
| Distance + angle | Optional alternate input mode; app resolves to dx/dy |
| Preview | Desirable, but not required for first implementation |
| Apply | Moves selected items once; posts one undoable edit |

Enable when the selected items are movable and current layer rules allow editing.

### 49B - Replicate in Line

Create evenly spaced copies of the selected object(s) along a straight vector.

| Field | Behavior |
|-------|----------|
| Copies | Number of new copies; default `1` |
| Spacing | Center-to-center distance between repeats |
| Direction | Angle field, or two-point direction picker |
| Include original | Not shown in V1 if the field is named **Copies**; the selected source object always remains in place |
| Use plant spacing | For a single selected ALP plant, default spacing from `AlpPlantMetadata.getDefaultSpacing()` |
| Result | Normal editable items, selected after creation |

The selected item remains in place. Copy 1 is placed at one spacing along the vector, copy 2 at two spacings, etc.

### 49C - Fit Copies Between Two Points

Create copies distributed between a start and end point. This is the better mental model for stepping stones and fixed hedge runs.

| Mode | Behavior |
|------|----------|
| Total count mode | User enters total item count including endpoints; app computes spacing |
| Spacing mode | User enters spacing; app computes how many copies fit |
| Start point | Defaults to selected object's center, with option to click a point |
| End point | User clicks or enters end point; vector defines distance and angle |
| Include original | Default yes when start point is selected object's current center |

For V1, prefer a simple modal flow plus a point-pick helper if practical. If point picking is costly, ship angle/distance entry first and keep interactive picking as 49C follow-up.

---

## Locked Product Decisions

| Topic | Decision |
|-------|----------|
| **Primary object type** | Start with top-level `HomePieceOfFurniture` items, especially plants and outdoor objects |
| **Generated objects** | Normal editable duplicated instances; no persistent "array" object |
| **Selection after apply** | Select newly created copies plus original if included |
| **Plant spacing** | Use `AlpPlantMetadata.defaultSpacing` as the suggested spacing for one selected plant |
| **Hedge workflow** | Use Replicate in Line first; curved hedge/path following is deferred |
| **Precision move** | Separate command from replicate so the UI stays small |
| **Units** | Use current user length unit and existing length parsing/formatting |
| **Undo** | One undo step per applied operation |
| **Schedules** | Repeated plants count as ordinary plant instances |

---

## UI Proposal

Add actions under the plan context menu and/or Plan menu:

- **Move by Distance...**
- **Replicate in Line...**
- **Fit Copies Between Points...**

Recommended grouping:

```text
Plan / Context menu
  Arrange
  Group / Ungroup
  Move by Distance...
  Replicate in Line...
  Fit Copies Between Points...
```

### Move by Distance dialog

```text
Move by Distance

Mode:     (x) Offset    ( ) Distance + angle
Horizontal: [ 0' 0"      ]
Vertical:   [ 0' 0"      ]

[Cancel] [Move]
```

### Replicate in Line dialog

```text
Replicate in Line

Copies:      [ 5          ]
Spacing:     [ 3' 0"      ]
Direction:   [ 0 deg      ]  [Pick direction]

[Cancel] [Create Copies]
```

### Fit Copies Between Points dialog

```text
Fit Copies Between Points

End:         [Pick end point]
Mode:        (x) Total count    ( ) Spacing
Total count: [ 7          ]
Spacing:     [ computed   ]

[Cancel] [Create Copies]
```

Keep labels plain and task-oriented. Avoid exposing scale, rotate, reflect, or Z movement in V1.

---

## Geometry Rules

### Coordinate model

- All operations compute a plan-space vector `(dx, dy)`.
- Angle `0 deg` should match the app's existing east/right direction if consistent with other plan actions.
- Distance + angle resolves with standard trigonometry.
- Two-point direction uses the vector from point A to point B.

### Replication placement

Given selected source items `S`, copy count `n`, and vector `v`:

```text
copy i offset = v * i, for i = 1..n
```

Given fit-between start `A`, end `B`, and total item count `m` including original:

```text
step = (B - A) / (m - 1)
copy i offset = step * i, for i = 1..m-1
```

### Multi-selection

V1 may support multi-selection if the existing duplicate/move path makes it straightforward:

- Preserve relative positions within the selected set.
- Treat the selection as one repeated module.
- Each repeat creates a duplicated set offset by the same vector.

If multi-selection complicates undo or group semantics, restrict 49B/49C V1 to one selected top-level furniture item and document multi-selection as follow-up.

---

## Out of Scope for V1

- Incremental rotation per copy.
- Incremental scale per copy.
- Mirroring / reflection.
- Circular or radial arrays.
- Path-following along curves or polylines.
- Random jitter or naturalized staggering.
- Persistent parametric arrays that can be edited later.
- Z/elevation transforms.
- Wall, room, polyline, dimension, or mixed architectural assembly replication.

These can become later spikes once the straight-line placement workflow proves useful.

---

## Implementation Sketch

### Preferred implementation path

1. Add new `HomeView.ActionType` entries.
2. Wire actions in `HomePane` and `package.properties`.
3. Add small Swing dialogs for the three commands.
4. Add controller methods that:
   - read current selection,
   - compute dx/dy vectors,
   - duplicate selected items with `Home.duplicate(...)`,
   - add copies through existing plan add/drop paths,
   - move copies by computed offsets,
   - select the resulting items,
   - post one undoable edit.

### Likely files

| File | Role |
|------|------|
| `HomeView.java` | New action types |
| `HomePane.java` | Menu/context action wiring and enablement |
| `HomeController.java` or `PlanController.java` | Operation orchestration |
| New Swing dialog classes | `AlpMoveByDistanceDialog`, `AlpReplicateInLineDialog`, `AlpFitCopiesBetweenPointsDialog` or one shared dialog |
| `package.properties` | Labels, tooltips, undo names |
| `AlpPlantMetadata.java` | Read default spacing for plant defaults |

### Existing affordances

- `Home.duplicate(items)` can duplicate selectable items with new IDs.
- `PlanController.addItems(items)` adds plan items and selects them.
- `PlanController.moveItems(items, dx, dy)` already moves furniture, walls, rooms, polylines, dimension lines, and labels.
- `HomeController.paste(...)` and `drop(...)` show an existing compound undo pattern for adding and moving duplicated items.

Use those paths rather than adding a new model object.

---

## Test Plan

### Manual QA

1. Select one shrub, **Replicate in Line...**, 8 copies at default plant spacing -> row forms a hedge; all shrubs remain editable and counted.
2. Select one stepping stone, **Fit Copies Between Points...**, pick end point, total count 7 -> stones distribute evenly.
3. Select one chair, replicate 4 copies at 3 ft -> row of chairs appears; undo removes all copies in one step.
4. Select one plant, **Move by Distance...**, horizontal 2 ft -> object moves exactly; undo restores position.
5. Repeat on a locked/non-viewable layer -> actions are disabled or fail gracefully.
6. Save/reopen -> copies persist as normal objects; no custom array data required.

### Automated tests

- Unit test vector math for count/spacing modes.
- Controller test for duplicate count and final positions.
- Undo/redo test for replicate and move.
- Plant spacing default test with an ALP plant metadata fixture if practical.

---

## Open Questions

1. Should the first replicate command support multi-selection, or single object only?
2. Should "count" mean new copies or total objects including the original? Recommendation: use **Copies** for 49B and **Total count** for 49C.
3. Is interactive two-point picking required for the first implementation, or can it follow after angle/distance entry?
4. Should **Fit Copies Between Points** place a copy at the end point, or preserve the selected original at start and place the last copy at end? Recommendation: yes, total count includes endpoints.
5. Should replicate copies inherit the source layer even if a different layer is active? Recommendation: yes.

---

## Promotion

Recommended next implementation order:

1. 49A - Move by Distance
2. 49B - Replicate in Line
3. 49C - Fit Copies Between Points

This gives quick precision placement first, then the hedge workflow, then the stepping-stone/path workflow.
