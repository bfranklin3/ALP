# SPIKE-19 — Right-Side Inspector Feasibility

**Date:** August 19, 2026  
**Status:** In progress (steps 1–3 complete; recommendation pending)  
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
| **Polyline** | Double-click; Plan → Modify polyline | `PolylinePanel` | `PolylineController` | Thickness, color, joins, elevation | P1 |
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
- **Default:** ~22% width to inspector (`dividerLocation` 0.78, resize weight 0.85 LTR / 0.15 RTL).
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

## Effort sketch (step 4 — preliminary)

| Scope | Effort | Notes |
|-------|--------|-------|
| Empty right column + divider | Small | Layout only |
| Selection sync + empty state | Small | Listen to `home` selection |
| **Area inspector** — pinned fields (name, fill, opacity, level) | Medium | Refactor off modal OK |
| **Label inspector** — pinned fields | Small–medium | Fewer fields |
| Full `RoomPanel` parity in dock | Large | Many tabs/texture pickers |
| Replace all modals | Very large | Phase 2+ |

---

## Recommendation (step 5 — pending)

**Preliminary (post step 3):** **GO** on Phase 1 prototype — expand **Area/Room** inspector with 3–5 more pinned fields (fill, opacity, level, area-visible), live edit + undo, shared ALP section header styling. Keep **“Open full editor…”** → existing `RoomPanel` modal for edge fields. **Label** inspector can follow the same slim-wrapper pattern.

**Tool-mode inspector:** defer Phase 2.

**Defer entirely if:** N/A — embed validated at step 3.

*Final recommendation updated after step 4 effort review.*

---

## Next steps

1. ~~Entry-point inventory~~ ✓  
2. ~~Layout spike — empty right pane in dev app~~ ✓ (Aug 19, 2026)  
3. ~~Embed spike — slim room wrapper with live name field~~ ✓ (Aug 19, 2026)  
4. Final recommendation + optional prototype PR  
5. SPIKE-21 polish list from prototype learnings  
