# SPIKE-40A — Plant Metadata Implementation

**Date:** August 27, 2026  
**Status:** Shipped — pending QA  
**Parent:** [SPIKE-40](sweethome3d-spike-40-plant-symbol-metadata-schema.md)  
**Path:** A (40A → 38A → 45A → 42 polish) — 38A shipped, pending QA

---

## Goal

Encode SPIKE-40 plant metadata in ALP catalog entries and expose a Java API so area fill (38A), schedules, and authoring (45A) read behavior from data—not hard-coded guesses.

---

## Delivered

### Java API

- `AlpPlantMetadata.java` — reads `alp.plant.*` custom properties from placed furniture
- `AlpPlantMetadata.fromPiece(HomePieceOfFurniture)` — full metadata record with defaults
- `AlpPlantMetadata.getScheduleName(HomePieceOfFurniture)` — used by plant schedule takeoff
- `AlpPlantUtils.buildSchedule(...)` — schedule **Name** column uses `alp.plant.scheduleName`

### Catalog encoding (ALP Plants v1.0.6)

Custom properties per piece in `PluginFurnitureCatalog.properties`:

| Property | Example | Purpose |
|----------|---------|---------|
| `alp.plant.assetType#N` | `png` | Asset format |
| `alp.plant.supportsTint#N` | `true` | Layered wash tinting (SPIKE-28) |
| `alp.plant.isSymmetrical#N` | `true` / `false` | Rotation visual impact |
| `alp.plant.supportsRandomRotation#N` | `true` / `false` | Area-fill rotation rule |
| `alp.plant.supportsRandomScale#N` | `true` / `false` | Area-fill size variation |
| `alp.plant.defaultSpacing#N` | `114.3` | Recommended spacing (cm) |
| `alp.plant.scheduleName#N` | `Hydrangea` | Shorter schedule label |

Standard SH3D fields still carry `id`, `width`, `depth`, `name`, `planIconFill`, etc.

### Build pipeline

- `scripts/build-alp-plants-library.sh` emits metadata for all 12 plants
- Library version **1.0.6**

---

## Defaults when properties absent

| Field | Default |
|-------|---------|
| `assetType` | `png` |
| `supportsTint` | `piece.hasPlanIconFill()` |
| `isSymmetrical` | `true` |
| `supportsRandomRotation` | same as `isSymmetrical` |
| `supportsRandomScale` | `true` |
| `defaultSpacing` | `min(width, depth) × 0.65` cm |
| `scheduleName` | piece name |

---

## Manual QA

1. Rebuild library: `./scripts/build-alp-plants-library.sh`
2. Re-import **ALP-Plants-1.0.0** v1.0.6
3. Place **Hydrangea** and **Boxwood Hedge** on a proposed planting layer
4. Open **Context → Plants** schedule — **Name** shows `Hydrangea` / `Boxwood Hedge` (not full furniture name with size suffix if different)
5. Delete and re-place after re-import — custom properties present on new instances

---

## Next: SPIKE-38A

Shipped — see [38A doc](sweethome3d-spike-38a-plant-area-scatter-mvp.md).

---

## Path A roadmap

| Step | Spike | Status |
|------|-------|--------|
| 1 | **40A** Metadata | Shipped (pending QA) |
| 2 | **38A** Area scatter MVP | Shipped (pending QA) |
| 3 | **45A** Duplicate plant type | Next |
| 4 | **42** Inspector remainder | Incremental |
