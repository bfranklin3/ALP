# Sweet Home 3D SPIKE-16A / SPIKE-16B Feasibility Note

Date: August 14, 2026

## Purpose

Turn the `M0` source-map findings into a practical implementation recommendation for:

- `SPIKE-16A` Expose `Level` in the furniture / object inventory
- `SPIKE-16B` Add a room / area inventory panel

This note is meant to answer:

- how hard each spike looks
- what should be attempted first
- what the smallest useful implementation likely is
- what should be considered Phase 1 versus Phase 1.5

## Inputs

This note is based on:

- [sweethome3d-source-map-phase-1.md](/Users/billfranklin/Documents/ChatGPT/Architecture Landscape CAD App/sweethome3d-source-map-phase-1.md)
- [sweethome3d-phase-1-implementation-roadmap.md](/Users/billfranklin/Documents/ChatGPT/Architecture Landscape CAD App/sweethome3d-phase-1-implementation-roadmap.md)

## Short Answer

`SPIKE-16A` looks like a good Phase 1 engineering target.

`SPIKE-16B` looks valuable, but should be scoped carefully because it appears to require a new UI surface rather than a simple exposure of an existing one.

Recommended approach:

1. do `SPIKE-16A` first
2. use it as the pattern for list columns, selection sync, and level visibility
3. then do a very small `SPIKE-16B` prototype
4. keep the first room/area inventory intentionally narrow

## What We Know with High Confidence

### Furniture / placed objects

The model already supports `Level` for placed objects.

Confirmed source-map evidence:

- `HomePieceOfFurniture` stores `level`
- `HomePieceOfFurniture$SortableProperty` includes `LEVEL`
- `FurnitureTable` and related UI classes already support a visible-properties style table workflow

This means the app already has the core data and a table architecture that is close to what we want.

### Rooms / drawn areas

The model already supports `Level` for rooms / areas too.

Confirmed source-map evidence:

- `Room` stores `level`
- `RoomController` interacts with level-related state
- `PlanController` owns room creation / resize / naming interaction states

However, no stock room inventory table was found.

That is the key difference.

## SPIKE-16A: Expose `Level` in the Furniture / Object Inventory

## Feasibility Read

- `Moderate`, possibly `Moderate-Low`

## Why it looks favorable

- the data already exists
- the sortable property already exists
- the furniture table already appears to support configurable visible columns
- the stock furniture inventory is already a familiar user-facing surface

## Likely implementation path

### Classes to inspect first

- `com/eteks/sweethome3d/swing/FurnitureTable.java`
- `com/eteks/sweethome3d/swing/FurnitureTablePanel.java`
- `com/eteks/sweethome3d/swing/FurnitureTable$FurnitureTableColumnModel.java`
- `com/eteks/sweethome3d/swing/HomePane.java`
- `com/eteks/sweethome3d/model/HomePieceOfFurniture.java`

### Smallest viable implementation

Add a `Level` column to the furniture inventory table that:

- shows the current level name for each placed object
- sorts correctly
- exports correctly if CSV export includes visible columns

### Best Phase 1 behavior

The simplest strong behavior would be:

- `Level` visible by default in the furniture list
- still user-toggleable later if we want

I would lean toward making it visible by default in the landscape-focused fork, because it directly supports the way you think about organization.

### Main unknowns

- whether `LEVEL` is already supported but simply hidden by current UI defaults
- whether localization / table-header wiring is needed
- whether export and print need extra handling

## Recommendation for SPIKE-16A

Proceed.

This is the more efficient spike, the lower-risk spike, and the one most likely to give us a quick product win.

## SPIKE-16B: Add a Room / Area Inventory Panel

## Feasibility Read

- `Moderate-High`

## Why it looks harder

- the room model already exists
- the level relationship already exists
- but there is no obvious stock list/table UI for rooms
- so this is probably not a “turn on one more column” change

Instead, it looks more like:

- new table model
- new panel or tab
- new selection synchronization
- new visibility behavior wiring

## Likely implementation path

### Classes to inspect first

- `com/eteks/sweethome3d/model/Room.java`
- `com/eteks/sweethome3d/viewcontroller/RoomController.java`
- `com/eteks/sweethome3d/viewcontroller/PlanController.java`
- `com/eteks/sweethome3d/swing/RoomPanel.java`
- `com/eteks/sweethome3d/swing/HomePane.java`

### Smallest viable implementation

Do not start by building a giant management console.

Start with a minimal room/area inventory that shows:

- `Name`
- `Type`
- `Level`
- `Visible`
- `Area`

For Phase 1, `Type` can be simple and derived from naming or object class conventions, for example:

- `Room`
- `Planting Bed`
- `Lawn`
- `Patio`

Even if that type starts as lightweight metadata or a display convention, it would already make the list much more usable.

### Best first UI location

The cleanest first prototype is probably:

- a dedicated secondary panel or tab

not:

- an overload of the existing furniture table
- not a deep inspector-only widget

Why:

- furniture and drawn areas are conceptually different
- they have different columns
- keeping them separate avoids muddying the current stock table logic

## Main unknowns

- what the lightest reusable table framework inside `Sweet Home 3D` is
- how selection synchronization should work between the plan and a new room list
- whether visibility is best controlled per-row, via level, or both
- whether area rows should include text labels / annotations in the same surface or not

## Recommendation for SPIKE-16B

Proceed, but narrow the scope.

For Phase 1, the goal should be:

- prove that a room/area list can exist
- prove that it can show `Level`
- prove that clicking a row can select the area in plan

It does **not** need, on the first pass, to become a complete area-management studio.

## Comparative Read

### SPIKE-16A

- better candidate for immediate implementation
- lower risk
- faster validation value
- likely useful even if `SPIKE-16B` is delayed

### SPIKE-16B

- more custom work
- more UX decisions
- still important
- should follow `SPIKE-16A`, not precede it

## Implementation Recommendation

Recommended order:

1. `SPIKE-16A`
   - verify how close `Level` already is to being a visible furniture-table column
   - prototype it
   - decide whether it should be default-visible in the fork
2. `SPIKE-16B`
   - create a minimal room/area inventory prototype
   - keep columns intentionally small
   - prove selection sync and level readability

## Phase 1 / Phase 1.5 Split

### Phase 1

- furniture/object inventory shows `Level`
- room/area inventory exists in minimal form
- users can tell where objects and areas live without guessing

### Phase 1.5

- richer area typing
- filtering
- sorting refinements
- bulk visibility operations
- better lock/protect behavior
- maybe a unified project-organization panel

## Concrete Next Step

The next engineering note should be:

- `SPIKE-16A implementation sketch`

That sketch should answer:

1. where the `Level` column is defined
2. whether it can be turned on with a lightweight change
3. whether it should be default-visible in the fork
4. what acceptance test proves it works

After that, we should do:

- `SPIKE-16B minimal room inventory sketch`

## Bottom Line

`SPIKE-16A` looks like a strong “do now” task.

`SPIKE-16B` looks worthwhile but should be treated as a deliberately small custom UI addition, not a casual checkbox feature.
