# SPIKE-23 — Phase 1 Branding & Terminology Scope

**Date:** September 18, 2026  
**Status:** Phase 1 shipped (23A + 23B)  
**Branch:** `cursor/areas-inventory-and-level-locking`  
**Parent:** ALP CAD Detailed Execution Plan — branding / stock vs. ALP audit  
**Related:** `package.properties`, `SelectionInspectorPane.java`, `scripts/update-dev-app.sh`, SPIKE-33 (fill terminology deferrals)

---

## Goal

Replace user-visible Sweet Home 3D interior vocabulary with ALP landscape terminology and rebrand the desktop shell to **ALP CAD**, without renaming Java classes, XML attributes, or `.sh3f` library format.

---

## Locked decisions (Sep 18, 2026)

| # | Topic | Decision |
|---|-------|----------|
| 1 | Umbrella term for catalog/placed items | **Objects** (replaces user-facing “Furniture”) |
| 2 | Product name | **ALP CAD** |
| 3 | Library import wording | **Import object library** |
| 4 | Inspector summary titles (Option A) | **Hardscape — {name}** for `alp-hrd-*` pieces; **Plant — {name}** unchanged; generic non-plant → **Object — {name}** |
| 5 | Help HTML | **Defer** — no Phase 1 help body rewrite; shell strings (About, quit, file dialogs) updated in 23B |

---

## Phase 1 checklist (shipped)

### SPIKE-23A — Terminology (English only)

- [x] `swing/package.properties` — Objects menu/tab, import/modify/group/align strings, object library file filter, inspector summary strings
- [x] `viewcontroller/package.properties` — object library import messages, object texture/materials titles, import wizard titles
- [x] `SelectionInspectorPane.java` — hardscape branch in `updateSelectionSummary()` via `AlpHardscapeCatalogUtils.isHardscape()`
- [x] New string `summarySingleHardscapeNamed.title=Hardscape \u2014 {0}`

### SPIKE-23B — ALP CAD brand shell

- [x] `com/eteks/sweethome3d/package.properties` — `SweetHome3D.applicationName=ALP CAD`, 3D error messages
- [x] `swing/package.properties` — About, quit, print job name, file dialog descriptions, export header attribution
- [x] `scripts/update-dev-app.sh` — bundle path **ALP CAD Dev.app** with migration from `Sweet Home 3D Dev.app`
- [x] `.cursor.local` — dev app path updated

---

## Explicitly out of scope (Phase 1)

| Item | Reason |
|------|--------|
| Java class renames (`HomePieceOfFurniture`, `FurnitureController`, …) | Internal API / XML compatibility |
| XML attribute names (`floorColor`, furniture elements) | File format stability |
| Non-English `package_*.properties` | Separate localization pass |
| Help HTML under `viewcontroller/resources/help/` | Deferred per decision #5 |
| Preferences “Floor color or texture”, status bar “Floor %s” | SPIKE-33 / later pass (different concept from object rename) |
| SPIKE-23C menu hide/keep audit | Optional follow-on doc section only |
| Production `.app` / installer bundle (non-Dev) | Future release packaging |

---

## Inspector title matrix (Option A)

| Selection | Inspector summary title |
|-----------|-------------------------|
| Single plant (`AlpPlantUtils.isPlant`) | Plant — {displayName} |
| Single hardscape (`AlpHardscapeCatalogUtils.isHardscape`) | Hardscape — {name} |
| Single other object | Object — {name} or **Object** if unnamed |
| Multiple objects | {n} objects |

---

## QA smoke test

1. Launch **ALP CAD Dev.app** — menu bar shows **ALP CAD**; About dialog title **About ALP CAD**.
2. Left inventory tab reads **Objects**; menu **Objects → Import object library…**.
3. Select a plant → inspector header **Plant — …**; hardscape paver → **Hardscape — …**; generic symbol → **Object — …**.
4. File open/save dialog description shows **ALP CAD** (not Sweet Home 3D).
5. Help menu still opens legacy help content (expected — body deferred).

---

## Follow-on (not Phase 1)

- **SPIKE-23C** — audit which stock SH3D menus/items to hide vs. keep for landscape workflow
- **Localization** — propagate English string changes to `package_fr.properties`, etc.
- **Help rewrite** — replace SH3D help with ALP CAD landscape docs
- **Release bundle** — rename production app, icons, DMG/installer
