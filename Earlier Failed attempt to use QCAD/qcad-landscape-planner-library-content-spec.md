# QCAD-Based Landscape Planner Library and Content Specification

Date: August 12, 2026

## Purpose

This document defines the content system for the QCAD-based landscape planner MVP.

It covers:

- library goals
- symbol categories
- starter content priorities
- naming rules
- metadata fields
- sizing behavior
- monochrome and color variants
- texture and hatch content
- file organization
- quality rules for library assets

This spec is intended to support the MVP architecture and the UI wireframe documents already created for this project.

## Goals

1. Make symbol placement fast and intuitive for landscape and residential site-plan work.
2. Support both monochrome drafting output and color presentation output from the same project.
3. Keep the starter library small but high quality.
4. Support consistent sizing, naming, and metadata across symbols.
5. Avoid turning the library into an uncurated dump of mixed assets.

## Non-goals

For MVP, the library system does not need to support:

- plant database completeness
- nursery inventory management
- advanced botanical search logic
- complex 3D assets
- photo-realistic plant rendering
- cloud-hosted content packs

## Content principles

### 1. Curated over exhaustive

The first release should ship with a smaller, cleaner library rather than hundreds of inconsistent assets.

### 2. One logical symbol, multiple visual variants

Each symbol should represent one logical object, with visual variants for:

- monochrome plan view
- color presentation view

These should remain linked as one symbol definition whenever possible.

### 3. Plan-view first

All core symbol assets should be designed for top-down 2D use.

### 4. Standard size defaults

Every placeable symbol should have a default `Width` and `Depth` so that placement starts from a useful plan size.

### 5. Metadata should help the workflow

Metadata should support:

- labels
- filtering
- scheduling later
- size adjustment

It should not be so complex that the library becomes difficult to maintain.

## Content types

The app should support three major content types:

1. `Placeable symbols`
2. `Fills / hatches / textures`
3. `Templates / title block content`

This document focuses primarily on placeable symbols and fills.

## Library category structure

### MVP top-level categories

- Trees
- Palms
- Shrubs
- Accents
- Groundcover
- Building / Site Features
- Doors / Windows
- Site Fixtures

These should ship as built-in starter categories.

The product should also support user-defined categories so users can organize imported symbols and future symbol packs without being limited to hard-coded buckets.

### Suggested future categories

- Flowering Trees
- Hedges / Screens
- Lawn Elements
- Water Features
- Lighting
- Outdoor Furniture
- Fences / Gates
- Utility Symbols

## Category definitions

### Trees

Use for:

- broad-canopy shade trees
- ornamental trees
- upright trees
- specimen trees

Examples:

- Live Oak Round A
- Maple Ornamental B
- Pine Narrow A

### Palms

Use for:

- fan palms
- tropical palms
- clustered palms

Examples:

- Palm Fan Medium
- Palm Cluster Accent

### Shrubs

Use for:

- rounded shrubs
- dense shrubs
- hedge-style shrubs
- massing shrubs

Examples:

- Shrub Round Small
- Shrub Dense Medium
- Hedge Oval Long

### Accents

Use for:

- agaves
- grasses
- focal plants
- sculptural specimens

Examples:

- Agave Accent
- Grass Clump Fine

### Groundcover

Use for:

- low plant masses
- edge plantings
- repetitive small modules

Examples:

- Groundcover Dense Patch
- Groundcover Flowering Patch

### Hardscape

Use for:

- paver symbols
- stepping stone groups
- walls
- edging elements
- gravel or mulch motif modules if needed

Examples:

- Paver Square Module
- Stepping Stone Arc
- Seat Wall Segment

Notes:

- Hardscape content should not assume only square or rectangular blocks.
- Many hardscape elements will need to work with polygons, curves, and irregular closed shapes.
- The system should support both shape-applied fills and reusable placed modules.

### Doors / Windows

Use for:

- simple top-view home-plan elements
- door swings
- window openings

Examples:

- Single Door 3-0
- Double Door 6-0
- Window Standard 4-0

UI recommendation:

- keep doors and windows in the same underlying library system as plants and fixtures
- present them as a visually separate architectural section in the library browser and in relevant workflow modes

### Site Fixtures

Use for:

- AC units
- pools
- mailboxes
- planters
- rain barrels
- landscape lighting

Examples:

- AC Unit Small
- Rain Barrel Round
- Light Bollard

## Starter library recommendation

The MVP should ship with a curated starter pack rather than a huge asset dump.

## Recommended symbol counts for MVP

- Trees: 18 to 24
- Palms: 6 to 10
- Shrubs: 12 to 18
- Accents: 8 to 12
- Groundcover: 6 to 10
- Hardscape symbols: 8 to 12
- Doors / Windows: 8 to 12
- Site Fixtures: 8 to 12

That yields a realistic initial library of roughly:

- 66 to 100 symbols

This is enough to feel useful without becoming hard to manage.

## User-created categories and imported content

The library system should not be limited to built-in categories.

### Required behavior

- users may create their own categories
- users may rename their own categories
- users may import individual symbols into a chosen category
- users may import whole symbol packs into one or more categories
- built-in categories remain available as defaults

### MVP recommendation

Support a flat category model first:

- built-in categories
- user-defined categories

Avoid deep nested folder trees in MVP.

## MVP starter pack priorities

If we need to stage content, build in this order:

1. Trees
2. Shrubs
3. Hardscape
4. Groundcover
5. Doors / Windows
6. Site Fixtures
7. Palms
8. Accents

Why:

- trees and shrubs are central to the sample plans
- hardscape and doors/windows support the building/site workflow
- groundcover and fixtures improve realism
- palms and accents are useful but can follow

## Symbol definition model

Each logical symbol should have:

- one stable symbol ID
- one category
- one default plan size
- one monochrome variant
- one color variant when available
- a thumbnail
- basic metadata

## Required symbol metadata

### Core identity

- `symbolId`
- `name`
- `category`
- `tags`

### Geometry defaults

- `defaultWidth`
- `defaultDepth`
- `defaultRotation`
- `scalable`
- `mirroredAllowed`

### Visual assets

- `monoAssetRef`
- `colorAssetRef`
- `thumbnailRef`

### Labeling / scheduling

- `labelShortName`
- `scheduleName`
- `countAsPlant`

### Domain metadata

- `commonName`
- `botanicalName`
- `plantCode`
- `matureHeight`
- `notes`

### Technical metadata

- `libraryPack`
- `version`
- `sourceType`
- `licenseTag`

## Optional symbol metadata

- `cultivar`
- `waterUse`
- `sunExposure`
- `nativeStatus`
- `recommendedSpacing`
- `lineWeightOverride`
- `monoLabelOverride`
- `colorLabelOverride`

These should not be required for MVP, but the schema should allow them.

## Plant sizing rules

### Plan dimensions

Placeable plant symbols should use:

- `Width`
- `Depth`

These are plan-view dimensions and are especially important for:

- oval shrubs
- hedge modules
- narrow trees
- rectangular or asymmetrical elements

### Horticultural dimensions

Plant metadata may also include:

- `Mature Height`
- `Recommended Spacing`

This avoids confusion between drawing size and horticultural information.

## Default placement rule

When a symbol is placed:

1. it uses its library default `Width` and `Depth`
2. the user may rotate it before confirming placement
3. the user may optionally adjust size during placement
4. the symbol remains resizable after placement

## Size editing recommendations

Preferred behavior:

- default to standard size
- show `Width x Depth` during placement in a small on-canvas HUD
- allow optional inline editing if practical
- always allow adjustment later in the Properties panel

## Recommended Properties panel metadata exposure

To avoid clutter, plant metadata should be exposed with progressive disclosure.

### Always visible for plant selections

- `Name`
- `Category`
- `Layer`
- `Width`
- `Depth`
- `Rotation`
- `Variant`
- `Common Name`
- `Botanical Name`
- `Plant Code`

### In a collapsed `More Details` section

- `Mature Height`
- `Recommended Spacing`
- `Water Use`
- `Sun Exposure`
- `Native Status`
- `Notes`

## Naming rules

Names should be readable, consistent, and practical for users.

### Naming pattern

Recommended base pattern:

- `Category Descriptor Size Variant`

Examples:

- Live Oak Round A
- Pine Narrow A
- Shrub Round Small
- Hedge Oval Long
- Palm Fan Medium
- Agave Accent Small

## Variant naming

Do not expose monochrome and color variants as separate user-facing symbol names when they represent the same logical object.

Instead:

- symbol name: `Live Oak Round A`
- variants:
  - `mono`
  - `color`

## Door / window naming

Use architectural width shorthand where appropriate:

- Single Door 3-0
- Double Door 6-0
- Window Standard 4-0

## Name quality rules

Avoid:

- internal file-like names
- long botanical names as the main display name
- inconsistent abbreviations
- mixed unit styles in names

Prefer:

- short readable names
- consistent descriptive structure
- botanical names in metadata, not necessarily as the visible title

## Tagging rules

Tags help search and filtering.

## Required tag behavior

Each symbol should support multiple tags, for example:

- `tree`
- `shade`
- `round`
- `oak`
- `native`
- `small`
- `entry`

## Suggested tag types

- object class
- form factor
- size class
- design style
- special use

Examples:

- `tree`, `upright`, `narrow`
- `shrub`, `hedge`, `screen`
- `door`, `entry`
- `fixture`, `utility`

## Variant strategy

### Required variants

Each symbol should support:

- `mono`
- `color`

If a symbol does not yet have both, MVP may ship with:

- mono only, or
- mono reused as color temporarily

But the system should still treat variants as part of one symbol definition.

### Monochrome variant rules

Monochrome variants should:

- print cleanly in black and white
- avoid muddy dense fills
- use strong silhouette or hatch language
- remain legible at smaller scales

### Color variant rules

Color variants should:

- preserve shape identity from the mono version
- be attractive in presentation mode
- avoid excessive realism
- remain readable when many symbols appear together

### Variant consistency rules

Mono and color versions of the same symbol should:

- share the same default size
- share the same anchor point
- share the same rotation behavior
- feel like the same object

## Asset style guidance

### Trees

Use a mix of:

- round canopies
- loose organic canopies
- upright forms
- narrow forms

Avoid too many near-duplicates.

### Shrubs and hedges

Include:

- round shrub masses
- loose natural shrub masses
- oval hedge modules
- rectangular hedge or screening modules

### Doors / windows

Keep these clean and CAD-like.

They should be functional symbols more than decorative ones.

### Hardscape

Hardscape symbols should be simple and reusable.

Do not overload the starter pack with too many decorative blocks.

For MVP, hardscape should support two related content types:

- fills / hatches for arbitrary closed shapes
- a small set of reusable decorative or functional modules for presentation and repeated details

## Texture and hatch content

In addition to placeable symbols, the product needs fill and hatch content.

### MVP fill categories

- mulch
- gravel
- lawn
- pavers
- concrete
- planting bed texture

### Fill behavior

Each fill should support:

- monochrome draft style
- color presentation style

These fills should be applicable to arbitrary closed geometry, including:

- rectangles
- polygons
- curved beds
- irregular outlines

### Fill naming examples

- Mulch Standard
- Gravel Fine
- Lawn Light
- Paver Running Bond
- Concrete Plain

### Fill quality rules

Fills should:

- tile cleanly
- avoid visual noise
- remain legible in print
- not overpower labels or dimensions

## Thumbnail rules

Each library item should have a thumbnail.

## Thumbnail requirements

- consistent size
- neutral background
- centered subject
- readable at panel scale

## Thumbnail style

For plants:

- show the top-view plan symbol clearly

For CAD-like items:

- use a simple preview on a neutral field

## Search behavior requirements

The library browser should support search by:

- symbol name
- common name
- botanical name
- plant code
- tags
- category

## Minimum searchable fields for MVP

- `name`
- `commonName`
- `botanicalName`
- `tags`
- `category`

## File organization

### Recommended library pack structure

```text
content/
  libraries/
    trees-starter/
      library.json
      thumbs/
      mono/
      color/
    shrubs-starter/
      library.json
      thumbs/
      mono/
      color/
    hardscape-starter/
      library.json
      thumbs/
      mono/
      color/
    user-imports/
      library.json
      thumbs/
      mono/
      color/
  fills/
    mulch/
    gravel/
    lawn/
    pavers/
    concrete/
```

## Recommended symbol record example

```json
{
  "symbolId": "tree.live-oak-round-a",
  "name": "Live Oak Round A",
  "category": "Trees",
  "tags": ["tree", "oak", "round", "shade"],
  "defaultWidth": "18ft",
  "defaultDepth": "18ft",
  "defaultRotation": 0,
  "scalable": true,
  "mirroredAllowed": false,
  "monoAssetRef": "mono/live-oak-round-a.svg",
  "colorAssetRef": "color/live-oak-round-a.svg",
  "thumbnailRef": "thumbs/live-oak-round-a.png",
  "labelShortName": "Live Oak",
  "scheduleName": "Live Oak Round A",
  "countAsPlant": true,
  "commonName": "Live Oak",
  "botanicalName": "Quercus virginiana",
  "plantCode": "LIVE-OAK-01",
  "matureHeight": "35ft",
  "notes": "",
  "libraryPack": "trees-starter",
  "version": "1.0.0",
  "sourceType": "vector",
  "licenseTag": "internal"
}
```

## Asset format recommendations

Preferred formats:

- vector assets for symbols when possible
- raster thumbnails for browsing

Recommended:

- `SVG` for mono and color symbol assets where practical
- `PNG` for thumbnails

Reason:

- SVG is flexible for scaling and style consistency
- PNG thumbnails are simple and fast for UI display

## Quality bar for shipping symbols

Each symbol should pass these checks:

1. readable at common plan scales
2. visually distinct from nearby related symbols
3. default size feels believable
4. anchor point behaves correctly
5. mono variant prints clearly
6. color variant does not become muddy in dense plans
7. metadata is complete enough for search and labeling

## Library QA checklist

For each symbol:

- thumbnail renders correctly
- name is human-readable
- tags are present
- width and depth are valid
- rotation behaves correctly
- placement preview works
- mono and color variants align
- label text remains sensible

For each fill:

- tiles cleanly
- reads correctly in draft mode
- reads correctly in presentation mode
- does not interfere with dimension readability

## MVP recommended starter content list

### Trees

- 6 broad round canopy trees
- 4 loose organic canopy trees
- 4 narrow / upright trees
- 4 ornamental trees

### Palms

- 3 fan palms
- 2 clustered palms
- 2 tropical accent palms

### Shrubs

- 4 round shrubs
- 4 dense shrubs
- 3 loose shrubs
- 3 hedge / screen modules

### Accents

- 3 agaves
- 3 grasses
- 2 sculptural accents

### Groundcover

- 3 dense groundcover patches
- 3 flowering groundcover patches

### Hardscape

- 2 paver modules
- 2 stepping stone arrangements
- 2 wall / edging modules
- 2 decorative plan hardscape accents

### Doors / Windows

- 3 single door types
- 2 double door types
- 3 window types

### Site Fixtures

- AC unit
- rain barrel
- mailbox
- planter
- light bollard
- pool marker
- utility box
- bench or simple site seat

## Future expansion strategy

After MVP, grow the content system by packs:

- Southern Landscape Pack
- Tropical Plant Pack
- Foundation Planting Pack
- Residential Hardscape Pack
- Outdoor Living Pack

This will scale better than shipping everything in one giant library.

## Hedge strategy

### MVP

Treat hedges as:

- repeatable symbols
- stretched hedge modules where useful

### Longer term

Support both:

- repeatable symbols
- true path-based hedge objects

## Content governance

The product needs rules for adding new assets.

### Add criteria

A new symbol should only be added if it:

- fills a real design need
- is visually distinct
- has good source quality
- can support at least a usable mono variant
- can be named clearly

### Remove or defer criteria

Defer assets that:

- duplicate existing symbols too closely
- require unusual metadata
- are too decorative for the starter pack
- do not print cleanly

## Resolved decisions from review

- The starter pack should stay generic at first rather than region-specific.
- The product should support user-defined categories in addition to built-in categories.
- Users should be able to import individual symbols and full symbol packs into categories they choose.
- Doors and windows should live in the same underlying library system, but be visually separated in the UI as architectural content.
- The top command strip should prefer the simple labels `Walls`, `Doors`, and `Windows`.
- `Doors` and `Windows` may focus the matching architectural library section while offering a small anchored subtype picker for quick selection.
- Broader placeable content such as furniture, bath fixtures, and outdoor living symbols should stay in categorized library sections rather than becoming many top-strip buttons.
- Hardscape should support both fills / hatches and a small starter set of reusable modules in MVP.
- Botanical metadata shown in the Properties panel should stay lightweight by default, with more detail in a collapsed section.
- Hedges should be handled as repeatable symbols in MVP and expand toward path-based behavior later.

## Open questions for next pass

1. Should user-created categories allow custom icons or only text labels in MVP?
2. Should imported symbol packs be copied into the app ecosystem, referenced externally, or allow both behaviors?
3. How many hardscape modules are enough for MVP before the starter pack feels too large?
4. Should architectural content appear in its own top-level filter in addition to category grouping?
5. Which metadata fields should be included in any future schedule or legend generation feature?

## Recommended next step

After this document, the most useful follow-up is:

- turn the architecture and UI decisions into a prioritized MVP backlog

At that point, the backlog can reference concrete content work such as:

- implement symbol library browser
- import starter tree pack
- add two-point scale calibration
- support Width / Depth placement HUD
- add mono/color output preset switching
