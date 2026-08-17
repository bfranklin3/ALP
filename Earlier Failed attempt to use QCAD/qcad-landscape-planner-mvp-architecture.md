# QCAD-Based Landscape Planner MVP and Architecture

Date: August 12, 2026

## Goal

Build an easy-to-use desktop app for 2D top-down home and landscape plan drawings, using QCAD Community Edition as the CAD foundation and a simplified product layer on top.

The target output is similar to the sample drawings discussed in this thread:

- black-and-white install / drafting plans
- color presentation plans
- plant symbols, hardscape textures, labels, callouts, and title elements

## Product decision

Recommended direction:

- Use `QCAD Community Edition` as the geometry, drawing, snapping, layers, dimensions, and export foundation.
- Build a custom landscape-focused application layer on top of QCAD using its scripting and plugin architecture.
- Keep direct modifications to QCAD core as small as possible.

This is the best balance between:

- not building a CAD engine from scratch
- keeping a path toward a simpler user experience than standard CAD
- supporting layers, scale, measurements, symbols, hatches, and print output from the beginning

## Product principles

1. The app should feel like a landscape planner, not like a general CAD tool.
2. The default workflow should guide the user through site setup, hardscape, planting, labeling, and output.
3. Black-and-white and color output should be first-class modes, not afterthoughts.
4. Symbol libraries should be central to the experience.
5. Precision should exist where needed, but the interface should not expose unnecessary CAD complexity.

## Primary users

- landscape designers
- residential designers
- homeowners with moderate technical comfort
- small firms producing site plans, planting plans, and presentation drawings

## Jobs to be done

1. Create a scaled top-down lot plan.
2. Trace or draw a house footprint and site boundaries.
3. Draw beds, walkways, driveways, patios, and lawn areas.
4. Drag plant symbols into the plan and size or rotate them.
5. Add callouts, plant counts, notes, and dimensions.
6. Toggle layers, lock layers, and hide layers.
7. Export a monochrome install plan and a color presentation plan.

## MVP scope

### Must-have features

- New project from template
- Import reference plan as underlay
- Set project units and drawing scale
- Draw lot boundaries, house outlines, beds, walkways, patios, and planting zones
- Layers with:
  - show
  - hide
  - lock
  - print on / off
- Symbol libraries for:
  - trees
  - shrubs
  - flowers / accents
  - doors
  - windows
  - hardscape accents
  - user-created categories and imported symbol packs
- Hatch and texture fills for:
  - mulch
  - gravel
  - lawn
  - pavers
  - concrete
- Text labels and leader callouts
- Dimensions
- Plant count support
- Wall properties for thickness, outline, fill, and phase/status
- PDF export
- DXF export
- SVG export
- Print layouts for monochrome and color

### Nice-to-have after MVP

- Automatic plant legend
- Automatic schedule generation
- Symbol search and favorites
- Layer presets by project type
- Better title block templates
- Species database enrichment
- Door and window libraries for simple home-plan work

### Explicit non-goals for MVP

- 3D modeling
- terrain / grading tools
- irrigation design
- BIM features
- collaboration / multi-user editing
- cloud sync
- mobile support
- permit-grade construction documentation

## User workflow

### 1. Site setup

- Create project from template
- Choose units:
  - feet / inches
  - decimal feet
  - metric
- Choose drawing scale
- Import site or house reference as a locked underlay
- Create or confirm layer preset

### 2. Base drawing

- Draw property line
- Draw house footprint
- Draw driveways, patios, walks, beds, and lawn zones
- Apply line styles and hatches

### 3. Planting

- Open plant library
- Drag tree and shrub symbols into drawing
- Rotate, scale, duplicate, and align symbols
- Assign plant metadata and count labels

### 4. Annotation

- Add callouts with leaders
- Add dimensions
- Add notes
- Add title and scale text

### 5. Output

- Switch to draft mode or presentation mode
- Preview print layout
- Export PDF
- Export DXF or SVG if needed

## Recommended UI

### Main layout

- Top toolbar: project, undo/redo, mode switches, export
- Left tool rail: drawing and placement tools
- Center canvas: QCAD drawing view
- Right inspector: properties, layers, libraries, styles
- Bottom status bar: coordinates, snap state, scale, unit display

### Default panels

- `Layers`
- `Libraries`
- `Properties`
- `Output`

### UI simplification strategy

Hide or de-emphasize traditional CAD features that are not needed for the target workflow:

- advanced spline tools
- complex modify tools
- obscure line types
- low-level CAD setup dialogs
- generic CAD menu overload

Expose only the tools needed for landscape/site plans.

## Recommended top-level menus

### File

- New Project
- New From Template
- Open
- Save
- Save As
- Import Underlay
- Import Symbols
- Export PDF
- Export DXF
- Export SVG
- Print
- Project Settings

### Edit

- Undo
- Redo
- Cut
- Copy
- Paste
- Duplicate
- Delete
- Select All
- Preferences

### View

- Zoom In
- Zoom Out
- Zoom Extents
- Toggle Grid
- Toggle Underlay
- Draft Mode
- Presentation Mode
- Show / Hide Panels

### Draw

- Property Line
- Polyline
- Rectangle
- Arc
- Circle
- Bed Edge
- Walkway
- Patio
- Offset
- Trim
- Extend

### Planting

- Place Tree
- Place Shrub
- Place Accent Plant
- Replace Symbol
- Rotate Symbol
- Scale Symbol
- Duplicate Along Path
- Plant Spacing Helper
- Count Selected Plants

### Annotate

- Text Label
- Callout
- Plant Tag
- Dimension
- Area Label
- North Arrow
- Scale Note

### Layers

- Layer Manager
- New Layer
- Rename Layer
- Lock / Unlock Layer
- Show / Hide Layer
- Set Active Layer
- Apply Layer Preset

### Libraries

- Open Library Browser
- Import Library
- Rebuild Library Index
- Favorites
- Recent Symbols
- Manage Categories

### Output

- Draft Style Preset
- Presentation Style Preset
- Page Setup
- Title Block
- Print Preview
- Export Current Sheet

### Help

- Quick Start
- Keyboard Shortcuts
- Sample Projects
- Report Problem
- About

## Recommended tool modes

The app should center around five high-level modes:

1. `Site Setup`
2. `Building`
3. `Planting`
4. `Annotate`
5. `Output`

These are not separate file types. They are guided UI states that bias visible tools and panels toward the current task.

For MVP, `Building` should include both:

- architectural drawing work such as exterior walls, interior walls, room layout, doors, and windows
- site-built hardscape work such as patios, pools, retaining walls, paving edges, and related built features

This keeps house-plan work and landscape-plan built features in one coherent mode, while leaving open the option to split them later if the product grows more specialized.

## Layer model

Start with a fixed default layer preset that users can customize later.

### Default layers

- `Reference`
- `Property`
- `House`
- `Hardscape`
- `Planting Beds`
- `Trees`
- `Shrubs`
- `Accents`
- `Groundcover`
- `Labels`
- `Dimensions`
- `Title Block`

### Layer properties

Each layer should support:

- name
- visible
- locked
- printable
- color
- lineweight
- linetype
- output mode override

### Layer behaviors

- Only one active layer at a time
- Locked layers are not selectable by default
- Reference layer is locked automatically after underlay placement
- Output presets may remap colors and lineweights by layer

## Library model

Libraries are core product content, not just imported files.

### Library categories

- Trees
- Palms
- Shrubs
- Flowering Plants
- Groundcover
- Hardscape Symbols
- Doors and Windows
- Site Fixtures

The product should ship with built-in categories and also support user-defined categories for imported symbols and future content packs.

### Symbol behaviors

Each library item should support:

- drag and drop placement
- click-to-place placement
- rotation
- scale
- mirror when appropriate
- duplicate
- replace with another symbol
- metadata attachment

### Library management behaviors

- create user-defined categories
- import individual symbols
- import symbol packs
- keep built-in starter categories available

### Symbol style variants

Where practical, provide:

- monochrome plan symbol
- color presentation symbol

The app should treat these as style variants of the same logical symbol, not unrelated assets.

## Data model

### Recommended project format

Use an app-specific project package rather than raw DXF alone.

Suggested package format:

- `project.landplan`

Internally, this can be a folder package or zip-based bundle containing:

- `drawing.dxf`
- `project.json`
- `libraries.json`
- `placements.json`
- `thumbnails/preview.png`
- `imports/` for copied underlays and linked assets

This keeps the CAD drawing interoperable while allowing the product to store app-specific metadata cleanly.

## Data entities

### Project

- id
- name
- createdAt
- updatedAt
- units
- scale
- pageSize
- outputStyle
- templateId
- activeLayerPreset

### Layer

- id
- name
- visible
- locked
- printable
- color
- lineweight
- linetype
- outputRole

### Library

- id
- name
- version
- source
- categories

### WallStyle

- id
- name
- thickness
- alignment
- outlineColor
- fillStyle
- fillColor
- phase

### SymbolDefinition

- id
- libraryId
- name
- category
- tags
- defaultWidth
- defaultHeight
- defaultRotation
- monochromeAssetRef
- colorAssetRef
- metadataSchema

### SymbolPlacement

- id
- symbolDefinitionId
- drawingEntityId
- x
- y
- rotation
- scaleX
- scaleY
- layerId
- variant
- metadata

### PlantMetadata

- botanicalName
- commonName
- cultivar
- plantCode
- sizeLabel
- containerSize
- notes
- countGroupId

### Phase values

Recommended MVP values:

- `Existing`
- `Proposed`
- `Removal / Demo`

### Underlay

- id
- fileRef
- transform
- opacity
- locked
- visible

### OutputPreset

- id
- name
- mode
- layerOverrides
- symbolVariantRules
- hatchOverrides
- lineweightOverrides

## CAD object strategy

Separate the model into two conceptual layers:

### 1. Native CAD geometry

- lines
- polylines
- arcs
- circles
- hatches
- text
- dimensions
- walls with thickness and fill properties

These are stored primarily in QCAD / DXF form.

### 2. Smart app objects

- plant placements
- reusable symbols
- annotated count groups
- presentation variants
- output style mappings

These are stored in app metadata and linked to CAD entities.

This hybrid approach avoids forcing all business logic into raw DXF structures.

## Architecture

### High-level architecture

1. `QCAD engine layer`
   - geometry
   - snapping
   - selection
   - DXF import/export
   - dimensions
   - layers
   - rendering

2. `Landscape application layer`
   - workflow modes
   - symbol libraries
   - plant metadata
   - style presets
   - simplified menus and panels
   - output rules

3. `Project services layer`
   - project package read/write
   - asset management
   - library indexing
   - preview generation

4. `UI layer`
   - shell window
   - tool rail
   - properties inspector
   - library browser
   - layer manager
   - print/export screens

## Recommended implementation strategy

### Preferred approach

- Use QCAD Community Edition as the base application framework
- Implement most custom behavior in QCAD's script layer first
- Add native plugin code only when script-level APIs are not enough
- Keep a thin customization layer rather than a deep fork during MVP

### Why this is the safest path

- faster prototyping
- lower merge risk with upstream QCAD
- easier to learn where QCAD helps versus where it blocks
- lower cost before product-market fit

## Output system

### Output modes

#### Draft mode

- black-and-white or near-monochrome
- simple hatches
- strong line hierarchy
- readable labels
- optimized for print clarity

#### Presentation mode

- color plant symbols
- texture fills
- softer line hierarchy
- attractive client-facing output

### Output requirements

- export to PDF with page layout
- export to DXF for CAD interoperability
- export to SVG for vector reuse
- print preview before export

## MVP tool list

### Essential drawing tools

- line / polyline
- rectangle
- arc
- offset
- trim
- extend
- hatch fill
- measure distance
- dimension

### Essential placement tools

- place symbol
- rotate symbol
- scale symbol
- duplicate selection
- duplicate along path
- swap symbol

### Essential annotation tools

- text
- leader callout
- plant label
- area name

## Technical risks

### Risk 1: QCAD still feels too technical

Mitigation:

- hide advanced commands
- build workflow modes
- ship templates, presets, and starter libraries

### Risk 2: smart symbol behavior becomes fragile

Mitigation:

- keep DXF geometry simple
- store smart metadata in sidecar project data
- use stable entity IDs and reconciliation checks

### Risk 3: content curation is harder than coding

Mitigation:

- start with a small, high-quality starter library
- normalize naming and scale rules early
- support future library pack expansion

### Risk 4: licensing/product packaging complexity

Mitigation:

- minimize direct QCAD source changes
- review QCAD GPL and plugin exceptions early with counsel
- decide early whether the product will remain open-source, hybrid, or commercial with separate add-ons

## Milestone order

### Milestone 0: Feasibility spike

Goal:

- prove that QCAD can be shaped into a landscape-focused shell

Deliverables:

- simplified menu prototype
- custom tool panel prototype
- library insertion prototype
- layer preset prototype
- PDF export sanity check

Exit criteria:

- one sample lot plan can be recreated with manual effort inside the prototype

### Milestone 1: Core drafting MVP

Goal:

- basic usable 2D drafting workflow

Deliverables:

- project creation
- unit and scale setup
- drawing tools
- layers
- hatches
- dimensions
- PDF and DXF export

Exit criteria:

- produce a clean black-and-white plan similar in structure to the monochrome sample

### Milestone 2: Library-driven planting MVP

Goal:

- make the app feel like a landscape planner instead of generic CAD

Deliverables:

- library browser
- starter tree and shrub libraries
- user-imported symbol categories
- drag-and-drop placement
- rotate / scale / replace tools
- plant metadata
- plant count helper

Exit criteria:

- recreate a planted plan with labeled symbols and usable counts

### Milestone 3: Annotation and output polish

Goal:

- generate cleaner client-facing documents

Deliverables:

- callouts
- title block support
- output presets
- draft mode
- presentation mode
- print preview

Exit criteria:

- export both a monochrome install plan and a color presentation plan from the same project

### Milestone 4: Workflow simplification

Goal:

- reduce user friction for non-CAD users

Deliverables:

- guided tool modes
- onboarding template
- keyboard shortcuts
- cleaner defaults
- sample project
- improved library browsing

Exit criteria:

- a non-CAD test user can complete a simple lot plan with light training

### Milestone 5: Pre-v1 hardening

Goal:

- stabilize the app for broader release

Deliverables:

- file format validation
- recovery behavior
- better error messages
- performance testing with larger symbol-heavy plans
- import/export regression tests

Exit criteria:

- stable handling of real project files and repeated export workflows

## Recommended first 90 days

### Phase 1

- stand up QCAD-based shell
- hide non-essential menus
- define layer preset
- define project package format

### Phase 2

- implement symbol library browser
- implement smart placement metadata
- ship first tree / shrub / bed texture pack

### Phase 3

- implement output presets
- recreate one monochrome sample and one color sample end to end
- test with a real user workflow

## Suggested repository structure

```text
landscape-planner/
  app/
    scripts/
    plugins/
    ui/
  content/
    libraries/
    textures/
    templates/
  docs/
    product/
    architecture/
  examples/
  tests/
```

## Recommended next artifacts

After this document, the next most useful planning docs are:

1. `MVP feature backlog`
2. `library content specification`
3. `project file format spec`
4. `UI wireframe and panel map`
5. `QCAD integration spike checklist`

## Bottom line

The product should not be "QCAD with landscape assets added."

It should be:

- a simplified landscape planning app
- powered by QCAD underneath
- centered on templates, layers, symbols, hatches, and polished output

That is the most realistic path to getting the precision you need without taking on the cost of a full CAD engine build from zero.

## Hybrid interaction model

Based on the shell and wall-tool spike findings, the MVP should use a hybrid interaction model instead of trying to force every command through a fully custom shell.

### What "hybrid" means

The app has two interaction layers working together:

- a custom landscape-planner layer for workflow, defaults, guidance, and management
- a native QCAD command layer for starting precision drawing actions

### Custom landscape-planner layer

This layer should own:

- workflow modes such as `Site Setup`, `Hardscape`, `Planting`, `Annotate`, and `Output`
- underlay import and two-point calibration workflow
- wall defaults, phase/status, style presets, and other tool defaults
- layers, libraries, properties, and output settings
- onboarding, helper text, and simplified project guidance

### Native QCAD command layer

This layer should own the start of core precision draw commands such as:

- property line
- building edge / wall drawing
- rectangle
- offset
- trim / opening
- dimensions
- similar two-point or path-based geometry commands

### Why this is recommended

The spike showed that:

- custom dock-launched drawing tools in the prototype still consumed an extra first click before real drawing began
- the downloaded / shipping QCAD app showed better line-start behavior than the prototype
- this makes QCAD's native drawing-command path look more trustworthy for MVP precision input than the custom dock-launch path

### Product implication

The MVP should not try to prove that every drawing action starts from a right-side custom dock button.

Instead, it should aim for:

- a branded, simplified workflow shell
- strong custom panels and defaults
- guided task flow
- native-feeling precision drawing initiation

This is the best current balance between ease of use and technical realism.
