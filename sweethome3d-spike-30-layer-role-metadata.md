# SPIKE-30 — Layer Role Metadata (Category + Plant Takeoff)

**Date:** August 20, 2026  
**Status:** Phase 2 implemented — flag-based plant schedule, collapsible existing section, Context label  
**Branch:** follow-on from `cursor/areas-inventory-and-level-locking` (or dedicated UI branch)  
**Parent:** ALP site-plan layer model (SPIKE-14, SPIKE-16, SPIKE-24); plant schedule (SPIKE-29 Phase 2)  
**Related:** `Level.java`, `AlpLevelDefaults.java`, `AlpPlantUtils.java`, `SelectionInspectorPane.java`, `PlantScheduleDeckPanel.java`, `ContextDeckPane.java`, `ManageLevelsPanel.java`, `HomeXMLExporter.java`, `HomeXMLHandler.java`

---

## Goal

Add **persistent layer role metadata** so ALP CAD knows **what each level is for** and **how plant symbols on that level participate in takeoff** — without changing the **`+` new-layer** workflow.

Users can create many planting layers (existing vs proposed, trees vs shrubs, etc.) while the **Plants** context deck produces a correct **proposed bid schedule** plus an optional **existing planting** reference section.

---

## Problem

Today (SPIKE-29b):

- Plant schedule counts only furniture on the layer whose **name** matches localized **“Plants”** (`AlpLevelDefaults.findPlantsLevel()`).
- **Existing** vs **proposed** planting cannot be distinguished in takeoff.
- **Multiple planting layers** are unsupported — a common landscape CAD need (NCS-style LP-TREE, LP-SHRUB, existing vs proposed variants).
- Layer inspector exposes **name, viewable, locked, select-current-layer-only** but not **purpose**.

The **`+` button** should stay simple; role is set in **layer properties** when the user cares.

---

## Locked decisions (Aug 20, 2026)

| Topic | Decision |
|-------|----------|
| **New layer (`+`)** | Unchanged — creates a level with safe defaults only |
| **Category** | **5 values:** General, Reference, Site, Planting, Annotation |
| **Takeoff** | **3 values:** Exclude, Proposed, Existing — **only when Category = Planting** |
| **Takeoff UI** | **Hidden/disabled** unless Category = Planting |
| **Category change** | Leaving Planting → **reset Takeoff to Exclude** (stored + ignored until Planting again) |
| **Starter template** | **Keep 5 tabs**; assign metadata only (no split into Trees/Shrubs yet) |
| **Plants deck — proposed** | Aggregate all layers: Category = Planting **and** Takeoff = Proposed |
| **Plants deck — existing** | **Collapsible section** below main table; layers with Takeoff = Existing |
| **Plant identification** | Unchanged: `alp-plt-*` catalog ID prefix (`AlpPlantUtils.isPlant()`) |
| **Printable flag** | **Defer** — **Viewable** + Print Page Setup suffice for now |
| **Name-based “Plants” layer** | **Replace** for takeoff; keep **migration fallback** for older homes |

---

## Category (layer purpose)

| Value | Intended content | Notes |
|-------|------------------|-------|
| **General** | Default for `+` new layers | Unclassified |
| **Reference** | Survey, PDF underlay, base imagery | Starter: Reference (locked) |
| **Site** | Hardscape, structures, utilities, grading — existing or proposed | Starter: Existing, Proposed |
| **Planting** | Plant symbols (trees, shrubs, groundcover, mass planting) | Enables Takeoff control |
| **Annotation** | Labels, dimensions, notes, sheet markup | Starter: Annotations |

Tree vs shrub vs groundcover **splitting** uses **layer names** (or future catalog grouping) — not separate Category values.

---

## Takeoff (plant schedule participation)

Only meaningful when **Category = Planting**. Stored as enum on `Level`; when Category ≠ Planting, value is **Exclude** and UI is hidden.

| Value | In proposed bid total? | Plants deck |
|-------|------------------------|-------------|
| **Exclude** | No | Hidden (default when not Planting) |
| **Proposed** | **Yes** — summed in main schedule | Main table |
| **Existing** | No | Collapsible **Existing planting** section |

**Rules:**

- Count **`AlpPlantUtils.isPlant(piece)`** where `piece.getLevel()` has Takeoff = Proposed (main) or Existing (secondary section).
- Plants on **Site** / **General** layers are **not counted** until user sets Category = Planting (or moves plants to a Planting layer).

---

## Starter site-plan defaults

| Layer (tab) | Category | Takeoff |
|-------------|----------|---------|
| Reference | Reference | *(hidden — Exclude)* |
| Existing | Site | *(hidden — Exclude)* |
| Proposed | Site | *(hidden — Exclude)* |
| Plants | Planting | Proposed |
| Annotations | Annotation | *(hidden — Exclude)* |

**New layer via `+`:** Category = **General**, Takeoff = **Exclude**.

---

## UX

### Layer inspector (SPIKE-24, empty plan selection)

Add to `LevelInspectorPanel` below existing fields:

```
Category:     [ Planting        ▼ ]
Plant schedule: [ Proposed      ▼ ]   ← visible only when Category = Planting
```

**Category change behavior:**

| From → To | Takeoff |
|-----------|---------|
| Any → **Planting** | Default **Proposed** (user may switch to Existing) |
| **Planting** → any other | Reset to **Exclude**; hide Takeoff control |

Optional: when Category → **Reference**, suggest locked (non-blocking hint or auto-check locked — **defer v1**, document only).

### Manage levels modal

Show **Category** column (compact label or icon). Takeoff column **optional v1** — inspector is source of truth; modal read-only badge OK for Phase 1.

### Plants context deck (SPIKE-29)

```
┌─ Proposed planting ─────────────────┐
│ Name          Reference        Count │
│ Live Oak      alp-plt-oak…       12 │
│ Boxwood       alp-plt-box…        8 │
└─────────────────────────────────────┘
▶ Existing planting (3)               ← collapsed by default
```

Expanded:

```
▼ Existing planting (3)
┌─────────────────────────────────────┐
│ Mature Oak (retain)              3  │
│ Existing hedge                  12  │
└─────────────────────────────────────┘
```

- **Main table:** aggregate across all **Proposed** planting layers (group by catalog ID / name — same as today).
- **Collapsible block:** aggregate across all **Existing** planting layers.
- **Plants pill enabled** when main table **or** existing section has rows.
- **Auto-switch** (update from name-based): suggest Plants panel when active layer has Category = Planting, Takeoff = Proposed, and plant count &gt; 0 (first visit per layer per session — same pattern as SPIKE-29).

---

## Data model

### New enums (model package)

```java
// LevelCategory.java
public enum LevelCategory {
  GENERAL, REFERENCE, SITE, PLANTING, ANNOTATION
}

// LevelPlantTakeoff.java
public enum LevelPlantTakeoff {
  EXCLUDE, PROPOSED, EXISTING
}
```

### Level fields

Add to `Level.java`:

- `LevelCategory category` — default `GENERAL`
- `LevelPlantTakeoff plantTakeoff` — default `EXCLUDE`
- Extend `Level.Property` enum: `CATEGORY`, `PLANT_TAKEOFF`
- `setCategory(LevelCategory c)` — when `c != PLANTING`, set `plantTakeoff = EXCLUDE`
- `setPlantTakeoff(...)` — no-op or assert unless `category == PLANTING`

### Persistence (home XML)

Add optional attributes on `<level>` (preferred, alongside `viewable` / `visible`):

```xml
<level name="Plants" … category="PLANTING" plantTakeoff="PROPOSED" />
```

- Omit attributes on load → migration (below).
- Export always writes attributes for ALP homes (or when non-default).

### Migration (open existing homes)

On read, if attributes absent:

| Condition | Category | Takeoff |
|-----------|----------|---------|
| Name matches localized **Plants** (`AlpLevelDefaults.isPlantsLevel`) | Planting | Proposed |
| Name matches localized **Reference** | Reference | Exclude |
| Name matches localized **Annotations** | Annotation | Exclude |
| Name matches localized **Existing** | Site | Exclude |
| Name matches localized **Proposed** | Site | Exclude |
| Else | General | Exclude |

One-time migration acceptable at load; no separate migration file.

---

## Scope

### In scope

#### Phase 1 — Model + inspector (~1–2 days) ✅ shipped

- `LevelCategory`, `LevelPlantTakeoff` enums
- Fields + property change events on `Level`
- XML export/import + migration fallback
- `LevelController` / `LevelPanel` / `SelectionInspectorPane` Category + Takeoff UI
- `AlpLevelDefaults.addStarterSitePlanLevels()` assigns starter metadata
- `LevelController` defaults for `+` new level: General / Exclude
- Strings in `package.properties`

#### Phase 2 — Plants deck + cleanup (~1–2 days) ✅ shipped

- Replace `AlpLevelDefaults.findPlantsLevel()` takeoff path with **flag-based** aggregation in `AlpPlantUtils`
- `PlantScheduleDeckPanel`: proposed table + collapsible existing section
- `ContextDeckPane`: enable/auto-switch Plants pill from new rules
- Remove or deprecate name-only schedule logic (keep `isPlantsLevel` for migration only)
- Layers deck: optional category badge in list cell renderer

### Out of scope (SPIKE-30)

- **Printable** flag (Viewable + Page Setup is enough for now)
- Expanding starter template to 8–12 NCS-style layers
- **Project-wide** takeoff filter UI (all proposed layers are always aggregated)
- Takeoff by **catalog category** (tree vs shrub grouping column)
- **SPIKE-28** symbol fill / line layers
- CSV export of schedule

---

## Technical approach

### 1. Model

| File | Change |
|------|--------|
| `LevelCategory.java` | New enum |
| `LevelPlantTakeoff.java` | New enum |
| `Level.java` | Fields, getters/setters, `Property` enum, clone |
| `AlpLevelDefaults.java` | Set category/takeoff in starter template; migration helper `migrateLevelRole(Level, UserPreferences)` |

### 2. Persistence

| File | Change |
|------|--------|
| `HomeXMLExporter.writeLevel()` | Write `category`, `plantTakeoff` attributes |
| `HomeXMLHandler` (level parser) | Read attributes; call migration when missing |

### 3. Inspector UI

| File | Change |
|------|--------|
| `SelectionInspectorPane.LevelInspectorPanel` | Category combo; conditional Takeoff combo; live edit via `LevelController` |
| `LevelController.java` | `category`, `plantTakeoff` properties |
| `LevelPanel.java` | Same controls in full editor (parity with docked inspector) |

### 4. Plant schedule

| File | Change |
|------|--------|
| `AlpPlantUtils.java` | `buildProposedSchedule(Home)`, `buildExistingSchedule(Home)` — filter by level takeoff |
| `PlantScheduleDeckPanel.java` | Two-section UI; collapsible existing |
| `ContextDeckPane.java` | Update `hasPlantsOnPlantsLayer()`, auto-switch, pill enable |

### 5. Strings

| Key area | Examples |
|----------|----------|
| Category labels | `LevelCategory.general`, `.reference`, `.site`, `.planting`, `.annotation` |
| Takeoff labels | `LevelPlantTakeoff.exclude`, `.proposed`, `.existing` |
| Inspector | `SelectionInspectorPane.categoryLabel`, `plantTakeoffLabel` |
| Plants deck | `PlantScheduleDeckPanel.proposedSection.title`, `existingSection.title` |

**Likely touchpoints:** ~8–12 files, ~400–600 lines.

**Effort estimate:** ~3–4 days total (Phase 1 + 2).

---

## Relationship to other spikes

| Spike | Relationship |
|-------|----------------|
| SPIKE-24 | Layer inspector gains Category + Takeoff |
| SPIKE-29 | Plants deck reads takeoff flags instead of layer name |
| SPIKE-25 | Unchanged — pick rules still use active level |
| SPIKE-28 | Future: schedule grouping by plant symbol category |
| SPIKE-26 | Unchanged |
| NCS LP-* layering | User models via **many Planting layers** + naming; not enforced |

---

## Success criteria

- Each level persists **Category**; **Takeoff** persists when Category = Planting.
- **`+` new layer** → General / Exclude; no modal.
- Changing Category away from Planting **resets Takeoff to Exclude**.
- Takeoff control **hidden** unless Category = Planting.
- New site plan starter layers get correct metadata (Plants = Planting / Proposed).
- **Plants deck** main table = all Proposed planting layers combined.
- **Existing planting** collapsible section = all Existing planting layers combined.
- Old homes: layer named **Plants** migrates to Planting / Proposed.
- No regression to viewable, locked, SPIKE-25 selection, or Layer items deck.

---

## QA checklist (manual)

- [ ] New site plan: inspect each tab — Category/Takeoff match starter table.
- [ ] `+` new layer → General; Takeoff control hidden.
- [ ] Set Category = Planting → Takeoff appears, defaults Proposed.
- [ ] Set Category = Site → Takeoff hidden; previous Takeoff reset to Exclude.
- [ ] Save, reopen home → category/takeoff restored.
- [ ] Open pre-SPIKE-30 home with **Plants** layer → migrates to Planting/Proposed.
- [ ] Set Takeoff = Existing; place plants → appear in collapsible section only. *(Phase 2)*
- [ ] Two layers: Proposed – Trees + Proposed – Shrubs (both Planting/Proposed) → main schedule sums both. *(Phase 2)*
- [ ] Existing – Trees (Planting/Existing) → existing section only. *(Phase 2)*
- [ ] Plants pill enables when proposed **or** existing plants exist. *(Phase 2)*
- [ ] Layer items deck unchanged (still active-layer filter).

---

## Sequencing

- **After:** SPIKE-29 Phase 2 (Plants deck shell — **done**)
- **Before:** starter template layer splits, schedule CSV export, SPIKE-28 symbol layers
- **Parallel OK with:** SPIKE-23, SPIKE-26

---

## Next steps

1. ~~Implement Phase 1: model, XML, inspector, starter defaults.~~ **Done**
2. Implement Phase 2: schedule aggregation + collapsible existing UI.
3. Rebuild dev app; run QA checklist.
4. Update SPIKE-29 doc cross-reference (Plants deck data source).
