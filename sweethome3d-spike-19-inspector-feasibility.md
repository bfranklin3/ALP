# SPIKE-19 — Right-Side Inspector Feasibility

**Date:** August 19, 2026  
**Status:** **COMPLETE** (Aug 19, 2026) — decision: **GO** on Phase 1 right-side inspector  
**Branch:** `cursor/areas-inventory-and-level-locking`  
**Related:** [ALP CAD Detailed Execution Plan.md](ALP%20CAD%20%20Detailed%20Execution%20Plan.md) § SPIKE-19; [sweethome3d-ui-customization-boundary-map.md](sweethome3d-ui-customization-boundary-map.md)

---

## Locked decisions (Aug 19, 2026)

| Topic | Decision |
|-------|----------|
| **Prototype object** | **Area/Room** preferred; **Label** fallback if embed is harder |
| **Edit model** | **Live edit + undo** in dock (no OK/Cancel for routine fields) |
| **Inspector mode** | **Selection-mode only** Phase 1; **tool-mode** (mockup Windows picker) → Phase 2 |
| **Library location** | **Left** unchanged; mockup library = L&F reference only (SPIKE-22) |
| **Styling** | **Targeted ALP panels + design tokens**; FlatLaf/global L&F later |
| **Workflow rail** | **Skip** Phase 1 |
| **3D on New site plan** | **Auto-collapse 3D** (SPIKE-22); not part of SPIKE-19 prototype |

---

## Goal

Replace modal-heavy property editing with a **persistent right work column**: user selects an object on the plan → inspector shows editable properties → changes apply live with undo.

---

## Entry-point inventory

Every path that edits object/home properties in the dev app today. Grouped by surface. **UI type:** Modal = `JOptionPane` / wizard dialog; Inline = table or canvas without dialog; Hybrid = toolbar action applying directly to selection.

### A. Plan canvas — selection mode

| Trigger | Controller / method | Panel / behavior | UI type | Inspector candidate? |
|---------|---------------------|------------------|---------|---------------------|
| **Double-click** selected item | `PlanController.modifySelectedItem()` → type-specific | Routes by selection type (see B) | Modal | **High** — primary friction |
| Single-click + drag handles | `PlanController` move/resize states | Direct manipulation (position, size, rotation) | Canvas | No — keep on canvas |
| **Paste style** (selection) | `PlanController.pasteStyle()` | Copies visual attrs between items | Action | Partial — could be inspector button |
| **Text style toolbar** (label selected) | `increaseTextSize`, `decreaseTextSize`, `toggleBoldStyle`, `toggleItalicStyle` | Updates label attrs + undo | Toolbar | **Medium** — could move into inspector |
| Plan **context menu → Modify …** | Same as menu actions (B) | Modal panels | Modal | **High** |
| Locked item double-click | `modifySelectedItem()` early return | No op | — | N/A |

**Code anchor:** double-click in selection state → `PlanController` ~L9955–9960 (`clickCount == 2` → `modifySelectedItem()`).

### B. Plan object types — Modify dialogs (modal)

| Object | Entry points | Panel | Controller | Key properties (non-exhaustive) | Inspector priority |
|--------|--------------|-------|------------|--------------------------------|-------------------|
| **Room / Area** | Double-click; Plan → Modify area; plan popup | `RoomPanel` | `RoomController` | Name, level, fill color/texture, opacity, floor/ceiling visible, area text, sharp corners | **P0 — prototype** |
| **Label** | Double-click; Plan → Modify label; plan popup | `LabelPanel` | `LabelController` | Text, font, size, style, color, outline, elevation, width wrap (SPIKE-17) | **P0 — fallback prototype** |
| **Wall** | Double-click; Plan → Modify wall | `WallPanel` | `WallController` | Thickness, height, color, texture, arc, patterns | P1 |
| **Polyline** | Double-click; Plan → Modify polyline | `PolylinePanel` | `PolylineController` | Thickness, color, joins, elevation | **P2 — docked inspector** (subset: thickness, dash, color, closed path); full panel via Open full editor |
| **Dimension line** | Double-click; Plan → Modify dimension | `DimensionLinePanel` | `DimensionLineController` | Size, offset, style, elevation | P1 |
| **Furniture** (on plan) | Double-click; routes to home furniture | `HomeFurniturePanel` | `HomeFurnitureController` | Name, size, angle, level, color, texture, price, … + nested dialogs | P2 (large panel) |
| **Compass** | Double-click; Plan → Modify compass | `CompassPanel` | `CompassController` | North direction, size | P3 |
| **Observer camera** | Double-click; 3D menu | `ObserverCameraPanel` | `ObserverCameraController` | Eye position, yaw/pitch | P3 (3D-first; de-emphasize) |

All `*Panel.displayView()` paths use **`SwingTools.showConfirmDialog` / `JOptionPane.OK_OPTION`** — commit on OK, discard on Cancel. Prototype must switch to **live bind + undo** per field or controller batch.

### C. Furniture menu & left inventory

| Trigger | Method | Panel | UI type | Inspector candidate? |
|---------|--------|-------|---------|---------------------|
| Furniture → **Modify furniture** | `HomeController.modifySelectedFurniture()` | `HomeFurniturePanel` | Modal | P2 — large; many site plans use plants/doors sparingly |
| **Double-click row** in Furniture table | `FurnitureController.modifySelectedFurniture()` | `HomeFurniturePanel` | Modal | P2 |
| **Inline edit** Furniture table columns | `FurnitureTable` / `HomeFurnitureController` | Cell editors per visible property | Inline | Partial — name, dimensions, level, color, etc. already inline |
| Catalog → **Modify** (plugin/catalog piece) | `FurnitureCatalogController.modifySelectedFurniture()` | Import/edit catalog wizards | Modal/Wizard | No — catalog admin |
| Catalog / table **Paste style** | `HomeController.pasteStyle()` | — | Action | Low |

### D. Areas inventory (left tab — SPIKE-16B)

| Trigger | Method | UI type | Inspector candidate? |
|---------|--------|---------|---------------------|
| Row select | Syncs selection with plan | Inline | Sync only |
| **Double-click row** | `PlanController.modifySelectedRooms()` → `RoomPanel` | Modal | **High** — same as plan double-click |
| **Inline toggle** Floor visible / Area label visible | `RoomTable` `setValueAt` cols 3–4 | Inline | **Medium** — could live in inspector instead |

Name, level, area columns are **read-only** in table — full edit requires modal today.

### E. Levels / layers

| Trigger | Method | Panel | UI type | Inspector candidate? |
|---------|--------|-------|---------|---------------------|
| Plan → Levels → **Modify level** | `PlanController.modifySelectedLevel()` | `LevelPanel` | Modal | P2 — occasional |
| **Double-click level tab** | `MultipleLevelsPlanPanel` → `modifySelectedLevel()` | `LevelPanel` | Modal | P2 |
| **Manage layers…** | `PlanController.manageLayers()` | `ManageLayersPanel` | Modal (non-blocking table) | Partial — overview; not selection-driven |
| Manage layers → **Modify layer…** | Opens `LevelPanel` | Modal | P2 |
| Tab context **Move layer up/down** | `PlanController.moveSelectedLayerUp/Down()` | — | Action + undo | Low — keep as menu |
| Viewable / Locked in Manage layers | `PlanController.setLevelViewable/Locked()` | Inline in modal table | Inline | Optional “layer context” line in inspector |

### F. Background image & reference

| Trigger | Method | Panel | UI type | Inspector candidate? |
|---------|--------|-------|---------|---------------------|
| Plan → **Import / Modify background image** | `BackgroundImageWizardController` | `BackgroundImageWizardStepsPanel` | Wizard | P2 — multi-step; keep wizard |
| Show / Hide / Delete background | `HomeController` toggle/delete | — | Action + undo | Low |

### G. 3D view (de-emphasize for site plans — SPIKE-22)

| Trigger | Method | Panel | UI type | Inspector candidate? |
|---------|--------|-------|---------|---------------------|
| 3D view → Modify observer | `PlanController.modifyObserverCamera()` | `ObserverCameraPanel` | Modal | Defer |
| 3D view → Modify 3D attributes | `HomeController3D.modifyAttributes()` | `Home3DAttributesPanel` | Modal | Defer |
| Create photo / video | Various | `PhotoPanel`, `VideoPanel` | Modal | Out of scope |

### H. Home / document (not selection inspector)

| Trigger | Panel | Notes |
|---------|-------|-------|
| Page setup | `PageSetupPanel` | SPIKE-20 presets; keep modal or menu |
| Print preview | `PrintPreviewPanel` | Keep modal |
| Preferences | `UserPreferencesPanel` | App-wide |
| Import furniture/texture wizards | Wizard steps panels | Creation flows |

### I. Creation flows (not edit inspector)

Creating walls, rooms, labels, etc. uses **controller modes** + optional creation dialogs (`LabelPanel` in create mode). Out of scope for selection inspector; tool-mode inspector (Phase 2) might surface defaults when a creation tool is active.

---

## Friction summary (site-plan lens)

| Pain | Today | Target |
|------|-------|--------|
| Tweak area fill/name | Double-click → large `RoomPanel` modal | Right inspector, live edit |
| Edit annotation text | Double-click → `LabelPanel` modal | Right inspector or inline (inspector preferred for parity) |
| Iterative color/opacity | OK/Cancel each visit | Live + undo |
| 3D steals vertical space | Default split ~50% on new home | **New site plan:** 3D collapsed (SPIKE-22) |
| Library looks stock | Default Swing tree/list | SPIKE-22 mockup L&F on **left** |

**Highest-frequency modal paths for landscape work:** **Room/Area**, **Label**, then Wall/Dimension/Polyline, then Furniture.

---

## Layout note (step 2 — **validated Aug 19, 2026**)

**Implemented:** `HomePane.createPlanInspectorPane()` — nested horizontal split:

`[ catalogFurniturePane | [ planView3DPane | inspectorPane ] ]`

- **Visual property:** `com.eteks.sweethome3d.SweetHome3D.InspectorPaneDividerLocation` (persisted per home via `configureSplitPane`).
- **Default:** ~300px inspector width on new homes (`DEFAULT_PLAN_INSPECTOR_INSPECTOR_WIDTH`, min 200px); plan min 320px. Resize weight 0.85 favors plan on widen.
- **Placeholder:** replaced in step 3 by `SelectionInspectorPane` (see embed note below).
- **RTL:** component swap listener mirrors existing main-pane pattern.
- **One-touch expand:** stock split-pane collapse hides inspector column (same as catalog/plan dividers).
- **Open existing home fix (Aug 19, 2026):** homes saved with a collapsed plan/inspector divider (or before first layout) could open with zero-width plan pane. `restorePlanInspectorDividerLocation()` applies default 78% plan proportion when no saved divider or saved value leaves plan &lt; 320px; rewrites bad saved property on open.

*Step 3 complete — see embed note below.*

---

## Embed note (step 3 — **validated Aug 19, 2026**)

**Implemented:** `SelectionInspectorPane` docked in `HomePane.createInspectorPane()`.

- **Selection sync:** listens to `home` selection; shows room inspector when selection is exclusively `Room` items on unlocked layers.
- **Empty states:** no selection, mixed selection, locked layer — each with a distinct message.
- **Prototype field:** area **name** via slim panel reusing `RoomPanel` strings and `AutoCompleteTextField`.
- **Controller reuse:** persistent `RoomController` via `HomeController.createRoomController()`; `refreshProperties()` reloads from selection.
- **Live edit + undo:** name commits on **Enter** or **focus lost** → `RoomController.modifyRooms()` (same undo path as modal OK).
- **Not embedded:** full `RoomPanel` (floor/ceiling/texture tabs remain modal-only for now).

**Finding:** Option 2 (slim wrapper + controller APIs) works without refactoring `RoomPanel` away from OK/Cancel. Full parity can grow field-by-field in SPIKE-21.

---

## Embed note (pre-step-3 analysis)

Existing property views are **`JPanel` subclasses** with `displayView()` wrapping **`JOptionPane`**. Prototype options:

1. **Embed panel, bypass `displayView()`** — host `RoomPanel` / `LabelPanel` in right column; controller listens to selection; call `controller.modify*()` on field change with undo (may require panel refactor away from OK-button assumption).
2. **Slim inspector panel** — new `AreaInspectorPanel` reads/writes model via existing controller APIs; reuses subset of `RoomPanel` fields.
3. **Read-only first** — lower risk but doesn’t meet live-edit decision; skip unless embed proves blocked.

`LabelPanel` / `RoomPanel` both commit via `controller.modifyLabels()` / `modifyRooms()` on OK — **live edit requires property change listeners** posting undo per controller pattern (see `PageSetupController`, SPIKE-20 output preset edits).

*Validated in step 3 — slim wrapper approach confirmed.*

---

## Decision gate (step 4 — **validated Aug 19, 2026**)

### Decision

**GO** — proceed with a **Phase 1 right-side selection inspector** in ALP CAD.

The spike question — *can a docked right column replace modal-heavy editing for high-value site-plan objects, with live edit + undo?* — is answered **yes**. Layout (step 2), slim embed (step 3), and manual QA (Aug 19) met all prototype success criteria. **Label fallback is not required**; the same slim-wrapper pattern can extend to labels in SPIKE-21.

### Refined effort table (actual vs estimated)

Estimates from pre-spike analysis compared with what steps 2–3 proved. **Actual** reflects work already shipped on `cursor/areas-inventory-and-level-locking`.

| Scope | Pre-spike | Actual (Aug 19) | Remaining (SPIKE-21+) | Notes |
|-------|-----------|-----------------|-------------------------|-------|
| Empty right column + divider | Small | **Small ✓** | — | `createPlanInspectorPane`, persisted divider, existing-home width fix |
| Selection sync + empty states | Small | **Small ✓** | Polish copy/styling | Mixed / locked / no-selection messages validated in QA |
| Area inspector — **name** (live + undo) | Medium | **Small ✓** | — | `SelectionInspectorPane` + `RoomController.modifyRooms()` on commit |
| Area inspector — fill, opacity, level, area-visible | Medium | — | **Medium** | Reuse slim wrapper; no `RoomPanel` OK/Cancel refactor |
| Area inspector — texture / ceiling / wall sides | Large | — | **Defer** | Keep modal via double-click or **Open full editor…** |
| Label inspector — text, font, style (pinned subset) | Small–medium | — | **Small–medium** | Same pattern as area name; fewer fields than `LabelPanel` |
| Wall / polyline / dimension pinned fields | Medium each | — | **Phase 2+** | Lower site-plan frequency |
| Furniture inspector subset | Large | — | **Phase 2+** | Table inline edit already covers much |
| Full `RoomPanel` / all modals in dock | Very large | — | **Out of scope Phase 1** | Edge fields stay modal |
| Tool-mode inspector (active tool, no selection) | — | — | **Phase 2** | Locked decision |
| ALP section headers + design tokens on inspector | Small | — | **Small** | SPIKE-21 styling pass |

**Risk retired:** Full `RoomPanel` embed is **not** required. Slim wrapper + existing controller APIs is the approved extension path.

### Phase 1 scope boundary

**In scope (build in SPIKE-21, on prototype already in dev app):**

- Selection-mode inspector on the **right** only; library stays **left**
- **Area/Room:** name ✓, then fill color, floor opacity, area-label visible, level (read-only or picker TBD)
- **Label:** pinned text + style fields (after area batch)
- Live edit + undo per field (commit on Enter / focus lost for text; immediate for toggles/spinners)
- **Open full editor…** link → existing `RoomPanel` / `LabelPanel` modal for edge fields
- Shared ALP empty-state copy and section headers

**Out of scope Phase 1:**

- Tool-mode inspector, workflow rail, FlatLaf / global L&F swap
- Full modal replacement for walls, furniture, wizards, page setup
- Moving catalog or inventory to the right column

### SPIKE-21 handoff (prioritized)

Execute in order; each item should reduce double-click modals for site-plan work without expanding scope to left column or full panel parity.

| Priority | Item | Rationale | Likely touchpoints |
|----------|------|-----------|-------------------|
| **P0** | Area **fill color** + **floor opacity** | **Done Aug 19** — live edit + undo in `SelectionInspectorPane` | `SelectionInspectorPane`, `RoomController` |
| **P0** | Area **area-label visible** toggle | **Done Aug 19** — checkbox in name/area section | `RoomController.Property.AREA_VISIBLE` |
| **P1** | **Selection summary header** (type, count, layer) | **Done Aug 19** — title + layer subtitle in active inspector | `SelectionInspectorPane`, `AlpInspectorStyles` |
| **P1** | **Open full editor…** action | **Done Aug 19** — opens `RoomPanel` modal; commits pending name first | `PlanController.modifySelectedRooms()` |
| **P1** | ALP **design tokens** on inspector (section headers, padding, empty state) | **Done Aug 19** — shared `AlpInspectorStyles`; styled empty states | `SelectionInspectorPane`, `AlpInspectorStyles` |
| **P1** | Area **Smooth corners** toggle | **Done Aug 19** — live edit in floor section | `RoomController.Property.SMOOTHED` |
| **P1.5** | Area **outline** thickness + dash + color | **Done Aug 19** — property lines/setbacks on Base Reference layer | `Room`, `SelectionInspectorPane`, `PlanComponent` |
| **P2** | **Polyline docked inspector** (thickness, dash, color, closed path) | **Done Aug 19** — live edit + undo in `SelectionInspectorPane` | `SelectionInspectorPane`, `PolylineController` |
| **P2** | **Label docked inspector** (text, font size, bold/italic, color) | **Done Aug 19** — live edit + undo in `SelectionInspectorPane` | `LabelController`, `SelectionInspectorPane` |
| **P2b** | **Dimension docked inspector** (offset, length font size, color) | **Done Aug 19** — live edit + undo in `SelectionInspectorPane` | `DimensionLineController`, `SelectionInspectorPane` |
| **P2c** | Area **level** display (read-only) | **Done Aug 19** — dedicated layer row in area inspector | `SelectionInspectorPane`, `Room` / `Level` |
| **P3** | **Wall docked inspector** (thickness, height, **pattern in plan**) | **Done Aug 19** — 2D fill via `Wall.pattern`; left/right/top colors are 3D-only | `WallController`, `SelectionInspectorPane`, `PlanComponent` |
| **P3** | **Furniture docked inspector** (name, size, angle, color subset) | **Done Aug 19** — plan-selected objects without full modal | `HomeFurnitureController`, `SelectionInspectorPane` |
| **P4** | Inspector **divider default** (~300px right column) | **Done Aug 19** — pixel default + invalid saved location fix | `HomePane` divider proportions |
| **P4** | **Keyboard / focus** polish (mnemonics, tab order) | **Done Aug 19** — recursive disable of hidden cards; label mnemonics | `SelectionInspectorPane` |

**SPIKE-21 success metric:** Edit a typical Proposed-layer area (name, fill, opacity, label visibility) **without opening a modal**; undo each change; double-click still available for advanced fields. **P2 extension:** same pattern for polylines (thickness, dash, color, closed path) and labels (subset).

**Polyline docked inspector — explicit out of scope (P2):** polyline **name**, lines **inventory** tab, arrows/join/elevation in dock (defer to **Open full editor…** / `PolylinePanel`).

**Label docked inspector — explicit out of scope (P2):** alignment, width wrap, font family, elevation, 3D pitch (defer to **Open full editor…** / `LabelPanel`).

**Dimension / wall / furniture docked inspectors — defer advanced fields** to each type’s full modal panel; dock carries high-frequency subset only.

**Wall 2D vs 3D appearance (P3):** `PlanComponent` fills walls with **`Wall.pattern`** (hatch) plus plan foreground for outline. **Left/right side color and top color affect 3D only** — same as stock `WallPanel`. Docked wall inspector exposes **Pattern in plan**; use **Open full editor…** for 3D materials.

---

## Effort sketch (pre-spike analysis — superseded by step 4 table above)

---

## Next steps

1. ~~Entry-point inventory~~ ✓  
2. ~~Layout spike — empty right pane in dev app~~ ✓ (Aug 19, 2026)  
3. ~~Embed spike — slim room wrapper with live name field~~ ✓ (Aug 19, 2026)  
4. ~~Decision gate — GO, effort table, SPIKE-21 handoff~~ ✓ (Aug 19, 2026)  
5. ~~**SPIKE-21 P0** — area fill, opacity, area-label visible~~ ✓ (Aug 19, 2026)  
6. ~~**SPIKE-21 P1** — summary header, open full editor, design tokens, smooth corners~~ ✓ (Aug 19, 2026)  
7. ~~**SPIKE-21 P2+** — ~~Label~~ ✓ → ~~Dimension~~ ✓ → ~~area level~~ ✓ → ~~wall/furniture~~ ✓ → ~~P4 polish~~ ✓ (Aug 19, 2026)
8. ~~SPIKE-22~~ — catalog L&F + 3D collapse on New site plan ✓ (Aug 19, 2026)
9. **SPIKE-23** — Phase 1 stock vs. branded scope  
