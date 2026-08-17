# Sweet Home 3D SPIKE-16B Implementation Sketch

Date: August 14, 2026

## Purpose

Define the smallest practical implementation path for:

- `SPIKE-16B` Add a room / area inventory panel

This sketch is intentionally implementation-oriented.

It is meant to answer:

- whether `Sweet Home 3D` already has the model support we need
- where the first UI work should go
- what the smallest believable first pass is
- what should be deferred until later

## Short Answer

`SPIKE-16B` looks feasible, but it is not a one-line exposure change like `SPIKE-16A`.

The good news:

- the model already supports rooms cleanly
- rooms already belong to levels
- rooms already participate in plan selection
- the home model already exposes room add / delete listeners

The missing piece is the list UI.

So this spike is mainly:

- add a new table / panel
- sync it with home selection
- decide where it lives in the existing desktop layout

## Confirmed Source Findings

### Room model is already strong enough

Confirmed in source:

- [Room.java](/Users/billfranklin/Documents/ChatGPT/Architecture Landscape CAD App/source/SweetHome3D-7.5-src/src/com/eteks/sweethome3d/model/Room.java) stores:
  - `name`
  - `points`
  - `level`
  - `areaVisible`
  - `floorVisible`
  - `ceilingVisible`
- `Room` implements `Selectable`
- `Room` exposes `getArea()`

Important nuance:

- rooms do **not** have one simple global `visible` boolean like furniture does
- they have multiple display-related states instead

That means the first list should not pretend there is a single universal room visibility column.

### Home model already provides the right hooks

Confirmed in [Home.java](/Users/billfranklin/Documents/ChatGPT/Architecture Landscape CAD App/source/SweetHome3D-7.5-src/src/com/eteks/sweethome3d/model/Home.java):

- `private List<Room> rooms;`
- `addRoomsListener(...)`
- `removeRoomsListener(...)`
- `getRooms()`
- `addRoom(...)`
- `deleteRoom(...)`
- `getSelectedItems()`
- `setSelectedItems(...)`

Important behavior:

- when a room is added, it inherits `selectedLevel`
- when a room is deleted, it is also removed from selection

That is exactly what we want for a level-aware area inventory.

### Stock UI does not already include a room inventory table

Confirmed by inspection:

- [SwingViewFactory.java](/Users/billfranklin/Documents/ChatGPT/Architecture Landscape CAD App/source/SweetHome3D-7.5-src/src/com/eteks/sweethome3d/swing/SwingViewFactory.java)
  - creates `FurnitureTablePanel` for furniture
  - creates `RoomPanel` for room editing dialogs
- [RoomPanel.java](/Users/billfranklin/Documents/ChatGPT/Architecture Landscape CAD App/source/SweetHome3D-7.5-src/src/com/eteks/sweethome3d/swing/RoomPanel.java) is the room edit form, not an inventory list
- no stock `RoomTable` / `RoomsTable` equivalent was found

So `SPIKE-16B` is real net-new UI work.

### Best insertion point is likely the existing left-side inventory pane

Confirmed in [HomePane.java](/Users/billfranklin/Documents/ChatGPT/Architecture Landscape CAD App/source/SweetHome3D-7.5-src/src/com/eteks/sweethome3d/swing/HomePane.java):

- the current left-side lower pane is built around `controller.getFurnitureController().getView()`
- catalog and furniture are combined in `createCatalogFurniturePane(...)`
- the current structure is already split / wrapped in a way that could host a tabbed inventory surface

This suggests the lowest-risk UI insertion path is:

- keep the furniture inventory
- add an adjacent `Areas` tab beside it

instead of:

- replacing the furniture list
- or building an entirely separate floating window

## Recommended First-Pass Scope

## What the first `SPIKE-16B` panel should show

Recommended minimum columns:

- `Name`
- `Level`
- `Area`
- `Floor`
- `Area Label`

Why this set:

- `Name` is the primary identifier
- `Level` solves the workflow problem you noticed
- `Area` makes the list useful immediately
- `Floor` maps to the most important display toggle for outdoor fills
- `Area Label` maps to whether the square-footage label is shown

## What to avoid in pass 1

Do **not** start with:

- a fake semantic `Type` column inferred from names
- a single misleading `Visible` column
- bulk editing
- drag reordering
- advanced filtering
- cross-linking every room property into the list

Those can come later once the basic list exists and feels worthwhile.

## Why not `Type` in pass 1

Right now, stock `Room` objects are still just rooms / polygons in the model.

We may eventually introduce product-facing categories like:

- planting bed
- lawn
- patio
- driveway

But the source inspection does not support claiming there is already a native semantic area-type model.

So the honest first pass is:

- list real room data now
- add semantic area categories later if and when we add that layer intentionally

## UI Recommendation

## Best first UI location

Recommended first placement:

- a new `Areas` tab beside the existing furniture inventory in the left lower pane

Why this is the best fit:

- it keeps inventory behavior together
- it avoids crowding the right-side property forms
- it preserves the existing furniture workflow
- it should require less architectural disruption than a whole new docking system

## Why not a sidebar-only list

The right side is already more naturally used for:

- properties
- edit controls
- mode-specific helpers

It is a worse place for a full row-based inventory.

## Likely Class Additions

Most likely new classes:

- `RoomTable.java`
- `RoomTablePanel.java`

Most likely existing classes touched:

- [HomePane.java](/Users/billfranklin/Documents/ChatGPT/Architecture Landscape CAD App/source/SweetHome3D-7.5-src/src/com/eteks/sweethome3d/swing/HomePane.java)
- [SwingViewFactory.java](/Users/billfranklin/Documents/ChatGPT/Architecture Landscape CAD App/source/SweetHome3D-7.5-src/src/com/eteks/sweethome3d/swing/SwingViewFactory.java)

Most likely implementation pattern:

- mimic only the lightest useful parts of `FurnitureTable`
- do **not** clone all of its complexity

That means:

- simple `JTable`
- table model backed by `home.getRooms()`
- `CollectionListener<Room>` for row refresh
- `SelectionListener` for plan/list sync

## Selection Sync Recommendation

The first list should support:

1. click a row in the area list
2. select the corresponding `Room` in the plan
3. if a `Room` is selected in the plan, highlight the matching row in the list

That behavior is already conceptually supported by the `Home` selection model because rooms are `Selectable`.

## Minimal Acceptance Test

`SPIKE-16B` first pass is successful if all of the following are true:

1. Create at least two rooms / outdoor areas on different levels.
2. Open the new `Areas` inventory tab.
3. Confirm each row shows:
   - name
   - level
   - area
4. Toggle at least one display-related column and confirm the room updates correctly in plan.
5. Click an area row and confirm the matching area is selected in plan.
6. Select an area in plan and confirm the matching row becomes selected in the list.

## Recommended Engineering Order

### Step 1

Build the simplest non-editable row list first:

- `Name`
- `Level`
- `Area`

### Step 2

Add selection synchronization.

### Step 3

Add one or two honest display toggles:

- `Floor`
- `Area Label`

### Step 4

Only after that, decide whether:

- per-row editing belongs in the list
- or double-click should still open the stock room editor

## Recommendation

Proceed with `SPIKE-16B`, but keep it narrow.

This should be treated as:

- a small new inventory surface
- not a full area-management rewrite

That makes it a good next source spike after `SPIKE-16A`.

## Best Next Move

The next code pass should be:

1. create a minimal `RoomTable` backed by `home.getRooms()`
2. surface it as an `Areas` tab in the existing left inventory pane
3. prove row-to-plan selection sync

If that works, then `SPIKE-16B` is validated as a realistic Phase 1 adaptation rather than a speculative UI dream.
