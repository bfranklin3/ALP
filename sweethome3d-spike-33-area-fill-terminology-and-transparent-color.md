# SPIKE-33 — Area Fill Terminology + Transparent Fill/Outline Color

**Date:** August 21, 2026  
**Status:** Phase 3 shipped — SPIKE-33 complete  
**Branch:** follow-on from `cursor/areas-inventory-and-level-locking` (or dedicated UI branch)  
**Parent:** SPIKE-19 / SPIKE-21 (right inspector); SPIKE-32 (area fill texture inspector)  
**Feeds into:** **SPIKE-23** (Phase 1 stock vs. branded naming audit — record ALP terminology deltas)  
**Related:** `SelectionInspectorPane.java`, `RoomPanel.java`, `ColorButton.java`, `PlanComponent.java`, `RoomController.java`, `package.properties`

---

## Goal

Three related polish items for **area (room) fill** in the docked **Inspector** and matching **Modify area** dialog:

1. **Rename section label** — Inspector titled section **“Floor”** → **“Fill”** (areas are site fills, not interior floors).
2. **Rename fill color dialog** — Modal title **“Floor color”** → **“Fill color”**.
3. **Transparent / none color** — Add a **None** swatch (white square, red diagonal — standard CAD convention) to **Fill color** and **Outline color** pickers so users can explicitly choose **no fill** or **no outline**.

SPIKE-32 already renamed the texture popup to **“Fill texture”** and added library/category filters. This spike completes the **terminology** alignment and adds **explicit transparent color** for fill and outline.

---

## Problem

### Terminology mismatch

The docked inspector still labels the area fill section **“Floor”** and the color modal **“Floor color”**, inherited from Sweet Home 3D interior-floor vocabulary. ALP uses **areas** for lawn, gravel, paving, hardscape, and building footprints — **“Fill”** matches user mental model and SPIKE-32’s **“Fill texture”** naming.

Without documenting this rename, **SPIKE-23** (stock vs. branded scope audit) may miss it and future work could reintroduce “Floor” in user-visible strings.

### No explicit “no color” in pickers

`ColorButton` opens a rich palette (HSV, RAL, recent colors) but **always commits an RGB value on OK**. There is no way to pick **transparent / none**:

- **Fill:** User wants an area boundary and labels visible but **no interior fill** (layers below show through). Today null `floorColor` falls through to texture or default gray fill — not transparent.
- **Outline:** User wants **no border stroke** (Option B — see locked decisions). Today null `outlineColor` draws the **default foreground** (black) outline, not “no outline.”

---

## Locked decisions (Aug 21, 2026)

### Terminology (Enhancement 1 & 2)

| Surface | Stock SH3D | ALP (SPIKE-33) | Property key (unchanged) |
|---------|------------|----------------|--------------------------|
| Inspector section title | Floor | **Fill** | `RoomPanel.floorPanel.title` |
| Color modal title | Floor color | **Fill color** | `RoomPanel.floorColorDialog.title` |
| Color radio label | Color: | **Color:** (unchanged) | `RoomPanel.floorColorRadioButton.text` |
| Texture modal | Fill texture | **Fill texture** (SPIKE-32) | `RoomController.floorTextureTitle` |

**Internal code/model names stay `floor*`** (`floorColor`, `getFloorColor()`, `FLOOR_PAINT`, etc.) — **user-visible strings only**. Avoids XML/schema churn and matches SPIKE-32 approach.

**Scope of string changes (v1):**

| Change | In scope | Out of scope (SPIKE-23 / later) |
|--------|----------|----------------------------------|
| Inspector + Modify area **Fill** section title | Yes | — |
| **Fill color** dialog title | Yes | — |
| Preferences “Floor color or texture” | No | SPIKE-23 branding audit |
| HomePane selection status “Floor %s” | No | SPIKE-23 |
| Level “Floor thickness” | No | Different concept (level slab) |
| 3D / ceiling / wall-side “floor” strings | No | Interior semantics |

### Transparent color — Fill (Enhancement 3a)

| Topic | Decision |
|-------|----------|
| **Picker UX** | **None** swatch: **square** white cell with **red diagonal** (top-left → bottom-right) plus a **“None”** caption, placed at the **top-left of the palette grid** (QCAD-style), before the gray/hue charts. Selected state = double black border. A full-height column was tried first and rejected — the diagonal read as a vertical line. |
| **Semantics** | None = **no fill color** — area interior is **not filled** on plan (transparent); outline, labels, and area name still render |
| **Color mode** | User stays on **Color** radio; None is not the same as switching to Texture or DEFAULT paint |
| **Persistence** | Store as **ARGB sentinel** `0x00000000` (alpha = 0) in `Room.floorColor` → saves as `floorColor="0"` in `.sh3d` |
| **Rendering** | `PlanComponent.paintRooms`: if floor color is transparent sentinel, **skip fill** for that area (do not fall through to texture or default gray) |
| **Opacity interaction** | When Fill color is **None**, the **Opacity (%)** spinner is **disabled** (grayed out, not editable). Opacity applies only when a **real** fill color is set. Re-enabling fill color restores the last opacity value (unchanged in model). |

**Why sentinel instead of `null`:** Sweet Home 3D derives paint mode from presence of color/texture. `null` color + `null` texture = **DEFAULT** (gray fill), which is indistinguishable from “user chose transparent.” Alpha-0 ARGB persists and reloads correctly; same pattern as furniture **invisible** materials (`(color & 0xFF000000) == 0`).

### Transparent color — Outline (Enhancement 3b)

| Topic | Decision |
|-------|----------|
| **Picker UX** | Same **None** swatch in **Outline color** modal |
| **Semantics (Option B — locked)** | None = **no outline stroke at all** on plan (not revert to default black) |
| **Persistence** | Store as **`outlineColor="0"`** (alpha-0 sentinel) or **`null`** with explicit “no outline” flag — prefer **alpha-0 sentinel** for symmetry with fill |
| **Rendering** | `PlanComponent`: when outline is transparent sentinel, **skip** `g2D.draw(roomShape)` for outline (fill and labels unchanged) |
| **Thickness / dash** | Outline thickness and dash style **ignored** when outline color is None (no stroke to style) |

### ColorButton scope

| Topic | Decision |
|-------|----------|
| **API** | `ColorButton.setNullColorAllowed(boolean)` — when true, show None swatch and allow OK → transparent sentinel |
| **Enable on** | Area **Fill color** and **Outline color** buttons in `SelectionInspectorPane` + matching controls in `RoomPanel` (full editor parity) |
| **Swatch display** | When color is transparent sentinel or null-with-none-selected, button icon shows **red diagonal on white** (match picker) |
| **Other ColorButtons** | Unchanged (labels, polylines, walls, etc.) — no None swatch unless explicitly enabled later |

### Opacity when Fill color = None

| Topic | Decision |
|-------|----------|
| **Control state** | **Opacity (%)** spinner is **disabled** (grayed out, not focusable/editable) whenever fill color is **None** |
| **Why** | No fill color means nothing to apply opacity to; avoids confusing “75% of transparent” |
| **Model** | `floorOpacity` value is **retained** in the room model while disabled — not reset to 100% |
| **Restore** | User picks a real fill color again → Opacity spinner **re-enables** with the **previous** value |
| **Texture mode** | Opacity remains **enabled** when fill mode is **Texture** (unchanged SPIKE-32 behavior) |
| **Inspector + modal** | Same rule in docked **Inspector** and full **Modify area** dialog |

---

## Inspector UI — after SPIKE-33

### Fill section (unchanged layout, renamed title)

```text
Fill                                    ← was “Floor”
┌─────────────────────────────────────────────────────────────┐
│  ○ Color    [■ swatch or ∅ none icon ....................]  │
│  ● Texture                                                  │
│  Library:    [ All libraries                   ▾ ]          │
│  Category:   [ All                             ▾ ]          │
│  Texture:    [ □ swatch — opens Fill texture popup ]        │
│  Opacity (%): [ 75                              ▲▼ ]        │  ← disabled when Fill color = None
│  ☐ Smooth corners                                           │
└─────────────────────────────────────────────────────────────┘
```

### Fill color modal

```text
┌ Fill color ─────────────────────────────────────────────────┐
│  Palettes | HSV | …                                         │
│  ┌─ None ─┐  ┌ hue chart … ┐                                │
│  │   ╱    │  │              │   (None = red diagonal)       │
│  └────────┘  └──────────────┘                                │
│  … OK / Cancel / Reset …                                    │
└─────────────────────────────────────────────────────────────┘
```

### Outline color modal

Same **None** swatch; title remains **Outline color** (`SelectionInspectorPane.outlineColorDialog.title`).

---

## Implementation phases

### Phase 1 — Label renames (~30 min) — **SHIPPED Aug 21, 2026**

| Step | Scope |
|------|--------|
| 1.1 | `package.properties`: `RoomPanel.floorPanel.title` → **Fill** |
| 1.2 | `package.properties`: `RoomPanel.floorColorDialog.title` → **Fill color** |
| 1.3 | Manual QA: inspector section, Modify area dialog, color modal title |

**Deliverable:** User-visible “Floor” → “Fill” for section + fill color dialog only.

**SPIKE-23 note:** Add row to branding checklist (see below).

### Phase 2 — Transparent Fill color (~1 day) — **SHIPPED Aug 21, 2026**

| Step | Scope |
|------|--------|
| 2.1 | `ColorButton`: `setNullColorAllowed`, None swatch in `PalettesColorChooserPanel`, transparent icon on button |
| 2.2 | Helper `AlpColorSupport.isTransparentColor(Integer)` — `(color != null && (color & 0xFF000000) == 0)` |
| 2.3 | OK handler: None → set `TRANSPARENT_COLOR` (`0x00000000`) on button |
| 2.4 | Enable on fill `ColorButton` in `SelectionInspectorPane` + `RoomPanel` |
| 2.5 | `RoomController.refreshProperties`: transparent fill → **COLORED** paint mode (not DEFAULT) |
| 2.6 | `PlanComponent.paintRooms`: skip interior fill when transparent |
| 2.7 | **Disable** Opacity (%) spinner when fill color is None; re-enable when user picks a real color |

**Deliverable:** User can pick Fill → Color → None; area interior transparent on plan; persists in `.sh3d`.

### Phase 3 — Transparent Outline color (~0.5 day) — **SHIPPED Aug 21, 2026**

| Step | Scope |
|------|--------|
| 3.1 | Enable `setNullColorAllowed` on outline `ColorButton` (inspector + `RoomPanel`) |
| 3.2 | `PlanComponent`: skip outline draw when outline color is transparent sentinel |
| 3.3 | `RoomController` / modify path: persist transparent outline |

**Deliverable:** Outline → None → no border stroke on plan (Option B).

---

## Technical approach

### Files to touch

| File | Phase | Change |
|------|-------|--------|
| `package.properties` | 1 | Fill / Fill color strings |
| `ColorButton.java` | 2–3 | None swatch, null allowed, transparent icon, sticky `noneColorSelected` flag |
| `tools/AlpColorSupport.java` (new) | 2–3 | `TRANSPARENT_COLOR`, `isTransparentColor()`, `isTransparentRgb()`, `paintTransparentColorIcon()` — in `tools` so both `swing` and `viewcontroller` can use it |
| `RoomController.modifyRooms()` | 2–3 | Transparent fill forces `COLORED` paint so the sentinel reaches the room (otherwise dropped to `null`) |
| `SelectionInspectorPane.java` | 2–3 | Enable null color on fill + outline buttons |
| `RoomPanel.java` | 2–3 | Same for full editor |
| `RoomController.java` | 2–3 | Paint mode resolution for transparent fill |
| `PlanComponent.java` | 2–3 | Skip fill/outline render for transparent sentinel |

### Gotcha — the chooser model cannot hold a transparent color

`JColorChooser` normalizes alpha back to opaque, so a transparent color **cannot** be stored in the shared `ColorSelectionModel`:

- `PalettesColorChooserPanel.updateChooser()` writes the color into the **RGB text field** (`#RRGGBB`, no alpha).
- That field's `DocumentListener` immediately parses it back with `Color.decode()` and pushes an **opaque** color into the model.
- The stock **HSV / HSL / RGB / CMYK** tabs do the same.

Net effect of a naive implementation: clicking **None** commits **opaque black** (`0xFF000000`), which paints as a **dark gray** area at 75% opacity — the exact symptom seen during QA on Aug 21, 2026.

**Solution:** `noneColorSelected` is a **sticky boolean flag** on the palettes panel, independent of the color model:

| Event | Effect on flag |
|-------|----------------|
| User clicks **None** swatch | Set `true` (guarded by `selectingNoneColor` so the reentrant model update does not clear it) |
| Any other color change (`updateChooser`) | Set `false` |
| Dialog opens | Seeded from the button's current color via `setNoneColorSelected(isTransparentColor(color))` |
| **OK** pressed | If `nullColorAllowed && noneColorSelected` → commit `TRANSPARENT_COLOR` |

**Do not** try to detect None by reading the chooser's selected color — it will always be opaque.

### Gotcha — do not force `COLORED` paint from the color value

A first pass made `modifyRooms()` force `floorPaint = COLORED` whenever the controller's `floorColor` was the transparent sentinel. Because the controller **keeps the last color** after the user switches to the Texture radio, this silently overrode `TEXTURED` and made **transparent → texture impossible**: the area stayed transparent and the chosen texture was discarded. The only workaround was transparent → solid color → texture.

**Rule:** paint mode is the single source of truth. Keep the stock derivation:

```java
Integer floorColor = floorPaint == RoomPaint.COLORED ? getFloorColor() : null;
```

The sentinel needs no special case here — `0` is a **non-null** `Integer`, so it flows through the normal `COLORED` path. Special-casing is only required where code tests the color *value* (plan rendering, opacity enablement).

For the same reason, opacity enablement must be gated on paint mode: `isTransparentFloorFill()` returns `false` when paint is `TEXTURED`, otherwise a stale sentinel keeps Opacity disabled in Texture mode.

Phase 3 reuses the same `ColorButton` / sticky-flag machinery for **Outline color** — no separate chooser work. Outline persistence uses the same `outlineColor != null` path (sentinel `0` is not `null`). Plan rendering skips `g2D.draw(roomShape)` when `AlpColorSupport.isTransparentColor(room.getOutlineColor())`; `null` outline still falls back to default black (backward compat).

### Gotcha — the inspector must not apply `TEXTURED` before a texture exists

The docked inspector applies every control change immediately, unlike the modal `RoomPanel`, which only applies on **OK**. Clicking the **Texture** radio therefore ran `modifyRooms()` while `getFloorTextureController().getTexture()` was still `null`, and `doModifyRooms()` cleared both fill properties (`setFloorColor(null)` + `setFloorTexture(null)`). The area dropped to **DEFAULT** gray, the follow-up `refresh()` recomputed paint as `DEFAULT`, and both radios deselected — so selecting Texture took **two clicks**.

**Rule:** in `SelectionInspectorPane`, the Texture radio only calls `applyRoomChanges()` when a texture is already chosen. Otherwise it sets `pendingFloorTextureMode`, which:

- keeps the Texture radio selected and the texture controls visible across refreshes,
- keeps Opacity (%) enabled (`isTransparentFloorFill()` returns `false` while pending),
- leaves the existing fill untouched until the user actually picks a texture.

The flag is cleared when a texture is chosen (which then forces `TEXTURED` and applies), when the Color radio or a fill color is picked, and whenever the selection changes.

### Rendering rules (plan view)

```text
Fill color:
  transparent sentinel → do not fill shape (skip setPaint/fillShape for interior)
  normal ARGB          → fill with color × floorOpacity (existing)

Outline color:
  transparent sentinel → do not draw roomShape outline
  null (legacy)        → treat as transparent after migration, OR map null → default black for old files only (prefer: null = default black for backward compat, sentinel = no outline)
  normal ARGB          → draw outline with color (existing)
```

**Backward compatibility:** Existing homes with `outlineColor` omitted or null keep **default black outline**. Only explicit **None** pick writes `outlineColor="0"`.

### SPIKE-23 branding checklist entry (copy when auditing)

| User-visible string | Stock SH3D | ALP Phase 1 | Spike |
|-------------------|------------|-------------|-------|
| Area fill section (inspector) | Floor | **Fill** | SPIKE-33 |
| Area fill color dialog | Floor color | **Fill color** | SPIKE-33 |
| Area fill texture dialog | Floor texture | **Fill texture** | SPIKE-32 |
| Area outline color dialog | (varies) | Outline color | stock |
| Model/XML attribute names | floorColor | floorColor (unchanged) | intentional |

---

## Test plan

### Phase 1 — Labels

- [x] Inspector shows section title **Fill**, not Floor.
- [x] Modify area dialog shows **Fill** section title.
- [x] Color modal title reads **Fill color**.
- [ ] Texture modal still reads **Fill texture** (SPIKE-32 regression).

### Phase 2 — Transparent fill

- [x] Fill color picker shows **None** swatch (red diagonal).
- [x] Select None → OK → area interior empty on plan; layer below visible.
- [x] Fill swatch button shows None icon when transparent.
- [ ] Save/reopen `.sh3d` → transparent fill preserved (`floorColor="00000000"`).
- [ ] Switch Fill → Texture **directly from transparent** works; texture applies and fill is no longer transparent (regression fixed Aug 21, 2026).
- [ ] Opacity (%) **re-enables** in Texture mode even when the previous fill was None.
- [x] When Fill color is **None**, Opacity (%) spinner is **disabled** (not editable).
- [x] Picking a real fill color again **re-enables** Opacity; prior value unchanged.

### Phase 3 — Transparent outline (Option B)

- [x] Outline color picker shows **None** swatch (same sticky-flag behavior as fill).
- [x] Select None → OK → **no outline stroke** on area (fill/labels unchanged).
- [ ] Save/reopen → no outline preserved (`outlineColor="00000000"`).
- [x] Existing files without `outlineColor` → still show default black outline.

### Regression

- [ ] Normal fill color + 100% opacity → solid fill (SPIKE-33 opacity fix retained).
- [ ] Transparent fill → click **Texture** once → radio stays selected, area keeps its transparent fill, texture controls and Opacity (%) enabled; picking a texture applies it immediately.
- [ ] Solid fill → click **Texture** once → same, area keeps its color until a texture is picked.
- [ ] Click **Texture**, then click **Color** back without picking a texture → previous fill (color or None) intact.
- [ ] Click **Texture**, then change selection and reselect the area → inspector reflects the stored fill, not the abandoned texture mode.
- [ ] Layer stacking paint order unchanged for overlapping areas.
- [ ] 3D view: document any limitation (plan-first spike; 3D floor may still show default — out of scope unless trivial).

---

## Out of scope (SPIKE-33)

- Renaming **Preferences** / **Level** / status bar “floor” strings (defer to SPIKE-23)
- Renaming Java fields, XML attributes, or `RoomController.Property` enums
- None/transparent for **Texture** mode (use Color → None instead)
- None swatch on **label**, **polyline**, or **wall** color pickers (future)
- Ceiling / wall-side color in inspector
- 3D transparent fill materials (unless required for parity)

---

## Dependencies & ordering

| Relation | Notes |
|----------|-------|
| **After SPIKE-32 Phase 2** | Library/category filters shipped; Fill texture naming already aligned |
| **Before / parallel SPIKE-23** | Terminology table in this doc **feeds** branding audit |
| **Independent of SPIKE-32 Phase 3** | Landscape texture pack can ship in parallel |

**Suggested implementation order:** Phase 1 → Phase 2 → Phase 3 (or Phase 2+3 in one pass once `ColorButton` supports None).

---

## Effort estimate

| Phase | Estimate |
|-------|----------|
| Phase 1 — Labels | ~30 minutes |
| Phase 2 — Transparent fill | ~1 day |
| Phase 3 — Transparent outline | ~0.5 day |
| **Total** | **~1.5 days** |

---

## Next steps

1. **User review** — Confirm locked decisions (outline Option B locked; opacity-when-None **disabled** locked Aug 21, 2026).
2. **Implement Phase 1** — Quick label win; update SPIKE-23 checklist when SPIKE-23 doc is written.
3. **Implement Phases 2–3** — `ColorButton` None swatch + plan rendering.
4. **Cross-link** — When SPIKE-23 scope doc is created, import terminology table from this spike.
