# UI Interaction Refinement Note

Date: August 13, 2026

## Purpose

Capture the newer UI decisions in a short implementation-oriented form so they guide actual build sequencing.

## Core decision

The MVP should use a simple top command strip with these architectural entry points:

- `Walls`
- `Doors`
- `Windows`

These labels are preferred over more technical wording such as `Building Edge`, `Door Opening`, or `Window Opening`.

## Expected interaction model

### Walls

- `Walls` starts the wall drawing tool
- one wall tool supports both exterior and interior walls
- wall type and style choices appear in a small anchored picker near the command strip
- wall drawing is a geometry workflow, not a library placement workflow

### Doors

- `Doors` focuses the architectural library section for doors
- `Doors` may also open a small anchored subtype picker for common door variants
- the user places a selected door onto a wall as a hosted object
- the wall opening is created automatically

### Windows

- `Windows` focuses the architectural library section for windows
- `Windows` may also open a small anchored subtype picker for common window variants
- the user places a selected window onto a wall as a hosted object
- the wall opening is created automatically

## Preferred UI pattern

- use a small anchored dropdown or popover near the command strip
- avoid large modal dialogs for common subtype selection
- avoid filling the command strip with many symbol-specific buttons

## Hosted-item editing pattern

For selected hosted doors and windows, the preferred long-term pattern is:

- show a small contextual popup near the selected object
- keep only the most common directional edits in that popup
- keep the sidebar as the secondary editor for numeric and less-frequent actions

Recommended quick-popup actions:

- hinge left / hinge right for single-swing doors
- inward / outward swing direction for single-swing doors
- later, a small set of window-specific directional controls if needed

Recommended direct-on-canvas actions:

- drag a selected door or window wider or narrower
- show the width value updating live while the drag occurs
- keep the hosted opening and symbol in sync during the drag

Recommended sidebar actions:

- reposition along wall
- remove
- future detailed properties

This should help reduce button-heavy persistent UI while still keeping advanced edits discoverable.

Working rule:

- popup = fast directional choices
- on-canvas handles = geometric manipulation
- sidebar = secondary precise edits and deeper properties

## Library strategy

Broader placeable content should remain in categorized library sections rather than being promoted to primary top-strip commands.

Examples:

- Doors & Windows
- Countertops
- Beds
- Couches & Sofas
- Tables
- Bathtubs & Showers
- Toilets
- Outdoor Living

## MVP implementation implications

The backlog should treat the following as explicit MVP interaction work:

1. Replace `Building Edge` language with `Walls`
2. Implement one wall tool for exterior and interior walls
3. Add anchored subtype pickers for `Walls`, `Doors`, and `Windows`
4. Make `Doors` and `Windows` focus the matching architectural library sections
5. Keep broader symbol discovery in the library browser

The backlog should also treat the following as a near-term refinement after core hosted behavior is stable:

6. add a contextual hosted-item quick popup for selected doors/windows
7. move common directional edits out of the persistent sidebar when that popup exists

## Recommended build order

1. Implement Building-mode command strip labels and routing
2. Implement wall tool behavior and wall defaults
3. Implement anchored picker framework for tool variants
4. Implement categorized library browser focus behavior
5. Implement hosted doors and windows using the focused library workflow
