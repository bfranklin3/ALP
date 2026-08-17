# Sweet Home 3D SPIKE-16A Live Inspection Findings

Date: August 14, 2026

## Purpose

Capture the first live inspection pass for:

- `SPIKE-16A` Expose `Level` in the furniture / object inventory

This note records what we were able to confirm directly from the installed `Sweet Home 3D 7.5` app bundle and what remains blocked until we work from a real source checkout.

## Scope of This Pass

Inspected:

- `/Applications/Sweet Home 3D 7.5.app/Contents/app/SweetHome3D.jar`

Methods used:

- `unzip -l`
- `unzip -p ... | strings`

We also attempted to use Java inspection tools for deeper class analysis, but the machine does not currently provide a working local Java toolchain invocation for that purpose.

## What We Confirmed

### 1. The furniture model already supports `Level`

From `HomePieceOfFurniture$SortableProperty.class`, we confirmed the sortable property enum includes:

- `NAME`
- `WIDTH`
- `DEPTH`
- `HEIGHT`
- `VISIBLE`
- `ELEVATION`
- `LEVEL`

This is the strongest signal that `SPIKE-16A` is a good target, because the concept already exists in the model/property layer.

### 2. The furniture inventory UI already has visible-property menu plumbing

From `HomePane.class`, we confirmed strings for:

- `createFurnitureDisplayPropertyMenu`
- `toggleFurnitureVisibleProperty`

That strongly suggests the stock UI already supports a configurable visible-columns workflow for the furniture inventory.

### 3. The furniture table column model appears to already know about level rendering

From `FurnitureTable$FurnitureTableColumnModel.class`, we confirmed:

- `getLevelRenderer`
- `FURNITURE_VISIBLE_PROPERTIES`

This is especially encouraging.

It suggests that `Level` was at least partially anticipated in the table layer, even if it is not currently exposed in the stock UI.

### 4. The stock visible-properties set does not obviously include `LEVEL`

From the same column-model inspection, the visible-properties strings clearly showed entries such as:

- `WIDTH`
- `DEPTH`
- `HEIGHT`
- `ELEVATION`
- `MOVABLE`
- `DOOR_OR_WINDOW`
- `VISIBLE`
- `PRICE`
- `PRICE_VALUE_ADDED_TAX_INCLUDED`

But `LEVEL` did **not** clearly appear in that visible-properties set.

Current interpretation:

- `Level` likely exists in the model and renderer path
- but may not yet be included in the stock exposed furniture-column list

## What This Means for Implementation

The most likely implementation path for `SPIKE-16A` is:

1. locate where `FURNITURE_VISIBLE_PROPERTIES` is defined or populated
2. add `LEVEL` into that exposed property set
3. ensure the table header label is readable
4. verify sorting and export behavior
5. decide whether `Level` should be visible by default in the fork

That is a much better outcome than discovering that `Level` had to be invented from scratch.

## Current Difficulty Read

- still `Moderate`, possibly `Moderate-Low`

After this live pass, I feel slightly more confident in the lower-risk reading, because:

- model support is real
- menu plumbing is real
- level rendering support in the column model appears real

The remaining work now looks more like a targeted exposure change than a deep architectural change.

## Current Blocker

We do **not** yet have a real local source checkout for `Sweet Home 3D`.

The installed app bundle is enough for:

- class discovery
- string-level inspection
- rough implementation mapping

But it is not enough for responsible code editing.

We also do not currently have a working local Java inspection path for deeper decompilation from the installed bundle alone.

## Practical Conclusion

`SPIKE-16A` still looks like the right first engineering spike.

But the next prerequisite for actual implementation is:

- obtain or point this project at a real local `Sweet Home 3D` source tree

Once we have that, the first files to inspect in code should be:

- `FurnitureTable.java`
- `FurnitureTablePanel.java`
- `FurnitureTable$FurnitureTableColumnModel.java`
- `HomePane.java`
- `HomePieceOfFurniture.java`

## Recommendation

Proceed in this order:

1. keep `SPIKE-16A` as the first code target
2. work from a proper local source checkout, not the installed app bundle
3. implement the smallest viable change:
   - show `Level` in the furniture inventory
4. then validate whether that pattern should inform `SPIKE-16B`

## Bottom Line

This pass did not knock us off track.

It strengthened the case that `SPIKE-16A` is a smart first implementation target and clarified that the next real requirement is source access, not more product speculation.
