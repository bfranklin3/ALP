# Feasibility Findings

Date Started: August 12, 2026
Status: In progress
Overall Recommendation: TBD

## Purpose

This document captures the results of the QCAD-based landscape planner feasibility spike.

It should be filled in as the spike progresses, using the checklist in:

- [qcad-landscape-planner-feasibility-spike-checklist.md](/Users/billfranklin/Documents/ChatGPT/Architecture Landscape CAD App/qcad-landscape-planner-feasibility-spike-checklist.md)

## Executive Summary

Day 1 and Day 2 results were encouraging, and Day 3 added the first real execution evidence.

We confirmed a local QCAD target at `/Applications/QCAD.app`, version `3.32.9` (`CFBundleShortVersionString 3.32`, `CFBundleVersion 3.32.9`), running as an `arm64` macOS app bundle.

The install layout strongly suggests that QCAD is designed for extension rather than being a sealed black box:

- bundled script resources exist at `Contents/Resources/scripts`
- bundled part libraries and templates exist at `Contents/Resources/libraries`
- QCAD-specific plugin binaries exist in `Contents/PlugIns`
- QCAD JavaScript / script related components are visibly bundled, including:
  - `libqcadscripts.dylib`
  - `libqcadjsapi.dylib`
  - `libqcadproscripts.dylib`

This does not yet prove the full product direction, but it is a good sign for the spike.

Day 2 added stronger evidence that QCAD has a real script-level customization surface:

- local example scripts register custom actions with `RGuiAction`
- local example scripts add menu structure with `EAction.getSubMenu(...)`
- local example scripts attach actions to UI widget targets with `setWidgetNames(...)`
- local Qt examples create custom `QWidget`-based interfaces and load `.ui` files
- local layer examples create layers and set custom properties from script
- `libqcadjsapi.dylib` exposes symbols related to:
  - `RMainWindowQt`
  - `RGuiAction`
  - `QDockWidget`
  - `RDockWidget`

The biggest unknowns after Day 2 are now:

- how much of the stock shell can be reduced cleanly
- whether custom panels and mode switching feel natural enough in practice
- whether drag-and-drop from a custom library panel will be smooth enough
- what the cleanest persistence boundary is for smart symbol metadata

Day 3 produced an important boundary result and then a breakthrough:

- QCAD's `-autostart` path works locally on macOS and bundled command-line examples execute successfully
- our custom shell probes also executed successfully through `-autostart`
- however, QCAD's built-in help clarified that `-autostart` is not normal app startup; it runs a script-defined application instead
- that explains why `RMainWindowQt.getMainWindow()` stayed effectively null and why `NewFile.createMdiChild()` could not reach a ready MDI shell through `-autostart`
- QCAD's `-exec` option runs scripts after starting QCAD normally
- once we switched to `-exec`, the main window became reachable and direct shell manipulation started working
- confirmed through `-exec`:
  - window title update worked
  - custom menu insertion worked
  - custom toolbar insertion worked
  - dock widget insertion worked
- a richer landscape-shell prototype then worked through `-exec` with:
  - branded window title
  - workflow toolbar
  - right-side `.ui`-backed dock
  - mode placeholder update
  - hiding of `CadToolBar`
  - hiding of `StatusBar`
- the first real workflow action prototype also worked in smoke-test form:
  - sample two-point reference line creation
  - known-distance calibration summary
  - computed ratio output of `0.2500` for a `120` measured reference and `30` known distance
- after active-document cleanup, that workflow path now runs cleanly without the earlier missing-document friction in the smoke-tested path
- the latest follow-up prototype moved one step further and proved a simple calibration transform path on real entities:
  - line entities could be rescaled in a live QCAD document
  - the successful smoke-test result reported `scaled 2 lines`
  - a generic direct-entity mutation attempt was not safe, but a delete-and-recreate line path worked reliably in the spike
- the underlay workflow has now been proven in live interaction:
  - a raster image underlay can be imported from the custom shell
  - the underlay is assigned to a dedicated `REFERENCE_UNDERLAY` layer
  - the user can pick two points on the imported image
  - the known-distance dialog appears correctly after the second click
  - entering a different distance visibly rescales the underlay
  - the shell status can report `1 underlays` in the result summary
- a later wall-tool interaction spike clarified an important shell limitation:
  - custom drawing tools launched from the right-side dock still consume the first canvas click as a focus / activation click
  - this remained true after testing:
    - direct `setCurrentAction(...)`
    - native-style `RGuiAction` registration
    - delayed action launch
    - repeated drawing-view focus attempts
    - MDI subwindow re-activation attempts
    - button `pressed`-based launch instead of `clicked`
  - the most likely interpretation is that this is a QCAD dock-to-canvas interaction limitation in the scripting layer, not just a bug in the wall tool code

That means the current blocker is no longer "how do we reach the GUI shell at all?" The real question is now "how polished can the shell become through QCAD's real in-app script lifecycle, and where do binding quirks start to slow us down?"

Suggested summary structure:

- overall result
- strongest positive findings
- biggest constraints
- key blockers
- recommendation

## Result Categories

Use one of these for each major area:

- `Worked well`
- `Worked with friction`
- `Blocked`
- `Unknown`

## Findings by Area

### 1. QCAD customization shell

Status: `Worked with friction`

What we tested:

- located the installed app bundle
- inspected bundle metadata
- inspected bundle structure for scripts, plugins, libraries, and templates
- inspected bundled example scripts
- inspected JS API-related symbols exposed in `libqcadjsapi.dylib`
- ran QCAD's bundled `-autostart` command-line example directly
- ran a custom shell probe script directly through `-autostart`
- ran a post-new / post-open registration probe through `-autostart`
- ran a delayed main-window timer probe through a fresh GUI app launch
- inspected QCAD command-line help locally
- ran multiple in-app shell probes through QCAD's `-exec` path
- ran a richer landscape-oriented shell prototype through `-exec`
- added a first `Site Setup / Scale Reference` starter action into the shell prototype

What worked:

- confirmed a local desktop install exists at `/Applications/QCAD.app`
- confirmed target version `3.32.9`
- confirmed the app includes bundled scripts and QCAD-specific plugin libraries
- confirmed bundled template and library resources already exist
- confirmed script examples visibly create actions, menu entries, widgets, and layer operations
- confirmed the app bundle is not a sealed black box from a scripting perspective
- confirmed `-autostart` works locally when running bundled example scripts
- confirmed a custom local script executes through `-autostart`
- confirmed the runtime exposes `NewFile` with:
  - `addPostNewAction()`
  - `addPostOpenAction()`
  - `createMdiChild()`
- confirmed a file-based logging path works from QCAD scripts when writing to `/tmp`
- confirmed QCAD help text distinguishes:
  - `-autostart` as script-defined app startup
  - `-exec` as script execution after QCAD starts normally
- confirmed through `-exec` that:
  - `RMainWindowQt.getMainWindow()` is reachable
  - `EAction.getMainWindow()` is reachable
  - `setWindowTitle()` works
  - `addMenu()` works
  - `addToolBar()` works
  - `addDockWidget()` works
- confirmed through the richer shell prototype that:
  - a `.ui`-loaded dock can be attached successfully
  - known stock shell pieces can be found by object name
  - `CadToolBar` can be hidden
  - `StatusBar` can be hidden
- confirmed through the scale-reference workflow smoke path that:
  - a sample reference line can be added
  - measured distance can be read from two points
  - known-distance calibration summary can be computed and surfaced in the shell panel
  - active-document setup can be resolved before applying the reference line
  - a prototype calibration transform can rescale line entities in the active drawing
- confirmed through later live interaction that:
  - underlay import / replace / hide / show / lock / unlock can be driven from the custom dock
  - underlay calibration can be driven from the custom dock
  - wall geometry creation is feasible through a custom scripted action
  - wall defaults such as thickness and phase can be wired into a custom dock panel

What was hard:

- no user-level QCAD support/config path was immediately visible under `~/Library/Application Support` before launch-time investigation
- the revision file only exposed a revision hash, not a more human-readable build note
- there is still no direct local proof yet for the exact shell-reduction depth we want
- there is still no direct local example yet for a production-like dock/panel system matching our UI goals
- plain `-autostart` was misleading because it does not represent normal QCAD shell startup
- some JS bindings are uneven:
  - `addDockWidget()` worked, but a `QListWidget`-based content attempt failed
  - `findChild()` exists, but `findChildren()` did not appear on the tested wrapper
  - some familiar Qt reflection-style methods such as `metaObject()` were not callable as expected from the wrapper objects
- the workflow toolbar action wiring produced wrapper warnings around `QAction` / `addAction` usage
- switching the workflow strip to `QToolButton` widgets inside the toolbar removed those callback warnings in the tested path
- the scale-reference action is not yet a full interactive calibration tool:
  - point-picking scaffolding exists
  - smoke-tested geometry/calculation path works
  - prototype line-entity rescaling works
  - known-distance entry dialog is not yet fully wired for real user interaction
- manual dialog interaction is wired in code, but not yet verified through live user clicking in the spike harness
- a more generic direct geometry mutation path appears risky:
  - a separate probe using `entity.scale(...)` caused a crash
  - the safer current spike path is delete-and-recreate for line entities
- dock-launched drawing actions appear to have a persistent first-click friction:
  - the user still had to click once in the canvas before the first real wall point could be placed
  - this persisted after multiple action-launch and focus-handoff experiments
  - that makes the custom dock a good place for parameters and workflow controls, but a questionable place for the primary launch surface of precision drawing tools

Blockers:

- no hard shell blocker is currently confirmed through QCAD's normal in-app script lifecycle
- remaining friction is in wrapper / binding behavior rather than total lack of shell access
- for drawing-tool UX, the custom dock currently behaves like a partial blocker if we require direct first-click-on-canvas placement from dock buttons

Recommendation:

- continue shell proof work using QCAD's real in-app lifecycle such as `-exec` and then a proper loaded init/plugin path
- treat shell customization as viable, with medium friction around wrapper quirks and polished panel composition
- the next milestone should be turning the successful `-exec` prototype into a repeatable loaded module and then swapping placeholder controls for one or two real workflow actions
- the scale-reference prototype is a good first candidate for that milestone because the geometry + calculation core already works
- for MVP interaction design, prefer this split:
  - native toolbar / menu / shortcut launch for core drawing commands
  - custom dock for mode switching, defaults, properties, underlay controls, and workflow guidance
- if a fully dock-launched first-click drawing experience is non-negotiable, assume deeper plugin or source-level investigation may be required

Day 3 prototype target document created:

- [qcad-shell-prototype-target.md](/Users/billfranklin/Documents/ChatGPT/Architecture Landscape CAD App/qcad-shell-prototype-target.md)

### 2. Guided mode switching

Status: `Worked with friction`

What we tested:

- indirect technical boundary evidence only:
  - action registration from script
  - menu placement from script
  - widget creation from script
  - main-window related JS API symbols
  - in-app `-exec` shell access

What worked:

- the ingredients needed for a mode-based workflow appear to exist
- a segmented-control style surface still looks plausible conceptually
- the direct custom probe confirms scripts can execute locally, so the issue is timing rather than total lack of extensibility
- the runtime includes higher-level document hooks such as post-new / post-open, which is encouraging in principle
- the in-app shell probes now confirm that workflow-specific menus, toolbars, and docks are realistically reachable
- the richer prototype confirms that a right-side planner panel and simplified top workflow strip are plausible in practice

What was hard:

- we do not yet have direct proof that mode switching can drive a clean workspace transformation
- we do not yet know whether the behavior will feel native enough inside QCAD
- wrapper quirks may make some UI compositions more awkward than raw method availability suggests
- placeholder mode switching works as a shell pattern, but we still have not tied it to real workspace reconfiguration

Blockers:

- none confirmed yet

Recommendation:

- move this into a richer in-app workflow-shell prototype with one or two real actions rather than more lifecycle probing

### 3. Underlay import and two-point scale calibration

Status: `Worked with friction`

What we tested:

- built a first `Site Setup / Scale Reference` starter action inside the shell prototype
- smoke-tested the action with sample points and a known distance
- added a custom `Import Underlay` shell action for raster images
- manually validated the interactive end-to-end flow in the live QCAD window:
  - import underlay
  - click point A
  - click point B
  - enter known distance
  - apply calibration

What worked:

- a sample two-point reference line could be added to the drawing
- measured distance could be computed from the two points
- known-distance calibration summary could be computed and displayed
- the shell panel could surface the current calibration status
- the action can now resolve or reuse an active drawing context before creating the reference line
- a prototype document calibration pass can rescale line entities in the active drawing
- the current smoke-test result successfully reported `scaled 2 lines`
- a raster underlay can be imported into the drawing from the custom shell
- the imported underlay can be placed on a dedicated `REFERENCE_UNDERLAY` layer
- the interactive point-pick path now works in live use:
  - first point
  - second point
  - dialog opens
- the entered known distance can visibly rescale the imported underlay
- the result summary can now report both:
  - scaled lines
  - scaled underlays

What was hard:

- underlay scaling needed a QCAD-wrapper-specific fallback because the image entity did not reliably expose its file name back during recalibration
- the current rescaling proof is still spike-quality rather than production-quality:
  - implemented with delete-and-recreate replacement logic
  - tuned to the current reference-underlay path
  - not yet generalized to every possible entity type
- one lower-level geometry-mutation attempt using `entity.scale(...)` crashed, so the entity API surface needs caution

Blockers:

- no hard blocker confirmed yet for the starter action itself
- no hard blocker confirmed yet for underlay import + calibration as an MVP workflow
- production-safe multi-entity transform behavior is still not proven beyond:
  - line entities
  - the current single-underlay path

Recommendation:

- move this workflow out of pure feasibility mode and into tighter MVP specification work
- treat raster underlay import + calibration as a viable `P1` path
- add product guardrails next:
  - underlay hide / show
  - underlay lock / unlock
  - safer scope rules for recalibration after drawing has started
- those recalibration guardrails are now prototype-proven as well:
  - if non-reference geometry exists, a warning appears before recalibration is applied
  - `Cancel` leaves the normal drawing geometry unchanged
  - `Continue` applies the recalibration intentionally

### 4. Core drawing tools and snapping

Status: `Unknown`

What we tested:

- TBD

What worked:

- TBD

What was hard:

- TBD

Blockers:

- TBD

Recommendation:

- TBD

### 5. Building and wall workflow

Status: `Unknown`

What we tested:

- TBD

What worked:

- TBD

What was hard:

- TBD

Blockers:

- TBD

Recommendation:

- TBD

### 6. Layers and properties workflow

Status: `Worked well`

What we tested:

- local example scripts for layer creation
- local example scripts for layer custom properties

What worked:

- layer creation is clearly scriptable
- switching current layer is clearly scriptable
- custom properties on layers are clearly scriptable

What was hard:

- not yet tested through a custom app-style panel

Blockers:

- none confirmed yet

Recommendation:

- treat layer workflows as lower-risk than shell transformation

### 7. Library browser and symbol placement

Status: `Worked with friction`

What we tested:

- inspected bundled library and template resources
- inspected script examples and JS API boundary clues related to actions, menus, widgets, and main-window access

What worked:

- built-in library/content structures clearly exist
- content-driven workflows appear plausible
- there is a visible path to script-created actions that could back a custom library browser

What was hard:

- no direct proof yet for drag-and-drop from a custom panel into the drawing canvas
- user-created category and symbol-pack behavior remains architectural rather than proven

Blockers:

- none confirmed yet

Recommendation:

- keep symbol workflow in scope, but treat drag-and-drop as medium-risk until directly proven

### 8. Symbol metadata persistence

Status: `Worked with friction`

What we tested:

- inspected custom-property examples on layers
- inspected bundle structure for scripts and app-side resources

What worked:

- custom-property style metadata clearly exists in QCAD object workflows at least in some form

What was hard:

- there is no direct proof yet for the full smart-symbol persistence model we want
- the boundary between DXF-linked metadata and app-side sidecar metadata is still unresolved

Blockers:

- none confirmed yet

Recommendation:

- keep metadata persistence as a focused risk area and avoid assuming script-only will solve everything

### 9. Output modes and export

Status: `Unknown`

What we tested:

- TBD

What worked:

- TBD

What was hard:

- TBD

Blockers:

- TBD

Recommendation:

- TBD

### 10. End-to-end representative plan workflow

Status: `Unknown`

What we tested:

- TBD

What worked:

- TBD

What was hard:

- TBD

Blockers:

- TBD

Recommendation:

- TBD

## Evidence Collected

List supporting evidence here:

- screenshots
- recordings
- prototype files
- notes
- sample exports

### Day 1 evidence

- located app bundle: `/Applications/QCAD.app`
- inspected `Info.plist`
- inspected:
  - `Contents/Resources/scripts`
  - `Contents/Resources/libraries`
  - `Contents/PlugIns`
- confirmed architecture: `arm64`
- confirmed bundled default libraries include categories such as:
  - `Architecture`
  - `Symbols`
  - `Examples`
  - `templates/metric`
  - `templates/imperial`

### Day 2 evidence

- inspected `Resources/scripts/readme.txt`
- inspected local example scripts:
  - `ExMinimal.js`
  - `ExWidget.js`
  - `MyWidget.js`
  - `ExAddLayer.js`
- confirmed local example usage of:
  - `RGuiAction`
  - `RMainWindowQt.getMainWindow()`
  - `EAction.getSubMenu(...)`
  - `setWidgetNames(...)`
  - `QWidget`
  - `QUiLoader`
  - `RLayer`
  - `RModifyObjectsOperation`
- inspected strings from `libqcadjsapi.dylib`
- confirmed exposed dock/main-window related symbols include:
  - `QDockWidget`
  - `RDockWidget`
  - `RMainWindowQt`

## Key Constraints

Record the most important constraints discovered during the spike.

1. User-level customization paths are not yet confirmed from filesystem inspection alone.
2. We still do not know how much of the stock shell can be hidden cleanly.
3. We still do not know whether custom mode switching will feel native enough.
4. We still do not have direct proof for polished drag-and-drop symbol placement from a custom panel.
5. We still do not know the best persistence boundary for smart symbol metadata.

## Key Blockers

Record blockers that could materially change the product direction.

1. None confirmed yet.

## Decision

### Recommendation

Choose one:

- `Go`
- `Go with constraints`
- `No-go`

### Rationale

Not enough evidence yet for a final recommendation.

Current lean:

- likely `Go`, assuming shell simplification and custom panels are practical without deep forking

Updated lean after Day 2:

- still leaning `Go`
- but with explicit caution around:
  - shell simplification depth
  - dock/panel ergonomics
  - symbol metadata persistence

## Next Actions

If `Go`:

- proceed to Phase A and Phase B implementation tickets

Immediate next step:

- execute Week 1 Day 2: customization boundary mapping

If `Go with constraints`:

- revise the backlog and architecture around confirmed constraints

If `No-go`:

- revisit the platform choice and app strategy
