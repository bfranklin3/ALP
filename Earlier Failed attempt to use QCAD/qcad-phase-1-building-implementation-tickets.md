# QCAD-Based Landscape Planner Implementation Tickets: Phase 1 Building Interaction

Date: August 13, 2026
Status: Draft

## Purpose

This document turns the Phase 1 `Building` interaction sequence into a concrete engineering ticket set.

It focuses only on the first five refined items:

- `BUILDING-00`
- `BUILDING-01`
- `LIBRARY-03`
- `BUILDING-03`
- `BUILDING-05`

## Related docs

- [qcad-phase-1-building-interaction-sequence-2026-08-13.md](/Users/billfranklin/Documents/ChatGPT/Architecture Landscape CAD App/qcad-phase-1-building-interaction-sequence-2026-08-13.md)
- [qcad-ui-interaction-refinement-note-2026-08-13.md](/Users/billfranklin/Documents/ChatGPT/Architecture Landscape CAD App/qcad-ui-interaction-refinement-note-2026-08-13.md)
- [qcad-landscape-planner-prioritized-mvp-backlog.md](/Users/billfranklin/Documents/ChatGPT/Architecture Landscape CAD App/qcad-landscape-planner-prioritized-mvp-backlog.md)
- [qcad-landscape-planner-ui-wireframe-panel-spec.md](/Users/billfranklin/Documents/ChatGPT/Architecture Landscape CAD App/qcad-landscape-planner-ui-wireframe-panel-spec.md)
- [qcad-landscape-planner-wall-hosted-doors-windows-spec.md](/Users/billfranklin/Documents/ChatGPT/Architecture Landscape CAD App/qcad-landscape-planner-wall-hosted-doors-windows-spec.md)

## Scope

This ticket set is intentionally narrow.

It covers:

- Building-mode command-strip entry behavior
- the first real `Walls` tool slice
- library focus behavior for `Doors` and `Windows`
- hosted door/window placement on walls
- anchored subtype pickers

It does not cover:

- full hardscape drawing expansion
- advanced wall joining heuristics
- schedule generation
- deep furniture / fixture behavior
- post-MVP architectural variants

## Guiding implementation rule

For Phase 1, the interaction model should stay simple:

- one `Walls` tool for both exterior and interior walls
- `Doors` and `Windows` as architectural entry points, not raw CAD opening tools
- broader symbols remain in the library browser
- anchored pickers stay lightweight and should not become full modal workflows

## Ticket overview

Recommended build order:

1. command-strip entry pattern
2. wall drawing baseline
3. architectural library focus behavior
4. hosted door/window placement
5. anchored subtype picker refinement

## Ticket list

### BUILDING-IMP-01

- Priority: `P1`
- Maps to backlog:
  - `BUILDING-00`
- Summary: Build the Building-mode command-strip entry pattern
- Why it matters:
  - this establishes the visible product language and top-level routing contract
- Dependencies:
  - `FOUNDATION-03`
  - `FOUNDATION-05`
- Scope:
  - add `Walls`, `Doors`, and `Windows` to the Building-mode command strip
  - remove or hide older technical wording such as `Building Edge` from the primary Building command strip
  - wire `Walls` to wall-tool launch
  - wire `Doors` and `Windows` to architectural library focus hooks
  - expose only a thin placeholder hook for future anchored picker behavior
- Sub-steps:
  1. update Building-mode command labels in the shell UI
  2. add routing handlers for `Walls`, `Doors`, and `Windows`
  3. connect `Walls` to the current wall-drawing launch path
  4. connect `Doors` and `Windows` to library-panel focus events
  5. add state feedback showing which Building command is active
- Acceptance criteria:
  - Building mode shows `Walls`, `Doors`, and `Windows` in the command strip
  - clicking `Walls` launches the wall workflow
  - clicking `Doors` focuses the door library section
  - clicking `Windows` focuses the window library section
  - the command strip remains compact and does not expand into a general symbol toolbar
- Acceptance tests:
  - enter Building mode and verify the command strip labels read `Walls`, `Doors`, `Windows`
  - click `Walls` and verify wall-tool status appears without opening unrelated dialogs
  - click `Doors` and verify the library panel moves to the doors section
  - click `Windows` and verify the library panel moves to the windows section

### BUILDING-IMP-02

- Priority: `P1`
- Maps to backlog:
  - `BUILDING-01`
- Summary: Implement the first production `Walls` tool slice
- Why it matters:
  - walls are the geometry foundation for both floor plans and landscape-related building outlines
- Dependencies:
  - `DRAW-01`
  - `BUILDING-IMP-01`
- Scope:
  - support one wall tool for both exterior and interior walls
  - respect wall thickness defaults
  - respect active layer and wall style defaults
  - preserve the preferred live-preview direction as much as QCAD allows
- Sub-steps:
  1. normalize wall-tool launch so the Building command strip starts the intended tool consistently
  2. apply active wall defaults before the tool begins
  3. create wall geometry from one user-facing wall action rather than separate exterior/interior tools
  4. ensure resulting geometry is editable and remains identifiable as wall content
  5. report clean status/help text during wall drawing
- Acceptance criteria:
  - one wall tool supports both exterior and interior wall creation
  - walls use the current thickness default
  - walls land on the intended layer/style context
  - walls are editable after creation
- Acceptance tests:
  - draw an exterior shell with the `Walls` tool
  - draw interior partitions with the same `Walls` tool
  - change wall thickness and verify the next wall respects the new value
  - reopen the wall tool multiple times and verify launch behavior is repeatable

### LIBRARY-IMP-01

- Priority: `P1`
- Maps to backlog:
  - `LIBRARY-03`
- Summary: Implement architectural library focus behavior inside the library browser
- Why it matters:
  - hosted doors and windows need a believable, low-friction source of content
- Dependencies:
  - `LIBRARY-01`
  - `BUILDING-IMP-01`
- Scope:
  - visually separate `Doors / Windows` as architectural content
  - allow command-strip actions to focus matching library sections
  - keep broader browsing available for non-architectural categories
- Sub-steps:
  1. define architectural library sections for doors and windows
  2. add UI state that can focus a specific section programmatically
  3. connect `Doors` and `Windows` command-strip actions to that focus behavior
  4. preserve normal browsing for all other categories
  5. show clear thumbnails and labels for architectural items
- Acceptance criteria:
  - doors and windows are visually distinct in the library browser
  - `Doors` focuses the doors section
  - `Windows` focuses the windows section
  - user can still browse other categories normally
- Acceptance tests:
  - click `Doors` from Building mode and verify the library jumps to doors
  - click `Windows` from Building mode and verify the library jumps to windows
  - manually switch to a non-architectural category and verify normal browsing still works

### BUILDING-IMP-03

- Priority: `P1`
- Maps to backlog:
  - `BUILDING-03`
- Summary: Implement hosted door and window placement on walls
- Why it matters:
  - this is the first full end-to-end proof of the architectural object workflow
- Dependencies:
  - `BUILDING-IMP-02`
  - `LIBRARY-IMP-01`
  - `LIBRARY-04`
- Scope:
  - place a selected door on a wall
  - place a selected window on a wall
  - align the placed object to the wall automatically
  - create the wall opening automatically
  - store the host relationship
- Sub-steps:
  1. define minimal hosted-object runtime data for doors/windows
  2. detect valid wall targets during placement
  3. snap the door/window to the chosen wall
  4. create or update the opening geometry
  5. store host-wall linkage for future edits
  6. reject invalid free placement for MVP with a clear message
- Acceptance criteria:
  - doors can be placed on walls
  - windows can be placed on walls
  - the opening appears automatically
  - the object remains linked to the wall after placement
  - invalid off-wall placement is rejected clearly
- Acceptance tests:
  - select a door, place it on an exterior wall, and verify the opening appears
  - select a window, place it on an interior or feature wall, and verify alignment works
  - attempt placement away from any wall and verify a simple failure message appears
  - move or resize a hosted item in the supported MVP path and verify wall behavior updates correctly

### BUILDING-IMP-04

- Priority: `P1`
- Maps to backlog:
  - `BUILDING-05`
- Summary: Implement anchored subtype pickers for `Walls`, `Doors`, and `Windows`
- Why it matters:
  - users need fast access to common variants without leaving the main drawing flow
- Dependencies:
  - `BUILDING-IMP-01`
  - `BUILDING-IMP-02`
  - `BUILDING-IMP-03`
- Scope:
  - add an anchored wall-type picker
  - add an anchored door-type picker
  - add an anchored window-type picker
  - keep these lightweight and tied to the command strip
- Sub-steps:
  1. create reusable anchored-picker UI behavior near the command strip
  2. define first supported wall variants
  3. define first supported door variants
  4. define first supported window variants
  5. apply picker selection to the next drawing or placement action
  6. preserve the ability to keep working without a modal interruption
- Acceptance criteria:
  - `Walls`, `Doors`, and `Windows` each expose a lightweight anchored picker
  - anchored pickers behave like dropdowns/popovers, not modals
  - picker selection affects the next draw/place action predictably
  - picker state is visible enough that the user can understand the current choice
- Acceptance tests:
  - open the wall picker and choose a different wall style, then draw and verify the choice applies
  - open the door picker and choose another door subtype, then place and verify the chosen variant appears
  - open the window picker and choose another window subtype, then place and verify the chosen variant appears
  - verify picker interaction does not block the rest of the shell like a modal dialog

## Recommended handoff checkpoints

Use these checkpoints between tickets:

1. after `BUILDING-IMP-01`
   - confirm the command-strip behavior and labels still feel right
2. after `BUILDING-IMP-02`
   - validate the single-wall-tool direction against both house-shell and floor-plan use cases
3. after `LIBRARY-IMP-01`
   - confirm the architectural library focus behavior feels intuitive
4. after `BUILDING-IMP-03`
   - validate that hosted objects are clearly easier than manual CAD openings
5. after `BUILDING-IMP-04`
   - confirm the anchored picker behavior feels lightweight enough for MVP

## Phase 1 success check

This Phase 1 slice is successful when a user can:

1. enter Building mode
2. use `Walls` to draw both exterior and interior walls
3. click `Doors` or `Windows` and immediately land in the right architectural library section
4. place a hosted door or window onto a wall
5. use a small anchored picker to choose common wall, door, or window variants

## Next refinement after Phase 1

### BUILDING-IMP-05

- Priority: `P2`
- Summary: Add contextual quick controls for selected hosted doors and windows
- Why it matters:
  - hosted-item editing should feel more direct and less button-heavy than a persistent sidebar full of actions
  - common directional edits are easier to understand when shown next to the selected object
- Dependencies:
  - `BUILDING-IMP-03`
- Scope:
  - show a small contextual popup when a hosted door or window is selected
  - support the most common door direction edits there first
  - keep the sidebar as the secondary place for width, reposition, remove, and deeper properties
- Sub-steps:
  1. define the visual style and placement of the contextual popup
  2. map single-swing door actions to compact icon buttons
  3. wire hinge-left / hinge-right behavior
  4. wire inward / outward swing behavior
  5. keep hosted opening geometry intact while those directional edits update
  6. reduce redundant persistent sidebar buttons once the popup is proven
- Acceptance criteria:
  - selecting a hosted single-swing door reveals a small contextual popup near the object
  - the popup exposes hinge-side and inward/outward edits clearly
  - these actions update the symbol and keep the wall opening valid
  - the sidebar still supports numeric and secondary edits without duplicating every quick action
- Acceptance tests:
  - select a placed single-swing door and verify the contextual popup appears nearby
  - toggle hinge side and verify the door graphic updates correctly
  - toggle inward / outward direction and verify the swing updates correctly
  - verify width and reposition still remain available through the sidebar editor
