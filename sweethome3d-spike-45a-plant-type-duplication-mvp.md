# Sweet Home 3D SPIKE-45A: Plant Type Duplication MVP

## Goal

Prove template-based duplication of an ALP catalog plant into a user-owned reusable plant type that survives app restart.

## Scope (MVP)

- Right-click an ALP plant in the **Library** catalog → **Duplicate plant type...**
- Edit display name, schedule name, default width, and default depth
- Save as a modifiable entry under **ALP User Plants**
- Copy inherits plan line/fill icons, 3D placeholder model, and `alp.plant.*` metadata from the source
- New catalog IDs use the `alp-usr-` prefix

## Out of scope

- Symbol package swap / SVG import
- Full plant type editor wizard
- Packaging user plants into a distributable `.sh3f` library

## Key files

| File | Role |
|------|------|
| `model/AlpPlantCatalogUtils.java` | Duplicate logic, category helper, ID generation |
| `model/CatalogPieceOfFurniture.java` | `createModifiableCopy`, `createModifiableFromPersistence` |
| `swing/AlpDuplicatePlantTypeDialog.java` | Name / schedule / size dialog |
| `io/FileUserPreferences.java` | Persists plan icon + extra properties for modifiable pieces |
| `viewcontroller/HomeController.java` | `getSingleSelectedCatalogPlant`, `addDuplicateCatalogPlantType` |
| `swing/HomePane.java` | Catalog context menu item |
| `model/AlpPlantUtils.java` | `USER_PLANT_CATALOG_ID_PREFIX`, `isPlant` recognizes user plants |

## Where to find it

**Library (recommended):** In the left **Library** panel, right-click directly on an ALP plant name (e.g. Live Oak). The menu selects that plant under the cursor, then shows **Duplicate plant type...** along with other catalog actions.

**Menu bar:** **Furniture → Duplicate plant type...** when one ALP library plant is selected, or one placed ALP plant is selected on the plan.

**Plan:** Right-click a **placed** ALP plant on the drawing → **Duplicate plant type...** (uses the plant's library template).

Duplicate creates a new entry under **ALP User Plants**; it does not copy a placed instance on the plan.

## QA steps

1. Rebuild dev app: `./scripts/update-dev-app.sh`
2. Import **ALP Plants** library if not already loaded
3. In Library, select one ALP plant (e.g. Live Oak)
4. Right-click → **Duplicate plant type...**
5. Change name to `My Test Oak`, schedule name to `Test Oak`, adjust width/depth → OK
6. Verify new entry appears under **ALP User Plants**
7. Place the duplicate on a proposed planting layer; confirm plan symbol renders
8. Context → Plants schedule shows the custom schedule name
9. Quit and relaunch app; confirm duplicate still appears in **ALP User Plants**
10. Use duplicate in **Fill area with plants...** (38A) to confirm scatter works

## Status

Implemented — pending QA pass.
