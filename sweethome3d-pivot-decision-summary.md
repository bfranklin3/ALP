# Sweet Home 3D Pivot Decision Summary

Date: August 14, 2026

## Recommendation

Recommendation: pivot away from the `QCAD` foundation and proceed with `Sweet Home 3D` as the stronger starting point for Phase 1.

Overall conclusion:

- `Strongly promising`

Reason:

- `Sweet Home 3D` already demonstrates the hardest part of the product vision more convincingly:
  - hosted architectural objects
  - easy object movement and resizing
  - coherent mixed building + site plans
  - usable 2D output in both presentation-style and draft-like form

By contrast, the `QCAD` path repeatedly required fighting a primitive-geometry engine to simulate semantic architectural behavior.

## What Sweet Home 3D Already Proves

### 1. Architectural objects behave like real objects

Day 1 confirmed:

- doors and windows feel like hosted objects
- moving and editing them is already far better than the `QCAD` prototype
- double-click properties are workable now
- the foundation is object-based rather than raw-line-based

This is the single strongest reason to pivot.

### 2. Reference image setup is good enough

Day 1 confirmed:

- background image calibration works
- origin placement works
- the workflow feels straightforward
- geometry respects the expected scale

Main limitation:

- calibration currently prefers inches, which is less natural for landscape use

### 3. Levels are usable as a practical layer-like system

Day 1 confirmed:

- levels can be renamed
- levels can be shown / hidden
- users can organize content across multiple named tabs

Main limitations:

- no true lock behavior yet
- no reordering
- architecture-oriented defaults such as nonzero elevation

These are real gaps, but they feel adaptable.

### 4. Outdoor areas are already believable

Day 2 confirmed:

- patios, planting beds, lawns, and driveways can already read credibly in 2D
- drawing those areas is easy and intuitive
- the visual result is already presentable

Main limitations:

- area semantics still inherit the indoor term `room`
- fill opacity control is missing
- polygon smoothing is missing

### 5. Mixed building + landscape plans work

Day 2 confirmed:

- house, patio, driveway, lawn, planting bed, and objects read coherently in one drawing
- the combined result feels like one product, not two unrelated systems
- even with only moderate symbol quality, the sample looks like a plausible product starting point

### 6. Output quality is already acceptable

Day 2 confirmed:

- color / textured output is presentation-worthy enough for MVP
- grayscale / draft-like output is acceptable, even though it currently relies on workarounds instead of a one-click draft mode

## What Phase 1 Should Adapt

These are the clearest Phase 1 adaptation targets.

### 1. Better object libraries

Need:

- more professional plant libraries
- cleaner outdoor object libraries
- better architectural symbols where current stock assets feel generic

Interpretation:

- the weak stock-library problem is real, but not unique to `Sweet Home 3D`
- better custom libraries are a reasonable product-building task, not a reason to reject the engine

### 2. Better fill controls for outdoor areas

Need:

- room / area opacity control
- richer area textures
- better control of how outdoor areas sit over reference drawings

This would materially improve planting beds, lawns, patios, and concept overlays.

### 3. Better text behavior

Need:

- width-based text wrapping
- more layout-box-like annotation behavior

Current workaround:

- users can force line breaks manually with the `Enter` key

### 4. Better landscape-shape refinement

Need:

- optional smoothing for rough polygon areas such as beds and lawns

This would improve the landscape feel substantially.

### 5. Better layer-like behavior

Need:

- lockable levels or equivalent lock behavior
- flatter defaults for outdoor work
- possibly better control over reordering or visibility workflows

### 6. Better draft-mode output

Need:

- a first-class monochrome / draft toggle

Current status:

- workable through manual settings
- not a blocker for MVP
- worth addressing later

## What We Should Not Overreact To

These issues are real, but they should not block the pivot.

- stock libraries are not polished enough
- the word `room` is not ideal for outdoor spaces
- some UI areas feel dated or clunky
- monochrome mode is not elegant yet

Why these should not block the pivot:

- they are productization problems
- they are not proof that the underlying interaction model is wrong
- the interaction model is exactly where `Sweet Home 3D` is currently strongest

## Remaining Risks

### 1. Landscape semantics are still borrowed from home-planning concepts

Risk:

- if we do not adapt naming, defaults, and controls, the product may feel like a repurposed house planner instead of a native architecture + landscape app

### 2. Library quality may determine perceived professionalism

Risk:

- if custom libraries are not improved early, the product may feel amateur even though its core behavior is strong

### 3. UI modernization still matters

Risk:

- if we preserve too much of the stock `Sweet Home 3D` UI without adaptation, the app may feel clunky compared with the simpler planning experience you want

### 4. Level-to-layer adaptation needs validation

Risk:

- the current level system is promising, but it still needs product-level decisions around locking, defaults, naming, and workflow

## Why Not QCAD

The spike work clarified a deeper issue with the `QCAD` path:

- its core model is geometry-first, not object-first
- walls, doors, and windows had to be simulated on top of primitives
- hosted-item editing repeatedly fought the engine
- even successful experiments felt fragile and increasingly abstraction-heavy

That does not make `QCAD` bad software. It just makes it a weaker fit for the specific product direction now clarified:

- easier object-based editing
- architectural objects that understand hosting and openings
- coherent home + site planning
- usability ahead of pure CAD precision

## Final Recommendation

Proceed with the `Sweet Home 3D` pivot.

Specifically:

1. Treat `Sweet Home 3D` as the preferred Phase 1 engine base.
2. Stop investing primary product-direction effort into the `QCAD` prototype path.
3. Use the next planning pass to define:
   - a `Sweet Home 3D` Phase 1 MVP feature list
   - the first adaptation targets
   - the first code-level feasibility spikes for:
     - custom libraries
     - outdoor area controls
     - text wrapping
     - level / layer behavior
     - UI adaptation boundaries

## Best Next Step

Create:

- a short `Sweet Home 3D Phase 1 implementation roadmap`

That roadmap should convert this recommendation into:

- first engineering spikes
- milestone order
- which changes are UI-only
- which changes require codebase forking
- which improvements can wait until after MVP
