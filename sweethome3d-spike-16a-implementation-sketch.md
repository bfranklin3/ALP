# Sweet Home 3D SPIKE-16A Implementation Sketch

Date: August 14, 2026

## Purpose

Define the smallest practical implementation path for:

- `SPIKE-16A` Expose `Level` in the furniture / object inventory

## Current Status

As of August 14, 2026, this spike has now moved beyond theory and into the first real source pass.

Confirmed in source:

- `FurnitureTable.java` already supports a `LEVEL` column label, renderer, preferred width, and CSV export path
- `HomePane.java` already exposes `DISPLAY_HOME_FURNITURE_LEVEL`
- `FurnitureController.java` already includes `LEVEL` in its visible-property ordering logic

Actual implementation completed:

- `Home.java` now includes `LEVEL` in the default visible furniture-property list for new homes
- `Home.java` also includes `LEVEL` in the older fallback visible-property list used during legacy initialization

Build result:

- `ant buildModernDesktop` succeeds after this change
- `ant jarExecutableModernDesktop` also succeeds and produces:
  - `install/SweetHome3D-7.5-modern.jar`

Remaining validation gap:

- the source-built app now launches from the modern executable jar
- the remaining work is just live UI confirmation that the furniture inventory shows `Level` by default for a new home

This sketch is intentionally short and engineering-oriented.

It is meant to answer:

- where the change likely belongs
- what we should implement first
- what acceptance test proves it works
- what we should defer unless needed

## Why This Spike Goes First

This is the best first `Sweet Home 3D` code spike because:

- it solves a real workflow gap you already noticed
- the underlying model already stores `Level`
- the stock app already has a furniture inventory table
- the risk is much lower than building a brand-new room/area inventory

## Expected Outcome

After this spike, the furniture / placed-object inventory should show which `Level` each object belongs to.

For example:

- `Door | 3'0" | 0'5/8" | 6'10" | Proposed`
- `Double-hung window | 2'8" | 0'3/4" | 4'2 3/8" | Existing`

That immediately makes project organization much clearer in a landscape / architectural workflow.

## Likely Source Touchpoints

Based on the source-map pass, these are the first files to inspect in a real source checkout:

- `com/eteks/sweethome3d/swing/FurnitureTable.java`
- `com/eteks/sweethome3d/swing/FurnitureTablePanel.java`
- `com/eteks/sweethome3d/swing/HomePane.java`
- `com/eteks/sweethome3d/viewcontroller/FurnitureController.java`
- `com/eteks/sweethome3d/model/Home.java`
- `com/eteks/sweethome3d/model/HomePieceOfFurniture.java`

## Working Hypothesis

The best case is:

- `LEVEL` is already part of the furniture sortable-property system
- the table infrastructure already knows how to render it
- it is simply not exposed as a visible column in the stock UI

If that hypothesis is correct, this becomes a light-touch UI exposure change.

That hypothesis turned out to be correct.

## Early Inspection Result

The first class-level inspection supported this spike strongly, and the source pass confirmed it.

Confirmed findings from the installed `7.5` app bundle:

- `HomePieceOfFurniture$SortableProperty` explicitly includes `LEVEL`
- `HomePane` includes furniture display-property menu plumbing:
  - `createFurnitureDisplayPropertyMenu`
  - `toggleFurnitureVisibleProperty`
- `FurnitureTable$FurnitureTableColumnModel` includes:
  - `getLevelRenderer`
  - `FURNITURE_VISIBLE_PROPERTIES`

Important nuance:

- the visible-properties string set clearly showed:
  - `WIDTH`
  - `DEPTH`
  - `HEIGHT`
  - `ELEVATION`
  - `MOVABLE`
  - `DOOR_OR_WINDOW`
  - `VISIBLE`
  - `PRICE`
  - `PRICE_VALUE_ADDED_TAX_INCLUDED`
- but it did **not** clearly show `LEVEL` in that same visible-properties set

Source-confirmed interpretation:

- the table layer appears to already know how to render a level value
- but `Level` was not included in the default visible-column/property list for new homes

That produced a very good first implementation path:

- add `LEVEL` to the default furniture visible-properties path in `Home.java`
- leave the existing table renderer, menu actions, and export logic untouched
- rebuild and verify that no deeper UI surgery is required for the first pass

This makes the spike feel more like a targeted table exposure change than a deeper architectural change.

## Smallest Viable Implementation

### Goal

Add a `Level` column to the furniture inventory table.

### Phase 1 behavior

- show the current level name for each placed object
- allow the table to sort by `Level`
- keep selection behavior unchanged
- preserve existing visibility checkboxes

### Recommended default

In the landscape-focused fork:

- make `Level` visible by default

Reason:

- this is not a niche advanced property in your workflow
- it is central to understanding `Existing`, `Proposed`, `Plants`, `Reference`, and similar level groupings

## First Implementation Pass

### Implemented in Pass 1

- confirmed `LEVEL` already existed in the table / action / export path
- changed the default visible furniture-property list in `Home.java`
- changed the legacy fallback visible furniture-property list in `Home.java`
- rebuilt successfully with `ant buildModernDesktop`

### Next validation step

Verify in a live app session that:

- a new home shows `Level` in the furniture inventory by default
- placed objects on different levels display the correct level names
- sort behavior still works normally

### Visibility decision

For the fork, `Level` should be:

- always shown in the fork
- shown by default but toggleable

Recommended choice:

- shown by default, still toggleable if the stock column infrastructure supports that cleanly

## Fallback Path

If any unexpected UI issue appears during live validation, the fallback should still stay small:

- add a custom `Level` column directly in `FurnitureTable`
- populate it from `HomePieceOfFurniture.getLevel()`
- keep all other behavior unchanged

This is still acceptable for Phase 1 if the generic property hook turns out to be less reusable than hoped.

## What Not to Do in This Spike

Do not expand this spike into:

- room / area inventory work
- lock behavior
- level reordering
- major furniture panel redesign
- unified project organization UI

This spike should stay focused on one concrete improvement:

- placed objects visibly show their level in the stock inventory

## Acceptance Test

The spike is successful if all of the following are true:

1. Place at least two objects on different levels, for example one on `Existing` and one on `Proposed`.
2. Open the furniture inventory list.
3. Confirm a `Level` column is visible.
4. Confirm each object shows the correct level name.
5. Sort by the `Level` column and confirm objects reorder correctly.
6. Select an inventory row and confirm plan selection still works normally.
7. If CSV export uses visible columns, verify `Level` appears correctly there too.

## Actual First-Pass Code Change

Source file touched:

- `src/com/eteks/sweethome3d/model/Home.java`

Change made:

- inserted `HomePieceOfFurniture.SortableProperty.LEVEL` into the default visible furniture-property arrays

Why this is the right first move:

- it solves the user-facing discovery problem without rewriting the stock table
- it reuses the existing `LEVEL` renderer and display-action plumbing already present in the application
- it is easy to revert or refine later if we want a different default column order

## Success Criteria

This spike should be considered complete for Pass 1 when:

- the `Level` column exists
- it displays readable level names
- it sorts correctly
- it does not break table selection behavior
- it is stable enough to serve as the pattern for later list-based organization work

Current read:

- code pass complete
- build validation complete
- runnable local packaging complete
- live app validation still pending user confirmation in the launched app

## Recommended Follow-Up After This Spike

If `SPIKE-16A` succeeds cleanly, the next step should be:

- `SPIKE-16B minimal room inventory sketch`

Why:

- we will then already have a good precedent for:
  - list columns
  - level readability
  - plan/list selection expectations

## Bottom Line

`SPIKE-16A` should be treated as a focused table-column exposure spike, not a broad UI project.

If the source behaves the way the source-map suggests, this should be one of the cleanest early customizations in the `Sweet Home 3D` pivot.
