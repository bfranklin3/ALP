# SPIKE-47 — Plant Plan Fill Opacity (Hybrid Preset Model)

**Date:** August 29, 2026  
**Status:** **47A + 47B shipped** — manual opacity, Understory preset, Hybrid apply/display logic  
**Parent:** [SPIKE-41](sweethome3d-spike-41-plant-style-preset-spec.md), [SPIKE-46](sweethome3d-spike-46-plant-inspector-appearance-polish.md), [SPIKE-28](../ALP%20CAD%20%20Detailed%20Execution%20Plan.md) (layered plan symbols)  
**Related:** Area opacity (`Room.floorOpacity`, SPIKE-05); [SPIKE-36 plan Z-order](sweethome3d-spike-36-plan-z-order.md)

---

## Goal

Add a **Plan fill opacity** control for ALP plants so users can see symbols underneath (e.g. understory shrubs under canopy trees) while keeping line art readable. Default **100% opacity**. Integrate with existing **Plant style** presets using the **Hybrid** model: color presets do not stomp manual opacity; a dedicated **Understory** preset bundles reduced opacity.

---

## Short answer

| Piece | Decision |
|-------|----------|
| **Property** | `planFillOpacity` on placed furniture (`float` 0.0–1.0, default **1.0**) |
| **What fades** | **Wash layer only** (`planIconFill` tint) in Presentation mode |
| **What stays solid** | Line art (`planIcon` / `planIconLine` in Draft) at **100%** |
| **UI** | **Opacity (%)** spinner in **Plan fill color** panel (sidebar + Modify furniture) |
| **Presets** | Hybrid — see preset table below |
| **Area parity** | Same 0–100% spinner pattern as `Room.floorOpacity` |

Opacity alone does not control stacking — **elevation / Z-order** still determines what draws on top ([SPIKE-36](sweethome3d-spike-36-plan-z-order.md)). Inspector hint recommended.

---

## Problem / use case

- Users place smaller plants under larger tree symbols on the plan.
- Full-opacity watercolor washes hide symbols below.
- Area fill opacity exists (`floorOpacity`); plants have no equivalent.
- PNG assets already carry alpha; we need a **per-instance**, user-adjustable multiplier on the **fill wash**, not baked into library PNGs.

---

## Locked decisions (Hybrid model)

| Topic | Decision |
|-------|----------|
| **Default opacity** | **1.0** (100%) for all newly placed plants |
| **Render target** | Apply opacity when compositing **`planIconFill`** in `PieceOfFurnitureLayeredPlanIcon` |
| **Line art** | Always **100%** opacity (outline stays pickable and readable) |
| **Draft mode** | No wash layer → opacity control **disabled/hidden** (nothing to fade) |
| **Fill = None** | Opacity control **disabled** (`fillColor == TRANSPARENT_COLOR`) |
| **Preset: color-only** | Default wash, Soft green, Draft gray → set **fill color only**; **preserve** current `planFillOpacity` |
| **Preset: Understory** | Sets soft-green wash **and** `planFillOpacity = 0.6` (60%) |
| **Manual opacity change** | Allowed anytime; if opacity no longer matches active preset bundle → dropdown shows **Custom** (same honesty pattern as SPIKE-46) |
| **Choosing color preset after manual opacity** | Color-only presets **do not reset** opacity |
| **Catalog library defaults** | Defer `alp.plant.defaultPlanFillOpacity#N` — per-instance only in v1 |
| **3D view** | Out of scope — plan-first symbols |

---

## Property spec

### Model (`HomePieceOfFurniture`)

| Field | Type | Default | Notes |
|-------|------|---------|-------|
| `planFillOpacity` | `float` | `1.0f` | Clamped to `[0.0f, 1.0f]` on set |

| Constant | Value |
|----------|-------|
| `Property.PLAN_FILL_OPACITY` | `"PLAN_FILL_OPACITY"` |
| `DEFAULT_PLAN_FILL_OPACITY` | `1.0f` |

Mirror `Room.getFloorOpacity()` / `setFloorOpacity()` API style.

### Persistence (home XML)

```xml
<furniture ... planFillOpacity="1.0" ... />
```

- Omit attribute when `1.0` (optional — match `floorOpacity` import style).
- Import default: **1.0** if missing (backward compatible with existing homes).

### Not stored on catalog (v1)

Per-**placed** piece only. Library `.sh3f` unchanged unless we add optional defaults later.

---

## UI placement

### Docked inspector (`SelectionInspectorPane`)

Inside existing **`planFillPanel`** (“Plan fill color”), **below** the color swatch / Default wash checkbox:

```
┌─ Plan fill color ─────────────┐
│ ☑ Default wash                │
│ [ color swatch ]              │
│ Opacity (%)  [ 100 ▼]         │  ← new (NullableSpinner, 0–100)
└───────────────────────────────┘
```

| Visibility | Condition |
|------------|-----------|
| **Shown + enabled** | Single or multi ALP plant selection with `hasPlanIconFill()`, Presentation-relevant, fill ≠ None |
| **Disabled** | Fill = None, or Draft mode active, or selection includes non-plants without fill |
| **Multi-select** | Nullable spinner when mixed values (same as area opacity) |

### Modify furniture dialog (`HomeFurniturePanel`)

Same control in existing `planFillPanel` — keep sidebar and modal in sync (SPIKE-46B pattern).

### Plant style dropdown (`plantStylePanel`)

Add selectable preset:

| Label | ID |
|-------|-----|
| Understory | `understory` |

Order suggestion: Default wash → Soft green → Draft gray → **Understory** → None.

### Hint text (optional, 47B)

One line under opacity spinner or in tooltip:

> *Lower elevation draws underneath. Reduce opacity to see plants below.*

---

## Preset table (Hybrid)

| Preset ID | Display label | Sets `fillColor` | Sets `planFillOpacity` on apply | Default opacity if unset |
|-----------|---------------|------------------|--------------------------------|--------------------------|
| `defaultWash` | Default wash | `null` (untinted wash) | **No** — preserve current | 1.0 |
| `softGreen` | Soft green | `0xFFA8C98B` | **No** — preserve current | 1.0 |
| `draftGray` | Draft gray | `0xFFA8A8A8` | **No** — preserve current | 1.0 |
| `understory` | Understory | `0xFFA8C98B` (same as soft green) | **Yes → 0.6** | 0.6 |
| `none` | None | `TRANSPARENT_COLOR` (0) | **No** — control disabled | n/a |
| `custom` | Custom | (display only) | User-edited fill and/or opacity | — |

### Apply logic (`applyPlantPresetChange`)

```
onPresetSelected(preset):
  fillColor = getPlantStylePresetAppliedFillColor(preset)
  setFillColor(fillColor)

  if preset defines bundled opacity:   // understory only in v1
    setPlanFillOpacity(getPlantStylePresetAppliedOpacity(preset))
  else:
    // leave planFillOpacity unchanged
```

### Display resolution (`resolvePlantStylePresetDisplay`)

After SPIKE-46 color matching, extend:

- If fill matches **Understory** bundle (soft green tint **and** `planFillOpacity ≈ 0.6`) → **Understory**
- Else if fill matches known color preset but opacity ≠ that preset’s bundled value → **Custom**
- Else existing color-only rules

Use epsilon compare for float opacity (e.g. `Math.abs(a - b) < 0.005f`).

### `AlpPlantUtils` additions

```java
public static final String PLANT_STYLE_PRESET_UNDERSTORY = "understory";

public static Float getPlantStylePresetAppliedOpacity(String preset);
// null  → preset does not change opacity (preserve current)
// 0.6f  → understory

public static boolean isSelectablePlantStylePreset(String preset);
// add understory
```

---

## Rendering spec

### Presentation mode (`PlanComponent`)

In `PieceOfFurnitureLayeredPlanIcon.compositeIcon()`:

1. If fill not None: paint tinted `planIconFill` with **`AlphaComposite.SRC_OVER, planFillOpacity`**
2. Paint `planIcon` line layer at **alpha = 1.0**

Alternative (equivalent): multiply wash pixel alpha by `planFillOpacity` in `paintIconToImage` — prefer **`Graphics2D` composite** for consistency with `paintRoomFill`.

### Draft mode

Unchanged — line icon only; opacity property ignored at paint time.

### Icon cache

Include `planFillOpacity` in `HomePieceOfFurnitureTopViewIconKey` hash/equals (alongside `fillColor`).

Clear cache on `PLAN_FILL_OPACITY` property change (same listener set as `FILL_COLOR`).

---

## Implementation phases

| Phase | Scope | Effort |
|-------|--------|--------|
| **47A** | Model + XML + render wash opacity + inspector spinner (no new preset) | ~1 day |
| **47B** | Understory preset + Hybrid apply/display logic + hint text | ~½ day |

**47A is shippable alone** (manual opacity only). **47B** completes the Hybrid preset story.

---

## Likely files

| Layer | Files |
|-------|--------|
| Model | `HomePieceOfFurniture.java` |
| XML | `HomeXMLHandler.java`, `HomeXMLExporter.java` |
| Utils | `AlpPlantUtils.java` |
| Controller | `HomeFurnitureController.java` |
| UI | `SelectionInspectorPane.java`, `HomeFurniturePanel.java`, `package.properties` |
| Render | `PlanComponent.java` (`PieceOfFurnitureLayeredPlanIcon`, `HomePieceOfFurnitureTopViewIconKey`) |

---

## Out of scope (v1)

- Opacity on non-plant furniture
- Opacity on line art / whole composited icon
- Fade in 3D view
- Catalog-level default opacity in `.sh3f`
- Additional presets (e.g. “Ghost 30%”) beyond Understory
- Area-fill generated plant instances inheriting parent area opacity

---

## Test plan

### 47A — Manual opacity

1. Place layered ALP plant; confirm default **100%** opacity.
2. Set opacity to **50%** — wash fades; line art stays solid.
3. Toggle **Draft mode** — opacity control disabled; line art unchanged.
4. Set fill to **None** — opacity control disabled.
5. Save/reload home — opacity persists.
6. Multi-select two plants with different opacity — nullable spinner.
7. Export/print plan — faded wash visible (visual check).

### 47B — Hybrid presets

1. Set opacity **40%** manually; switch **Soft green ↔ Draft gray** — opacity stays **40%**.
2. Choose **Understory** — fill soft green, opacity **60%**.
3. Choose **Understory**, then change opacity to **80%** — dropdown shows **Custom**.
4. **Default wash** after Understory — opacity **unchanged** (still 60% unless user resets).
5. Understory under a tree (lower elevation) — both symbols readable.

---

## Relationship to SPIKE-41

[SPIKE-41](sweethome3d-spike-41-plant-style-preset-spec.md) listed `fillOpacity` as a preset slot but deferred implementation. **SPIKE-47** delivers the first slice: **wash opacity only**, Hybrid preset binding, aligned with layered SPIKE-28 assets.

---

## Open questions (non-blocking)

1. **Understory opacity value** — **60%** proposed; adjust after visual QA on Gemini library symbols.
2. **Understory fill** — reuse Soft green tint vs slightly muted green (same hex in v1).
3. **Reset opacity control** — explicit “100%” button vs spinner only (spinner sufficient for v1).

---

## Recommendation summary

| Question | Answer |
|----------|--------|
| SPIKE number | **47** (46 is taken) |
| Model | **Hybrid** — not pure A (no preset opacity) or pure B (always reset opacity) |
| Property name | **`planFillOpacity`** |
| UI | **Plan fill color** panel, below swatch |
| New preset | **`understory`** @ 60% opacity + soft green wash |
