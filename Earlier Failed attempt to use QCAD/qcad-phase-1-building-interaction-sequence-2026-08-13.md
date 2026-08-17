# Phase 1 Building Interaction Sequence

Date: August 13, 2026

## Purpose

Turn the refined `Walls / Doors / Windows` interaction decisions into a concrete first implementation sequence.

This sequence only covers the five items we recently refined:

- `BUILDING-00`
- `BUILDING-01`
- `LIBRARY-03`
- `BUILDING-03`
- `BUILDING-05`

## Recommended order

### 1. `BUILDING-00`

Implement the Building-mode command strip entry pattern first.

Why first:

- it establishes the visible product language
- it defines where `Walls`, `Doors`, and `Windows` live
- it creates the routing contract between the command strip and the rest of the shell

What should exist at the end:

- `Walls`, `Doors`, and `Windows` appear in Building mode
- `Walls` launches the wall workflow
- `Doors` and `Windows` can trigger architectural library focus
- a thin hook exists for future anchored picker behavior

### 2. `BUILDING-01`

Implement the single Walls tool next.

Why second:

- the wall tool is the core geometry foundation for the rest of the building workflow
- hosted doors and windows have no meaningful target until walls exist
- this is where exterior and interior wall support becomes real

What should exist at the end:

- one wall tool supports both exterior and interior walls
- walls can be drawn reliably enough for test floor plans and house shells
- basic wall defaults are respected

### 3. `LIBRARY-03`

Implement the library browser UI next, with explicit architectural focus behavior.

Why third:

- hosted doors and windows need a believable source of selectable content
- this step proves the user can move from command-strip intent to categorized content browsing
- it keeps broader symbol strategy aligned before hosted-object work starts

What should exist at the end:

- categorized library browsing works
- doors and windows are visually distinct architectural sections
- the `Doors` and `Windows` command-strip actions can focus those sections

### 4. `BUILDING-03`

Implement hosted Doors and Windows after walls and library focus both exist.

Why fourth:

- this is the first point where the full end-to-end hosted workflow can be tested
- dependencies are now satisfied by real user-facing behavior, not just specs

What should exist at the end:

- user can pick a door or window
- user can place it on a wall
- the object hosts correctly
- the opening is created automatically

### 5. `BUILDING-05`

Implement full anchored subtype pickers last within this Phase 1 slice.

Why fifth:

- the product can already function with simpler defaults before this refinement
- picker behavior should be built after we know wall and hosted-object flows are stable
- this reduces the risk of polishing the wrong subtype UX too early

What should exist at the end:

- `Walls`, `Doors`, and `Windows` each support a lightweight anchored picker
- the picker behaves like a dropdown or popover, not a modal
- picker choices affect the next draw or placement action predictably

## Recommended Phase 1 milestone definition

Phase 1 is successful when a user can:

1. enter Building mode
2. see `Walls`, `Doors`, and `Windows` in the command strip
3. draw exterior and interior walls with one wall tool
4. focus the architectural library through `Doors` and `Windows`
5. place a hosted door or window on a wall
6. use anchored subtype pickers for common variants

## Practical interpretation

This means the preferred order is:

1. `BUILDING-00`
2. `BUILDING-01`
3. `LIBRARY-03`
4. `BUILDING-03`
5. `BUILDING-05`

## Important nuance

`BUILDING-00` should only establish the command-strip entry pattern and minimal routing hooks.

It should not try to deliver the full anchored-picker experience by itself.

That fuller picker behavior belongs in `BUILDING-05`, after the wall and hosted-object flows are already working.
