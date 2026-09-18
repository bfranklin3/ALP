# SPIKE-46 — Plant Inspector Appearance Polish (post–SPIKE-44A)

**Date:** August 27, 2026  
**Status:** **COMPLETED** — 46A + 46B shipped and QA passed Aug 27, 2026
**Parent:** [SPIKE-44A proof](sweethome3d-spike-43-structured-plant-preset-proof.md), [SPIKE-42](sweethome3d-spike-42-plant-inspector-ux-spec.md), [SPIKE-28 plan fill](../ALP%20CAD%20%20Detailed%20Execution%20Plan.md)  
**Follows:** SPIKE-44A manual QA (Aug 27, 2026)

---

## Goal

Clean up the docked furniture inspector for ALP plants so appearance editing is coherent: no misleading generic controls, preset UI reflects what is actually on the plan, and plan-fill editing moves toward the inspector instead of requiring **Modify furniture**.

---

## QA finding that triggered this spike

SPIKE-44A passes when preset and plan stay in sync via the sidebar dropdown alone.

Manual QA also found:

1. **Color and texture → Color** in the sidebar does nothing visible on layered ALP plants (expected — plan uses `fillColor`, not `color`).
2. **Modify furniture → Plan fill** works, shows SPIKE-28 nuance (Default wash / custom tint / None), and **can override** the sidebar preset wash.
3. After a Plan fill override, the sidebar can still show **Soft Green** while the plan shows a custom peach wash — because `alp.plantStylePreset` and `fillColor` diverge.

This is not a 44A failure; it is a polish gap before we treat presets as production UX.

---

## Short answer

Implement in two small phases:

| Phase | Scope | Effort |
|-------|--------|--------|
| **46A** | Hide irrelevant sidebar controls + honest preset state | ~½ day |
| **46B** | Port Plan fill controls into sidebar inspector | ~1 day |

---

## Locked decisions

| Topic | Decision |
|-------|----------|
| **Sidebar Color and texture** | Hide entire panel when selection is a single ALP plant with `hasPlanIconFill()` |
| **3D furniture color** | Out of scope — ALP plants use plan-first placeholder meshes |
| **Source of truth on plan** | `fillColor` drives rendering; preset is semantic metadata |
| **Preset vs custom fill** | If `fillColor` does not match a known preset tint (and is not default wash / none), dropdown shows **Custom** |
| **Choosing a preset** | Writes both `alp.plantStylePreset` and matching `fillColor` (same as 44A today) |
| **Plan fill in Modify dialog** | Keep working; sidebar must refresh after modal closes |
| **Default wash (`fillColor == null`)** | Dropdown shows **Soft Green** as library-default presentation stand-in until user picks otherwise (same as 44A default) OR **Default wash** — pick one in implementation; see open question below |

---

## Phase 46A — Hide noise + honest preset label

### In scope

- Hide **Color and texture** panel in `SelectionInspectorPane.FurnitureInspectorPanel` when:
  - single selection
  - `AlpPlantUtils.isPlant(piece)`
  - `piece.hasPlanIconFill()`
- Add **`Custom`** as a third preset dropdown option (disabled or read-only label — not a selectable preset that writes state).
- On refresh, resolve displayed preset:
  1. `fillColor == null` → **Default wash** (or **Soft Green** — see open question)
  2. `fillColor == draftGray tint` → **Draft Gray**
  3. `fillColor == softGreen tint` → **Soft Green**
  4. `fillColor == TRANSPARENT_COLOR` → **None** (optional fourth row, or defer to 46B)
  5. else → **Custom**
- When user picks **Draft Gray** or **Soft Green**, call existing `applyPlantPresetChange(...)`.
- After **Modify furniture** closes, inspector `refresh()` must re-read `fillColor` and update dropdown (verify listener path; add if missing).

### Out of scope (46A)

- Moving Plan fill checkbox / swatch into sidebar
- Multi-select plant editing
- Hiding Size / Orientation / Name

### Likely files

- `SelectionInspectorPane.java` — hide `paintPanel`; extend `refreshPlantStylePanel()`
- `AlpPlantUtils.java` — `resolvePlantStylePresetFromFillColor(Integer fillColor)` helper
- `package.properties` — `plantStyleCustom.text`, optionally `plantStyleDefaultWash.text`, `plantStyleNone.text`

### Acceptance criteria (46A)

1. ALP plant selected → **no** Color and texture section in sidebar.
2. Non-plant furniture → Color and texture unchanged.
3. Sidebar preset **Draft Gray** / **Soft Green** still toggles plan wash immediately.
4. Custom peach wash from Modify dialog → sidebar shows **Custom**, not Soft Green.
5. Re-select plant or close Modify → dropdown still matches plan.
6. Save / reopen preserves custom wash and **Custom** display state.

---

## Phase 46B — Plan fill in sidebar inspector

### In scope

- Under **Plant style**, add SPIKE-28 controls (mirror `HomeFurniturePanel` plan fill panel):
  - **Default wash** checkbox (`fillColor = null`)
  - **Plan fill** color swatch with **None** support (`TRANSPARENT_COLOR`)
- When Default wash checked → clear custom tint; preset dropdown shows **Default wash** (or Soft Green — align with 46A decision).
- When user picks a manual swatch color → `fillColor` updates; preset dropdown → **Custom**; clear or retain `alp.plantStylePreset` (recommend: set property to empty / `custom` sentinel).
- Preset picks still set both property + `fillColor` and uncheck Default wash.

### Out of scope (46B)

- New preset families beyond Draft Gray / Soft Green
- Batch edit across multi-select

### Likely files

- `SelectionInspectorPane.java` — embed plan fill UI (reuse patterns from `HomeFurniturePanel`)
- `HomeFurniturePanel.java` — optional shared helper to avoid duplicating three-state logic

### Acceptance criteria (46B)

1. User can reach all three plan-fill states from sidebar without opening Modify furniture.
2. None → outline only on plan; Default wash → untinted library watercolor; custom swatch → tinted wash.
3. Preset + Plan fill controls stay consistent (no lying dropdown).
4. Modify furniture Plan fill and sidebar stay equivalent (either path, same result).

---

## Preset / fillColor resolution rules (normative)

```
Rendering: PlanComponent uses fillColor (null = untinted wash, 0 = none, ARGB = tint)

Display preset:
  null fillColor           → "Default wash" (preferred) or "Soft Green" (44A compat)
  TRANSPARENT_COLOR        → "None"
  matches draftGray tint   → "Draft Gray" + alp.plantStylePreset=draftGray
  matches softGreen tint   → "Soft Green" + alp.plantStylePreset=softGreen
  otherwise                → "Custom" (alp.plantStylePreset absent or custom)

User picks preset:
  → set alp.plantStylePreset + fillColor to preset tint

User picks custom swatch / None / Default wash:
  → set fillColor only; update alp.plantStylePreset only when value matches a preset
```

---

## Open question (decide in 46A implementation)

**Default wash vs Soft Green in the dropdown**

- **Option A — "Default wash"** (recommended): honest about `fillColor == null`; matches Modify dialog language.
- **Option B — "Soft Green"** (44A today): simpler but conflates library watercolor with preset green tint.

Recommend **Option A** for 46A/46B.

---

## Relationship to other spikes

| Spike | Relationship |
|-------|----------------|
| **44A** | Proved preset switching; 46 polishes UX around it |
| **42** | Target inspector structure; 46 implements Appearance section properly |
| **45** | Library authoring — orthogonal; no blocker |

---

## Recommended implementation order

1. **46A** first — low risk, fixes misleading UI from QA screenshot.
2. **46B** when ready to retire Plan fill from Modify for routine plant edits.

---

## Test plan (manual)

Use one `ALP-Plants-1.0.0` piece (e.g. Liriope Edging Patch):

| Step | Action | Expected |
|------|--------|----------|
| 1 | Select plant in sidebar | No Color and texture panel |
| 2 | Preset Draft Gray ↔ Soft Green | Plan wash changes |
| 3 | Modify → custom peach Plan fill | Sidebar shows Custom |
| 4 | Sidebar Soft Green | Peach replaced; preset synced |
| 5 | Save / reopen | State preserved |
| 6 | (46B) Default wash + None from sidebar | Same as Modify dialog |

---

## Summary

SPIKE-46 closes the gap between SPIKE-44A proof and SPIKE-42 target UX: sidebar appearance controls should be plant-specific, truthful, and eventually complete without modal round-trips.

---

## SPIKE-46A — shipped (Aug 27, 2026)

- Hide **Color and texture** for single ALP plants with `planIconFill`
- Preset dropdown reads **`fillColor`** via `AlpPlantUtils.resolvePlantStylePresetDisplay()` — shows **Default wash**, **Draft Gray**, **Soft Green**, **Custom**, or **None**
- **Custom** is display-only (re-selecting it does not write state)
- Inspector refreshes after **Open full editor…** / Modify furniture closes
- Preset tint colors use opaque ARGB (`0xFFA8A8A8`, `0xFFA8C98B`)

### 46A manual QA checklist

| Step | Expected |
|------|----------|
| Select ALP plant | No Color and texture panel |
| Fresh plant (null fill) | Preset shows **Default wash** |
| Draft Gray / Soft Green | Plan wash toggles |
| Modify → custom peach fill | Preset shows **Custom** |
| Pick Soft Green after custom | Wash + preset sync |
| Save / reopen | State preserved |

---

## SPIKE-46B — shipped (Aug 27, 2026)

- **Plan fill color** panel in sidebar (below Plant style) for layered ALP plants
- **Default wash** checkbox → `fillColor = null`
- **Plan fill** swatch with **None** support (outline only)
- Custom swatch updates preset dropdown to **Custom** via `resolvePlantStylePresetDisplay(fillColor)`
- Preset picks sync checkbox + swatch through shared `applyPlantFillAndPreset(...)`
- Reuses Modify dialog strings from `HomeFurniturePanel`; default custom tint `AlpPlantUtils.DEFAULT_PLAN_FILL_TINT`

### 46B manual QA checklist

| Step | Expected |
|------|----------|
| Select ALP plant | **Plan fill color** section visible under Plant style |
| Default wash checked | Untinted library watercolor; preset **Default wash** |
| Uncheck Default wash → pick peach | Preset **Custom**; wash tints |
| Swatch → None | Outline only; preset **None** |
| Preset Soft Green | Checkbox off; green tint; swatch matches |
| Modify furniture Plan fill | Sidebar syncs on close |

**Manual QA (Aug 27, 2026): PASSED** — user confirmed 46B working; routine plant appearance no longer requires Modify furniture.
