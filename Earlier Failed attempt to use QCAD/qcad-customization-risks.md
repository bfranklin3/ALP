# QCAD Customization Risks

Date Started: August 12, 2026
Status: Active

## Purpose

This document tracks the major risks discovered while evaluating QCAD as the platform foundation for the landscape planner.

It should be updated alongside:

- [qcad-landscape-planner-feasibility-spike-checklist.md](/Users/billfranklin/Documents/ChatGPT/Architecture Landscape CAD App/qcad-landscape-planner-feasibility-spike-checklist.md)
- [feasibility-findings.md](/Users/billfranklin/Documents/ChatGPT/Architecture Landscape CAD App/feasibility-findings.md)

## Risk scale

Use:

- `Low`
- `Medium`
- `High`

## Status scale

Use:

- `Open`
- `Monitoring`
- `Mitigated`
- `Accepted`
- `Closed`

## Risk log

### RISK-01

- Title: QCAD UI cannot be simplified enough
- Severity: `High`
- Status: `Monitoring`
- Why it matters:
  - the product promise depends on a cleaner, more guided workflow than stock CAD
- What to test:
  - menu suppression
  - custom panels
  - mode switching
- Possible mitigation:
  - use a stronger custom shell
  - hide more native controls
  - expose advanced tools separately

### RISK-02

- Title: Two-point scale calibration is awkward or unreliable
- Severity: `High`
- Status: `Mitigated`
- Why it matters:
  - accurate scaling is core to the intended workflow
- What to test:
  - underlay import
  - click point A / point B flow
  - measurement validation
- Possible mitigation:
  - custom calibration tool
  - more guided import wizard

### RISK-03

- Title: Symbol metadata persistence is fragile
- Severity: `High`
- Status: `Open`
- Why it matters:
  - plant symbols need Width, Depth, variant, and metadata to reopen cleanly
- What to test:
  - save/reopen
  - import/export
  - metadata storage model
- Possible mitigation:
  - sidecar project metadata
  - stronger entity mapping rules

### RISK-04

- Title: Drag-and-drop symbol placement is harder than expected
- Severity: `Medium`
- Status: `Open`
- Why it matters:
  - this is the preferred interaction model
- What to test:
  - library browser to canvas placement
  - preview behavior
  - fallback click-to-place
- Possible mitigation:
  - ship click-to-place first
  - improve drag-and-drop later

### RISK-05

- Title: Wall thickness and wall style behavior requires too much custom logic
- Severity: `Medium`
- Status: `Open`
- Why it matters:
  - walls need more than generic linework for the target product
- What to test:
  - thickness
  - fill
  - outline
  - phase/status
- Possible mitigation:
  - simpler wall tool for MVP
  - defer advanced wall intelligence

### RISK-06

- Title: Export styling differs too much between draft and presentation outputs
- Severity: `Medium`
- Status: `Open`
- Why it matters:
  - the same project must support black-and-white and color outputs
- What to test:
  - output mode switching
  - symbol variants
  - fill behavior
- Possible mitigation:
  - simpler presentation styling in MVP
  - more constrained output presets

### RISK-07

- Title: User-created categories and imported symbol packs become messy
- Severity: `Medium`
- Status: `Open`
- Why it matters:
  - the content model should stay organized, not degrade into clutter
- What to test:
  - category creation
  - import flows
  - metadata defaults
- Possible mitigation:
  - flat category model first
  - stronger import validation
  - recommended naming rules

### RISK-08

- Title: QCAD customization path forces too much deep forking
- Severity: `High`
- Status: `Monitoring`
- Why it matters:
  - deep forks increase cost and maintenance risk
- What to test:
  - scripting boundaries
  - plugin boundaries
  - source-change requirements
- Possible mitigation:
  - keep MVP scope tighter
  - prefer scripting and plugins first
  - revisit platform if necessary

## Notes

Add dated notes here as the spike progresses.

### August 12, 2026

- Risk document created.
- Day 1 environment findings:
  - local target confirmed at `/Applications/QCAD.app`
  - version confirmed as `3.32.9`
  - bundled script and plugin components suggest extension is plausible
  - no immediate blocker found yet

### Risk assessment adjustments after Day 1

- `RISK-08` remains `Open`, but early evidence is somewhat encouraging because QCAD visibly ships with script resources, libraries, templates, and QCAD-specific plugin binaries.
- `RISK-03` remains `Open` because user-level metadata persistence paths are still unknown.
- `RISK-01` remains `Open` because Day 1 did not yet test shell simplification directly.

### August 12, 2026 - Day 2 customization boundary findings

- local example scripts confirm that command and menu registration are clearly script-driven
- local Qt examples confirm that custom widgets can be created from script
- local layer examples confirm that layer creation and custom properties are scriptable
- exposed JS API symbols suggest main-window and dock-related integration is available at some level
- there is still no direct proof yet for a polished dock/panel workflow or full-shell cleanup

### Risk assessment adjustments after Day 2

- `RISK-01` is still `Open`, but there is now stronger evidence that partial UI simplification is viable.
- `RISK-03` remains `Open`; metadata persistence is still unresolved beyond basic custom-property evidence.
- `RISK-04` remains `Open` because drag-and-drop placement is still unproven.
- `RISK-05` remains `Open`; local evidence supports geometry and layer scripting, but not yet smart-wall polish.
- `RISK-08` remains `Open`, but the likelihood of a total dead end looks lower than it did before script inspection.

### August 12, 2026 - Day 3 first shell experiment findings

- direct execution of QCAD's bundled `-autostart` example worked locally, confirming that the startup script pathway is real on this macOS build
- direct execution of a custom local shell probe also worked, confirming that our own code can run through `-autostart`
- however, the probe showed that `RMainWindowQt.getMainWindow()` was effectively null at plain `-autostart` time
- this means the first shell limitation is a lifecycle-timing issue, not a total scripting failure
- the next best proof target is a later hook such as post-new / post-open or another UI-ready action trigger

### Risk assessment adjustments after Day 3

- `RISK-01` remains `Open`, but it is now better defined: the immediate challenge is startup timing for main-window access, not whether QCAD exposes shell APIs at all.
- `RISK-08` remains `Open`, but the evidence still leans away from a full dead end because both bundled and custom `-autostart` scripts executed successfully.
- `RISK-04` remains `Open`; no drag-and-drop evidence was produced yet.
- `RISK-03` remains `Open`; metadata persistence still has not been exercised.

### August 12, 2026 - Day 3 follow-up shell experiment findings

- the runtime exposed `NewFile` and confirmed the presence of:
  - `addPostNewAction()`
  - `addPostOpenAction()`
  - `createMdiChild()`
- post-new and post-open hook registration succeeded from script
- however, trying to create a new document from this startup path failed with `Cannot call method 'addSubWindow' of undefined`
- a delayed timer probe also failed to produce usable GUI-shell callbacks, even though the timers themselves could be created and started
- this strengthens the conclusion that `-autostart` is running before the real GUI shell / MDI environment is ready for shell customization work

### Risk assessment adjustments after Day 3 follow-up

- `RISK-01` remains `Open`, and the risk is now narrower: QCAD may still be shell-customizable, but likely through a true in-app init/plugin path rather than plain `-autostart`.
- `RISK-08` remains `Open`; the need for a deeper integration path looks more likely than it did after the first script-only pass, though not yet like a full source-fork requirement.

### August 12, 2026 - Day 3 exec-path breakthrough

- QCAD's built-in help clarified the key lifecycle distinction:
  - `-autostart` runs a script-defined application
  - `-exec` runs a script after QCAD starts normally
- once the probes moved to `-exec`, main-window shell access worked
- successful in-app shell operations included:
  - `setWindowTitle()`
  - custom menu insertion
  - custom toolbar insertion
  - dock widget insertion
- this substantially reduces the risk that QCAD is a dead end for the simplified-shell concept
- the remaining friction shifted from lifecycle access to wrapper / binding quirks in some Qt classes and methods

### Risk assessment adjustments after Day 3 exec breakthrough

- `RISK-01` remains `Open`, but severity pressure is lower because the core shell-access question now looks solvable.
- `RISK-08` remains `Open`, but the evidence now leans more strongly toward a script/plugin-based path being viable without an immediate source fork.
- `RISK-04` remains `Open`; drag-and-drop placement is still unproven.
- `RISK-03` remains `Open`; metadata persistence is still untested.

### August 12, 2026 - Day 3 richer shell prototype findings

- a landscape-oriented shell prototype worked through QCAD's normal `-exec` lifecycle
- the prototype successfully applied:
  - branded window title
  - custom top-level menu
  - workflow toolbar
  - right-side `.ui`-backed dock
  - hidden `CadToolBar`
  - hidden `StatusBar`
- this is the first direct proof that QCAD can be pushed toward a more guided, app-like shell instead of only exposing isolated script hooks
- the main remaining shell issues are now quality-of-implementation issues:
  - some wrapper methods are missing or uneven
  - some widget classes are easier to use through `.ui` loading than through direct scripted composition
  - toolbar action wiring still emitted warnings in the tested path

### August 12, 2026 - Day 3 scale-reference prototype follow-up

- the first starter workflow moved beyond calculation-only proof:
  - a reference line was added successfully
  - measured and known distance values were processed successfully
  - the active drawing reported a successful calibration result of `scaled 2 lines`
- the safe prototype path for geometry adjustment was:
  - query existing line entities
  - delete the old lines
  - recreate scaled replacement lines
- one lower-level probe using direct `entity.scale(...)` caused a crash, which means geometry mutation through the JS wrapper should be treated cautiously until a safer general pattern is proven
- the known-distance dialog is wired in code, but the spike still needs manual click validation for the full interactive path

### Risk assessment adjustments after Day 3 scale-reference follow-up

- `RISK-01` moves to `Monitoring` because QCAD now has direct live proof of a branded shell, docked workflow panel, and hidden stock UI elements.
- `RISK-02` moves to `Monitoring` because scale calibration is no longer theoretical:
  - geometry capture works
  - calculation works
  - a narrow line-entity recalibration proof works
  - but the interaction and broader entity coverage still need work
- `RISK-08` moves to `Monitoring` because the evidence continues to favor a script/plugin path over an immediate source fork, even though wrapper quirks may still force targeted deeper integration later.

### August 12, 2026 - Day 3 toolbar wiring follow-up

- the earlier workflow-toolbar warnings were narrowed to the use of `QAction`-style toolbar wiring in this spike script
- replacing those toolbar actions with `QToolButton` widgets inside the toolbar removed the callback connection warnings in the tested run
- this suggests the shell concept is sound, but some UI surfaces are more reliable when built from ordinary Qt widgets than from wrapped action overloads

### August 12, 2026 - Underlay import and calibration breakthrough

- the spike now has direct live proof for the intended reference workflow:
  - raster underlay import works from the custom shell
  - the imported underlay is assigned to `REFERENCE_UNDERLAY`
  - the user can pick two points on the image
  - the known-distance dialog appears correctly
  - the underlay visibly rescales after applying a different known distance
- the first underlay-scaling pass failed because the imported image entity did not reliably expose its file name back through the JS wrapper during recalibration
- a practical fallback using the most recent imported underlay file path fixed the current MVP-style single-underlay workflow
- this means the risk has shifted from `can this workflow work at all?` to `how do we harden and generalize it safely?`

### Risk assessment adjustments after underlay breakthrough

- `RISK-02` moves to `Mitigated` because the intended user workflow now works end-to-end in the spike.
- remaining work for `RISK-02` is polish and hardening:
  - safer recalibration scope
  - stronger persistence
  - cleaner lock / hide controls
  - better behavior if multiple underlays are ever allowed

### Risk assessment adjustments after Day 3 richer shell prototype

- `RISK-01` remains `Open`, but the risk is materially reduced because we now have direct proof of shell reduction and custom shell addition in the normal app lifecycle.
- `RISK-08` remains `Open`, but the evidence is now meaningfully stronger that a scripting/plugin path can carry the early product shell without an immediate deep fork.

### August 12, 2026 - Day 3 first workflow action findings

- the shell prototype now includes a first `Site Setup / Scale Reference` starter action
- the smoke-tested path successfully:
  - added a sample reference line
  - measured the sample distance
  - computed and displayed a calibration ratio
- after the active-document cleanup, the sample reference line path ran cleanly without the earlier missing-document issue
- this is the first direct proof that the shell can host not just UI chrome, but an actual product-specific workflow step
- however, the action is still a starter prototype:
  - full manual point-pick validation is not yet captured
  - known-distance entry is wired in code as a dialog, but not yet manually validated through live user interaction

### Risk assessment adjustments after Day 3 first workflow action

- `RISK-02` remains `Open`, but the risk is now narrower because the geometry/calculation core looks viable even though the full interaction flow is incomplete.
- `RISK-02` pressure is lower than before because the action can now create its reference line in an active drawing context instead of only reporting calculations.
- `RISK-01` remains `Open`; the shell path continues to look viable enough to support real workflow tools.
