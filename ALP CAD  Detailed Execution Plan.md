### Milestone Block A: Inventory & Layer Visibility (High Priority)

*Goal: Enable users to organize and track architecture and landscape elements across named levels (Existing, Proposed, Plants).*

1. [SPIKE-16A] Finalize Furniture Level Exposure [COMPLETED]
   - Description: Ensure every placed object (windows, doors, plants) shows its level in the main list.
   - Status: LEVEL property added to default furniture visible properties in `Home.java`.
2. [SPIKE-16B] Create the "Areas" (Room) Inventory Panel [COMPLETED]
   - Description: Build a brand-new inventory list for drawn areas (lawns, patios, beds) since no stock list exists.
   - Status: `RoomTable` and `RoomTablePanel` implemented and integrated as a tab in `HomePane`.
3. [SPIKE-13] Implement Basic Level Protection (Locking) [COMPLETED]
   - Description: Add a "Locked" property to levels to prevent accidental modification of reference surveys or existing building footprints.
   - Status: 
     - Added `locked` boolean property and Logic to `Level` model.
     - Added "Locked" checkbox to `LevelPanel` properties dialog and summary table.
     - Updated `PlanController` and `LevelController` to enforce the lock across all tools (move, resize, delete, rotate, properties).
   - Touchpoints: Model, View, Controller.

------

### Milestone Block B: Landscape Visual Representation (M1)

*Goal: Adapt the rendering engine to support believable outdoor area fills and site-plan underlays.*

1. [SPIKE-05] Area Fill Opacity Control
   - Description: Allow "Room" objects to be semi-transparent so users can see the survey underlay beneath a planting bed or patio fill.
   - Files:
     - `com.eteks.sweethome3d.model.Room` (add `floorOpacity` property)
     - `com.eteks.sweethome3d.swing.RoomPanel` (add slider/input)
     - `com.eteks.sweethome3d.swing.PlanComponent` (update `paintRooms` to use `AlphaComposite`)
   - Touchpoints: Model, View, 2D Rendering.
   - Order: Step 4.
2. [SPIKE-06] Polygon Corner Smoothing Prototype
   - Description: Provide an option to "smooth" the sharp corners of a drawn Room to create organic-looking planting beds or lawns.
   - Files:
     - `com.eteks.sweethome3d.model.Room`
     - `com.eteks.sweethome3d.swing.PlanComponent` (use `GeneralPath` or Catmull-Rom splines for rendering)
   - Touchpoints: 2D Rendering.
   - Order: Step 5.

------

### Milestone Block C: Annotation & Output (M4)

*Goal: Improve the plan's ability to communicate design intent via text and presentation styles.*

1. [SPIKE-17] Width-Based Wrapped Text
   - Description: Replace simple single-line text with wrapping labels for long planting notes or site descriptions.
   - Files:
     - `com.eteks.sweethome3d.model.HomeText` (add `width` property)
     - `com.eteks.sweethome3d.swing.LabelPanel` (add width UI)
     - `com.eteks.sweethome3d.swing.PlanComponent` (update `paintText` to use `TextLayout` or `AttributedString`)
   - Touchpoints: Model, View, 2D Rendering.
   - Order: Step 6.
2. [SPIKE-18] One-Click Draft (Monochrome) Mode
   - Description: A global toggle to switch the plan from "Presentation Color" to "B&W Construction/Draft" style.
   - Files:
     - `com.eteks.sweethome3d.model.Home` (add `draftMode` toggle)
     - `com.eteks.sweethome3d.swing.PlanComponent` (conditional logic to ignore textures/colors when painting)
   - Touchpoints: Model, View, 2D Rendering.
   - Order: Step 7 (Final polish for output).

------

### Build & Tooling Requirements

- Ant Task: Continue using `ant buildModernDesktop`.
- Modern Compatibility: Maintain the `PlanComponent.java` shim (removing `JApplet` dependency) to ensure the code compiles on the current workspace JDK.
- Packaging: Use `ant jarExecutableModernDesktop` to produce the `SweetHome3D-7.5-modern.jar` for live validation of each spike.

### Suggested Execution Path

I recommend we start with Milestone Block A. It addresses the most critical "CAD-like" workflow needs (layers and inventory) that were identified as gaps during your initial spikes.

Would you like to begin by implementing SPIKE-16B (the Areas Inventory Panel)? It is the most significant structural addition to the UI in this block.



