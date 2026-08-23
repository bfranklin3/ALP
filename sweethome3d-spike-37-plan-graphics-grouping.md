# SPIKE-37 — Plan Graphics Grouping

**Date:** August 22, 2026  
**Status:** **Shipped** — Aug 23, 2026 (Phases 1–4 complete)  
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
| 1 | `PlanGraphicsGroup` model + `Home` + XML + test | ✓ Shipped |
| 2 | Group/ungroup + selection expansion + undo | ✓ Shipped |
| 3 | Plan context menu + enable logic | ✓ Shipped |
| 4 | QA + mark **SHIPPED** | ✓ Shipped |

---

## Phase 4 QA notes (Aug 23, 2026)

- **Automated tests:** `HomeFileRecorderTest.testPlanGraphicsGroupRoundTrip()`, `testPlanGraphicsGroupDrawOrderBlock()`, `testPlanGraphicsGroupMemberRemovalDissolvesGroup()`, `testPlanGraphicsGroupMemberLookup()`.
- **Build:** Dev app compiles via `./scripts/update-dev-app.sh`.
- **Manual QA:** group/ungroup, click-to-select-whole-group, move-as-unit, Arrange on grouped selection, save/reopen, undo/redo — verify in dev app before release.

---

## Test plan

### Automated (JUnit)

- [x] Save/reopen preserves `<planGraphicsGroup>` — `testPlanGraphicsGroupRoundTrip()`
- [x] Draw-order block consolidation — `testPlanGraphicsGroupDrawOrderBlock()`
- [x] Member removal dissolves small groups — `testPlanGraphicsGroupMemberRemovalDissolvesGroup()`
- [x] Member lookup — `testPlanGraphicsGroupMemberLookup()`

### Manual (dev app)

- [ ] Group polyline + label + area → move together; click one member selects all
- [ ] Ungroup restores independent selection
- [ ] Arrange on grouped selection moves contiguous block
- [ ] Undo/redo group and ungroup
- [ ] Pure furniture multi-select still uses furniture Group, not Group graphics

---

## Out of scope (v1)

- Nested groups, rotate/scale as unit, wall/dimension members
- Copy/paste group as unit (v1.1)
- Context deck group listing

---

## Next steps

1. ~~Complete SPIKE-36~~ ✓
2. ~~Lock spec and implement Phases 1–4~~ ✓ Aug 23, 2026
3. Mark **SHIPPED** in execution plan ✓ Aug 23, 2026
