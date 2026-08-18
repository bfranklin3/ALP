In Sweet Home 3D and ALP CAD, plants are not a separate object type. They are furniture catalog entries — the same mechanism as chairs, trees, or outdoor benches. A “plant library” is a furniture library (`.sh3f`) whose entries are categorized and drawn for landscape use. That’s good news: the import/install pipeline already exists; the work is mostly content authoring plus ALP conventions (Block E / SPIKE-09–10).

------

## How libraries work in SH3D / ALP CAD

### Catalog layers

The app builds the furniture catalog from several sources (`DefaultFurnitureCatalog.java`):

1. Built-in stock catalog — `DefaultFurnitureCatalog_*.properties` on the classpath (includes one generic “Plant”).
2. Contributed / additional catalogs — optional bundled extensions.
3. Imported `.sh3f` libraries — user-installed plugins loaded from the app’s furniture plugin folder (`~/Library/Application Support/Sweet Home 3D/furniture/` on Mac; ALP Dev may use a similar path under its app name).

Import flow: Furniture → Import furniture library… (or double-click a `.sh3f` file) → file is copied to the plugin folder → catalog reloads.

### What a `.sh3f` file actually is

A ZIP archive, not a binary format. At minimum it contains:

- `PluginFurnitureCatalog.properties` — library metadata (`id`, `name`, `description`, `version`, `license`, `provider`) plus one numbered block per piece (`name#1`, `width#1`, `category#1`, `model#1`, `icon#1`, etc.).
- Optional localized files — `PluginFurnitureCatalog_en.properties`, etc.
- Embedded assets — 3D models (OBJ, DAE/Collada, 3DS, KMZ…), catalog icons, and optionally plan icons (2D top-view symbols).

The reader treats it like any other plugin catalog bundle (`DefaultFurnitureCatalog.readPluginFurnitureCatalog`).

### Properties file encoding — **critical (Aug 2026)**

`PluginFurnitureCatalog.properties` inside a `.sh3f` is **not UTF-8**. Sweet Home 3D loads it with `PropertyResourceBundle` on an input stream → **ISO-8859-1 (Latin-1)** only.

- **Symptom:** Import success message + library listed in About → Libraries, but **no new furniture catalog folder** (pieces never load).
- **Fix:** ASCII-only property values (use `-` not em dash `—`), write file as ISO-8859-1, or `\uXXXX` escapes. Match stock `Trees.sh3f`.
- **Asset paths:** use leading slash: `/icons/foo.png`, `/plan-icons/foo.png`.
- **Categories:** flat strings only — `ALP Plants` is one folder; `ALP › Plants › Trees` is **not** a nested tree.

See [alp-phase-1-library-schema.md](alp-phase-1-library-schema.md) for full rules. The repo build script `scripts/build-alp-plants-library.sh` implements them.

### Draft vs Presentation plan icons (ALP-only — SPIKE-12b)

For professional site plans, ALP libraries should ship **two** PNGs per symbol:

| Asset folder | Property | Shown when |
|--------------|----------|------------|
| `plan-icons/` | `planIcon#N` | **Presentation** mode (color watercolor) |
| `plan-icons-line/` | `planIconLine#N\:CONTENT` | **Draft** mode (black line art, ⌘⇧D) |

**Critical:** the Draft property key must use an **escaped colon**: `planIconLine#1\:CONTENT=/plan-icons-line/foo.png`. Without `\`, Java parses the line incorrectly and Draft silently falls back to the color icon (see schema doc for full troubleshooting).

**App settings:** Sweet Home 3D → **Settings…** → **Furniture icons in plan: Top view**.

**After updating a library:** re-import → restart Dev app → **delete and re-drag** pieces (existing placed furniture does not gain new catalog properties).

**Engine:** ALP-Core `PlanComponent` (Aug 2026); stock SH3D ignores `planIconLine`.

------

## What each plant entry needs

Per piece, the catalog expects (among others):

| Field                                            | Purpose for plants                                        |
| :----------------------------------------------- | :-------------------------------------------------------- |
| `name#N`                                         | Display name ("Live Oak - 30 ft spread") — **ASCII in .properties** |
| `id#N`                                           | Stable ID (important for updates; duplicates are skipped) |
| `category#N`                                     | **Flat** catalog folder name (e.g. `ALP Plants`) |
| `width#N`, `depth#N`, `height#N`                 | Size in cm internally (UI shows ft/in per prefs)          |
| `model#N`                                        | 3D model file (embedded in ZIP or URL)                    |
| `icon#N`                                         | Catalog thumbnail                                         |
| `planIcon#N`                                     | 2D plan symbol — **Presentation** (color)                 |
| `planIconLine#N\:CONTENT`                        | 2D plan symbol — **Draft** (line art); **escape `\:`**   |
| `movable#N`                                      | Usually `true` for plants                                 |
| `resizable#N`                                    | Often `true` (same symbol, different sizes)               |
| `doorOrWindow#N`                                 | `false` for plants                                        |
| Optional: `tags#N`, `description#N`, `creator#N` | Search and attribution                                    |

Stock “Plant” (#11 in `DefaultFurnitureCatalog_en_US.properties`) is minimal — name and dimensions only; most metadata and assets live in separate resource files for the built-in catalog. Custom libraries should be more explicit (IDs, categories, plan icons).

------

## Ways to create a plant library

### Option 1 — Furniture Library Editor (recommended starting point)

Official SH3D tool ([plugins page](https://www.sweethome3d.com/plugins/)) — source is in your repo under `code-extract/.../FurnitureLibraryEditor/`.

Workflow:

1. Create or obtain 3D models (Blender → OBJ/DAE is common).
2. Open Furniture Library Editor → drop models in.
3. Set name, category, dimensions, movability, icons.
4. Save as offline `.sh3f` (embeds models in the ZIP — best for sharing).
5. Import into ALP CAD Dev and test in catalog + plan view.

Pros: No hand-editing ZIP/properties; handles embedding and digests.
Cons: Advanced fields (custom plan icons, light sources, etc.) may need manual edits to `PluginFurnitureCatalog.properties` inside the ZIP.

### Option 2 — Hand-built `.sh3f`

Edit `PluginFurnitureCatalog.properties` and zip assets yourself (same structure the editor writes).

Pros: Full control; good for plan-icon-first symbols with simple or dummy 3D.
Cons: Error-prone; you must match SH3D property naming exactly.

### Option 3 — Start from community libraries

Many free `.sh3f` libraries exist (SH3D downloads, forums). You can import, then merge/rebrand in Furniture Library Editor or fork the ZIP.

Pros: Fast starter set.
Cons: License audit required; quality varies; plan symbols often weak for professional site plans.

### Option 4 — Plan-first symbols (ALP landscape priority)

For site plans, 2D top-view quality often matters more than 3D (ties to SPIKE-12):

- Author plan icons (PNG/SVG → PNG) as circles/canopies, shrub masses, groundcover hatches.
- Provide **paired** Presentation (`plan-icons/`) and Draft (`plan-icons-line/`) PNGs; wire with `planIcon#N` and `planIconLine#N\:CONTENT` (see schema doc).
- Use a simple 3D placeholder or lightweight mesh for 3D view.
- Test at multiple zoom levels in **both** Draft and Presentation modes.

This is likely how an ALP plant pack will look “clearly better than stock” without huge 3D assets.

------

## Using libraries in ALP CAD today

No code changes required for basic use:

1. Build or obtain `ALP-Plants-v1.sh3f`.
2. Furniture → Import furniture library… in Sweet Home 3D Dev.
3. Browse by category in the furniture catalog; drag onto plan.
4. Assign to Plants level (once your level template exists).

To ship libraries with ALP (SPIKE-10 deliverable), you’d either:

- Pre-install `.sh3f` files in the app’s `furniture` plugin folder in the `.app` bundle, or
- Document a one-time import path, or
- Add a small ALP default that copies bundled libraries on first launch (optional code spike).

------

## What’s involved end-to-end (practical checklist)

A. Schema & naming (SPIKE-09)

- Category tree: e.g. `ALP Plants / Trees / Deciduous`, `Shrubs`, `Groundcover`, `Perennials`.
- ID convention: `alp-plt-oak-24`, human title separate.
- Default dimensions (typical mature spread / height).
- Plan vs 3D expectations per category.

B. Asset production

- 8–15 symbols for starter pack (per execution plan).
- Plan icons (priority).
- 3D models (lightweight; reuse one mesh with scale/color for variants).
- Optional: texture files for groundcover-style flats.

C. Library assembly

- Furniture Library Editor → offline `.sh3f`.
- Library-level metadata (provider: ALP, license, version).
- Verify unique IDs across all ALP libraries.

D. Validation in ALP CAD

- Import; catalog browse and search.
- Place on plan; rotate; resize if allowed.
- Level assignment + furniture inventory column.
- Draft mode + zoom levels for plan readability.
- Save/reopen `.sh3d` — placed instances reference catalog by ID.

E. Distribution

- Versioned file: `ALP-Plants-1.0.0.sh3f`.
- Changelog when IDs or dimensions change (existing homes may keep old sizes).

------

## Effort and tradeoffs

| Approach                            | Effort            | Best for                |
| :---------------------------------- | :---------------- | :---------------------- |
| Curate + tweak existing `.sh3f`     | Low               | Quick breadth           |
| Plan-icon-first custom pack         | Medium            | Landscape site plans    |
| Full custom 3D botanical set        | High              | Marketing 3D renders    |
| SPIKE-09 schema doc                 | ~0.5–1 day        | Aligns all future packs |
| SPIKE-10 starter pack (8–15 plants) | ~3–7 days content | Depends on art source   |

Main risks:

- Plan symbol quality — stock and many community libraries look indoor/generic in 2D.
- File size — heavy 3D trees bloat libraries; prefer simplified meshes (forum threads on “simple tree” libraries are relevant).
- Units — catalog dimensions are cm; caliper/spread in feet must be converted when authoring.
- Licensing — document for every model/icon if you redistribute.



------

## Recommended production workflow

### 1. Create in vector (master files)

Use Inkscape (free), Illustrator, or Figma with:

- Square artboard — e.g. 1024×1024 or 2048×2048 pt
- Symbol centered with ~10–15% transparent margin on all sides (fixes cut-off)
- Two masters per plant (or two layers exported separately):
  - Line — black strokes only, transparent background (Draft)
  - Color — watercolor fill + black lines, or fill layer + line layer (Presentation)

Keep vector masters in repo, e.g. `source/symbols/live-oak/live-oak-line.svg`.

### 2. Export to PNG for the library

| Asset     | Folder             | Catalog property                             |
| :-------- | :----------------- | :------------------------------------------- |
| Color     | `plan-icons/`      | `planIcon#N`                                 |
| Line      | `plan-icons-line/` | `planIconLine#N\:CONTENT`                    |
| Thumbnail | `icons/`           | `icon#N` (128×128; can downscale from color) |

PNG settings:

- Format: PNG-24 with alpha
- Not JPEG — no transparency
- Same pixel size for line and color pairs (e.g. both 2048×2048)
- Square canvas, symbol centered
- Sufficient resolution — see below

Skip the sprite sheet for production art. One symbol → one file avoids grid misalignment and edge clipping.

### 3. Target resolution

Rough rule:
`source pixels ÷ footprint (cm)` = detail when the icon fills the footprint.

| Canvas size   | Live Oak 914 cm footprint | Quality                         |
| :------------ | :------------------------ | :------------------------------ |
| 97×97 (today) | ~0.1 px/cm                | Poor — heavy upscale            |
| 512×512       | ~0.6 px/cm                | Better, still soft when zoomed  |
| 1024×1024     | ~1.1 px/cm                | Minimum for production          |
| 2048×2048     | ~2.2 px/cm                | Recommended default             |
| 4096×4096     | ~4.5 px/cm                | Large-format print / heavy zoom |

Practical default: 2048×2048 for trees and large shrubs; 1024×1024 is fine for small groundcover (Liriope, hosta).

File size stays reasonable: transparent PNGs compress well; a 12-piece library at 2048² is usually a few MB, not hundreds.

------

## Vector vs high-res PNG — when each wins

### Vector (SVG/AI) — use for creating

Pros: Infinite editing; crisp lines; easy centering; separate line/fill layers; no watermark; no grid guessing.
Cons: Not loaded directly by SH3D as `planIcon`.

### High-res PNG — use for catalog delivery

Pros: Works today; no engine changes; predictable in Draft and Presentation.
Cons: Fixed resolution — export high enough once; re-export if you change art.

Do not rely on the engine to sharpen upscaled bitmaps — scaling is linear stretch, not vector re-render.

------

## Fixing the two problems you see

| Problem           | Cause                                          | Fix with clean art                                      |
| :---------------- | :--------------------------------------------- | :------------------------------------------------------ |
| Pixelated / rough | ~80–97 px sources upscaled to large footprints | Export 1024–2048 px square PNGs                         |
| Edges cut off     | Sprite sheet grid + trim ate edge pixels       | Individual symbols, centered with margin; no sheet crop |

Watermark and muddy color are also reasons to replace the Dreamstime sheet, not to patch the split script forever.

------

## Suggested spec for SPIKE-11 / art refresh

Per symbol:

  live-oak-line.svg          # master

  live-oak-color.svg         # master (or layered export)

  plan-icons/live-oak.png    # 2048×2048 RGBA

  plan-icons-line/live-oak.png  # 2048×2048 RGBA (black on transparent)

  icons/live-oak.png         # 128×128 thumbnail

Line export tips: Black `#000000` on transparent; consistent stroke weight; moderate anti-aliasing is OK (your line PNGs already use gray edge pixels).

Color export tips: Soft watercolor edges are fine; keep full wash inside the margin so nothing touches the canvas edge.

------

## Optional later: true vector on plan

That would mean engine work — render SVG at paint time instead of scaling a bitmap (SPIKE-28 / custom `planIcon` loader). Worth it only if you need infinite zoom or very large print sets. For Phase 1, 2048 px PNG from vector masters is the right balance of quality, effort, and compatibility.

------

## Summary

1. Create in vector (SVG/AI) — best authoring format.
2. Ship as high-res PNG (1024 minimum, 2048 recommended) — only format the library loads for plan icons.
3. One file per symbol, centered with padding — fixes cut-off.
4. Paired line + color exports at the same size — keeps Draft/Presentation aligned.

If you want to proceed next, we can add a `source/symbols/` layout and export checklist to the schema, or update the build script to consume individual PNGs instead of the sprite sheet.
