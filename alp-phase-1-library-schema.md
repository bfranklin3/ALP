# ALP CAD — Phase 1 Library Schema (SPIKE-09)

**Date:** August 18, 2026  
**Status:** Approved for SPIKE-10 / SPIKE-11 content work  
**Engine:** Sweet Home 3D 7.5 / ALP-Core (`DefaultFurnitureCatalog`, `.sh3f` import)

---

## Purpose

Define how ALP CAD **furniture libraries** (`.sh3f`) are named, categorized, sized, and packaged for Phase 1 landscape and site-plan work. Plants and outdoor features are **catalog furniture entries**, not a separate object type.

This schema is the contract for:

- **SPIKE-10** — Plant starter pack  
- **SPIKE-11** — Outdoor-feature starter pack  
- Future ALP content packs and optional bundling with the dev app / installer  

**Related docs:** [sweethome3d-phase-1-implementation-roadmap.md](sweethome3d-phase-1-implementation-roadmap.md) (M2), [Building ALP CAD  Libraries.md](Building%20ALP%20CAD%20%20Libraries.md) (authoring overview).

---

## Goals (Phase 1)

1. Site-plan symbols that read clearly at plan scale (2D top-view first).  
2. Small, **curated** libraries — quality over quantity.  
3. Consistent IDs, categories, and sizing for inventory and future scheduling.  
4. Offline, importable `.sh3f` files that work in stock SH3D import flow.  
5. No engine changes required for basic use.

## Non-goals (Phase 1)

- Full plant database / botanical taxonomy  
- Nursery inventory or pricing workflows  
- Photo-realistic 3D botanical rendering  
- Custom catalog UI or new object types in ALP-Core  
- Texture libraries (`.sh3t`) unless a separate hardscape pack needs them later  

---

## Library types and file formats

| Type | Extension | Phase 1 use |
|------|-----------|-------------|
| **Furniture library** | `.sh3f` | **Primary** — plants, trees, site furniture, hardscape objects |
| Textures library | `.sh3t` | Defer unless paving/hatch swatches are packaged separately |
| Language library | `.sh3l` | Defer |

### `.sh3f` structure (ZIP archive)

Minimum contents:

```
ALP-Plants-1.0.0.sh3f
├── PluginFurnitureCatalog.properties    # library metadata + piece definitions (#1, #2, …)
├── PluginFurnitureCatalog_en.properties # optional localized names/categories
├── models/ …                            # OBJ, DAE, etc. (embedded paths in properties)
├── icons/ …                             # catalog thumbnails
└── plan-icons/ …                        # 2D top-view symbols (ALP-required for plants)
```

- Root descriptor name is fixed: `PluginFurnitureCatalog.properties` (`DefaultFurnitureCatalog.PLUGIN_FURNITURE_CATALOG_FAMILY`).  
- **Offline libraries:** embed all assets in the ZIP (recommended for ALP distribution).  
- **Import path:** Furniture → Import furniture library… → copied to `~/Library/Application Support/eTeks/Sweet Home 3D/furniture/` (macOS; ALP Dev uses this path today).

### `PluginFurnitureCatalog.properties` encoding — **critical**

Sweet Home 3D loads plugin catalogs via `PropertyResourceBundle` on an `InputStream` (`ResourceBundleTools.getBundle` → `DefaultFurnitureCatalog.readPluginFurnitureCatalog`). That path uses **ISO-8859-1 (Latin-1)**, not UTF-8.

| Symptom | Cause |
|---------|--------|
| Library appears in **About → Libraries** but **no new catalog folder / pieces** | Properties parsed for library metadata; **piece load fails** on malformed / non-Latin-1 bytes |
| Garbled names in catalog | UTF-8 multi-byte sequences read as separate Latin-1 characters |

**Authoring rules (Phase 1 — validated Aug 2026):**

1. **ASCII-only** text in `PluginFurnitureCatalog.properties` (hyphens `-` instead of em dashes; no raw `›` — use `\u203A` if needed).  
2. **Write the file as ISO-8859-1** or use `\uXXXX` escapes for any non-ASCII (match stock `Trees.sh3f`).  
3. **Asset paths:** leading slash inside the ZIP, e.g. `icon#1=/icons/plant-01.png`, `planIcon#1=/plan-icons/plant-01.png`.  
4. Optional: `modelSize#N` = OBJ byte size.  
5. **`scripts/build-alp-plants-library.sh`** generates ASCII + ISO-8859-1 properties — reference pipeline for SPIKE-11.

**If import “succeeds” but catalog is empty:** re-export properties as ASCII, re-import (replace), restart app.

### Draft vs Presentation plan icons (SPIKE-12b) — **critical for ALP libraries**

ALP CAD (not stock Sweet Home 3D) supports **two** top-view symbols per catalog piece:

| Mode | User toggle | Asset property | Typical file |
|------|-------------|----------------|--------------|
| **Presentation** | Draft off (default) | `planIcon#N` | Color / watercolor PNG in `plan-icons/` |
| **Draft** | Draft on (⌘⇧D) | `planIconLine#N` (CONTENT) | Black line-art PNG in `plan-icons-line/` |

**Requirements in app:** **Settings → Furniture icons in plan → Top view** (not “Catalog icons”).

#### Catalog property format

`planIcon` uses the normal key (no type suffix):

```properties
planIcon#1=/plan-icons/plant-01.png
```

`planIconLine` is an **additional CONTENT property**. The key must include `:CONTENT` as the property **type**, but the colon must be **escaped** because Java `.properties` files treat `:` as a key/value separator:

```properties
planIconLine#1\:CONTENT=/plan-icons-line/plant-01.png
```

| Wrong (broken) | What Java parses | Result in SH3D |
|----------------|------------------|----------------|
| `planIconLine#1:CONTENT=/plan-icons-line/plant-01.png` | key=`planIconLine#1`, value=`CONTENT=/plan-icons-line/...` | String property — **Draft falls back to color `planIcon`** |
| `planIconLine#1\:CONTENT=/plan-icons-line/plant-01.png` | key=`planIconLine#1:CONTENT`, value=`/plan-icons-line/...` | Loaded as `Content` — **Draft shows line art** |

When authoring by hand, the backslash is literal in the file. In Python/build scripts, emit `\\:` so the written file contains `\:`.

**Reference implementation:** `scripts/build-alp-plants-library.sh` (generates both `planIcon#N` and escaped `planIconLine#N\:CONTENT`).

#### Engine behavior (ALP-Core — Aug 2026)

Implemented in `PlanComponent.java` (Sweet Home 3D 7.5 fork):

1. In Draft + Top view, paint `piece.getContentProperty("planIconLine")` when set; otherwise fall back to `planIcon`.
2. Top-view icon **cache** must key on the resolved plan icon content and **clear when Draft mode toggles** — otherwise the first-painted mode (usually Presentation) is cached and Draft appears unchanged.

Stock SH3D ignores `planIconLine`; ALP libraries still import and work, but Draft uses color icons only in stock builds.

#### Authoring checklist (every new `.sh3f`)

- [ ] Embed **`plan-icons/`** (Presentation) and **`plan-icons-line/`** (Draft) in the ZIP.
- [ ] Set **`planIcon#N`** for every landscape/site symbol intended for plan view.
- [ ] Set **`planIconLine#N\:CONTENT`** with escaped colon for Draft line art (copy pattern from plant build script).
- [ ] Write properties as **ISO-8859-1 / ASCII** (see encoding section above).
- [ ] Bump internal **`version=`** when re-releasing; document in changelog.
- [ ] **Re-import** library in Dev app after rebuild; **restart app** if catalog looks stale.
- [ ] **Delete and re-drag** placed pieces after a catalog fix — `planIconLine` is copied at drag time; existing home furniture does not pick up new catalog properties automatically.

#### Troubleshooting

| Symptom | Likely cause | Fix |
|---------|--------------|-----|
| Draft and Presentation look identical (both color) | Unescaped `:` in `planIconLine` key | Use `planIconLine#N\:CONTENT=...`; rebuild; re-import |
| Draft still color after library fix | Placed before fix, or app not restarted | Re-drag from catalog; restart Dev app |
| Draft shows catalog thumbnail in a box | **Top view** not enabled in Settings | Settings → Furniture icons in plan → **Top view** |
| Library in About but no pieces | UTF-8 / non-ASCII properties | ASCII + ISO-8859-1 (see encoding section) |

#### Filename vs internal version

The `.sh3f` **filename** (e.g. `ALP-Plants-1.0.0.sh3f`) can differ from the **`version=`** field inside `PluginFurnitureCatalog.properties` (e.g. `1.0.2`). **About → Libraries** shows the internal `version=` value. Prefer aligning filename and `version=` on new packs; existing filenames may lag for import compatibility.

### Library-level metadata (required)

Keys at the top of `PluginFurnitureCatalog.properties`:

| Key | Required | Example |
|-----|----------|---------|
| `id` | Yes | `alp-plants-phase1` |
| `name` | Yes | `ALP Plants - Phase 1` |
| `description` | Yes | Short sentence for About / Libraries list |
| `version` | Yes | `1.0.0` (semver) |
| `license` | Yes | `Proprietary - ALP CAD` or SPDX / CC string |
| `provider` | Yes | `ALP CAD` |

---

## Phase 1 library products

Two starter packs per Block E:

| File name | Spike | Target count | Focus |
|-----------|-------|--------------|--------|
| `ALP-Plants-1.0.0.sh3f` | SPIKE-10 | 8–15 pieces | Trees, shrubs, groundcover, one perennial accent |
| `ALP-Outdoor-1.0.0.sh3f` | SPIKE-11 | 8–15 pieces | Patios, planters, seating, site amenities, simple hardscape |

Additional packs (architecture symbols, doors/windows refresh) are **Phase 2** unless pulled forward explicitly.

---

## Category tree

Categories map to SH3D `category#N` strings as **flat folder names** — the engine does **not** split on `›` or `/` to build a hierarchy. Each distinct string is one folder in the furniture catalog tree.

**Phase 1 (shipped):** single folder **`ALP Plants`** for all 12 starter pieces (easy to find; validated in Dev app Aug 2026).

**Phase 1+ / optional:** longer flat names still work, e.g. `ALP Plants - Trees - Deciduous` — but **`ALP › Plants › Trees › Deciduous` is one folder**, not nested ALP → Plants → Trees.

### Plants library (`ALP-Plants-*.sh3f`) — suggested category labels

| Category string (flat) | Contents |
|----------------------|----------|
| `ALP Plants` | **Phase 1 default** — all starter plants in one folder |
| `ALP Plants - Trees - Deciduous` | Optional split when catalog grows |
| `ALP Plants - Trees - Evergreen` | Conifers, broadleaf evergreen |
| `ALP Plants - Shrubs` | Rounded masses, hedges |
| `ALP Plants - Groundcover` | Low spreads, mats, edging |
| `ALP Plants - Perennials` | Ornamental grasses, focal plants |

Use **ASCII** in category strings (see encoding section above).

### Outdoor library (`ALP-Outdoor-*.sh3f`) — suggested category labels

| Category string (flat) | Contents |
|------------------------|----------|
| `ALP Site - Hardscape` | Paving units, gravel areas (flat symbols) |
| `ALP Site - Planters` | Container planting |
| `ALP Site - Furniture` | Benches, tables, chairs (outdoor) |
| `ALP Site - Utilities` | Grilles, simple fixtures (minimal set) |
| `ALP Site - Recreation` | Fire pit, simple play item (optional) |

**Rule:** One category string per piece. Pick names that sort together (`ALP Plants …`, `ALP Site …`).

---

## Naming and IDs

### Display name (`name#N`)

Human-readable, title case, optional size hint:

- `Live Oak — 30 ft spread`  
- `Boxwood Hedge — 3 ft`  
- `Teak Bench — 6 ft`

Avoid cryptic codes in the visible name.

### Stable ID (`id#N`)

**Required for all ALP pieces.** Lowercase kebab, prefixed by pack:

| Pack | Pattern | Examples |
|------|---------|----------|
| Plants | `alp-plt-{species-or-role}-{variant}` | `alp-plt-oak-deciduous-30`, `alp-plt-boxwood-hedge-3` |
| Outdoor | `alp-out-{object}-{variant}` | `alp-out-bench-teak-6`, `alp-out-planter-rect-24` |

Rules:

- IDs are **globally unique** across all ALP libraries (duplicates are skipped on import).  
- Never change an ID after release; add a new ID for revised artwork.  
- Version the `.sh3f` file, not the ID.

### Tags (`tags#N`, optional)

Comma-separated, lowercase keywords for search: `tree, deciduous, shade, native`.

---

## Piece metadata — required and recommended fields

SH3D reads numbered keys (`name#1`, `width#1`, …) in `PluginFurnitureCatalog.properties`. Property names match `DefaultFurnitureCatalog.PropertyKey`.

### Required for every ALP piece

| Property | Key | Notes |
|----------|-----|--------|
| Name | `name#N` | Display name |
| ID | `id#N` | ALP stable ID |
| Category | `category#N` | From category tree above |
| Width / depth / height | `width#N`, `depth#N`, `height#N` | **Centimeters** internally |
| Model | `model#N` | Path inside ZIP to 3D model |
| Icon | `icon#N` | Catalog list thumbnail (PNG, ~128px) |
| Movable | `movable#N` | `true` for plants and site objects |
| Door or window | `doorOrWindow#N` | `false` for Phase 1 packs |

### Required for ALP plants & site objects (Phase 1 quality bar)

| Property | Key | Notes |
|----------|-----|--------|
| **Plan icon** | `planIcon#N` | **Required** — 2D top-view symbol (PNG, transparent) |
| **Plan icon (Draft line art)** | `planIconLine#N\:CONTENT` | Optional — line-only PNG for Draft mode (SPIKE-12b). **Escape the colon** — Java `.properties` treats `:` as a key/value separator, so the key must be `planIconLine#1\:CONTENT=/plan-icons-line/plant-01.png`, not `planIconLine#1:CONTENT=...`. |
| Resizable | `resizable#N` | `true` (typical) — user adjusts spread on plan |
| Description | `description#N` | One line: role + default size in ft/in for authors |
| Creator | `creator#N` | `ALP CAD` or asset author |

### Recommended optional fields

| Property | Key | Use |
|----------|-----|-----|
| Tags | `tags#N` | Search / filter |
| Creation date | `creationDate#N` | `yyyy-MM-dd` |
| License | `license#N` | Per-asset if different from library |
| Deformable / texturable | `deformable#N`, `texturable#N` | Usually `false` for plan-first symbols |

### Phase 1 defaults (typical)

```
movable#N=true
doorOrWindow#N=false
resizable#N=true
deformable#N=false
texturable#N=false
horizontallyRotatable#N=true
elevation#N=0
```

---

## Sizing conventions

All dimensions are stored in **centimeters**. Author in feet/inches, convert before entering the library.

| Object kind | Width × depth | Height | Notes |
|-------------|---------------|--------|--------|
| Medium tree | 600–900 cm spread | 800–1200 cm | Plan icon = canopy footprint |
| Large tree | 900–1500 cm | 1200–1800 cm | |
| Shrub | 90–300 cm | 60–200 cm | |
| Groundcover patch | 60–200 cm | 10–30 cm | Often reads as flat mass |
| Bench | 120–180 cm × 60 cm | 90 cm | |
| Planter | 40–120 cm square | 40–80 cm | |

**Plan icon artwork** should match **width × depth** footprint (1 unit in plan = real-world scale after placement). Height affects 3D view only for Phase 1.

---

## 2D plan vs 3D model expectations

### Plan view (priority)

- Every ALP plant/outdoor piece **must** have a dedicated `planIcon`.  
- Design for **draft mode** (SPIKE-18) and zoom from site plan to detail.  
- Prefer simple fills/outlines: canopy circles, shrub blobs, bench rectangles.  
- PNG with alpha; square or footprint aspect; min 64×64, target 128–256 px.  

### 3D model (acceptable minimum)

- Lightweight mesh or placeholder (simple trunk + canopy, extruded bench).  
- Formats: OBJ (+ MTL), DAE, or KMZ. Set `multiPartModel#N=true` if textures are in-folder.  
- Reuse one mesh with different plan icons / scales where honest (e.g. generic shrub).  
- Target &lt; 500 KB per model for starter pack; whole library &lt; 15 MB preferred.

### Catalog icon

- 128×128 PNG thumbnail for furniture list; can be rendered from plan icon or separate preview.

---

## Authoring workflow

1. **Source art** — sprite sheet or individual PNGs; run `scripts/split-plant-symbol-sheet.py` (trim, alpha, square pad) via `build-alp-plants-library.sh`.  
2. **Furniture Library Editor** ([SH3D plugins](https://www.sweethome3d.com/plugins/)) — alternative for model-heavy libraries.  
3. **Properties** — ASCII / ISO-8859-1 only; see encoding section above.  
4. **Validate IDs** — no duplicates across `ALP-Plants` and `ALP-Outdoor`.  
5. **Import** into Sweet Home 3D Dev → verify catalog tree, Draft + Presentation, save/reopen.

Source for editor: `code-extract/sweethome-3d-master/FurnitureLibraryEditor/` in this repo.

---

## Validation checklist (per library)

Before marking SPIKE-10 or SPIKE-11 complete:

- [ ] Imports via Furniture → Import furniture library without error  
- [ ] Library appears in **About → Libraries** *and* pieces appear in furniture catalog (if Libraries yes / catalog empty → check **ISO-8859-1** properties encoding)  
- [ ] Library appears in catalog under expected **flat** category (e.g. `ALP Plants`)  
- [ ] Every piece has unique `id#N` and `planIcon#N`  
- [ ] Plan view shows custom top-view symbol (not generic box) in **Presentation** mode with **Settings → Furniture icons in plan → Top view**  
- [ ] Resize and rotate behave as expected (`resizable`, `movable`)  
- [ ] Pieces assign to **Plants** or site level in a test plan  
- [ ] Furniture inventory lists placed items with level column  
- [ ] Draft mode (⌘⇧D) shows **black line art** from `planIconLine` (Presentation still shows color `planIcon`)  
- [ ] After library update, newly dragged pieces show Draft/Presentation swap correctly (re-drag required)  
- [ ] Saved `.sh3d` reopens with correct symbols  
- [ ] Offline: no missing models/icons when disconnected  

---

## Phase 1 vs deferred

| Item | Phase 1 | Defer |
|------|---------|-------|
| `.sh3f` plant + outdoor packs | ✓ | |
| Plan icons for all ALP pieces | ✓ | |
| Lightweight 3D placeholders | ✓ | |
| Pre-install in Dev `.app` bundle | Optional | Full installer bundling |
| `.sh3t` paving/hatch textures | | ✓ |
| Architecture door/window refresh | | ✓ (separate pack) |
| Monochrome vs color symbol variants | ✓ (SPIKE-12b: `planIcon` + `planIconLine`) | |
| Bundled Furniture Library Editor | | ✓ (document download link) |

---

## File naming and distribution

| Artifact | Convention |
|----------|------------|
| Library file | `ALP-{Pack}-{semver}.sh3f` e.g. `ALP-Plants-1.0.0.sh3f` |
| Repo folder (suggested) | `libraries/ALP-Plants-1.0.0/` source assets + built `.sh3f` |
| Changelog | `libraries/ALP-Plants-CHANGELOG.md` — note ID/size changes |

---

## Example minimal piece entry

```properties
# PluginFurnitureCatalog.properties (excerpt) — ASCII / ISO-8859-1 only
id=alp-plants-phase1
name=ALP Plants - Phase 1
version=1.0.0
license=Proprietary - ALP CAD
provider=ALP CAD
description=Starter plant symbols for ALP CAD site plans.

name#1=Live Oak - 30 ft spread
id#1=alp-plt-oak-deciduous-30
category#1=ALP Plants
description#1=Deciduous shade tree, 30 ft canopy default.
tags#1=tree, deciduous, shade
creator#1=ALP CAD
width#1=914.4
depth#1=914.4
height#1=1219.2
model#1=/models/oak-simple.obj
modelSize#1=2048
icon#1=/icons/oak-128.png
planIcon#1=/plan-icons/oak-top-256.png
planIconLine#1\:CONTENT=/plan-icons-line/oak-top-256.png
movable#1=true
doorOrWindow#1=false
resizable#1=true
deformable#1=false
texturable#1=false
```

*(914.4 cm ≈ 30 ft; 1219.2 cm ≈ 40 ft height.)*

---

## SPIKE-10 / SPIKE-11 starter content menus

### SPIKE-10 — suggest 12 plants

1. Live oak (deciduous tree)  
2. Red maple (deciduous tree)  
3. Eastern red cedar (evergreen tree)  
4. Ornamental pear (evergreen/deciduous accent)  
5. Boxwood hedge (shrub)  
6. Hydrangea mass (shrub)  
7. Juniper mound (shrub)  
8. Hosta / groundcover mass  
9. Liriope / edging groundcover  
10. Ornamental grass clump  
11. Perennial accent (e.g. lavender)  
12. Empty planter with generic planting (links to outdoor pack optional)  

### SPIKE-11 — suggest 12 outdoor features

1. Rectangular concrete patio unit  
2. Circular gravel area  
3. Wood deck plank module  
4. Teak bench  
5. Adirondack chair  
6. Picnic table  
7. Rectangular planter (empty)  
8. Round planter  
9. Fire pit (plan symbol)  
10. Stepping stone  
11. Simple fountain / birdbath  
12. Trash receptacle or utility box (minimal)  

Exact list can shrink to 8 if schedule requires; keep category coverage.

---

## References (code)

- `DefaultFurnitureCatalog.java` — property keys, catalog loading  
- `FurnitureLibraryFileRecorder.java` — `.sh3f` read/write  
- `HomeController.importFurnitureLibrary()` — import UX  
- `FileUserPreferences.addFurnitureLibrary()` — plugin folder install  

---

**SPIKE-09 exit:** This document satisfies the Block E schema deliverable. Proceed to **SPIKE-10** (plant pack authoring).
