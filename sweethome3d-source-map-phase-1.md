# Sweet Home 3D Source Map for Phase 1 Changes

Date: August 14, 2026

## Purpose

Map the most relevant `Sweet Home 3D` classes for Phase 1 work, based on inspection of:

- `/Applications/Sweet Home 3D 7.5.app/Contents/app/SweetHome3D.jar`

This is a class-level boundary map from the installed app bundle.

It is not yet a full source checkout review, but it is enough to judge where the first Phase 1 changes likely belong and how hard they may be.

## Important Takeaway

The installed app already confirms a useful split:

- the **data model** is better than the stock UI suggests
- both furniture objects and rooms already store a `Level`
- the stock UI exposes furniture in a table
- the stock UI does **not** appear to expose rooms / areas in a comparable table

This matters directly for:

- `SPIKE-16A` Expose `Level` in the furniture / object inventory
- `SPIKE-16B` Add a room / area inventory panel

## 1. Furniture Inventory UI

### Primary classes

- `com/eteks/sweethome3d/swing/FurnitureTablePanel`
- `com/eteks/sweethome3d/swing/FurnitureTable`
- `com/eteks/sweethome3d/swing/FurnitureTable$FurnitureTableColumnModel`
- `com/eteks/sweethome3d/swing/HomePane`
- `com/eteks/sweethome3d/viewcontroller/FurnitureController`
- `com/eteks/sweethome3d/model/HomePieceOfFurniture`
- `com/eteks/sweethome3d/model/HomePieceOfFurniture$SortableProperty`

### What these appear to do

`FurnitureTablePanel`

- wraps the visible furniture inventory UI
- owns the `furnitureTable` component
- handles totals / scrollpane / popup integration

`FurnitureTable`

- actual table / tree-table implementation
- supports export / print behavior
- reads furniture properties including:
  - `name`
  - `depth`
  - `height`
  - `visible`
  - `level`

`FurnitureTable$FurnitureTableColumnModel`

- controls visible/sortable columns
- likely the main class to inspect when deciding whether `Level` can become a user-visible column

`HomePane`

- contains menu plumbing around the table
- strings found include:
  - `createFurnitureDisplayPropertyMenu`
  - `toggleFurnitureVisibleProperty`
  - `showExportToCSVDialog`
  - `printToPDF`

This strongly suggests the furniture table already has a generic “visible properties” infrastructure.

`HomePieceOfFurniture`

- model object for placed library items
- confirmed to store:
  - `getLevel`
  - `setLevel`
  - `isAtLevel`

`HomePieceOfFurniture$SortableProperty`

- confirmed to include:
  - `NAME`
  - `WIDTH`
  - `DEPTH`
  - `HEIGHT`
  - `VISIBLE`
  - `ELEVATION`
  - `LEVEL`

### Phase 1 implication

This is favorable for `SPIKE-16A`.

The underlying model and property system already know about `Level`.
The likely task is not inventing the concept, but surfacing it cleanly in the table UI.

### Difficulty estimate for `SPIKE-16A`

- `Moderate`, possibly `Moderate-Low`

Why:

- the model already supports `Level`
- the table already supports visible/sortable properties
- the likely work is in:
  - column-model exposure
  - label/localization
  - default column visibility
  - maybe export / print consistency

### First files to inspect in a real source checkout

- `com/eteks/sweethome3d/swing/FurnitureTable.java`
- `com/eteks/sweethome3d/swing/FurnitureTablePanel.java`
- `com/eteks/sweethome3d/swing/HomePane.java`
- `com/eteks/sweethome3d/model/HomePieceOfFurniture.java`

## 2. Room / Area Editing UI

### Primary classes

- `com/eteks/sweethome3d/swing/RoomPanel`
- `com/eteks/sweethome3d/viewcontroller/RoomController`
- `com/eteks/sweethome3d/model/Room`
- `com/eteks/sweethome3d/viewcontroller/PlanController`

### What these appear to do

`RoomPanel`

- the stock room properties dialog
- owns UI for:
  - name
  - area visible
  - floor visible
  - floor color / texture / shininess
  - ceiling visible
  - wall-side options

This is the main UI surface for any room-based outdoor adaptation such as:

- opacity control
- smoothing control
- naming refinement

`RoomController`

- property/controller layer for room editing
- confirmed to interact with `getLevel`, `setLevel`, and `isAtLevel`

`Room`

- model object for drawn room / area polygons
- confirmed to store:
  - `level`
  - `getLevel`
  - `setLevel`
  - `isAtLevel`

`PlanController`

- contains the actual room editing states
- strings confirm:
  - `RoomCreationState`
  - `RoomDrawingState`
  - `RoomResizeState`
  - `RoomNameOffsetState`
  - `RoomAreaOffsetState`
  - `RoomsCreationUndoableEdit`

This means room creation and manipulation live in the plan-controller / plan-component path, not in any stock room list UI.

### What was not found

I did **not** find a stock:

- `RoomTable`
- `RoomsPanel`
- `RoomList`
- `RoomsTable`

So there does not appear to be a furniture-style persistent inventory panel for rooms in the stock app.

### Phase 1 implication

This confirms your concern:

- rooms / drawn areas do internally belong to levels
- but the stock UI does not appear to provide a comparable room inventory

### Difficulty estimate for `SPIKE-16B`

- `Moderate-High`

Why:

- the room model already exists and already has `Level`
- but the list UI likely needs to be created rather than merely exposed
- likely work includes:
  - defining a table model
  - selection synchronization with the plan
  - column definitions such as:
    - name
    - type
    - level
    - visible
    - area
  - deciding whether the new list lives:
    - beside furniture
    - in a dedicated panel
    - in a tabbed inspector

### First files to inspect in a real source checkout

- `com/eteks/sweethome3d/swing/RoomPanel.java`
- `com/eteks/sweethome3d/viewcontroller/RoomController.java`
- `com/eteks/sweethome3d/model/Room.java`
- `com/eteks/sweethome3d/viewcontroller/PlanController.java`
- `com/eteks/sweethome3d/swing/HomePane.java`

## 3. Level Behavior

### Primary classes

- `com/eteks/sweethome3d/model/Level`
- `com/eteks/sweethome3d/swing/LevelPanel`
- `com/eteks/sweethome3d/swing/LevelPanel$LevelsTableModel`
- `com/eteks/sweethome3d/viewcontroller/LevelController`
- `com/eteks/sweethome3d/viewcontroller/PlanController`
- `com/eteks/sweethome3d/swing/HomePane`

### What these appear to do

`Level`

- core level model

`LevelPanel`

- stock level dialog
- owns UI for:
  - viewable
  - name
  - elevation
  - floor thickness
  - height
  - a levels summary table

`LevelPanel$LevelsTableModel`

- summary table model inside the level dialog
- useful if we later want similar flat-project organization summaries

`PlanController`

- contains level-related undo/edit operations including:
  - `LevelAdditionUndoableEdit`
  - `LevelDeletionUndoableEdit`
  - `LevelViewabilityModificationUndoableEdit`
  - `LevelsViewabilityModificationUndoableEdit`
  - `AllLevelsViewabilityModificationUndoableEdit`
  - `LockingUndoableEdit`
  - `UnlockingUndoableEdit`

Important note:

- the presence of `LockingUndoableEdit` is interesting, but by class-name inspection alone it is not yet safe to claim that levels already support the exact lock workflow we want

`HomePane`

- contains level-menu actions including:
  - `createLevelsMenu`
  - `addLevel`
  - `addLevelAtSameElevation`
  - `toggleSelectedLevelViewability`
  - `setSelectedLevelOnlyViewable`
  - `setAllLevelsViewable`
  - `modifySelectedLevel`
  - `deleteSelectedLevel`
  - `displayAllLevels`
  - `displaySelectedLevel`

### Phase 1 implication

The level system is a viable base for a flat visibility-group workflow, but it is still architecturally biased.

The highest-value tasks appear to be:

- flatter defaults
- clearer level identity in object/area lists
- protection / lock behavior

### First files to inspect in a real source checkout

- `com/eteks/sweethome3d/model/Level.java`
- `com/eteks/sweethome3d/swing/LevelPanel.java`
- `com/eteks/sweethome3d/viewcontroller/LevelController.java`
- `com/eteks/sweethome3d/viewcontroller/PlanController.java`
- `com/eteks/sweethome3d/swing/HomePane.java`

## 4. 2D Rendering and Plan Interaction

### Primary classes

- `com/eteks/sweethome3d/swing/PlanComponent`
- `com/eteks/sweethome3d/viewcontroller/PlanController`
- `com/eteks/sweethome3d/swing/BackgroundImageWizardStepsPanel`
- `com/eteks/sweethome3d/swing/LabelPanel`
- `com/eteks/sweethome3d/swing/DimensionLinePanel`
- `com/eteks/sweethome3d/swing/PolylinePanel`

### What these appear to do

`PlanComponent`

- primary 2D rendering surface
- strings found confirm rendering methods for:
  - `paintBackground`
  - `paintBackgroundImage`
  - `paintGrid`
  - `paintRooms`
  - `paintRoomsNameAndArea`
  - `paintRoomsOutline`
  - `paintText`
  - `paintWalls`
  - `paintFurniture`
  - `paintDoorOrWindowSashes`
  - `paintLabels`
  - `paintDimensionLines`

This is the most important class for:

- room fill opacity
- room smoothing rendering experiments
- wrapped text drawing behavior
- draft / monochrome mode

`PlanController`

- primary 2D interaction/controller layer
- owns creation / editing states for:
  - rooms
  - walls
  - labels
  - dimension lines
  - polylines
  - furniture movement / resizing

`BackgroundImageWizardStepsPanel`

- underlay calibration / origin workflow
- useful for unit-entry and underlay friendliness refinements

`LabelPanel`

- stock text / label properties UI
- already uses a `JTextArea`, which is interesting for future text-behavior refinement
- important for:
  - text wrapping work
  - layout-box annotation improvements

### Phase 1 implication

For most visual/product refinements, `PlanComponent` is the key rendering file.
For most manipulation behavior, `PlanController` is the matching interaction file.

### First files to inspect in a real source checkout

- `com/eteks/sweethome3d/swing/PlanComponent.java`
- `com/eteks/sweethome3d/viewcontroller/PlanController.java`
- `com/eteks/sweethome3d/swing/BackgroundImageWizardStepsPanel.java`
- `com/eteks/sweethome3d/swing/LabelPanel.java`
- `com/eteks/sweethome3d/swing/DimensionLinePanel.java`

## Difficulty Read for Key Spikes

### `SPIKE-16A` Expose `Level` in the furniture / object inventory

Current read:

- `Moderate`, possibly `Moderate-Low`

Reason:

- the model already stores `Level`
- the furniture property/column system already knows `LEVEL`
- the table already supports visible property infrastructure

Main unknown:

- whether the stock menu/column system already supports turning `Level` on and it is simply hidden by default, or whether we need a small custom extension

### `SPIKE-16B` Add a room / area inventory panel

Current read:

- `Moderate-High`

Reason:

- the room model already stores `Level`
- but there is no obvious stock room-table equivalent
- this likely requires a new UI surface and selection synchronization logic

Main unknown:

- whether the cleanest implementation is:
  - a new table panel
  - a secondary inventory tab
  - an inspector-integrated list

## Best Immediate Follow-Up

Use this source map as the starting point for the first real code-oriented spike document:

- `SPIKE-16A / SPIKE-16B feasibility note`

That note should answer:

1. Can the existing furniture table already surface `Level` with a lightweight change?
2. What is the smallest viable implementation for a room / area inventory?
3. Should that room / area inventory be built in Phase 1, or staged immediately after MVP?
