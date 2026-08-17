# Sweet Home 3D Spike Execution Checklist: Day 2

Date: August 14, 2026

## Goal

Run the second day of the `Sweet Home 3D` feasibility spike, focused on the biggest remaining pivot question:

- can `Sweet Home 3D` support believable landscape/site planning with acceptable 2D visual quality?

Day 2 should answer:

1. Do outdoor areas such as beds, lawns, and patios work well enough?
2. Do plants and outdoor objects feel usable in a landscape workflow?
3. Can the resulting 2D plan look credible in both black-and-white and color?
4. Does the landscape side feel native enough for Phase 1, or too hacked?

## Related Documents

- [sweethome3d-feasibility-spike-checklist.md](/Users/billfranklin/Documents/ChatGPT/Architecture Landscape CAD App/sweethome3d-feasibility-spike-checklist.md)
- [sweethome3d-spike-execution-checklist-day-1.md](/Users/billfranklin/Documents/ChatGPT/Architecture Landscape CAD App/sweethome3d-spike-execution-checklist-day-1.md)
- [sweethome3d-spike-day-1-findings.md](/Users/billfranklin/Documents/ChatGPT/Architecture Landscape CAD App/sweethome3d-spike-day-1-findings.md)
- [sweethome3d-pivot-execution-plan.md](/Users/billfranklin/Documents/ChatGPT/Architecture Landscape CAD App/sweethome3d-pivot-execution-plan.md)
- [sweethome3d-phase-1-mvp-feature-list.md](/Users/billfranklin/Documents/ChatGPT/Architecture Landscape CAD App/sweethome3d-phase-1-mvp-feature-list.md)

## Day 2 Scope

Focus only on:

- area-based outdoor planning
- plant and outdoor object placement
- 2D visual readability
- draft vs presentation output quality

Do not spend Day 2 on:

- deep codebase inspection
- shell/UI cleanup experiments
- schedule / legend implementation details
- lock / print behavior fixes for levels

## Deliverables for Day 2

By the end of Day 2, we should have:

- one small outdoor/site sample
- one mixed building + landscape sample if practical
- one monochrome output review
- one color output review
- a Day 2 conclusion:
  - `Strongly promising`
  - `Promising with caveats`
  - `Concerning`

## Preparation

### 1. Continue using the correct build

Use:

- `Sweet Home 3D 7.5`

Reason:

- `7.6.6` is the commercialized build and does not allow full object-library use without payment

### 2. Use a simple outdoor planning target

Try to create a compact test case that includes:

- one house footprint or building edge
- one patio or hardscape zone
- one lawn or open area
- one planting bed
- multiple plants or trees
- at least one outdoor furniture / feature object if available

## Block 1: Area-Based Outdoor Planning

### Objective

Test whether `Sweet Home 3D` can represent beds, lawns, patios, and similar outdoor regions cleanly enough for Phase 1.

### Tasks

1. Create one patio or hardscape area.
2. Create one planting bed or similar outdoor region.
3. Create one lawn or open landscape zone if practical.
4. Apply fills, textures, or colors where possible.
5. Observe whether the workflow feels natural or repurposed.

### Questions to answer

- Do outdoor areas feel believable in the 2D plan?
- Does creating them feel straightforward or awkward?
- Do they behave closely enough to what a landscape user would expect?

### Evidence to capture

- screenshot of at least one patio / hardscape area
- screenshot of at least one bed or lawn area
- note on:
  - what felt natural
  - what felt adapted
  - what felt wrong

### Pass condition

- outdoor areas are credible enough for MVP use, even if some semantics still feel borrowed from home-planning concepts

## Block 2: Plant and Outdoor Object Placement

### Objective

Test whether plants and outdoor objects can function as practical landscape-planning content.

### Tasks

1. Place several plant-like objects or tree symbols.
2. Place at least one outdoor object such as a bench, table, grill, or similar item if available.
3. Move and adjust a few of them.
4. Observe whether top-down symbols feel usable.
5. Note whether the content feels like real landscape objects or merely furniture reused outdoors.

### Questions to answer

- Do plants feel acceptable in 2D?
- Are the symbols readable enough for planning work?
- Does object placement still feel easy on the landscape side?
- What content gaps are immediately obvious?

### Evidence to capture

- screenshot of plant placement
- screenshot of at least one outdoor object
- note on:
  - what looks good
  - what looks generic
  - what would need Phase 1 visual adaptation

### Pass condition

- plant and outdoor object placement is usable enough that better symbols and categories could plausibly elevate it into a real product

## Block 3: Mixed Building + Landscape Readability

### Objective

Test whether a combined home + landscape plan reads coherently in one view.

### Tasks

1. Use or create a simple building footprint.
2. Add at least:
   - one patio or hardscape area
   - one planting bed or lawn zone
   - several plants
3. View the result as one integrated plan.

### Questions to answer

- Does the overall plan look coherent?
- Does the building-side and landscape-side content live together naturally enough?
- Does the result look like a plausible target product sample?

### Evidence to capture

- screenshot of the combined plan
- short note on whether the mixed result feels:
  - strong
  - acceptable
  - awkward

### Pass condition

- the integrated plan looks intentionally mixed, not like two unrelated systems colliding

## Block 4: 2D Visual Quality Review

### Objective

Test whether the plan can already look acceptable in monochrome and color, and identify what would need visual improvement in Phase 1.

### Tasks

1. Review the plan in standard 2D view.
2. Evaluate whether door/window symbols remain readable beside landscape objects.
3. Check whether fills, lines, and symbols distinguish areas clearly enough.
4. Note whether anything looks too much like stock interior software.

### Questions to answer

- Is the 2D visual language already workable?
- What needs improvement most:
  - plant symbols
  - area fills
  - hardscape appearance
  - general line styling

### Evidence to capture

- one screenshot of the plan in monochrome-friendly form
- one screenshot of the plan in color or texture-rich form
- short note on visual strengths and weaknesses

### Pass condition

- the 2D plan is visually acceptable enough that Phase 1 styling/content work can carry it the rest of the way

## Block 5: Output Review

### Objective

Test whether the outdoor plan remains usable in actual output, not only on screen.

### Tasks

1. Open print preview if practical.
2. Export or preview one black-and-white-oriented output.
3. Export or preview one color-oriented output.
4. Compare readability between the two.

### Questions to answer

- Does monochrome remain understandable?
- Does color output feel presentation-worthy enough for MVP?
- Are there obvious output limitations that would block Phase 1?

### Evidence to capture

- screenshot or export preview for black-and-white
- screenshot or export preview for color
- note on whether the output is:
  - strong
  - acceptable
  - weak

### Pass condition

- both draft-style and presentation-style outputs appear viable enough for MVP

## Day 2 Summary Template

At the end of the session, record:

### 1. Outdoor areas verdict

- `Strong`
- `Mixed`
- `Weak`

Reason:

- one to three sentences

### 2. Plant / outdoor content verdict

- `Strong`
- `Mixed`
- `Weak`

Reason:

- one to three sentences

### 3. Mixed-plan readability verdict

- `Strong`
- `Mixed`
- `Weak`

Reason:

- one to three sentences

### 4. Visual / output verdict

- `Strong`
- `Mixed`
- `Weak`

Reason:

- one to three sentences

### 5. Overall Day 2 conclusion

Choose one:

- `Strongly promising`
- `Promising with caveats`
- `Concerning`

### 6. Immediate next step recommendation

Choose one:

- proceed to UI adaptation review
- proceed to codebase boundary inspection
- proceed to pivot decision summary
- stop and reassess the pivot

## Risks to Watch on Day 2

- outdoor areas feel too much like indoor rooms
- plants look too much like generic furniture
- mixed home + landscape plans read awkwardly
- monochrome output becomes muddy or unclear
- color output looks too stock or visually weak

## Bottom Line

Day 2 is about answering whether the landscape side is truly viable enough to justify the pivot.

If `Sweet Home 3D` can support:

- believable outdoor areas
- usable plant / outdoor object placement
- readable mixed plans
- acceptable draft and presentation output

then the pivot becomes much more compelling.
