# QCAD Drawing Initiation Behavior Note

Date: August 13, 2026

## Purpose

This note captures an important interaction detail from the QCAD spike so it does not get lost:

- how drawing initiation behaved in our custom prototype tests
- how the downloaded / shipping QCAD app behaved
- what the ideal behavior should be for the future app

## 1. Behavior in our prototype tests

In the custom prototype shell, when a drawing tool such as `Wall / Building Edge` was launched from the custom right-side dock:

- the first canvas click was usually consumed as a focus / activation click
- the user then had to click again before real drawing began
- this created an unwanted "priming click" before the actual first drawing point

This was tested multiple ways and the extra click still remained.

Tested approaches included:

- direct custom action launch with `setCurrentAction(...)`
- native-style `RGuiAction` registration
- delayed action launch
- repeated drawing-view focus attempts
- MDI subwindow re-activation attempts
- button `pressed`-based launch instead of `clicked`

## 2. Behavior in the downloaded / shipping QCAD app

In the downloaded QCAD app, line drawing behaved better than in our prototype.

Observed behavior:

- the user positions the mouse on the drawing area
- the user clicks the mouse
- when the mouse button is released, line drawing begins immediately
- the user then clicks a second time to finish or place the line

This was not the ideal interaction, but it was clearly better than the prototype behavior because it did not require the extra priming click we saw in the custom dock-launched workflow.

## 3. Ideal behavior for the future app

The ideal wall interaction should be closer to the behavior shown in SmartDraw's floor-plan tooling and to the easier wall tools found in many user-friendly drawing / CAD apps.

Reference:

- [SmartDraw floor plan page](https://www.smartdraw.com/floor-plan/draw-floor-plans.htm)

SmartDraw describes behavior including:

- using the wall tool with `click and drag`
- walls automatically connecting and helping close the outline
- typing exact dimensions directly into the wall label
- later wall adjustment through wall handles and direct dimension editing

The desired wall behavior for our app is:

- the user selects the wall tool
- the user starts the wall immediately with the first real canvas click / drag gesture
- the wall shows a live preview while it is being drawn
- the current wall length is displayed clearly during drawing
- the wall can be given an exact numeric length while drawing or immediately after placement
- the wall length can be edited directly from the on-canvas wall label and from the Properties panel
- walls connect cleanly to other walls and help close outlines automatically when appropriate

In short:

- no wasted priming click
- first real canvas click should count as the first wall point
- live preview should begin immediately
- wall length should be visible while drawing
- wall length should be easy to edit numerically

## 4. Working interpretation

Current interpretation:

- QCAD's native drawing behavior appears better than our custom dock-launched scripted drawing behavior
- the current problem seems tied more to the custom integration path than to QCAD's core drawing engine itself
- the ideal wall experience is still worth documenting clearly, even if MVP initially reaches it only partially

## 5. MVP implication

For MVP, the safer interaction model is a hybrid approach:

- use the custom dock for:
  - modes
  - defaults
  - properties
  - underlay controls
  - workflow guidance
- use native QCAD toolbar / menu / shortcut paths for starting core drawing tools

If fully dock-launched drawing remains a requirement later, it may need deeper plugin or source-level investigation.
