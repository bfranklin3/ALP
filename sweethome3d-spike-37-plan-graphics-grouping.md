# SPIKE-37 — Plan Graphics Grouping

**Date:** August 22, 2026  
**Status:** **In progress** — Phase 1–3 implemented Aug 23, 2026  
**Branch:** `cursor/areas-inventory-and-level-locking`  
**Parent:** ALP site-plan editing; builds on **[SPIKE-36](sweethome3d-spike-36-plan-z-order.md)** (shipped)  
**Related:** `PlanGraphicsGroup.java`, `Home.java`, `PlanController.java`, `HomePane.java`, `HomeXMLHandler.java`

**Not the same as:**
- **[SPIKE-27](ALP%20CAD%20%20Detailed%20Execution%20Plan.md#spike-27-plan-assembly-grouping-walls--openings--furniture)** — architectural assemblies
- **Stock `HomeFurnitureGroup`** — furniture-catalog nesting only
- **Level tabs** — organizational visibility, not user groups

---

## Goal

Group mixed plan graphics — **polylines, plants, labels, areas** — so users **select and move as one unit**, then ungroup when done.

---

## Locked decisions (Aug 23, 2026)

| Topic | Decision |
|-------|----------|
| **Members** | Room, Polyline, HomePieceOfFurniture (top-level plants), Label |
| **Excluded** | Walls, dimension lines, compass, camera, nested `HomeFurnitureGroup` members |
| **Furniture-only multi-select** | Keep existing **Group furniture** (`HomeFurnitureGroup`); use **Group graphics** for mixed/non-furniture stackables |
| **Click behavior** | Click any member → select **whole group** |
| **Shift-toggle** | Toggle whole group together |
| **Move** | Existing `moveItems()` on all members |
| **Z-order** | **Option B:** contiguous block in `planDrawOrder`; Arrange moves selected refs as block (SPIKE-36) |
| **Delete member** | Remove from group; dissolve group if &lt; 2 members remain |
| **Cross-layer** | **Yes** — members may span levels |
| **Persistence** | `<planGraphicsGroup>` + `<member ref="..."/>` in home XML |
| **Undo/redo** | Group/ungroup restores groups list + plan draw order + selection |

---

## Implementation status

| Phase | Scope | Status |
|-------|-------|--------|
| 1 | `PlanGraphicsGroup` model + `Home` + XML + test | Done |
| 2 | Group/ungroup + selection expansion + undo | Done |
| 3 | Plan context menu + enable logic | Done |
| 4 | QA + mark **SHIPPED** | Pending |

---

## Test plan

- [ ] Group polyline + label + area → move together; click one member selects all
- [ ] Ungroup restores independent selection
- [ ] Arrange on grouped selection moves contiguous block
- [ ] Save/reopen preserves `<planGraphicsGroup>`
- [ ] `HomeFileRecorderTest.testPlanGraphicsGroupRoundTrip()`
- [ ] Undo/redo group and ungroup
- [ ] Pure furniture multi-select still uses furniture Group, not Group graphics

---

## Out of scope (v1)

- Nested groups, rotate/scale as unit, wall/dimension members
- Copy/paste group as unit (v1.1)
- Context deck group listing
