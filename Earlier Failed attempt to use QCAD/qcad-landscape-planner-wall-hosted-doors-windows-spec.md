# QCAD Landscape Planner Wall-Hosted Doors and Windows Spec

Date: August 12, 2026

## Goal

Define the expected user behavior for doors and windows in the app.

These should behave as wall-hosted architectural objects, not as loose symbols and not as manual CAD openings that the user must cut first.

For MVP direction, these walls may be either:

- exterior building walls
- interior room walls
- attached built structures such as garages or lanais

## Product direction

Primary workflow:

- user clicks `Doors` or `Windows` from the top command strip
- the app focuses the matching architectural library section
- the app may show a small anchored subtype picker for quick variant choice
- user drags a door or window onto a wall
- the object snaps to the wall
- the object aligns to the wall automatically
- the wall opening is created automatically if needed

Secondary workflow:

- user may use a manual opening / gap tool for special cases
- this is a fallback utility, not the main user-facing behavior

## Core principle

For this product, doors and windows should feel like intelligent placed objects.

The user should think:

- "place a door on this wall"
- "place a window on this wall"

The user should not need to think:

- "cut a gap first"
- "rotate the symbol manually to match the wall"
- "move separate line segments to fake an opening"

## Expected placement behavior

### 1. Drop onto wall

When a door or window is dragged or placed onto a wall:

- the app detects the nearest valid wall segment
- the object snaps onto that wall
- the object rotates to match the wall angle
- the object centers itself on the cursor drop point projected onto the wall

If the cursor is not near a valid wall:

- placement should not silently fail
- the app should either:
  - show a preview as invalid and refuse placement
  - or place as an unhosted symbol only if the user explicitly chooses that mode

Recommended MVP rule:

- doors and windows require a wall target
- if no wall is found, placement is canceled with a simple message

### 2. Automatic opening behavior

When placed on a wall, the door or window should automatically create its wall opening.

For MVP this means:

- the hosted object knows its opening width
- the wall geometry is split around that width
- the wall gap is centered on the insertion point unless otherwise specified

Door/window placement should therefore behave like:

- place symbol
- create opening
- keep both logically linked

## Alignment behavior

### 3. Orientation

On placement, the object should:

- align to wall direction
- face one side of the wall or the other
- support flipping handedness

For doors, this includes:

- swing orientation
- hinge side
- interior / exterior facing

For windows, this includes:

- wall alignment
- optional inside / outside bias if needed later

Recommended MVP controls:

- `Flip`
- `Reverse Swing` for doors
- `Center on Wall`

Preferred later refinement:

- when a hosted door or window is selected, show a small contextual popup near the object
- this popup should expose the most common orientation edits without forcing the user into the sidebar
- for single-swing doors, the first priority quick actions are:
  - hinge left / hinge right
  - open inward / open outward
- the sidebar or Properties area should remain available for repositioning, deletion, and other secondary edits
- this should behave like a lightweight selection bubble, not a large floating inspector

## Editing behavior

### 3A. Selected-object quick controls

When a hosted door or window is selected, the app should eventually prefer two editing layers:

- a compact on-canvas or near-object quick-control popup for the most obvious directional edits
- a secondary sidebar editor for numeric and less-frequent changes

Recommended division of responsibility:

- quick popup:
  - hinge side
  - inward / outward swing
  - possibly flip / mirror for windows later
- direct on-canvas handles:
  - drag width wider or narrower on the selected object itself
  - preview the hosted opening change live during the drag
  - update the shown width property in real time while dragging
- sidebar editor:
  - reposition along wall
  - remove
  - advanced metadata or future style settings

This is preferred because hosted objects are interactive architectural elements, and their most common edits should feel direct and visual.

### 4. Moving a hosted door/window

If the user drags a hosted door/window along the same wall:

- it should remain attached to that wall
- the opening should move with it
- the wall gap should update automatically

If the user drags it near a different wall:

- MVP recommendation: require explicit re-hosting rather than guessing
- later version: allow snap-transfer to another wall with preview

### 5. Deleting a hosted door/window

If the user deletes the object:

- the associated wall opening should close automatically
- the wall geometry should heal back together when possible

### 6. Resizing a hosted door/window

If the width changes:

- the opening width should update
- the wall gap should update

If only display properties change:

- the opening should remain unchanged

Expected resize paths:

- user can drag a width handle on the placed door/window in the drawing
- user can type a new width in the Properties panel

Both resize paths should behave the same way:

- the placed object width updates
- the wall opening width updates
- the displayed drawing updates immediately
- the Properties panel reflects the new width
- while the user is dragging a width handle, the numeric width display should update live

Recommended MVP rule:

- width is the primary editable size for hosted doors/windows
- width edits are bidirectional between canvas interaction and Properties
- width is not a "deep edit"; it is a primary direct-manipulation edit

If the user drags the object wider:

- the door/window should widen in the drawing
- the `Width` property should update to match
- the wall gap should widen accordingly

If the user enters a wider width in Properties:

- the door/window should widen in the drawing
- the wall gap should widen accordingly
- the object should remain centered on its current insertion point unless the user chooses another anchor mode later

## Library behavior

Doors and windows should come from the same underlying library system as other content, but they need special runtime behavior.

That means:

- they are stored as library items
- they have thumbnails and metadata like other symbols
- but they are inserted through a hosted-placement workflow rather than as simple free symbols
- the `Doors` and `Windows` command-strip buttons should act as focused architectural entry points into that library system
- subtype choice should prefer a small anchored picker near the command strip rather than a large modal window

## Required metadata

Each door/window library item should support at least:

- `id`
- `name`
- `category`
- `previewSymbol`
- `defaultWidth`
- `hostType`
- `openingWidth`
- `frameWidth`
- `defaultWallOffset`
- `canFlip`
- `canReverseSwing`

Recommended values:

- `hostType`: `wall`
- `defaultWidth`: initial placed width before user edits
- `openingWidth`: clear opening width to remove from wall
- `frameWidth`: displayed object width
- `defaultWallOffset`: how the symbol sits relative to wall centerline or wall face

Door-only metadata:

- `swingType`
- `hingeSide`

Window-only metadata:

- `windowType`

## Wall relationship model

Each hosted door/window instance should store:

- `hostWallId`
- `hostPosition`
- `hostDistanceAlongWall`
- `rotation`
- `width`
- `openingWidth`
- `isFlipped`
- `swingState`

This is important because the object should not just be drawn at coordinates.
It needs to remember which wall it belongs to.

## Visual behavior

### 7. Draft output

In black-and-white drafting output:

- doors should show simplified swing graphics
- windows should show a simplified opening symbol
- wall gaps should be clear and legible

### 8. Color presentation output

In color output:

- door/window linework may remain mostly technical
- emphasis should still be on clear top-down readability
- styling should not obscure the wall opening

## MVP rules

For MVP, keep this intentionally simple:

- support only straight wall segments as valid hosts
- support only one host wall per door/window
- support one automatic opening per placed object
- support move, delete, flip, drag-resize, and width update in Properties
- support drag/place from architectural library

Do not require in MVP:

- curved wall hosting
- complex wall joins
- automatic corner conflict resolution
- multi-wall spanning windows
- nested opening hierarchies
- parametric door families

## Error handling

If placement is invalid:

- message should be plain language
- no CAD jargon

Examples:

- `Place this door on a wall.`
- `No wall found under the cursor.`
- `This wall is too short for that window.`

## Manual opening tool

The manual opening / gap tool still has value, but it should be treated as:

- a geometry helper
- a fallback for special edits
- a prototype proof that wall gap logic is feasible

It should not be the main architectural workflow for most users.

## Implication for next wall tool

This spec implies the wall tool should eventually provide:

- stable wall identity per segment
- wall thickness
- wall style properties
- editable wall geometry
- a way for hosted objects to remain attached during edits

That is why wall-hosted doors/windows should be defined before the full wall-tool prototype.

## Recommended MVP user flow

1. Draw wall
2. Open architectural library
3. Drag door or window onto wall
4. See snap preview
5. Release to place
6. Wall gap appears automatically
7. Select object to edit width, flip, swing, or delete
8. Optionally drag-resize the placed object or type a new width in Properties

## Product decision

Recommended product behavior:

- doors and windows are hosted architectural objects
- wall openings are created automatically during placement
- manual gap/opening tools remain secondary

This should be the default UX going forward.
