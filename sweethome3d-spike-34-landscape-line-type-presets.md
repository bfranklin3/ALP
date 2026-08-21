# SPIKE-34 — Landscape Line Type Presets

**Date:** August 21, 2026  
**Status:** **COMPLETED** — Aug 21, 2026  
**Branch:** follow-on from `cursor/areas-inventory-and-level-locking` (or dedicated UI branch)  
**Parent:** SPIKE-19 / SPIKE-21 (docked inspector — area outline + polyline inspectors shipped Aug 19, 2026)  
**Related:** `Polyline.java`, `Room.java`, `ShapeTools.java`, `SelectionInspectorPane.java`, `PolylinePanel.java`, `PlanComponent.java`, `HomeXMLHandler.java`, `HomeXMLExporter.java`

---

## Goal

Replace the generic Sweet Home 3D dash-style picker (DOT, DASH, DASH_DOT, …) with a small set of **landscape-oriented line type presets** for **polylines** and **area outlines**. Users pick a named preset from a dropdown with a visual preview — no numeric dash/gap editing.

Presets encode semantic meaning (property line, setback, utility, etc.) while reusing the existing `BasicStroke` dash pipeline (`Polyline.DashStyle` + `ShapeTools.getStroke()`).

---

## Problem

### Stock dash styles are interior-draft oriented

Sweet Home 3D ships five generic dash styles (`DOT`, `DASH`, `DASH_DOT`, `DASH_DOT_DOT`, plus `SOLID`). Names and rhythms do not match landscape/site-plan conventions:

| Stock name | Feels like | Landscape need |
|------------|------------|----------------|
| DOT | Generic dotted | Hidden / overhead |
| DASH | Generic dashed | Could be anything |
| DASH_DOT | Generic | Utility / easement |
| DASH_DOT_DOT | Generic | Rarely used |

Users drawing property lines, setbacks, and phasing limits must guess which generic style fits — and the names do not communicate intent on plans or in the inspector.

### Engine supports more than the UI exposes

Polylines already support `DashStyle.CUSTOMIZED` with a freeform `float[] dashPattern` and XML persistence (`dashPattern`, `dashOffset`). **No user-facing editor** exists for custom patterns. This spike deliberately **does not** expose numeric control — only curated presets.

Areas (`Room`) store `outlineDashStyle` as an enum only; pattern is derived from `getDashPattern()`. Same preset list applies to both object types.

---

## Locked decisions (Aug 21, 2026)

### Approach

| Topic | Decision |
|-------|----------|
| **Option chosen** | **Option C** — landscape preset line types (curated enum values + pattern arrays) |
| **Custom numeric control** | **No** — presets only; `CUSTOMIZED` stays hidden in UI (existing behavior) |
| **Dash offset** | **Unchanged** — remains in full **Modify polyline** dialog only; not added to docked inspector |
| **Layer defaults** | **No** — new lines/areas do **not** inherit dash style from the active layer; user picks per object |

### Dash scaling (relative vs absolute)

| Topic | Decision |
|-------|----------|
| **Scaling model** | **Relative** — dash and gap lengths scale with **line thickness** (keep stock SH3D / `ShapeTools.getStroke()` behavior) |
| **Rationale** | Presets express **visual language** (property vs setback), not surveyed inch dimensions. Relative scaling keeps rhythm consistent when thickness changes for print or emphasis. No engine change required. |
| **Deferred** | **Absolute** dash length in plan inches (CAD linetype scale) — follow-on only if code compliance, agency submittals, or DXF/CAD interchange require it |

**How relative scaling works today:** Pattern values in `getDashPattern()` are multiples of a **1 cm reference thickness**. At render time, `ShapeTools.getStroke()` multiplies each segment by the object's actual thickness. Example: preset `[12, 3]` on a 0.3 cm line produces shorter dashes than on a 1.5 cm line, but the **12:3 dash-to-gap ratio** is preserved.

### Scope

| Surface | In scope | Notes |
|---------|----------|-------|
| **Polyline** — docked inspector | Yes | Dash style dropdown (already shipped SPIKE-19 P2) |
| **Polyline** — full **Modify polyline** dialog | Yes | Same preset list in `PolylinePanel` |
| **Area (room) outline** — docked inspector | Yes | Outline dash style dropdown (already shipped SPIKE-19 P1.5) |
| **Area** — full **Modify area** dialog | No | `RoomPanel` has no outline dash control today; defer unless requested |
| **Walls** | No | Walls use hatch **patterns**, not dash styles |
| **Dimension lines** | No | Stock solid only |
| **Labels** | No | — |

### Preset catalog (ALP v1)

User-visible presets in dropdown order:

| # | User-visible name | Enum constant (proposed) | Semantic use |
|---|-------------------|--------------------------|--------------|
| 1 | **Solid** | `SOLID` | Existing boundaries, proposed hardscape edges, general linework |
| 2 | **Property line** | `PROPERTY_LINE` | Lot lines, survey limits, legal boundary |
| 3 | **Setback** | `SETBACK` | Building/structure setbacks, buffer limits |
| 4 | **Utility / easement** | `UTILITY` | Utilities, drainage, easements, ROW |
| 5 | **Phase / demo** | `PHASE` | Limits of work, demolition, phasing, temporary limits |
| 6 | **Hidden / overhead** | `HIDDEN` | Hidden or overhead elements (fine dotted) |

**Dropdown UX:** Keep stock SH3D pattern — **icon preview only** (horizontal line sample), no enum name text in the list cell (existing `PolylinePanel` renderer). Optional: localized tooltip or accessible name via `package.properties` keys `Polyline.DashStyle.PROPERTY_LINE.text`, etc.

### Backward compatibility — stock enum values

Existing `.sh3d` files may reference stock dash styles: `DOT`, `DASH`, `DASH_DOT`, `DASH_DOT_DOT`, `CUSTOMIZED`.

| Topic | Decision |
|-------|----------|
| **Enum retention** | Keep all stock values in `Polyline.DashStyle` so XML load never fails |
| **UI exposure** | ALP presets **first**; stock generics (`DOT`, `DASH`, …) **at the bottom** — not removed |
| **Legacy in inspector** | If selected object has `DASH`, `DOT`, etc., show that value in the combo (append to list for mixed selection) so user can see and change it |
| **XML write** | Save using the enum name actually stored on the object (presets write new names; unchanged legacy objects keep old names until user picks a preset) |
| **No auto-migration** | Do not rewrite legacy dash styles on file open |

### Outline + transparent fill interaction (SPIKE-33)

When area **outline color** is **None** (transparent sentinel), outline thickness and dash style are **ignored** (no stroke). Preset picker may remain visible but changes have no visible effect until a real outline color is set — same as SPIKE-33.

---

## Pattern ratios (starting values — tune during visual QA)

All values are **relative units** at 1 cm reference thickness; scaled by actual stroke width at render.

| Preset | `float[]` pattern | Dash : gap rhythm | Notes |
|--------|-------------------|-------------------|-------|
| **SOLID** | `{1, 0}` | — | Unchanged |
| **PROPERTY_LINE** | `{12, 6}` | 2 : 1 | Longest dashes; gap tuned Aug 21 (`{12, 3}` → `{12, 4}` → `{12, 6}`) |
| **SETBACK** | `{6, 3}` | 2 : 1 | Medium; clearly distinct from property line |
| **UTILITY** | `{8, 2, 2, 2}` | dash-dot | Same rhythm as stock `DASH_DOT`; semantic rename only |
| **PHASE** | `{3, 6}` | 1 : 2 | Short dash, long gap — “temporary / limited” |
| **HIDDEN** | `{1, 2}` | 1 : 2 dotted | Finer than stock `DOT` `{1, 1}`; lighter overhead feel |

### Tuning guide (during implementation)

1. Preview all six presets at **default polyline thickness** (~1 px plan) and at **area outline 5/8"** (typical property line weight).
2. Confirm **Property line** and **Setback** are visually distinguishable at **print scale** (50% outline thickness in print mode — existing `PlanComponent` behavior).
3. Confirm **Phase** does not read as a solid line when zoomed out.
4. Confirm **Hidden** is finer than **Utility** dash-dot at same thickness.
5. Adjust ratios in **one place** — `Polyline.DashStyle.getDashPattern()` — and re-preview.

**Stock patterns (reference, not in ALP dropdown):**

| Legacy | Pattern |
|--------|---------|
| DOT | `{1, 1}` |
| DASH | `{4, 2}` |
| DASH_DOT | `{8, 2, 2, 2}` |
| DASH_DOT_DOT | `{8, 2, 2, 2, 2, 2}` |

---

## Inspector UI — after SPIKE-34

### Polyline — Outline section (unchanged layout)

```text
Outline
┌─────────────────────────────────────────────────────────────┐
│  Thickness (inch):  [ 0'0 1/8" ........................... ]  │
│  Dash style:        [ ▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬ ]  │  ← icon preview
│  Color:             [■ ....................................]  │
│  Closed path:       [ ]                                       │
└─────────────────────────────────────────────────────────────┘
```

Dropdown icons (left → right conceptual preview):

```text
Solid          ─────────────────────────
Property line  ────────  ────────  ────
Setback        ────  ────  ────  ────
Utility        ──────── · ──────── ·
Phase          ──    ──    ──    ──
Hidden         ·  ·  ·  ·  ·  ·  ·  ·
```

### Area — Outline section

Same preset list on **Dash style** row (already present from P1.5). Thickness + color unchanged.

---

## Implementation phases

### Phase 1 — Model + rendering (~2 h) — **SHIPPED Aug 21, 2026**

| Step | Scope |
|------|--------|
| 1.1 | Add `PROPERTY_LINE`, `SETBACK`, `UTILITY`, `PHASE`, `HIDDEN` to `Polyline.DashStyle` |
| 1.2 | Implement `getDashPattern()` cases (table above); leave legacy cases unchanged |
| 1.3 | Verify `ShapeTools.getStroke()` + `PlanComponent` render new presets for polylines and area outlines |
| 1.4 | Update XML DTD comments in `HomeXMLHandler.java` for new `outlineDashStyle` / `dashStyle` values |

**Deliverable:** New presets render correctly when set programmatically or via XML.

**Note:** Until Phase 2, the dash combo uses `DashStyle.values()` (minus `CUSTOMIZED`) — new presets already appear in the inspector with icon previews but without curated ordering or legacy filtering.

### Phase 2 — Inspector + dialog UI (~3 h) — **SHIPPED Aug 21, 2026**

| Step | Scope |
|------|--------|
| 2.1 | Add `AlpDashStyleSupport` (or static helper) — `getAlpDashStyleChoices()`, `getAlpDashStyleChoicesIncluding(Polyline.DashStyle legacy)` for mixed/legacy selection |
| 2.2 | `SelectionInspectorPane` — polyline dash combo: ALP preset list + legacy fallback |
| 2.3 | `SelectionInspectorPane` — area outline dash combo: same list |
| 2.4 | `PolylinePanel` — same preset list (replace unfiltered `DashStyle.values()`) |
| 2.5 | Optional: `package.properties` localized display names for accessibility / tooltips |

**Deliverable:** User can pick all six presets from docked inspector and full polyline editor.

### Phase 3 — Persistence + QA (~1 h) — **SHIPPED Aug 21, 2026**

| Step | Scope |
|------|--------|
| 3.1 | Confirm `HomeXMLExporter` writes new enum names via `.name()` on `dashStyle` / `outlineDashStyle` |
| 3.2 | Round-trip load/save — `HomeFileRecorderTest.testLandscapeDashStyleRoundTrip()` |
| 3.3 | Visual QA — preset icons, ordering, property line `{12, 6}` gap, preview clip fix (Aug 21) |
| 3.4 | Mark spike **SHIPPED** in this doc and execution plan |

**Deliverable:** Presets survive save/reopen; legacy files unchanged.

---

## Technical approach

### Files to touch

| File | Change |
|------|--------|
| **`Polyline.java`** | Extend `DashStyle` enum; add `getDashPattern()` cases |
| **`AlpDashStyleSupport.java`** (new, `swing/` or `tools/`) | Curated preset list; legacy inclusion helper |
| **`SelectionInspectorPane.java`** | Polyline + area outline dash combos use ALP list |
| **`PolylinePanel.java`** | Dash combo uses ALP list |
| **`HomeXMLHandler.java`** | DTD comment update (parser already uses `valueOf`) |
| **`package.properties`** | Optional localized preset names |

**No changes expected:** `ShapeTools.java`, `Room.java`, `PlanComponent.java` (already call `getDashPattern()`), `RoomController.java`, `PolylineController.java`.

### Helper sketch

```java
final class AlpDashStyleSupport {
  private static final Polyline.DashStyle[] ALP_PRESETS = {
      Polyline.DashStyle.SOLID,
      Polyline.DashStyle.PROPERTY_LINE,
      Polyline.DashStyle.SETBACK,
      Polyline.DashStyle.UTILITY,
      Polyline.DashStyle.PHASE,
      Polyline.DashStyle.HIDDEN,
  };

  static List<Polyline.DashStyle> getPresetChoices(Polyline.DashStyle current) {
    // Return ALP_PRESETS; append current if legacy (DOT, DASH, …) and not already in list
  }
}
```

### XML examples

```xml
<polyline … dashStyle="PROPERTY_LINE" … />
<room … outlineDashStyle="SETBACK" … />
```

Legacy unchanged:

```xml
<polyline … dashStyle="DASH" … />
<room … outlineDashStyle="DASH_DOT" … />
```

---

## Test plan

### Preset picker — polyline

- [x] Select a polyline → Dash style dropdown shows ALP presets first with icon previews and friendly names.
- [x] Pick **Property line** → plan updates immediately; undo restores previous style.
- [x] Pick each preset → visually distinct at default thickness.
- [x] **Modify polyline** dialog shows the same preset list with icon previews.
- [ ] Multi-select polylines with mixed dash styles → combo shows empty/null until user picks a preset.

### Preset picker — area outline

- [x] Select an area → Outline **Dash style** shows same preset list with icon previews.
- [x] Pick **Setback** / **Property line** → area outline updates on plan; undo works.
- [x] Outline color **None** (SPIKE-33) → dash style change has no visible effect until outline color restored.

### Thickness scaling (relative)

- [x] Dash patterns scale with line thickness (stock `ShapeTools.getStroke()` behavior retained).
- [ ] Print preview / export → dashes scale with print outline thickness halving (manual check).

### Persistence

- [x] `HomeXMLExporter` writes enum name (e.g. `PROPERTY_LINE`, `UTILITY`).
- [x] `HomeFileRecorderTest.testLandscapeDashStyleRoundTrip()` — polyline + area round-trip; legacy `DASH` reloads.
- [ ] Manual: save/reopen `.sh3d` after picking presets in UI.

### Regression

- [x] **Solid** preset unchanged.
- [x] Stock patterns (`DOT`, `DASH`, …) remain at bottom of dropdown; XML load unchanged.
- [x] Preview icon clip — no stray dot between sample line and label (Setback, Phase).
- [ ] Area fill, fill texture, outline thickness/color (SPIKE-32/33) unchanged (manual).

---

## Out of scope (SPIKE-34)

- Numeric dash length / gap length spinners (`CUSTOMIZED` editor)
- Dash offset in docked inspector
- Layer default linetype per level (Site → Property, etc.)
- Absolute dash length in plan inches
- Wall hatch / pattern changes
- Named linetype library in Preferences (Option D from discussion)
- CAD DXF linetype export
- **Modify area** dialog outline dash control (`RoomPanel`)
- Print preset remapping of dash styles by layer

---

## Dependencies & ordering

| Relation | Notes |
|----------|-------|
| **After SPIKE-19 P1.5 / P2** | Area outline + polyline dash dropdowns already in docked inspector |
| **Independent of SPIKE-33** | Transparent outline ignores dash; no conflict |
| **Independent of SPIKE-32** | Fill texture work unrelated |
| **Feeds SPIKE-23** | Add linetype preset names to branding/terminology audit if needed |

**Suggested order:** Phase 1 → Phase 2 → Phase 3 (single session, ~0.5–1 day).

---

## Effort estimate

| Phase | Estimate |
|-------|----------|
| Phase 1 — Model + rendering | ~2 h |
| Phase 2 — Inspector + dialog UI | ~3 h |
| Phase 3 — Persistence + QA | ~1 h |
| **Total** | **~0.5–1 day** |

---

## Next steps

1. **Review** this spike — confirm preset names and pattern ratios.
2. **Implement** Phase 1 → 2 → 3 on branch.
3. **Visual tune** pattern arrays with B at typical site-plan zoom and print scale.
4. **Mark SHIPPED** and add preset table to SPIKE-23 checklist if terminology audit is underway.
