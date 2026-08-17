# Sweet Home 3D Spike Execution Checklist: Day 1

Date: August 14, 2026

## Goal

Run the first day of the `Sweet Home 3D` feasibility spike in a disciplined way.

Day 1 should answer the three most important early questions:

1. Is the architectural object workflow already better than the `QCAD` prototype?
2. Is the reference / scale workflow good enough for real plan setup?
3. Can levels work as practical visibility groups for Phase 1?

## Related Documents

- [sweethome3d-feasibility-spike-checklist.md](/Users/billfranklin/Documents/ChatGPT/Architecture Landscape CAD App/sweethome3d-feasibility-spike-checklist.md)
- [sweethome3d-pivot-execution-plan.md](/Users/billfranklin/Documents/ChatGPT/Architecture Landscape CAD App/sweethome3d-pivot-execution-plan.md)
- [sweethome3d-mvp-architecture.md](/Users/billfranklin/Documents/ChatGPT/Architecture Landscape CAD App/sweethome3d-mvp-architecture.md)
- [sweethome3d-phase-1-mvp-feature-list.md](/Users/billfranklin/Documents/ChatGPT/Architecture Landscape CAD App/sweethome3d-phase-1-mvp-feature-list.md)

## Day 1 Scope

Focus only on:

- architectural object editing
- reference image and scale setup
- levels as visibility groups

Do not spend Day 1 on:

- deep landscape object adaptation
- UI cleanup experiments
- codebase forking or implementation
- schedule / legend behavior

## Deliverables for Day 1

By the end of Day 1, we should have:

- one simple house-plan sample
- one reference-image / scale workflow note
- one level behavior note
- screenshots showing key behaviors
- a Day 1 conclusion:
  - `Strongly promising`
  - `Promising with caveats`
  - `Concerning`

## Preparation

### 1. Confirm the exact Sweet Home 3D build we are testing

- Record the installed app variant
- Record whether it is App Store, open-source build, or another distribution
- Record the app version

Evidence to capture:

- version note
- startup screenshot if useful

### 2. Prepare a simple test project reference

Use one small, simple reference drawing or image if needed for calibration testing.

Good candidates:

- a house floor plan image
- a lot or survey image
- a small plan sample with one known dimension

Evidence to capture:

- file name used
- known dimension used for calibration

## Block 1: Architectural Object Editing

### Objective

Test whether stock `Sweet Home 3D` wall, door, and window behavior already solves the biggest problem we hit in `QCAD`.

### Tasks

1. Start a new blank project.
2. Draw a simple exterior wall layout.
3. Add at least one interior wall.
4. Place one door on an exterior wall.
5. Place one door on an interior wall if supported cleanly.
6. Place at least two windows.
7. Reposition a door along a wall.
8. Reposition a window along a wall.
9. Resize at least one door or window.
10. Flip swing if available.

### Questions to answer

- Do doors and windows feel like real hosted objects?
- Does wall interaction feel semantic rather than primitive-based?
- Is the interaction already more natural than the `QCAD` prototype?
- Are there any obvious stock behaviors that feel like blockers?

### Evidence to capture

- screenshot of walls only
- screenshot of doors/windows placed
- screenshot of at least one object selected / adjusted
- short note on:
  - what felt good
  - what felt awkward
  - whether it is clearly better than `QCAD`

### Pass condition

- architectural object editing is clearly more natural than the `QCAD` path

## Block 2: Reference Image and Scale Workflow

### Objective

Test whether a realistic underlay / calibration workflow exists for the product’s setup needs.

### Tasks

1. Import a background or reference image.
2. Align it as needed in the plan.
3. Set or calibrate scale using a known distance.
4. Add one dimension after calibration.
5. Confirm whether the resulting geometry respects the expected scale.
6. Open print preview if practical.

### Questions to answer

- Is the workflow understandable?
- Would a target user reasonably figure it out with modest product framing?
- Does the setup feel practical for tracing house or site references?

### Evidence to capture

- screenshot of imported reference
- screenshot of scale or dimension confirmation
- note on whether the workflow is:
  - easy
  - acceptable
  - awkward

### Pass condition

- the workflow is good enough for MVP setup without major rethinking

## Block 3: Levels as Visibility Groups

### Objective

Test whether levels are good enough to serve as practical Phase 1 layer-like visibility groups.

### Tasks

1. Create named levels such as:
   - `Existing`
   - `Proposed`
   - `Plants`
   - `Reference`
2. Move or place objects across those levels as practical.
3. Toggle level visibility.
4. Test viewable / non-viewable behavior if relevant.
5. Observe whether the workflow is understandable or awkward.

### Questions to answer

- Can levels manage a simple mixed project cleanly enough?
- Does naming them make the feature understandable in product terms?
- What is missing for MVP:
  - lock
  - print control
  - easier reassignment
  - reordering

### Evidence to capture

- screenshot of named levels
- screenshot of visibility behavior
- short note on:
  - what works
  - what is missing
  - whether the missing pieces are tolerable in Phase 1

### Pass condition

- levels are workable enough that we do not need to replace them immediately

## Day 1 Summary Template

At the end of the session, record:

### 1. Architectural object verdict

- `Strong`
- `Mixed`
- `Weak`

Reason:

- one to three sentences

### 2. Scale / reference verdict

- `Strong`
- `Mixed`
- `Weak`

Reason:

- one to three sentences

### 3. Level-as-layer verdict

- `Strong`
- `Mixed`
- `Weak`

Reason:

- one to three sentences

### 4. Overall Day 1 conclusion

Choose one:

- `Strongly promising`
- `Promising with caveats`
- `Concerning`

### 5. Immediate next step recommendation

Choose one:

- proceed to landscape-content validation
- proceed to UI adaptation review
- stop and reassess the pivot

## Risks to Watch on Day 1

- architectural editing is less fluid than expected
- scale workflow is too hidden or too awkward
- levels are too limiting even in a very simple project
- the app still feels too interior-oriented even before landscape testing begins

## Bottom Line

Day 1 is not about proving the whole product.

It is about proving that the pivot is worth continuing.

If `Sweet Home 3D` wins clearly on:

- architectural object behavior
- scale setup practicality
- workable visibility grouping

then the pivot deserves to move into Day 2 landscape and UI validation.
