# QCAD-Based Landscape Planner Spike Execution Checklist: Week 1

Date: August 12, 2026

## Purpose

This document breaks the first feasibility-spike sections into a tighter day-by-day execution plan.

It focuses on the first two areas from the main checklist:

- `A. Environment and foundation`
- `B. App shell feasibility`

Primary source:

- [qcad-landscape-planner-feasibility-spike-checklist.md](/Users/billfranklin/Documents/ChatGPT/Architecture Landscape CAD App/qcad-landscape-planner-feasibility-spike-checklist.md)

Supporting docs:

- [feasibility-findings.md](/Users/billfranklin/Documents/ChatGPT/Architecture Landscape CAD App/feasibility-findings.md)
- [qcad-customization-risks.md](/Users/billfranklin/Documents/ChatGPT/Architecture Landscape CAD App/qcad-customization-risks.md)
- [qcad-landscape-planner-prioritized-mvp-backlog.md](/Users/billfranklin/Documents/ChatGPT/Architecture Landscape CAD App/qcad-landscape-planner-prioritized-mvp-backlog.md)

## Scope

This checklist is for the first working week of the spike.

It should answer:

1. Which QCAD foundation are we targeting?
2. How far can we simplify the QCAD shell?
3. Can we create mode-aware UI behavior without excessive friction?
4. Do we have enough evidence to continue into drawing and library workflow tests?

## Output expectations for the week

By the end of this week, we should have:

- QCAD version and customization approach documented
- a working or partial reduced shell prototype
- evidence about menu suppression and dock/panel customization
- a rough mode-switching proof
- updated findings and risks
- a recommendation on whether to proceed into underlay/drawing tests next week

## Working assumptions

- This is a spike, not production implementation.
- We should optimize for learning speed, not polish.
- We should stop and record blockers rather than pushing too deeply into workaround code.

## Day-by-day plan

## Day 1: Environment and target definition

### Goals

- identify the exact QCAD target for the spike
- choose the likely customization path
- confirm the local development and test approach

### Tasks

- [ ] Confirm the exact installed QCAD version available for evaluation
- [ ] Decide whether the spike is targeting:
  - Community Edition source
  - scripting only
  - scripting plus plugin code
- [ ] Identify where QCAD scripts/plugins/extensions would live locally
- [ ] Record how to launch QCAD for repeatable tests
- [ ] Capture any immediate environment blockers

### Evidence to collect

- QCAD version screenshot or notes
- local path notes
- startup notes
- extension location notes

### End-of-day questions

- Do we know the exact technical base for the spike?
- Do we have a repeatable way to run tests?
- Is there any obvious blocker that makes the spike path unrealistic?

### Update these docs

- [feasibility-findings.md](/Users/billfranklin/Documents/ChatGPT/Architecture Landscape CAD App/feasibility-findings.md)
- [qcad-customization-risks.md](/Users/billfranklin/Documents/ChatGPT/Architecture Landscape CAD App/qcad-customization-risks.md)

## Day 2: Customization boundary mapping

### Goals

- understand what can be customized cleanly
- identify what likely requires plugin or source work
- separate easy wins from risky areas

### Tasks

- [ ] Inspect how menus can be suppressed, reorganized, or hidden
- [ ] Inspect how docks/panels can be added or customized
- [ ] Inspect how custom commands can be added
- [ ] Inspect whether a branded or simplified startup shell is realistic
- [ ] Record what appears scriptable vs deeper-engine work

### Evidence to collect

- notes on menu customization
- notes on panels/docks
- notes on command wiring
- notes on anything surprisingly hard

### End-of-day questions

- Can we realistically simplify the app without a deep fork?
- What are the top 3 customization risks now?
- Do we need to narrow the UI ambition already?

### Decision gate

If the answer looks like "deep fork required for basic shell control," flag `RISK-08` as more severe and consider tightening the MVP shell ambition before Day 3.

## Day 3: Simplified shell prototype

### Goals

- produce a first reduced-shell proof
- show that QCAD can start to look less like stock CAD

### Tasks

- [ ] Create a rough simplified shell concept
- [ ] Suppress or hide non-essential menus where possible
- [ ] Add or stub a custom top-level entry point
- [ ] Confirm the main window can support the intended app framing
- [ ] Capture screenshots of the before/after shell

### Evidence to collect

- screenshots
- brief notes on what was easy
- brief notes on what resisted customization

### Success target

A screenshot or prototype state where QCAD no longer feels untouched.

### End-of-day questions

- Is the simplified shell convincing enough to justify proceeding?
- Does it still feel too CAD-heavy?
- What must remain visible even if we wanted to hide it?

## Day 4: Workspace and panel feasibility

### Goals

- test the intended workspace structure
- prove whether custom panels can support the planned UI

### Tasks

- [ ] Prototype the top app bar area or an equivalent host area
- [ ] Prototype the left tool rail concept or closest feasible alternative
- [ ] Prototype a right-side custom panel or dock
- [ ] Verify the bottom status area can still expose precision info clearly
- [ ] Test whether the main drawing canvas remains stable while custom UI is added

### Evidence to collect

- screenshots of layout experiments
- notes on panel sizing and docking behavior
- notes on what feels natural vs forced

### Success target

A minimal workspace mockup that roughly supports:

- top command area
- tool area
- drawing area
- property/library area

### End-of-day questions

- Can we realistically support the planned workspace layout?
- Is the left tool rail viable, or does QCAD push us toward a different pattern?
- Does the custom panel approach feel maintainable?

## Day 5: Guided mode switching proof

### Goals

- prove that workflow modes can exist
- verify that mode changes can drive different tool emphasis

### Tasks

- [ ] Create a rough segmented control or substitute UI for:
  - Site Setup
  - Hardscape
  - Planting
  - Annotate
  - Output
- [ ] Test whether switching modes can change visible actions or active UI
- [ ] Confirm mode switching does not reset zoom or drawing context
- [ ] Record the lightest-weight implementation path that seems workable

### Evidence to collect

- screenshots or short recordings
- notes on how mode state is stored
- notes on whether the behavior feels native enough

### Success target

A working proof that visibly changes workspace emphasis by mode.

### End-of-day questions

- Does the mode-driven concept feel viable?
- Is the segmented control the right surface, or do we need a variant?
- Does the implementation path feel reasonable for MVP?

### Day 5 follow-up finding

- Custom dock-based mode and settings controls are viable.
- Custom dock-based launch for drawing tools has a meaningful UX limitation in the current spike:
  - the first canvas click is still consumed as an activation / focus click before drawing begins
  - this persisted across multiple experiments, including native-style action registration and focus handoff attempts
- Working recommendation for the next spike phase:
  - keep the custom dock for workflow state, defaults, underlay actions, and contextual properties
  - prefer native toolbar, menu, or shortcut launch paths for precision drawing commands such as walls, lines, rectangles, and hosted openings
  - only revisit fully dock-launched drawing if we later decide deeper plugin or source customization is justified

## Day 6: Synthesis and decision review

### Goals

- consolidate the first week’s learning
- update findings and risks
- decide whether to proceed into drawing and underlay tests

### Tasks

- [ ] Summarize what worked well
- [ ] Summarize what worked with friction
- [ ] Summarize blockers and unknowns
- [ ] Update:
  - [feasibility-findings.md](/Users/billfranklin/Documents/ChatGPT/Architecture Landscape CAD App/feasibility-findings.md)
  - [qcad-customization-risks.md](/Users/billfranklin/Documents/ChatGPT/Architecture Landscape CAD App/qcad-customization-risks.md)
- [ ] Write a short recommendation:
  - proceed as planned
  - proceed with constraints
  - revisit platform assumptions

### Week-one exit questions

- Is the shell customization direction viable enough to continue?
- Are the main risks understood, even if not solved?
- Should Week 2 move into:
  - underlay import
  - scale calibration
  - core drawing tools
  - building/wall feasibility

## Current Week 1 recommendation

- Proceed with constraints.
- QCAD still looks viable as the base platform.
- The current evidence suggests we should not assume every primary drawing command can launch cleanly from a custom dock without first-click friction.
- The cleaner MVP direction is a hybrid shell:
  - custom dock and workflow framing for app guidance
  - native command surfaces for direct drawing initiation

## Suggested working notes format

Use this short structure each day:

```text
Date:
Area tested:
What we tried:
What worked:
What was harder than expected:
Blockers:
Decision or recommendation:
```

## Weekly go / no-go criteria

### Strong week-one result

Move forward confidently if:

- we can shape the shell visibly
- custom panels are feasible
- mode switching is workable
- no immediate deep-fork blocker appears

### Mixed week-one result

Still move forward, but with caution, if:

- the shell works but is less flexible than hoped
- mode switching works but feels awkward
- panel customization works with constraints

In that case, tighten the UI ambition before Week 2.

### Weak week-one result

Pause and re-evaluate if:

- shell simplification is mostly blocked
- custom panels are too limited
- the mode-based workflow feels unnatural in QCAD

## Recommended next document after this week

If week one is viable, the next execution artifact should be:

- `qcad-landscape-planner-spike-execution-checklist-week-2.md`

Focused on:

- underlay import
- two-point scale calibration
- core drawing tools
- building/wall behavior
