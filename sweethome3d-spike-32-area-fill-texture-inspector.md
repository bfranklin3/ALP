# SPIKE-32 — Area Fill Texture in Inspector + Landscape Texture Libraries

**Date:** August 20, 2026  
**Status:** Phase 2 shipped — Phase 3 (ALP landscape content pack) pending  
**Branch:** follow-on from `cursor/areas-inventory-and-level-locking` (or dedicated UI branch)  
**Parent:** SPIKE-19 / SPIKE-21 (right inspector); SPIKE-30 (layer category); site-plan fill workflow (Day 2 findings)  
**Related:** `SelectionInspectorPane.java`, `RoomController.java`, `TextureChoiceComponent.java`, `TexturesCatalog.java`, `UserPreferencesPanel.java`, `DefaultTexturesCatalog.java`

---

## Goal

1. **Inspector fill texture** — Let users pick **floor/area fill textures** from the docked **Inspector** (right top panel) without opening the full Modify area modal for routine work.
2. **Library-scoped browsing** — Replace one long flat texture list with **Library → Category → Texture** context; the existing popup modal (list + live preview) stays, but opens **pre-filtered**.
3. **Landscape texture content** — Ship (or auto-load) a monochrome **ALP landscape plan** texture library for hardscape, planting, paving, etc.

Rename the floor texture picker dialog title from **“Floor texture”** to **“Fill texture”** — areas are used for lawn, gravel, and paving as well as interior flooring.

---

## Problem

### Inspector gap (SPIKE-19 deferral)

Today, when an area/room is selected, the docked **Floor** section shows:

- Color swatch  
- Opacity (%)  
- Smooth corners  

It does **not** show texture. Texture, ceiling, and wall sides were deferred to the full **Modify area** modal (`RoomPanel`) via double-click or **Open full editor…**.

The **plan view already renders** `Room.getFloorTexture()`. The gap is inspector UI and discoverability for landscape fills.

### Texture library UX gap

Sweet Home 3D merges all texture sources into **one** runtime catalog:

- Built-in default catalog (~26 textures — mostly interior Floor / Wall / Sky)  
- Optional `.sh3t` plugin libraries (Furniture → Import textures library…)  
- User-imported textures  

The texture picker (`TextureChoiceComponent` → `TexturePanel` dialog) shows a **single searchable flat list** of every texture. For ALP site plans, users need **monochrome plan hatches** (gravel, mulch, lawn, concrete, pavers) grouped by **library** and **category**, not buried in a long list.

---

## Locked decisions (Aug 20, 2026)

### Inspector layout & behavior

| Topic | Decision |
|-------|----------|
| **Location** | Expand existing **Floor** titled section in `SelectionInspectorPane.RoomInspectorPanel` |
| **Color vs Texture** | **Radio buttons** (same pattern as `RoomPanel`): Color **or** Texture |
| **When Color selected** | **Hide** Library, Category, and Texture controls |
| **When Texture selected** | Show Library dropdown, Category dropdown, and Texture swatch button |
| **Texture swatch button** | Reuse stock **`TextureChoiceComponent`** (small swatch; click opens popup) |
| **Popup modal** | Existing **`TexturePanel`** — searchable list + **~128px live preview** + offset/angle/scale — **unchanged UX** |
| **Modal title** | **“Fill texture”** (replace `RoomController.floorTextureTitle` = “Floor texture”) |
| **Live apply** | Texture choice applies immediately on OK (same as modal today); inspector swatch updates; undo supported via existing `RoomController` |

### Library & category selectors (inspector)

| Topic | Decision |
|-------|----------|
| **Library control** | **Dropdown** (`JComboBox`) — one entry per loaded texture library |
| **Category control** | **Dropdown** — categories **in the selected library** plus **“All”** |
| **Modal filtering** | When Texture swatch opens popup, list is **pre-filtered** by inspector Library + Category |
| **Search in modal** | Still available; search runs **within** the active filter |

### Default library resolution (priority order)

When inspector opens for an area (Texture mode or user switches to Texture):

1. **Area already has a texture** → library + category from that texture’s catalog metadata  
2. **Else layer category hint** (see table below) → suggested library + category **if library loaded and category exists**  
3. **Else Preferences → Default texture library**  
4. **Else only one library loaded** → use it  
5. **Else first library in list  

### Default category resolution

- Use **layer category → texture category** mapping when that category name exists in the selected library.  
- Otherwise **“All”**.

### Session memory (v1)

- Remember **last Library + Category** chosen in the inspector **for the session** (until app quit).  
- **Do not** persist per-layer library/category in `.sh3d` for v1.

### Preferences (v1)

| Setting | Behavior |
|---------|----------|
| **Default texture library** | One dropdown in **Preferences** (Textures section) |
| **Single library loaded** | Control **disabled** or fixed to that library — it is the implicit default |

No separate **Default category** preference in v1.

### Layer category → texture defaults (built-in mapping)

Uses SPIKE-30 **`LevelCategory`** on the area’s level:

| Layer category | Preferred library | Preferred category (if present in library) |
|----------------|-------------------|---------------------------------------------|
| **Site** | ALP Landscape Plan (if loaded) | Hardscape |
| **Planting** | ALP Landscape Plan (if loaded) | Planting |
| **General** | Preferences default | All |
| **Reference** | Preferences default | All |
| **Annotation** | Preferences default | All |

If preferred library is not installed, fall through to Preferences default.

### Content & formats

| Topic | Decision |
|-------|----------|
| **Landscape pack name** | `ALP-Landscape-Plan.sh3t` (working title) |
| **Visual style** | **Monochrome / plan hatch** PNGs (gravel, mulch, lawn, concrete, pavers, …) |
| **Image formats** | BMP, GIF, JPEG, PNG via Java `ImageIO` (PNG recommended) |
| **Import size guidance** | Wizard prompts above **640×640 px**; recommend **256–512 px** tiles for plan hatches |
| **Auto-load** | ALP Dev / product install loads landscape library by default (same pattern as plant library) |
| **Ceiling / wall textures in inspector** | **Defer** — remain in full Modify area modal |

---

## Inspector UI — exact layout

### Floor section (Texture mode)

```text
Floor
┌─────────────────────────────────────────────────────────────┐
│  ○ Color    [■ light blue swatch ........................]  │
│  ● Texture                                                  │
│  Library:    [ ALP Landscape Plan              ▾ ]          │
│  Category:   [ Hardscape                       ▾ ]          │
│  Texture:    [ □ swatch — opens Fill texture popup ]        │
│  Opacity (%): [ 75                              ▲▼ ]        │
│  ☐ Smooth corners                                           │
└─────────────────────────────────────────────────────────────┘
```

### Floor section (Color mode)

```text
Floor
┌─────────────────────────────────────────────────────────────┐
│  ● Color    [■ light blue swatch ........................]  │
│  ○ Texture                                                  │
│  Opacity (%): [ 75                              ▲▼ ]        │
│  ☐ Smooth corners                                           │
└─────────────────────────────────────────────────────────────┘
```

(Library, Category, and Texture rows **hidden** when Color is selected.)

### Fill texture popup (unchanged structure, filtered list)

```text
┌ Fill texture ───────────────────────────────────────────────┐
│  Available textures:          Chosen texture:               │
│  ┌──────────────────┐         ┌─────────────┐               │
│  │ gravel hatch     │         │             │               │
│  │ mulch            │         │  preview    │               │
│  │ concrete         │         │  128px      │               │
│  │ …                │         └─────────────┘               │
│  └──────────────────┘         X offset / Y offset / …       │
│  Search: [___________]                                        │
│                              [ OK ]  [ Cancel ]             │
└─────────────────────────────────────────────────────────────┘
```

List contents = textures from **inspector Library** filtered by **inspector Category** (unless Category = All).

---

## Implementation phases

### Phase 1 — Inspector texture row (~2 days)

| Step | Scope |
|------|--------|
| 1.1 | Color / Texture radio in `RoomInspectorPanel`; wire `RoomController.Property.FLOOR_PAINT` |
| 1.2 | Embed `TextureChoiceComponent` via `roomController.getFloorTextureController().getView()` |
| 1.3 | Hide texture controls when Color selected |
| 1.4 | Rename dialog title → **Fill texture** (`RoomController.floorTextureTitle` / `package.properties`) |
| 1.5 | Live sync swatch when area selection changes |

**Deliverable:** Same popup as today (unfiltered list); inspector can switch Color ↔ Texture and open picker.

### Phase 2 — Library + category filters (~2–3 days)

| Step | Scope |
|------|--------|
| 2.1 | Tag each `CatalogTexture` with **`libraryId`** at load time (`DefaultTexturesCatalog`, plugin `.sh3t` load) |
| 2.2 | Library dropdown — populate from `UserPreferences.getLibraries()` (type = textures library) |
| 2.3 | Category dropdown — distinct categories for textures in selected library + **All** |
| 2.4 | Extend `TextureChoiceController` / `TexturesCatalogListModel` with optional **libraryId** + **category** filters |
| 2.5 | Pass inspector filter state into popup when opening `TexturePanel` |
| 2.6 | Default resolution — priority rules (existing texture → layer hint → Preferences → single library) |
| 2.7 | Session memory for last Library + Category |
| 2.8 | Preferences — **Default texture library** dropdown |

**Deliverable:** Three inspector selectors; modal opens pre-filtered.

### Phase 3 — Landscape texture content (~parallel, content + packaging)

| Step | Scope |
|------|--------|
| 3.1 | Author monochrome PNG plan hatches (gravel, mulch, lawn, concrete, pavers, …) |
| 3.2 | Build `ALP-Landscape-Plan.sh3t` (`PluginTexturesCatalog.properties` + images) |
| 3.3 | Categories: **Hardscape**, **Planting**, **Paving**, **General** (tune in implementation) |
| 3.4 | Auto-load library in ALP Dev / installer (plugin textures folder) |
| 3.5 | Set Preferences default to ALP Landscape Plan for new ALP homes (optional bootstrap) |

**Deliverable:** Usable landscape library out of the box.

---

## Technical approach

### 1. Model — library membership on textures

Today, all libraries merge into one `TexturesCatalog` and textures lose source-library identity.

**Add at load time:**

- Optional `libraryId` on `CatalogTexture` (or parallel `Map<String, String>` textureId → libraryId)  
- Set when reading `DefaultTexturesCatalog.properties` / `PluginTexturesCatalog.properties` from each library’s root `id=` key  

Duplicate texture IDs across libraries still dedupe (existing behavior); first loaded wins.

### 2. Inspector — `RoomInspectorPanel`

| File | Change |
|------|--------|
| **`SelectionInspectorPane.java`** | Floor section: color/texture radios; library + category combos; texture button; visibility rules |
| **`RoomController.java`** | No new properties; reuse `FLOOR_PAINT`, floor texture controller |
| **`AlpInspectorStyles.java`** | Optional spacing for new rows |

Wire pattern (same as `RoomPanel`):

```java
this.floorTextureComponent = (JComponent)
    roomController.getFloorTextureController().getView();
```

Pass filter into controller before popup opens:

```java
floorTextureController.setLibraryFilter(selectedLibraryId);
floorTextureController.setCategoryFilter(selectedCategory); // null = All
```

### 3. Texture picker filtering

| File | Change |
|------|--------|
| **`TextureChoiceController.java`** | Optional `libraryId` + `category` filter properties |
| **`TextureChoiceComponent.java`** | `TexturesCatalogListModel` respects filters when building flat list |
| **`UserPreferences.java` / `FileUserPreferences.java`** | Persist `defaultTexturesLibraryId` preference |

### 4. Preferences UI

| File | Change |
|------|--------|
| **`UserPreferencesPanel.java`** | Textures section: Default texture library combo |
| **`UserPreferencesController.java`** | Get/set default library id |
| **`package.properties`** | Label strings |

### 5. Strings

| Key | Value |
|-----|-------|
| `RoomController.floorTextureTitle` | **Fill texture** |
| `SelectionInspectorPane.textureLibraryLabel.text` | Library: |
| `SelectionInspectorPane.textureCategoryLabel.text` | Category: |
| `UserPreferencesPanel.defaultTexturesLibraryLabel.text` | Default texture library: |
| `RoomPanel.floorTextureRadioButton.text` | Texture: *(unchanged)* |

### 6. Files touched (summary)

| File | Phase |
|------|-------|
| `SelectionInspectorPane.java` | 1, 2 |
| `RoomController.java` | 1 |
| `TextureChoiceController.java` | 2 |
| `TextureChoiceComponent.java` | 2 |
| `CatalogTexture.java` or loader | 2 |
| `DefaultTexturesCatalog.java` | 2 |
| `UserPreferences.java` / `FileUserPreferences.java` | 2 |
| `UserPreferencesPanel.java` | 2 |
| `libraries/ALP-Landscape-Plan-1.0.0/` | 3 |

**Effort estimate:** ~4–5 days code (Phases 1–2) + content work for Phase 3.

---

## Texture formats & size (reference)

| Question | Answer |
|----------|--------|
| **Supported formats** | BMP, GIF, JPEG, PNG (`FileContentManager` / `ImageIO`) |
| **Hard pixel cap** | None in renderer; import wizard suggests downscale above **640×640 px** |
| **Recommended for plan hatches** | PNG, **256×512 px**, transparent or white background |
| **Required metadata** | Physical **width** and **height in cm** per texture in catalog properties |
| **Library package format** | `.sh3t` ZIP with `PluginTexturesCatalog.properties` + image folder |

---

## Relationship to other spikes

| Spike | Relationship |
|-------|----------------|
| SPIKE-19 | Retires deferral — area texture moves from modal-only to inspector |
| SPIKE-21 | Extends area inspector pattern (live edit, slim wrapper) |
| SPIKE-30 | Layer **Category** drives default library/category hints |
| SPIKE-31 | Inspector remains right top; no layout column changes |
| SPIKE-10 / plant library | Same `.sh3t` plugin packaging pattern for `ALP-Landscape-Plan` |
| Day 2 findings | “Richer textures” for outdoor areas — this spike delivers picker + content path |

---

## Success criteria

- Select area → Inspector **Floor** shows Color / Texture choice without opening Modify area modal.  
- **Texture** mode shows Library, Category, and Texture swatch.  
- Clicking swatch opens **Fill texture** popup with **list + live preview**; OK applies fill to plan immediately.  
- Popup list is **filtered** by inspector Library and Category (not one global flat list).  
- **Preferences → Default texture library** works; single-library install auto-defaults.  
- Layer on **Site** / **Planting** suggests ALP landscape library + matching category when pack is loaded.  
- Area that already has a texture restores correct library + category when re-selected.  
- **Open full editor…** and double-click modal still work for ceiling, walls, and advanced fields.  
- `ALP-Landscape-Plan.sh3t` ships or auto-loads with monochrome plan-appropriate categories.

---

## QA checklist (manual)

### Inspector — Color / Texture

- [ ] Select area → Floor shows Color and Texture radios.  
- [ ] Color selected → Library, Category, Texture hidden; color swatch + opacity work.  
- [ ] Texture selected → Library, Category, Texture visible; color swatch hidden or disabled.  
- [ ] Switch Color ↔ Texture — plan updates; undo works.

### Library & Category

- [ ] Library dropdown lists all loaded texture libraries.  
- [ ] Changing library refreshes Category dropdown (All + library categories).  
- [ ] Category **All** shows every texture in selected library in popup.  
- [ ] Category **Hardscape** (etc.) narrows popup list.  
- [ ] Only one library installed → library control fixed/disabled; still works.

### Popup (Fill texture)

- [ ] Modal title reads **Fill texture**, not Floor texture.  
- [ ] List + preview behave as stock modal; preview updates while browsing.  
- [ ] OK applies texture to area; inspector swatch matches.  
- [ ] Cancel leaves area unchanged.

### Defaults & Preferences

- [ ] Preferences default library applies on new area (no texture, no layer hint).  
- [ ] Area on **Site** layer → defaults to ALP Landscape / Hardscape when pack loaded.  
- [ ] Area on **Planting** layer → defaults to ALP Landscape / Planting when pack loaded.  
- [ ] Re-select area with existing texture → library + category match that texture.  
- [ ] Session remembers last library/category until quit.

### Content & regression

- [ ] ALP Landscape Plan library loads; categories appear in Category dropdown.  
- [ ] Monochrome textures readable on plan at typical zoom.  
- [ ] Double-click area → full modal still has floor/ceiling/wall sections.  
- [ ] Save/reopen `.sh3d` — textures persist.  
- [ ] Import textures library (menu) still works; new library appears in dropdown.

---

## Out of scope (SPIKE-32)

- Ceiling / wall-side texture in docked inspector  
- Embedded full preview grid in inspector (popup retains preview)  
- Per-layer library/category persistence in project file  
- Separate texture browser column (like furniture catalog)  
- Texture library editor UI inside ALP (use stock Textures Library Editor or hand-built `.sh3t`)  
- 3D material changes beyond existing floor fill behavior

---

## Next steps

1. **Phase 1** — Inspector Color/Texture + Fill texture rename + swatch button.  
2. **Phase 2** — `libraryId` tagging, filters, Preferences default, defaults logic.  
3. **Phase 3** — Author and ship `ALP-Landscape-Plan.sh3t`; auto-load in Dev app.  
4. Update SPIKE-19 spike doc cross-reference when Phase 1 ships.
