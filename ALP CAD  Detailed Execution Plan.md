# ALP CAD — Detailed Execution Plan

**Last updated:** August 20, 2026  
**Strategy reference:** [sweethome3d-phase-1-implementation-roadmap.md](sweethome3d-phase-1-implementation-roadmap.md)  
**Source submodule:** `source/SweetHome3D-7.5-src` (ALP-Core)

---

## Progress Summary

| Metric | Status |
|--------|--------|
| **Blocks complete** | A, B, C, D (4 of 8) |
| **Spikes complete** | 26 of 29 tracked items |
| **Next block** | **Block F** — Levels & Site Plan (M3) — **IN PROGRESS** |
| **Branch** | `cursor/areas-inventory-and-level-locking` |

**Completed spikes:** SPIKE-01–10, 10b, 12b, 13, 14, 14b, **15, 15a, 15b, 15c**, **16**, 16A, 16B, 17, 18, **19**, **20**, **21**, **22**, **24**, **25**, **29**, **30**
**Next up:** SPIKE-23 Phase 1 scope

---

## Master Spike Index

| Spike | Block | Milestone | Status | Summary |
|-------|-------|-----------|--------|---------|
| SPIKE-01 | M0 | Foundation | **COMPLETED** | Area / room rendering path documented |
| SPIKE-02 | M0 | Foundation | **COMPLETED** | Text rendering path documented |
| SPIKE-03 | M0 | Foundation | **COMPLETED** | Level behavior path documented |
| SPIKE-04 | M0 | Foundation | **COMPLETED** | UI / inspector touchpoints identified |
| SPIKE-05 | B | M1 | **COMPLETED** | Area fill opacity control |
| SPIKE-06 | B | M1 | **COMPLETED** | Polygon corner smoothing + per-vertex sharp corners |
| SPIKE-07 | D | M1 | **COMPLETED** | Soften “room” → “area / room” on key UI surfaces |
| SPIKE-08 | D | M1 | **COMPLETED** | Feet + inches in background calibration |
| SPIKE-09 | E | M2 | **COMPLETED** | Phase 1 library schema → [alp-phase-1-library-schema.md](alp-phase-1-library-schema.md) |
| SPIKE-10 | E | M2 | **COMPLETED** | Plant starter pack (Option A; ISO-8859-1 fix; validated) |
| SPIKE-10b | E | M2 | **COMPLETED** | Plant asset pipeline v1.0.2 (trim, alpha, planIconLine `\:`) |
| SPIKE-11 | E | M2 | Pending | Outdoor-feature starter pack |
| SPIKE-12 | F | M2 | Pending | Custom 2D top-view symbol improvements |
| SPIKE-13 | A | M3 | **COMPLETED** | Level locking |
| SPIKE-14 | F | M3 | **COMPLETED** | Flat level defaults (Plan level, same-elevation Add) |
| SPIKE-14b | F | M3 | **COMPLETED** | Add layer toolbar button + ALP strings |
| SPIKE-15 | G | M3 | **COMPLETED** | Layer reorder UX (tab menu + Manage layers dialog) |
| SPIKE-15a | G | M3 | **COMPLETED** | Tab context menu — Move layer up / down |
| SPIKE-15b | G | M3 | **COMPLETED** | Manage layers dialog + toolbar swap |
| SPIKE-15c | G | M3 | **COMPLETED** | Drag-reorder level tabs on plan tab bar |
| SPIKE-16 | F | M3 | **COMPLETED** | Starter level template (Reference / Existing / Proposed / Plants / Annotations) |
| SPIKE-16A | A | M3 | **COMPLETED** | Furniture inventory level column |
| SPIKE-16B | A | M3 | **COMPLETED** | Areas (room) inventory panel |
| SPIKE-17 | C | M4 | **COMPLETED** | Width-based wrapped text |
| SPIKE-18 | C | M4 | **COMPLETED** | One-click draft / monochrome mode |
| SPIKE-19 | G | M4 | **COMPLETED** | Right-side inspector feasibility — **GO**; prototype in dev app |
| SPIKE-20 | G | M4 | **COMPLETED** | MVP print / export presets (File menu actions) |
| SPIKE-21 | H | M5 | **COMPLETED** | Minimum right inspector improvements (post–SPIKE-19 GO) |
| SPIKE-22 | H | M5 | **COMPLETED** | Focused workflow UI pass (Esc exit, site plan 3D collapse, catalog L&F) |
| SPIKE-23 | H | M5 | Pending | Phase 1 stock vs. branded scope definition |
| SPIKE-24 | H | M5 | **COMPLETED** | Docked layer inspector when plan selection empty — [spike doc](sweethome3d-spike-24-layer-docked-inspector.md) |
| SPIKE-25 | H | M5 | **COMPLETED** | Current-layer-only selection + lock blocks pick — [spike doc](sweethome3d-spike-25-layer-selection-filtering.md) |
| SPIKE-29 | H | M5 | **COMPLETED** | Right column context deck (Layers, Selection, Layer items, Plants) — [spike doc](sweethome3d-spike-29-right-column-context-deck.md) |
| SPIKE-30 | H | M5 | **COMPLETED** | Layer role metadata (Category + Plant takeoff); flag-based multi-layer schedule — [spike doc](sweethome3d-spike-30-layer-role-metadata.md) |

---

## M0: Foundation (Complete)

*Goal: Map the codebase and validate feasibility before feature work.*

All M0 spikes are **documentation-only** — completed during August 2026 spike days. No further implementation required unless the source tree shifts significantly.

| Spike | Status | Documentation |
|-------|--------|---------------|
| SPIKE-01 — Area / room rendering path | **COMPLETED** | [sweethome3d-source-map-phase-1.md](sweethome3d-source-map-phase-1.md) §2, §4; [sweethome3d-spike-day-2-findings.md](sweethome3d-spike-day-2-findings.md) |
| SPIKE-02 — Text rendering path | **COMPLETED** | [sweethome3d-source-map-phase-1.md](sweethome3d-source-map-phase-1.md) §4 (`LabelPanel`, `PlanComponent`); [sweethome3d-spike-day-2-findings.md](sweethome3d-spike-day-2-findings.md) |
| SPIKE-03 — Level behavior path | **COMPLETED** | [sweethome3d-source-map-phase-1.md](sweethome3d-source-map-phase-1.md) §3; [sweethome3d-spike-day-1-findings.md](sweethome3d-spike-day-1-findings.md) |
| SPIKE-04 — UI / inspector touchpoints | **COMPLETED** | [sweethome3d-ui-customization-boundary-map.md](sweethome3d-ui-customization-boundary-map.md); [sweethome3d-source-map-phase-1.md](sweethome3d-source-map-phase-1.md) |

**M0 exit criteria met:** We know where Phase 1 changes belong and can rank them by risk.

---

## Milestone Block A: Inventory & Layer Visibility

*Goal: Enable users to organize and track architecture and landscape elements across named levels (Existing, Proposed, Plants).*  
*Milestone: M3 (partial)*  
**Status: COMPLETE**

### 1. [SPIKE-16A] Finalize Furniture Level Exposure — **COMPLETED**

- **Description:** Ensure every placed object (windows, doors, plants) shows its level in the main list.
- **Status:** `LEVEL` property added to default furniture visible properties in `Home.java`.
- **Touchpoints:** Model, View.

### 2. [SPIKE-16B] Create the "Areas" (Room) Inventory Panel — **COMPLETED**

- **Description:** Build a brand-new inventory list for drawn areas (lawns, patios, beds) since no stock list exists.
- **Status:** `RoomTable` and `RoomTablePanel` implemented and integrated as a tab in `HomePane`.
- **Touchpoints:** Model, View, Controller.

### 3. [SPIKE-13] Implement Basic Level Protection (Locking) — **COMPLETED**

- **Description:** Add a "Locked" property to levels to prevent accidental modification of reference surveys or existing building footprints.
- **Status:**
  - Added `locked` boolean property and logic to `Level` model.
  - Added "Locked" checkbox to `LevelPanel` properties dialog and summary table.
  - Updated `PlanController` and `LevelController` to enforce the lock across all tools (move, resize, delete, rotate, properties).
- **Touchpoints:** Model, View, Controller.

**Block A exit criteria met:** Users can see level membership for objects and areas, and protect reference content with level locks.

---

## Milestone Block B: Landscape Visual Representation

*Goal: Adapt the rendering engine to support believable outdoor area fills and site-plan underlays.*  
*Milestone: M1 (partial)*  
**Status: COMPLETE**

### 1. [SPIKE-05] Area Fill Opacity Control — **COMPLETED**

- **Description:** Allow area objects to be semi-transparent so users can see the survey underlay beneath a planting bed or patio fill.
- **Status:**
  - Added `floorOpacity` property to `Room` model (default 75%, matching prior hardcoded behavior).
  - Added opacity spinner to `RoomPanel` Floor section in the Modify rooms dialog.
  - Updated `PlanComponent` to render fills using per-room opacity.
  - Persisted `floorOpacity` in home file XML import/export.
- **Touchpoints:** Model, View, Controller, 2D Rendering.

### 2. [SPIKE-06] Polygon Corner Smoothing Prototype — **COMPLETED**

- **Description:** Provide an option to smooth sharp corners of a drawn area to create organic-looking planting beds or lawns.
- **Status:**
  - Added `smoothed` boolean property to `Room` model.
  - Added "Smooth corners" checkbox to `RoomPanel` Floor section.
  - Added `ShapeTools.getRoomShape()` reusing curved polyline rendering for plan view fills and outlines.
  - Persisted `smoothed` in home file XML import/export.
  - Follow-up (kept): per-vertex sharp corners on a smoothed room. Option-click a vertex handle to toggle; sharp handles draw as squares, smooth as rounds. Stored as `sharp` on XML `<point>` elements.
- **Touchpoints:** Model, View, Controller, 2D Rendering.

**Block B exit criteria met:** Outdoor areas have opacity and smoothing controls proven in code. M1 terminology and calibration items remain for Block D.

---

## Milestone Block C: Annotation & Output

*Goal: Improve the plan's ability to communicate design intent via text and presentation styles.*  
*Milestone: M4 (partial)*  
**Status: COMPLETE**

### 1. [SPIKE-17] Width-Based Wrapped Text — **COMPLETED**

- **Description:** Replace simple single-line text with wrapping labels for long planting notes or site descriptions.
- **Status:**
  - Added `width` property to `Label` model (`null` = no wrap, legacy behavior).
  - Added "Wrap width" spinner to `LabelPanel` in the Modify text dialog.
  - Updated `PlanComponent` to wrap label text with `LineBreakMeasurer` when width is set.
  - Persisted `width` in home file XML import/export.
- **Touchpoints:** Model, View, Controller, 2D Rendering.

### 2. [SPIKE-18] One-Click Draft (Monochrome) Mode — **COMPLETED**

- **Description:** A global toggle to switch the plan from "Presentation Color" to "B&W Construction/Draft" style.
- **Status:**
  - Added `draftMode` property to `Home` model (persisted in home file XML).
  - Updated `PlanComponent` to render plan in black and white when draft mode is enabled.
  - Added Plan menu, context menu, and toolbar toggle (Draft mode / Presentation mode).
  - Fixed action enablement in `HomeController`; Mac shortcut is `⌘⇧D` (avoids Dock `⌘⌥D` conflict).
- **Touchpoints:** Model, View, 2D Rendering.

**Block C exit criteria met:** Wrapped annotations and one-click draft output are working. Print presets and inspector work remain for Block G.

---

## Milestone Block D: Landscape UX & Underlay

*Goal: Finish the Landscape Planning Baseline (M1) so outdoor work no longer feels borrowed from indoor semantics.*  
*Depends on: Block C complete*  
*Milestone: M1 (completion)*  
**Status: COMPLETE**

### Exit criteria

- High-traffic UI reads "area" (or equivalent) instead of "room" where it matters most.
- Background-image calibration accepts feet as well as inches when the project uses imperial units.
- Outdoor area workflow feels intentional in live testing (see [sweethome3d-spike-day-2-findings.md](sweethome3d-spike-day-2-findings.md)).

---

### 1. [SPIKE-07] Soften "Room" Terminology on Key UI Surfaces — **COMPLETED**

- **Description:** Rename user-facing "room" strings to "area" or "area / room" on high-traffic surfaces only — **not** a full codebase or model rename.
- **Status:**
  - Updated English strings in `swing/package.properties` for Plan menu/toolbar, context menu, Modify dialog, tips, preferences label, and select-object feedback.
  - Left unchanged: Java/XML identifiers, undo presentation names, non-English locale files, stock icon paths.
- **Scope:**
  - **In:** Menus, toolbar tooltips, mode names, Modify dialog titles, Areas inventory tab labels, creation tips, context menu items.
  - **Out:** Java class names (`Room`, `RoomPanel`), XML element names, internal undo strings, full localization pass for all 20+ languages.
- **Likely files:**
  - `src/com/eteks/sweethome3d/swing/package.properties` (primary — `HomePane.CREATE_ROOMS`, `MODIFY_ROOM`, `RoomPanel.*`, tooltips)
  - `RoomTablePanel` / tab title strings if separate from `package.properties`
  - Optional: toolbar icon tooltips only (keep stock icons)
- **Steps:**
  1. Inventory all user-visible "room" strings in `package.properties` (English only for Phase 1).
  2. Classify each as **change**, **keep** (e.g. help text referencing SH3D concepts), or **defer**.
  3. Apply targeted string updates; prefer "Create areas", "Modify areas...", "Area" in selection feedback.
  4. Rebuild dev JAR; walk Plan menu, toolbar, right-click, Modify dialog, Areas tab.
  5. Confirm saved home files still open (no model/XML changes).
- **Test plan:** Create and modify an area; verify no broken mnemonics or missing labels; check Areas inventory tab title.
- **Touchpoints:** View (localization only).

---

### 2. [SPIKE-08] Feet + Inches in Background Image Calibration — **COMPLETED**

- **Description:** Allow known-distance calibration input in feet (and inches) for imperial workflows, not inches alone.
- **Status:**
  - Added `NullableSpinnerCalibrationLengthModel` using foot/inch format for inch-based preferences during calibration.
  - Imperial calibration step shows ft/in label and help text with `25'` and `25' 6"` examples.
- **Touchpoints:** View (`BackgroundImageWizardStepsPanel`, `NullableSpinner`, `package.properties`).

**Block D exit criteria met:** Area terminology updated; imperial calibration accepts feet and inches. M1 Landscape Planning Baseline is complete.

---

## Milestone Block E: Library Foundation

*Goal: Replace generic stock libraries with a credible Phase 1 plant and outdoor content set.*  
*Depends on: Block D complete*  
*Milestone: M2 (part 1)*  
**Status: IN PROGRESS**

### Exit criteria

- Documented library schema for Phase 1. ✓
- At least one installable custom plant library and one outdoor-feature library load in the dev app.
- Sample plan using custom content looks clearly better than stock-only.

---

### 1. [SPIKE-09] Define Phase 1 Library Schema — **COMPLETED**

- **Deliverable:** [alp-phase-1-library-schema.md](alp-phase-1-library-schema.md) — category tree, ID/naming rules, required SH3D metadata, plan vs 3D expectations, `.sh3f` layout, validation checklist, SPIKE-10/11 starter menus.
- **Touchpoints:** Documentation only.

---

### 2. [SPIKE-10] Build Plant Starter Pack — **COMPLETED (Option A)** ✓ validated in Dev app

- **Approach:** **Option A** — `planIcon` = presentation composite (watercolor from source sheet **right** column); line-art PNGs in `plan-icons-line/` for SPIKE-12b / SPIKE-28. Lightweight 3D placeholder OBJ.
- **Source art:** `libraries/ALP-Plants-1.0.0/source/plant-symbol-sheet.png` (992×557 px; 30 symbols; line + color halves).
- **Build:** `./scripts/build-alp-plants-library.sh` → `ALP-Plants-1.0.0.sh3f` (12 pieces, category **`ALP Plants`**).
- **Validated:** Import, catalog folder, Presentation + Top view plan icons (Aug 18, 2026).
- **Critical discovery — catalog properties encoding:** SH3D reads `PluginFurnitureCatalog.properties` as **ISO-8859-1** via `PropertyResourceBundle`. UTF-8/em-dash/`›` in the first pack caused **Libraries yes / catalog empty** until the build script emitted ASCII-only properties. Documented in [alp-phase-1-library-schema.md](alp-phase-1-library-schema.md).
- **Asset quality — follow-up [SPIKE-10b](#3-spike-10b-plant-symbol-asset-pipeline-polish):** grid crop misalignment, stock watermark on source sheet, opaque white PNG backgrounds, footprint vs symbol aspect (e.g. Liriope strip). Pipeline proof OK; art pass deferred.
- **Draft mode:** catalog-icon-in-box until [SPIKE-12b](#spike-12b-draft-mode--line-art-planicon-block-f-prerequisite).
- **Settings (Mac):** Sweet Home 3D → **Settings…** → **Furniture icons in plan: Top view**; place in **Presentation mode**.

---

### 3. [SPIKE-10b] Plant symbol asset pipeline polish — **COMPLETED (v1.0.2)**

- **Delivered:** `scripts/split-plant-symbol-sheet.py` — grid crop, ink trim, white/watermark→alpha, square pad, centered transparent PNGs; `build-alp-plants-library.sh`; paired `planIcon#N` + `planIconLine#N\:CONTENT` (escaped colon — required for SH3D CONTENT load).
- **Footprint fixes:** Liriope → square 5 ft patch; boxwood hedge → 30×3 ft (depth × width) to match vertical hedge symbol.
- **Remaining:** Source sheet still carries stock watermark — replace with licensed art when ready (not blocking pipeline).
- **Docs:** [alp-phase-1-library-schema.md](alp-phase-1-library-schema.md) — **Draft vs Presentation plan icons** section.

---

### 4. [SPIKE-11] Build Outdoor-Feature Starter Pack — **Next**

- **Description:** Create hardscape / site furniture symbols (patios, seating, planters, basic site amenities).
- **Depends on:** SPIKE-09 schema.
- **Steps:**
  1. Select 8–15 outdoor feature symbols complementary to plant pack.
  2. Author library per schema; avoid overlap with stock furniture where custom look matters.
  3. Bundle and validate same as SPIKE-10.
- **Test plan:** Mixed building + landscape sample plan using plant + outdoor packs.
- **Touchpoints:** Content.

---

## Milestone Block F: Symbols & Project Setup

*Goal: Improve plan symbol quality and give new projects sensible landscape-oriented defaults.*  
*Depends on: Block E complete*  
*Milestones: M2 (completion) + M3 (start)*  
**Status: PENDING**

### Exit criteria

- Custom 2D top-view assets proven feasible without deep engine surgery.
- New homes default to flat, landscape-friendly level setup.
- Optional starter template creates Reference / Existing / Proposed / Plants / Annotations levels — **delivered in SPIKE-16**.

---

### 1. [SPIKE-12] Custom 2D Top-View Asset Improvements — Pending

- **Description:** Validate and extend 2D plan symbol rendering for ALP plant/outdoor content.
- **Prerequisite spike:** **[SPIKE-12b](Backlog / Ideas#spike-12b-draft-mode--line-art-planicon-block-f-prerequisite)** — Draft mode uses line-art `planIcon` (documented in Backlog).
- **Stretch goal:** **[SPIKE-28](Backlog / Ideas#spike-28-layered-plant-plan-symbols--line--watercolor-fill--fill-color-option-c)** — separate line + watercolor fill layers + user fill color.
- **Likely files:** `PlanComponent.java`, `DefaultFurnitureCatalog.java`, `FurniturePanel.java`.
- **Steps:**
  1. Implement SPIKE-12b (Draft → planIcon line art).
  2. Complete [SPIKE-10b](#3-spike-10b-plant-symbol-asset-pipeline-polish) art pipeline (crop, alpha, watermark, sizing).
  3. Validate SPIKE-10 `.sh3f` in Draft and Presentation at multiple zoom levels.
  4. Decide default **Top view** preference for ALP installs (Settings on Mac).
  5. Prototype SPIKE-28 two-layer paint if fill-color UX is prioritized.
- **Test plan:** Compare stock vs ALP symbols in Draft vs Presentation; confirm background/area draft behavior unchanged.
- **Touchpoints:** 2D Rendering, Content.

---

### 2. [SPIKE-14] Flat Level Defaults for Landscape Workflows — **COMPLETED (Aug 18, 2026)**

- **Description:** Change default level creation behavior so new projects feel like 2D site layers, not a multi-story floor stack.
- **Delivered:** `AlpLevelDefaults` — auto **Plan** level on new home; **Add level** defaults to same elevation; `newLevelHeight=30` cm separate from wall height; `newFloorThickness=0`; overlay names **Layer 2**, **Layer 3**, …
- **Likely files:** `AlpLevelDefaults.java`, `HomeApplication.java`, `HomeController.java`, `PlanController.java`, `UserPreferences.java`, `DefaultUserPreferences.properties`.
- **Out of scope (SPIKE-16):** Pre-built five-level template (Reference / Existing / Proposed / Plants / Annotations); lock Reference by default.

#### Problem (stock SH3D)

| Behavior | Stock default |
|----------|---------------|
| New `Home()` | **0 levels** — user must **Add level** first |
| First **Add level** | **"Level 0"** at elevation 0; height = `newWallHeight` (~250 cm / 8 ft) |
| Next **Add level** | Stacks vertically by `newWallHeight + newFloorThickness` (~262 cm per floor) |
| Level names | `"Level %d"` |

Landscape work wants **flat overlays at one grade**, not a multi-story stack.

#### Approved design (Aug 18, 2026)

**A. Auto-create first level on File → New home**

| Property | Stock | ALP |
|----------|-------|-----|
| Level count | 0 | **1** |
| Name | — | **`Plan`** |
| Elevation | — | **0** |
| Height | 250 cm | **30 cm** (~1 ft; 2D-first, minimal 3D extent) |
| Floor thickness | 12 cm | **0 cm** (ALP default preference) |
| Selected | null | **`Plan`** |

**B. Default Add level → same elevation (overlay layer)**

- **Add level** behaves like stock **Add level at same elevation** (new `elevationIndex`, not +262 cm Z stack).
- Stock vertical stacking remains available later if needed (e.g. building on site); not removed in v1.

**C. Separate level height from wall height**

- **`newHomeWallHeight`** stays ~250 cm for **walls**.
- **`newLevelHeight`** = **30 cm** for level creation (new preference or ALP constant via `UserPreferences`).
- **`newFloorThickness`** ALP default = **0 cm**.

**D. Naming**

| Context | Name |
|---------|------|
| First level (new home) | **Plan** |
| Additional levels | **Layer 2**, **Layer 3**, … (`layerName=Layer %d`) |

#### User journeys

1. **Blank site:** File → New home → **Plan** ready; draw areas / place plants immediately.
2. **Multi-layer (manual):** Add level → **Layer 2** at same elevation; toggle visibility / lock per SPIKE-13.
3. **SPIKE-16 later:** New from template → five named levels in one step.

#### Implementation steps

1. `HomeApplication.createHome()` / `HomeController.newHome()` — call helper to add default **Plan** level when levels empty.
2. `PlanController.addLevel()` — default `sameElevation=true`.
3. `PlanController.createLevel()` / naming — use **Plan** / **Layer N** strings; level height from `newLevelHeight`.
4. `DefaultUserPreferences.properties` — `newFloorThickness=0`, `newLevelHeight=30`.
5. **Do not change** XML import of existing homes.

#### Test plan

- [x] File → New home → one level **Plan**, elevation 0, selected.
- [ ] Draw area / place furniture without Add level (manual QA in Dev app).
- [x] Add level → **Layer 2** at **same elevation** as Plan (code path verified).
- [ ] 3D view: levels not separated by ~8 ft (manual QA).
- [x] Open pre-SPIKE-14 `.sh3d` unchanged (no change to XML import).
- [ ] Undo/redo Add level works (manual QA).

- **Touchpoints:** Model, Controller, Preferences.

---

### 2b. [SPIKE-14b] Add Layer Toolbar Button — **COMPLETED (Aug 18, 2026)**

- **Description:** Surface **Add layer** on the plan toolbar and align English strings with SPIKE-14 layer naming (Plan / Layer 2+).
- **Context:** Stock SH3D wires `ADD_LEVEL` to menu, context menu, and the **+** tab on the level strip — but not the main toolbar. Post–SPIKE-14 QA: users wanted a faster path to add overlay layers.
- **Delivered:**
  - Plan toolbar button → `ADD_LEVEL` (same-elevation overlay per SPIKE-14).
  - English strings: **Add layer** (menu, toolbar tooltip, undo label).
  - Level tab **+** tooltip updated to **Add layer** (was stock **Add level**).
- **Likely files:** `HomePane.java` (`createToolBar`), `swing/package.properties`, `viewcontroller/package.properties` (`undoAddLevel`).
- **Out of scope:** Hide or relabel **Add level at same elevation** menu item (redundant with SPIKE-14; defer to SPIKE-22).
- **Test plan:**
  - [ ] Toolbar **Add layer** button visible after zoom controls; creates **Layer 2** at same elevation.
  - [ ] Plan → Levels menu shows **Add layer**; shortcut ⌘⌥N unchanged.
  - [ ] Level tab **+** tooltip reads **Add layer**.
  - [ ] Undo label reads **Add layer**.
- **Note (SPIKE-15b):** Plan toolbar slot repurposed for **Manage layers**; Add layer remains on tab **+**, Plan → Levels menu, and shortcuts.

---

### 3. [SPIKE-16] Starter Level Grouping Template — **COMPLETED (Aug 18, 2026)**

- **Description:** Offer a new-project template with levels: Reference, Existing, Proposed, Plants, Annotations.
- **Note:** SPIKE-16A and SPIKE-16B (inventory visibility) were already complete.
- **Delivered:**
  - **File → New site plan…** (`⌘⇧S`) — programmatic five-level template via `AlpLevelDefaults.addStarterSitePlanLevels()`.
  - **File → New** unchanged — single **Plan** level (SPIKE-14 blank-site path).
  - All template levels at elevation **0**; **Reference** locked; **Proposed** selected for drawing.
  - **Default draw/tab order** — levels created in order Reference → Existing → Proposed → Plants → Annotations; `Home.addLevel()` assigns `elevationIndex` 0…4 at the same elevation, so **Reference is bottom of stack (underlay)** and **Annotations on top** without extra code (same intent as Option D).
  - Level names localized in `AlpLevelDefaults.properties`.
- **Likely files:** `AlpLevelDefaults.java`, `HomeApplication.createSitePlanHome()`, `HomeController.newSitePlan()`, `HomePane` File menu, `HomeView.ActionType.NEW_SITE_PLAN`.
- **Out of scope:** Per-level colors (SH3D `Level` has no color field); hide/show defaults beyond all viewable.
- **Recommended workflow:**
  1. **New site plan** for typical landscape/site work.
  2. Import survey / aerial on **Reference** (locked underlay); draw as-built on **Existing**; design on **Proposed**; plants on **Plants**; notes/dims on **Annotations**.
  3. **New** (single Plan) for minimal scratch or non-layered tests.
- **Test plan:**
  - [x] File → New site plan → five tabs: Reference | Existing | Proposed | Plants | Annotations.
  - [x] **Proposed** selected; **Reference** locked (cannot draw; unlock via Levels menu if needed).
  - [x] All levels same elevation; 3D view flat.
  - [x] Furniture / Areas inventory **Level** column shows correct names.
  - [x] File → New still creates single **Plan** level only.
- **Touchpoints:** Model, Controller, View.

---

## Milestone Block G: Workflow Polish & Deliverables

*Goal: Close remaining layer and output gaps with intentional workflows.*  
*Depends on: Block F complete*  
*Milestones: M3 (completion) + M4 (completion)*  
**Status: COMPLETE** (Aug 19, 2026)

### Exit criteria

- Level reorder decision documented (implemented or explicitly deferred). — **Done:** stock `elevationIndex` reorder documented; **15a/15b** surface it in ALP UX.
- Print/export presets reduce manual setup for draft and presentation output. — **Done:** SPIKE-20.
- Persistent inspector decision documented (small prototype or defer to Block H). — **Done:** SPIKE-19 **GO**; area name live in right column; SPIKE-21 expands fields.
- UI layout direction for left library vs right inspector documented (see below).

---

### UI layout direction (clarified Aug 19, 2026)

**Reference:** Architecture Landscape Planner product mockup (guided left rail, calm center canvas, right contextual panel). Phase 1 treats the mockup as **direction**, not a pixel-perfect shell rewrite — see [sweethome3d-ui-customization-boundary-map.md](sweethome3d-ui-customization-boundary-map.md).

**Target three-zone model:**

```
┌─────────────────────┬────────────────────┬─────────────────┐
│  LEFT work column   │   CENTER canvas    │  RIGHT work     │
│  (keep location)    │   Plan (+ 3D)      │  column (new)   │
├─────────────────────┼────────────────────┼─────────────────┤
│  Library / catalog  │                    │  Inspector /    │
│  Furniture inventory│                    │  properties     │
│  Areas inventory    │                    │  (+ future      │
│                     │                    │   non-modal UI) │
└─────────────────────┴────────────────────┴─────────────────┘
```

| Zone | Phase 1 intent | Notes |
|------|----------------|-------|
| **Left** | **Keep** Catalog + Furniture + Areas tabs where they are today (`HomePane.createCatalogFurniturePane`). | Do **not** move the library to the right (mockup showed libraries top-right for visual inspiration only). |
| **Left — library look & feel** | Restyle catalog toward mockup: soft palette, category rows with counts, expandable sections, icon chips — **presentation only**, same controller/drag-drop. | Tracked under **SPIKE-22** (catalog L&F), not SPIKE-19. Likely files: `FurnitureCatalogListPanel`, `FurnitureCatalogTree`, cell renderers, ALP theme constants. |
| **Center** | Stock 2D plan core unchanged. | |
| **Right** | **New** docked work column for inspector/properties and other flows that today stack **modals** (double-click → dialog). | SPIKE-19 feasibility + optional prototype; SPIKE-21 polish. Layout: extend `HomePane.createMainPane()` with nested horizontal split `[ left \| [ center \| right ] ]` — same `JSplitPane` + saved divider pattern as today. |
| **Mockup left “Workflow focus” rail** | Guided checklist / setup steps. | **Out of scope** for SPIKE-19; optional SPIKE-22 item or Phase 2. |

**Modal → docked candidates (right inspector, priority TBD in spike):**

- Labels (text, size, style, width wrap)
- Areas / rooms (name, fill, opacity, level)
- Walls, dimensions, polylines (common fields)
- Level/layer summary when nothing selected (later)

**Explicit non-goals for this layout pass:**

- Relocating library/catalog to the right column
- Full HTML mockup shell (custom left workflow rail + top command strip) in Phase 1
- Replacing every modal in one spike — start with one object type after feasibility

---

### 1. [SPIKE-15] Level Reordering — **COMPLETED (Aug 18, 2026)**

- **Original ask:** Determine whether users can reorder levels for MVP, and implement drag-reorder only if scope is small.
- **Finding — capability already exists (stock SH3D ≥ 5.0):**
  - Stack order at a given elevation is stored as **`elevationIndex`**, sorted with **`elevation`** in `Home.LEVEL_ELEVATION_COMPARATOR`.
  - For ALP flat site plans (all layers at elevation 0), **`elevationIndex` = overlay draw order**.
  - **Modify level** dialog (`LevelPanel`) — green **Move level up/down** arrows adjust `elevationIndex`; summary table updates live; **OK** commits with undo (`LevelController.modifyLevels()`).
  - **Double-click level tab** opens Modify level (`MultipleLevelsPlanPanel` → `modifySelectedLevel()`).
  - Level tabs and plan view refresh on `ELEVATION_INDEX` change.
  - **Manual QA (Aug 18):** Reorder works; friction is discoverability and workflow, not missing engine support.
- **Default stack order (Option D — no separate spike):** Delivered in **SPIKE-16**. `AlpLevelDefaults.addStarterSitePlanLevels()` adds levels in order Reference → … → Annotations; each `home.addLevel()` at elevation 0 receives `elevationIndex` 0…4 automatically → Reference underlay, Annotations on top in a new site plan.
- **Out of scope for SPIKE-15 (original):** New reorder model, cross-elevation reorder (multi-story; not ALP Phase 1). Tab **drag-reorder** deferred to **SPIKE-15c** (spec Aug 19, 2026).
- **Decision:** Do **not** defer reorder. Reframe SPIKE-15 as **UX to surface existing behavior**, via sub-spikes **15a** and **15b** below.
- **Block G exit (partial):** Level reorder decision documented — **implemented in stock; ALP improves exposure.**

#### 1a. [SPIKE-15a] Tab context menu — Move layer up / down — **COMPLETED (Aug 18, 2026)**

- **Description:** Right-click a level tab → **Move layer up** / **Move layer down** without opening Modify level.
- **Delivered:**
  - `LevelController.moveLevelElevationIndex()` — reuses `elevationIndex` swap logic + undo.
  - `PlanController.moveSelectedLayerUp/Down()` + enable checks in `HomeController.enableLevelActions()`.
  - Tab popup items via `MultipleLevelsPlanPanel` (same routing as Modify level / Delete level).
  - ALP strings: **Move layer up/down**; undo labels in `LevelController` properties.
- **Likely files:** `LevelController.java`, `PlanController.java`, `HomeController.java`, `HomePane.java`, `MultipleLevelsPlanPanel.java`, `HomeView.java`, `package.properties`.
- **Test plan:**
  - [ ] New site plan → right-click **Reference** tab → Move layer down disabled at stack bottom.
  - [ ] Move **Annotations** up/down → tab order updates immediately.
  - [ ] Undo/redo move.
  - [ ] Move layer down disabled when neighbor is at different elevation (multi-story home).
- **Touchpoints:** View, Controller.

#### 1b. [SPIKE-15b] Manage layers dialog — **COMPLETED (Aug 18, 2026)**

- **Description:** **Plan → Levels → Manage layers…** — modal dialog to view and reorder all layers (not buried in single-level Modify).
- **Rationale:** Matches CAD layer-manager mental model; overview of Name, Viewable, Locked; scales beyond five template layers.
- **Delivered:**
  - **`ManageLayersPanel`** — table (Name | Viewable | Locked), top row = top of draw stack; **▲/▼** live reorder via `LevelController.moveLevelElevationIndex()` (immediate + undo per move).
  - **Modify layer…** opens existing **Modify level** modal for selected row (no double-click in v1).
  - **Close** only (not Cancel — use Undo to revert moves).
  - **Selection sync:** row click → `planController.setSelectedLevel()` → plan tabs follow.
  - **Toolbar:** **Add layer** button (SPIKE-14b) replaced with **Manage layers**; Add layer remains on tab **+**, Plan → Levels menu, and shortcuts.
  - **`MANAGE_LAYERS`** action: `PlanController.manageLayers()`, `ViewFactory.createManageLayersView()`, menu + toolbar wiring.
- **Likely files:** `ManageLayersPanel.java`, `PlanController.java`, `LevelController.java`, `HomePane.java`, `HomeView.java`, `HomeController.java`, `ViewFactory.java`, `SwingViewFactory.java`, `package.properties`.
  - **Out of scope (v1):** Left-column docked layer manager; double-click row; drag-reorder in dialog. Tab **drag-reorder** → **SPIKE-15c**. Right-side inspector/layer summary is SPIKE-19/21 (see **UI layout direction**).
- **Test plan:**
  - [ ] **File → New site plan…** → **Plan → Levels → Manage layers…** (or toolbar button after zoom).
  - [ ] Table shows all five layers; top row = Annotations (top of stack).
  - [ ] Select **Proposed** → plan tab switches to Proposed.
  - [ ] Move **Proposed** up/down → tabs and draw order update immediately; undo/redo.
  - [ ] **Modify layer…** opens Modify level for selected row; Close returns to Manage layers.
  - [ ] Toolbar shows **Manage layers**, not Add layer; tab **+** still adds layers.
- **Touchpoints:** View, Controller.

#### 1c. [SPIKE-15c] Drag-reorder level tabs — **COMPLETED (Aug 19, 2026)**

- **Description:** Drag a level tab horizontally to reorder the overlay stack (e.g. drag **Proposed** to the far left).
- **Deliverable:** [sweethome3d-spike-15c-layer-tab-drag-reorder.md](sweethome3d-spike-15c-layer-tab-drag-reorder.md) — scope, drag UX sketch, undo behavior, test plan.
- **Depends on:** SPIKE-15a/15b (existing `elevationIndex` + `LevelController.updateLevelElevationIndex()`).
- **In scope:** Same-elevation tab drag; drag threshold; insert indicator; single undo per drop; preserve click / double-click / **+** tab / context menu.
- **Out of scope:** Multi-story cross-elevation drag; Manage layers row drag; left docked layer manager.
- **Likely files:** `MultipleLevelsPlanPanel.java`, `LevelController.java`, `PlanController.java`, `package.properties`.
- **Effort:** ~1–2 days. Independent of SPIKE-21.
- **Sequencing:** After SPIKE-21 P0 or parallel polish before SPIKE-22 catalog L&F.

---

### 2. [SPIKE-20] MVP Print / Export Presets — **COMPLETED**

- **Description:** Define and implement preset print/PDF/SVG export settings for draft vs presentation output.
- **Likely files:** `AlpOutputPresets.java`, `HomeController`, `HomePane`, `PlanComponent`, `HomePrint`, draft mode.
- **Delivered (Aug 18, 2026):**
  - **File → Apply draft output preset** — plan-only, B&amp;W (draft mode), no furniture/3D, clears header/footer.
  - **File → Apply presentation output preset** — plan-only, color (draft mode off), no furniture/3D, keeps header/footer.
  - Preserves page size/orientation/margins from current print settings; landscape defaults when none saved.
  - Combined undo for print settings + draft mode. SVG export respects draft mode via `PlanComponent.isDraftMode(EXPORT)`.
- **Steps:**
  1. ~~Document current print and PDF flows~~ ✓
  2. ~~Define two presets~~ ✓
  3. ~~Implement as menu actions~~ ✓
  4. ~~Manual QA: print preview, PDF, SVG with both presets; verify undo~~ ✓ (Aug 18, 2026)
- **Test plan:** Export same plan with both presets; compare output to manual baseline.
- **Touchpoints:** View, Controller, export pipeline.

---

### 3. [SPIKE-19] Right-Side Inspector Feasibility — **COMPLETED**

- **Description:** Validate whether a **new right-side work column** for inspector/properties is worth adding in Phase 1 — replacing modal-heavy edit flows, not relocating the library.
- **Context:** Overlaps SPIKE-21 (inspector polish). Run after SPIKE-20. **Library stays on the left**; mockup library styling is SPIKE-22 (see **UI layout direction** above).
- **Deliverable:** [sweethome3d-spike-19-inspector-feasibility.md](sweethome3d-spike-19-inspector-feasibility.md) — locked decisions, entry-point inventory, layout/embed validation, **GO decision**, SPIKE-21 handoff.
- **Decision (Aug 19, 2026):** **GO** on Phase 1 selection-mode right inspector. Slim wrapper + `RoomController` / `LabelController` APIs — not full `RoomPanel` embed. Tool-mode inspector → Phase 2.
- **Shipped in dev app:** `SelectionInspectorPane` — area **name** live edit + undo; selection sync; empty states for no selection, mixed selection, locked layer.
- **Steps:**
  1. ~~**Inventory:** List all property-edit entry points~~ ✓ — see spike doc.
  2. ~~**Layout spike:** Right column via nested `JSplitPane`~~ ✓ (Aug 19, 2026).
  3. ~~**Embed spike:** Docked panel with live selection sync and undo~~ ✓ — area name (Aug 19, 2026).
  4. ~~**Effort estimate + decision gate~~ ✓ — refined table + SPIKE-21 handoff (Aug 19, 2026).
- **Prototype success criteria:** Met — select area → edit name on right → plan updates → undo works → no modal for that field.
- **Next:** SPIKE-21 P2 **Label** → P2b Dimension → P2c area level → P3 wall/furniture; then divider defaults + keyboard polish.

---

## Milestone Block H: MVP Packaging

*Goal: Package proven behaviors into a simpler, intentionally branded product shell.*  
*Depends on: Block G complete*  
*Milestone: M5*  
**Status: PENDING**

### Exit criteria

- Right-side inspector changes identified and at least one implemented. — **Done:** SPIKE-19 GO + SPIKE-21 docked inspectors (area, polyline, label, dimension, wall, furniture).
- One focused workflow UI pass shipped (not a full rewrite) — includes catalog look-and-feel toward mockup on **left**.
- Written Phase 1 scope: what stays stock SH3D vs ALP-branded.

---

### 1. [SPIKE-21] Minimum Right Inspector Improvements — **COMPLETED (Aug 19, 2026)**

- **Description:** After SPIKE-19, implement the **smallest right-column** changes with the largest clarity gain — not left sidebar/inventory rework.
- **Depends on:** SPIKE-19 decision — **GO** (Aug 19, 2026). Build on `SelectionInspectorPane` prototype; see spike doc **SPIKE-21 handoff** table.
- **P0 delivered (Aug 19, 2026):** Live area **name**, **fill color**, **floor opacity**, **display area size** in docked inspector; undo via `RoomController.modifyRooms()`; name commits on Enter or selection change when edited; color/opacity/area-visible do not overwrite name.
- **P1 delivered (Aug 19, 2026):** **Selection summary header** (type, count, layer); **Open full editor…** (modal escape hatch); **AlpInspectorStyles** design tokens (padding, empty state, summary typography); **Smooth corners** toggle in floor section.
- **P1.5 delivered (Aug 19, 2026):** Per-area **outline thickness**, **dash style**, and **outline color** in docked inspector; XML persistence; plan rendering via `ShapeTools.getStroke()`.
- **P2 delivered (Aug 19, 2026):** **Polyline docked inspector** — thickness, dash style, color, closed path; live edit + undo; **Open full editor…** → `PolylinePanel`.
- **P2 delivered (Aug 19, 2026):** **Label docked inspector** — text, font size, bold/italic, color; live edit + undo; **Open full editor…** → `LabelPanel`.
- **P2b delivered (Aug 19, 2026):** **Dimension docked inspector** — offset, length font size, color; live edit + undo; **Open full editor…** → `DimensionLinePanel`.
- **P2c delivered (Aug 19, 2026):** Area **level display** (read-only layer row in name/area section; summary subtitle unchanged).
- **P3 delivered (Aug 19, 2026):** **Wall docked inspector** — thickness, height, **pattern in plan** (2D hatch fill); left/right/top side colors are **3D-only** in stock SH3D — use **Open full editor…** for 3D materials. **Furniture docked inspector** — name, size, angle, color; live edit + undo.
- **P4 delivered (Aug 19, 2026):** Inspector **~300px default width** (pixel-based divider on new homes; invalid saved divider fix); **keyboard/focus polish** — label mnemonics wired via `configureInspectorFieldLabel`, tab order skips hidden CardLayout panels via recursive `setEnabled` on inactive cards (refresh runs after enable so per-field disabled states stay correct).
- **Manual QA checklist (P4):**
  - [ ] **New site plan:** right inspector column opens at ~300px; plan view remains usable.
  - [ ] **Open old home** (saved before inspector column): divider auto-corrects if plan or inspector was collapsed.
  - [ ] **Tab order:** with area selected, Tab cycles only area inspector fields (not hidden polyline/label/wall/furniture cards).
  - [ ] **Selection switch:** select area → polyline → label → dimension → wall → furniture; Tab stays in active card each time.
  - [ ] **Empty / mixed selection:** empty-state label is not focusable; no stray focus in hidden cards.
  - [ ] **Mnemonics (Windows/Linux):** Alt+letter activates labeled fields in each inspector type; Mac skips mnemonics (stock SH3D behavior).
  - [ ] **Resize divider:** drag inspector wider/narrower; location persists on save/reopen.
- **Locked decisions (Aug 19, 2026):**
  - Build only on **SPIKE-19 right column** (selection-mode inspector); do not scope left library or workflow rail here.
  - **Live edit + undo** remains the interaction model (consistent with SPIKE-19).
  - **Tool-mode inspector** deferred to Phase 2 (post–SPIKE-21 unless re-prioritized).
  - Use **shared ALP design tokens** from inspector prototype for section headers and empty states.
- **Examples:** Empty-state copy (“Select an object…”), selection summary header, 2–3 pinned fields per object type, divider default width (~300px), focus/keyboard behavior, **“Open full editor…”** link to modal for edge-case fields only.
- **Steps:**
  1. Review SPIKE-19 output; prioritize 1–2 improvements on the **right** inspector only.
  2. Implement highest-value item only.
  3. User test: edit area, edit text, tweak common properties with **fewer modals** and fewer clicks.
- **Out of scope:** Moving library to right; full modal removal for all object types; catalog L&F (SPIKE-22).
- **Touchpoints:** View (`HomePane` right column), Controller (selection sync).

---

### 2. [SPIKE-22] Focused Workflow UI Pass — **COMPLETED**

- **Description:** One small, workflow-oriented UI improvement batch — not a whole-shell rewrite.
- **Locked decisions (Aug 19, 2026):**
  - **Library stays on the left** — mockup library block is **L&F reference only** (colors, category rows, counts, icon chips).
  - **Styling approach:** **Targeted ALP panels** (catalog, Furniture/Areas tabs to match); **FlatLaf / global L&F** deferred unless targeted pass feels too disjoint from stock chrome.
  - **3D-first UI de-emphasis:** **Auto-collapse 3D pane** on **File → New site plan…** (set `PlanPaneDividerLocation` so plan uses full center height; user can expand 3D anytime). Regular **New** home unchanged.
  - **Workflow rail / setup checklist:** **Skip** for Phase 1.
  - **Default panel layout:** Coordinate divider defaults when SPIKE-19 adds right inspector column.
- **Delivered (Aug 18, 2026) — ESC exits creation tools:**
  - `AbstractModeChangeState.escape()` returns to **Select** when a creation tool is idle; mid-draw keeps stock cancel-then-exit (two-step Esc).
  - Pan mode unchanged. Toolbar toggles sync via existing `MODE` listener.
  - Creation toolbar tooltips note “Press Esc to return to Select”.
  - **Manual QA:** passed all five tools.
- **Delivered (Aug 19, 2026) — site plan plan-first layout + catalog L&F:**
  - **New site plan:** 3D pane collapsed by default via `AlpLevelDefaults.applySitePlanUiDefaults()`; user can expand anytime; regular **New** unchanged.
  - **`AlpCatalogStyles`:** soft palette shared by catalog, inventory tabs/tables, and docked inspector background.
  - **Catalog tree/list:** category rows show counts; rounded chip icons; warm panel background; **full-width category chips** span tree row width.
  - **Furniture / Areas tables:** lighter grid + header styling to match catalog; selected tab text readable on light background.
  - **Manual QA:** passed (3D collapse, counts, inspector/library color match, tab styling, category chips).
- **Deferred polish (post–SPIKE-22):**
  - Catalog category / menu cleanup (ALP-named groups: Plants, Hardscape, Reference, …) — library content (`.sh3f` packs), not UI chrome.
  - Split-pane divider softening; inspector input field flat styling; table alternating row tints.
  - Default panel layout and divider defaults (coordinate with SPIKE-19 right column).
  - **FlatLaf / global L&F** — explicitly out of scope for Phase 1.
- **Removed from scope:** Plan setup checklist / workflow rail (skip Phase 1).
- **Touchpoints:** View (`FurnitureCatalogListPanel`, `FurnitureCatalogTree`, `HomePane`, `SelectionInspectorPane`), Model (`AlpLevelDefaults`), `package.properties`.

---

### 3. [SPIKE-23] Phase 1 Scope — Stock vs. Branded — Pending

- **Description:** Document what remains stock Sweet Home 3D vs lightly ALP-branded/reorganized for Phase 1 MVP.
- **Deliverable:** Checklist covering menus, libraries, defaults, naming, splash/about, help, deferred features.
- **Steps:**
  1. Audit current ALP delta vs stock SH3D 7.5.
  2. Mark each surface: **keep stock**, **ALP customized**, **hidden**, **Phase 2**.
  3. Align with branding assets and install bundle naming (`Sweet Home 3D Dev.app` → future ALP CAD.app).
- **Touchpoints:** Documentation; optional minor branding code.

**Block H exit criteria met → Phase 1 MVP packaging ready for demo/release candidate.**

---

## Backlog / Ideas

*Items below are **not** part of the Phase 1 block sequence (A–H). They are candidate spikes to pick up after current milestones, or when a workflow gap outweighs the next scheduled spike. IDs start at **SPIKE-26** to avoid renumbering the master index.*

| Spike | Status | Summary |
|-------|--------|---------|
| SPIKE-24 | **COMPLETED** | **Docked layer inspector** — empty selection → slim layer panel; row click switches tab; Open full editor… |
| SPIKE-25 | COMPLETED | **Layer selection filtering** — current layer only (default new homes); lock blocks pick; Shift+marquee cross-layer |
| SPIKE-29 | **Phase 2 shipped** | **Right column context deck** — Inspector + selector (Layers, Selection, Layer items, Plants) — [spike doc](sweethome3d-spike-29-right-column-context-deck.md) |
| SPIKE-30 | **COMPLETED** | **Layer role metadata** — Category + Plant takeoff on levels; flag-based Proposed/Existing plant schedule; Context deck label — [spike doc](sweethome3d-spike-30-layer-role-metadata.md) |
| SPIKE-31 | **Phase 2 in progress** | **Toolbar & layer tab UX** — Phase 1 complete; density + tab scalability — [spike doc](sweethome3d-spike-31-toolbar-and-layer-tab-ux.md) |
| SPIKE-26 | Idea | Ephemeral two-point **Measure** tool (+ optional Alt-drag overlay) |
| SPIKE-27 | Idea | **Plan assembly** grouping — walls + doors/windows + furniture (phased) |
| SPIKE-28 | Idea | **Layered plant plan symbols** — line + watercolor fill + user fill color (Option C) |
| SPIKE-12b | Idea | **Draft mode uses line-art `planIcon`** — **COMPLETED** (planIconLine CONTENT) |

### [SPIKE-26] Measure tool (ephemeral two-point ruler)

- **Problem:** There is no dedicated measuring tape. **Create dimensions** always leaves a persistent `DimensionLine` on the plan. Edge **Rulers** (Preferences) are viewport scale ticks, not point-to-point. Edit tooltips only show distance while dragging geometry.
- **Goal:** Quick “how far is it?” checks on site plans without annotating the drawing.
- **Scope (spike v1):**
  - **Primary — new Plan mode:** Dedicated **Measure** tool with toolbar button placed **next to Create dimensions** (Plan toolbar / menu).
  - **Secondary — modifier overlay:** While in **Select** or **Pan**, hold **Alt** and drag to show the same ephemeral distance readout (power-user shortcut; document in tip text).
  - **Ephemeral only:** No `DimensionLine` (or other model object) added to the home file. Esc clears the current measurement; tool stays active for repeated use.
  - **Two-point only:** First click = start, move = live dashed line + length label, second click = final reading (then ready for next measure).
  - **Snap scope:** **Anywhere on the plan** — free point placement; no requirement to snap to wall/area/furniture edges (magnetism toggle may still apply to grid/cursor alignment if useful, but not edge-only like dimension hover).
  - **Units:** Display in user’s length preference (including ft/in when applicable).
- **Out of scope for spike v1:** Convert-to-dimension, chain/multi-segment measure, area/angle measure, 3D measure.
- **Likely files:**
  - `PlanController.java` — new `Mode.MEASUREMENT` + state(s) (reuse feedback patterns from `DimensionLineCreationState` / `setToolTipFeedback`)
  - `PlanView.java` — ephemeral line + label paint (may reuse `setDimensionLinesFeedback` or parallel feedback API)
  - `HomePane.java` / `HomeController.java` — action, toolbar button, shortcut, mode wiring
  - `package.properties` — menu labels, tooltips, shortcut hints (include Alt-drag note)
- **UX sketch:**
  1. User activates **Measure** (toolbar or shortcut).
  2. Click start point → live preview to cursor → click end point → show final distance.
  3. Esc clears; further clicks start a new measurement.
  4. In Select/Pan: Alt+drag shows the same preview without switching tools.
- **Test plan:** Measure across open plan space, across a background image, and between arbitrary points; confirm nothing persists in saved `.sh3d`; confirm Alt-drag in Select matches dedicated tool readout; verify imperial and metric display.
- **Touchpoints:** View, Controller (no model/XML changes if ephemeral).
- **Effort (estimate):** ~1–2 days for spike v1.
- **Depends on:** None (can ship independently of Block E–H).
- **Promotion:** Pull into a numbered block or post-MVP tranche when prioritized.

### [SPIKE-27] Plan assembly grouping (walls + openings + furniture)

- **Problem:** **Group / Ungroup** exists for furniture only (`HomeFurnitureGroup`). Walls live in `home.getWalls()`; doors and windows are `HomeDoorOrWindow` in `home.getFurniture()` and attach to walls **geometrically** (`isBoundToWall()`), not by a stored wall ID. There is no way to group a building shell (walls + doors + windows + other objects) for one-click re-selection and move-as-unit workflows. Shift-click multi-select and marquee select walls work, but doors/windows often **fail to marquee-select** with walls because wall polygons are thick while opening footprints are thin along the wall axis.
- **Goal:** Select and move a coherent assembly (e.g. a facade or outbuilding) as one unit; ungroup when no longer needed.
- **Feasibility:** **Yes, but non-trivial.** Mixed wall + furniture **move already works** when all members are selected (`PlanController.moveItems()`). The gaps are **easy selection** (especially openings on walls) and **persistent grouping**. Extending `HomeFurnitureGroup` to hold walls is **not viable** — different storage, move rules (wall endpoint graph), and serialization paths.

**What exists today**

| Capability | Behavior | Gap |
|---|---|---|
| Furniture Group / Ungroup | `FurnitureController.groupSelectedFurniture()`; group is a `HomePieceOfFurniture` | Walls not eligible |
| Shift + click | Multi-select walls, furniture, etc. | Manual; no persistence |
| Marquee select | All visible `Selectable` items whose shape intersects rectangle | Doors/windows often missed when boxing wall segments |
| Mixed move | `moveItems()` translates walls + furniture together when multiple items selected | Requires getting all members selected first |
| Door ↔ wall binding | Geometric snap on move; no parent/child ID | Openings don't follow wall unless explicitly in selection |

**Options (smallest → largest scope)**

| Option | Description | Pros | Cons | Est. effort |
|---|---|---|---|---|
| **A — Select openings with walls** | Command or marquee rule: given selected wall(s), add bound `HomeDoorOrWindow` on those walls (reuse wall-binding / overlap logic) | Fast win; fixes marquee pain | No persistent group | ~1–2 days |
| **B — `PlanAssembly` model** *(recommended for real Group/Ungroup)* | New object holding member IDs (wall IDs + furniture IDs); select/move/ungroup via assembly; persist in `.sh3d` XML | Matches Group/Ungroup UX; supports arbitrary mixed content | New model + selection/move/delete/copy/undo/XML | ~1–2 weeks |
| **C — Wall-only group** | Group walls like furniture groups; move walls as a set | Simpler than B | Doors/windows excluded unless A is layered on top | ~3–5 days |
| **D — Temporary selection set** | In-memory named sets; no file persistence | Quick prototype | Lost on close; weak for saved projects | ~1–2 days |

**Recommended phased approach**

1. **Phase 1 (selection spike) — Option A**
   - Menu action: **Include wall openings** (add doors/windows geometrically on selected walls).
   - Marquee enhancement: when rectangle selects wall(s), auto-include bound openings on those walls.
   - Validates geometry before committing to full assembly model.
2. **Phase 2 (grouping feature) — Option B**
   - New `PlanAssembly` (name TBD): reference list of wall + furniture member IDs.
   - **Group** enabled when selection has ≥2 movable members across walls and/or furniture (Plan menu, near furniture Group).
   - **Ungroup** removes assembly record; objects remain in place.
   - Select assembly → all members selected (or click proxy / bounding box → expand to members).
   - Move assembly → existing `moveItems()` on members.
   - Persist new XML element (backward compatible if absent).

**Design decisions to resolve before Phase 2**

1. **Group contents:** Walls + bound openings only, or any mix (areas, labels, loose plants)?
2. **Edit mode:** After grouping, can individual wall endpoints still be resized, or assembly is move-only until ungrouped?
3. **Joined walls:** If a grouped wall shares a corner with a wall outside the group, keep current SH3D joint behavior (neighbor endpoint moves only if neighbor is in selection)?
4. **Copy/paste:** Must duplicate as a unit in v1?
5. **3D view:** Plan-only grouping acceptable for spike, or must 3D treat assembly as one object?

**Out of scope for initial spikes:** Rotating a mixed assembly as a unit; nested assemblies; grouping rooms/polylines/dimension lines (unless explicitly expanded later).

- **Likely files (Phase 1):**
  - `PlanController.java` — marquee selection expansion; `getSelectableItemsIntersectingRectangle` / wall–opening association
  - `HomeController.java` — enable new selection helper action
  - `PlanController.java` / `HomeDoorOrWindow.java` — bound-to-wall geometry queries
  - `package.properties` — action labels and tips
- **Likely files (Phase 2):**
  - New `PlanAssembly.java` (model)
  - `Home.java` — assembly list, selection helpers
  - `HomeXMLHandler.java` / writer — persistence
  - `PlanController.java`, `HomeController.java`, `FurnitureController.java` (or new controller) — group/ungroup, move, delete, copy, undo
  - `HomePane.java` — Group/Ungroup actions (Plan menu / context menu)
- **Test plan (Phase 1):** Marquee around wall with doors/windows → openings included; manual **Include wall openings** on partial selection; move mixed selection → openings stay aligned.
- **Test plan (Phase 2):** Group walls + doors + loose object → single-click re-select → move → ungroup → save/reopen `.sh3d` → copy/paste assembly; wall joints with ungrouped neighbors behave as stock SH3D.
- **Touchpoints:** Model (Phase 2), Controller, View, I/O (Phase 2).
- **Depends on:** None for Phase 1; Phase 2 builds on Phase 1 geometry rules.
- **Promotion:** Pull into post-MVP tranche or new milestone block when prioritized.

### [SPIKE-12b] Draft mode → line-art planIcon — **COMPLETED (Aug 2026)**

- **Engine:** `PlanComponent` — in Draft + **Top view**, paint `planIconLine` CONTENT property when set, else `planIcon`; top-view icon cache keys on resolved content and clears when Draft toggles.
- **Catalog:** `planIconLine#N\:CONTENT=/plan-icons-line/plant-NN.png` — **colon must be escaped** (`\:`) in `.properties` or SH3D stores a string and Draft falls back to color (validated v1.0.2).
- **Presentation:** unchanged — color `planIcon#N`.
- **Test:** Import ALP Plants v1.0.2; re-drag piece; ⌘⇧D Draft (line art) vs Presentation (color).
- **Docs:** [alp-phase-1-library-schema.md](alp-phase-1-library-schema.md), [Building ALP CAD  Libraries.md](Building%20ALP%20CAD%20%20Libraries.md).

### [SPIKE-28] Layered plant plan symbols — line + watercolor fill + fill color (Option C)

- **Context (Aug 2026):** Source artwork is a single sprite sheet (`assets/various-green-trees-bushes-shrubs-top-view-*.png`, copied to `libraries/ALP-Plants-1.0.0/source/plant-symbol-sheet.png`). Each symbol exists as **paired halves**: black hand-drawn outline (left) + soft green watercolor wash that **bleeds past** the outline (right). We deferred this in favor of **Option A** (one composite `planIcon` for Presentation) because stock SH3D tints the whole icon and Draft skips `planIcon`. **Option C** is the target end state for landscape color coding (deciduous vs evergreen vs seasonal) without losing black linework.
- **Vision:** Each plant has two visual layers on plan:
  - **Line layer:** Black hand-drawn outline (Draft mode and on top in Presentation) — left column of source sheet.
  - **Fill layer:** Soft watercolor-like green wash that **intentionally bleeds past** the black outline (right column) — not a tight “paint bucket” fill inside the linework.
- **User goal:** In **Presentation mode**, show line + wash; let the user **pick fill color** (e.g. deciduous green, evergreen, autumn) while **black lines stay unchanged**. Draft mode shows **line layer only**.
- **Why not today:** `PieceOfFurniturePlanIcon` draws one PNG; `piece.setColor()` **tints the entire icon** from luminance (lines and fill together). Draft mode **skips** `planIcon` entirely (see SPIKE-12b). No separate fill vs stroke assets in SH3D catalog schema.
- **Proposed rendering (Presentation):**
  1. Scale to piece width × depth (same as today).
  2. Draw **fill layer** PNG with user **fill color** multiplied into alpha — **no clip** to outline (bleed allowed).
  3. Draw **line layer** PNG on top (always black / full opacity).
  4. Draft: step 3 only (line asset from `planIconLine` or `planIcon` if line-only).
- **Proposed data model:**
  - Catalog: `planIcon#N` (line art, required); `planIconFill#N` (wash layer, optional — if absent, Presentation = line only).
  - Placed piece: new property **`fillColor`** (Integer RGB) for wash tint; document **`color`** vs **`fillColor`** to avoid clash with stock luminance tint.
  - Persist in home XML alongside existing furniture attributes.
- **Alternatives considered (Aug 2026 decision):**
  - *Option A (SPIKE-10 — shipped):* One composite PNG per plant as `planIcon` — Presentation OK, Draft wrong until SPIKE-12b.
  - *Option B:* Two PNGs, engine change = SPIKE-12b only — Presentation uses composite, Draft uses line PNG; no user fill color.
  - *Option C (this spike):* Two layers + independent fill color — matches artwork and landscape color coding; **pick up after SPIKE-12b**.
- **Likely files:** `PlanComponent.java` (`PieceOfFurniturePlanIcon`, `paintPieceOfFurnitureTop`); `HomePieceOfFurniture` / `CatalogPieceOfFurniture`; `HomeXMLHandler` / exporter; `FurniturePanel` or modifier UI for fill color; `DefaultFurnitureCatalog.PropertyKey` extension for `planIconFill`; `.sh3f` authoring docs.
- **Test plan:** Place plant → set fill color → lines stay black, wash changes hue; bleed visible outside outline; Draft hides wash; save/reopen; export/print in Draft monochrome.
- **Effort:** ~3–5 days engine + UI; content pipeline adds paired PNGs per symbol (split script already produces both halves).
- **Depends on:** SPIKE-10 asset pipeline; **SPIKE-12b required** for correct Draft behavior.
- **Promotion:** Block F extension or post-M2 tranche; update [alp-phase-1-library-schema.md](alp-phase-1-library-schema.md) when promoted.

---

## Build & Tooling Requirements

- **Ant task:** `ant -f build.xml buildModernDesktop jarExecutableModernDesktop`
- **Modern compatibility:** Maintain the `PlanComponent.java` shim (no `JApplet` dependency) for current JDK builds.
- **Plant library build:** `./scripts/build-alp-plants-library.sh` — splits symbol sheet, writes **ASCII / ISO-8859-1** `PluginFurnitureCatalog.properties` (required for SH3D catalog load).
- **Dev app refresh (macOS):** `./scripts/update-dev-app.sh` — builds the modern JAR, copies it into `install/Sweet Home 3D Dev.app`, clears quarantine, ad-hoc re-signs the bundle, and updates **Date Modified** (required after each JAR swap or macOS may report the app as damaged).
- **Manual fallback:** Copy `install/SweetHome3D-7.5-modern.jar` to `install/Sweet Home 3D Dev.app/Contents/app/SweetHome3D.jar`, then run `xattr -cr` and `codesign --force --deep --sign -` on the `.app`.
- **Submodule:** Commit code changes in `source/SweetHome3D-7.5-src` first, then update parent repo pointer.

---

## Execution Order Summary

```
M0 (complete) → A → B → C → D → E → F → G → H
                     ↑ done    ↑ next
```

| Block | Spikes | Theme |
|-------|--------|-------|
| A | 13, 16A, 16B | Inventory & locking |
| B | 05, 06 | Area visuals |
| C | 17, 18 | Text & draft output |
| **D** | **07, 08** | **Area UX & calibration** |
| E | 09, 10, 10b, 11 | Libraries |
| F | 12, 14, 16 | Symbols & project setup |
| G | 15, 20, 19 | Layer polish & deliverables |
| H | 21, 22, 23 | MVP packaging |
