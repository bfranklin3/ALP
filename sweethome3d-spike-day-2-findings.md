# Sweet Home 3D Spike Findings: Day 2

Date: August 14, 2026

Build tested:

- `Sweet Home 3D 7.5`

## Focus

Day 2 evaluates:

- landscape content fit
- mixed building + site readability
- 2D visual quality
- black-and-white vs color output quality

## Block 1: Area-Based Outdoor Planning

### Result

- `Strong`

### What we tested

- patio / hardscape area: textured proposed tile patio beside existing patio
- planting bed: irregular planting bed over background survey
- lawn / open area: color-fill lawn and separate texture-fill lawn test

### What felt good

- drawing outdoor areas was easy and intuitive
- overlaying areas on the calibrated background worked well
- the resulting 2D composition already reads as a believable site concept with patio, lawn, planting bed, and driveway zones

### What felt awkward

- the word `room` feels indoor-specific even though the behavior works well outdoors
- room fills need more control, especially opacity / transparency
- text boxes do not wrap naturally and must be manually broken with the `Enter` key
- there is no built-in smoothing / curve refinement for rough polygon areas

### Notes

- User workaround for wrapped text: place the cursor inside the text field and press `Enter` where a new line should begin.
- User identified three concrete enhancement targets:
- `HomeText.java` + `HomeComponent2D.java`: add width-based wrapped text rendering
- `Room.java` + `HomeComponent2D.java` + `RoomPanel.java`: add room fill opacity control
- `HomeComponent2D.java` + `RoomPanel.java`: add corner smoothing for outdoor polygons
- Visual conclusion so far: outdoor areas are believable in 2D, but would become much more convincing with stronger fill control, more textures, and optional smoothing.

## Block 2: Plant and Outdoor Object Placement

### Result

- `Mixed`, leaning `Strong`

### What we tested

- plant objects: custom plant library created earlier in the project
- tree objects: multiple tree / shrub-like objects placed outdoors
- outdoor feature objects: bench and table outdoors; appliances, sink, and bath fixtures indoors for symbol-quality comparison

### What felt good

- plants and objects were super easy to move
- resizing objects was easy
- hosted / placeable-object behavior still feels much more natural than the QCAD prototype
- the overall composition proves that landscape objects can live in the same 2D plan as building content

### What felt awkward

- plants are not provided well by default for this use case
- the existing object symbols do not feel very professional
- many of the current symbols read more like generic furniture assets than purpose-built landscape / architectural planning content

### Notes

- User assessment: the current libraries are usable, but not good enough visually for a polished product.
- Strong implication: this pivot likely depends on creating better custom libraries rather than relying on stock `Sweet Home 3D` assets.
- Visual conclusion so far: the interaction model is strong, but the content / symbol language would need a Phase 1 library-design pass to feel product-ready.

## Block 3: Mixed Building + Landscape Readability

### Result

- `Strong`

### What we tested

- combined house footprint with driveway, proposed tile patio, planting bed, lawn areas, trees, and a few placed objects
- review of the same composition without the distracting survey underlay, to judge the plan on its own visual coherence

### What felt good

- the overall plan reads as one coherent concept rather than two separate systems stitched together
- building-side and landscape-side content feel like they can belong in the same product
- even with only moderate symbol quality, the plan already looks presentable and like a plausible product starting point

### What felt awkward

- the plan still needs more detail to feel complete on a real project
- some object symbols remain visually weaker than the area-based outdoor composition around them

### Notes

- User verdict: coherent, belongs in one product, and is a plausible starting point for the app.
- Strong implication: `Sweet Home 3D` already supports the mixed-plan use case better than expected, provided that Phase 1 improves content polish and presentation controls.

## Block 4: 2D Visual Quality Review

### Result

- `Mixed`, leaning `Strong`

### Monochrome readability

- There is no native one-click monochrome / draft mode today.
- The app can be pushed toward monochrome with workarounds:
- change plan background to white and grid to light gray in preferences
- disable heavier door / window pattern rendering
- hide room floor / ceiling fills or switch them to white
- User view: a true draft mode would be desirable but is not critical for MVP.

### Color / texture readability

- Color / textured view feels presentation-worthy enough for MVP.

### Biggest visual strengths

- general line and wall styling is good
- hardscape appearance is presentable for now
- text and labels are generally good aside from the earlier wrapping limitation
- overall colored plan presentation is credible enough for concept work

### Biggest visual weaknesses

- plant symbols need improvement
- area fills need improvement, especially richer controls and polish
- monochrome output is not first-class today and would benefit from a dedicated draft-mode solution

## Block 5: Output Review

### Result

- `Strong`

### Black-and-white output

- The grayscale / draft-oriented output is acceptable and still readable.
- Major zones, outlines, driveway, planting bed, lawn areas, and object placement remain understandable.
- It is not as refined as a dedicated native draft mode would be, but it is good enough for Phase 1 use.

### Color output

- The color / textured output is acceptable and presentation-worthy for MVP.
- Outdoor regions remain legible and the plan still reads cleanly as a concept drawing.

### Notes

- User assessment: both outputs look acceptable.
- The black-and-white version confirms that even without a first-class draft-mode feature, the plan can still function as a usable printed-style deliverable.
- The color version is the stronger of the two today and better supports the presentation side of the product vision.

## Day 2 Summary

### Outdoor areas verdict

- `Strong`

Reason:

- Outdoor areas already read believably in 2D and were easy to create. They would improve further with opacity control, richer textures, and optional corner smoothing, but the core workflow is already convincing.

### Plant / outdoor content verdict

- `Mixed`, leaning `Strong`

Reason:

- Object behavior is strong and easy to use, but the current libraries feel too generic and not polished enough. This looks fixable through better custom libraries rather than a core engine problem.

### Mixed-plan readability verdict

- `Strong`

Reason:

- The combined house-and-landscape plan reads coherently and feels like one product rather than two systems colliding. Even with only moderate symbol quality, the sample already looks presentable.

### Visual / output verdict

- `Strong`

Reason:

- Color output is already presentation-worthy for MVP, and grayscale output is acceptable even if draft mode is still workaround-based. The biggest visual improvements now are plant symbols and fill controls, not the whole rendering model.

### Overall Day 2 conclusion

- `Strongly promising`

### Immediate next step recommendation

- `proceed to pivot decision summary`
