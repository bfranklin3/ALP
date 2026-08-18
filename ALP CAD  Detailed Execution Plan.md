# ALP CAD — Detailed Execution Plan

**Last updated:** August 18, 2026  
**Strategy reference:** [sweethome3d-phase-1-implementation-roadmap.md](sweethome3d-phase-1-implementation-roadmap.md)  
**Source submodule:** `source/SweetHome3D-7.5-src` (ALP-Core)

---

## Progress Summary

| Metric | Status |
|--------|--------|
| **Blocks complete** | A, B, C, D (4 of 8) |
| **Spikes complete** | 13 of 25 tracked items |
| **Next block** | **Block E** — Library Foundation (M2) — **IN PROGRESS** |
| **Branch** | `cursor/areas-inventory-and-level-locking` |

**Completed spikes:** SPIKE-01, 02, 03, 04, 05, 06, 07, 08, 09, **10**, 13, 16A, 16B, 17, 18  
**In progress:** Block F — SPIKE-14 flat level defaults  
**Next up:** SPIKE-16 starter level template (after SPIKE-14 validation)

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
| SPIKE-15 | G | M3 | Pending | Level reordering (spike → implement or defer) |
| SPIKE-16 | F | M3 | Pending | Starter level template (Reference / Existing / Proposed / Plants / Annotations) |
| SPIKE-16A | A | M3 | **COMPLETED** | Furniture inventory level column |
| SPIKE-16B | A | M3 | **COMPLETED** | Areas (room) inventory panel |
| SPIKE-17 | C | M4 | **COMPLETED** | Width-based wrapped text |
| SPIKE-18 | C | M4 | **COMPLETED** | One-click draft / monochrome mode |
| SPIKE-19 | G | M4 | Pending | Persistent inspector (spike → prototype or defer) |
| SPIKE-20 | G | M4 | Pending | MVP print / export presets |
| SPIKE-21 | H | M5 | Pending | Minimum sidebar / inspector improvements |
| SPIKE-22 | H | M5 | Pending | Focused workflow UI pass |
| SPIKE-23 | H | M5 | Pending | Phase 1 stock vs. branded scope definition |

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
- Optional starter template creates Reference / Existing / Proposed / Plants / Annotations levels.

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

### 3. [SPIKE-16] Starter Level Grouping Template — Pending

- **Description:** Offer a new-project template (or first-run prompt) with levels: Reference, Existing, Proposed, Plants, Annotations.
- **Note:** SPIKE-16A and SPIKE-16B (inventory visibility) are already complete.
- **Likely files:** `HomeController.newHome`, example homes, or a "New from template" action; `Level` creation helpers.
- **Steps:**
  1. Define level names, suggested colors/viewability, and optional lock on Reference.
  2. Implement as named template home or programmatic level creation on new project.
  3. Wire into File menu (extend `NEW_HOME_FROM_EXAMPLE` pattern) or post-create wizard step — pick smallest UX.
  4. Document recommended workflow in execution plan / user-facing note.
- **Test plan:** Create project from template; verify five levels, inventory columns, and lock on Reference if specified.
- **Touchpoints:** Model, Controller, View.

---

## Milestone Block G: Workflow Polish & Deliverables

*Goal: Close remaining layer and output gaps with intentional workflows.*  
*Depends on: Block F complete*  
*Milestones: M3 (completion) + M4 (completion)*  
**Status: PENDING**

### Exit criteria

- Level reorder decision documented (implemented or explicitly deferred).
- Print/export presets reduce manual setup for draft and presentation output.
- Persistent inspector decision documented (small prototype or defer to Block H).

---

### 1. [SPIKE-15] Level Reordering — Pending (investigation first)

- **Description:** Determine whether users can reorder levels in the UI for MVP, and implement only if scope is small.
- **Likely files:** `LevelPanel`, `LevelsTableModel`, `Home` level list ordering, `PlanComponent` level display order.
- **Steps:**
  1. **Spike (≤ half day):** Trace how level order is stored and used in plan/3D/export.
  2. Document risk (elevation vs display order coupling).
  3. **Decision gate:** Implement drag-reorder in `LevelPanel` **or** mark **DEFERRED** with rationale in this doc.
  4. If implementing: persist order, undo support, verify elevation semantics unchanged.
- **Test plan:** Reorder levels (if implemented); confirm plan view and inventory reflect new order.
- **Touchpoints:** Model, View, Controller.

---

### 2. [SPIKE-20] MVP Print / Export Presets — Pending

- **Description:** Define and implement preset print/PDF/SVG export settings for draft vs presentation output.
- **Likely files:** Print / PDF / SVG export dialogs, `Home.print` metadata, page setup, draft mode integration.
- **Steps:**
  1. Document current print and PDF flows; list properties users tweak repeatedly (scale, margins, fill, draft mode).
  2. Define two presets: **Draft** (B&W-friendly, minimal fills) and **Presentation** (color, area fills visible).
  3. Implement as menu actions or remembered last-used preset pair — avoid large dialog redesign.
  4. Validate PDF and print preview from dev app.
- **Test plan:** Export same plan with both presets; compare output to manual baseline.
- **Touchpoints:** View, Controller, export pipeline.

---

### 3. [SPIKE-19] Persistent Inspector Feasibility — Pending (investigation first)

- **Description:** Validate whether a docked side inspector for text/object properties is worth adding in Phase 1.
- **Context:** Overlaps SPIKE-21; run **after** SPIKE-20 so output workflow is stable first.
- **Likely files:** `HomePane` layout, property panels (`LabelPanel`, `FurniturePanel`, `RoomPanel`), [sweethome3d-ui-customization-boundary-map.md](sweethome3d-ui-customization-boundary-map.md).
- **Steps:**
  1. **Spike:** List current property-edit entry points (double-click, modal dialogs, table inline edit).
  2. Estimate effort for a read-only + quick-edit inspector vs full modal replacement.
  3. **Decision gate:** Small prototype (one object type) **or** defer to Block H / Phase 2 with written rationale.
  4. If prototyping: start with `Label` or `Room` selection → single docked panel.
- **Test plan:** Select object; edit property without modal if prototype built; otherwise document recommendation.
- **Touchpoints:** View, Controller (scope TBD after spike).

---

## Milestone Block H: MVP Packaging

*Goal: Package proven behaviors into a simpler, intentionally branded product shell.*  
*Depends on: Block G complete (especially SPIKE-19 decision)*  
*Milestone: M5*  
**Status: PENDING**

### Exit criteria

- Sidebar/inspector changes identified and at least one implemented.
- One focused workflow UI pass shipped (not a full rewrite).
- Written Phase 1 scope: what stays stock SH3D vs ALP-branded.

---

### 1. [SPIKE-21] Minimum Sidebar / Inspector Improvements — Pending

- **Description:** Identify and implement the smallest sidebar changes with the largest clarity gain.
- **Depends on:** SPIKE-19 decision (build on prototype or implement alternative from spike recommendations).
- **Steps:**
  1. Review spike-19 output; prioritize 1–2 improvements (e.g. selection summary, pinned properties, tab order).
  2. Implement highest-value item only.
  3. User test: common tasks (edit area, edit text, change level visibility) with fewer clicks.
- **Touchpoints:** View.

---

### 2. [SPIKE-22] Focused Workflow UI Pass — Pending

- **Description:** One small, workflow-oriented UI improvement batch — not a whole-shell rewrite.
- **Examples:** Plan setup checklist, simplified catalog categories, hide irrelevant stock menus, default panel layout.
- **Steps:**
  1. List top 3 friction points from Blocks A–G testing.
  2. Pick items achievable in a single focused pass (≤ ~1 week effort).
  3. Implement; rebuild dev app; validate against [sweethome3d-spike-day-2-findings.md](sweethome3d-spike-day-2-findings.md) mixed-plan scenario.
- **Touchpoints:** View, Controller.

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
