# SPIKE-29 — Right Column Context Deck (Dual Pane + Selector)

**Date:** August 20, 2026  
**Status:** Spec locked — pending implementation  
**Branch:** `cursor/areas-inventory-and-level-locking` (or follow-on UI branch)  
**Parent:** ALP docked inspector workflow (SPIKE-19, SPIKE-21, SPIKE-24); complements left-column **Library / Inventory** labels  
**Related:** `HomePane.java`, `SelectionInspectorPane.java`, `AlpCatalogStyles.java`, `ManageLevelsPanel.java`, `FurnitureTable.java`, `RoomTable.java`

---

## Goal

Extend the **right work column** beyond a single inspector: add a **resizable bottom “context deck”** with a **selector** so users can switch among several **situation-aware panels** without modals or duplicating the left **Inventory**.

Teach a stable vocabulary:

| Zone | Name |
|------|------|
| Left top | **Library** (catalog) |
| Left bottom | **Inventory** (Furniture \| Areas tabs) |
| Right top | **Inspector** (existing `SelectionInspectorPane`) |
| Right bottom | **Context deck** (new; one active panel at a time) |

---

## Problem

Today the right column is a **single** `SelectionInspectorPane` beside the plan (`HomePane.createPlanInspectorPane()`). That works for object properties and SPIKE-24 layer settings, but:

- **Multi-select** has no list/summary strip — only shared inspector fields or mixed-selection message.
- **Active-layer content** is only visible in the **global** left Inventory (all layers), not filtered to the current tab.
- **Layer stack** overview (click row → switch tab) lives in Manage layers modal or the empty-selection layer list inside the inspector — not a persistent compact strip.
- **Plant takeoff / schedule** has no live dock; left Inventory lists rows but not aggregated counts.

There is **no technical blocker** to a vertical split on the right — the left column already uses the same `JSplitPane` + `configureSplitPane()` + saved divider pattern (`catalogFurniturePane`).

---

## Locked decisions (Aug 20, 2026)

| Topic | Decision |
|-------|----------|
| **Layout** | Vertical split inside right column: **Inspector (~65%)** top, **Context deck (~35%)** bottom |
| **Selector** | **Segmented control** (4 pills) above the bottom panel — not nested tabs inside tabs |
| **Panels (v1 set)** | **Layers**, **Selection**, **Layer items**, **Plants** — all four exist; **one visible** at a time |
| **Auto-switch** | **Hybrid:** smart defaults on context change + **remember last manual choice** until context strongly overrides |
| **Pin (optional v1)** | Defer explicit “pin panel” — manual selection persists via `lastContextDeckPanel` home visual property |
| **Left Inventory** | **Unchanged** — global home inventory; context deck is **“what matters now”** |
| **SPIKE-24 overlap** | Inspector keeps **layer properties** when selection empty; **Layers** deck = compact **list + stack order** (click → switch tab), not duplicate property editors |
| **Wide screens** | Phase 1: single bottom panel only; Phase 2 optional dual bottom split if width &gt; threshold (~400 px) |
| **Collapse** | Bottom deck **collapsible** via split divider (one-touch expandable), same as other splits |

---

## Context deck panels (v1)

### 1. Layers (compact layer list)

| Aspect | Detail |
|--------|--------|
| **Purpose** | Always-visible stack overview; faster than Manage layers modal for tab switching |
| **Content** | Rows: name, hidden/locked badges; top row = top of draw stack (match Manage layers table order) |
| **Interaction** | Row click → `planController.setSelectedLevel()`; optional ▲/▼ reorder (reuse `LevelController.moveLevelElevationIndex`) — **optional Phase 1b** |
| **Complements** | SPIKE-24 layer inspector (properties for **active** layer only) |

### 2. Selection (multi-select summary)

| Aspect | Detail |
|--------|--------|
| **Purpose** | When 2+ plan objects selected, list types/counts and allow row click → subset focus |
| **Content** | List or table: type icon, name/label, layer |
| **Auto-show** | When `home.getSelectedItems().size() >= 2` |
| **Interaction** | Click row → select only that item (or toggle with modifier — **defer v1**) |

### 3. Layer items (active-layer inventory)

| Aspect | Detail |
|--------|--------|
| **Purpose** | “What’s on the **current tab**” — not the whole home |
| **Content** | Reuse `FurnitureTable` / `RoomTable` with **level filter** = `home.getSelectedLevel()`; sub-tabs **Furniture \| Areas** optional or single combined list |
| **Differentiator** | Left Inventory = global; this = **active layer only** |

### 4. Plants (schedule / takeoff strip)

| Aspect | Detail |
|--------|--------|
| **Purpose** | Live aggregated plant counts for landscape workflow |
| **Content** | Table: species/name, size symbol, count, optional notes; updates on furniture add/remove/move on Plants layer |
| **Auto-show** | Suggest when **Plants** layer selected and plant furniture exists — user can override via selector |
| **Data source** | `home.getFurniture()` filtered by level + plant category / catalog metadata |

---

## Auto-switch rules (hybrid)

| Event | Default bottom panel |
|-------|----------------------|
| Plan selection **empty** | **Layers** (unless user recently picked another and context unchanged) |
| **2+** items selected | **Selection** |
| Active layer is **Plants** and plant count &gt; 0 | **Plants** (first time only per session/layer — then respect manual choice) |
| User clicks selector pill | **Selected panel** until next strong context event |
| Strong override | Multi-select → Selection; empty selection → Layers |

Persist in home visual properties:

- `ContextDeckDividerLocation` (float, like other splits)
- `LastContextDeckPanel` (enum string: `LAYERS`, `SELECTION`, `LAYER_ITEMS`, `PLANTS`)

---

## UX summary

```
┌─ Inspector (top) ─────────────────────┐
│  Object / layer properties (existing) │
├───────────────────────────────────────┤
│ [Layers] [Selection] [Layer items] [Plants]  ← selector
├─ Context deck (bottom) ───────────────┤
│  (one panel visible)                  │
└───────────────────────────────────────┘
```

| User action | Result |
|-------------|--------|
| Drag horizontal divider (plan \| right) | Plan vs right column width (existing) |
| Drag vertical divider inside right column | Inspector vs context deck height |
| Click **Layers** pill | Show compact layer list |
| Click **Selection** pill | Show multi-select list (enabled when 2+ selected; disabled/grey when 0–1) |
| Click **Layer items** pill | Show active-layer filtered inventory |
| Click **Plants** pill | Show plant schedule table |
| Empty plan + default | Layers deck visible |

---

## Scope

### In scope

#### Phase 1 — Shell + two panels (~2–3 days)

- Vertical `JSplitPane` wrapping `SelectionInspectorPane` + new **ContextDeckPane** in `createPlanInspectorPane()`
- **Selector** (segmented buttons) + `CardLayout` for panel switching
- **Layers** panel — read-only list + row click → switch tab (reuse `ManageLevelsPanel` / layer list patterns from SPIKE-24)
- **Selection** panel — list of `home.getSelectedItems()` with type/name
- Auto-switch rules (empty → Layers, 2+ → Selection)
- Persist divider + last panel in home visual properties
- Strings in `package.properties`; styling via `AlpInspectorStyles` / `AlpCatalogStyles`

#### Phase 2 — Inventory + plants (~2–3 days)

- **Layer items** panel — filtered `FurnitureTable` / `RoomTable` (or lightweight table)
- **Plants** panel — aggregated schedule table + live update listeners
- Refine auto-switch for Plants layer

### Out of scope (v1)

- Dual bottom panels on ultra-wide screens (Phase 2 optional)
- Explicit **pin panel** checkbox (manual choice persistence is enough for v1)
- Moving Library to the right column
- Replacing Manage layers modal
- Plant schedule **export** (CSV) — can reuse existing export patterns later
- Measure readout / project notes panels (future deck slots)

---

## Technical approach

### 1. Right column split

In `HomePane.createPlanInspectorPane()`:

```java
JComponent inspectorPane = createInspectorPane(...);
JComponent contextDeckPane = new ContextDeckPane(home, preferences, controller);
JSplitPane inspectorContextPane = new JSplitPane(VERTICAL_SPLIT, inspectorPane, contextDeckPane);
configureSplitPane(inspectorContextPane, home, CONTEXT_DECK_DIVIDER_LOCATION_PROPERTY, 0.65, ...);
// planInspectorPane horizontal split unchanged: plan | inspectorContextPane
```

### 2. ContextDeckPane

New class (or inner panel in `HomePane` initially):

- Segmented selector row
- `CardLayout` content area
- Sub-panels: `LayersDeckPanel`, `SelectionDeckPanel`, `LayerItemsDeckPanel`, `PlantScheduleDeckPanel`
- Listens: `Home` selection, `SELECTED_LEVEL`, furniture/room collection changes

### 3. Layers deck

- Reuse list cell rendering from `LevelInspectorPanel` / `ManageLevelsPanel`
- Row click → `homeController.getPlanController().setSelectedLevel(level)`

### 4. Selection deck

- `JList<Selectable>` or small table; sync from `SelectionListener`
- Display name via existing label/furniture/room formatters

### 5. Layer items deck

- Wrapper around filtered views of existing tables, or new `FilteredFurnitureTableModel`
- Filter: `piece.getLevel() == home.getSelectedLevel()` (strict layer, align with SPIKE-25)

### 6. Plants deck

- Build aggregation map: catalog name / size → count
- Listen to `home.getFurniture()` changes

**Likely touchpoints:**

| Layer | Files |
|-------|--------|
| Layout | `HomePane.java` |
| New UI | `ContextDeckPane.java` (+ deck sub-panels) |
| Reuse | `SelectionInspectorPane.java`, `ManageLevelsPanel.java`, `FurnitureTable.java`, `RoomTable.java` |
| Styles | `AlpInspectorStyles.java`, `AlpCatalogStyles.java` |
| Strings | `package.properties` |

**Effort estimate:** ~4–6 days total (Phase 1 + 2).

---

## Relationship to other spikes

| Spike | Relationship |
|-------|----------------|
| SPIKE-19 / 21 | Inspector (top) unchanged in role |
| SPIKE-24 | Layer **properties** stay in inspector; Layers **deck** = navigation list |
| SPIKE-25 | Layer items deck uses strict active-layer filter |
| SPIKE-22 | Left Library/Inventory labels establish naming; right deck completes symmetry |
| SPIKE-26 | Measure readout could become a 5th deck panel later |
| SPIKE-28 | Plant symbols feed Plants deck schedule rows |

---

## Success criteria

- Right column shows **Inspector** + **Context deck** with draggable divider; location persists per home.
- Selector switches among four panels; last manual choice remembered.
- **Layers** deck: click row switches plan tab.
- **Selection** deck: appears automatically when 2+ objects selected; lists all selected items.
- **Layer items** deck: shows only current-layer furniture/areas.
- **Plants** deck: shows aggregated counts for Plants layer.
- No regression to inspector live-edit, SPIKE-24 layer inspector, or left Inventory behavior.

---

## QA checklist (manual)

- [ ] New site plan: right column split visible; default bottom panel = **Layers**.
- [ ] Drag vertical divider; reopen home → divider restored.
- [ ] Click each selector pill → correct panel shows.
- [ ] Empty selection → auto **Layers** (or last manual if not overridden).
- [ ] Marquee 3 objects → auto **Selection** deck; list matches plan selection.
- [ ] Switch to **Proposed** tab → **Layer items** shows only Proposed objects.
- [ ] Place plants on **Plants** layer → **Plants** deck counts update.
- [ ] Left **Library** / **Inventory** labels still correct; catalog tree/list toggle still works.
- [ ] Narrow window: plan keeps minimum width; bottom deck collapsible via split.

---

## Sequencing

- **After:** SPIKE-22 (catalog L&F), SPIKE-24 (layer inspector), SPIKE-25 (layer pick rules)
- **Parallel OK with:** SPIKE-23, SPIKE-26, SPIKE-28
- **Prerequisite polish:** Library / Inventory section labels on left column (small change, same branch or prior commit)

---

## Next steps

1. Implement Library / Inventory titled sections on left column (**done** or same PR).
2. Add `ContextDeckPane` shell + vertical split in `createPlanInspectorPane()`.
3. Ship Phase 1: **Layers** + **Selection** decks + selector + auto-switch.
4. Ship Phase 2: **Layer items** + **Plants** decks.
5. Rebuild dev app; run QA checklist.
