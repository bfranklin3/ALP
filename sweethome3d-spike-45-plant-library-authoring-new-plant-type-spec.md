# Sweet Home 3D SPIKE-45: Plant Library Authoring / New Plant Type Creation Spec

## Goal

Define the Phase 1 workflow for creating a new reusable plant type in the ALP fork without forcing the user to hand-edit Sweet Home 3D furniture-library files.

This spike closes a real gap left by SPIKE-38 through SPIKE-43:

- those spikes define plant behavior, presets, metadata, and inspector behavior
- they do **not** yet define how a user creates a new reusable plant type

## Core Recommendation

Phase 1 should support **template-based plant type authoring**, not fully free-form asset authoring from scratch.

Recommended user flow:

1. Start from an existing ALP plant type
2. Choose `Duplicate Plant Type` or `Create New Plant From Template`
3. Edit metadata and default sizing
4. Optionally swap the structured symbol package
5. Save into a user plant library

This is the safest MVP path because it avoids solving all of the following at once:

- arbitrary SVG import cleanup
- automatic asset normalization
- blank-state symbol creation
- packaging unknown source files into a valid plant library

## Product Mental Model

The user is not creating “furniture.”
The user is creating a reusable **Plant Type**.

A Plant Type should own:

- display name
- category
- default size
- optional botanical metadata
- optional schedule metadata
- structured 2D symbol assets
- style preset compatibility

A placed plant instance should then own:

- actual placement
- per-instance width / depth / height
- rotation
- style preset selection
- later per-instance tint override if we choose to allow it

## Recommended Authoring Entry Points

Phase 1 should support:

1. `Duplicate Selected Plant Type`
2. `Create New Plant Type From Template`
3. `Edit Plant Type Metadata`

Phase 1 should **not** yet require:

- `Import Any SVG`
- `Create From Blank`
- `Manual property-file editing`

## Plant Type Fields

### Identity

- Display name
- Botanical name
- Common name
- Schedule name
- Reference code / symbol code

### Classification

- Library category
- Plant class
  - Tree
  - Palm
  - Shrub
  - Hedge
  - Groundcover
  - Accent plant
  - Perennial
  - Annual
  - Ornamental grass
  - Succulent / cactus

### Default geometry

- Default width
- Default depth
- Default height
- Keep proportions by default
- Suggested size variation allowance

### Symbol package

- Structured plan line asset
- Structured plan fill asset
- Optional tintable wash region
- Draft Gray compatibility
- Soft Green compatibility

### Planning metadata

- Spacing on center
- Mature width
- Mature height
- Container / pot size
- Notes

## Recommended Storage Model

Phase 1 should save authored plant types into a dedicated ALP-managed user library, such as:

- `ALP User Plants`

Each reusable plant type should persist:

- catalog ID
- metadata fields
- default dimensions
- category assignment
- style preset compatibility
- structured line icon content
- structured fill icon content

Preferred direction:

- reuse Sweet Home 3D furniture-library packaging
- do **not** invent a second unrelated storage model in Phase 1

## Inspector Boundary

### Instance inspector should edit

- placed plant width
- placed plant depth
- placed plant rotation
- placed plant style preset

### Plant type authoring should edit

- default name
- default category
- default botanical metadata
- default schedule metadata
- default size
- default symbol package
- default style compatibility

This keeps a clean boundary between:

- `editing one placed plant`
- `editing the reusable plant definition`

## Phase 1 UX Recommendation

The plant library browser should eventually expose actions like:

- `Duplicate`
- `Rename`
- `Edit Plant Type`
- `Assign Category`
- `Replace Symbol Package`

The plant type editor should be grouped into:

1. Identity
2. Category + metadata
3. Default size
4. Symbol + style

## MVP Constraints

To keep Phase 1 realistic, this spike recommends:

- no arbitrary SVG ingestion in the first pass
- no batch importer in the first pass
- no procedural random fill generator in the first pass
- no advanced horticultural rules engine in the first pass

Instead, the MVP should prove:

1. one structured ALP plant symbol format
2. one plant type duplication flow
3. editable metadata
4. editable default dimensions
5. save into a reusable library

## Relationship to SPIKE-44A

SPIKE-44A proves that a placed ALP plant instance can switch visual presets in the inspector.

SPIKE-45 defines the layer above that:

- how a reusable plant type is authored
- which fields belong to the plant type vs the plant instance

## Recommendation

Yes, this should be treated as **SPIKE-45**.

It is the right follow-on because we now understand how plant instances should behave, and we now need a safe authoring model for adding new reusable plant types to the system.

## Suggested Next Follow-on

After SPIKE-44A and SPIKE-45, the next likely implementation spike should be:

- `SPIKE-46: Plant Type Duplication + Metadata Editing Proof`

That proof would validate:

1. duplicate one existing ALP plant type
2. change its name, category, and default width
3. save it into a user library
4. verify it appears as a separate reusable plant entry in the catalog
