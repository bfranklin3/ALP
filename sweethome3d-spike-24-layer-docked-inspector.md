# SPIKE-24 — Docked Layer Inspector (Right Panel)

**Date:** August 19, 2026  
**Status:** Spec locked — pending implementation  
**Branch:** `cursor/areas-inventory-and-level-locking`  
**Parent:** Extends [SPIKE-19 GO](sweethome3d-spike-19-inspector-feasibility.md) / [SPIKE-21](ALP%20CAD%20%20Detailed%20Execution%20Plan.md) right-column inspector  
**Related:** `SelectionInspectorPane.java`, `LevelPanel.java`, `LevelController.java`, `MultipleLevelsPlanPanel.java`, `PlanController.java`

---

## Goal

Make **layer settings visible by default** when the user is not editing plan geometry — without opening the **Modify level** modal (today: double-click level tab or Plan → Modify level).

Layers are central to ALP site-plan workflow (Reference / Existing / Proposed / …). The right inspector column is idle whenever plan selection is empty; this spike uses that slot for **layer context**.

---

## Locked decisions (Aug 19, 2026)

| Topic | Decision |
|-------|----------|
| **When to show** | Plan selection **empty** → right panel is **layer context** |
| **Object selected** | Object inspector wins (unchanged SPIKE-21 behavior) |
| **Tab click** | Switches active layer + refreshes inspector only — **no special gesture** |
| **Content** | **Slim layer inspector** — name, visible, locked (live edit + undo) |
| **Layer list** | Compact summary list/table below fields |
| **Row click** | **Switches active layer** (syncs plan tabs) |
| **Tab ↔ row sync** | Active tab highlights matching row; row click selects tab |
| **Advanced fields** | **Open full editor…** → existing `LevelPanel` modal (elevation, floor thickness, height, stack order controls) |
| **Bulk reorder** | Keep **Manage layers** dialog (SPIKE-15b) unchanged |
| **Interaction model** | **Live edit + undo** in dock (same as SPIKE-21 object inspectors); not OK/Cancel |

---

## UX flow

1. User clicks empty plan → right panel shows **Layer: {name}** for `home.getSelectedLevel()`.
2. User edits name / visible / locked → changes apply immediately with undo.
3. User clicks another row in the layer list → plan tab switches; field block updates.
4. User selects geometry on plan → layer inspector hides; type-specific object inspector shows.
5. User clears selection → layer inspector returns for the current tab’s layer.
6. User needs elevation / thickness / height / elevation-index buttons → **Open full editor…**

---

## Target layout (~300px right column)

```
┌─ Layer: Proposed ─────────────┐
│  Name      [Proposed        ] │
│  ☑ Visible   ☐ Locked        │
│  ─────────────────────────── │
│  Layers                       │
│  ● Proposed      👁   🔒      │  ← click row switches active layer
│    Existing      👁   🔒      │
│    Reference     👁   🔒      │
│    Plants        👁   🔒      │
│  ─────────────────────────── │
│  [Open full editor…]          │
└───────────────────────────────┘
```

Use shared **`AlpInspectorStyles`** tokens (section header, padding, summary typography) for consistency with SPIKE-21.

---

## Scope

### In scope (v1)

- New **`LevelInspectorPanel`** card in `SelectionInspectorPane` (or equivalent routing)
- **Routing:** `updateForSelection()` — if `selectedItems.isEmpty()` → level card; else existing object cards
- **Listen** to `Home.Property.SELECTED_LEVEL` — refresh fields and list selection when user clicks plan tabs
- **Live edit** via `LevelController` + `modifyLevels()` + undo (mirror SPIKE-21 slim-wrapper pattern)
- **Compact layer list** — at minimum: name + visible + locked indicators; row click calls `setSelectedLevel`
- **Two-way sync:** tab change ↔ highlighted row
- **Open full editor…** → `PlanController.modifySelectedLevel()` (existing modal)
- **Empty states unchanged** for mixed selection / locked-object messages when applicable

### Out of scope (v1)

- Replacing **Manage layers** dialog
- Inline edit of elevation / floor thickness / height in dock
- Drag-reorder in the docked list (tabs + Manage layers + SPIKE-15c remain the reorder paths)
- Tool-mode inspector (Phase 2)
- Removing **Modify level** from menus (may hide double-click tab → modal once dock is trusted — separate decision)

---

## Background (today)

| Mechanism | Behavior |
|-----------|----------|
| Single-click level tab | `PlanController.setSelectedLevel()` — switches drawing layer |
| Double-click level tab | Opens **Modify level** modal (`LevelPanel`) |
| Empty plan selection | Right panel: *“Select an object…”* |
| `LevelPanel` | Full modal: viewable, locked, name, elevation, thickness, height, read-only summary table, elevation-index buttons; OK/Cancel |
| Summary table in modal | Highlights current level row; rows **not** clickable to switch layer today |

---

## Technical approach

1. Add **`LEVEL_CARD`** to `SelectionInspectorPane` `CardLayout`.
2. Implement **`LevelInspectorPanel`** with:
   - Summary header (`Layer: {name}`)
   - `nameTextField`, `viewableCheckBox`, `lockedCheckBox`
   - Scrollable compact layer list (table or styled list)
   - `openFullEditorButton`
3. Extend **`updateInspectorPanelsEnabled()`** for the level card (same hidden-card tab-order pattern as SPIKE-21 P4).
4. On field change: debounce or commit-on-focus-loss consistent with area name field; call `LevelController.modifyLevels()`.
5. List row click: `homeController.getPlanController().setSelectedLevel(level)` (verify exact API).
6. Optional follow-up: remove double-click tab → modal once QA passes (redirect to dock + Open full editor).

**Likely touchpoints:**

| Layer | Files |
|-------|--------|
| View | `SelectionInspectorPane.java`, `package.properties` (strings) |
| Controller | `LevelController.java`, `PlanController.java` |
| Model | `Home`, `Level` (existing properties) |

**Effort estimate:** ~1–2 days (slim v1).

---

## Success criteria

- With **no plan selection**, right panel shows layer inspector for the active tab’s layer.
- Editing name / visible / locked works **without modal**; **undo/redo** each change.
- Clicking a **layer row** switches the plan tab and updates fields.
- Clicking a **plan tab** updates the highlighted row and fields.
- Selecting an object switches to object inspector; clearing selection returns to layer inspector.
- **Open full editor…** opens stock `LevelPanel` with full elevation/advanced fields.
- Tab order stays within the active card only (SPIKE-21 P4 pattern).

---

## QA checklist (manual)

- [ ] Empty selection → layer inspector visible; object selection → object inspector.
- [ ] Tab switch with empty selection → header, fields, and list row update.
- [ ] List row click → tab switches; draw context follows.
- [ ] Name / visible / locked live edit + undo.
- [ ] Locked layer: fields disabled or read-only with clear messaging (align with object inspector locked behavior).
- [ ] Open full editor… → modal; changes persist; dock refreshes on close.
- [ ] Manage layers + tab drag-reorder (15c) still work; dock list stays in sync.
- [ ] Narrow inspector (~300px): list scrolls; no clipped controls.

---

## Sequencing

- **After:** SPIKE-21 (docked object inspector baseline)
- **Suggested slot:** After SPIKE-23 scope doc, or in parallel if layer visibility is higher priority than branding audit
- **Independent of:** SPIKE-22 catalog L&F, library content spikes

---

## Next steps

1. Implement `LevelInspectorPanel` + routing in `SelectionInspectorPane`.
2. Rebuild dev app; run QA checklist above.
3. Decide whether to retire double-click tab → modal in a follow-up polish pass.
