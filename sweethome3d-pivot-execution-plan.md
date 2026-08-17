# Sweet Home 3D Pivot Execution Plan

Date: August 14, 2026

## Goal

Define the first practical execution path if we pivot from the current `QCAD` exploration to a `Sweet Home 3D`-based foundation.

This plan focuses on:

1. first prototypes
2. validation checkpoints
3. milestone order
4. decision gates for whether the pivot is working

## Why This Comes Next

The project is no longer asking only:

- "Can we build this app at all?"

It is now asking:

- "What is the fastest, lowest-risk path to a usable object-based 2D product?"

The pivot execution plan should come before a final Phase 1 MVP feature list because we first need to confirm:

- what `Sweet Home 3D` can do with minimal change
- where UI adaptation is enough
- where deeper product forking is actually required

## Working Assumption

For planning purposes, assume:

- `Sweet Home 3D` becomes the new semantic editing foundation
- the product remains strongly 2D-focused
- 3D is not a Phase 1 priority
- ease of use and object behavior matter more than traditional CAD purity

## Pivot Strategy

The pivot should not begin with a deep rewrite.

Instead, it should follow this progression:

1. prove the stock object model is a good fit
2. prove the stock 2D editor can support the target workflows
3. prove moderate UI adaptation gets us meaningfully closer to the mockups
4. only then decide where a true fork is necessary

## Milestone Order

### Milestone 0: Foundation Validation

Goal:

- prove that `Sweet Home 3D` is genuinely better suited than `QCAD` for object-based editing

Prototype targets:

- walls
- hosted doors
- hosted windows
- named levels used as visibility groups
- reference image import and scale workflow
- printable 2D plan output

Validation questions:

- do walls, doors, and windows already behave close enough to the target interaction model?
- can levels act like usable visibility groups for the product?
- can the plan editor stay 2D-first without fighting the app too much?
- do print / PDF / SVG outputs look acceptable for both draft and presentation usage?

Exit criteria:

- recreate one simple house + site plan sample with mostly stock behaviors
- confirm that semantic object editing feels more natural than in the QCAD prototype

### Milestone 1: Landscape Fit Validation

Goal:

- prove that `Sweet Home 3D` can support the landscape half of the product well enough

Prototype targets:

- plant library categories
- outdoor object categories
- bed / patio / lawn area workflows
- basic landscape textures / fills
- top-down symbolic plant representation

Validation questions:

- can landscape objects feel like first-class content rather than awkward furniture hacks?
- can bed / lawn / patio areas be represented cleanly enough with reused area objects?
- does the resulting 2D output look believable as landscape planning work?

Exit criteria:

- recreate one small landscape/site example with:
  - building outline
  - at least one patio or hardscape area
  - at least one bed or lawn area
  - several placed plants
- confirm the result looks intentional, not improvised

### Milestone 2: UI Adaptation Prototype

Goal:

- prove that the app can be made to feel cleaner and more productized without a full shell rewrite

Prototype targets:

- reduced interior-design wording
- reorganized categories
- simplified visible panels
- stronger 2D-first workflow framing
- a cleaner inspector structure

Validation questions:

- can we materially reduce the clunky stock feeling with moderate UI changes?
- can the app be made to resemble the product mockup direction without replacing the full shell?
- what remains awkward even after cleanup?

Exit criteria:

- one branded prototype state exists that:
  - feels more like an architecture / landscape planning product
  - exposes a clearer workflow
  - reduces stock SH3D clutter

### Milestone 3: Product-Specific Semantic Extensions

Goal:

- add the first truly differentiated behaviors that matter to the target product

Prototype targets:

- plant metadata
- schedule / legend generation
- improved 2D symbols for plants
- better rendering for outdoor objects
- app-level non-selectable / locked reference behavior

Validation questions:

- can the product begin to feel specialized rather than merely re-skinned?
- do plant schedules and object metadata offer real workflow value?
- are we still extending the foundation cleanly, or beginning to fight it?

Exit criteria:

- generate one meaningful plant schedule / object legend from a sample plan
- confirm edited objects still behave robustly after adding metadata and custom rendering

### Milestone 4: Fork Decision

Goal:

- decide whether Phase 1 can ship on a moderate adaptation path or whether a deeper fork is required

Decision question:

- is the remaining UI / interaction gap small enough to defer, or large enough to justify a major shell rewrite?

Possible outcomes:

- `Path A: moderate-adaptation MVP`
- `Path B: deeper fork for Phase 2 shell`

## First Prototypes

These should be done first, in order, because they answer the most important product-risk questions quickly.

### Prototype 1: Stock architectural workflow check

Build / test:

- draw walls
- place doors and windows
- adjust them
- print / export the 2D result

Purpose:

- verify the biggest reason for the pivot

Success signal:

- this feels immediately more natural than the QCAD wall-hosted workflow

### Prototype 2: Stock level-as-layer check

Build / test:

- create named levels such as:
  - `Existing`
  - `Proposed`
  - `Plants`
  - `Reference`
- toggle visibility / viewability
- confirm whether this is enough for early project control

Purpose:

- test whether levels are good enough before trying to replace them

Success signal:

- simple real-plan workflows are manageable without a custom layer engine

### Prototype 3: Outdoor content check

Build / test:

- create a small outdoor planning sample with:
  - patio
  - bed
  - lawn
  - several plants / trees

Purpose:

- verify whether landscape work feels native enough

Success signal:

- the result reads like a landscape plan, not like an interior plan with random outdoor objects

### Prototype 4: Light UI cleanup check

Build / test:

- simplify visible panels
- rename categories and labels
- improve the framing around the 2D editor

Purpose:

- measure how much product feel can be improved before a heavy fork

Success signal:

- users can imagine this becoming the app from the mockups without needing a total rewrite immediately

## Validation Checkpoints

The pivot should be reviewed at four explicit checkpoints.

### Checkpoint A: Better than QCAD?

Ask:

- did the pivot solve the object-model problem enough to justify switching foundations?

If no:

- do not continue the pivot

### Checkpoint B: Good enough for landscape?

Ask:

- can landscape/site planning be made convincing without deeply breaking the stock model?

If no:

- pivot may only support the architectural half cleanly

### Checkpoint C: UI cleanup sufficient?

Ask:

- can moderate UI adaptation get us close enough to the intended product feel for Phase 1?

If no:

- budget for a true shell fork

### Checkpoint D: Extension path still clean?

Ask:

- are plant schedules, better symbols, and simple visibility protections still being added cleanly?

If no:

- reassess whether Sweet Home 3D is being stretched too far

## Recommended Team Mindset

Treat this pivot as:

- a semantic-engine evaluation
- a product-layer adaptation effort

Do not treat it as:

- a full rewrite from day one
- a promise that every landscape-specific object needs a new subclass immediately

The first wins should come from:

- reusing existing object semantics
- cleaning up framing and content
- proving real user workflows

## Risks to Watch

### Risk 1: Levels are not enough as layers

Mitigation:

- test real visibility workflows early
- add lightweight controller protections before deeper model changes

### Risk 2: Outdoor objects still feel hacked

Mitigation:

- invest early in 2D symbol quality and category design
- avoid judging the platform too quickly based on stock furniture visuals

### Risk 3: UI cleanup helps, but not enough

Mitigation:

- separate "moderate adaptation" from "full shell fork"
- make the fork decision explicitly, not emotionally

### Risk 4: The app remains too interior-oriented

Mitigation:

- test with true site / planting examples, not only room layouts
- change terminology and defaults early

## Recommended Next Document After This

After this execution plan, the next best document should be:

- `Sweet Home 3D Phase 1 MVP Feature List`

Why:

- once the prototype order and validation gates are clear, we can define the MVP more confidently
- the MVP list should reflect the pivot assumptions instead of inheriting too much from the `QCAD` path

## Bottom Line

If we switch from `QCAD` to `Sweet Home 3D`, the right first move is not a big rewrite.

It is a structured proof sequence:

1. confirm the stock semantic editing model is better
2. confirm the landscape use case is viable
3. confirm moderate UI adaptation gets us meaningfully closer to the product
4. add only the first truly differentiating extensions
5. then decide how deep the fork needs to go

This gives the fastest path to a grounded pivot decision and the lowest risk of repeating the same kind of platform fight we encountered in the `QCAD` prototype.
