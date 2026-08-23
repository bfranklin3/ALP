# SPIKE-27 — Plan Assembly Grouping

**Date:** August 23, 2026  
**Status:** **In progress** — Phase 1 shipped Aug 23, 2026  
**Branch:** `cursor/areas-inventory-and-level-locking`  
**Parent:** ALP architectural editing; builds on **[SPIKE-36](sweethome3d-spike-36-plan-z-order.md)** and **[SPIKE-37](sweethome3d-spike-37-plan-graphics-grouping.md)** (both shipped)

**Not the same as:**
- **[SPIKE-37](sweethome3d-spike-37-plan-graphics-grouping.md)** — site-plan graphics (polylines, plants, labels, areas)
- **Stock `HomeFurnitureGroup`** — furniture-catalog nesting only

---

## Goal

Select and move coherent **architectural assemblies** — walls + bound doors/windows + furniture — as one unit; ungroup when no longer needed.

---

## Locked decisions (Aug 23, 2026)

| Topic | Decision |
|-------|----------|
| **Phase 1 scope** | Selection helpers only (Option A) — no persistent assembly model yet |
| **Opening geometry** | `isParallelToWall(wall)` + `Area` intersection (same rule as room cutouts) |
| **Marquee** | Auto-include bound openings when marquee selects wall(s) |
| **Manual action** | **Include wall openings** in plan context menu |
| **Phase 2 scope** | `PlanAssembly` model + Group/Ungroup + XML persistence (Option B) |

---

## Implementation status

| Phase | Scope | Status |
|-------|-------|--------|
| 1 | Include wall openings + marquee auto-include | ✓ Shipped |
| 2 | `PlanAssembly` model + Group/Ungroup + XML | Pending |

---

## Phase 1 test plan

### Automated (JUnit)

- [x] Wall-only selection + **Include wall openings** adds parallel door on wall — `PlanControllerTest.testIncludeWallOpeningsInSelection()`
- [x] `canIncludeWallOpeningsInSelection()` false when all openings already selected

### Manual (dev app)

- [ ] Marquee around wall with doors/windows → openings included
- [ ] Partial selection + **Include wall openings** → openings added
- [ ] Move mixed wall + opening selection → openings stay aligned

---

## Phase 2 preview (not started)

- New `PlanAssembly` holding wall + furniture member IDs
- Group/Ungroup in Plan menu / context menu
- Select assembly → all members; move via existing `moveItems()`
- Persist `<planAssembly>` in home XML
