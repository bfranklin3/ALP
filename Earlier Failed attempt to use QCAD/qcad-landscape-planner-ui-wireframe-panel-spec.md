QCAD-Based Landscape Planner UI Wireframe and Panel Layout Spec

Date: August 12, 2026

## Purpose

This document defines the first-pass user interface for the QCAD-based landscape planner MVP.

It focuses on:

- the main application layout
- the core panels and how they behave
- the workflow modes users move through
- low-fidelity wireframes
- UI rules that keep the product easy to use

This is intentionally a low-fidelity product specification, not a visual design comp.

## UI goals

1. Make the app feel like a landscape planning tool, not a generic CAD program.
2. Keep the main workspace stable so users do not get lost.
3. Surface the most important tools for each task at the moment they are needed.
4. Keep precision available without forcing CAD complexity into every interaction.
5. Support both black-and-white drafting output and color presentation output from the same project.

## Design principles

### 1. One main workspace

The user should spend most of their time in one primary drawing workspace.

Avoid popping users into unrelated windows for common tasks.

### 2. Guided modes, not expert overload

The app should change visible tools and panel emphasis based on the current task:

- Site Setup
- Building
- Planting
- Annotate
- Output

`Building` is the broader MVP mode label. It should cover both architectural drawing and site-built hardscape work so users can stay in one mode when drawing:

- exterior building walls
- interior room walls
- garages, lanais, and additions
- doors and windows
- patios, pools, retaining walls, paving edges, and similar built site features

### 3. Panels should be narrow and purposeful

Every side panel should answer a clear question:

- what can I draw?
- what can I place?
- what layer am I on?
- what properties does this object have?
- how will this export?

### 4. The canvas is the star

The drawing area should remain dominant. Panels should support the work, not compete with it.

### 5. Default simplicity over maximum flexibility

The first version should favor:

- clear defaults
- fewer visible commands
- strong presets
- predictable panel placement

## Primary application structure

The product should have four major surfaces:

1. Launch / project start
2. Main drawing workspace
3. Modal task sheets for focused tasks
4. Print / export preview

## Screen list

### 1. Launch screen

Used for:

- new project
- new from template
- open recent project
- open sample project

### 2. Main workspace

Used for:

- drawing
- placing symbols
- editing layers
- labeling
- switching output styles

### 3. Focused task sheets

Used for:

- project settings
- import underlay
- manage libraries
- page setup

These should appear as centered modal sheets or panels, not whole new application windows.

### 4. Output preview

Used for:

- draft mode preview
- presentation mode preview
- sheet layout preview
- export confirmation

## Main workspace layout

The recommended structure is:

- top app bar
- top drawing command strip
- left workflow rail
- center drawing canvas
- right utility sidebar
- bottom status bar

This is a hybrid layout:

- the custom shell guides workflow, defaults, libraries, layers, and output
- a simplified native / QCAD-backed command surface starts precision drawing tools

## Main workspace wireframe

```text
+----------------------------------------------------------------------------------------------------------------+
| File  Edit  View  Draw  Planting  Annotate  Layers  Libraries  Output  Help                    [Draft|Color]  |
|----------------------------------------------------------------------------------------------------------------|
| [Project] [Undo] [Redo]              [ Site Setup | Building | Planting | Annotate | Output ]                 |
|                                                                                         [Snap] [Grid] [Scale] |
|----------------------------------------------------------------------------------------------------------------|
| DRAW COMMAND STRIP                                                                                             |
| [Property Line] [Walls] [Doors] [Windows] [Offset] [Dimension] [Callout] [Place Tree]                        |
| Native / QCAD-backed launch surface for precision drawing commands and anchored type pickers                   |
+----------------------------------------------------------------------------------------------------------------+
| LEFT WORKFLOW RAIL            | DRAWING CANVAS                                          | RIGHT SIDEBAR       |
|-------------------------------|---------------------------------------------------------|---------------------|
| Step 1: Import Underlay       |                                                         | Properties          |
| Step 2: Calibrate Scale       |                                                         | Layers              |
| Step 3: Draw Property Line    |                                                         | Libraries           |
| Step 4: Draw Walls            |                                                         | Output              |
|-------------------------------|                                                         |---------------------|
| Recommended Next Action       |                                                         | Mode Panel          |
| Draw Walls                    |                                                         | - helper text       |
| Use command strip above       |                                                         | - defaults          |
|-------------------------------|                                                         | - settings          |
| Tool Defaults                 |                                                         |---------------------|
| Wall Thickness: 8"            |                                                         | Selection / Active  |
| Phase: Proposed               |                                                         | Tool Details        |
| Underlay: Locked              |                                                         |                     |
+----------------------------------------------------------------------------------------------------------------+
| Cursor: 48' 2 1/4", 17' 10"   Active Layer: Walls   Snap: Endpoint   Scale: 1/8" = 1'-0"   Units: ft/in    |
+----------------------------------------------------------------------------------------------------------------+
```

## Panel behavior summary

### Left workflow rail

Purpose:

- show the current mode's checklist, recommended steps, and setup actions
- reduce user confusion about what to do next
- highlight the next recommended drawing or placement step

Behavior:

- icon-first or compact checklist presentation
- shows 6 to 10 primary workflow actions or steps at a time
- changes with mode
- supports hover labels and helper text
- should not be the only launch surface for precision geometry tools

### Right sidebar

Purpose:

- contains stacked utility panels
- acts as the main custom app control center

Default tabs:

- Properties
- Layers
- Libraries
- Output

Behavior:

- one panel expanded at a time by default
- users may pin a second panel open if desired
- width should be adjustable but limited
- mode-specific defaults and helper text may appear here

### Bottom status bar

Purpose:

- precision information without cluttering the canvas

Shows:

- cursor coordinates
- active layer
- snap mode
- scale
- units
- selection count

## Top app bar

The top app bar should combine menu navigation with project-level controls and mode switching.

### Primary persistent controls

- New
- Open
- Save
- Undo
- Redo
- Mode switcher
- Draft / Presentation output toggle
- Export PDF
- Print

### Secondary controls

- Grid toggle
- Snap toggle
- Units display
- Scale display

## Top drawing command strip

This strip sits below the app bar and exposes the most common precision commands.

Purpose:

- start precision drawing commands from the best available launch surface
- preserve better native QCAD line / wall initiation behavior
- keep the most-used geometry tools visible and easy to reach

Preferred contents:

- Property Line
- Building Edge
- Rectangle
- Offset
- Trim / Opening
- Dimension
- Callout
- one or two placement commands such as `Place Tree`

Rules:

- these commands may be native toolbar buttons, menu commands, or shortcuts surfaced through a simplified top strip
- the strip should stay stable across modes, though emphasis may change
- the custom shell can still highlight the recommended next command for the current mode

## Recommended workflow mode switcher

Use a segmented control near the top center:

```text
[ Site Setup ] [ Hardscape ] [ Planting ] [ Annotate ] [ Output ]
```

This should be visible at all times.

A segmented control is a horizontal row of mutually exclusive buttons. It is not a pulldown menu.

Mode changes should:

- update the left workflow rail
- change the recommended right panel
- adjust empty-state helper text
- not move the canvas or reset zoom

## Launch screen spec

### Purpose

Reduce the intimidation of a CAD-first startup.

### Recommended content

```text
+--------------------------------------------------------------------------------------+
| Landscape Planner                                                                    |
|--------------------------------------------------------------------------------------|
| Start                                                                                |
| [ New Blank Project ]  [ New From Template ]  [ Open Existing ]  [ Open Sample ]    |
|                                                                                      |
| Templates                                                                            |
| [ Small Lot ] [ Corner Lot ] [ Courtyard ] [ Blank Sheet ]                           |
|                                                                                      |
| Recent Projects                                                                      |
| - Maple Residence                                                                    |
| - Rectangular Lot Concept One                                                        |
| - Backyard Planting Study                                                            |
|                                                                                      |
| Learn                                                                                |
| [ Quick Start ] [ Watch First Project Guide ]                                        |
+--------------------------------------------------------------------------------------+
```

### Launch screen rules

- lead with templates
- show recent projects clearly
- avoid technical terms like DXF or block library on the first screen

## Main workspace detailed panels

### Left workflow rail by mode

### Site Setup mode

Tools and steps:

- Select
- Pan View
- Measure
- Import Underlay
- Calibrate Scale
- Draw Property Line
- Draw Walls
- Reference Lock

Helper text:

- "Import a reference, calibrate scale from two known points, and draw the property and building footprint."

Notes:

- `Pan View` means moving the 2D view around the drawing without changing geometry.
- `Calibrate Scale` should let the user click two points on the imported reference and enter the real-world distance between them.
- `Draw Property Line` and `Draw Walls` are guided launch affordances. The actual precision command should preferably start through the top drawing command strip or another native QCAD-backed launch surface.

### Building mode

Tools and steps:

- Select
- Polyline
- Bed Edge
- Walkway
- Patio
- Driveway
- Wall / Edging
- Draw Rectangle
- Draw Walls
- Draw Offset
- Doors
- Windows
- Hatch Fill

Helper text:

- "Draw building outlines, interior walls, doors, windows, beds, paving, walls, and outdoor surfaces."

Notes:

- building mode may recommend geometry tools from the workflow rail, but the actual precision geometry command should still launch from the top command strip or another native command surface when possible
- ideal wall behavior should be closer to tools like SmartDraw's wall tool: immediate wall start, live length feedback while drawing, easy numeric editing of wall length, and clean wall connection behavior
- the top command strip should prefer the simple labels `Walls`, `Doors`, and `Windows`
- `Walls` should launch one wall drawing system for both exterior and interior walls rather than separate tool buttons
- `Doors` and `Windows` should open lightweight anchored pickers for subtype selection instead of large modal dialogs
- broader symbol browsing should stay in the Libraries panel rather than expanding the top command strip into many symbol buttons

### Planting mode

Tools:

- Select
- Place Tree
- Place Shrub
- Place Accent
- Rotate
- Scale
- Duplicate
- Duplicate Along Path
- Replace Symbol

Helper text:

- "Drag and place plants from the library, then scale and rotate as needed."

Notes:

- planting placement is a better fit for custom-shell interaction than wall drawing because drag-and-drop and click-to-place symbol placement are closer to library workflows than to precision line initiation

### Annotate mode

Tools:

- Select
- Text Label
- Callout
- Plant Tag
- Dimension
- Area Label
- North Arrow
- Note

Helper text:

- "Add labels, counts, dimensions, and notes for print-ready plans."

### Output mode

Tools:

- Select
- Page Frame
- Title Block
- Sheet Text
- Print Preview
- Export PDF
- Export SVG
- Export DXF

Helper text:

- "Choose draft or presentation output and preview the final sheet."
## Right sidebar panels

### Properties panel

### Purpose

Show editable settings for the current selection or active tool.

### Empty state

If nothing is selected:

- show current tool settings
- show active layer
- show default style for new objects

### Example content for geometry selection

- object type
- layer
- line color
- lineweight
- linetype
- hatch / fill
- dimensions
- lock status

### Example content for wall selection

- wall type
- layer
- thickness
- alignment
- outline color
- fill style
- fill color
- phase / status

Recommended phase values:

- `Existing`
- `Proposed`
- `Removal / Demo`

### Example content for plant symbol selection

- symbol name
- category
- layer
- rotation
- width
- depth
- mature height
- style variant
- botanical name
- common name
- plant code
- notes

### Wireframe

```text
+----------------------------------+
| Properties                       |
|----------------------------------|
| Selected: Tree Symbol            |
| Name: Live Oak Round A           |
| Layer: Trees                     |
| Variant: Color Presentation      |
| Rotation: 35 deg                 |
| Width: 18'-0"                    |
| Depth: 18'-0"                    |
| Mature Height: 35'-0"            |
| Botanical: Quercus virginiana    |
| Common: Live Oak                 |
| Plant Code: LIVE-OAK-01          |
| Notes:                           |
| [______________________________] |
+----------------------------------+
```

### Layers panel

### Purpose

Provide a simple, always-understandable layer manager.

### Requirements

- active layer indicator
- visible toggle
- lock toggle
- print toggle
- color swatch
- add layer
- rename layer
- reorder layer by drag

### Default behavior

- one-click set active layer
- visibility and lock use obvious icons
- hidden layers gray out
- locked layers show a lock icon and resist selection
- layers may be reordered by dragging rows up or down

### Wireframe

```text
+----------------------------------+
| Layers                           |
|----------------------------------|
| A  V  L  P  Layer Name           |
| *  o  -  o  Property             |
| -  o  -  o  House                |
| -  o  -  o  Hardscape            |
| -  o  -  o  Planting Beds        |
| -  o  -  o  Trees                |
| -  o  -  o  Shrubs               |
| -  o  -  o  Labels               |
| -  o  -  o  Dimensions           |
|----------------------------------|
| [+ Layer] [Preset] [Options]     |
+----------------------------------+
```

Legend:

- `A` active
- `V` visible
- `L` locked
- `P` printable

### Libraries panel

### Purpose

Make symbol placement feel more like design software than raw CAD.

### Core structure

- search field
- category filter
- symbol grid or list
- favorites
- recent symbols
- built-in and user-created categories

### Recommended default categories

- Trees
- Palms
- Shrubs
- Accents
- Groundcover
- Building / Site Features
- Doors / Windows
- Site Fixtures

Architectural recommendation:

- doors and windows should use the same underlying library system as plants and fixtures
- the UI should still surface them as a clearly separate architectural group in `Site Setup` and `Building`
- the `Doors` and `Windows` command-strip buttons should focus the relevant architectural library section while also exposing a small anchored subtype picker
- the `Walls` command-strip button should expose wall-style choices through an anchored picker, but wall drawing itself is still a drawing tool rather than a library symbol placement action

### Symbol card contents

- thumbnail
- name
- optional tags
- favorite star

### Placement behavior

- drag and drop onto the canvas is the preferred placement model
- click once to activate placement tool remains available as a fallback placement method
- double-click to inspect details
- command-strip architectural buttons may pre-filter or focus the library panel so the matching symbols are immediately visible

### Library management behavior

- users should be able to create their own categories
- users should be able to import individual symbols
- users should be able to import symbol packs into chosen categories
- built-in categories should remain available by default

### Wireframe

```text
+----------------------------------+
| Libraries                        |
|----------------------------------|
| Search: [ oak, palm, shrub.... ] |
| Category: [ Trees v ]            |
|----------------------------------|
| [thumb] Live Oak Round A         |
| [thumb] Live Oak Round B         |
| [thumb] Pine Narrow A            |
| [thumb] Palm Fan Medium          |
| [thumb] Maple Ornamental A       |
|----------------------------------|
| [Favorites] [Recent] [Manage]    |
+----------------------------------+
```

### Output panel

### Purpose

Make output selection understandable and visual.

### Core controls

- output mode
- page size
- orientation
- title block choice
- lineweight preset
- monochrome / color symbol behavior
- export buttons

### Export plan

MVP exports:

- PDF
- DXF
- SVG

Planned future exports:

- PNG
- JPG

### Wireframe

```text
+----------------------------------+
| Output                           |
|----------------------------------|
| Mode: [ Draft v ]                |
| Page Size: [ Tabloid v ]         |
| Orientation: [ Portrait v ]      |
| Title Block: [ Standard A v ]    |
| Scale Note: [Auto]               |
|----------------------------------|
| Symbols: [Mono Plan Style]       |
| Fills:   [Simple Hatch Style]    |
|----------------------------------|
| [Preview Sheet]                  |
| [Export PDF]                     |
| [Export DXF]                     |
| [Export SVG]                     |
| [More Formats]                   |
+----------------------------------+
```

## Canvas behaviors

### Canvas priorities

The canvas should support:

- zoom and pan smoothly
- always-visible selection highlight
- snapping feedback
- clean object handles
- underlay dimming
- visible active placement preview

### Selection model

- single click selects
- drag box multi-selects
- locked layers are skipped by default
- double-click opens deeper properties for symbols

### Placement preview

When placing a symbol:

- show ghost preview under cursor
- show rotation if the user turns it before placement
- show approximate canopy / footprint size
- snap to reference geometry where sensible

### Underlay behavior

Imported reference drawings or scans should:

- live on the `Reference` layer
- default to locked
- allow opacity control
- support scale calibration
- support two-point calibration by clicking two known points and entering the real-world distance

## Draft mode vs presentation mode UI

This choice should be visible and easy to understand.

### Recommended control

Use a two-state segmented toggle in the top bar:

```text
[ Draft ] [ Presentation ]
```

### Draft mode behavior

- monochrome symbol variants preferred
- simple hatches
- print-focused line hierarchy
- reduced texture richness

### Presentation mode behavior

- color symbol variants preferred
- richer fills and textures
- softer line hierarchy where appropriate

This switch should affect preview and export styling, not change the underlying drawing data.

## Suggested onboarding flows

### First-run empty project

If the user starts a blank project, guide them with a checklist:

```text
Start Your Plan
1. Set units and scale
2. Import a reference and calibrate it from two points, or draw the property line directly
3. Draw hardscape and planting beds
4. Place plants from the library
5. Add labels and export
```

### Template-based start

If the user starts from a template:

- pre-create layers
- pre-load page size
- pre-load title block
- set sensible output presets

## Recommended modal sheets

Keep these tasks out of the permanent panel stack.

### Project Settings sheet

Contains:

- project name
- units
- scale
- page size
- template selection

### Import Underlay sheet

Contains:

- file picker
- opacity
- scale calibration
- two-point scale calibration workflow
- placement position
- lock after import checkbox

Suggested calibration flow:

1. import the image or PDF underlay
2. click point A
3. click point B
4. enter real-world distance
5. apply calibrated scale

### Manage Libraries sheet

Contains:

- import library
- enable / disable library
- rebuild library index
- category mapping

## Responsiveness rules

Even though this is a desktop-first app, the interface should behave well at common window sizes.

### Wide window

- full left tool rail
- right panel open
- canvas centered

### Medium window

- left tool rail remains
- right sidebar may collapse to tabs
- status bar remains visible

### Small window

- right sidebar becomes overlay drawer
- labels shorten
- mode switcher stays visible

## Suggested visual hierarchy

### Highest emphasis

- canvas
- active mode
- selected tool
- current output style

### Medium emphasis

- active layer
- library category
- selected object properties

### Lower emphasis

- advanced export details
- infrequent project settings
- rarely used expert options

## UI anti-goals

Avoid these patterns in MVP:

- floating toolbars everywhere
- more than one main sidebar on each side
- deep nested inspector controls
- modal windows for common actions
- CAD jargon in primary task flows
- forcing users to understand blocks, linetypes, or DXF internals

## Decision log

### Why use a left tool rail

- familiar to design tools
- fast visual access
- easy to vary by mode

### Why use a right sidebar

- consistent place for details and management panels
- keeps the canvas visually clean
- works well with QCAD-like property workflows

### Why make modes visible

- helps non-CAD users understand what to do next
- reduces visible tool overload
- reinforces the intended workflow

### Why keep top-level menus

- still useful for desktop users
- gives access to standard actions without relying only on icons
- aligns better with QCAD desktop expectations

## Open questions for next design pass

1. Should drag-and-drop and click-to-place both ship in MVP, or should click-to-place be deferred if drag-and-drop works well enough?
2. How should size editing appear during placement: inline numeric inputs, a small floating HUD, or only in the Properties panel after placement?
3. How much of QCAD's native menu structure can be hidden cleanly without fighting the platform?
4. Should the app expose an `Advanced` menu for expert CAD features that remain available but hidden from the default workflow?
5. Should building tools remain split across `Site Setup` and `Hardscape`, or should the product eventually introduce a dedicated `Building` mode?

## Resolved decisions from review

- The mode control is a segmented control in the top bar, replacing the earlier `Mode: Planting` placeholder.
- Building and house drawing support should be stronger, with explicit tools for `Building Edge`, `Offset Wall`, `Door Opening`, and `Window Opening`.
- The app should support two-point reference calibration for imported underlays.
- The Layers panel should support drag reordering.
- Drag-and-drop is the preferred library placement model.
- The library system should support user-created categories and imported symbol packs.
- Doors and windows should be visually separated as architectural content in the UI, while remaining part of the same underlying library system.
- Plant symbols should default to their standard library size, while allowing optional size adjustment during placement.
- Plant plan dimensions should use `Width` and `Depth`; horticultural metadata may separately use fields like `Mature Height`.
- Output mode should be project-wide for MVP.
- The app should use one combined, context-sensitive `Properties` panel.
- Wall tools should support editable thickness, fill, color, and phase/status properties.
- MVP should use a hybrid interaction model:
  - the custom shell should guide workflow, defaults, properties, layers, libraries, and underlay actions
  - native QCAD-backed command surfaces should launch core precision drawing tools
- Ideal wall behavior should include:
  - immediate wall start on the first real canvas click
  - live wall-length feedback while drawing
  - easy numeric wall-length editing from the on-canvas label and from the Properties panel

## Recommended next step

After this document, the best follow-up is:

- review whether the wireframe now reflects the intended hybrid MVP clearly enough to support a more visual mockup or implementation plan update
