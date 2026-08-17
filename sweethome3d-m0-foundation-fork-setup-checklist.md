# Sweet Home 3D M0 Foundation Fork Setup Checklist

Date: August 14, 2026

## Purpose

Define and execute the missing `M0` setup work that must happen before we begin real `Sweet Home 3D` code changes.

This checklist is the practical bridge between:

- planning / feasibility documents
- actual source-based implementation work such as `SPIKE-16A`

## Why This Matters

We should **not** edit or prototype real `Sweet Home 3D` code from the installed app bundle.

We need:

- a real local source tree
- a safe working fork location
- a branch strategy
- a verified build/run path

Only after that should we begin source edits.

## Checklist

### 1. Confirm the app/version baseline

- [x] Confirm installed open-source test target
- [x] Confirm installed app bundle path
- [x] Confirm current engineering target is `Sweet Home 3D 7.5`

### 2. Locate or obtain a real source tree

- [x] Find an existing local `Sweet Home 3D` source checkout
- [x] If not present, find a downloaded source archive
- [x] If not present, acquire source before implementation begins

### 3. Choose the fork/work area

- [x] Decide where the local working fork should live
- [ ] Keep it separate from this planning/docs project
- [x] Confirm the source tree is writable and safe for iterative edits

### 4. Create safe branch strategy

- [x] Create a clean baseline branch from the source tree
- [x] Create a working branch for M0 / first spike work
- [x] Record branch naming convention for future spikes

Recommended branch style:

- `codex/sweethome3d-m0-foundation`
- `codex/sweethome3d-spike-16a`

### 5. Verify build/run path

- [x] Confirm required Java runtime / build tooling is available
- [x] Confirm the source project can build locally
- [ ] Confirm the locally built app can run
- [ ] Confirm we can test against the open-source `7.5` behavior

### 6. Establish first-code inspection targets

- [x] Identify likely classes for `SPIKE-16A`
- [x] Open actual source files, not just bundle classes
- [ ] Verify exact code touchpoints before editing

## Execution Status: August 14, 2026

### Completed

- Confirmed installed open-source app bundle:
  - `/Applications/Sweet Home 3D 7.5.app`
- Confirmed installed commercialized app also exists separately from the open-source testing target
- Confirmed `SPIKE-16A` remains the right first code target after `M0`
- Completed class-level discovery from:
  - `/Applications/Sweet Home 3D 7.5.app/Contents/app/SweetHome3D.jar`
- Verified the official source baseline is still `7.5`
  - the public `7.6` references appear tied to a rollback note, not a stable published source baseline
- Acquired the official `7.5` source archive:
  - `/Users/billfranklin/Documents/ChatGPT/Architecture Landscape CAD App/SweetHome3D-7.5-src.zip`
- Extracted the official `7.5` source tree:
  - `/Users/billfranklin/Documents/ChatGPT/Architecture Landscape CAD App/source/SweetHome3D-7.5-src`
- Confirmed the extracted source `README.TXT` identifies itself as:
  - `SWEET HOME 3D v 7.5`
- Confirmed the extracted source tree contains the real implementation files we need for Phase 1:
  - `src/com/eteks/sweethome3d/swing/FurnitureTable.java`
  - `src/com/eteks/sweethome3d/swing/HomePane.java`
  - `src/com/eteks/sweethome3d/swing/RoomPanel.java`
  - `src/com/eteks/sweethome3d/swing/PlanComponent.java`
  - `src/com/eteks/sweethome3d/model/HomePieceOfFurniture.java`
  - `src/com/eteks/sweethome3d/model/Level.java`
- Confirmed likely `SPIKE-16A` source touchpoints:
  - `FurnitureTable`
  - `FurnitureTablePanel`
  - `FurnitureTable$FurnitureTableColumnModel`
  - `HomePane`
  - `HomePieceOfFurniture`
- Confirmed local Java tools currently available:
  - `/usr/bin/java`
  - `/usr/bin/javac`
- Initialized a local git repo inside the official source tree:
  - `/Users/billfranklin/Documents/ChatGPT/Architecture Landscape CAD App/source/SweetHome3D-7.5-src/.git`
- Created the first working branch:
  - `codex/sweethome3d-m0-foundation`
- Created a pristine baseline import commit:
  - `16bf8f0` `Import official Sweet Home 3D 7.5 source baseline`
- Installed Apache Ant locally through Homebrew
- Added a modern local build target to `build.xml`:
  - `buildModernDesktop`
- Added a small `PlanComponent.java` compatibility shim so modern JDKs no longer require a compile-time `JApplet` class
- Verified successful local compilation with:
  - `ant buildModernDesktop`

### Blocked / Still Pending

- We do not yet have a separate code workspace outside this planning/docs project
- We do not yet have a verified local run workflow for source edits
- The stock legacy applet-aware build target still does not compile unchanged on modern JDKs
  - local development should use `buildModernDesktop`

### Additional Technical Finding

We now know the downloaded GitHub archive originally used for reference is **not** the right engineering baseline.

What we found:

- the older archive downloaded from:
  - `https://github.com/ralic/sweethome-3d/archive/refs/heads/master.zip`
  extracted successfully, but its `README.TXT` identifies itself as:
  - `SWEET HOME 3D v 5.4`
- that means it is useful only as an old reference snapshot, not as the main Phase 1 implementation base
- the correct implementation base is the official `7.5` source tree extracted under:
  - `/Users/billfranklin/Documents/ChatGPT/Architecture Landscape CAD App/source/SweetHome3D-7.5-src`

That reinforces the same conclusion:

- source baseline correctness comes before implementation

## Practical Recommendation

The next required step is:

1. initialize a local git repo inside the official `7.5` source tree
2. decide whether we keep this source tree inside the current planning workspace for now or relocate it later
3. decide whether we want to keep the modern desktop build target as a permanent local-dev target
4. verify a practical local run path from the compiled source tree
5. then continue with `SPIKE-16A`

## Suggested Working Layout

One clean option would be a separate engineering workspace such as:

- `/Users/billfranklin/Documents/ChatGPT/Architecture Landscape CAD App Code/SweetHome3D`

or another source-code folder you prefer.

Right now, because of workspace constraints, the practical temporary working location is:

- `/Users/billfranklin/Documents/ChatGPT/Architecture Landscape CAD App/source/SweetHome3D-7.5-src`

The ideal longer-term point is still:

- keep the code fork separate from this planning/documentation folder

## Exit Criteria for M0

`M0` is complete when all of the following are true:

- a real source tree exists locally
- a safe working location is chosen
- the project has a baseline branch and a working branch
- the source project can build/run locally
- we can open the real files behind `SPIKE-16A`

## Bottom Line

We are on track.

The most important remaining `M0` gap is no longer source discovery or compile setup. It is the final local run-path verification.
