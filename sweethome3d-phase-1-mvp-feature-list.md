# Sweet Home 3D Phase 1 MVP Feature List

Date: August 14, 2026

## Goal

Define a focused Phase 1 MVP for a `Sweet Home 3D`-based 2D architectural and landscape planning app.

This MVP is based on the current product direction:

- 2D-first workflow
- easy object-based editing
- home design plus landscape/site planning
- ease of use prioritized over CAD purity

It also assumes the pivot strategy documented in:

- [sweethome3d-pivot-architecture-phase-1.md](/Users/billfranklin/Documents/ChatGPT/Architecture Landscape CAD App/sweethome3d-pivot-architecture-phase-1.md)
- [sweethome3d-ui-customization-boundary-map.md](/Users/billfranklin/Documents/ChatGPT/Architecture Landscape CAD App/sweethome3d-ui-customization-boundary-map.md)
- [sweethome3d-pivot-execution-plan.md](/Users/billfranklin/Documents/ChatGPT/Architecture Landscape CAD App/sweethome3d-pivot-execution-plan.md)

## MVP Product Statement

Phase 1 should deliver:

- a simpler 2D planning product built on `Sweet Home 3D`
- smart architectural object editing for walls, doors, and windows
- enough landscape planning support to create believable site and planting plans
- printable black-and-white and color plan output

It should not yet try to be:

- a full CAD replacement
- a permit-grade documentation suite
- a full landscape architecture platform
- a deeply customized shell rewrite

## Phase 1 Core User Outcomes

By the end of Phase 1, a user should be able to:

1. Start a new project and set up a scaled reference.
2. Draw a simple house or building plan using wall-based objects.
3. Place and adjust doors and windows as hosted objects.
4. Create basic site / landscape areas such as beds, lawn, patios, and hardscape zones.
5. Place plants and outdoor objects from organized libraries.
6. Control plan visibility with named level-like groups.
7. Add labels and dimensions.
8. Produce both a black-and-white draft plan and a color presentation plan.
9. Generate a simple plant / object legend or schedule.

## Must-Have Features

### 1. Project setup

- New project
- Background image / underlay import
- Known-distance scale calibration
- Basic unit selection
- Named level / visibility-group setup

Why it matters:

- this is the foundation for tracing and plan accuracy

### 2. Building drawing

- Wall drawing
- Wall editing
- Hosted door placement
- Hosted window placement
- Door / window repositioning
- Door / window resizing
- Door swing flipping where applicable
- Interior and exterior wall support

Why it matters:

- this is the strongest built-in value of the `Sweet Home 3D` foundation

### 3. Area-based outdoor planning

- Basic patio / hardscape areas
- Basic planting-bed areas
- Basic lawn / open-area zones
- Fill / texture assignment for outdoor areas

Why it matters:

- the app must support more than just a house footprint

### 4. Object libraries

- Doors library
- Windows library
- Plants library
- Outdoor objects library
- Organized categories for browsing
- Selection and placement workflow that feels object-first

Why it matters:

- the app is intended to be driven heavily by object libraries, not manual drafting only

### 5. Plant / outdoor object support

- Top-down symbolic plant representation
- Object metadata for plants
- At minimum:
  - plant name
  - category
  - countable instance identity
- Simple outdoor objects such as:
  - benches
  - tables
  - grill / outdoor living symbols

Why it matters:

- landscape planning needs recognizable, reusable 2D content

### 6. Visibility control

- Named levels used as flat visibility groups
- Visible / hidden control
- Viewable control where useful
- Simple reference-content protection behavior

Why it matters:

- users need practical plan organization, even if full CAD layers are deferred

### 7. Annotation

- Labels
- Text notes
- Dimension lines
- Basic callout support

Why it matters:

- plans must communicate clearly, not only display objects

### 8. Output

- Black-and-white printable plan output
- Color printable plan output
- PDF output
- SVG output if viable enough in the pivot validation

Why it matters:

- output quality is part of the product value, not an afterthought

### 9. Schedule / legend

- Simple plant schedule or object legend
- Group by plant / object identity
- Count quantities automatically

Why it matters:

- this is one of the strongest specialized differentiators for the landscape side of the product

## Should-Have Features if Phase 1 Allows

These are highly desirable, but they should not delay the core MVP if they create too much technical drag.

### 1. Better 2D rendering for landscape objects

- improved hedge appearance
- improved canopy graphics
- better outdoor textures

### 2. Cleaner contextual editing

- more direct object editing
- more focused inspector behavior
- less reliance on cluttered stock controls

### 3. Simple non-selectable / locked reference behavior

- background and reference elements should be easier to protect from accidental edits

### 4. Starter templates

- one architectural template
- one landscape/site template
- one mixed home + landscape template

## Explicit Non-Goals for Phase 1

These should be deferred unless validation unexpectedly shows they are easy.

- terrain modeling
- irrigation engineering tools
- advanced CAD layer parity
- DWG-first interoperability goals
- deep shell rewrite to exactly match the HTML mockups
- highly custom 3D workflows
- BIM features
- collaboration / multi-user editing
- cloud sync
- mobile support

## Phase 1 UX Priorities

The MVP should feel:

- simpler than stock `Sweet Home 3D`
- object-first
- strongly 2D-oriented
- visually cleaner than a stock Swing planning app

The MVP does not need to:

- perfectly match the mockups yet
- hide every trace of its foundation

It only needs to feel:

- guided
- understandable
- clearly specialized for architecture + landscape planning

## Required Sample Projects for MVP Validation

Phase 1 should be considered credible only if it can recreate at least:

### Sample A: Simple house plan

- exterior walls
- interior walls
- doors
- windows
- dimensions

### Sample B: Small site / planting plan

- building outline
- patio or hardscape
- lawn or bed area
- several plants
- labels
- color presentation output

### Sample C: Mixed architecture + landscape plan

- house footprint
- doors / windows
- a few outdoor areas
- plant placements
- a generated plant / object legend

## MVP Success Criteria

Phase 1 is successful if:

1. The product feels clearly easier than the QCAD prototype for architectural object editing.
2. A user can create both a simple home plan and a simple landscape/site plan in one app.
3. The output is acceptable in both monochrome and color.
4. Library-driven placement feels central to the experience.
5. Plant / object schedule generation works at a useful basic level.
6. The app feels like a focused planning product rather than a generic home designer with no adaptation.

## Bottom Line

The `Sweet Home 3D` Phase 1 MVP should not try to solve every long-term platform issue.

It should prove one thing clearly:

- that a semantic object-based foundation can deliver a more usable 2D architectural and landscape planning experience faster than the current `QCAD` path

If that is proven, later phases can invest more confidently in:

- deeper UI customization
- stronger layer behavior
- richer landscape-native object types
- more specialized output and scheduling workflows
