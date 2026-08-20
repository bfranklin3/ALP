# SPIKE-31 — Toolbar & Layer Tab Bar UX (Labeled Tools + Layer Tab Chrome)

**Date:** August 20, 2026  
**Status:** Phase 2 shipped — SPIKE-31 complete  
**Branch:** follow-on from `cursor/areas-inventory-and-level-locking` (or dedicated UI branch)  
**Parent:** ALP workflow polish (SPIKE-22, SPIKE-24, SPIKE-29, SPIKE-30); complements left **Library / Inventory** and right **Context** section labels  
**Reference UX:** SmartDraw-style toolbar (icon + short label, grouped with dividers)  
**Related:** `HomePane.java`, `ResourceAction.java`, `MultipleLevelsPlanPanel.java`, `AlpCatalogStyles.java`, `Level.java`, `LevelCategory.java`

---

## Goal

Improve **discoverability and scanability** of the two most-used plan chrome surfaces:

1. **Main toolbar** — replace icon-only buttons with **vertical icon + short label** controls, grouped like SmartDraw.
2. **Layer tab bar** — strengthen active-tab affordance and surface **layer state** (locked, hidden, category) without opening the inspector.

Teach a consistent vocabulary alongside existing zones:

| Zone | Name |
|------|------|
| Top | **Toolbar** (app + plan tools) |
| Above plan | **Layers** (tab bar) |
| Left | **Library** / **Inventory** |
| Right top | **Inspector** |
| Right bottom | **Context** |

---

## Problem

Today (inherited Sweet Home 3D):

### Toolbar

- `ResourceAction.ToolBarAction` **explicitly suppresses** button text (`NAME` → `null`) — toolbar is **icon-only**.
- `HomePane.createToolBar()` packs **~35–40** actions into a **single horizontal row** (file, edit, draw modes, text formatting, zoom, layers, draft, magnetism, photo/video, help).
- Landscape site-plan users rely heavily on **Select, Pan, Area, Polyline, Dimension, Text** — icons are not self-explanatory for new users.
- Many toolbar items are **low value for ALP site plans** (walls, add furniture, photo, video) but consume scarce horizontal space.
- Tooltips exist but require hover; no persistent labels.

### Layer tab bar

- `MultipleLevelsPlanPanel` renders tabs as **name-only** labels (`updateTabComponent()` → `JLabel` with optional same-elevation icon).
- **Lock, hidden, and category** state live only in the docked layer inspector — users must infer why a tab behaves differently.
- The **`+` new-layer** affordance is a **disabled icon tab** at the end — easy to miss; not labeled.
- As users add planting layers (**Trees Proposed**, etc.), the tab strip **crowds** with no truncation, overflow, or category visual coding.
- SPIKE-30 **Category** metadata is not reflected on tabs despite being the primary “what is this layer for?” signal.

There is **no technical blocker** — toolbar and tab components are ALP-owned touchpoints (`HomePane`, `MultipleLevelsPlanPanel`).

---

## Locked decisions (Aug 20, 2026)

| Topic | Decision |
|-------|----------|
| **Toolbar labels** | **Vertical** layout: icon top, 1-line label below (SmartDraw pattern) |
| **Label source** | Existing `HomePane.*.Name` keys; optional new `*.ToolBarLabel` for shorter strings (e.g. “Area” vs “Create areas”) |
| **Toolbar layout** | **Single row** with labeled buttons + separators in Phase 1; wrap to second row only if viewport &lt; threshold (Phase 2 optional) |
| **File / Edit labels** | **Labeled** in Phase 1 (Option B) — all groups including File and Edit get icon + short label; if horizontal space is tight, Phase 2 may add wrap or plan-adjacent draw strip |
| **Draw group labels** | **All labeled:** Select, Pan, Area, Polyline, Dimension, Text, **Walls** |
| **Removed from toolbar** | **Photo, Video, Add furniture** — menu-only (shortcuts retained) |
| **Walls** | **Stays on toolbar** — used to draw existing buildings on plan |
| **Text formatting cluster** | **Contextual** — show B/I/size only when Text tool active or label selected (Phase 2) |
| **Tab active state** | Stronger selected pill (match Context deck selector weight) |
| **Tab state glyphs** | Show **lock** and **hidden** on tab |
| **Category color strip** | **Yes** — 2 px bottom border: gray (Reference), amber (Site), green (Planting), blue (Annotation), light gray (General) |
| **Category text badge** | **Defer** v1 — color strip only; optional 3-letter badge Phase 2 |
| **Add layer control** | **Yes** — labeled **“+ Layer”** button adjacent to tab strip (not a fake icon tab) |
| **Tab overflow** | Phase 2 — scroll arrows or overflow menu |
| **Double-click rename** | Phase 2 — inline rename on tab |
| **User preference** | Defer `showToolbarLabels` — wait until after draw strip ships |

### Phase 2 locked decisions (Aug 20, 2026)

| Topic | Decision |
|-------|----------|
| **Top toolbar** | File \| Edit \| View \| Mode only (Zoom, Draft, Snap, Layers, Help) |
| **Draw strip** | Plan-adjacent labeled strip **below layer tabs, above plan** — Select, Pan, Walls, Area, Polyline, Dimension, Text (**moved** from top row, not duplicated) |
| **Text formatting** | Size+/−, Bold, Italic **hidden by default**; visible when Text tool active **or** label selected |
| **Tab overflow** | Keep Swing **scroll arrows** (◀ ▶); polish integration with custom tabs + **+ Layer**; max tab width + truncation |
| **Double-click tab** | **Modify Level** dialog (fix Phase 1c regression) |
| **Tab rename** | **F2** inline rename on selected layer (plan focus); **double-click stays Modify Level** |
| **Rename discoverability** | “Rename layer…” on tab context menu |
| **Category text badge** | **Skip** |
| **`showToolbarLabels` preference** | **Defer** |
| **Wrap to second row** | **Defer** (draw strip is the structural fix) |

### Phase 2 implementation order

1. Fix double-click → Modify Level (custom tab mouse forwarding)
2. Tab scroll layout + max tab width
3. Draw strip + top toolbar trim + contextual text formatting
4. F2 inline tab rename + context menu item

---

## Toolbar — mock groupings

### Phase 1 — labeled (approved set, Option B)

All toolbar groups get **vertical icon + short label**. If the row is too tight on typical widths, Phase 2 may add wrap or a plan-adjacent draw strip.

```
┌────────────────────────────────────────────────────────────────────────────────────────────────┐
│ FILE (labeled) │ EDIT (labeled) │ DRAW (labeled)                          │ VIEW (labeled)    │
│ New Open Save  │ Undo Redo      │ Select Pan Area Line Dim Text Walls    │ Zoom Draft Snap   │
│                │ Cut Copy Paste │                                         │ Layers Help       │
└────────────────────────────────────────────────────────────────────────────────────────────────┘
```

| Group | Actions (ActionType) | Phase 1 label | Notes |
|-------|----------------------|---------------|-------|
| **File** | NEW_HOME, OPEN, SAVE | New, Open, Save | Labeled (Option B) |
| **Edit** | UNDO, REDO, CUT, COPY, PASTE | Undo, Redo, Cut, Copy, Paste | Labeled (Option B) |
| **Draw** | SELECT, PAN, CREATE_ROOMS, CREATE_POLYLINES, CREATE_DIMENSION_LINES, CREATE_LABELS, **CREATE_WALLS** | Select, Pan, Area, Polyline, Dimension, Text, **Walls** | All labeled |
| **View** | ZOOM_IN, ZOOM_OUT | Zoom +, Zoom − | Labeled |
| **Mode** | Draft toggle, Magnetism toggle, MANAGE_LAYERS, HELP | Draft, Snap, Layers, Help | Labeled |

**Removed from toolbar (menu / shortcuts retained):**

| Action | Rationale |
|--------|-----------|
| ADD_HOME_FURNITURE | Objects placed from Library |
| CREATE_PHOTO, CREATE_VIDEO | 3D output; not plan-first workflow |
| INCREASE/DECREASE_TEXT_SIZE, BOLD, ITALIC | Phase 2 contextual cluster |

### Phase 2 — layout (locked)

```text
[ Top toolbar: File | Edit | View | Mode ]
[ Layer tabs ◀ ▶ …                                    + Layer ]
[ Draw strip: Select Pan Walls Area Polyline Dimension Text ]
[ Text formatting: Size+ Size- Bold Italic ]  ← visible when Text tool or label selected
[ Plan ]
```

### Phase 2 — optional enhancements (deferred)

- **Wrapping toolbar** when width &lt; ~1200 px — defer
- **Dropdown draw group** — not recommended

---

## Layer tab bar — mock

### Phase 1 — tab chrome

```
┌──────────────────────────────────────────────────────────────────────────┐
│ Layers                                                                   │
├──────────────────────────────────────────────────────────────────────────┤
│ [Reference🔒] [Existing] [Proposed] [Plants] [Annotations] [Trees…]  [+ Layer] │
│  ── gray      ── tan      ── tan     ── green  ── blue                  │
│     ▲ active tab = filled pill + category color bottom border           │
└──────────────────────────────────────────────────────────────────────────┘
```

| Element | Behavior |
|---------|----------|
| **Tab label** | Level name; ellipsis + tooltip if truncated |
| **Lock glyph** | Small lock icon when `level.isLocked()` |
| **Hidden glyph** | Eye-off or dimmed text when `!level.isViewable()` |
| **Category strip** | 2 px bottom border color by `LevelCategory` (see table below) |
| **Same-elevation icon** | Keep existing dot/icon for overlay stack (unchanged) |
| **+ Layer** | `JButton` to right of `JTabbedPane`; calls `planController.addLevel()` |

### Category colors (proposed — tune in implementation)

| Category | Strip color | Notes |
|----------|-------------|-------|
| Reference | `#9CA3AF` (gray) | |
| Site | `#B45309` (amber) | Existing + Proposed hardscape |
| Planting | `#059669` (green) | |
| Annotation | `#2563EB` (blue) | |
| General | `#D1D5DB` (light gray) | User-added layers |

### Phase 2 — overflow & rename (locked)

- **Scroll arrows** — refine Swing `SCROLL_TAB_LAYOUT` with custom tab components
- **Double-click tab** → Modify Level (restore; broken after Phase 1c)
- **F2** → inline rename on selected layer tab
- **Rename layer…** context menu item

---

## Scope

### In scope

#### Phase 1a — Toolbar labels (~1–2 days)

- `AlpToolBarButton` — vertical icon + label component
- `LabeledToolBarAction` (or extend `ToolBarAction`) — expose short label without full menu name
- Refactor `HomePane.createToolBar()` to use labeled buttons for **all groups** (File, Edit, Draw, View, mode)
- Group separators with consistent spacing (`AlpCatalogStyles`)
- Strings: optional `*.ToolBarLabel` in `package.properties` for abbreviated labels

#### Phase 1b — Toolbar ALP trim (~0.5 day)

- Remove **photo, video, add furniture** from toolbar — **menu-only**
- **Walls stays** on labeled Draw group
- Verify accelerators and Plan menu still expose removed items

#### Phase 1c — Layer tab chrome (~1–2 days)

- `AlpLevelTabComponent` — custom tab component replacing plain `JLabel` in `updateTabComponent()`
- Lock / hidden glyphs + category color strip
- Stronger selected-tab styling
- **`+ Layer`** button adjacent to tabbed pane (replace disabled icon tab pattern)
- Truncation + tooltip for long names

#### Phase 2 — Density & tab scalability (~2–3 days) **IN PROGRESS**

| Step | Scope |
|------|--------|
| 2.1 | Fix double-click tab → Modify Level (Phase 1c regression) |
| 2.2 | Tab scroll layout (`SCROLL_TAB_LAYOUT`), max tab width, ALP scroll integration |
| 2.3 | Plan-adjacent **draw strip**; top toolbar → File \| Edit \| View \| Mode |
| 2.4 | Contextual text-formatting cluster (Text mode or label selected) |
| 2.5 | **F2** inline tab rename; “Rename layer…” context menu |

**Deferred:** `showToolbarLabels` preference, wrap-to-second-row, category text badge.

#### Phase 2 — Polish (superseded by table above)

### Out of scope (SPIKE-31)

- Full ribbon UI
- Left vertical tool palette
- Plan-adjacent second toolbar row (unless promoted from Phase 2)
- Reordering tabs via drag (SPIKE-15c already ships tab drag)
- Changes to Context deck or Inspector layout
- Printable / NCS layer template expansion

---

## Technical approach

### 1. Toolbar button component

| File | Change |
|------|--------|
| **`AlpToolBarButton.java`** *(new)* | `JButton` subclass: `BorderLayout`, icon `CENTER`, label `SOUTH`, fixed min width (~52 px), multiline-safe 1-line label, disabled state |
| **`AlpToolBar.java`** *(new, optional)* | Factory: `addGroup(JToolBar, Action[])` with separator; or static helpers on `AlpToolBarButton` |
| **`ResourceAction.java`** | Add `LabeledToolBarAction` — returns short label for `Action.NAME` (new key `TOOL_BAR_LABEL` or use `Name`) |
| **`AlpCatalogStyles.java`** | `applyToolBarButton`, `applyToolBar`, group separator insets |
| **`HomePane.java`** | Rewrite `createToolBar()`: build groups per mock; use `AlpToolBarButton` + `JToggleButton` variant for modes; update `addActionToToolBar` / `addToggleActionToToolBar` |

**Implementation sketch:**

```java
// AlpToolBarButton — vertical icon + label
final AlpToolBarButton button = new AlpToolBarButton(action, shortLabel);
toolBar.add(button);

// LabeledToolBarAction — unlike ToolBarAction, does NOT null out NAME
// Or: AlpToolBarButton reads Action.SHORT_DESCRIPTION / custom TOOL_BAR_LABEL key
```

### 2. Layer tab component

| File | Change |
|------|--------|
| **`AlpLevelTabComponent.java`** *(new)* | `JPanel` with name label, optional lock/hidden icons, category strip `BorderLayout.SOUTH`; handles paint for selected state |
| **`MultipleLevelsPlanPanel.java`** | `updateTabComponent()` → build `AlpLevelTabComponent`; listen for `Level` property changes (NAME, VIEWABLE, LOCKED, CATEGORY) to refresh tab; `createTabs()` — remove disabled `+` icon tab, add external `+ Layer` button in surrounding panel |
| **`AlpCatalogStyles.java`** | Category strip colors; selected tab background |
| **`LevelCategory.java`** | Optional `getTabStripColor()` helper — or map in `AlpLevelTabComponent` |

**Layout change for tab bar:**

```text
MultipleLevelsPlanPanel (BorderLayout)
  NORTH: [ optional "Layers" micro-label — defer if redundant with Context deck ]
  CENTER: JPanel (BorderLayout)
    CENTER: LevelTabbedPane
    EAST:  "+ Layer" JButton
```

### 3. Strings

| Key area | Examples |
|----------|----------|
| Toolbar short labels | `HomePane.SELECT.ToolBarLabel=Select`, `HomePane.CREATE_ROOMS.ToolBarLabel=Area` |
| Add layer button | `MultipleLevelsPlanPanel.addLayerButton.text=+ Layer` |
| Tab tooltips | `AlpLevelTabComponent.lockedTooltip`, `.hiddenTooltip` |

### 4. Files touched (summary)

| File | Phase |
|------|-------|
| `AlpToolBarButton.java` | 1a |
| `AlpToolBar.java` | 1a (optional) |
| `ResourceAction.java` | 1a |
| `HomePane.java` | 1a, 1b |
| `AlpCatalogStyles.java` | 1a, 1c |
| `package.properties` | 1a, 1c |
| `AlpLevelTabComponent.java` | 1c |
| `MultipleLevelsPlanPanel.java` | 1c |
| `LevelCategory.java` | 1c (optional color helper) |

**Likely touchpoints:** ~8–10 files, ~400–700 lines total (Phase 1a–c).

**Effort estimate:** ~3–5 days (Phase 1a–c + Phase 2 polish).

---

## Relationship to other spikes

| Spike | Relationship |
|-------|----------------|
| SPIKE-22 | Catalog L&F; toolbar/tab styling extends same `AlpCatalogStyles` vocabulary |
| SPIKE-24 | Layer inspector unchanged; tabs show state inspector already edits |
| SPIKE-29 | Context **Layers** panel complements tab bar (list vs active tab) |
| SPIKE-30 | **Category** colors on tab strip read `Level.category` |
| SPIKE-15 / 15c | Tab reorder via menu + drag unchanged |
| SPIKE-26 (backlog) | Measure tool gets a labeled toolbar slot when implemented |

---

## Success criteria

- Draw tools (**Select, Pan, Area, Polyline, Dimension, Text**) show **icon + label** on main toolbar.
- Toolbar groups separated by visible dividers; no regression to actions, accelerators, or toggle mode behavior.
- Low-value ALP tools (**photo, video, add furniture**) removed from toolbar but reachable via menu.
- **Walls** remains on labeled Draw toolbar.
- Layer tabs show **lock** and **hidden** when applicable.
- Active tab visually distinct; category **color strip** matches SPIKE-30 category.
- **+ Layer** is a labeled button, not a blank icon tab.
- Long tab names truncate with full name in tooltip.
- No regression to tab switch, drag-reorder, or plan focus.

---

## QA checklist (manual)

### Toolbar

- [ ] Each labeled Draw tool shows icon + short label; tooltip still shows full description.
- [ ] Click Select / Pan / Area / … — mode toggles correctly; selected mode visually distinct.
- [ ] Undo, Redo, Save, Zoom work as before.
- [ ] Photo, Video, Add furniture absent from toolbar; still in menu. **Walls** present on labeled Draw group.
- [ ] Window narrow (~1024 px) — toolbar usable (scroll or wrap per phase).
- [ ] macOS + Windows (if available) — button height and label legibility OK.

### Layer tabs

- [ ] New site plan — five starter tabs show correct category strip colors.
- [ ] Reference tab shows lock glyph; toggle lock in inspector updates tab.
- [ ] Hide layer (viewable off) — tab shows hidden/dimmed treatment.
- [ ] `+ Layer` adds layer; does not leave user on a disabled blank tab.
- [ ] Rename layer in inspector — tab label updates.
- [ ] Set Category = Planting — tab strip turns green.
- [ ] Eight+ layers — truncation/overflow behaves per phase (Phase 2 for overflow).
- [ ] Tab drag-reorder (SPIKE-15c) still works.

---

## Sequencing

- **After:** SPIKE-30 (category metadata on levels), SPIKE-29 (Context deck labels)
- **Before:** SPIKE-26 Measure tool (give it a labeled toolbar home)
- **Parallel OK with:** SPIKE-28 symbol layers, library content work

---

## Next steps

1. ~~Review and approve proposed locked decisions~~ **Done (Aug 20, 2026)**
2. Implement Phase 1a — `AlpToolBarButton` + labeled **all** toolbar groups (Option B)
3. Implement Phase 1b — remove photo, video, add furniture from toolbar
4. Implement Phase 1c — `AlpLevelTabComponent` + `+ Layer` button
5. Rebuild dev app; run QA checklist
6. Update execution plan backlog row → **COMPLETED** when shipped
