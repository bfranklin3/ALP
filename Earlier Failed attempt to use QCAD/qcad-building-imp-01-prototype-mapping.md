# BUILDING-IMP-01 Prototype Mapping

Date: August 13, 2026

## Purpose

Map the first Phase 1 Building ticket to the actual prototype files and code responsibilities.

This note reflects the first implementation pass already applied to the prototype shell.

## Ticket

- `BUILDING-IMP-01`
- Summary: Build the Building-mode command-strip entry pattern

## Prototype files touched

### 1. `scripts/landscape-shell-prototype.ui`

Responsibility:

- visible dock/panel button labels and layout

Changes made:

- renamed mode button from `Hardscape` to `Building`
- renamed `Wall / Building Edge` button to `Walls`
- added `Doors` button
- added `Windows` button

### 2. `scripts/landscape-shell-prototype.js`

Responsibility:

- shell panel wiring
- mode switching
- Building command routing
- wall launch entry point
- placeholder architectural library focus behavior
- workflow toolbar labels

Changes made:

- renamed runtime and panel behavior from `Hardscape` to `Building` where this ticket required it
- replaced old `HardscapeButton` / `BuildingEdgeButton` assumptions with:
  - `BuildingButton`
  - `WallsButton`
  - `DoorsButton`
  - `WindowsButton`
- wired `Walls` to the existing wall workflow
- added `setActiveBuildingCommand(...)`
- added `focusArchitecturalLibrarySection(...)`
- wired `Doors` and `Windows` to a first-pass architectural library focus hook
- updated toolbar label from `Hardscape` to `Building`
- changed initial prototype mode from `Planting` to `Building`

## What this first pass does

The prototype now expresses the Phase 1 product language more accurately:

- `Building` is the parent mode
- `Walls` is the primary wall command
- `Doors` and `Windows` exist as architectural entry points

This pass intentionally does not yet implement:

- a real architectural library browser focus UI
- anchored wall / door / window subtype pickers
- hosted door/window placement

Those belong to later tickets:

- `LIBRARY-IMP-01`
- `BUILDING-IMP-03`
- `BUILDING-IMP-04`

## Recommended next code targets

After this ticket, the next most likely implementation files are:

### For `BUILDING-IMP-02`

- `scripts/landscape-shell-prototype.js`

Focus:

- stabilize the `Walls` launch path
- improve wall-tool status/help text
- preserve wall defaults consistently

### For `LIBRARY-IMP-01`

- `scripts/landscape-shell-prototype.ui`
- `scripts/landscape-shell-prototype.js`

Focus:

- add a visible library area or architectural section state
- make `Doors` / `Windows` visibly focus the right content section

### For `BUILDING-IMP-03`

- `scripts/landscape-shell-prototype.js`

Focus:

- hosted object runtime data
- wall target detection
- automatic opening behavior
