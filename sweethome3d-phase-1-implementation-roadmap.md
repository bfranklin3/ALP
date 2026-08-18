# Sweet Home 3D Phase 1 Implementation Roadmap

Date: August 14, 2026

## Purpose

Turn the `Sweet Home 3D` pivot decision into an implementation sequence for Phase 1.

This roadmap is meant to answer:

- what we build first
- what we validate before deeper investment
- which work is mainly content / UX
- which work likely requires source-code adaptation

## Inputs

This roadmap is based on:

- [sweethome3d-pivot-decision-summary.md](/Users/billfranklin/Documents/ChatGPT/Architecture Landscape CAD App/sweethome3d-pivot-decision-summary.md)
- [sweethome3d-phase-1-mvp-feature-list.md](/Users/billfranklin/Documents/ChatGPT/Architecture Landscape CAD App/sweethome3d-phase-1-mvp-feature-list.md)
- [sweethome3d-spike-day-1-findings.md](/Users/billfranklin/Documents/ChatGPT/Architecture Landscape CAD App/sweethome3d-spike-day-1-findings.md)
- [sweethome3d-spike-day-2-findings.md](/Users/billfranklin/Documents/ChatGPT/Architecture Landscape CAD App/sweethome3d-spike-day-2-findings.md)
- [sweethome3d-ui-customization-boundary-map.md](/Users/billfranklin/Documents/ChatGPT/Architecture Landscape CAD App/sweethome3d-ui-customization-boundary-map.md)

## Roadmap Summary

Phase 1 should not begin with a giant UI rewrite.

It should begin by locking down the product-critical adaptations that most affect:

- outdoor area behavior
- library quality
- layer-like workflow
- output quality
- lightweight UI simplification

Recommended milestone order:

1. `M0` Foundation fork + codebase orientation
2. `M1` Landscape planning baseline
3. `M2` Library and content upgrade
4. `M3` Layer-like workflow and project organization
5. `M4` Output and annotation refinement
6. `M5` UI cleanup and MVP packaging

## Milestone Order

## M0: Foundation Fork + Codebase Orientation

### Goal

Create a safe working fork and verify exactly where the first Phase 1 adaptations live in the source tree.

### Why first

Before we promise feature work, we need to know:

- where area rendering is handled
- where text rendering is handled
- where level behavior is handled
- how much of the UI can be improved without destabilizing the app

### Deliverables

- local fork / prototype branch strategy
- source map for:
  - room / area model
  - text model
  - level model
  - 2D renderer
  - room and text property panels
- short technical notes on:
  - easy edits
  - moderate edits
  - high-risk edits

### First engineering spikes

- `SPIKE-01` Find and document the area / room rendering path
  - likely targets: `Room.java`, `RoomPanel.java`, `HomeComponent2D.java`
- `SPIKE-02` Find and document the text rendering path
  - likely targets: `HomeText.java`, text property UI, `HomeComponent2D.java`
- `SPIKE-03` Find and document the level behavior path
  - likely targets: level model, level UI panel / tabs, visibility logic
- `SPIKE-04` Identify the cleanest UI-touch points for a side inspector or lighter property workflow

### Exit criteria

- we know where the first product-critical changes belong
- we can rank the first code adaptations by risk

## M1: Landscape Planning Baseline

### Goal

Adapt the stock home-planning base so it feels intentionally usable for outdoor/site planning.

### Why second

This is the biggest product-fit gap after the pivot:

- outdoor areas work now, but still feel partially borrowed from indoor semantics

### Deliverables

- area opacity control
- improved outdoor naming / defaults where practical
- optional area smoothing experiment
- improved underlay friendliness for outdoor planning

### First engineering spikes

- `SPIKE-05` Add room / area opacity control
  - model property
  - property panel control
  - 2D renderer support
- `SPIKE-06` Explore area smoothing for planting beds / lawns
  - prototype only
  - decide slider vs toggle vs defer
- `SPIKE-07` Review whether the word `room` can be softened in key UI surfaces without a massive rewrite
- `SPIKE-08` Validate whether calibration input can support feet in addition to inches

### MVP target from this milestone

Users should be able to create:

- patios
- driveways
- planting beds
- lawns / open areas

with enough visual control that the result already feels like a real site plan.

### Exit criteria

- outdoor areas no longer feel obviously trapped in stock indoor defaults
- at least one visual control improvement is proven in code

## M2: Library and Content Upgrade

### Goal

Replace the weakest part of the current experience: generic-looking content libraries.

### Why third

The spikes showed that:

- object behavior is already strong
- symbol quality is the bigger professionalism risk

This means content work should happen early, not late.

### Deliverables

- curated Phase 1 plant library
- curated outdoor object library
- cleaner architectural symbols where needed
- category strategy for:
  - plants
  - trees
  - hardscape / outdoor living
  - doors / windows

### First engineering spikes

- `SPIKE-09` Define the Phase 1 library schema
  - naming
  - categories
  - metadata
  - preview expectations
- `SPIKE-10` Build a first “good enough” plant starter pack
- `SPIKE-11` Build a first outdoor-feature starter pack
- `SPIKE-12` Validate whether custom 2D top-view assets can be improved without deep engine changes

### MVP target from this milestone

The product should no longer depend on stock libraries alone to look credible.

### Exit criteria

- at least one custom plant library looks clearly better than the stock experience
- at least one mixed building + landscape sample looks product-ready enough to show

## M3: Layer-Like Workflow and Project Organization

### Goal

Make levels behave more like practical 2D planning layers for your workflow.

### Why fourth

This matters a lot, but it should follow once the core mixed-plan editing and content look credible.

### Deliverables

- flatter level defaults for landscape work
- clearer naming / setup workflow
- lock behavior or equivalent protection behavior
- visibility workflow that feels more like plan organization than floor-stack modeling
- explicit level visibility in placed-object lists
- a drawn-area / room inventory list with level visibility

### First engineering spikes

- `SPIKE-13` Validate lock behavior options for levels / objects / reference content
- `SPIKE-14` Change default level creation behavior for flat-plan workflows
- `SPIKE-15` Investigate whether level reordering is feasible enough for MVP or should defer
- `SPIKE-16` Define a “reference”, “existing”, “proposed”, “plants” starter grouping template
- `SPIKE-16A` Expose a `Level` column in the furniture / object inventory
  - source pass result: the stock furniture table already supports `LEVEL`
  - first implementation pass: make `Level` visible by default for new homes
  - live validation still needed from a runnable local build
  - keep the column user-toggleable if the stock display-property menu remains intact
- `SPIKE-16B` Define and prototype a room / area inventory panel
  - include at minimum:
    - name
    - level
    - area
    - floor shown
    - area label shown
  - validate whether this should live as a new table, inspector section, or secondary panel

### MVP target from this milestone

Users should be able to organize a project in a way that feels close enough to:

- reference
- existing
- proposed
- plants
- annotations
- with a clear way to see which level a placed object or drawn area belongs to

even if it is still implemented on top of adapted `Sweet Home 3D` levels.

### Exit criteria

- the user can manage a project without fighting architecture-oriented level assumptions
- the user can tell what level an object or area resides on without guessing
- the user can review both placed objects and drawn areas in list form

## M4: Output and Annotation Refinement

### Goal

Improve the deliverable quality of plans for both draft and presentation use.

### Why fifth

The output is already acceptable, so this is important but not the first risk to attack.

### Deliverables

- better text wrapping
- improved annotation behavior
- easier black-and-white / draft output
- clearer PDF / print expectations

### First engineering spikes

- `SPIKE-17` Add width-based wrapped text behavior
- `SPIKE-18` Prototype a one-click draft / monochrome mode
- `SPIKE-19` Validate whether a persistent inspector is worth adding for text/object properties in Phase 1
- `SPIKE-20` Define MVP print / export presets

### MVP target from this milestone

Users should be able to produce:

- a readable draft-style plan
- a cleaner color presentation plan

without fragile manual tweaking every time.

### Exit criteria

- annotation and output workflows feel intentional rather than workaround-heavy

## M5: UI Cleanup and MVP Packaging

### Goal

Make the app feel simpler and more productized without overcommitting to a full shell rewrite.

### Why last

UI cleanup should package proven product behaviors, not guess at them too early.

### Deliverables

- lighter workflow around the most common tasks
- reduced friction in property editing
- clearer plan setup path
- clearer mode / category guidance 

### First engineering spikes

- `SPIKE-21` Identify the minimum sidebar / inspector improvements that create the biggest clarity gain
- `SPIKE-22` Prototype one small workflow-focused UI pass rather than a whole-shell rewrite
- `SPIKE-23` Define what stays stock in Phase 1 versus what gets lightly branded / reorganized

### MVP target from this milestone

The product should feel:

- simpler than stock `Sweet Home 3D`
- more intentional for architecture + landscape work
- not necessarily fully custom yet

### Exit criteria

- MVP can be shown as a coherent product direction, not just an engine experiment

## Priority Order of First Engineering Spikes

If we want the shortest path to meaningful proof, these should happen first:

1. `SPIKE-01` Area / room rendering path map
2. `SPIKE-02` Text rendering path map
3. `SPIKE-03` Level behavior path map
4. `SPIKE-05` Area opacity control prototype
5. `SPIKE-09` Phase 1 library schema
6. `SPIKE-10` First custom plant starter pack
7. `SPIKE-13` Level lock / protection feasibility
8. `SPIKE-17` Wrapped text prototype
9. `SPIKE-18` Draft / monochrome mode prototype

## What Is Mostly Content / UX vs Code

### Mostly content / UX

- better plant libraries
- better outdoor object libraries
- category organization
- project templates
- naming refinement
- presentation polish

### Likely code changes, but moderate scope

- area opacity control
- wrapped text
- flatter level defaults
- draft-mode helper
- small property-panel improvements
- exposing `Level` in the object inventory
- adding a room / area inventory panel

### Likely deeper or higher-risk code work

- true level-lock behavior if not already latent in the model
- full semantic renaming of indoor concepts throughout the app
- very custom shell behavior beyond light UI cleanup
- advanced curved-area editing if smoothing becomes fully interactive

## Suggested Implementation Rhythm

Recommended pattern:

1. Run one focused spike.
2. Capture what changed and whether it worked.
3. Update the roadmap or MVP assumptions.
4. Only then move to the next spike.

This will keep us from accidentally rebuilding too much at once.

## Best Immediate Next Step

Begin `M0` with a short codebase-boundary pass and produce:

- a `Sweet Home 3D source map for Phase 1 changes`

That source map should identify the exact files and classes for:

- area opacity
- wrapped text
- level defaults / lock behavior
- 2D output rendering
- property-panel customization
