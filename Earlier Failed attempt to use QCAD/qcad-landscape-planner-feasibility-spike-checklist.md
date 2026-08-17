# QCAD-Based Landscape Planner Feasibility-Spike Checklist

Date: August 12, 2026

## Purpose

This checklist is the first execution-oriented artifact for the `Architecture Landscape CAD App` project.

Its job is to answer one core question:

Can QCAD be shaped into a simpler landscape-planning application without fighting the platform too much?

This spike should happen before deeper implementation work.

## Related planning docs

- [qcad-landscape-planner-mvp-architecture.md](/Users/billfranklin/Documents/ChatGPT/Architecture Landscape CAD App/qcad-landscape-planner-mvp-architecture.md)
- [qcad-landscape-planner-ui-wireframe-panel-spec.md](/Users/billfranklin/Documents/ChatGPT/Architecture Landscape CAD App/qcad-landscape-planner-ui-wireframe-panel-spec.md)
- [qcad-landscape-planner-library-content-spec.md](/Users/billfranklin/Documents/ChatGPT/Architecture Landscape CAD App/qcad-landscape-planner-library-content-spec.md)
- [qcad-landscape-planner-prioritized-mvp-backlog.md](/Users/billfranklin/Documents/ChatGPT/Architecture Landscape CAD App/qcad-landscape-planner-prioritized-mvp-backlog.md)

## Spike goals

The spike must prove these core assumptions:

1. QCAD can be customized into a simpler app shell.
2. We can hide or reduce enough CAD complexity.
3. We can add our own workflow modes and panels.
4. We can support underlay import and two-point scale calibration.
5. We can support custom symbol libraries and placement behavior.
6. We can export the outputs we need reliably.

## Success criteria

At the end of the spike, we should have clear answers to:

- `Yes, viable`
- `Viable with constraints`
- `Not viable without major compromise`

This should be based on working prototypes, not just documentation reading.

## Deliverables

The spike should produce:

- a short findings document
- screenshots or screen recordings
- a list of blockers
- a go / no-go recommendation
- a revised risk list if needed

## Timebox

Recommended timebox:

- `5 to 8 working days`

Avoid turning the spike into implementation.

## Checklist

## A. Environment and foundation

### A1. Confirm QCAD build and extension strategy

- [ ] Identify the exact QCAD edition and version to target for the spike
- [ ] Confirm whether the spike will use:
  - QCAD Community Edition source
  - scripting only
  - scripting plus plugin code
- [ ] Confirm the local development setup needed to run and test customizations

Evidence to capture:

- version details
- startup method
- where custom scripts/plugins live

### A2. Document customization boundaries

- [ ] Identify what parts of QCAD are script-customizable
- [ ] Identify what likely requires deeper plugin or source changes
- [ ] Identify what appears hard or risky to customize cleanly

Evidence to capture:

- notes on menus
- notes on docks/panels
- notes on command integration

## B. App shell feasibility

### B1. Simplified shell proof

- [ ] Prove we can launch QCAD in a branded or reduced shell
- [ ] Prove we can suppress or reduce non-essential menus
- [ ] Prove we can add a custom top-level entry point for the app workflow

Success test:

- a screenshot or working prototype where QCAD no longer feels like untouched stock CAD

### B2. Main workspace structure

- [ ] Prove we can support the intended workspace layout:
  - top app bar
  - left tool rail
  - right sidebar
  - bottom status bar
- [ ] Prove a custom panel/dock can be rendered for app-specific UI

Success test:

- a minimal shell mockup running inside or around QCAD

### B3. Guided mode switching

- [ ] Implement a rough segmented control or equivalent for:
  - Site Setup
  - Hardscape
  - Planting
  - Annotate
  - Output
- [ ] Prove mode switching can change visible tool choices or active UI
- [ ] Confirm mode switching does not reset zoom or drawing state

Success test:

- switching modes visibly changes the workspace emphasis

## C. Drawing workflow feasibility

### C1. Underlay import

- [ ] Prove an image or PDF can be imported as a usable reference underlay
- [ ] Prove the underlay can be positioned and locked
- [ ] Prove the underlay can live on a reference layer

Success test:

- user can place a reference underlay and keep it from interfering with drawing

### C2. Two-point scale calibration

- [ ] Prototype the user flow:
  - click point A
  - click point B
  - enter real-world distance
  - apply calibrated scale
- [ ] Verify resulting measurements are accurate enough for plan work

Success test:

- a known distance measures correctly after calibration

### C3. Core drawing tools

- [ ] Verify the baseline tools we need are usable in a simplified workflow:
  - polyline
  - rectangle
  - arc
  - offset
  - trim
- [ ] Verify snap and grid controls can be exposed simply

Success test:

- produce a small test drawing with property lines, a building edge, and a bed shape

## D. Building and wall feasibility

### D1. Building-edge workflow

- [ ] Prove building outlines can be drawn in a user-friendly way
- [ ] Confirm we can wrap or simplify the workflow around QCAD geometry tools

Success test:

- draw a basic house footprint without requiring deep CAD knowledge

### D2. Wall behavior

- [ ] Prototype wall creation with explicit thickness
- [ ] Confirm wall thickness can vary per wall
- [ ] Confirm walls can support:
  - outline color
  - fill style
  - fill color
  - phase/status

Success test:

- produce one `Existing` wall style and one `Proposed` wall style

### D3. Openings

- [ ] Prove door opening placement is feasible
- [ ] Prove window opening placement is feasible
- [ ] Confirm openings can align to walls or building edges

Success test:

- simple top-down residential wall segment with openings

## E. Layers and properties feasibility

### E1. Layer controls

- [ ] Verify we can expose layer controls simply:
  - active
  - visible
  - locked
  - printable
- [ ] Verify drag reordering is possible or determine an acceptable fallback

Success test:

- a simplified Layers panel concept is technically feasible

### E2. Combined Properties panel

- [ ] Prove a context-sensitive properties area is feasible
- [ ] Verify it can show different fields for:
  - geometry
  - walls
  - symbols
- [ ] Verify empty-state tool defaults can be shown

Success test:

- selection changes the visible property fields

## F. Library and symbol feasibility

### F1. Library browser

- [ ] Prove a custom library panel can show symbol thumbnails
- [ ] Prove symbols can be grouped by category
- [ ] Verify there is a path to built-in and user-created categories

Success test:

- a minimal library panel with at least one category and several test symbols

### F2. Symbol model

- [ ] Prove a symbol can carry app-specific metadata:
  - Width
  - Depth
  - rotation
  - variant
  - common name
  - botanical name
  - plant code
- [ ] Determine whether metadata should live in DXF-linked entities, sidecar files, or both

Success test:

- one placed symbol can be saved and reopened with metadata intact

### F3. Placement interaction

- [ ] Test drag-and-drop placement feasibility
- [ ] Test click-to-place fallback feasibility
- [ ] Confirm a placement preview can show size and rotation

Success test:

- place at least one tree symbol and adjust its Width/Depth

### F4. User-imported content

- [ ] Determine the easiest path to import:
  - individual symbols
  - symbol packs
- [ ] Confirm user-created categories are technically practical

Success test:

- import one custom symbol into a custom category

## G. Output feasibility

### G1. Draft vs presentation mode

- [ ] Prove a project-wide output mode can be stored
- [ ] Prove the output mode can affect styling without changing core geometry

Success test:

- same drawing renders in a rough draft style and a richer presentation style

### G2. Export pipeline

- [ ] Verify export to PDF
- [ ] Verify export to DXF
- [ ] Verify export to SVG

Success test:

- one test drawing successfully exports in all three formats

### G3. Print framing

- [ ] Confirm there is a workable path to print preview and title block support
- [ ] Confirm sheet framing is not unusually hard to control

Success test:

- one drawing can be previewed in a sheet-like format

## H. Content pipeline feasibility

### H1. Symbol asset pipeline

- [ ] Confirm practical asset formats for the starter library
- [ ] Test one monochrome symbol and one color variant
- [ ] Confirm thumbnails can be generated or stored simply

Success test:

- one logical symbol with:
  - mono asset
  - color asset
  - thumbnail
  - metadata

### H2. Fill and hatch pipeline

- [ ] Confirm arbitrary closed shapes can receive useful fills
- [ ] Test a mulch or gravel fill
- [ ] Test readability in a monochrome output

Success test:

- filled hardscape or bed area stays readable with labels nearby

## I. Sample workflow proof

### I1. Recreate a minimal representative plan

- [ ] Import a reference
- [ ] Calibrate scale
- [ ] Draw lot boundary
- [ ] Draw a simple building edge
- [ ] Draw one walkway or patio
- [ ] Fill one bed or hardscape zone
- [ ] Place a few plant symbols
- [ ] Add one label and one dimension
- [ ] Export a PDF

Success test:

- a rough but complete plan can be produced end to end

## Findings template

For each major area, record:

- `Worked well`
- `Worked with friction`
- `Blocked`
- `Unknown`

Use that structure for:

- shell
- drawing
- walls
- layers
- symbols
- export
- content

## Go / no-go decision rubric

### Go

Choose `Go` if:

- app shell customization is clearly feasible
- two-point scaling works reliably
- symbol workflow is workable
- export pipeline is solid
- no blocker appears likely to require a CAD-engine rewrite

### Go with constraints

Choose `Go with constraints` if:

- the direction still works
- but major compromises are needed, such as:
  - less UI simplification than hoped
  - weaker drag-and-drop behavior
  - limited wall intelligence
  - a more conservative content workflow

### No-go

Choose `No-go` if:

- core UI simplification is not realistically achievable
- underlay calibration is unreliable
- symbol metadata cannot be managed cleanly
- export behavior is too fragile
- QCAD integration requires excessive deep forking too early

## Recommended outputs after the spike

At the end of the spike, create:

1. `feasibility-findings.md`
2. `qcad-customization-risks.md`
3. updated recommendations for the MVP backlog if needed

## Suggested next step after this checklist

If the spike is successful, the next artifact should be:

- Phase A and Phase B engineering tickets based on the prioritized backlog
