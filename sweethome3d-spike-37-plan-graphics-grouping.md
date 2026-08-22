# SPIKE-37 — Plan Graphics Grouping (Sketch)

**Date:** August 22, 2026  
**Status:** Spec sketch — pending review after SPIKE-36  
**Branch:** follow-on from `cursor/areas-inventory-and-level-locking` (or dedicated UI branch)  
**Parent:** ALP site-plan editing; builds on **[SPIKE-36](sweethome3d-spike-36-plan-z-order.md)** plan stack  
**Related:** `Home.java`, `PlanController.java`, `PlanComponent.java`, `HomePane.java`, `HomeXMLHandler.java`

**Not the same as:**
- **[SPIKE-27](ALP%20CAD%20%20Detailed%20Execution%20Plan.md#spike-27-plan-assembly-grouping-walls--openings--furniture)** — **Plan assembly** grouping for **walls + doors/windows + furniture** (building shells, wall endpoint graph, `PlanAssembly` model). See execution plan for Options A–B.
- **Stock `HomeFurnitureGroup`** — furniture-catalog nesting only; does not include polylines, labels, or areas.
- **Level tabs** — organizational visibility groups, not user-defined object groups.

---

## Goal (sketch)

Let users **group** mixed plan graphics — polylines, plants, labels, areas — so they **select and move as one unit**, then **ungroup** when done. Grouping is for **site-plan annotation**, not architectural BIM-style assemblies.

**Example:** Property line + setback polyline + callout label + hatch area → one group → move as a set during layout.

---

## Problem

Today:

- **Multi-select + drag** already moves mixed selection together, but there is **no persistent group**.
- Selection is lost after click-away; re-selecting a coherent set is manual (marquee / shift-click).
- **Group/Ungroup** in the plan menu only applies to **two or more top-level furniture pieces** (`FurnitureController.groupSelectedFurniture()`).

There is no plan-level group for **polyline + plant + label + area**.

---

## Why after SPIKE-36 (Z-order first)

| Z-order first (SPIKE-36) | Grouping first |
|--------------------------|----------------|
| Establishes **`planDrawOrder`** — natural home for “group as one stack entry” | Overlap problems remain until Z-order exists |
| ~5–7 days, self-contained | Group + overlap fixes = two large refactors |
| Group → **one ID** in draw list (or contiguous block) | Ad-hoc per-type order fights cross-type overlap |

**Recommendation:** Ship **SPIKE-36**, then **SPIKE-37**.

---

## Proposed direction (sketch — not locked)

### Model: `PlanGraphicsGroup` (name TBD)

Lightweight object on `Home`:

```text
PlanGraphicsGroup
  id
  name (optional — for Context deck / layer items?)
  memberIds: [room-id, polyline-id, piece-id, label-id, ...]
```

- **Not** a `HomePieceOfFurniture` subclass (unlike `HomeFurnitureGroup`).
- Members **remain** in their native collections (`home.getRooms()`, `getPolylines()`, etc.).
- Group record is **metadata + membership list** only.

### Selection

- Click any member → select **whole group** (or: first click selects group bounding box — TBD).
- Marquee intersecting any member → include full group (optional v2).

### Transform

- Move group → `PlanController.moveItems()` on all members (existing path).
- Rotate group as unit → **out of scope v1 sketch** (complex for polylines/areas).

### Z-order (with SPIKE-36)

**Option A (preferred):** Group occupies **one slot** in `planDrawOrder`; internal member order unchanged; painting group iterates members in their relative stack order.

**Option B:** Contiguous block of member IDs in `planDrawOrder`; **Bring group to front** moves the block.

### UI (sketch)

| Surface | v1 sketch |
|---------|-----------|
| Plan context menu | **Group** / **Ungroup** (near Arrange from SPIKE-36) |
| Plan menu | Duplicate Group/Ungroup when plan graphics selected |
| Furniture-only Group | Unchanged for pure furniture multi-select |

Enable **Group** when ≥2 **stackable** movables selected (same types as SPIKE-36), no wall members.

### Persistence

```xml
<planGraphicsGroup id='g1' name='Property line set'>
  <member ref='polyline-1'/>
  <member ref='label-4'/>
  <member ref='room-2'/>
</planGraphicsGroup>
```

Legacy files: no groups → behavior unchanged.

---

## Scope sketch

### In scope (candidate v1)

- Group / Ungroup for: **polylines, plants, labels, areas**
- Move group as unit (translate)
- Delete group → delete all members (or delete group wrapper only — **TBD**)
- Save/reopen persistence
- Undo/redo

### Out of scope (initial)

- Nested groups
- Wall / dimension line members (**SPIKE-27** domain)
- Rotate / scale group as unit
- 3D treated as one object
- Group listed as pseudo-item in Context deck (nice-to-have)
- Copy/paste group as unit (candidate v1.1)

---

## Comparison table — three “grouping” concepts

| | **SPIKE-36** Z-order | **SPIKE-37** Plan graphics group | **SPIKE-27** Plan assembly |
|--|----------------------|----------------------------------|----------------------------|
| **User question** | “What’s on top?” | “Move these together again” | “This building shell is one thing” |
| **Members** | Individual objects | Polylines, plants, labels, areas | Walls, doors/windows, furniture |
| **Persistence** | Ordered ID list | Group + member IDs | `PlanAssembly` |
| **Move** | N/A (order only) | Translate members together | Translate + wall graph rules |
| **Effort** | ~5–7 d | ~3–5 d (estimate) | ~1–2 weeks (Phase 2) |
| **Depends on** | — | SPIKE-36 | Optional Phase 1 selection helpers |

---

## Open questions (for full spec)

1. **Click behavior** — select whole group on first click, or require double-click / modifier to enter group?
2. **Delete group** — delete members vs dissolve only?
3. **Group + Z-order** — one stack slot vs contiguous block (see SPIKE-36 integration).
4. **Mixed furniture + polyline** — allow plant inside plan graphics group while also in `HomeFurnitureGroup`? (Recommend: **no** — mutual exclusion.)
5. **Cross-layer groups** — allow members on different levels in one group? (Sketch: **yes**, if all visible; move translates all.)
6. **Inspector** — show group name / member count in Context deck?

---

## Likely files (when promoted from sketch)

| File | Change |
|------|--------|
| **New `PlanGraphicsGroup.java`** | Model |
| **`Home.java`** | Group list; membership helpers |
| **`PlanController.java`** | Group/ungroup, selection expansion, move |
| **`PlanComponent.java`** | Optional group bounds feedback |
| **`HomePane.java`** | Menu actions |
| **`HomeXMLHandler.java`** / exporter | Persistence |
| **`SelectionInspectorPane.java`** *(optional)* | Group summary |

---

## Effort estimate (rough)

| Phase | Estimate |
|-------|----------|
| Model + XML | ~1 d |
| Group/ungroup + selection + move + undo | ~2 d |
| UI + integration with SPIKE-36 stack | ~1 d |
| QA | ~0.5 d |
| **Total** | **~3–5 days** (after SPIKE-36) |

---

## Dependencies

| Relation | Notes |
|----------|-------|
| **Requires SPIKE-36** | Shared `planDrawOrder` + split area fill / wall blocks / dimensions in stack — see [SPIKE-36](sweethome3d-spike-36-plan-z-order.md) (locked Aug 22, 2026) |
| **Parallel SPIKE-27** | Different feature; do not merge models |
| **Composes with SPIKE-25** | Layer pick rules apply to group members |

---

## Next steps

1. Complete **SPIKE-36**.
2. Review this sketch; lock open questions.
3. Promote to full spike spec (same structure as SPIKE-35/36).
4. Implement → mark **SHIPPED**.
