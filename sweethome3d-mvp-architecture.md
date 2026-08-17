# Sweet Home 3D-Based MVP Architecture

Date: August 14, 2026

## Goal

Define a practical MVP architecture for a `Sweet Home 3D`-based 2D architectural and landscape planning product.

This document answers:

1. what the product architecture should look like at a high level
2. which responsibilities should stay close to stock `Sweet Home 3D`
3. which responsibilities should live in the product adaptation layer
4. which areas are likely to need deeper customization later

This architecture is intended to support:

- smart walls, doors, and windows
- 2D home-plan and site-plan editing
- organized object libraries
- labels, dimensions, and output
- early plant scheduling / legend support

## Product Direction

The MVP should be:

- 2D-first
- object-first
- easier to use than a traditional CAD product
- capable of both architecture and landscape/site planning

The MVP should not assume:

- terrain modeling
- advanced CAD parity
- full shell replacement in Phase 1
- BIM-like building data

## Architectural Principle

Treat `Sweet Home 3D` as:

- a semantic editing engine
- a plan-rendering foundation
- a reusable content and output base

Do not treat it as:

- a UI that must remain stock
- a model that must be rewritten from day one
- a complete product already aligned with landscape planning

The architecture should therefore separate:

- the `Sweet Home 3D foundation layer`
- the `product adaptation layer`
- the `future deep customization layer`

## High-Level Architecture

### 1. Foundation layer

This is the reused `Sweet Home 3D` core.

Primary responsibilities:

- wall model
- door / window hosting behavior
- object placement and manipulation
- 2D plan rendering base
- dimensions and labels
- background image and scale workflow
- levels / visibility groups
- catalog and placed-object framework
- basic print / export pathways

Examples of likely foundation objects and systems:

- `Home`
- `Wall`
- `Room`
- `HomeDoorOrWindow`
- `HomePieceOfFurniture`
- `Label`
- `DimensionLine`
- `Polyline`
- `Level`
- `PlanComponent`
- stock controllers for editing and selection

### 2. Product adaptation layer

This is where the new product should live in Phase 1.

Primary responsibilities:

- product framing and branding
- architecture + landscape terminology
- reorganized object categories
- custom 2D symbol and texture defaults
- plant metadata rules
- schedule / legend generation
- level usage conventions
- reference-content protection behavior
- simplified workflow emphasis

This layer should contain:

- app-specific defaults
- library grouping rules
- product-specific metadata conventions
- presentation and workflow cleanup
- lightweight controller extensions

### 3. Future deep customization layer

This is not Phase 1 by default, but should be anticipated.

Primary responsibilities:

- strong custom shell replacement
- contextual object popups
- richer direct manipulation
- true lockable / print-aware layer behavior
- custom landscape-native object subclasses
- more advanced schedule and reporting logic

This layer becomes necessary only if the adaptation layer proves insufficient.

## Responsibility Map

## A. Model responsibilities

### Keep close to stock in MVP

- `Wall` for wall geometry and hosted openings
- `HomeDoorOrWindow` for hosted architectural openings
- `Room` or equivalent polygon-area behavior for beds, lawns, patios, and similar outdoor zones
- `HomePieceOfFurniture` / catalog-based objects for plants and outdoor items
- `Level` for named visibility groups
- `Label`, `DimensionLine`, and `Polyline` for annotation and simple drawn geometry

### Adapt in MVP

- define product-level metadata conventions for:
  - plant name
  - botanical name
  - common name
  - count identity
  - object category
  - reference / protected content state
- define app rules for which object types belong in which categories
- define level naming conventions and visibility usage patterns

### Likely defer

- deep rewrites of `Level`
- large new object inheritance trees such as:
  - `HedgePiece`
  - `LandscapeArea`
  - `PlantPiece`
  - `IrrigationZone`

These should be introduced only after stock abstractions are clearly insufficient.

## B. Controller responsibilities

### Keep close to stock in MVP

- standard wall editing
- standard door / window placement and editing
- standard object selection and move / resize behavior
- standard dimension editing
- standard plan navigation

### Adapt in MVP

- project setup flow
- underlay / scale workflow emphasis
- simplified library browsing flow
- product-specific inspector logic
- schedule / legend generation flow
- visibility group workflow
- reference-content protection logic

Examples of controller-like product behaviors:

- treat certain levels as reference / non-editable by convention
- group selected objects for schedule generation
- expose architecture + landscape content in cleaner sequences

### Likely deeper work later

- contextual on-canvas action popups
- rich grip editing beyond stock handles
- highly customized mode-based command systems
- deeper drag/drop intelligence for specialized landscape objects

## C. 2D plan rendering responsibilities

### Keep close to stock in MVP

- base plan canvas
- wall / opening rendering
- label and dimension rendering
- general object placement and selection display

### Adapt in MVP

- better 2D symbols for plants
- better outdoor visual defaults
- improved texture and fill choices
- more architecture / landscape-appropriate visual language

This is one of the most important adaptation areas because product feel depends heavily on how the 2D plan reads.

### Likely deeper work later

- custom hedge graphics
- richer landscape-area visualizations
- irrigation coverage visualization
- more advanced contextual overlays and inline editing UI

## D. Library / content responsibilities

### Keep close to stock in MVP

- catalog mechanics
- categories
- placed-object identity
- content import structure

### Adapt in MVP

- curated starter libraries
- architectural categories:
  - walls support content indirectly
  - doors
  - windows
- landscape categories:
  - plants
  - beds / areas
  - hardscape
  - outdoor living
  - reference / annotation

### Phase 1 content goal

Provide a deliberately small but coherent starter content set rather than a huge library.

That starter set should be enough to recreate:

- a basic home plan
- a small site / planting plan
- a mixed home + landscape plan

## E. Output responsibilities

### Keep close to stock in MVP

- print
- print to PDF
- base 2D plan export
- dimension and label output

### Adapt in MVP

- output presets for:
  - black-and-white draft
  - color presentation
- legend / schedule placement or export behavior
- cleaner print defaults for the product

### Likely deeper work later

- stronger monochrome drafting control
- CAD-like print / layer behavior
- richer sheet / title-block workflows

## Proposed Phase 1 System Shape

The MVP should be organized conceptually like this:

### 1. Project setup subsystem

Responsibilities:

- new project
- reference image import
- scale calibration
- level naming and setup

### 2. Building subsystem

Responsibilities:

- walls
- doors
- windows
- interior and exterior layout editing

### 3. Landscape subsystem

Responsibilities:

- plants
- outdoor objects
- area-based outdoor regions
- textures / fills

### 4. Annotation subsystem

Responsibilities:

- labels
- text notes
- dimensions
- basic callouts

### 5. Output subsystem

Responsibilities:

- draft output
- color output
- PDF / printable plan generation
- schedule / legend generation

## Suggested Phase 1 Data Strategy

In Phase 1, prefer:

- reusing stock model objects
- storing extra product meaning in controlled metadata and category conventions
- deriving schedules and legends from placed-object metadata

Avoid:

- large early schema rewrites
- deep persistence format changes unless validation requires them

This keeps the pivot lighter and makes it easier to learn where the platform really bends versus where it truly blocks.

## Suggested Phase 1 UI Strategy

The UI architecture should be layered like this:

### Preserve

- the core plan editor
- stock object editing that already works well

### Adapt

- menus and labels
- library grouping
- visible workflow order
- inspector emphasis
- default panels

### Defer

- a complete shell rewrite to match the HTML mockups exactly

This lets the team validate product direction before spending heavily on UI restructuring.

## Phase 1 Decision Boundaries

The following should be treated as explicit architecture boundaries in the MVP:

### Allowed in Phase 1

- content restructuring
- metadata-driven specialization
- moderate inspector and workflow cleanup
- better 2D visual representation
- schedule / legend generation
- level conventions and lightweight protection rules

### Avoid unless forced

- replacing the whole main UI shell
- rewriting core level semantics
- inventing many new persistent object subclasses
- large 3D-specific changes

## Architecture Success Criteria

The MVP architecture is succeeding if:

1. Walls, doors, and windows require far less custom logic than they did in the `QCAD` path.
2. Landscape content can be made believable through content and rendering adaptation rather than wholesale model replacement.
3. The plan editor remains stable while product-specific behavior is layered on top.
4. Output and scheduling improve without forcing large early rewrites.
5. The app starts to feel like a focused architecture + landscape planner instead of stock `Sweet Home 3D`.

## Bottom Line

The best MVP architecture is a layered one:

- preserve the strongest semantic foundations of `Sweet Home 3D`
- add a disciplined product adaptation layer for architecture + landscape workflows
- defer deep model and shell surgery until product evidence proves it is necessary

This gives the product the best chance to move faster than the current `QCAD` path while keeping the platform risk under control.
