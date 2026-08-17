# Sweet Home 3D UI Customization Boundary Map

Date: August 14, 2026

## Goal

Define how far `Sweet Home 3D` can likely be pushed toward a cleaner, landscape-focused product UI, and clarify which kinds of UI work are low-risk versus which likely require a true fork.

This note focuses on three questions:

1. What can likely be changed easily?
2. What likely requires a fork?
3. What should we preserve in Phase 1 if we want a UI closer to the current mockups?

## Overall Read

`Sweet Home 3D` appears to have a stronger semantic editing foundation than `QCAD`, but its stock interface is still shaped like a traditional Swing desktop application for home planning.

That means:

- the underlying product behaviors may fit well
- the stock UI may still feel cluttered or old-fashioned
- meaningful UI reshaping is plausible
- but the deeper the reshaping goes, the more this becomes a product fork rather than a safe plugin-style extension

## What Can Likely Be Changed Easily

These are the areas that appear relatively safe to adapt early, because they mostly affect framing, naming, organization, and presentation.

### 1. Product branding and copy

Likely easy:

- app name
- window titles
- menu wording
- toolbar labels
- inspector labels
- mode names
- library category labels

Why:

- these are usually shallow presentation-layer changes
- they help immediately reduce the "home design app" feeling

### 2. Default visible workflow and panel emphasis

Likely easy to moderate:

- choose which panels are emphasized
- de-emphasize secondary tools
- set more opinionated defaults
- simplify first-run workflow
- foreground 2D plan editing and hide 3D-first habits where possible

Why:

- this can often be done without replacing core editing widgets
- it improves usability without destabilizing the model

### 3. Library organization and category structure

Likely easy to moderate:

- re-group object libraries around the target workflow
- separate architectural and landscape categories
- provide cleaner starter catalogs
- use more focused content naming

Examples:

- `Walls / Doors / Windows`
- `Plants`
- `Beds / Areas`
- `Outdoor Living`
- `Hardscape`
- `Reference / Annotation`

Why:

- a lot of product feel comes from the browser and library structure, not just from code

### 4. 2D visual styling

Likely moderate:

- cleaner default colors
- improved 2D symbols
- better line and fill defaults
- more landscape-appropriate textures and patterns

Why:

- even if the editing mechanics remain similar, changing the 2D presentation can make the app feel much more purpose-built

## What Likely Requires a Fork

These are the areas that should be treated as "custom product work," not simple extension work.

### 1. Rebuilding the main application shell

Likely requires a fork:

- replacing the stock multi-pane layout with a custom shell
- building a layout close to the HTML mockups
- introducing a very custom left workflow rail, top command strip, and right contextual inspector

Why:

- this goes beyond content and labels
- it changes how the application is structurally framed
- it likely touches core Swing view layout rather than just controller logic

### 2. Large-scale toolbar and menu redesign

Likely requires a fork:

- removing major stock tools cleanly
- replacing menus with a strongly productized command model
- restructuring tool access around the new mode system

Why:

- at this point, we are no longer just tuning defaults
- we are shaping the app into a different product

### 3. Contextual object popups and direct-manipulation UX

Likely requires a fork:

- SmartDraw-like contextual mini-panels near selected objects
- custom object grips beyond stock editing behavior
- richer on-canvas direct manipulation for plants, windows, doors, and landscape objects

Why:

- this kind of interaction usually depends on view-level customization
- it is central to the product UX and hard to bolt on superficially

### 4. Custom level-to-layer behavior

Likely requires a fork or deeper controller/model customization:

- adding true lock behavior
- adding print-on / print-off behavior beyond stock level visibility
- making levels behave more like CAD layers in selection and output logic

Why:

- this crosses from presentation into document behavior and editing rules

### 5. Deep terminology replacement of interior-specific workflows

Likely requires a fork once it goes beyond labels:

- reworking workflows that are conceptually tied to floors / stories / rooms / home furniture
- reshaping those experiences into building + landscape workflows

Why:

- at some point, changing words is not enough
- the interaction and controller assumptions also need to change

## What We Should Preserve in Phase 1

If we want a UI closer to our mockups, we should still be careful not to throw away the strongest existing foundations too early.

### 1. Preserve the semantic editing engine

Preserve:

- wall editing
- hosted door / window behavior
- object placement logic
- object selection and resize behavior

Why:

- these are exactly the capabilities that made `Sweet Home 3D` attractive as a pivot target

### 2. Preserve the 2D plan component

Preserve:

- the existing 2D plan view as the editing core

Why:

- it already solves the hardest geometric and semantic editing problems better than our QCAD prototype path
- Phase 1 should wrap it, not replace it

### 3. Preserve the object catalog foundation

Preserve:

- catalog mechanics
- category system
- placed-object semantics

Why:

- plants, doors, windows, and outdoor content can all benefit from this immediately

### 4. Preserve the simplest useful level behavior

Preserve:

- named visibility groups
- visible / viewable controls

Why:

- this is enough to test whether levels can serve as practical layer-like groups
- we should not destabilize the level model before that is proven inadequate

### 5. Preserve stock workflows where they are already good enough

Preserve:

- dimension editing
- background image import
- scale setup
- printing / export pathways

Why:

- these are important and already broadly aligned with the target product

## Recommended UI Strategy for Phase 1

The best Phase 1 approach is likely:

1. Keep the stock 2D editing core.
2. Replace or simplify as much framing UI as practical.
3. Reorganize content and terminology around the target workflow.
4. Introduce a cleaner contextual inspector and lighter library experience.
5. Defer full shell replacement until we prove the simpler product layer is still not enough.

In other words:

- do not start by rebuilding everything
- start by making the app feel more purpose-built with moderate structural changes
- reserve deep shell surgery for Phase 2 if needed

## Relationship to the Mockups

The current mockups suggest a product with:

- a guided left workflow area
- a calm top command strip
- a strong right inspector
- a cleaner and more modern visual rhythm

Those ideas still appear valid.

However, Phase 1 should interpret them as direction, not as a requirement to reproduce the HTML layouts exactly.

The most realistic Phase 1 target is:

- preserve the stock 2D editor core
- simplify the surrounding shell
- reshape the side panels, labels, categories, and editing emphasis toward the mockup language

## Bottom Line

`Sweet Home 3D` looks flexible enough to support a serious product pivot, but only if we treat UI customization in two layers:

- `easy / moderate customization` for branding, structure, categories, labels, defaults, and visual styling
- `fork-level customization` for a truly custom shell, contextual object UX, and CAD-like layer behavior

For Phase 1, the best move is not to replace the whole UI immediately.

It is to:

- preserve the strong semantic editing core
- improve the app framing substantially
- keep the mockups as the target product direction
- delay full shell replacement until product evidence justifies it
