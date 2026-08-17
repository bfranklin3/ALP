# BUILDING-IMP-02 Prototype Mapping

Date: August 13, 2026

## Purpose

Map the second Phase 1 Building ticket to the actual prototype files and code responsibilities.

This note reflects the first stabilization pass already applied to the prototype shell.

## Ticket

- `BUILDING-IMP-02`
- Summary: Implement the first production `Walls` tool slice

## Prototype files touched

### 1. `scripts/landscape-shell-prototype.js`

Responsibility:

- `Walls` launch behavior
- Building-mode status text
- wall-tool state prompts
- active Building command state
- wall GUI action registration text

Changes made:

- added `getWallsReadyStatusText()` for consistent Building-mode wall status text
- updated `launchWallToolAction()` to use `Building` language and set the active Building command to `Walls`
- updated live default syncing to refresh wall-tool status text
- updated wall-tool prompt/status copy to explicitly support exterior and interior walls
- updated the registered GUI action label and status tip to match the `Walls` tool language

### 2. `scripts/LandscapeShellWallAction.js`

Responsibility:

- registered wall action startup behavior

Changes made:

- when the registered wall action begins, it now syncs the shell panel's active Building command to `Walls`

## What this stabilization pass improves

- the prototype now uses `Building` / `Walls` language more consistently
- shell status text better reflects the intended one-tool wall workflow
- the live wall action updates are easier to understand during point-pick flow
- the active Building command state stays aligned when the registered wall action begins

## What is still not proven by this pass

- live manual validation in a fresh QCAD window
- whether the first-click friction is improved or unchanged for the wall launch path
- whether the wall launch should eventually bypass the current registered GUI action route

## Recommended next validation step

Run a live QCAD prototype check focused on:

1. `Building` mode visible by default
2. `Walls` launches the wall flow correctly
3. status text updates during first-point and second-point steps
4. wall defaults still apply correctly
5. no regressions to existing wall creation behavior
