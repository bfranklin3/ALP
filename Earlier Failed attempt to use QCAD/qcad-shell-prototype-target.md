# QCAD Simplified Shell Prototype Target

Date: August 12, 2026

## Purpose

This document defines the exact Day 3 shell prototype target for the QCAD-based landscape planner spike.

It answers:

- what we are trying to prove
- what the smallest useful shell proof looks like
- what evidence we should capture
- what outcomes count as success, partial success, or failure

## Source context

This prototype target is based on:

- [qcad-landscape-planner-feasibility-spike-checklist.md](/Users/billfranklin/Documents/ChatGPT/Architecture Landscape CAD App/qcad-landscape-planner-feasibility-spike-checklist.md)
- [qcad-landscape-planner-spike-execution-checklist-week-1.md](/Users/billfranklin/Documents/ChatGPT/Architecture Landscape CAD App/qcad-landscape-planner-spike-execution-checklist-week-1.md)
- [qcad-customization-boundary-map.md](/Users/billfranklin/Documents/ChatGPT/Architecture Landscape CAD App/qcad-customization-boundary-map.md)

## What we know going in

From local inspection of `QCAD 3.32.9`:

- QCAD supports `-autostart`
- local examples create `RGuiAction` commands
- local examples add menu structure with `EAction.getSubMenu(...)`
- local examples create Qt widgets from script
- JS API symbols suggest main-window and dock support includes:
  - `RMainWindowQt`
  - `QDockWidget`
  - `RDockWidget`
  - `addDockWidget`
  - `removeDockWidget`
  - `addToolBar`
  - `removeToolBar`
  - `menuBar`
  - `statusBar`
  - `centralWidget`
  - `setWindowTitle`
  - `setVisible`
  - `hide`

This is enough evidence to justify a real shell proof.

## Prototype question

Can we make QCAD feel visibly less like stock CAD by using a lightweight custom shell layer, without deep forking?

## Day 3 shell proof scope

The shell proof should stay narrow.

We are not trying to build the app.

We are trying to prove that QCAD can be nudged into the right shape.

## Minimum shell proof

The Day 3 prototype should demonstrate at least four things:

1. a custom top-level app identity
2. some reduction of stock UI noise
3. a visible custom workflow surface
4. some control over where custom actions appear

## Target prototype outcome

The prototype should ideally show:

- window title or branding changed
- one or more stock menus hidden or de-emphasized
- a visible custom mode surface or placeholder
- a visible custom tool or utility area
- at least one custom command routed through the shell

## Exact prototype goals

## Goal 1: Custom top identity

Prove one or more of:

- change window title
- add branded menu or top-level entry point
- add app-specific action group such as `Landscape Planner`

Evidence to capture:

- screenshot with changed title or custom menu

## Goal 2: Reduced stock clutter

Prove one or more of:

- hide or suppress at least one non-essential stock menu
- hide or suppress at least one non-essential stock toolbar
- show that the UI can be noticeably simplified

Evidence to capture:

- before/after screenshot
- list of what was successfully hidden
- list of what resisted hiding

## Goal 3: Workflow surface

Prove one or more of:

- add a placeholder mode control
- add a lightweight custom widget or panel
- add a simple custom toolbar for app workflow

Evidence to capture:

- screenshot of custom workflow surface
- notes on where it lives:
  - menu
  - toolbar
  - dock/panel
  - floating widget

## Goal 4: Main-window control

Prove one or more of:

- read or manipulate the main window through `RMainWindowQt`
- attach or remove a toolbar
- attach or remove a dock

Evidence to capture:

- code notes
- screenshot
- notes on whether behavior feels stable

## Goal 5: Command routing

Prove:

- a custom action can launch from the shell surface and run reliably

Best test command candidates:

- `Hello World` style action
- `Open Placeholder Panel`
- `Switch to Planting Mode` placeholder

Evidence to capture:

- screenshot or short recording
- notes on how the action was registered

## Prototype levels

## Level 1: Minimal viable shell proof

Counts as success if we can show:

- custom action registration
- visible custom menu or toolbar presence
- changed title or basic app identity
- some reduction in visible stock UI

## Level 2: Strong shell proof

Counts as stronger success if we can also show:

- custom dock or panel
- visible workflow-mode placeholder
- stable main-window manipulation

## Level 3: Excellent shell proof

Counts as excellent if we can show:

- custom shell area
- reduced stock clutter
- custom panel
- mode switch placeholder
- no obvious instability

## Experiments to run in order

Run the smallest, safest experiments first.

### Experiment A

- inspect whether we can change the main window title

Why first:

- extremely small
- gives immediate evidence of main-window control

### Experiment B

- add one custom action to a visible menu

Why second:

- confirms action registration and visible integration

### Experiment C

- add a small custom toolbar or toolbar action group

Why third:

- starts moving the UI toward a simplified shell

### Experiment D

- hide or de-emphasize one non-essential stock menu or toolbar

Why fourth:

- directly tests simplification potential

### Experiment E

- add a lightweight widget or dock placeholder for the future right sidebar

Why fifth:

- most useful proof for the future app shell

### Experiment F

- create a fake segmented mode placeholder or equivalent mode-switch area

Why sixth:

- directly tests the guided workflow concept

## What not to attempt on Day 3

Do not spend Day 3 on:

- underlay import
- scale calibration
- drag-and-drop symbols
- smart wall logic
- metadata persistence
- output modes

Those belong after shell viability is clearer.

## Evidence checklist

Capture all of the following if possible:

- [ ] screenshot of stock QCAD before shell changes
- [ ] screenshot of simplified shell attempt
- [ ] screenshot of custom menu or toolbar action
- [ ] screenshot of custom widget or panel, if successful
- [ ] notes on what was scriptable quickly
- [ ] notes on what resisted customization

## Outcome so far

The shell prototype has now exceeded the original minimum Day 3 proof and produced real in-app evidence through QCAD's `-exec` lifecycle.

Confirmed working:

- changed window title
- custom top-level `Landscape Planner` menu
- custom workflow toolbar
- right-side `.ui`-loaded dock panel
- hidden `CadToolBar`
- hidden `StatusBar`
- starter `Site Setup / Scale Reference` action path

Confirmed follow-up workflow proof:

- active drawing context can be resolved before the starter action runs
- a reference line can be added to the drawing
- measured and known distance values can be processed and surfaced in the dock
- a narrow calibration prototype successfully rescaled line entities in a live document
- latest smoke-test summary:
  - `Measured 120.00, known 30.00, ratio 0.2500, scaled 2 lines`

Remaining rough edges:

- workflow toolbar action wiring still emits wrapper warnings even though the toolbar itself appears
- the known-distance dialog is wired in code, but still needs manual click validation
- the current calibration transform is a spike-quality implementation:
  - line entities only
  - delete-and-recreate approach
- a generic direct `entity.scale(...)` approach was not safe in testing

## First experiment results

Date run: August 12, 2026

What we ran:

- QCAD bundled control script through `-autostart`
- custom shell probe through `-autostart`
- post-new / post-open registration probe through `-autostart`
- delayed main-window probe through fresh GUI app launch
- QCAD help inspection for runtime semantics
- in-app shell probes through `-exec`
- richer landscape-shell prototype through `-exec`

What we proved:

- `-autostart` works locally on the installed macOS build
- custom local JavaScript executes successfully through that path
- the runtime exposes `NewFile` hooks and related document-shell APIs
- file-based logging from QCAD scripts works when writing to `/tmp`
- `-exec` runs after QCAD starts normally and is the relevant shell-entry path for in-app customization
- through `-exec`, the following shell operations worked:
  - window title update
  - custom menu insertion
  - custom toolbar insertion
  - dock widget insertion
- the richer prototype also proved:
  - `.ui`-loaded dock content works
  - `CadToolBar` can be hidden
  - `StatusBar` can be hidden
  - a planner-style right panel is feasible
- the first workflow-action prototype also proved:
  - a scale-reference starter flow can live inside the shell
  - a sample reference line can be created
  - a calibration ratio can be computed and shown in the shell panel
  - the active drawing context can be resolved before creating that reference line

What failed:

- direct access to a usable main window at plain `-autostart` time
- `NewFile.createMdiChild()` could not reach a ready MDI shell from this startup path
- delayed timer probes did not reach usable GUI-shell callbacks
- some Qt wrapper behavior remained uneven in practice:
  - `QListWidget` content setup failed in one dock test
  - `findChildren()` was not exposed on the tested wrapper
  - some familiar reflection helpers did not behave as expected
- workflow toolbar action wiring still emitted warnings in the tested path
- the scale-reference action is still only partially interactive:
  - point-pick scaffolding exists
  - smoke-tested calculation works
  - real distance-entry dialog flow is wired in code but still needs live manual validation

Observed result:

- the probe logged successful script startup
- `RMainWindowQt.getMainWindow()` returned an object wrapper, but was effectively null for shell manipulation
- no direct window-title, menu, or toolbar customization was reached from that first startup tick
- post-new / post-open registration succeeded, but triggering new-document behavior still hit an undefined subwindow shell
- delayed probes scheduled successfully, but no later main-window access was observed

Interpretation:

- Day 3 did not disprove shell customization
- Day 3 did show that plain `-autostart` is likely too early for main-window shell work
- the better interpretation now is that `-autostart` is the wrong lifecycle for this goal
- `-exec` provided the first real proof that QCAD can host a simplified shell layer
- the next bridge should be a proper loaded init/plugin/script path that behaves like the successful `-exec` probes
- the richer shell prototype raised confidence that QCAD can support an MVP shell conceptually close to the planned product
- the first workflow-action prototype raised confidence that real product workflows can be layered into that shell incrementally
- the active-document cleanup raised confidence that those workflows can create real drawing content, not just shell-side status text

Next experiment recommendation:

- shift away from `-autostart` as the primary shell entry point
- prioritize a true in-app init/plugin/script loading path that runs after the GUI shell is established
- use the successful `-exec` probes as the baseline for the next richer shell prototype
- use the richer landscape-shell prototype as the baseline for the next milestone: attach one or two real workflow actions
- deepen the scale-reference action next until it supports true manual point picking and known-distance entry
- then connect it to actual document rescaling / underlay calibration behavior
- [ ] notes on any instability or odd behavior

## Decision rubric

## Strong success

Choose this if:

- main-window manipulation works
- custom actions appear reliably
- some stock clutter can be reduced
- a custom panel or equivalent shell surface seems feasible

Implication:

- proceed confidently to Day 4

## Partial success

Choose this if:

- custom actions work
- menu and toolbar changes work
- but dock/panel behavior is awkward or limited

Implication:

- continue, but narrow the UI ambition

## Weak success

Choose this if:

- only basic action wiring works
- shell simplification is minimal
- panel and mode-surface ideas seem forced

Implication:

- re-evaluate how much UX differentiation is realistic

## Failure condition

Treat Day 3 as a warning sign if:

- the shell cannot be meaningfully simplified
- custom actions cannot be integrated in a clean user-facing way
- panel behavior seems too constrained or unstable

Implication:

- stop before overcommitting to the platform

## Recommended Day 3 notes template

Use this structure while testing:

```text
Experiment:
Goal:
Method:
Outcome:
Evidence:
What worked:
What resisted customization:
Risk implication:
```

## Immediate follow-up after Day 3

Update:

- [feasibility-findings.md](/Users/billfranklin/Documents/ChatGPT/Architecture Landscape CAD App/feasibility-findings.md)
- [qcad-customization-risks.md](/Users/billfranklin/Documents/ChatGPT/Architecture Landscape CAD App/qcad-customization-risks.md)

If the shell proof is strong enough, Day 4 should move into:

- workspace structure
- right sidebar / dock feasibility
- left tool rail feasibility
