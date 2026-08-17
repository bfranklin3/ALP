# QCAD-Based Landscape Planner Implementation Tickets: Underlay + Calibrate

Date: August 12, 2026
Status: Draft

## Purpose

This document breaks the successful `Import Underlay + Calibrate` MVP spec into a small, execution-ready implementation ticket set.

It is intentionally narrow.

It focuses on the next practical build work for:

- underlay controls
- recalibration guardrails
- underlay metadata persistence

## Related docs

- [qcad-landscape-planner-underlay-calibrate-mvp-spec.md](/Users/billfranklin/Documents/ChatGPT/Architecture Landscape CAD App/qcad-landscape-planner-underlay-calibrate-mvp-spec.md)
- [qcad-landscape-planner-prioritized-mvp-backlog.md](/Users/billfranklin/Documents/ChatGPT/Architecture Landscape CAD App/qcad-landscape-planner-prioritized-mvp-backlog.md)
- [qcad-landscape-planner-mvp-architecture.md](/Users/billfranklin/Documents/ChatGPT/Architecture Landscape CAD App/qcad-landscape-planner-mvp-architecture.md)
- [feasibility-findings.md](/Users/billfranklin/Documents/ChatGPT/Architecture Landscape CAD App/feasibility-findings.md)

## Scope

This ticket set assumes the spike already proved:

- raster underlay import works
- two-point calibration works
- known-distance dialog works
- underlay redraw works after calibration

This ticket set does not cover:

- PDF-specific underlay behavior
- multiple underlays per project
- opacity / fade controls
- rotation correction

## Guiding implementation rule

For MVP, underlay calibration should be treated as a `reference setup` workflow first.

The safest default is:

- calibrate the underlay
- avoid surprising changes to normal drawing geometry
- warn clearly before affecting non-reference objects

## Ticket overview

Recommended build order:

1. underlay controls
2. calibration scope guardrails
3. metadata persistence
4. reopen / restore behavior
5. workflow polish

## Ticket list

### UNDERLAY-IMP-01

- Priority: `P1`
- Summary: Build dedicated `Reference Underlay` panel controls
- Why it matters:
  - the workflow should feel intentional and easy to repeat
- Dependencies:
  - successful spike prototype
- Scope:
  - add `Import Underlay`
  - add `Replace Underlay`
  - add `Scale Reference`
  - add `Hide Underlay` / `Show Underlay`
  - add `Lock Underlay` / `Unlock Underlay`
- Acceptance criteria:
  - controls are visible in `Site Setup`
  - user can import an image underlay from the panel
  - user can hide and re-show the underlay
  - user can lock and unlock the underlay
  - panel status updates after each action

### UNDERLAY-IMP-02

- Priority: `P1`
- Summary: Normalize `REFERENCE_UNDERLAY` layer behavior
- Why it matters:
  - the underlay should behave consistently instead of like generic drawing geometry
- Dependencies:
  - `UNDERLAY-IMP-01`
- Scope:
  - ensure `REFERENCE_UNDERLAY` exists when needed
  - assign imported underlays to that layer
  - apply default layer behavior
- Acceptance criteria:
  - imported underlay always lands on `REFERENCE_UNDERLAY`
  - layer is visible by default
  - layer can be locked and hidden from the UI
  - underlay is treated as reference content, not mixed into normal drawing layers

### UNDERLAY-IMP-03

- Priority: `P1`
- Summary: Harden two-point calibration for underlay-first behavior
- Why it matters:
  - the current spike works, but the implementation should be more explicit and safer
- Dependencies:
  - `UNDERLAY-IMP-01`
  - `UNDERLAY-IMP-02`
- Scope:
  - keep the current point-pick flow
  - improve status text
  - ensure the tool exits cleanly after completion or cancel
  - ensure calibration summary clearly reports underlay impact
- Acceptance criteria:
  - point A and point B flow is repeatable
  - dialog appears reliably after second click
  - cancel exits cleanly at any step
  - success message reports measured distance, known distance, ratio, and underlay count

### UNDERLAY-IMP-04

- Priority: `P1`
- Summary: Add recalibration guardrails when non-reference geometry exists
- Why it matters:
  - recalibration can become destructive or confusing once drawing has started
- Dependencies:
  - `UNDERLAY-IMP-03`
- Scope:
  - detect geometry outside `REFERENCE_UNDERLAY`
  - warn before recalibration would affect that geometry
  - define MVP-safe default behavior
- Recommended MVP behavior:
  - if only the underlay exists, recalibrate immediately
  - if non-reference geometry exists, show a warning dialog before continuing
- Acceptance criteria:
  - warning appears when design geometry exists outside the reference layer
  - user can cancel without changing the drawing
  - user can continue intentionally if they choose
  - no silent recalibration of normal drawing geometry
- Prototype status note:
  - proven in the QCAD shell prototype on August 12, 2026
  - warning appears after point selection and known-distance confirmation, before recalibration is applied
  - `Cancel` leaves existing drawing geometry untouched
  - `Continue` applies recalibration as expected

### UNDERLAY-IMP-05

- Priority: `P1`
- Summary: Persist underlay metadata in the app project format
- Why it matters:
  - underlay workflows are not usable if the reference setup is lost on reopen
- Dependencies:
  - `PROJECT-01`
  - `UNDERLAY-IMP-02`
  - `UNDERLAY-IMP-03`
- Scope:
  - save underlay file path
  - save insertion point
  - save display width
  - save display height
  - save visible state
  - save locked state
  - save last calibration ratio
  - save last known distance
- Acceptance criteria:
  - saved project includes underlay metadata
  - project reopen restores underlay placement and scale
  - project reopen restores visible / locked state

### UNDERLAY-IMP-06

- Priority: `P1`
- Summary: Restore calibrated underlay correctly on reopen
- Why it matters:
  - persistence is only useful if restore behavior is reliable and automatic
- Dependencies:
  - `UNDERLAY-IMP-05`
- Scope:
  - reload the referenced raster file
  - restore the underlay entity or entities
  - reattach them to `REFERENCE_UNDERLAY`
  - restore lock / hide state
- Acceptance criteria:
  - reopen shows the underlay in the correct place
  - reopen preserves calibrated size
  - underlay remains usable for reference without requiring re-import

### UNDERLAY-IMP-07

- Priority: `P2`
- Summary: Add replace / remove underlay workflow polish
- Why it matters:
  - users often receive revised surveys or want to swap source images
- Dependencies:
  - `UNDERLAY-IMP-05`
- Scope:
  - replace current underlay
  - optionally remove current underlay
  - update stored metadata cleanly
- Acceptance criteria:
  - user can replace the current underlay without corrupting project state
  - old underlay does not linger unexpectedly
  - metadata updates to the new source file

### UNDERLAY-IMP-08

- Priority: `P2`
- Summary: Add optional underlay display polish
- Why it matters:
  - readability often improves when the reference is less visually heavy
- Dependencies:
  - `UNDERLAY-IMP-01`
  - `UNDERLAY-IMP-06`
- Scope:
  - optional fit-to-view helper
  - optional fade / opacity control if technically low-friction
- Acceptance criteria:
  - if implemented, controls are simple and stable
  - display polish does not break calibration or persistence

## Suggested delivery phases

### Phase A: MVP-safe controls

- `UNDERLAY-IMP-01`
- `UNDERLAY-IMP-02`
- `UNDERLAY-IMP-03`

Outcome:

- import, calibrate, hide, and lock are usable from the panel

### Phase B: Safety guardrails

- `UNDERLAY-IMP-04`

Outcome:

- recalibration behavior is less risky once drawing has started

### Phase C: Persistence

- `UNDERLAY-IMP-05`
- `UNDERLAY-IMP-06`

Outcome:

- the reference workflow survives save and reopen

### Phase D: Polish

- `UNDERLAY-IMP-07`
- `UNDERLAY-IMP-08`

Outcome:

- replacement and presentation niceties are in place

## Engineering notes

### Important implementation constraint

The spike used a practical fallback for image-entity rescaling because the QCAD JS wrapper did not reliably expose the imported image file path during recalibration.

That means production implementation should explicitly decide one of these:

1. store stronger app-owned underlay metadata and use that as the source of truth
2. find a more robust QCAD-native way to identify and reconstruct the underlay entity

For MVP, option `1` is the safer direction.

### Recommended persistence source of truth

Treat app metadata as the authoritative record for:

- underlay file path
- underlay size
- underlay insertion point
- lock / visible state
- last calibration values

Do not rely only on ad hoc entity introspection if the wrapper is inconsistent.

## QA checklist

Each ticket group should be tested against at least:

- PNG import
- JPEG import
- hide / show after calibration
- lock / unlock after calibration
- recalibration with no design geometry
- recalibration after drawing geometry exists
- save / reopen with a calibrated underlay

## Recommended immediate next ticket

Start with:

- `UNDERLAY-IMP-01`

Why:

- it converts the working spike into a clearer user-facing control surface
- it provides the base for all remaining underlay work
- it gives us a stable place to hang lock, hide, replace, and persistence behavior
