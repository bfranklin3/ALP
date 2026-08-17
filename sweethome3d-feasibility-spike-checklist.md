# Sweet Home 3D Feasibility Spike Checklist

Date: August 14, 2026

## Goal

Validate whether `Sweet Home 3D` is a better foundation than `QCAD` for an easy-to-use, 2D-first architectural and landscape planning product.

This spike should answer:

1. Does the stock semantic object model already solve the hardest editing problems?
2. Can the landscape/site-planning side be made believable without deep rewrites?
3. Can the UI be simplified enough in Phase 1 without a full shell replacement?
4. Are the known weak spots manageable, or do they become blockers?

## Related Documents

- [sweethome3d-pivot-architecture-phase-1.md](/Users/billfranklin/Documents/ChatGPT/Architecture Landscape CAD App/sweethome3d-pivot-architecture-phase-1.md)
- [sweethome3d-ui-customization-boundary-map.md](/Users/billfranklin/Documents/ChatGPT/Architecture Landscape CAD App/sweethome3d-ui-customization-boundary-map.md)
- [sweethome3d-pivot-execution-plan.md](/Users/billfranklin/Documents/ChatGPT/Architecture Landscape CAD App/sweethome3d-pivot-execution-plan.md)
- [sweethome3d-phase-1-mvp-feature-list.md](/Users/billfranklin/Documents/ChatGPT/Architecture Landscape CAD App/sweethome3d-phase-1-mvp-feature-list.md)
- [sweethome3d-mvp-architecture.md](/Users/billfranklin/Documents/ChatGPT/Architecture Landscape CAD App/sweethome3d-mvp-architecture.md)

## Success Definition

The spike is successful if it gives us enough evidence to say one of these clearly:

- `Proceed with Sweet Home 3D as the new foundation`
- `Proceed, but only with a deeper fork assumption`
- `Do not pivot; the platform fit is weaker than expected`

## Checklist Structure

Each section below includes:

- what to test
- what evidence to capture
- what outcome would count as a pass

## 1. Foundation Check: Architectural Object Editing

### Test

- Draw exterior walls
- Draw interior walls
- Place doors on walls
- Place windows on walls
- Reposition doors and windows
- Resize doors and windows
- Flip swing where applicable

### Evidence to capture

- screenshots of stock wall / door / window behavior
- notes on whether objects behave semantically or primitively
- notes comparing this directly to the `QCAD` prototype pain points

### Pass condition

- hosted architectural editing already feels materially more natural than the `QCAD` path
- no large custom abstraction layer appears necessary just to get basic wall-hosted behavior

## 2. Scale and Reference Workflow Check

### Test

- import a background / reference image
- calibrate it using a known distance
- verify that drawing and dimensions respect the scale
- print or preview a scaled plan

### Evidence to capture

- screenshots of reference import and calibration flow
- notes on whether the workflow is understandable enough for the target user

### Pass condition

- the workflow is practical enough for site-plan tracing and basic plan setup

## 3. Level-as-Layer Check

### Test

- create named levels such as:
  - `Existing`
  - `Proposed`
  - `Plants`
  - `Reference`
- toggle visible / invisible
- test viewable behavior
- confirm whether a realistic simple project can be managed with them

### Evidence to capture

- screenshots of named levels
- notes on visibility workflow
- notes on missing behaviors such as lock or print controls

### Pass condition

- levels are good enough to manage simple Phase 1 plans without immediately rewriting the model

## 4. Landscape Content Fit Check

### Test

- create a simple outdoor planning sample with:
  - at least one patio / hardscape area
  - at least one bed or lawn area
  - several plants or trees
  - a few outdoor objects

### Evidence to capture

- screenshots of the plan in progress
- notes on whether areas and plants feel believable in 2D
- notes on what feels native versus hacked

### Pass condition

- the result reads as a real landscape/site plan, even if some object types are still adapted from stock behaviors

## 5. 2D Visual Quality Check

### Test

- evaluate top-down symbols for doors, windows, plants, and outdoor content
- evaluate fills / textures for outdoor zones
- compare monochrome readability versus color presentation appearance

### Evidence to capture

- one black-and-white output sample
- one color output sample
- notes on what would need visual improvement in Phase 1

### Pass condition

- the 2D plan can already look acceptable with moderate styling and content improvements

## 6. Library and Catalog Check

### Test

- inspect stock content categories
- test whether content can be reorganized around:
  - `Doors`
  - `Windows`
  - `Plants`
  - `Hardscape`
  - `Outdoor Living`
- inspect import / extension paths for libraries

### Evidence to capture

- screenshots of library/category behavior
- notes on whether the catalog model feels reusable for the target product

### Pass condition

- the existing content system is good enough to become the product’s library foundation

## 7. Annotation Check

### Test

- add labels
- add text notes
- add dimension lines
- confirm whether annotations remain readable in both home-plan and site-plan examples

### Evidence to capture

- screenshots of annotated examples
- notes on any annotation limitations

### Pass condition

- annotation is sufficient for an MVP without needing a major custom annotation engine

## 8. Output Check

### Test

- print preview
- export to PDF
- export to SVG if practical
- review one monochrome draft-oriented output
- review one color presentation-oriented output

### Evidence to capture

- exported files or screenshots
- notes on output quality and missing controls

### Pass condition

- output is strong enough for an MVP even if CAD-grade print controls are deferred

## 9. UI Adaptation Check

### Test

- inspect which visible UI pieces feel most cluttered
- identify which labels, panels, and categories could be simplified without a full shell rewrite
- estimate whether moderate UI cleanup could get meaningfully closer to the mockups

### Evidence to capture

- screenshots of stock UI pain points
- a short note listing:
  - easy UI cleanup candidates
  - medium-risk UI cleanup candidates
  - fork-level UI changes

### Pass condition

- there is a believable Phase 1 path to a cleaner product feel without immediately rebuilding the whole UI shell

## 10. Schedule / Legend Feasibility Check

### Test

- inspect whether plant-like objects can carry metadata and counts cleanly
- identify how a simple plant schedule or object legend could be generated

### Evidence to capture

- notes on object metadata pathways
- notes on how counts and categories could be grouped

### Pass condition

- a simple schedule / legend system appears achievable in Phase 1 without major model instability

## 11. Codebase Boundary Check

### Test

- identify which parts of the codebase likely support:
  - model adaptation
  - controller adaptation
  - 2D rendering customization
  - UI framing changes
- identify where plugin-safe changes end and product-fork changes begin

### Evidence to capture

- short boundary map notes
- likely source areas to inspect first

### Pass condition

- the first implementation path is clear enough that we can prototype intentionally rather than guessing

## Deliverables

At the end of the spike, we should have:

- one small architectural sample
- one small landscape/site sample
- one mixed sample
- notes on level behavior
- notes on output quality
- notes on UI adaptation boundaries
- a pivot recommendation summary

## Red Flags

Any of these should trigger caution:

- walls / doors / windows feel less robust than expected
- levels are too limiting even for simple projects
- outdoor plans still feel obviously hacked after basic adaptation
- output is too weak for practical draft or presentation use
- moderate UI cleanup still leaves the app feeling too clunky
- the codebase boundaries suggest deeper changes are required immediately

## Decision Gates

### Gate A

After architectural object testing:

- Is `Sweet Home 3D` already better than `QCAD` for the core object-editing problem?

### Gate B

After landscape and area testing:

- Can the product support the site / planting half credibly enough?

### Gate C

After UI and codebase review:

- Is there a realistic Phase 1 adaptation path without a full rewrite?

### Gate D

After output and schedule review:

- Can we produce a useful MVP with acceptable outputs and early differentiation?

## Bottom Line

This spike should be short, evidence-driven, and comparative.

Its purpose is not to perfect `Sweet Home 3D`.

Its purpose is to determine whether:

- the semantic foundation is strong enough
- the landscape adaptation is believable enough
- the UI can be cleaned up enough

to justify pivoting away from the current `QCAD` path.
