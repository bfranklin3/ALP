# QCAD-Based Landscape Planner MVP Spec: Import Underlay + Calibrate

Date: August 12, 2026
Status: Draft after successful feasibility spike

## Purpose

This document turns the successful QCAD spike into a tighter MVP workflow spec for:

- importing a site or house reference underlay
- calibrating it from two known points
- using that calibrated reference as the starting point for drawing

It is intended to convert the spike result into a clearer implementation target.

## Related docs

- [feasibility-findings.md](/Users/billfranklin/Documents/ChatGPT/Architecture Landscape CAD App/feasibility-findings.md)
- [qcad-customization-risks.md](/Users/billfranklin/Documents/ChatGPT/Architecture Landscape CAD App/qcad-customization-risks.md)
- [qcad-landscape-planner-prioritized-mvp-backlog.md](/Users/billfranklin/Documents/ChatGPT/Architecture Landscape CAD App/qcad-landscape-planner-prioritized-mvp-backlog.md)
- [qcad-landscape-planner-underlay-calibrate-implementation-tickets.md](/Users/billfranklin/Documents/ChatGPT/Architecture Landscape CAD App/qcad-landscape-planner-underlay-calibrate-implementation-tickets.md)
- [qcad-landscape-planner-mvp-architecture.md](/Users/billfranklin/Documents/ChatGPT/Architecture Landscape CAD App/qcad-landscape-planner-mvp-architecture.md)
- [qcad-landscape-planner-ui-wireframe-panel-spec.md](/Users/billfranklin/Documents/ChatGPT/Architecture Landscape CAD App/qcad-landscape-planner-ui-wireframe-panel-spec.md)

## Spike result summary

The feasibility spike now proves the core workflow is viable inside QCAD:

- a raster underlay can be imported from script
- the underlay can be assigned to a dedicated reference layer
- the user can pick two points on the underlay
- the user can enter a known real-world distance
- the underlay can be rescaled and redrawn correctly
- the shell can report the result back in the planner panel

This means the workflow is now an MVP implementation problem, not a platform feasibility problem.

## MVP goal

The MVP should let a user do this reliably:

1. Start a new project
2. Import a site survey, scan, screenshot, or house plan as a reference underlay
3. Calibrate that underlay from two known points
4. Lock the calibrated reference
5. Draw accurately on top of it

## Primary user value

This workflow matters because many real users will not begin from a blank CAD drawing.

They will begin from:

- a survey image
- a scanned plan
- a screenshot from another program
- a photo-exported lot layout
- a PDF or image received from a surveyor, builder, or homeowner

If this step is awkward, the whole product feels harder than it needs to.

## MVP scope

### In scope

- raster underlay import:
  - `png`
  - `jpg`
  - `jpeg`
  - `bmp`
  - `tif`
  - `tiff`
- underlay placement into the drawing
- dedicated reference layer assignment
- underlay show / hide
- underlay lock / unlock
- two-point calibration
- known-distance entry dialog
- redraw after calibration
- status feedback in the planner panel
- persistence of enough metadata to reopen the project without losing underlay placement and scale

### Out of scope for the first MVP pass

- automatic PDF parsing or direct PDF-specific calibration behavior
- perspective correction
- scanned image deskew tools
- multiple independently calibrated underlays in one project
- opacity / fade slider if time is tight
- rotation correction wizard
- georeferencing

## Product decisions

### 1. Raster first

The first MVP should treat raster underlay import as the primary path.

Why:

- it is now directly proven in the spike
- it covers many real user inputs immediately
- it avoids overcommitting to PDF-specific complexity too early

PDF support can be added after the raster path is solid.

### 2. Reference-first calibration

Calibration should be framed as a `reference setup` operation, not as a generic global scale command.

For MVP, the default behavior should be:

- scale the imported underlay
- scale reference-only calibration marks if needed
- avoid silently scaling finished design geometry on normal drawing layers

If the user recalibrates after drawing has already started, the app should warn clearly before affecting non-reference geometry.

### 3. Dedicated reference layer

The MVP should standardize on a dedicated layer:

- `REFERENCE_UNDERLAY`

This layer should be visually and behaviorally special:

- not printable by default
- lockable
- hideable
- intended for reference content only

## User workflow

## Flow A: Import and calibrate a new underlay

1. User enters `Site Setup` mode.
2. User clicks `Import Underlay`.
3. App opens a file picker for supported raster formats.
4. App inserts the image at a default insertion point and reasonable initial size.
5. App assigns the image to `REFERENCE_UNDERLAY`.
6. App updates the panel status:
   - `Underlay imported. Use Scale Reference to calibrate.`
7. User clicks `Scale Reference`.
8. App prompts:
   - `Pick first reference point...`
9. User clicks point A on the underlay.
10. App prompts:
   - `Pick second reference point...`
11. User clicks point B on the underlay.
12. App opens the known-distance dialog.
13. User enters the real-world distance.
14. App rescales the underlay.
15. App redraws the canvas.
16. App updates the panel status with a summary.
17. App returns the user to normal drawing state.

## Flow B: Recalibrate an existing underlay

1. User selects `Scale Reference`.
2. User picks two reference points again.
3. User enters the known distance.
4. App rescales the underlay again.
5. If non-reference geometry would also be affected, app should warn before proceeding.

## Flow C: Hide or lock the underlay

1. User opens the reference controls in the right panel.
2. User can:
   - hide the underlay
   - show the underlay
   - lock the underlay
   - unlock the underlay
3. Underlay visibility and lock state update immediately.

## UI spec

## Mode placement

This workflow belongs primarily in:

- `Site Setup`

## Right panel section

Add a dedicated section in the planner panel:

- `Reference Underlay`

Recommended controls:

- `Import Underlay`
- `Replace Underlay`
- `Scale Reference`
- `Hide Underlay` / `Show Underlay`
- `Lock Underlay` / `Unlock Underlay`
- optional:
  - `Remove Underlay`
  - `Fit Underlay to View`

## Status text behavior

Recommended status messages:

- `No underlay imported.`
- `Underlay imported. Use Scale Reference to calibrate.`
- `Pick first reference point...`
- `Pick second reference point...`
- `Measured 50.04, known 90.04, ratio 1.7994, scaled 1 underlay`
- `Calibration canceled.`
- `Underlay locked.`
- `Underlay hidden.`

## Dialog spec

### Known-distance dialog

Fields:

- measured distance
- editable known distance

Buttons:

- `Cancel`
- `OK`

Rules:

- known distance must be positive
- non-numeric input should be rejected with a clear message

## Data / state model

For MVP, track at least:

- underlay file path
- underlay layer name
- insertion point
- display width
- display height
- lock state
- visible state
- last successful calibration ratio
- last known-distance value

Recommended project-level metadata:

- `referenceUnderlay.filePath`
- `referenceUnderlay.layerName`
- `referenceUnderlay.insertionPoint`
- `referenceUnderlay.width`
- `referenceUnderlay.height`
- `referenceUnderlay.visible`
- `referenceUnderlay.locked`
- `referenceUnderlay.lastCalibrationRatio`
- `referenceUnderlay.lastKnownDistance`

## Layer behavior

The `REFERENCE_UNDERLAY` layer should default to:

- visible
- locked after calibration
- non-printing by default if technically practical in the MVP path

Recommended rule:

- imported underlay starts unlocked so it can be checked or repositioned
- after successful calibration, prompt or auto-lock it

## Calibration behavior

## MVP calibration target

For the first real product pass, calibration should primarily affect:

- the underlay image
- temporary reference marks or helper lines on the reference layer

It should not quietly scale finalized design objects on normal drawing layers unless the user explicitly confirms that behavior.

## Recommended guardrail

If design geometry exists outside the reference layer, show a confirmation such as:

`This calibration will also affect existing drawing geometry. Continue?`

## Accuracy expectation

MVP target:

- accurate enough for residential site and concept planning work
- repeatable from the same two reference points

This does not need to claim survey-grade precision beyond the source image quality.

## Error handling

The MVP should handle:

- user cancels file picker
- unsupported file type
- broken or unreadable image file
- user cancels during point picking
- user cancels known-distance dialog
- invalid known distance
- missing underlay when trying to calibrate

User-facing behavior should stay simple and specific.

Examples:

- `Underlay import canceled.`
- `Could not open that image file.`
- `Enter a positive known distance.`
- `No underlay found to calibrate.`

## Acceptance criteria

The workflow is MVP-ready when all of these are true:

- user can import a raster underlay from the UI
- imported underlay appears in the drawing canvas
- imported underlay is assigned to `REFERENCE_UNDERLAY`
- user can pick two points on the underlay
- known-distance dialog appears after the second click
- entering a different known distance visibly rescales the underlay
- layer controls can hide and lock the underlay
- status text confirms the result
- reopening the project preserves underlay placement and calibration state

## Non-goals for this workflow

This workflow does not need to solve:

- general-purpose image editing
- OCR
- vector cleanup from scans
- automatic line extraction from raster plans
- rotation correction from arbitrary skewed scans

## Recommended implementation order

### Phase 1

- import raster underlay
- assign it to `REFERENCE_UNDERLAY`
- display it reliably

### Phase 2

- implement two-point calibration UI
- show measured-distance dialog
- rescale the underlay

### Phase 3

- add underlay lock / hide controls
- improve status feedback
- add confirmation guardrail for non-reference geometry

### Phase 4

- persist underlay metadata in the app project format
- reopen calibrated underlays cleanly

### Phase 5

- add polish:
  - replace underlay
  - remove underlay
  - optional fade / opacity
  - optional fit-to-view

## Open follow-up questions

1. Should the first MVP auto-lock the underlay immediately after calibration, or ask the user?
2. Should the first MVP allow only one active underlay per project, or allow multiple with one marked active?
3. Should recalibration be blocked once design geometry exists, or simply confirmed with a warning?
4. Should PDF import be a direct next step after raster, or wait until after project persistence is solid?

## Recommendation

Treat this workflow as a `P1 MVP path` and move it out of feasibility status.

The platform question is sufficiently answered.

The next work here is product hardening:

- safer calibration scope
- cleaner underlay controls
- project persistence
- better user messaging
