# QCAD Customization Boundary Map

Date: August 12, 2026

## Purpose

This document summarizes what currently appears:

- clearly script-customizable
- likely script-customizable with more testing
- likely to require deeper plugin or source changes

It is based on local inspection of the installed QCAD app bundle at:

- `/Applications/QCAD.app`

Target version identified:

- `QCAD 3.32.9`

## Evidence used

The assessment is based on:

- `Info.plist` bundle inspection
- app bundle directory inspection
- bundled script examples under:
  - `/Applications/QCAD.app/Contents/Resources/scripts`
- bundled libraries and templates under:
  - `/Applications/QCAD.app/Contents/Resources/libraries`
- symbol and string inspection of:
  - `libqcadjsapi.dylib`

## Key local findings

### 1. QCAD clearly exposes a scripting surface

Evidence:

- bundled script examples exist in `Resources/scripts/Misc/Examples`
- bundled script readme explicitly says scripts in this folder override scripts in plugins
- bundled QCAD JavaScript-related binaries exist:
  - `libqcadscripts.dylib`
  - `libqcadjsapi.dylib`
  - `libqcadproscripts.dylib`

Conclusion:

- script-level extension is real and intended, not accidental

### 2. QCAD ships with built-in libraries and templates

Evidence:

- bundled part libraries exist in `Resources/libraries/default`
- bundled templates exist in:
  - `Resources/libraries/templates/metric`
  - `Resources/libraries/templates/imperial`

Conclusion:

- content-driven customization is very likely practical

### 3. QCAD scripts can register UI actions and menus

Evidence from local examples:

- `RGuiAction(...)`
- `EAction.getSubMenu(...)`
- `action.setWidgetNames([...])`
- `RMainWindowQt.getMainWindow()`

Conclusion:

- adding commands and wiring them into menus is clearly scriptable

### 4. QCAD scripts can create Qt widgets

Evidence from local examples:

- `QtExamples/ExWidget`
- `MyWidget.js`
- use of `QWidget`, `QUiLoader`, `QVBoxLayout`

Conclusion:

- custom widget-based UI from script is clearly possible at some level

### 5. QCAD scripts can manipulate document objects

Evidence from local examples:

- `ExAddLayer.js` creates a layer with:
  - `RLayer`
  - `RModifyObjectsOperation`
- layer custom properties are demonstrated
- document and layer queries are demonstrated

Conclusion:

- layer and document operations are clearly scriptable

## Boundary assessment

## A. Clearly script-customizable

These areas have strong local evidence from bundled examples or exposed APIs.

### A1. Add custom commands and actions

Confidence: `High`

Why:

- example scripts create `RGuiAction`
- scripts bind to menus with `setWidgetNames`

Implication for our app:

- custom actions such as `Calibrate Scale`, `Place Tree`, or `Switch to Planting Mode` are likely viable from script

### A2. Add or extend menu structure

Confidence: `High`

Why:

- examples use `EAction.getSubMenu(...)`
- examples initialize menu items at startup

Implication for our app:

- adding a top-level app menu or submenus looks practical

### A3. Create simple custom widgets

Confidence: `High`

Why:

- local Qt examples load a `.ui` file into a `QWidget`
- scripts can instantiate and show widgets

Implication for our app:

- dialogs, lightweight utility widgets, and focused tool UIs are plausible at script level

### A4. Layer creation and manipulation

Confidence: `High`

Why:

- layer creation and current-layer switching are shown in bundled examples
- custom layer properties are shown in bundled examples

Implication for our app:

- layer presets, layer metadata, and simple layer workflows are likely feasible

### A5. Entity and drawing operations

Confidence: `High`

Why:

- bundled examples cover draw, modify, block, IO, listener, and layer behaviors

Implication for our app:

- wrapping QCAD geometry tools into a simpler workflow looks plausible

### A6. Register custom import/export logic

Confidence: `Medium-High`

Why:

- local IO examples include importer/exporter registration examples

Implication for our app:

- custom project-side import/export helpers may be script-feasible, at least in part

## B. Likely script-customizable, but still needs proof

These areas look promising, but we do not yet have enough proof from local inspection alone.

### B1. Simplified shell with reduced menus

Confidence: `Medium`

Why:

- menu wiring is clearly scriptable
- but full suppression or deep restructuring of the stock shell is not yet proven

Implication:

- likely feasible to reduce visible commands
- not yet proven that QCAD can be made to feel sufficiently non-CAD without friction

### B2. Workflow mode switching

Confidence: `Medium`

Why:

- custom actions and widgets exist
- but a durable segmented mode control that changes workspace emphasis is not yet proven

Implication:

- likely possible
- needs a hands-on shell prototype

### B3. Custom right-side utility panels

Confidence: `Medium`

Why:

- widgets are clearly possible
- `libqcadjsapi.dylib` exposes `QDockWidget`, `RDockWidget`, and `RMainWindowQt` symbols
- but there is not yet a direct local example of a production-like dock panel workflow

Implication:

- custom dock/panel integration is promising
- docking behavior and maintainability still need proof

### B4. Underlay workflow helpers

Confidence: `Medium`

Why:

- document operations and file operations are scriptable
- but the exact ergonomics of a two-point scale calibration helper are not yet tested

Implication:

- likely feasible
- needs a real user-flow prototype

### B5. User-created categories and symbol management

Confidence: `Medium`

Why:

- QCAD clearly has libraries and templates
- content folders are visible
- but we have not yet proven the cleanest user-writable content path or runtime category management behavior

Implication:

- likely viable
- needs a practical storage and indexing approach

## C. Likely to require plugin or deeper source changes

These areas look riskier and should be treated as potential deeper-work items until proven otherwise.

### C1. Full-shell transformation into a non-CAD-looking app

Confidence: `Medium-High`

Why:

- basic menu and widget customization is clearly possible
- but deeply reshaping the entire application frame may go beyond comfortable script-level extension

Risk:

- may require more compromise in UI ambition than originally hoped

### C2. Native-feeling docked panel system with strong layout control

Confidence: `Medium`

Why:

- dock-related types are exposed in the JS API binary strings
- but no direct local example yet proves the exact panel behavior we want

Risk:

- may need plugin-level work for a polished dock/panel experience

### C3. Rich drag-and-drop from custom library panel to drawing canvas

Confidence: `Medium`

Why:

- custom widgets are possible
- but drag-and-drop placement, preview behavior, and canvas integration are not yet demonstrated locally

Risk:

- may need deeper UI integration than simple scripted dialogs and actions

### C4. Robust app-specific metadata persistence tightly bound to drawing entities

Confidence: `Medium`

Why:

- custom properties exist
- but long-lived app metadata for symbols, variants, categories, and user-imported packs is a bigger system than the local examples show

Risk:

- may require an app-layer sidecar format and careful entity mapping
- script alone may not be enough for a polished persistence model

### C5. Smart wall objects beyond geometry wrappers

Confidence: `Medium`

Why:

- basic wall-like geometry should be scriptable through operations
- but truly smart walls with thickness, openings, fill, and phase behavior may need more than thin scripting wrappers

Risk:

- MVP may need simpler wall tools first

## Current recommendation

At this point, the most realistic expectation is:

- use script-level extension aggressively for:
  - commands
  - menus
  - lightweight widgets
  - document and layer workflows
  - content-driven tools
- expect possible plugin or deeper work for:
  - polished shell transformation
  - dock/panel ergonomics
  - rich drag-and-drop integration
  - long-lived smart metadata

This is still encouraging overall.

## Recommended next proof targets

The next tests should focus on the highest-value uncertainty:

1. shell simplification
2. custom panel/dock viability
3. mode switching behavior

Those will tell us whether the app can feel significantly simpler than stock QCAD.

## Bottom line

QCAD does not currently look like a dead end.

The local evidence strongly suggests that:

- command-level customization is real
- menu-level customization is real
- widget-level scripting is real
- layer/document manipulation is real

The biggest remaining uncertainty is not whether QCAD is extensible at all.

It is whether QCAD is extensible enough to support the degree of UX simplification we want without too much plugin or source-level intervention.
