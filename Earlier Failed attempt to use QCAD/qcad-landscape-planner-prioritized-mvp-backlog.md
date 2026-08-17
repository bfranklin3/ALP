# QCAD-Based Landscape Planner Prioritized MVP Backlog

Date: August 12, 2026

## Purpose

This document converts the architecture, UI, and content plans into a prioritized MVP backlog.

It is intended to answer:

- what we need to build
- what order we should build it in
- what is truly required for MVP
- what can wait until later

This is a product and engineering backlog, not a sprint plan.

## Source documents

This backlog is based on:

- [qcad-landscape-planner-mvp-architecture.md](/Users/billfranklin/Documents/ChatGPT/Architecture Landscape CAD App/qcad-landscape-planner-mvp-architecture.md)
- [qcad-landscape-planner-ui-wireframe-panel-spec.md](/Users/billfranklin/Documents/ChatGPT/Architecture Landscape CAD App/qcad-landscape-planner-ui-wireframe-panel-spec.md)
- [qcad-landscape-planner-library-content-spec.md](/Users/billfranklin/Documents/ChatGPT/Architecture Landscape CAD App/qcad-landscape-planner-library-content-spec.md)
- [qcad-landscape-planner-underlay-calibrate-mvp-spec.md](/Users/billfranklin/Documents/ChatGPT/Architecture Landscape CAD App/qcad-landscape-planner-underlay-calibrate-mvp-spec.md)
- [qcad-landscape-planner-underlay-calibrate-implementation-tickets.md](/Users/billfranklin/Documents/ChatGPT/Architecture Landscape CAD App/qcad-landscape-planner-underlay-calibrate-implementation-tickets.md)
- [qcad-ui-interaction-refinement-note-2026-08-13.md](/Users/billfranklin/Documents/ChatGPT/Architecture Landscape CAD App/qcad-ui-interaction-refinement-note-2026-08-13.md)

## How to read this backlog

### Priority levels

- `P0`: must be proven or built first; blocks the product
- `P1`: must ship in MVP
- `P2`: important polish or scope-extending work; ship only if time allows
- `P3`: post-MVP or exploratory

### Status intent

This document assumes all items are future work.

### Item structure

Each backlog item includes:

- ID
- priority
- summary
- why it matters
- dependencies
- acceptance criteria

## MVP definition

The MVP is successful if a user can:

1. Start a new project from a template
2. Import a site or house reference
3. Calibrate scale from two known points
4. Draw property lines, building edges, beds, walks, patios, and walls
5. Manage layers with show, hide, lock, and print controls
6. Place plant and architectural symbols from libraries
7. Edit symbol size, rotation, and basic metadata
8. Add labels, callouts, and dimensions
9. Switch between draft and presentation output styles
10. Export a black-and-white plan and a color plan as PDF

## Out of scope for MVP

- 3D
- grading / terrain
- irrigation
- cloud sync
- collaboration
- mobile
- permit-grade construction documentation
- full schedule generation
- region-specific plant packs

## Dependency overview

The critical dependency chain is:

1. QCAD shell feasibility
2. Simplified workspace shell
3. Project file structure
4. Underlay import and scale calibration
5. Core drawing tools and layers
6. Wall and hardscape behaviors
7. Library browser and symbol placement
8. Combined Properties panel
9. Output modes and export
10. Content starter pack and QA

If any of steps 1 to 5 fail, the product direction should be re-evaluated early.

## Workstreams

The backlog is grouped into these workstreams:

- Foundation
- Project Model
- Drawing Core
- Building and Site Features
- Layers and Properties
- Libraries and Symbols
- Annotation
- Output
- Content
- QA and Hardening

## P0 backlog

### FOUNDATION-01

- Priority: `P0`
- Summary: Validate QCAD customization strategy
- Why it matters: the whole product depends on shaping QCAD into a simplified landscape-planner shell
- Dependencies: none
- Acceptance criteria:
  - QCAD can launch with a custom shell or startup profile
  - non-essential menus can be hidden or reduced
  - a custom panel or dock can be added
  - a custom command can be wired into the UI

### FOUNDATION-02

- Priority: `P0`
- Summary: Prove custom mode switching in the workspace
- Why it matters: the guided workflow depends on switching tools and panel emphasis by mode
- Dependencies: `FOUNDATION-01`
- Acceptance criteria:
  - a visible segmented mode control exists
  - switching modes updates visible tools
  - switching modes does not reset zoom or drawing state

### FOUNDATION-03

- Priority: `P0`
- Summary: Prove custom library panel integration
- Why it matters: symbol-driven workflow is central to the product
- Dependencies: `FOUNDATION-01`
- Acceptance criteria:
  - a custom library panel can render in the workspace
  - the panel can display categories and thumbnails
  - selecting an item can invoke a placement action

### FOUNDATION-04

- Priority: `P0`
- Summary: Prove export pipeline viability
- Why it matters: the app must produce usable plan outputs from day one
- Dependencies: `FOUNDATION-01`
- Acceptance criteria:
  - one test drawing exports successfully to PDF
  - one test drawing exports successfully to DXF
  - one test drawing exports successfully to SVG

## P1 backlog

## Foundation and shell

### FOUNDATION-05

- Priority: `P1`
- Summary: Build the simplified main workspace shell
- Why it matters: this is the user-facing frame for the whole app
- Dependencies: `FOUNDATION-01`, `FOUNDATION-02`
- Acceptance criteria:
  - top app bar exists
  - left tool rail exists
  - right sidebar with tabbed panels exists
  - bottom status bar exists

### FOUNDATION-06

- Priority: `P1`
- Summary: Build the launch screen
- Why it matters: reduces CAD intimidation and supports template-based starts
- Dependencies: `FOUNDATION-05`
- Acceptance criteria:
  - user can create a blank project
  - user can create from template
  - user can open recent projects
  - sample project entry point exists

## Project model

### PROJECT-01

- Priority: `P1`
- Summary: Implement app-specific project package format
- Why it matters: DXF alone is not enough for smart symbols, variants, and app metadata
- Dependencies: `FOUNDATION-01`
- Acceptance criteria:
  - project saves as a stable app package format
  - package includes drawing data and app metadata
  - project can be reopened with no loss of core state

### PROJECT-02

- Priority: `P1`
- Summary: Add project settings for units, scale, and page defaults
- Why it matters: every drawing depends on clear units and scale behavior
- Dependencies: `PROJECT-01`
- Acceptance criteria:
  - user can choose feet/inches, decimal feet, or metric
  - project stores drawing scale
  - project stores page size and output defaults

### PROJECT-03

- Priority: `P1`
- Summary: Create starter templates
- Why it matters: templates reduce setup friction and help non-CAD users
- Dependencies: `PROJECT-02`
- Acceptance criteria:
  - blank sheet template exists
  - small lot template exists
  - corner lot template exists
  - templates pre-load layer presets and basic output defaults

## Drawing core

### UNDERLAY-01

- Priority: `P1`
- Summary: Import reference underlay
- Why it matters: users will often start from an existing plan, scan, or PDF
- Dependencies: `PROJECT-01`, `FOUNDATION-05`
- Acceptance criteria:
  - image or PDF underlay can be imported
  - underlay can be positioned
  - underlay can be assigned to the Reference layer
  - underlay can be locked

### UNDERLAY-02

- Priority: `P1`
- Summary: Add two-point scale calibration
- Why it matters: accurate scale is essential for reliable drawing and measurement
- Dependencies: `UNDERLAY-01`
- Acceptance criteria:
  - user can click point A and point B on the underlay
  - user can enter real-world distance
  - drawing scale calibrates correctly
  - resulting measurements are consistent

### DRAW-01

- Priority: `P1`
- Summary: Implement core geometry tools
- Why it matters: these tools form the base of site and hardscape drawing
- Dependencies: `FOUNDATION-05`
- Acceptance criteria:
  - line or polyline works
  - rectangle works
  - arc works
  - offset works
  - trim works

### DRAW-02

- Priority: `P1`
- Summary: Implement snap and grid controls
- Why it matters: precision must remain accessible without overwhelming the user
- Dependencies: `DRAW-01`
- Acceptance criteria:
  - snap toggle exists
  - grid toggle exists
  - visible snap feedback exists
  - status bar reflects current snap mode

### DRAW-03

- Priority: `P1`
- Summary: Implement measurement and dimensioning baseline
- Why it matters: users need to verify geometry and annotate drawings
- Dependencies: `UNDERLAY-02`, `DRAW-01`
- Acceptance criteria:
  - distance measuring tool works
  - basic dimensions can be placed
  - dimensions retain correct scale behavior

## Building and site features

### BUILDING-00

- Priority: `P1`
- Summary: Implement Building-mode command strip entry pattern
- Why it matters: the newer MVP interaction model depends on simple top-strip entry points rather than technical command names
- Dependencies: `FOUNDATION-03`
- Acceptance criteria:
  - Building mode exposes `Walls`, `Doors`, and `Windows` in the top command strip
  - `Walls` launches the wall drawing workflow
  - `Doors` and `Windows` can focus the matching architectural library section
  - anchored subtype pickers can be opened from these command-strip entry points
  - the command strip does not grow into a crowded symbol toolbar
  - broader symbol browsing remains in the library panel

### BUILDING-01

- Priority: `P1`
- Summary: Implement Walls tool
- Why it matters: house shells, interior partitions, and related built geometry are part of the core output
- Dependencies: `DRAW-01`, `BUILDING-00`
- Acceptance criteria:
  - user can draw walls with one tool
  - the same tool supports both exterior and interior walls
  - resulting geometry respects active layer and style
  - wall drawing behavior aligns with the preferred live-preview direction documented in the UI notes

### BUILDING-02

- Priority: `P1`
- Summary: Implement Offset Wall tool
- Why it matters: users need easier building and wall drafting than raw CAD offsets
- Dependencies: `BUILDING-01`
- Acceptance criteria:
  - user can create walls with explicit thickness
  - thickness can vary by wall
  - wall geometry remains editable

### BUILDING-03

- Priority: `P1`
- Summary: Implement hosted Doors and Windows workflow
- Why it matters: basic residential top-view drawing depends on architectural objects that feel easier than manual CAD openings
- Dependencies: `BUILDING-00`, `BUILDING-01`, `LIBRARY-03`, `LIBRARY-04`
- Acceptance criteria:
  - user can place hosted doors on walls
  - user can place hosted windows on walls
  - openings align to host walls automatically
  - hosted objects stay linked to the wall after placement
  - width changes update the opening behavior correctly

### BUILDING-04

- Priority: `P1`
- Summary: Implement wall style properties
- Why it matters: existing vs proposed walls and hollow vs filled walls are important use cases
- Dependencies: `BUILDING-02`, `PROPERTIES-01`
- Acceptance criteria:
  - walls support thickness
  - walls support outline color
  - walls support fill style
  - walls support fill color
  - walls support phase/status values:
    - `Existing`
    - `Proposed`
    - `Removal / Demo`

### BUILDING-05

- Priority: `P1`
- Summary: Implement anchored subtype pickers for Walls, Doors, and Windows
- Why it matters: users need fast access to common wall, door, and window variants without leaving the main drawing flow
- Dependencies: `BUILDING-00`, `BUILDING-01`, `BUILDING-03`
- Acceptance criteria:
  - `Walls` can show wall-style choices through a small anchored picker
  - `Doors` can show common door-type choices through a small anchored picker
  - `Windows` can show common window-type choices through a small anchored picker
  - anchored pickers behave like lightweight dropdowns or popovers, not large modal windows
  - picker selections affect the next placement or drawing action predictably

### HARDSCAPE-01

- Priority: `P1`
- Summary: Implement bed, walkway, patio, driveway, and wall/edging drawing workflow
- Why it matters: this is core to site-plan production
- Dependencies: `DRAW-01`
- Acceptance criteria:
  - user can draw beds
  - user can draw walkways
  - user can draw patios
  - user can draw driveways
  - user can draw wall or edging geometry

### HARDSCAPE-02

- Priority: `P1`
- Summary: Implement hatch and fill application for arbitrary closed shapes
- Why it matters: mulch, gravel, lawn, pavers, and concrete are essential output elements
- Dependencies: `HARDSCAPE-01`
- Acceptance criteria:
  - fills can be applied to arbitrary closed shapes
  - fills work with polygons and curved outlines
  - fills remain readable in draft output

## Layers and properties

### LAYERS-01

- Priority: `P1`
- Summary: Implement default layer preset
- Why it matters: layers are a required workflow foundation
- Dependencies: `PROJECT-02`
- Acceptance criteria:
  - default layers exist:
    - Reference
    - Property
    - House
    - Hardscape
    - Planting Beds
    - Trees
    - Shrubs
    - Accents
    - Groundcover
    - Labels
    - Dimensions
    - Title Block

### LAYERS-02

- Priority: `P1`
- Summary: Implement Layers panel controls
- Why it matters: layer visibility and locking are required user features
- Dependencies: `LAYERS-01`, `FOUNDATION-05`
- Acceptance criteria:
  - set active layer
  - show/hide layer
  - lock/unlock layer
  - print on/off layer
  - drag reorder layers

### PROPERTIES-01

- Priority: `P1`
- Summary: Implement combined context-sensitive Properties panel
- Why it matters: users need one coherent place to edit geometry, wall, and symbol properties
- Dependencies: `FOUNDATION-05`
- Acceptance criteria:
  - geometry selection shows geometry properties
  - wall selection shows wall properties
  - plant selection shows plant and symbol properties
  - empty state shows active tool defaults

### PROPERTIES-02

- Priority: `P1`
- Summary: Implement lightweight plant metadata exposure with progressive disclosure
- Why it matters: plant information should be useful without cluttering the panel
- Dependencies: `PROPERTIES-01`, `LIBRARY-04`
- Acceptance criteria:
  - always-visible plant fields exist:
    - Name
    - Category
    - Layer
    - Width
    - Depth
    - Rotation
    - Variant
    - Common Name
    - Botanical Name
    - Plant Code
  - collapsed More Details section exists

## Libraries and symbols

### LIBRARY-01

- Priority: `P1`
- Summary: Implement built-in category model
- Why it matters: starter content and browsing depend on clear category structure
- Dependencies: `FOUNDATION-03`
- Acceptance criteria:
  - built-in categories exist:
    - Trees
    - Palms
    - Shrubs
    - Accents
    - Groundcover
    - Building / Site Features
    - Doors / Windows
    - Site Fixtures

### LIBRARY-02

- Priority: `P1`
- Summary: Implement user-created categories
- Why it matters: the system should not be limited to hard-coded starter categories
- Dependencies: `LIBRARY-01`, `PROJECT-01`
- Acceptance criteria:
  - user can create a category
  - user can rename a category
  - category persists in project or app library state

### LIBRARY-03

- Priority: `P1`
- Summary: Implement library browser UI
- Why it matters: symbol-driven workflow is central to the app
- Dependencies: `FOUNDATION-03`, `LIBRARY-01`, `BUILDING-00`
- Acceptance criteria:
  - search field exists
  - category filter exists
  - categorized browsing sections exist for broader symbol discovery
  - symbol list or grid renders thumbnails
  - architectural sections for doors and windows are visually distinct
  - command-strip `Doors` and `Windows` actions can focus the matching library sections
  - recent and favorites entry points exist or are stubbed for later

### LIBRARY-04

- Priority: `P1`
- Summary: Implement symbol definition schema
- Why it matters: size defaults, variants, and metadata all depend on a stable symbol model
- Dependencies: `PROJECT-01`
- Acceptance criteria:
  - symbol supports ID, category, tags, Width, Depth, rotation, variant refs, and metadata
  - mono and color variants stay linked under one logical symbol

### LIBRARY-05

- Priority: `P1`
- Summary: Support importing individual symbols
- Why it matters: users need to extend the library beyond shipped content
- Dependencies: `LIBRARY-02`, `LIBRARY-04`
- Acceptance criteria:
  - user can import a symbol
  - user can assign it to a category
  - thumbnail and metadata can be stored

### LIBRARY-06

- Priority: `P1`
- Summary: Support importing symbol packs
- Why it matters: scalable content expansion depends on multi-symbol imports
- Dependencies: `LIBRARY-05`
- Acceptance criteria:
  - user can import a symbol pack
  - symbols can map into one or more categories
  - imported content remains available after restart or reload

### SYMBOL-01

- Priority: `P1`
- Summary: Implement drag-and-drop placement
- Why it matters: preferred symbol placement behavior for this product
- Dependencies: `LIBRARY-03`
- Acceptance criteria:
  - symbol can be dragged from library to canvas
  - placement preview appears
  - symbol lands on the correct layer

### SYMBOL-02

- Priority: `P1`
- Summary: Implement click-to-place fallback placement
- Why it matters: backup interaction path and possible accessibility aid
- Dependencies: `LIBRARY-03`
- Acceptance criteria:
  - user can activate a symbol and place it by click

### SYMBOL-03

- Priority: `P1`
- Summary: Implement symbol placement preview and placement HUD
- Why it matters: users need confidence in size and orientation before placement
- Dependencies: `SYMBOL-01`
- Acceptance criteria:
  - ghost preview is shown
  - rotation preview is shown
  - Width x Depth appears during placement

### SYMBOL-04

- Priority: `P1`
- Summary: Implement post-placement editing for size, rotation, layer, and variant
- Why it matters: symbols must stay editable after placement
- Dependencies: `SYMBOL-01`, `PROPERTIES-01`
- Acceptance criteria:
  - Width and Depth can be edited after placement
  - rotation can be edited after placement
  - mono/color variant can be changed after placement

### SYMBOL-05

- Priority: `P1`
- Summary: Implement duplicate, replace, and duplicate-along-path actions
- Why it matters: repeated planting patterns are common in landscape plans
- Dependencies: `SYMBOL-04`
- Acceptance criteria:
  - symbol can be duplicated
  - symbol can be replaced with another symbol
  - duplicate-along-path works for common use cases

## Annotation

### ANNOTATE-01

- Priority: `P1`
- Summary: Implement text labels and notes
- Why it matters: every plan needs readable annotations
- Dependencies: `FOUNDATION-05`
- Acceptance criteria:
  - user can place text labels
  - user can place generic notes

### ANNOTATE-02

- Priority: `P1`
- Summary: Implement leader callouts
- Why it matters: plant labels and hardscape labels depend on leader-based callouts
- Dependencies: `ANNOTATE-01`
- Acceptance criteria:
  - callout text can attach to target geometry or symbols

### ANNOTATE-03

- Priority: `P1`
- Summary: Implement plant tag and count workflow
- Why it matters: plant counts are part of the sample deliverables
- Dependencies: `SYMBOL-04`, `ANNOTATE-02`
- Acceptance criteria:
  - plant count can be shown for selected groupings
  - plant tags can reference symbol metadata

### ANNOTATE-04

- Priority: `P1`
- Summary: Implement north arrow and scale note helpers
- Why it matters: common sheet elements improve output usability
- Dependencies: `OUTPUT-01`
- Acceptance criteria:
  - north arrow can be placed
  - scale note can be inserted or auto-generated

## Output

### OUTPUT-01

- Priority: `P1`
- Summary: Implement project-wide draft vs presentation output mode
- Why it matters: the app must support black-and-white and color output from the same project
- Dependencies: `PROJECT-02`, `PROPERTIES-01`
- Acceptance criteria:
  - project stores a global output mode
  - user can toggle Draft and Presentation modes
  - toggle affects preview styling without changing underlying geometry

### OUTPUT-02

- Priority: `P1`
- Summary: Implement output panel
- Why it matters: export should be understandable and visual
- Dependencies: `OUTPUT-01`, `FOUNDATION-05`
- Acceptance criteria:
  - output panel shows mode, page size, orientation, and export actions

### OUTPUT-03

- Priority: `P1`
- Summary: Implement PDF export for MVP deliverables
- Why it matters: this is the main client-facing output
- Dependencies: `OUTPUT-02`, `ANNOTATE-01`, `HARDSCAPE-02`
- Acceptance criteria:
  - draft PDF exports cleanly
  - presentation PDF exports cleanly

### OUTPUT-04

- Priority: `P1`
- Summary: Implement DXF export
- Why it matters: interoperability with CAD workflows is valuable even in MVP
- Dependencies: `OUTPUT-02`
- Acceptance criteria:
  - DXF export preserves main geometry and layers

### OUTPUT-05

- Priority: `P1`
- Summary: Implement SVG export
- Why it matters: vector reuse and future web or design workflow compatibility
- Dependencies: `OUTPUT-02`
- Acceptance criteria:
  - SVG export succeeds for typical plans

### OUTPUT-06

- Priority: `P1`
- Summary: Implement print preview and title block baseline
- Why it matters: print quality and sheet framing matter for plan delivery
- Dependencies: `OUTPUT-02`
- Acceptance criteria:
  - print preview exists
  - one standard title block option exists

## Content

### CONTENT-01

- Priority: `P1`
- Summary: Build starter tree pack
- Why it matters: trees are highest-value symbols for the sample plans
- Dependencies: `LIBRARY-04`
- Acceptance criteria:
  - 18 to 24 tree symbols exist
  - each has thumbnail
  - each has Width and Depth defaults
  - mono and color variants exist where practical

### CONTENT-02

- Priority: `P1`
- Summary: Build starter shrub pack
- Why it matters: shrubs are the second-most important planting content set
- Dependencies: `LIBRARY-04`
- Acceptance criteria:
  - 12 to 18 shrub symbols exist
  - hedge modules are included

### CONTENT-03

- Priority: `P1`
- Summary: Build starter hardscape fill pack
- Why it matters: fills are necessary for mulch, gravel, lawn, pavers, and concrete
- Dependencies: `HARDSCAPE-02`
- Acceptance criteria:
  - mulch, gravel, lawn, pavers, and concrete fills exist
  - each has draft and presentation behavior

### CONTENT-04

- Priority: `P1`
- Summary: Build starter hardscape module pack
- Why it matters: a small set of reusable modules strengthens presentation output
- Dependencies: `LIBRARY-04`
- Acceptance criteria:
  - stepping stones, edging, and basic paver modules exist

### CONTENT-05

- Priority: `P1`
- Summary: Build starter doors and windows pack
- Why it matters: building-related drawing requires a basic architectural symbol set
- Dependencies: `LIBRARY-04`
- Acceptance criteria:
  - at least 8 to 12 total door/window symbols exist

### CONTENT-06

- Priority: `P1`
- Summary: Build starter site fixtures pack
- Why it matters: fixtures such as AC units and rain barrels support realistic plans
- Dependencies: `LIBRARY-04`
- Acceptance criteria:
  - core fixture symbols exist:
    - AC unit
    - rain barrel
    - mailbox
    - planter
    - light bollard
    - utility box

## P2 backlog

### FOUNDATION-07

- Priority: `P2`
- Summary: Add an Advanced menu or expert tools area
- Why it matters: keeps the default workflow simple while preserving deeper capabilities
- Dependencies: `FOUNDATION-05`

### PROJECT-04

- Priority: `P2`
- Summary: Support more template presets
- Why it matters: improves onboarding for more lot types
- Dependencies: `PROJECT-03`

### LAYERS-03

- Priority: `P2`
- Summary: Support custom saved layer presets
- Why it matters: repeated project types can benefit from reusable layer stacks
- Dependencies: `LAYERS-02`

### LIBRARY-07

- Priority: `P2`
- Summary: Add favorites and recent symbol behavior
- Why it matters: speeds up repeated workflows
- Dependencies: `LIBRARY-03`

### SYMBOL-06

- Priority: `P2`
- Summary: Improve inline size editing during placement
- Why it matters: placement becomes more precise and efficient
- Dependencies: `SYMBOL-03`

### ANNOTATE-05

- Priority: `P2`
- Summary: Add automatic plant legend prototype
- Why it matters: reduces manual documentation work
- Dependencies: `ANNOTATE-03`, `LIBRARY-04`

### OUTPUT-07

- Priority: `P2`
- Summary: Add PNG export
- Why it matters: useful for email, web, and presentation sharing
- Dependencies: `OUTPUT-02`

### OUTPUT-08

- Priority: `P2`
- Summary: Add JPG export
- Why it matters: secondary raster export option
- Dependencies: `OUTPUT-02`

### CONTENT-07

- Priority: `P2`
- Summary: Build starter palm and accent packs
- Why it matters: broadens landscaping vocabulary
- Dependencies: `LIBRARY-04`

### CONTENT-08

- Priority: `P2`
- Summary: Build starter groundcover pack
- Why it matters: improves planting richness and presentation value
- Dependencies: `LIBRARY-04`

## P3 backlog

### BUILDING-06

- Priority: `P3`
- Summary: Consider a dedicated Building mode
- Why it matters: may improve clarity if building tools grow beyond current scope
- Dependencies: validated MVP usage

### HEDGE-01

- Priority: `P3`
- Summary: Implement true path-based hedge objects
- Why it matters: better hedge workflows than repeated symbols alone
- Dependencies: `SYMBOL-05`

### OUTPUT-09

- Priority: `P3`
- Summary: Support per-sheet output mode
- Why it matters: more flexible output control for advanced workflows
- Dependencies: `OUTPUT-01`

### CONTENT-09

- Priority: `P3`
- Summary: Add region-specific plant packs
- Why it matters: increases real-world relevance after the core library is stable
- Dependencies: stable generic content system

### CONTENT-10

- Priority: `P3`
- Summary: Add richer decorative hardscape packs
- Why it matters: expands presentation styling
- Dependencies: validated content pipeline

## QA and hardening backlog

### QA-01

- Priority: `P1`
- Summary: Create a reference sample project for regression testing
- Why it matters: the product needs a stable benchmark drawing
- Dependencies: `PROJECT-01`
- Acceptance criteria:
  - one monochrome sample project exists
  - one color sample project exists or one project supports both modes

### QA-02

- Priority: `P1`
- Summary: Validate end-to-end recreation of the sample workflow
- Why it matters: the product should prove it can produce your target output class
- Dependencies: most P1 workstreams
- Acceptance criteria:
  - a user can recreate a representative lot plan from reference through export

### QA-03

- Priority: `P1`
- Summary: Verify output readability in draft mode
- Why it matters: monochrome output is core to the value proposition
- Dependencies: `OUTPUT-03`, `CONTENT-03`
- Acceptance criteria:
  - labels remain readable
  - fills do not overpower dimensions
  - symbol distinction remains clear

### QA-04

- Priority: `P1`
- Summary: Verify output readability in presentation mode
- Why it matters: color output is equally important
- Dependencies: `OUTPUT-03`, `CONTENT-01`, `CONTENT-02`
- Acceptance criteria:
  - plans remain legible when multiple color symbols are present
  - presentation fills do not become muddy

### QA-05

- Priority: `P1`
- Summary: Test project save and reopen reliability
- Why it matters: smart symbols and metadata cannot be fragile
- Dependencies: `PROJECT-01`, `LIBRARY-04`, `SYMBOL-04`
- Acceptance criteria:
  - no loss of symbol metadata after reopen
  - no loss of layer state after reopen
  - no loss of output mode after reopen

### QA-06

- Priority: `P2`
- Summary: Run non-CAD usability test
- Why it matters: ease of use is a core product goal
- Dependencies: core P1 workflow complete
- Acceptance criteria:
  - a non-CAD test user can complete a simple guided plan with moderate support

## Recommended implementation order

### Phase A: feasibility and shell

Build first:

- `FOUNDATION-01`
- `FOUNDATION-02`
- `FOUNDATION-03`
- `FOUNDATION-04`
- `FOUNDATION-05`
- `FOUNDATION-06`

### Phase B: project setup and base drawing

Build next:

- `PROJECT-01`
- `PROJECT-02`
- `PROJECT-03`
- `UNDERLAY-01`
- `UNDERLAY-02`
- `DRAW-01`
- `DRAW-02`
- `DRAW-03`
- `LAYERS-01`
- `LAYERS-02`

### Phase C: building interaction foundation

Build next:

- `BUILDING-00`
- `BUILDING-01`
- `LIBRARY-03`
- `BUILDING-03`
- `BUILDING-05`

Why this order:

- it establishes the `Walls / Doors / Windows` command-strip pattern first
- it proves one wall tool before hosted-object complexity is added
- it makes sure library focus behavior exists before hosted door/window placement
- it delays picker polish until the underlying wall and hosted-object flows are already real

### Phase D: building and site features expansion

Build next:

- `BUILDING-02`
- `BUILDING-04`
- `HARDSCAPE-01`
- `HARDSCAPE-02`

### Phase E: libraries and symbol workflow

Build next:

- `LIBRARY-01`
- `LIBRARY-02`
- `LIBRARY-04`
- `LIBRARY-05`
- `LIBRARY-06`
- `SYMBOL-01`
- `SYMBOL-02`
- `SYMBOL-03`
- `SYMBOL-04`
- `SYMBOL-05`
- `PROPERTIES-01`
- `PROPERTIES-02`

### Phase F: annotation and output

Build next:

- `ANNOTATE-01`
- `ANNOTATE-02`
- `ANNOTATE-03`
- `ANNOTATE-04`
- `OUTPUT-01`
- `OUTPUT-02`
- `OUTPUT-03`
- `OUTPUT-04`
- `OUTPUT-05`
- `OUTPUT-06`

### Phase G: content and QA

Build next:

- `CONTENT-01`
- `CONTENT-02`
- `CONTENT-03`
- `CONTENT-04`
- `CONTENT-05`
- `CONTENT-06`
- `QA-01`
- `QA-02`
- `QA-03`
- `QA-04`
- `QA-05`

## Minimum first release cut line

If schedule pressure appears, the minimum safe MVP cut line is:

- all `P0` items
- all `P1` items except:
  - `SYMBOL-02` if drag-and-drop is reliable enough
  - `CONTENT-04` if hardscape modules need to slip while fills remain strong
  - `CONTENT-06` if fixtures must be reduced to a minimal subset

Do not cut:

- `UNDERLAY-02`
- `LAYERS-02`
- `BUILDING-04`
- `LIBRARY-03`
- `LIBRARY-04`
- `SYMBOL-01`
- `PROPERTIES-01`
- `OUTPUT-01`
- `OUTPUT-03`

These are too central to the product promise.

## Suggested next artifact

After this backlog, the most useful next step would be one of:

1. turn the `P0` and earliest `P1` items into a feasibility-spike checklist
2. turn this backlog into a milestone-based implementation roadmap
3. turn the first one or two phases into engineering tickets
