include("scripts/library.js");
include("scripts/EAction.js");
include("scripts/File/NewFile/NewFile.js");

if (typeof LandscapeShellRuntime === "undefined" || isNull(LandscapeShellRuntime)) {
    var LandscapeShellRuntime = {
        latestScaleReference: undefined,
        shellPanel: undefined,
        activeScaleReferenceAction: undefined,
        activeWallToolAction: undefined,
        activeHostedPlacementAction: undefined,
        wallGuiAction: undefined,
        activeBuildingCommand: "Walls",
        focusedLibrarySection: undefined,
        wallDefaults: {
            thickness: 2,
            phase: "Proposed"
        },
        uiTimers: [],
        latestUnderlayImport: undefined,
        underlayEntityIds: []
    };
}
else {
    if (typeof LandscapeShellRuntime.wallGuiAction === "undefined") {
        LandscapeShellRuntime.wallGuiAction = undefined;
    }
    if (typeof LandscapeShellRuntime.activeHostedPlacementAction === "undefined") {
        LandscapeShellRuntime.activeHostedPlacementAction = undefined;
    }
    if (typeof LandscapeShellRuntime.activeBuildingCommand === "undefined") {
        LandscapeShellRuntime.activeBuildingCommand = "Walls";
    }
    if (typeof LandscapeShellRuntime.focusedLibrarySection === "undefined") {
        LandscapeShellRuntime.focusedLibrarySection = undefined;
    }
    if (typeof LandscapeShellRuntime.wallDefaults === "undefined" || isNull(LandscapeShellRuntime.wallDefaults)) {
        LandscapeShellRuntime.wallDefaults = {
            thickness: 2,
            phase: "Proposed"
        };
    }
    if (typeof LandscapeShellRuntime.uiTimers === "undefined" || isNull(LandscapeShellRuntime.uiTimers)) {
        LandscapeShellRuntime.uiTimers = [];
    }
}

if (typeof LandscapeShellConstants === "undefined" || isNull(LandscapeShellConstants)) {
    var LandscapeShellConstants = {
        UnderlayLayerName: "REFERENCE_UNDERLAY",
        UnderlayMaxDimension: 200,
        EnableStartupSmokeTest: false,
        BuildTag: "wall-v15"
    };
}

var LandscapeLibraryCatalog = {
    "Doors": [
        { id: "door-single-30", thumb: "[D]", label: "Single Swing 3-0", detail: "Standard single-swing exterior or interior door.", category: "Doors", hostType: "wall", defaultWidth: 3.0, openingWidth: 3.0, frameWidth: 3.0, swingType: "single", hingeSide: "left" },
        { id: "door-double-60", thumb: "[D]", label: "Double Door 6-0", detail: "Double door pair for wider entries and feature openings.", category: "Doors", hostType: "wall", defaultWidth: 6.0, openingWidth: 6.0, frameWidth: 6.0, swingType: "double", hingeSide: "center" },
        { id: "door-slider-60", thumb: "[D]", label: "Sliding Door 6-0", detail: "Wide glass slider for patios, lanais, or rear garden access.", category: "Doors", hostType: "wall", defaultWidth: 6.0, openingWidth: 6.0, frameWidth: 6.0, swingType: "slider", hingeSide: "none" }
    ],
    "Windows": [
        { id: "window-single-36", thumb: "[W]", label: "Single Window 3-0", detail: "Basic flat wall window for bedrooms and secondary spaces.", category: "Windows", hostType: "wall", defaultWidth: 3.0, openingWidth: 3.0, frameWidth: 3.0, windowType: "single" },
        { id: "window-double-60", thumb: "[W]", label: "Double Window 5-0", detail: "Wider paired window suited for living rooms and elevations.", category: "Windows", hostType: "wall", defaultWidth: 5.0, openingWidth: 5.0, frameWidth: 5.0, windowType: "double" },
        { id: "window-bay-72", thumb: "[W]", label: "Bay Window 6-0", detail: "Projecting bay-window option for feature spaces or frontage.", category: "Windows", hostType: "wall", defaultWidth: 6.0, openingWidth: 6.0, frameWidth: 6.0, windowType: "bay" }
    ],
    "Plants": [
        { id: "plant-canopy-tree", thumb: "[P]", label: "Canopy Tree", detail: "Large shade tree placeholder for landscape planning layouts." },
        { id: "plant-foundation-shrub", thumb: "[P]", label: "Foundation Shrub", detail: "Compact shrub massing block for perimeter planting beds." },
        { id: "plant-hedge-run", thumb: "[P]", label: "Hedge Run", detail: "Linear hedge element for screening, edges, and buffers." }
    ],
    "Outdoor": [
        { id: "outdoor-bench", thumb: "[O]", label: "Bench", detail: "Simple outdoor seating symbol for gardens and walk edges." },
        { id: "outdoor-table-set", thumb: "[O]", label: "Patio Table Set", detail: "Dining set placeholder for patios, lanais, and decks." },
        { id: "outdoor-grill", thumb: "[O]", label: "Grill Station", detail: "Outdoor grill symbol for kitchen, pool, or patio layouts." }
    ]
};

var LandscapeLibrarySections = [ "Doors", "Windows", "Plants", "Outdoor" ];

function getLibraryCatalogItemById(itemId) {
    if (isNull(itemId) || itemId==="") {
        return undefined;
    }

    for (var i=0; i<LandscapeLibrarySections.length; i++) {
        var sectionName = LandscapeLibrarySections[i];
        var items = LandscapeLibraryCatalog[sectionName];
        if (isNull(items)) {
            continue;
        }

        for (var j=0; j<items.length; j++) {
            if (items[j].id===itemId) {
                return items[j];
            }
        }
    }

    return undefined;
}

if (typeof LandscapeShellSkipBootstrap === "undefined") {
    var LandscapeShellSkipBootstrap = false;
}

function logLine(text) {
    var line = "[landscape-shell] " + text;
    print(line);

    try {
        var file = new QFile("/tmp/qcad-landscape-shell-prototype.log");
        if (!file.open(QIODevice.WriteOnly | QIODevice.Append | QIODevice.Text)) {
            print("[landscape-shell] log file open failed");
            return;
        }
        file.write(line + "\n");
        file.flush();
        file.close();
    }
    catch (e) {
        print("[landscape-shell] log write failed: " + e);
    }
}

function safeCall(label, fn) {
    try {
        var result = fn();
        logLine("[OK] " + label + (result!==undefined ? ": " + result : ""));
        return result;
    }
    catch (e) {
        logLine("[ERR] " + label + ": " + e);
        return undefined;
    }
}

function setNoFocus(widget) {
    if (isNull(widget)) {
        return;
    }

    try {
        widget.setFocusPolicy(Qt.NoFocus);
    }
    catch (e) {
    }
}

function setModeButtonAppearance(widget, active) {
    if (isNull(widget)) {
        return;
    }

    try {
        if (active===true) {
            widget.setStyleSheet("QPushButton { background-color: #dfeedd; border: 1px solid #6d8f67; border-radius: 6px; font-weight: bold; padding: 4px 8px; }");
        }
        else {
            widget.setStyleSheet("QPushButton { background-color: #ffffff; border: 1px solid #d4d0c8; border-radius: 6px; padding: 4px 8px; }");
        }
    }
    catch (e) {
    }
}

function setLibraryCategoryButtonAppearance(widget, active, architectural) {
    if (isNull(widget)) {
        return;
    }

    try {
        if (active===true && architectural===true) {
            widget.setStyleSheet("QPushButton { background-color: #e6efe7; border: 1px solid #5f8165; border-radius: 6px; font-weight: bold; padding: 3px 8px; }");
        }
        else if (active===true) {
            widget.setStyleSheet("QPushButton { background-color: #f2eadc; border: 1px solid #a98d61; border-radius: 6px; font-weight: bold; padding: 3px 8px; }");
        }
        else {
            widget.setStyleSheet("QPushButton { background-color: #fbfaf7; border: 1px solid #d8d2c8; border-radius: 6px; padding: 3px 8px; }");
        }
    }
    catch (e) {
    }
}

function setSectionLabelAppearance(widget, emphasis) {
    if (isNull(widget)) {
        return;
    }

    try {
        if (emphasis===true) {
            widget.setStyleSheet("QLabel { font-weight: bold; color: #31463a; letter-spacing: 0.5px; text-transform: uppercase; padding-top: 6px; }");
        }
        else {
            widget.setStyleSheet("QLabel { font-weight: bold; color: #59645c; padding-top: 2px; }");
        }
    }
    catch (e) {
    }
}

function setCaptionLabelAppearance(widget) {
    if (isNull(widget)) {
        return;
    }

    try {
        widget.setStyleSheet("QLabel { color: #6d726f; font-size: 11px; }");
    }
    catch (e) {
    }
}

function setPrimaryActionButtonAppearance(widget) {
    if (isNull(widget)) {
        return;
    }

    try {
        widget.setStyleSheet("QPushButton { background-color: #e8f1e4; border: 1px solid #7b9a75; border-radius: 6px; font-weight: bold; padding: 5px 10px; }");
    }
    catch (e) {
    }
}

function setSecondaryActionButtonAppearance(widget) {
    if (isNull(widget)) {
        return;
    }

    try {
        widget.setStyleSheet("QPushButton { background-color: #f8f6f1; border: 1px solid #cfc8bd; border-radius: 6px; padding: 4px 8px; }");
    }
    catch (e) {
    }
}

function setUtilityButtonAppearance(widget) {
    if (isNull(widget)) {
        return;
    }

    try {
        widget.setStyleSheet("QPushButton { background-color: #fcfbf8; border: 1px solid #ddd7ce; border-radius: 6px; color: #5c615d; padding: 3px 8px; }");
    }
    catch (e) {
    }
}

function setInputAppearance(widget) {
    if (isNull(widget)) {
        return;
    }

    try {
        widget.setStyleSheet("QLineEdit, QComboBox { background-color: #ffffff; border: 1px solid #cfc8bd; border-radius: 4px; padding: 3px 6px; }");
    }
    catch (e) {
    }
}

function retainUiTimer(timer) {
    if (isNull(timer)) {
        return;
    }

    LandscapeShellRuntime.uiTimers.push(timer);
}

function releaseUiTimer(timer) {
    if (isNull(timer) || isNull(LandscapeShellRuntime.uiTimers)) {
        return;
    }

    for (var i=LandscapeShellRuntime.uiTimers.length-1; i>=0; i--) {
        if (LandscapeShellRuntime.uiTimers[i]===timer) {
            LandscapeShellRuntime.uiTimers.splice(i, 1);
            break;
        }
    }
}

function scheduleUiCallback(delayMs, callback) {
    var timer = new QTimer();
    timer.interval = isNull(delayMs) ? 0 : delayMs;
    timer.singleShot = true;
    retainUiTimer(timer);
    timer.timeout.connect(function() {
        try {
            callback();
        }
        catch (e) {
            logLine("[ERR] scheduled UI callback failed: " + e);
        }

        try {
            timer.stop();
        }
        catch (e2) {
        }

        releaseUiTimer(timer);
    });
    timer.start();
    return timer;
}

function LandscapeShellPanel(parentWidget, appWin) {
    QWidget.call(this, parentWidget);
    this.appWin = appWin;

    var loader = new QUiLoader();
    loader.setWorkingDirectory(new QDir(LandscapeShellPanel.includeBasePath));

    var file = new QFile(LandscapeShellPanel.includeBasePath + "/landscape-shell-prototype.ui");
    file.open(makeQIODeviceOpenMode(QIODevice.ReadOnly, QIODevice.Text));
    this.form = loader.load(file, parentWidget);
    file.close();
    destr(loader);

    var layout = new QVBoxLayout();
    layout.addWidget(this.form, 0, Qt.AlignTop | Qt.AlignLeft);
    this.setLayout(layout);

    this.currentModeValue = this.form.findChild("CurrentModeValue");
    this.titleLabel = this.form.findChild("TitleLabel");
    this.buildLabel = this.form.findChild("BuildLabel");
    this.modeCaptionLabel = this.form.findChild("ModeCaptionLabel");
    this.siteSetupButton = this.form.findChild("SiteSetupButton");
    this.buildingButton = this.form.findChild("BuildingButton");
    this.plantingButton = this.form.findChild("PlantingButton");
    this.annotateButton = this.form.findChild("AnnotateButton");
    this.outputButton = this.form.findChild("OutputButton");
    this.drawingCoreLabel = this.form.findChild("DrawingCoreLabel");
    this.wallDefaultsLabel = this.form.findChild("WallDefaultsLabel");
    this.wallThicknessLabel = this.form.findChild("WallThicknessLabel");
    this.wallPhaseLabel = this.form.findChild("WallPhaseLabel");
    this.propertyLineButton = this.form.findChild("PropertyLineButton");
    this.wallsButton = this.form.findChild("WallsButton");
    this.doorsButton = this.form.findChild("DoorsButton");
    this.windowsButton = this.form.findChild("WindowsButton");
    this.rectangleButton = this.form.findChild("RectangleButton");
    this.offsetWallButton = this.form.findChild("OffsetWallButton");
    this.trimOpeningButton = this.form.findChild("TrimOpeningButton");
    this.curvedEdgeButton = this.form.findChild("CurvedEdgeButton");
    this.wallThicknessEdit = this.form.findChild("WallThicknessEdit");
    this.wallPhaseCombo = this.form.findChild("WallPhaseCombo");
    this.hideCadToolbarButton = this.form.findChild("HideCadToolbarButton");
    this.showCadToolbarButton = this.form.findChild("ShowCadToolbarButton");
    this.hideStatusBarButton = this.form.findChild("HideStatusBarButton");
    this.showStatusBarButton = this.form.findChild("ShowStatusBarButton");
    this.importUnderlayButton = this.form.findChild("ImportUnderlayButton");
    this.replaceUnderlayButton = this.form.findChild("ReplaceUnderlayButton");
    this.scaleReferenceButton = this.form.findChild("ScaleReferenceButton");
    this.hideUnderlayButton = this.form.findChild("HideUnderlayButton");
    this.showUnderlayButton = this.form.findChild("ShowUnderlayButton");
    this.lockUnderlayButton = this.form.findChild("LockUnderlayButton");
    this.unlockUnderlayButton = this.form.findChild("UnlockUnderlayButton");
    this.scaleReferenceStatusLabel = this.form.findChild("ScaleReferenceStatusLabel");
    this.libraryBrowserLabel = this.form.findChild("LibraryBrowserLabel");
    this.librarySectionCaptionLabel = this.form.findChild("LibrarySectionCaptionLabel");
    this.librarySectionValue = this.form.findChild("LibrarySectionValue");
    this.architecturalCategoriesLabel = this.form.findChild("ArchitecturalCategoriesLabel");
    this.generalCategoriesLabel = this.form.findChild("GeneralCategoriesLabel");
    this.libraryDoorsCategoryButton = this.form.findChild("LibraryDoorsCategoryButton");
    this.libraryWindowsCategoryButton = this.form.findChild("LibraryWindowsCategoryButton");
    this.libraryPlantsCategoryButton = this.form.findChild("LibraryPlantsCategoryButton");
    this.libraryOutdoorCategoryButton = this.form.findChild("LibraryOutdoorCategoryButton");
    this.libraryItemList = this.form.findChild("LibraryItemList");
    this.libraryItemDetailLabel = this.form.findChild("LibraryItemDetailLabel");
    this.placeSelectedLibraryItemButton = this.form.findChild("PlaceSelectedLibraryItemButton");
    this.hostedEditorLabel = this.form.findChild("HostedEditorLabel");
    this.hostedSelectionValueLabel = this.form.findChild("HostedSelectionValueLabel");
    this.hostedWidthLabel = this.form.findChild("HostedWidthLabel");
    this.hostedWidthEdit = this.form.findChild("HostedWidthEdit");
    this.applyHostedWidthButton = this.form.findChild("ApplyHostedWidthButton");
    this.hostedActionCombo = this.form.findChild("HostedActionCombo");
    this.runHostedActionButton = this.form.findChild("RunHostedActionButton");
    this.shellNotesLabel = this.form.findChild("ShellNotesLabel");
    this.currentLibraryItems = [];
    this.currentHostedSelectionKey = "";
    this.currentHostedSelectionInfo = undefined;

    try {
        if (!isNull(this.titleLabel)) {
            this.titleLabel.text = "Landscape Planner (" + LandscapeShellConstants.BuildTag + ")";
            this.titleLabel.setStyleSheet("QLabel { font-weight: bold; color: #24322a; font-size: 14px; padding-top: 2px; }");
        }
    }
    catch (eTitleLabel) {
    }

    try {
        if (!isNull(this.buildLabel)) {
            this.buildLabel.text = "Build: " + LandscapeShellConstants.BuildTag;
            this.buildLabel.setStyleSheet("QLabel { font-weight: bold; color: #39523f; padding: 4px 6px; border: 1px solid #bfcab7; background-color: #eef5e8; }");
        }
    }
    catch (eBuildLabel) {
    }

    setCaptionLabelAppearance(this.modeCaptionLabel);
    setCaptionLabelAppearance(this.librarySectionCaptionLabel);
    setCaptionLabelAppearance(this.wallThicknessLabel);
    setCaptionLabelAppearance(this.wallPhaseLabel);
    setCaptionLabelAppearance(this.hostedWidthLabel);

    try {
        if (!isNull(this.currentModeValue)) {
            this.currentModeValue.setStyleSheet("QLabel { font-weight: bold; color: #24322a; padding-bottom: 2px; }");
        }
    }
    catch (eCurrentModeValue) {
    }

    setSectionLabelAppearance(this.drawingCoreLabel, true);
    setSectionLabelAppearance(this.libraryBrowserLabel, true);
    setSectionLabelAppearance(this.hostedEditorLabel, true);
    setSectionLabelAppearance(this.shellNotesLabel, true);
    setSectionLabelAppearance(this.wallDefaultsLabel, false);
    setSectionLabelAppearance(this.architecturalCategoriesLabel, false);
    setSectionLabelAppearance(this.generalCategoriesLabel, false);

    try {
        if (!isNull(this.scaleReferenceStatusLabel)) {
            this.scaleReferenceStatusLabel.wordWrap = true;
            this.scaleReferenceStatusLabel.minimumHeight = 42;
            this.scaleReferenceStatusLabel.setStyleSheet("QLabel { padding: 6px; border: 1px solid #c8c1b6; background-color: #f7f2e8; }");
        }
    }
    catch (eStatusLabel) {
    }

    try {
        if (!isNull(this.librarySectionValue)) {
            this.librarySectionValue.setStyleSheet("QLabel { font-weight: bold; color: #39523f; }");
        }
    }
    catch (eLibrarySectionValue) {
    }

    try {
        if (!isNull(this.libraryItemDetailLabel)) {
            this.libraryItemDetailLabel.wordWrap = true;
            this.libraryItemDetailLabel.minimumHeight = 54;
            this.libraryItemDetailLabel.setStyleSheet("QLabel { padding: 6px; border: 1px solid #d3ccc2; background-color: #fbf7f1; }");
        }
    }
    catch (eLibraryDetail) {
    }

    try {
        if (!isNull(this.hostedSelectionValueLabel)) {
            this.hostedSelectionValueLabel.wordWrap = true;
            this.hostedSelectionValueLabel.minimumHeight = 40;
            this.hostedSelectionValueLabel.setStyleSheet("QLabel { padding: 6px; border: 1px solid #d3ccc2; background-color: #fbf7f1; }");
        }
    }
    catch (eHostedSelectionLabel) {
    }

    setInputAppearance(this.wallThicknessEdit);
    setInputAppearance(this.wallPhaseCombo);
    setInputAppearance(this.hostedWidthEdit);
    setInputAppearance(this.hostedActionCombo);

    setPrimaryActionButtonAppearance(this.placeSelectedLibraryItemButton);
    setPrimaryActionButtonAppearance(this.applyHostedWidthButton);
    setPrimaryActionButtonAppearance(this.runHostedActionButton);

    setSecondaryActionButtonAppearance(this.propertyLineButton);
    setSecondaryActionButtonAppearance(this.wallsButton);
    setSecondaryActionButtonAppearance(this.doorsButton);
    setSecondaryActionButtonAppearance(this.windowsButton);
    setSecondaryActionButtonAppearance(this.rectangleButton);
    setSecondaryActionButtonAppearance(this.offsetWallButton);
    setSecondaryActionButtonAppearance(this.trimOpeningButton);
    setSecondaryActionButtonAppearance(this.curvedEdgeButton);

    setUtilityButtonAppearance(this.importUnderlayButton);
    setUtilityButtonAppearance(this.replaceUnderlayButton);
    setUtilityButtonAppearance(this.scaleReferenceButton);
    setUtilityButtonAppearance(this.hideUnderlayButton);
    setUtilityButtonAppearance(this.showUnderlayButton);
    setUtilityButtonAppearance(this.lockUnderlayButton);
    setUtilityButtonAppearance(this.unlockUnderlayButton);
    setUtilityButtonAppearance(this.hideCadToolbarButton);
    setUtilityButtonAppearance(this.showCadToolbarButton);
    setUtilityButtonAppearance(this.hideStatusBarButton);
    setUtilityButtonAppearance(this.showStatusBarButton);

    var panel = this;

    setNoFocus(this.siteSetupButton);
    setNoFocus(this.buildingButton);
    setNoFocus(this.plantingButton);
    setNoFocus(this.annotateButton);
    setNoFocus(this.outputButton);
    setNoFocus(this.propertyLineButton);
    setNoFocus(this.wallsButton);
    setNoFocus(this.doorsButton);
    setNoFocus(this.windowsButton);
    setNoFocus(this.rectangleButton);
    setNoFocus(this.offsetWallButton);
    setNoFocus(this.trimOpeningButton);
    setNoFocus(this.curvedEdgeButton);
    setNoFocus(this.hideCadToolbarButton);
    setNoFocus(this.showCadToolbarButton);
    setNoFocus(this.hideStatusBarButton);
    setNoFocus(this.showStatusBarButton);
    setNoFocus(this.importUnderlayButton);
    setNoFocus(this.replaceUnderlayButton);
    setNoFocus(this.scaleReferenceButton);
    setNoFocus(this.hideUnderlayButton);
    setNoFocus(this.showUnderlayButton);
    setNoFocus(this.lockUnderlayButton);
    setNoFocus(this.unlockUnderlayButton);
    setNoFocus(this.libraryDoorsCategoryButton);
    setNoFocus(this.libraryWindowsCategoryButton);
    setNoFocus(this.libraryPlantsCategoryButton);
    setNoFocus(this.libraryOutdoorCategoryButton);
    setNoFocus(this.placeSelectedLibraryItemButton);
    setNoFocus(this.applyHostedWidthButton);
    setNoFocus(this.hostedActionCombo);
    setNoFocus(this.runHostedActionButton);

    this.siteSetupButton.clicked.connect(function() {
        panel.setMode("Site Setup");
    });
    this.buildingButton.clicked.connect(function() {
        panel.setMode("Building");
    });
    this.plantingButton.clicked.connect(function() {
        panel.setMode("Planting");
    });
    this.annotateButton.clicked.connect(function() {
        panel.setMode("Annotate");
    });
    this.outputButton.clicked.connect(function() {
        panel.setMode("Output");
    });
    this.propertyLineButton.clicked.connect(function() {
        panel.launchNativeDraftAction("DrawPolylineProAction", "Property line tool ready. Click into the drawing.", "Site Setup");
    });
    this.wallsButton.pressed.connect(function() {
        panel.launchWallToolActionFromDockPress();
    });
    this.doorsButton.clicked.connect(function() {
        panel.focusArchitecturalLibrarySection("Doors", "Doors");
    });
    this.windowsButton.clicked.connect(function() {
        panel.focusArchitecturalLibrarySection("Windows", "Windows");
    });
    this.rectangleButton.clicked.connect(function() {
        panel.launchNativeDraftAction("ShapeRectanglePPAction", "Rectangle tool ready. Click into the drawing.", "Building");
    });
    this.offsetWallButton.clicked.connect(function() {
        panel.launchNativeDraftAction("OffsetProAction", "Offset wall tool ready. Select a source edge.", "Building");
    });
    this.trimOpeningButton.clicked.connect(function() {
        panel.launchOpeningGapAction();
    });
    this.curvedEdgeButton.clicked.connect(function() {
        panel.launchNativeDraftAction("Arc3PAction", "Curved edge tool ready. Pick three points.", "Building");
    });

    this.hideCadToolbarButton.clicked.connect(function() {
        panel.toggleShellPiece("CadToolBar", false);
    });
    this.showCadToolbarButton.clicked.connect(function() {
        panel.toggleShellPiece("CadToolBar", true);
    });
    this.hideStatusBarButton.clicked.connect(function() {
        panel.toggleShellPiece("StatusBar", false);
    });
    this.showStatusBarButton.clicked.connect(function() {
        panel.toggleShellPiece("StatusBar", true);
    });
    this.importUnderlayButton.clicked.connect(function() {
        panel.importUnderlay();
    });
    this.replaceUnderlayButton.clicked.connect(function() {
        panel.replaceUnderlay();
    });
    this.scaleReferenceButton.clicked.connect(function() {
        panel.launchScaleReferenceAction();
    });
    this.hideUnderlayButton.clicked.connect(function() {
        panel.setUnderlayVisible(false);
    });
    this.showUnderlayButton.clicked.connect(function() {
        panel.setUnderlayVisible(true);
    });
    this.lockUnderlayButton.clicked.connect(function() {
        panel.setUnderlayLocked(true);
    });
    this.unlockUnderlayButton.clicked.connect(function() {
        panel.setUnderlayLocked(false);
    });

    try {
        this.libraryDoorsCategoryButton.clicked.connect(function() {
            panel.focusLibrarySection("Doors");
        });
        this.libraryWindowsCategoryButton.clicked.connect(function() {
            panel.focusLibrarySection("Windows");
        });
        this.libraryPlantsCategoryButton.clicked.connect(function() {
            panel.focusLibrarySection("Plants");
        });
        this.libraryOutdoorCategoryButton.clicked.connect(function() {
            panel.focusLibrarySection("Outdoor");
        });
    }
    catch (eLibraryButtons) {
    }

    try {
        if (!isNull(this.libraryItemList)) {
            this.libraryItemList.currentRowChanged.connect(function(row) {
                panel.updateLibraryItemDetail(row);
            });
            this.libraryItemList.itemDoubleClicked.connect(function() {
                panel.launchHostedPlacementFromLibrary();
            });
        }
    }
    catch (eLibraryList) {
    }

    try {
        if (!isNull(this.placeSelectedLibraryItemButton)) {
            this.placeSelectedLibraryItemButton.pressed.connect(function() {
                logLine("[OK] place-selected button pressed");
                panel.launchHostedPlacementFromLibrary();
            });
        }
    }
    catch (ePlaceSelectedLibraryItemButton) {
    }

    try {
        if (!isNull(this.applyHostedWidthButton)) {
            this.applyHostedWidthButton.clicked.connect(function() {
                panel.applyHostedWidthFromEditor();
            });
        }
    }
    catch (eApplyHostedWidthButton) {
    }

    try {
        if (!isNull(this.hostedActionCombo)) {
            this.hostedActionCombo.currentIndexChanged.connect(function() {
                panel.updateHostedActionButtonLabel();
            });
        }
    }
    catch (eHostedActionCombo) {
    }

    try {
        if (!isNull(this.runHostedActionButton)) {
            this.runHostedActionButton.clicked.connect(function() {
                panel.runHostedActionFromEditor();
            });
        }
    }
    catch (eRunHostedActionButton) {
    }

    try {
        this.wallThicknessEdit.editingFinished.connect(function() {
            panel.syncActiveWallToolFromDefaults();
            panel.scheduleFocusDrawingView(20);
        });
    }
    catch (e) {
    }

    try {
        this.wallPhaseCombo.currentIndexChanged.connect(function() {
            panel.syncActiveWallToolFromDefaults();
            panel.scheduleFocusDrawingView(20);
        });
    }
    catch (e2) {
    }

    this.focusLibrarySection("Doors", undefined, false);
    this.updateHostedSelectionUi(undefined);
    this.startHostedSelectionMonitor();
}

LandscapeShellPanel.prototype = new QWidget();
LandscapeShellPanel.includeBasePath = includeBasePath;

LandscapeShellPanel.prototype.setMode = function(modeName) {
    if (!isNull(this.currentModeValue)) {
        this.currentModeValue.text = modeName;
    }

    setModeButtonAppearance(this.siteSetupButton, modeName==="Site Setup");
    setModeButtonAppearance(this.buildingButton, modeName==="Building");
    setModeButtonAppearance(this.plantingButton, modeName==="Planting");
    setModeButtonAppearance(this.annotateButton, modeName==="Annotate");
    setModeButtonAppearance(this.outputButton, modeName==="Output");

    if (!isNull(this.scaleReferenceStatusLabel)) {
        this.scaleReferenceStatusLabel.text = "Mode changed to " + modeName + ".";
    }

    safeCall("set mode " + modeName, function() {
        return modeName;
    });
};

LandscapeShellPanel.prototype.setActiveBuildingCommand = function(commandName) {
    LandscapeShellRuntime.activeBuildingCommand = commandName;
    logLine("[OK] active building command set: " + commandName);
};

LandscapeShellPanel.prototype.getLibraryItemsForSection = function(sectionName) {
    if (isNull(sectionName) || !LandscapeLibraryCatalog.hasOwnProperty(sectionName)) {
        return [];
    }

    return LandscapeLibraryCatalog[sectionName];
};

LandscapeShellPanel.prototype.updateLibraryCategoryButtons = function(sectionName) {
    setLibraryCategoryButtonAppearance(this.libraryDoorsCategoryButton, sectionName==="Doors", true);
    setLibraryCategoryButtonAppearance(this.libraryWindowsCategoryButton, sectionName==="Windows", true);
    setLibraryCategoryButtonAppearance(this.libraryPlantsCategoryButton, sectionName==="Plants", false);
    setLibraryCategoryButtonAppearance(this.libraryOutdoorCategoryButton, sectionName==="Outdoor", false);
};

LandscapeShellPanel.prototype.updateLibraryItemDetail = function(row) {
    if (isNull(this.libraryItemDetailLabel)) {
        return;
    }

    if (isNull(row) || row<0 || row>=this.currentLibraryItems.length) {
        this.libraryItemDetailLabel.text = "Select a library item.";
        this.updateHostedPlacementButtonState();
        return;
    }

    var item = this.currentLibraryItems[row];
    this.libraryItemDetailLabel.text = item.thumb + " " + item.label + "\n" + item.detail;
    this.updateHostedPlacementButtonState();
};

LandscapeShellPanel.prototype.getSelectedLibraryItem = function() {
    if (isNull(this.libraryItemList) || isNull(this.currentLibraryItems)) {
        return undefined;
    }

    var row = -1;
    try {
        row = this.libraryItemList.currentRow;
    }
    catch (e) {
    }

    if (isNull(row) || row<0 || row>=this.currentLibraryItems.length) {
        return undefined;
    }

    return this.currentLibraryItems[row];
};

LandscapeShellPanel.prototype.updateHostedPlacementButtonState = function() {
    if (isNull(this.placeSelectedLibraryItemButton)) {
        return;
    }

    var item = this.getSelectedLibraryItem();
    var enabled = !isNull(item) &&
        (item.category==="Doors" || item.category==="Windows") &&
        item.hostType==="wall";

    try {
        if (typeof this.placeSelectedLibraryItemButton.setEnabled === "function") {
            this.placeSelectedLibraryItemButton.setEnabled(enabled);
        }
        else {
            this.placeSelectedLibraryItemButton.enabled = enabled;
        }
    }
    catch (e) {
    }

    try {
        this.placeSelectedLibraryItemButton.text = enabled ?
            "Place Selected on Wall" :
            "Hosted placement only for Doors / Windows";
    }
    catch (e2) {
    }
};

LandscapeShellPanel.prototype.setHostedEditorEnabled = function(enabled) {
    try {
        if (!isNull(this.hostedActionCombo)) {
            this.hostedActionCombo.setEnabled(enabled);
        }
    }
    catch (e0) {
    }

    try {
        if (!isNull(this.hostedWidthEdit)) {
            this.hostedWidthEdit.setEnabled(enabled);
        }
    }
    catch (e1) {
    }

    try {
        if (!isNull(this.applyHostedWidthButton)) {
            this.applyHostedWidthButton.setEnabled(enabled);
        }
    }
    catch (e2) {
    }

    try {
        if (!isNull(this.runHostedActionButton)) {
            this.runHostedActionButton.setEnabled(enabled);
        }
    }
    catch (eRun) {
    }

    try {
        this.updateHostedActionButtonLabel();
    }
    catch (e3) {
    }
};

LandscapeShellPanel.prototype.updateHostedSelectionUi = function(info) {
    this.currentHostedSelectionInfo = info;
    this.currentHostedSelectionKey = isNull(info) ? "" : String(info.objectId);

    if (isNull(info)) {
        if (!isNull(this.hostedSelectionValueLabel)) {
            this.hostedSelectionValueLabel.text = "Select a placed door or window. This editor updates automatically.";
        }
        if (!isNull(this.hostedWidthEdit)) {
            this.hostedWidthEdit.text = "";
        }
        this.populateHostedActionChoices(undefined);
        this.setHostedEditorEnabled(false);
        return;
    }

    if (!isNull(this.hostedSelectionValueLabel)) {
        this.hostedSelectionValueLabel.text =
            info.libraryItem.label + "\nWall: " + info.groupId;
    }
    if (!isNull(this.hostedWidthEdit)) {
        this.hostedWidthEdit.text = String(info.openingWidth);
    }
    this.populateHostedActionChoices(info);
    this.setHostedEditorEnabled(true);
};

LandscapeShellPanel.prototype.populateHostedActionChoices = function(info) {
    if (isNull(this.hostedActionCombo)) {
        return;
    }

    var previousText = "";
    try {
        if (typeof this.hostedActionCombo.currentText === "function") {
            previousText = String(this.hostedActionCombo.currentText());
        }
        else if (!isNull(this.hostedActionCombo.currentText)) {
            previousText = String(this.hostedActionCombo.currentText);
        }
    }
    catch (ePrev) {
    }

    try {
        this.hostedActionCombo.clear();
        if (isNull(info)) {
            this.updateHostedActionButtonLabel();
            return;
        }

        this.hostedActionCombo.addItem("Reposition on Wall");
        if (isSingleSwingDoorItem(info.libraryItem)) {
            this.hostedActionCombo.addItem("Flip Swing");
        }
        this.hostedActionCombo.addItem("Remove");

        var matchIndex = -1;
        for (var i=0; i<this.hostedActionCombo.count; i++) {
            var itemText = "";
            try {
                itemText = String(this.hostedActionCombo.itemText(i));
            }
            catch (eItemText) {
            }
            if (itemText===previousText) {
                matchIndex = i;
                break;
            }
        }

        if (matchIndex>=0) {
            this.hostedActionCombo.setCurrentIndex(matchIndex);
        }
        else {
            this.hostedActionCombo.setCurrentIndex(0);
        }
    }
    catch (e) {
        logLine("[ERR] populate hosted action choices failed: " + e);
    }

    this.updateHostedActionButtonLabel();
};

LandscapeShellPanel.prototype.getCurrentHostedActionText = function() {
    if (isNull(this.hostedActionCombo)) {
        return "";
    }

    try {
        if (typeof this.hostedActionCombo.currentText === "function") {
            return String(this.hostedActionCombo.currentText());
        }
        if (!isNull(this.hostedActionCombo.currentText)) {
            return String(this.hostedActionCombo.currentText);
        }
    }
    catch (e) {
    }

    return "";
};

LandscapeShellPanel.prototype.updateHostedActionButtonLabel = function() {
    if (isNull(this.runHostedActionButton)) {
        return;
    }

    var text = this.getCurrentHostedActionText();
    if (text==="Reposition on Wall") {
        this.runHostedActionButton.text = "Start Reposition";
    }
    else if (text==="Flip Swing") {
        this.runHostedActionButton.text = "Flip Swing";
    }
    else if (text==="Remove") {
        this.runHostedActionButton.text = "Remove";
    }
    else {
        this.runHostedActionButton.text = "Run Action";
    }
};

LandscapeShellPanel.prototype.runHostedActionFromEditor = function() {
    var actionText = this.getCurrentHostedActionText();

    if (actionText==="Reposition on Wall") {
        return this.startHostedRepositionFromEditor();
    }

    if (actionText==="Flip Swing") {
        return this.flipHostedDoorFromEditor();
    }

    if (actionText==="Remove") {
        return this.removeHostedItemFromEditor();
    }

    this.setScaleReferenceStatus("Select a hosted action first.");
    return false;
};

LandscapeShellPanel.prototype.getSelectedHostedEntityInfo = function() {
    var di = EAction.getDocumentInterface();
    if (isNull(di)) {
        return undefined;
    }

    var doc = di.getDocument();
    if (isNull(doc) || typeof doc.querySelectedEntities !== "function") {
        return undefined;
    }

    var ids = doc.querySelectedEntities();
    if (isNull(ids) || ids.length===0) {
        return undefined;
    }

    for (var i=0; i<ids.length; i++) {
        var entity = doc.queryEntity(ids[i]);
        if (isNull(entity)) {
            continue;
        }

        var groupId = String(getAppCustomProperty(entity, "hostWallId", ""));
        if (groupId==="") {
            continue;
        }

        var libraryItemId = String(getAppCustomProperty(entity, "libraryItemId", ""));
        var libraryItem = getLibraryCatalogItemById(libraryItemId);
        if (isNull(libraryItem)) {
            continue;
        }

        var openingWidth = parseFloat(getAppCustomProperty(entity, "openingWidth", ""));
        if (isNaN(openingWidth) || openingWidth<=0) {
            openingWidth = parseFloat(libraryItem.openingWidth);
        }

        return {
            entityId: ids[i],
            objectId: String(getAppCustomProperty(entity, "hostObjectId", "")),
            groupId: groupId,
            libraryItemId: libraryItemId,
            libraryItem: cloneLibraryItemWithOverrides(
                cloneLibraryItemWithWidth(libraryItem, openingWidth),
                {
                    hingeSide: String(getAppCustomProperty(entity, "hostHingeSide", libraryItem.hingeSide || ""))
                }
            ),
            openingWidth: openingWidth,
            centerT: parseFloat(getAppCustomProperty(entity, "hostDistanceAlongWall", "")),
            faceSide: String(getAppCustomProperty(entity, "hostFaceSide", ""))
        };
    }

    return undefined;
};

LandscapeShellPanel.prototype.refreshHostedSelectionFromCurrentDocument = function(forceStatus) {
    var info = this.getSelectedHostedEntityInfo();
    var nextKey = isNull(info) ? "" : String(info.objectId);
    if (nextKey===this.currentHostedSelectionKey && forceStatus!==true) {
        return;
    }

    this.updateHostedSelectionUi(info);
    if (forceStatus===true) {
        this.setScaleReferenceStatus(isNull(info) ?
            "Select a placed door or window first." :
            "Hosted item selected: " + info.libraryItem.label + ".");
    }
};

LandscapeShellPanel.prototype.startHostedSelectionMonitor = function() {
    var panel = this;
    var timer = new QTimer();
    timer.interval = 400;
    timer.singleShot = false;
    retainUiTimer(timer);
    timer.timeout.connect(function() {
        try {
            panel.refreshHostedSelectionFromCurrentDocument(false);
        }
        catch (e) {
            logLine("[ERR] hosted selection monitor failed: " + e);
        }
    });
    timer.start();
};

LandscapeShellPanel.prototype.applyHostedWidthFromEditor = function() {
    var selectedInfo = this.currentHostedSelectionInfo;
    if (isNull(selectedInfo)) {
        selectedInfo = this.getSelectedHostedEntityInfo();
    }
    if (isNull(selectedInfo)) {
        this.setScaleReferenceStatus("Select a placed door or window first.");
        return false;
    }

    var newWidth = NaN;
    try {
        if (!isNull(this.hostedWidthEdit) && !isNull(this.hostedWidthEdit.text)) {
            newWidth = parseFloat(String(this.hostedWidthEdit.text));
        }
    }
    catch (e) {
    }

    if (isNaN(newWidth) || newWidth<=0) {
        this.setScaleReferenceStatus("Enter a valid hosted width.");
        return false;
    }

    var di = EAction.getDocumentInterface();
    if (isNull(di)) {
        this.setScaleReferenceStatus("No active drawing is available.");
        return false;
    }

    var document = di.getDocument();
    if (isNull(document)) {
        this.setScaleReferenceStatus("No active drawing is available.");
        return false;
    }

    var helperAction = new HostedLibraryPlacementAction(undefined, this, selectedInfo.libraryItem);
    var buildResult = helperAction.buildHostedWidthEditOperations(document, di, selectedInfo, newWidth);
    if (!isNull(buildResult.error)) {
        this.setScaleReferenceStatus(buildResult.error);
        logLine("[ERR] hosted width edit: " + buildResult.error);
        return false;
    }

    di.applyOperation(buildResult.deleteOp);
    di.applyOperation(buildResult.wallAddOp);
    di.applyOperation(buildResult.symbolAddOp);
    forceDocumentRedraw(di);

    var updatedInfo = {
        entityId: selectedInfo.entityId,
        objectId: selectedInfo.objectId,
        groupId: selectedInfo.groupId,
        libraryItemId: selectedInfo.libraryItemId,
        libraryItem: cloneLibraryItemWithOverrides(
            cloneLibraryItemWithWidth(selectedInfo.libraryItem, newWidth),
            {
                hingeSide: selectedInfo.libraryItem.hingeSide
            }
        ),
        openingWidth: newWidth,
        centerT: selectedInfo.centerT,
        faceSide: selectedInfo.faceSide
    };
    this.updateHostedSelectionUi(updatedInfo);
    this.setScaleReferenceStatus(updatedInfo.libraryItem.label + " width updated to " + newWidth.toFixed(2) + ".");
    logLine("[OK] hosted width updated: object=" + selectedInfo.objectId + ", width=" + newWidth.toFixed(2));
    return true;
};

LandscapeShellPanel.prototype.removeHostedItemFromEditor = function() {
    var selectedInfo = this.currentHostedSelectionInfo;
    if (isNull(selectedInfo)) {
        selectedInfo = this.getSelectedHostedEntityInfo();
    }
    if (isNull(selectedInfo)) {
        this.setScaleReferenceStatus("Select a placed door or window first.");
        return false;
    }

    var di = EAction.getDocumentInterface();
    if (isNull(di)) {
        this.setScaleReferenceStatus("No active drawing is available.");
        return false;
    }

    var document = di.getDocument();
    if (isNull(document)) {
        this.setScaleReferenceStatus("No active drawing is available.");
        return false;
    }

    var helperAction = new HostedLibraryPlacementAction(undefined, this, selectedInfo.libraryItem);
    var buildResult = helperAction.buildHostedRemovalOperations(document, di, selectedInfo);
    if (!isNull(buildResult.error)) {
        this.setScaleReferenceStatus(buildResult.error);
        logLine("[ERR] hosted removal: " + buildResult.error);
        return false;
    }

    di.applyOperation(buildResult.deleteOp);
    di.applyOperation(buildResult.wallAddOp);
    forceDocumentRedraw(di);

    this.updateHostedSelectionUi(undefined);
    this.setScaleReferenceStatus(selectedInfo.libraryItem.label + " removed from wall.");
    logLine("[OK] hosted item removed: object=" + selectedInfo.objectId);
    return true;
};

LandscapeShellPanel.prototype.flipHostedDoorFromEditor = function() {
    var selectedInfo = this.currentHostedSelectionInfo;
    if (isNull(selectedInfo)) {
        selectedInfo = this.getSelectedHostedEntityInfo();
    }
    if (isNull(selectedInfo)) {
        this.setScaleReferenceStatus("Select a placed door first.");
        return false;
    }

    if (!isSingleSwingDoorItem(selectedInfo.libraryItem)) {
        this.setScaleReferenceStatus("Flip Swing currently works for single-swing doors only.");
        return false;
    }

    var di = EAction.getDocumentInterface();
    if (isNull(di)) {
        this.setScaleReferenceStatus("No active drawing is available.");
        return false;
    }

    var document = di.getDocument();
    if (isNull(document)) {
        this.setScaleReferenceStatus("No active drawing is available.");
        return false;
    }

    var helperAction = new HostedLibraryPlacementAction(undefined, this, selectedInfo.libraryItem);
    var buildResult = helperAction.buildHostedFlipOperations(document, di, selectedInfo);
    if (!isNull(buildResult.error)) {
        this.setScaleReferenceStatus(buildResult.error);
        logLine("[ERR] hosted flip: " + buildResult.error);
        return false;
    }

    di.applyOperation(buildResult.deleteOp);
    di.applyOperation(buildResult.wallAddOp);
    di.applyOperation(buildResult.symbolAddOp);
    forceDocumentRedraw(di);

    var updatedInfo = {
        entityId: selectedInfo.entityId,
        objectId: selectedInfo.objectId,
        groupId: selectedInfo.groupId,
        libraryItemId: selectedInfo.libraryItemId,
        libraryItem: buildResult.updatedHostedObject.libraryItem,
        openingWidth: buildResult.updatedHostedObject.openingWidth,
        centerT: buildResult.updatedHostedObject.centerT,
        faceSide: buildResult.updatedHostedObject.faceSide
    };
    this.updateHostedSelectionUi(updatedInfo);
    this.setScaleReferenceStatus(updatedInfo.libraryItem.label + " swing flipped to " + updatedInfo.libraryItem.hingeSide + ".");
    logLine("[OK] hosted swing flipped: object=" + selectedInfo.objectId + ", hinge=" + updatedInfo.libraryItem.hingeSide);
    return true;
};

LandscapeShellPanel.prototype.startHostedRepositionFromEditor = function() {
    var selectedInfo = this.currentHostedSelectionInfo;
    if (isNull(selectedInfo)) {
        selectedInfo = this.getSelectedHostedEntityInfo();
    }
    if (isNull(selectedInfo)) {
        this.setScaleReferenceStatus("Select a placed door or window first.");
        return false;
    }

    ensureActiveDocument();
    this.cancelActiveWallToolAction();
    this.cancelActiveHostedPlacementAction();
    this.setMode("Building");
    this.setActiveBuildingCommand(selectedInfo.libraryItem.category);

    var action = new HostedRepositionAction(undefined, this, selectedInfo);
    var di = EAction.getDocumentInterface();

    try {
        if (!isNull(di)) {
            di.setCurrentAction(action);
        }
        else {
            action.beginEvent();
        }
    }
    catch (e) {
        logLine("[ERR] failed to launch hosted reposition action: " + e);
        this.setScaleReferenceStatus("Could not start hosted reposition.");
        return false;
    }

    this.setScaleReferenceStatus("Click a new wall edge position for " + selectedInfo.libraryItem.label + ".");
    this.focusDrawingView();
    this.scheduleFocusDrawingView(25);
    logLine("[OK] hosted reposition launched: object=" + selectedInfo.objectId);
    return true;
};

LandscapeShellPanel.prototype.focusLibrarySection = function(sectionName, preferredItemId, updateStatus) {
    if (LandscapeLibrarySections.indexOf(sectionName)===-1) {
        sectionName = "Doors";
    }

    LandscapeShellRuntime.focusedLibrarySection = sectionName;

    if (!isNull(this.librarySectionValue)) {
        this.librarySectionValue.text = sectionName;
    }

    this.updateLibraryCategoryButtons(sectionName);

    var items = this.getLibraryItemsForSection(sectionName);
    this.currentLibraryItems = items;

    if (!isNull(this.libraryItemList)) {
        this.libraryItemList.clear();

        var preferredIndex = 0;
        for (var i=0; i<items.length; i++) {
            var catalogItem = items[i];
            var listItem = new QListWidgetItem(catalogItem.thumb + "  " + catalogItem.label);
            this.libraryItemList.addItem(listItem);

            if (!isNull(preferredItemId) && catalogItem.id===preferredItemId) {
                preferredIndex = i;
            }
        }

        if (items.length>0) {
            this.libraryItemList.setCurrentRow(preferredIndex);
            this.updateLibraryItemDetail(preferredIndex);
        }
        else {
            this.updateLibraryItemDetail(-1);
        }
    }
    else {
        this.updateLibraryItemDetail(items.length>0 ? 0 : -1);
    }

    this.updateHostedPlacementButtonState();

    if (updateStatus!==false) {
        this.setScaleReferenceStatus("Library focused: " + sectionName + ".");
    }

    logLine("[OK] library section focused: " + sectionName + ", items=" + items.length);
};

LandscapeShellPanel.prototype.launchHostedPlacementFromLibrary = function() {
    var item = this.getSelectedLibraryItem();
    if (isNull(item)) {
        this.setScaleReferenceStatus("Select a library item first.");
        return false;
    }

    if (!(item.category==="Doors" || item.category==="Windows") || item.hostType!=="wall") {
        this.setScaleReferenceStatus("Hosted placement is available only for Doors and Windows in this prototype.");
        return false;
    }

    ensureActiveDocument();
    this.cancelActiveWallToolAction();
    this.setMode("Building");
    this.setActiveBuildingCommand(item.category);

    var action = new HostedLibraryPlacementAction(undefined, this, item);
    var di = EAction.getDocumentInterface();

    try {
        if (!isNull(di)) {
            di.setCurrentAction(action);
        }
        else {
            action.beginEvent();
        }
    }
    catch (e) {
        logLine("[ERR] failed to launch hosted placement action: " + e);
        this.setScaleReferenceStatus("Could not start hosted placement.");
        return false;
    }

    this.setScaleReferenceStatus("Place " + item.label + " on a wall. Click a wall edge.");
    this.focusDrawingView();
    this.scheduleFocusDrawingView(25);
    logLine("[OK] hosted placement launched for library item: " + item.id);
    return true;
};

LandscapeShellPanel.prototype.focusArchitecturalLibrarySection = function(sectionName, commandName) {
    this.cancelActiveWallToolAction();
    this.cancelActiveHostedPlacementAction();
    this.setMode("Building");
    this.setActiveBuildingCommand(commandName);
    this.focusLibrarySection(sectionName, undefined, false);
    this.setScaleReferenceStatus(commandName + " ready. Focus architectural library section: " + sectionName + ".");
    this.scheduleFocusDrawingView(20);
};

LandscapeShellPanel.prototype.getWallsReadyStatusText = function() {
    var thickness = this.getWallThickness();
    var phase = this.getWallPhase();
    var thicknessText = isNull(thickness) ? "?" : thickness.toFixed(2);
    return "Walls tool ready. Draw exterior or interior walls. Thickness " + thicknessText + ", phase " + phase + ".";
};

LandscapeShellPanel.prototype.triggerObject = function(objectName) {
    var object = this.appWin.findChild(objectName);
    if (isNull(object)) {
        logLine("[ERR] native action not found: " + objectName);
        return false;
    }

    try {
        if (typeof object.slotTrigger === "function") {
            object.slotTrigger();
            return true;
        }
    }
    catch (e) {
    }

    try {
        if (typeof object.trigger === "function") {
            object.trigger();
            return true;
        }
    }
    catch (e2) {
    }

    try {
        if (typeof object.activate === "function") {
            object.activate(QAction.Trigger);
            return true;
        }
    }
    catch (e3) {
    }

    try {
        if (typeof object.click === "function") {
            object.click();
            return true;
        }
    }
    catch (e4) {
    }

    logLine("[ERR] native action could not be triggered: " + objectName);
    return false;
};

LandscapeShellPanel.prototype.launchNativeDraftAction = function(objectName, readyText, modeName) {
    ensureActiveDocument();
    this.cancelActiveWallToolAction();
    this.cancelActiveHostedPlacementAction();

    if (!isNull(modeName) && modeName!=="") {
        this.setMode(modeName);
    }

    if (this.triggerObject(objectName)) {
        this.setScaleReferenceStatus(readyText);
        EAction.activateMainWindow();
        logLine("[OK] launched native draft action: " + objectName);
        return true;
    }

    this.setScaleReferenceStatus("Could not launch " + objectName + ".");
    return false;
};

LandscapeShellPanel.prototype.getWallThickness = function() {
    var raw = "2";

    try {
        if (!isNull(this.wallThicknessEdit) && !isNull(this.wallThicknessEdit.text)) {
            raw = String(this.wallThicknessEdit.text);
        }
    }
    catch (e) {
    }

    var parsed = parseFloat(raw);
    if (isNaN(parsed) || parsed<=0) {
        return undefined;
    }

    return parsed;
};

LandscapeShellPanel.prototype.getWallPhase = function() {
    try {
        if (!isNull(this.wallPhaseCombo)) {
            if (typeof this.wallPhaseCombo.currentText === "function") {
                return String(this.wallPhaseCombo.currentText());
            }
            if (!isNull(this.wallPhaseCombo.currentText)) {
                return String(this.wallPhaseCombo.currentText);
            }
        }
    }
    catch (e) {
    }

    return "Proposed";
};

LandscapeShellPanel.prototype.persistWallDefaults = function() {
    var thickness = this.getWallThickness();
    var phase = this.getWallPhase();

    if (!isNull(thickness) && thickness>0) {
        LandscapeShellRuntime.wallDefaults.thickness = thickness;
    }
    LandscapeShellRuntime.wallDefaults.phase = phase;
};

LandscapeShellPanel.prototype.focusDrawingView = function() {
    EAction.activateMainWindow();
    ensureGraphicsViewWrappersInitialized();

    try {
        if (!isNull(this.form) && typeof this.form.clearFocus === "function") {
            this.form.clearFocus();
        }
    }
    catch (e0) {
    }

    try {
        if (typeof this.clearFocus === "function") {
            this.clearFocus();
        }
    }
    catch (e01) {
    }

    var di = undefined;
    try {
        di = EAction.getDocumentInterface();
    }
    catch (e) {
    }

    if (isNull(di)) {
        return false;
    }

    var focused = false;
    var mdiActivated = false;

    try {
        var appWin = this.appWin;
        if (isNull(appWin)) {
            appWin = EAction.getMainWindow();
        }

        if (!isNull(appWin)) {
            appWin.activateWindow();

            if (typeof appWin.getMdiArea === "function") {
                var mdiArea = appWin.getMdiArea();
                if (!isNull(mdiArea)) {
                    var subWindow = undefined;

                    try {
                        if (typeof mdiArea.currentSubWindow === "function") {
                            subWindow = mdiArea.currentSubWindow();
                        }
                    }
                    catch (e1) {
                    }

                    try {
                        if (isNull(subWindow) && typeof mdiArea.activeSubWindow === "function") {
                            subWindow = mdiArea.activeSubWindow();
                        }
                    }
                    catch (e2) {
                    }

                    try {
                        if (isNull(subWindow) && typeof mdiArea.subWindowList === "function") {
                            var subWindows = mdiArea.subWindowList();
                            if (!isNull(subWindows) && subWindows.length>0) {
                                subWindow = subWindows[0];
                            }
                        }
                    }
                    catch (e3) {
                    }

                    try {
                        mdiArea.activateWindow();
                        mdiArea.setFocus();
                    }
                    catch (e4) {
                    }

                    if (!isNull(subWindow)) {
                        try {
                            if (typeof mdiArea.setActiveSubWindow === "function") {
                                mdiArea.setActiveSubWindow(subWindow);
                            }
                        }
                        catch (e5) {
                        }

                        try {
                            subWindow.show();
                        }
                        catch (e6) {
                        }

                        try {
                            subWindow.raise();
                        }
                        catch (e7) {
                        }

                        try {
                            subWindow.activateWindow();
                        }
                        catch (e8) {
                        }

                        try {
                            subWindow.setFocus();
                        }
                        catch (e9) {
                        }

                        mdiActivated = true;
                    }
                }
            }
        }
    }
    catch (e10) {
    }

    try {
        var gv = undefined;
        if (typeof di.getGraphicsViewWithFocus === "function") {
            gv = di.getGraphicsViewWithFocus();
        }
        if (isNull(gv) && typeof di.getGraphicsView === "function") {
            gv = di.getGraphicsView();
        }
        if (!isNull(gv)) {
            gv.activateWindow();
            gv.setFocus();
            focused = true;
        }
    }
    catch (e11) {
    }

    if (!focused) {
        try {
            var views = undefined;
            if (typeof di.getGraphicsViews === "function") {
                views = di.getGraphicsViews();
            }
            if (!isNull(views) && views.length>0 && !isNull(views[0])) {
                views[0].activateWindow();
                views[0].setFocus();
                focused = true;
            }
        }
        catch (e12) {
        }
    }

    logLine("[OK] focus drawing view attempt: focused=" + focused + ", mdiActivated=" + mdiActivated);
    return focused;
};

LandscapeShellPanel.prototype.scheduleFocusDrawingView = function(delayMs) {
    var panel = this;
    scheduleUiCallback(delayMs, function() {
        panel.focusDrawingView();
    });
};

LandscapeShellPanel.prototype.releaseDockFocus = function() {
    try {
        if (!isNull(this.wallsButton) && typeof this.wallsButton.clearFocus === "function") {
            this.wallsButton.clearFocus();
        }
    }
    catch (e) {
    }

    try {
        if (!isNull(this.form) && typeof this.form.clearFocus === "function") {
            this.form.clearFocus();
        }
    }
    catch (e2) {
    }

    try {
        if (typeof this.clearFocus === "function") {
            this.clearFocus();
        }
    }
    catch (e3) {
    }
};

LandscapeShellPanel.prototype.launchWallToolActionFromDockPress = function() {
    var panel = this;
    this.releaseDockFocus();

    scheduleUiCallback(0, function() {
        panel.launchWallToolAction();
    });
};

LandscapeShellPanel.prototype.cancelActiveWallToolAction = function() {
    if (isNull(LandscapeShellRuntime.activeWallToolAction)) {
        return false;
    }

    try {
        LandscapeShellRuntime.activeWallToolAction.terminate();
        logLine("[OK] canceled active wall tool action");
        return true;
    }
    catch (e) {
        logLine("[ERR] failed to cancel active wall tool action: " + e);
    }

    return false;
};

LandscapeShellPanel.prototype.cancelActiveHostedPlacementAction = function() {
    if (isNull(LandscapeShellRuntime.activeHostedPlacementAction)) {
        return false;
    }

    try {
        LandscapeShellRuntime.activeHostedPlacementAction.terminate();
        logLine("[OK] canceled active hosted placement action");
        return true;
    }
    catch (e) {
        logLine("[ERR] failed to cancel active hosted placement action: " + e);
    }

    return false;
};

LandscapeShellPanel.prototype.syncActiveWallToolFromDefaults = function() {
    this.persistWallDefaults();

    if (isNull(LandscapeShellRuntime.activeWallToolAction)) {
        return;
    }

    var thickness = this.getWallThickness();
    var phase = this.getWallPhase();
    if (isNull(thickness) || thickness<=0) {
        return;
    }

    try {
        LandscapeShellRuntime.activeWallToolAction.applyLiveDefaults(thickness, phase);
        logLine("[OK] synced active wall tool defaults: thickness=" + thickness.toFixed(2) + ", phase=" + phase);
        this.setScaleReferenceStatus(this.getWallsReadyStatusText());
    }
    catch (e) {
        logLine("[ERR] failed to sync active wall tool defaults: " + e);
    }
};

LandscapeShellPanel.prototype.setScaleReferenceStatus = function(text) {
    if (!isNull(this.scaleReferenceStatusLabel)) {
        this.scaleReferenceStatusLabel.text = text;
        try {
            this.scaleReferenceStatusLabel.repaint();
            this.scaleReferenceStatusLabel.update();
        }
        catch (e0) {
        }
    }
    logLine("[OK] scale reference status updated: " + text);
};

LandscapeShellPanel.prototype.toggleShellPiece = function(objectName, visible) {
    var child = this.appWin.findChild(objectName);
    if (isNull(child)) {
        logLine("[ERR] shell piece not found: " + objectName);
        return;
    }

    if (visible) {
        child.show();
        logLine("[OK] showed shell piece: " + objectName);
    }
    else {
        child.hide();
        logLine("[OK] hid shell piece: " + objectName);
    }
};

LandscapeShellPanel.prototype.launchScaleReferenceAction = function() {
    this.cancelActiveWallToolAction();
    this.cancelActiveHostedPlacementAction();
    var action = new ScaleReferenceAction(undefined, this, false);
    var di = ensureActiveDocument();

    LandscapeShellRuntime.activeScaleReferenceAction = action;

    if (!isNull(di)) {
        try {
            di.setCurrentAction(action);
            this.focusDrawingView();
            this.scheduleFocusDrawingView(25);
            logLine("[OK] scale reference action set as current action");
            return;
        }
        catch (e) {
            logLine("[ERR] failed to set current action directly: " + e);
        }
    }

    action.beginEvent();
    this.focusDrawingView();
    this.scheduleFocusDrawingView(25);
    logLine("[OK] scale reference action began without setCurrentAction fallback");
};

LandscapeShellPanel.prototype.launchWallToolAction = function() {
    var thickness = this.getWallThickness();
    var phase = this.getWallPhase();
    if (isNull(thickness) || thickness<=0) {
        QMessageBox.warning(EAction.getMainWindow(), "Walls Tool", "Enter a positive wall thickness.");
        EAction.activateMainWindow();
        this.setScaleReferenceStatus("Enter a positive wall thickness.");
        return;
    }

    ensureActiveDocument();
    this.setMode("Building");
    this.setActiveBuildingCommand("Walls");
    this.persistWallDefaults();
    this.cancelActiveWallToolAction();
    this.cancelActiveHostedPlacementAction();

    this.setScaleReferenceStatus(this.getWallsReadyStatusText());

    var panel = this;
    scheduleUiCallback(0, function() {
        var action = new WallToolAction(undefined, panel, thickness, phase);
        try {
            var di = EAction.getDocumentInterface();
            if (!isNull(di)) {
                di.setCurrentAction(action);
            }
            else {
                action.beginEvent();
            }
            logLine("[OK] direct wall action launched");
        }
        catch (e) {
            logLine("[ERR] failed to launch direct wall action: " + e);
            panel.setScaleReferenceStatus("Could not launch wall tool.");
            return;
        }

        panel.focusDrawingView();
        panel.scheduleFocusDrawingView(15);
        panel.scheduleFocusDrawingView(60);
    });
};

LandscapeShellPanel.prototype.launchOpeningGapAction = function() {
    ensureActiveDocument();
    this.cancelActiveWallToolAction();
    this.cancelActiveHostedPlacementAction();
    this.setMode("Building");

    var action = new OpeningGapAction(undefined, this);
    var di = EAction.getDocumentInterface();

    if (!isNull(di)) {
        try {
            di.setCurrentAction(action);
            this.focusDrawingView();
            this.scheduleFocusDrawingView(25);
            logLine("[OK] opening gap action set as current action");
            return;
        }
        catch (e) {
            logLine("[ERR] failed to set opening gap action directly: " + e);
        }
    }

    action.beginEvent();
    this.focusDrawingView();
    this.scheduleFocusDrawingView(25);
    logLine("[OK] opening gap action began without setCurrentAction fallback");
};

LandscapeShellPanel.prototype.importUnderlay = function() {
    var di = ensureActiveDocument();
    var doc = isNull(di) ? undefined : di.getDocument();
    if (!isNull(doc) && getReferenceUnderlayEntities(doc).length>0) {
        QMessageBox.information(
            EAction.getMainWindow(),
            "Reference Underlay",
            "An underlay already exists. Use Replace Underlay to swap it."
        );
        EAction.activateMainWindow();
        this.setScaleReferenceStatus("Underlay already exists. Use Replace Underlay.");
        logLine("[OK] blocked duplicate import because reference underlay already exists");
        return;
    }

    var fileName = promptForUnderlayFile();
    if (isNull(fileName) || fileName==="") {
        this.setScaleReferenceStatus("Underlay import canceled.");
        logLine("[OK] underlay import canceled");
        return;
    }

    importRasterUnderlay(fileName, this, false);
};

LandscapeShellPanel.prototype.replaceUnderlay = function() {
    var fileName = promptForUnderlayFile();
    if (isNull(fileName) || fileName==="") {
        this.setScaleReferenceStatus("Underlay replacement canceled.");
        logLine("[OK] underlay replacement canceled");
        return;
    }

    importRasterUnderlay(fileName, this, true);
};

LandscapeShellPanel.prototype.setUnderlayVisible = function(visible) {
    if (setReferenceUnderlayVisibility(visible)) {
        this.setScaleReferenceStatus(visible ? "Underlay shown." : "Underlay hidden.");
    }
};

LandscapeShellPanel.prototype.setUnderlayLocked = function(locked) {
    if (setReferenceUnderlayLocked(locked)) {
        this.setScaleReferenceStatus(locked ? "Underlay locked." : "Underlay unlocked.");
    }
};

function ScaleReferenceAction(guiAction, shellPanel, autoMode) {
    EAction.call(this, guiAction);

    this.shellPanel = shellPanel;
    this.autoMode = autoMode===true;
    this.point1 = undefined;
    this.point2 = undefined;
}

ScaleReferenceAction.prototype = new EAction();

function OpeningGapAction(guiAction, shellPanel) {
    EAction.call(this, guiAction);

    this.shellPanel = shellPanel;
    this.sourceEntity = undefined;
    this.point1 = undefined;
    this.point2 = undefined;
}

OpeningGapAction.prototype = new EAction();

function WallToolAction(guiAction, shellPanel, thickness, phase) {
    EAction.call(this, guiAction);

    this.shellPanel = shellPanel;
    this.thickness = thickness;
    this.phase = phase;
    this.point1 = undefined;
    this.point2 = undefined;
}

WallToolAction.prototype = new EAction();

WallToolAction.prototype.getFirstPointStatusText = function() {
    return "Pick first wall point for an exterior or interior wall. Thickness " + this.thickness.toFixed(2) + ", phase " + this.phase + ".";
};

WallToolAction.prototype.getSecondPointStatusText = function() {
    return "Pick second wall point. Thickness " + this.thickness.toFixed(2) + ", phase " + this.phase + ".";
};

OpeningGapAction.State = {
    SelectingLine: 0,
    SettingPoint1: 1,
    SettingPoint2: 2
};

WallToolAction.State = {
    SettingPoint1: 0,
    SettingPoint2: 1
};

ScaleReferenceAction.State = {
    SettingPoint1: 0,
    SettingPoint2: 1
};

ScaleReferenceAction.prototype.beginEvent = function() {
    EAction.prototype.beginEvent.call(this);

    if (!this.autoMode) {
        if (!isNull(this.shellPanel)) {
            this.shellPanel.setScaleReferenceStatus("Pick first reference point...");
        }
        this.setState(ScaleReferenceAction.State.SettingPoint1);
    }
};

OpeningGapAction.prototype.beginEvent = function() {
    EAction.prototype.beginEvent.call(this);

    if (!isNull(this.shellPanel)) {
        this.shellPanel.setScaleReferenceStatus("Click the wall edge to place an opening...");
    }

    this.setState(OpeningGapAction.State.SelectingLine);
};

WallToolAction.prototype.beginEvent = function() {
    EAction.prototype.beginEvent.call(this);

    LandscapeShellRuntime.activeWallToolAction = this;

    if (!isNull(this.shellPanel) && typeof this.shellPanel.setActiveBuildingCommand === "function") {
        this.shellPanel.setActiveBuildingCommand("Walls");
    }

    if (!isNull(this.shellPanel)) {
        this.shellPanel.setScaleReferenceStatus(this.getFirstPointStatusText());
    }

    this.setState(WallToolAction.State.SettingPoint1);
};

WallToolAction.prototype.applyLiveDefaults = function(thickness, phase) {
    this.thickness = thickness;
    this.phase = phase;

    if (!isNull(this.shellPanel)) {
        switch (this.state) {
        case WallToolAction.State.SettingPoint1:
            this.shellPanel.setScaleReferenceStatus(this.getFirstPointStatusText());
            break;

        case WallToolAction.State.SettingPoint2:
            this.shellPanel.setScaleReferenceStatus(this.getSecondPointStatusText());
            break;
        }
    }

    if (this.state===WallToolAction.State.SettingPoint2) {
        this.updatePreview();
    }
};

ScaleReferenceAction.prototype.setState = function(state) {
    EAction.prototype.setState.call(this, state);

    this.getDocumentInterface().setClickMode(RAction.PickCoordinate);
    this.setCrosshairCursor();
    EAction.showSnapTools();

    switch (this.state) {
    case ScaleReferenceAction.State.SettingPoint1:
        this.setCommandPrompt("First scale point");
        this.setLeftMouseTip("First scale point");
        this.setRightMouseTip(EAction.trCancel);
        break;

    case ScaleReferenceAction.State.SettingPoint2:
        this.setCommandPrompt("Second scale point");
        this.setLeftMouseTip("Second scale point");
        this.setRightMouseTip(EAction.trCancel);
        break;
    }
};

OpeningGapAction.prototype.setState = function(state) {
    EAction.prototype.setState.call(this, state);

    this.getDocumentInterface().setClickMode(RAction.PickCoordinate);
    this.setCrosshairCursor();
    EAction.showSnapTools();

    switch (this.state) {
    case OpeningGapAction.State.SelectingLine:
        this.setCommandPrompt("Select wall edge");
        this.setLeftMouseTip("Select wall edge");
        this.setRightMouseTip(EAction.trCancel);
        break;

    case OpeningGapAction.State.SettingPoint1:
        this.setCommandPrompt("First opening point");
        this.setLeftMouseTip("First opening point");
        this.setRightMouseTip(EAction.trCancel);
        break;

    case OpeningGapAction.State.SettingPoint2:
        this.setCommandPrompt("Second opening point");
        this.setLeftMouseTip("Second opening point");
        this.setRightMouseTip(EAction.trCancel);
        break;
    }
};

WallToolAction.prototype.setState = function(state) {
    EAction.prototype.setState.call(this, state);

    this.getDocumentInterface().setClickMode(RAction.PickCoordinate);
    this.setCrosshairCursor();
    EAction.showSnapTools();

    switch (this.state) {
    case WallToolAction.State.SettingPoint1:
        this.setCommandPrompt("First wall point for exterior or interior wall");
        this.setLeftMouseTip("First wall point");
        this.setRightMouseTip(EAction.trCancel);
        break;

    case WallToolAction.State.SettingPoint2:
        this.setCommandPrompt("Second wall point");
        this.setLeftMouseTip("Second wall point");
        this.setRightMouseTip(EAction.trCancel);
        break;
    }
};

ScaleReferenceAction.prototype.coordinateEvent = function(event) {
    var di = this.getDocumentInterface();

    switch (this.state) {
    case ScaleReferenceAction.State.SettingPoint1:
        this.point1 = event.getModelPosition();
        di.setRelativeZero(this.point1);
        if (!isNull(this.shellPanel)) {
            this.shellPanel.setScaleReferenceStatus("Pick second reference point...");
        }
        this.setState(ScaleReferenceAction.State.SettingPoint2);
        break;

    case ScaleReferenceAction.State.SettingPoint2:
        this.point2 = event.getModelPosition();
        di.setRelativeZero(this.point2);
        this.completeInteractiveReference();
        break;
    }
};

OpeningGapAction.prototype.coordinateEvent = function(event) {
    switch (this.state) {
    case OpeningGapAction.State.SelectingLine:
        if (!this.captureLineFromClick(event.getModelPosition())) {
            return;
        }
        if (!isNull(this.shellPanel)) {
            this.shellPanel.setScaleReferenceStatus("Pick first opening limit on the selected wall edge...");
        }
        this.setState(OpeningGapAction.State.SettingPoint1);
        break;

    case OpeningGapAction.State.SettingPoint1:
        this.point1 = event.getModelPosition();
        if (!isNull(this.shellPanel)) {
            this.shellPanel.setScaleReferenceStatus("Pick second opening limit on the selected wall edge...");
        }
        this.setState(OpeningGapAction.State.SettingPoint2);
        break;

    case OpeningGapAction.State.SettingPoint2:
        this.point2 = event.getModelPosition();
        this.applyOpeningGap();
        break;
    }
};

WallToolAction.prototype.coordinateEvent = function(event) {
    switch (this.state) {
    case WallToolAction.State.SettingPoint1:
        this.point1 = event.getModelPosition();
        if (!isNull(this.shellPanel)) {
            this.shellPanel.setScaleReferenceStatus(this.getSecondPointStatusText());
        }
        this.setState(WallToolAction.State.SettingPoint2);
        break;

    case WallToolAction.State.SettingPoint2:
        this.point2 = event.getModelPosition();
        this.applyWall();
        break;
    }
};

WallToolAction.prototype.terminate = function() {
    if (LandscapeShellRuntime.activeWallToolAction===this) {
        LandscapeShellRuntime.activeWallToolAction = undefined;
    }
    EAction.prototype.terminate.call(this);
};

WallToolAction.prototype.coordinateEventPreview = function(event) {
    switch (this.state) {
    case WallToolAction.State.SettingPoint2:
        this.point2 = event.getModelPosition();
        this.updatePreview();
        break;

    default:
        break;
    }
};

OpeningGapAction.prototype.captureLineFromClick = function(modelPosition) {
    var doc = this.getDocument();
    if (isNull(doc)) {
        this.reportIssue("No active drawing.");
        return false;
    }

    var ids = doc.queryAllEntities();
    var closestEntity = undefined;
    var closestDistance = Number.MAX_VALUE;

    for (var i=0; i<ids.length; i++) {
        var entity = doc.queryEntity(ids[i]);
        if (isNull(entity) || !isLineEntity(entity)) {
            continue;
        }

        var data = entity.getData();
        if (isNull(data)) {
            continue;
        }

        var start = data.getStartPoint();
        var end = data.getEndPoint();
        var projection = this.projectPointToSegment(modelPosition, start, end);
        var distance = projection.point.getDistanceTo(modelPosition);
        if (distance < closestDistance) {
            closestDistance = distance;
            closestEntity = entity;
        }
    }

    if (isNull(closestEntity)) {
        this.reportIssue("Click a straight wall edge.");
        return false;
    }

    if (closestDistance > 2.0) {
        this.reportIssue("No wall edge found near that click. Click directly on a line.");
        return false;
    }

    this.sourceEntity = closestEntity;
    try {
        this.sourceEntity.setSelected(true);
    }
    catch (e) {
    }

    logLine("[OK] opening gap source line captured, distance=" + closestDistance.toFixed(2));
    return true;
};

OpeningGapAction.prototype.reportIssue = function(text) {
    if (!isNull(this.shellPanel)) {
        this.shellPanel.setScaleReferenceStatus(text);
    }

    try {
        QMessageBox.information(EAction.getMainWindow(), "Opening Tool", text);
        EAction.activateMainWindow();
    }
    catch (e) {
    }

    logLine("[ERR] opening gap action: " + text);
};

OpeningGapAction.prototype.projectPointToSegment = function(point, start, end) {
    var dx = end.x - start.x;
    var dy = end.y - start.y;
    var lengthSquared = dx*dx + dy*dy;

    if (lengthSquared<=1e-9) {
        return {
            t: 0,
            point: start
        };
    }

    var t = ((point.x - start.x) * dx + (point.y - start.y) * dy) / lengthSquared;
    if (t<0) {
        t = 0;
    }
    if (t>1) {
        t = 1;
    }

    return {
        t: t,
        point: new RVector(start.x + dx * t, start.y + dy * t)
    };
};

OpeningGapAction.prototype.applyOpeningGap = function() {
    var doc = this.getDocument();
    var di = this.getDocumentInterface();
    if (isNull(doc) || isNull(di) || isNull(this.sourceEntity)) {
        this.reportIssue("Could not resolve selected wall edge.");
        this.terminate();
        return false;
    }

    var data = this.sourceEntity.getData();
    var start = data.getStartPoint();
    var end = data.getEndPoint();
    var projection1 = this.projectPointToSegment(this.point1, start, end);
    var projection2 = this.projectPointToSegment(this.point2, start, end);

    var left = projection1;
    var right = projection2;
    if (projection2.t < projection1.t) {
        left = projection2;
        right = projection1;
    }

    if (Math.abs(right.t - left.t) < 0.01) {
        this.reportIssue("Opening points are too close together.");
        this.terminate();
        return false;
    }

    var deleteOp = new RDeleteObjectsOperation();
    deleteOp.deleteObject(this.sourceEntity);
    di.applyOperation(deleteOp);

    var addOp = new RAddObjectsOperation();
    var created = 0;

    if (left.t > 0.0001) {
        var firstLine = new RLineEntity(doc, new RLineData(start, left.point));
        ScaleReferenceAction.prototype.copyPrototypeEntityAttributes(this.sourceEntity, firstLine);
        addOp.addObject(firstLine, false);
        created++;
    }

    if (right.t < 0.9999) {
        var secondLine = new RLineEntity(doc, new RLineData(right.point, end));
        ScaleReferenceAction.prototype.copyPrototypeEntityAttributes(this.sourceEntity, secondLine);
        addOp.addObject(secondLine, false);
        created++;
    }

    if (created>0) {
        di.applyOperation(addOp);
    }

    forceDocumentRedraw(di);

    var gapLength = left.point.getDistanceTo(right.point);
    var summary = "Opening gap created. Removed " + gapLength.toFixed(2) + " units from selected wall edge.";
    if (!isNull(this.shellPanel)) {
        this.shellPanel.setScaleReferenceStatus(summary);
    }
    logLine("[OK] opening gap created on selected line: gap=" + gapLength.toFixed(2) + ", created=" + created);
    this.terminate();
    return true;
};

function projectPointToSegmentInfo(point, start, end) {
    var dx = end.x - start.x;
    var dy = end.y - start.y;
    var lengthSquared = dx*dx + dy*dy;

    if (lengthSquared<=1e-9) {
        return {
            t: 0,
            point: start
        };
    }

    var t = ((point.x - start.x) * dx + (point.y - start.y) * dy) / lengthSquared;
    if (t<0) {
        t = 0;
    }
    if (t>1) {
        t = 1;
    }

    return {
        t: t,
        point: new RVector(start.x + dx * t, start.y + dy * t)
    };
}

function interpolateVector(start, end, t) {
    return new RVector(
        start.x + (end.x - start.x) * t,
        start.y + (end.y - start.y) * t
    );
}

function parseHostedWallAxisFromEntity(entity) {
    if (isNull(entity)) {
        return undefined;
    }

    var groupId = String(getAppCustomProperty(entity, "wallGroupId", ""));
    if (groupId==="") {
        return undefined;
    }

    var startX = parseFloat(getAppCustomProperty(entity, "wallAxisStartX", ""));
    var startY = parseFloat(getAppCustomProperty(entity, "wallAxisStartY", ""));
    var endX = parseFloat(getAppCustomProperty(entity, "wallAxisEndX", ""));
    var endY = parseFloat(getAppCustomProperty(entity, "wallAxisEndY", ""));
    var thickness = parseFloat(getAppCustomProperty(entity, "wallThickness", "2"));
    var phase = String(getAppCustomProperty(entity, "wallPhase", "Proposed"));

    if (isNaN(startX) || isNaN(startY) || isNaN(endX) || isNaN(endY) || isNaN(thickness) || thickness<=0) {
        return undefined;
    }

    return {
        groupId: groupId,
        axisStart: new RVector(startX, startY),
        axisEnd: new RVector(endX, endY),
        thickness: thickness,
        phase: phase
    };
}

function getWallGroupEntities(document, groupId) {
    var entities = [];
    if (isNull(document) || isNull(groupId) || groupId==="") {
        return entities;
    }

    var ids = document.queryAllEntities();
    for (var i=0; i<ids.length; i++) {
        var entity = document.queryEntity(ids[i]);
        if (isNull(entity) || !isLineEntity(entity)) {
            continue;
        }

        if (String(getAppCustomProperty(entity, "wallGroupId", ""))===groupId) {
            entities.push(entity);
        }
    }

    return entities;
}

function wallHasHostedObjects(document, groupId) {
    if (isNull(document) || isNull(groupId) || groupId==="") {
        return false;
    }

    var ids = document.queryAllEntities();
    for (var i=0; i<ids.length; i++) {
        var entity = document.queryEntity(ids[i]);
        if (isNull(entity)) {
            continue;
        }

        if (String(getAppCustomProperty(entity, "hostWallId", ""))===groupId) {
            return true;
        }
    }

    return false;
}

function getHostedWallObjects(document, groupId) {
    var objectsByKey = {};
    var objects = [];

    if (isNull(document) || isNull(groupId) || groupId==="") {
        return objects;
    }

    var ids = document.queryAllEntities();
    for (var i=0; i<ids.length; i++) {
        var entity = document.queryEntity(ids[i]);
        if (isNull(entity)) {
            continue;
        }

        if (String(getAppCustomProperty(entity, "hostWallId", ""))!==groupId) {
            continue;
        }

        var centerT = parseFloat(getAppCustomProperty(entity, "hostDistanceAlongWall", ""));
        var openingWidth = parseFloat(getAppCustomProperty(entity, "openingWidth", ""));
        var libraryItemId = String(getAppCustomProperty(entity, "libraryItemId", ""));
        if (isNaN(centerT) || isNaN(openingWidth) || openingWidth<=0 || libraryItemId==="") {
            continue;
        }

        var objectId = String(getAppCustomProperty(entity, "hostObjectId", ""));
        if (objectId==="") {
            objectId = groupId + "|" + libraryItemId + "|" + centerT.toFixed(6) + "|" + openingWidth.toFixed(6);
        }

        if (objectsByKey.hasOwnProperty(objectId)) {
            continue;
        }

        var libraryItem = getLibraryCatalogItemById(libraryItemId);
        var hingeSide = String(getAppCustomProperty(entity, "hostHingeSide", !isNull(libraryItem) && !isNull(libraryItem.hingeSide) ? libraryItem.hingeSide : ""));
        objectsByKey[objectId] = {
            objectId: objectId,
            centerT: centerT,
            openingWidth: openingWidth,
            libraryItemId: libraryItemId,
            libraryItem: cloneLibraryItemWithOverrides(libraryItem, {
                hingeSide: hingeSide
            }),
            hostCategory: String(getAppCustomProperty(entity, "hostCategory", libraryItem && !isNull(libraryItem.category) ? libraryItem.category : "")),
            swingState: String(getAppCustomProperty(entity, "swingState", "")),
            faceSide: String(getAppCustomProperty(entity, "hostFaceSide", "")),
            hingeSide: hingeSide
        };
        objects.push(objectsByKey[objectId]);
    }

    return objects;
}

function createHostedObjectId(groupId, libraryItemId, centerT) {
    return String(groupId) + "|" + String(libraryItemId) + "|" + String(Math.round(centerT * 1000000));
}

function cloneLibraryItemWithWidth(item, width) {
    if (isNull(item)) {
        return undefined;
    }

    var copy = {};
    for (var key in item) {
        copy[key] = item[key];
    }
    if (!isNull(width) && !isNaN(width) && width>0) {
        copy.defaultWidth = width;
        copy.openingWidth = width;
        copy.frameWidth = width;
    }
    return copy;
}

function cloneLibraryItemWithOverrides(item, overrides) {
    if (isNull(item)) {
        return undefined;
    }

    var copy = cloneLibraryItemWithWidth(item, undefined);
    if (isNull(copy) || isNull(overrides)) {
        return copy;
    }

    for (var key in overrides) {
        copy[key] = overrides[key];
    }

    return copy;
}

function isSingleSwingDoorItem(item) {
    return !isNull(item) &&
        item.category==="Doors" &&
        item.swingType==="single";
}

function getHostedWallCandidateFromGroup(document, groupId) {
    if (isNull(document) || isNull(groupId) || groupId==="") {
        return undefined;
    }

    var wallEntities = getWallGroupEntities(document, groupId);
    if (isNull(wallEntities) || wallEntities.length===0) {
        return undefined;
    }

    var axisInfo = parseHostedWallAxisFromEntity(wallEntities[0]);
    if (isNull(axisInfo)) {
        return undefined;
    }

    return {
        sourceEntity: wallEntities[0],
        groupId: axisInfo.groupId,
        axisStart: axisInfo.axisStart,
        axisEnd: axisInfo.axisEnd,
        thickness: axisInfo.thickness,
        phase: axisInfo.phase,
        centerPoint: interpolateVector(axisInfo.axisStart, axisInfo.axisEnd, 0.5),
        centerT: 0.5
    };
}

function getHostedEntitiesForObject(document, objectId) {
    var entities = [];
    if (isNull(document) || isNull(objectId) || objectId==="") {
        return entities;
    }

    var ids = document.queryAllEntities();
    for (var i=0; i<ids.length; i++) {
        var entity = document.queryEntity(ids[i]);
        if (isNull(entity)) {
            continue;
        }

        if (String(getAppCustomProperty(entity, "hostObjectId", ""))===objectId) {
            entities.push(entity);
        }
    }

    return entities;
}

function buildHostedOpeningDescriptors(wallLength, corners, hostedObjects) {
    var descriptors = [];
    for (var h=0; h<hostedObjects.length; h++) {
        var hostedObject = hostedObjects[h];
        if (isNull(hostedObject.libraryItem)) {
            hostedObject.libraryItem = getLibraryCatalogItemById(hostedObject.libraryItemId);
        }
        if (isNull(hostedObject.libraryItem)) {
            return {
                error: "Could not resolve an existing hosted object on this wall."
            };
        }

        var halfOpeningT = (hostedObject.openingWidth / 2.0) / wallLength;
        var leftT = hostedObject.centerT - halfOpeningT;
        var rightT = hostedObject.centerT + halfOpeningT;
        if (leftT<=0.05 || rightT>=0.95) {
            return {
                error: "Move the placement farther from the end of the wall."
            };
        }

        descriptors.push({
            hostedObject: hostedObject,
            leftT: leftT,
            rightT: rightT,
            topLeft: interpolateVector(corners.a, corners.b, leftT),
            topRight: interpolateVector(corners.a, corners.b, rightT),
            bottomLeft: interpolateVector(corners.d, corners.c, leftT),
            bottomRight: interpolateVector(corners.d, corners.c, rightT)
        });
    }

    descriptors.sort(function(a, b) {
        return a.leftT - b.leftT;
    });

    for (var i=1; i<descriptors.length; i++) {
        if (descriptors[i].leftT < descriptors[i-1].rightT + 1e-6) {
            return {
                error: "This door or window overlaps an existing hosted opening."
            };
        }
    }

    return {
        descriptors: descriptors
    };
}

function getHostedWallCandidateFromClick(document, modelPosition, maxDistance) {
    if (isNull(document)) {
        return undefined;
    }

    var ids = document.queryAllEntities();
    var closest = undefined;
    var closestDistance = Number.MAX_VALUE;

    for (var i=0; i<ids.length; i++) {
        var entity = document.queryEntity(ids[i]);
        if (isNull(entity) || !isLineEntity(entity)) {
            continue;
        }

        var axisInfo = parseHostedWallAxisFromEntity(entity);
        if (isNull(axisInfo)) {
            continue;
        }

        var data = entity.getData();
        if (isNull(data)) {
            continue;
        }

        var edgeProjection = projectPointToSegmentInfo(modelPosition, data.getStartPoint(), data.getEndPoint());
        var edgeDistance = edgeProjection.point.getDistanceTo(modelPosition);
        if (edgeDistance > maxDistance || edgeDistance >= closestDistance) {
            continue;
        }

        var axisProjection = projectPointToSegmentInfo(modelPosition, axisInfo.axisStart, axisInfo.axisEnd);

        closestDistance = edgeDistance;
        closest = {
            sourceEntity: entity,
            groupId: axisInfo.groupId,
            axisStart: axisInfo.axisStart,
            axisEnd: axisInfo.axisEnd,
            thickness: axisInfo.thickness,
            phase: axisInfo.phase,
            centerPoint: axisProjection.point,
            centerT: axisProjection.t,
            edgeDistance: edgeDistance
        };
    }

    return closest;
}

function getWallCornersFromAxis(axisStart, axisEnd, thickness) {
    var dx = axisEnd.x - axisStart.x;
    var dy = axisEnd.y - axisStart.y;
    var length = Math.sqrt(dx*dx + dy*dy);
    if (length<=1e-9) {
        return undefined;
    }

    var halfThickness = thickness / 2.0;
    var px = -dy / length * halfThickness;
    var py = dx / length * halfThickness;

    return {
        a: new RVector(axisStart.x + px, axisStart.y + py),
        b: new RVector(axisEnd.x + px, axisEnd.y + py),
        c: new RVector(axisEnd.x - px, axisEnd.y - py),
        d: new RVector(axisStart.x - px, axisStart.y - py)
    };
}

function normalizeAngleDelta(angle) {
    while (angle <= -Math.PI) {
        angle += Math.PI * 2.0;
    }
    while (angle > Math.PI) {
        angle -= Math.PI * 2.0;
    }
    return angle;
}

function HostedLibraryPlacementAction(guiAction, shellPanel, libraryItem) {
    EAction.call(this, guiAction);
    this.shellPanel = shellPanel;
    this.libraryItem = libraryItem;
}

HostedLibraryPlacementAction.prototype = new EAction();

HostedLibraryPlacementAction.State = {
    SelectingWall: 0
};

HostedLibraryPlacementAction.prototype.beginEvent = function() {
    EAction.prototype.beginEvent.call(this);

    LandscapeShellRuntime.activeHostedPlacementAction = this;

    if (!isNull(this.shellPanel)) {
        this.shellPanel.setActiveBuildingCommand(this.libraryItem.category);
        this.shellPanel.setScaleReferenceStatus("Place " + this.libraryItem.label + " on a wall. Click a wall edge.");
    }

    this.setState(HostedLibraryPlacementAction.State.SelectingWall);
};

HostedLibraryPlacementAction.prototype.setState = function(state) {
    EAction.prototype.setState.call(this, state);

    this.getDocumentInterface().setClickMode(RAction.PickCoordinate);
    this.setCrosshairCursor();
    EAction.showSnapTools();

    if (state===HostedLibraryPlacementAction.State.SelectingWall) {
        this.setCommandPrompt("Click wall for " + this.libraryItem.label);
        this.setLeftMouseTip("Click wall");
        this.setRightMouseTip(EAction.trCancel);
    }
};

HostedLibraryPlacementAction.prototype.terminate = function() {
    if (LandscapeShellRuntime.activeHostedPlacementAction===this) {
        LandscapeShellRuntime.activeHostedPlacementAction = undefined;
    }
    EAction.prototype.terminate.call(this);
};

HostedLibraryPlacementAction.prototype.reportIssue = function(text) {
    if (!isNull(this.shellPanel)) {
        this.shellPanel.setScaleReferenceStatus(text);
    }
    logLine("[ERR] hosted placement: " + text);
};

HostedLibraryPlacementAction.prototype.getOpeningWidth = function() {
    var openingWidth = parseFloat(this.libraryItem.openingWidth);
    if (!isNaN(openingWidth) && openingWidth>0) {
        return openingWidth;
    }

    openingWidth = parseFloat(this.libraryItem.defaultWidth);
    if (!isNaN(openingWidth) && openingWidth>0) {
        return openingWidth;
    }

    return 3.0;
};

HostedLibraryPlacementAction.prototype.addHostedMetadata = function(entity, candidate, hostedObject, rotationDegrees) {
    setAppCustomProperty(entity, "hostWallId", candidate.groupId);
    setAppCustomProperty(entity, "hostPositionX", String(candidate.centerPoint.x));
    setAppCustomProperty(entity, "hostPositionY", String(candidate.centerPoint.y));
    setAppCustomProperty(entity, "hostDistanceAlongWall", String(hostedObject.centerT));
    setAppCustomProperty(entity, "rotation", String(rotationDegrees));
    setAppCustomProperty(entity, "width", String(hostedObject.libraryItem.defaultWidth || hostedObject.openingWidth));
    setAppCustomProperty(entity, "openingWidth", String(hostedObject.openingWidth));
    setAppCustomProperty(entity, "libraryItemId", String(hostedObject.libraryItem.id));
    setAppCustomProperty(entity, "hostCategory", String(hostedObject.libraryItem.category));
    setAppCustomProperty(entity, "swingState", String(hostedObject.libraryItem.swingType || hostedObject.libraryItem.windowType || ""));
    setAppCustomProperty(entity, "hostObjectId", String(hostedObject.objectId));
    setAppCustomProperty(entity, "hostFaceSide", String(hostedObject.faceSide || ""));
    setAppCustomProperty(entity, "hostHingeSide", String(hostedObject.libraryItem.hingeSide || hostedObject.hingeSide || ""));
};

HostedLibraryPlacementAction.prototype.findDescriptorByObjectId = function(descriptors, objectId) {
    for (var i=0; i<descriptors.length; i++) {
        if (descriptors[i].hostedObject.objectId===objectId) {
            return descriptors[i];
        }
    }
    return undefined;
};

HostedLibraryPlacementAction.prototype.createWallOperationsFromDescriptors = function(document, candidate, corners, descriptors) {
    var deleteOp = new RDeleteObjectsOperation();
    var existingWallEntities = getWallGroupEntities(document, candidate.groupId);
    for (var i=0; i<existingWallEntities.length; i++) {
        deleteOp.deleteObject(existingWallEntities[i]);
    }

    var wallAddOp = new RAddObjectsOperation();
    var wallSegments = [];
    var currentTopPoint = corners.a;
    var currentBottomPoint = corners.d;

    for (var ws=0; ws<descriptors.length; ws++) {
        var descriptor = descriptors[ws];
        if (currentTopPoint.getDistanceTo(descriptor.topLeft)>1e-6) {
            wallSegments.push(new RLineData(currentTopPoint, descriptor.topLeft));
        }
        if (currentBottomPoint.getDistanceTo(descriptor.bottomLeft)>1e-6) {
            wallSegments.push(new RLineData(currentBottomPoint, descriptor.bottomLeft));
        }

        wallSegments.push(new RLineData(descriptor.topLeft, descriptor.bottomLeft));
        wallSegments.push(new RLineData(descriptor.topRight, descriptor.bottomRight));

        currentTopPoint = descriptor.topRight;
        currentBottomPoint = descriptor.bottomRight;
    }

    if (currentTopPoint.getDistanceTo(corners.b)>1e-6) {
        wallSegments.push(new RLineData(currentTopPoint, corners.b));
    }
    if (currentBottomPoint.getDistanceTo(corners.c)>1e-6) {
        wallSegments.push(new RLineData(currentBottomPoint, corners.c));
    }

    wallSegments.push(new RLineData(corners.a, corners.d));
    wallSegments.push(new RLineData(corners.b, corners.c));

    for (var j=0; j<wallSegments.length; j++) {
        var segment = wallSegments[j];
        if (segment.getStartPoint().getDistanceTo(segment.getEndPoint())<=1e-6) {
            continue;
        }

        var wallLine = new RLineEntity(document, segment);
        ScaleReferenceAction.prototype.copyPrototypeEntityAttributes(candidate.sourceEntity, wallLine);
        setAppCustomProperty(wallLine, "wallGroupId", candidate.groupId);
        setAppCustomProperty(wallLine, "wallThickness", String(candidate.thickness));
        setAppCustomProperty(wallLine, "wallPhase", String(candidate.phase));
        setAppCustomProperty(wallLine, "wallAxisStartX", String(candidate.axisStart.x));
        setAppCustomProperty(wallLine, "wallAxisStartY", String(candidate.axisStart.y));
        setAppCustomProperty(wallLine, "wallAxisEndX", String(candidate.axisEnd.x));
        setAppCustomProperty(wallLine, "wallAxisEndY", String(candidate.axisEnd.y));
        wallAddOp.addObject(wallLine, false);
    }

    return {
        deleteOp: deleteOp,
        wallAddOp: wallAddOp
    };
};

HostedLibraryPlacementAction.prototype.appendSymbolEntitiesForDescriptor = function(document, di, candidate, corners, descriptor, symbolAddOp) {
    var hostedObject = descriptor.hostedObject;
    var libraryItem = hostedObject.libraryItem;
    var openingWidth = hostedObject.openingWidth;
    var symbolLayerName = libraryItem.category==="Doors" ? "ARCH_DOORS" : "ARCH_WINDOWS";
    ensureLayer(document, di, symbolLayerName, "black");
    var symbolLayer = document.queryLayer(symbolLayerName);
    var symbolLayerId = isNull(symbolLayer) ? undefined : symbolLayer.getId();
    var rotationDegrees = Math.atan2(candidate.axisEnd.y - candidate.axisStart.y, candidate.axisEnd.x - candidate.axisStart.x) * 180 / Math.PI;
    var topLeft = descriptor.topLeft;
    var topRight = descriptor.topRight;
    var bottomLeft = descriptor.bottomLeft;
    var bottomRight = descriptor.bottomRight;

    if (libraryItem.category==="Doors") {
        var leftJambCenter = interpolateVector(topLeft, bottomLeft, 0.5);
        var rightJambCenter = interpolateVector(topRight, bottomRight, 0.5);
        var topOpeningCenter = interpolateVector(topLeft, topRight, 0.5);
        var bottomOpeningCenter = interpolateVector(bottomLeft, bottomRight, 0.5);
        var openingCenter = interpolateVector(leftJambCenter, rightJambCenter, 0.5);

        var axisDx = candidate.axisEnd.x - candidate.axisStart.x;
        var axisDy = candidate.axisEnd.y - candidate.axisStart.y;
        var axisLength = Math.sqrt(axisDx * axisDx + axisDy * axisDy);
        var ux = axisDx / axisLength;
        var uy = axisDy / axisLength;
        var nx = -(topOpeningCenter.x - bottomOpeningCenter.x);
        var ny = -(topOpeningCenter.y - bottomOpeningCenter.y);
        var normalLength = Math.sqrt(nx * nx + ny * ny);
        if (normalLength<=1e-6) {
            nx = -uy;
            ny = ux;
            normalLength = Math.sqrt(nx * nx + ny * ny);
        }
        nx /= normalLength;
        ny /= normalLength;

        if (libraryItem.swingType==="double") {
            var halfWidth = openingWidth / 2.0;
            var centerOpen = openingCenter;

            var leftOpenEnd = new RVector(leftJambCenter.x + nx * halfWidth, leftJambCenter.y + ny * halfWidth);
            var leftLeaf = new RLineEntity(document, new RLineData(leftJambCenter, leftOpenEnd));
            var leftArc = new RArcEntity(document, new RArcData(leftJambCenter, halfWidth, Math.atan2(ny, nx), Math.atan2(centerOpen.y - leftJambCenter.y, centerOpen.x - leftJambCenter.x), false));

            var rightOpenEnd = new RVector(rightJambCenter.x - nx * halfWidth, rightJambCenter.y - ny * halfWidth);
            var rightLeaf = new RLineEntity(document, new RLineData(rightJambCenter, rightOpenEnd));
            var rightArc = new RArcEntity(document, new RArcData(rightJambCenter, halfWidth, Math.atan2(centerOpen.y - rightJambCenter.y, centerOpen.x - rightJambCenter.x), Math.atan2(-ny, -nx), false));

            var doubleDoorEntities = [ leftLeaf, leftArc, rightLeaf, rightArc ];
            for (var dd=0; dd<doubleDoorEntities.length; dd++) {
                if (!isNull(symbolLayerId)) {
                    doubleDoorEntities[dd].setLayerId(symbolLayerId);
                }
                doubleDoorEntities[dd].setColor(new RColor("black"));
                this.addHostedMetadata(doubleDoorEntities[dd], candidate, hostedObject, rotationDegrees);
                symbolAddOp.addObject(doubleDoorEntities[dd], false);
            }
        }
        else if (libraryItem.swingType==="slider") {
            var sliderInset = Math.max(candidate.thickness * 0.2, 0.2);
            var sliderLine1 = new RLineEntity(document, new RLineData(
                new RVector(topLeft.x + nx * sliderInset, topLeft.y + ny * sliderInset),
                new RVector(topRight.x + nx * sliderInset, topRight.y + ny * sliderInset)
            ));
            var sliderLine2 = new RLineEntity(document, new RLineData(
                new RVector(bottomLeft.x - nx * sliderInset, bottomLeft.y - ny * sliderInset),
                new RVector(bottomRight.x - nx * sliderInset, bottomRight.y - ny * sliderInset)
            ));
            var sliderEntities = [ sliderLine1, sliderLine2 ];
            for (var sd=0; sd<sliderEntities.length; sd++) {
                if (!isNull(symbolLayerId)) {
                    sliderEntities[sd].setLayerId(symbolLayerId);
                }
                sliderEntities[sd].setColor(new RColor("black"));
                this.addHostedMetadata(sliderEntities[sd], candidate, hostedObject, rotationDegrees);
                symbolAddOp.addObject(sliderEntities[sd], false);
            }
        }
        else {
            var hingeOnRight = libraryItem.hingeSide==="right";
            var hingePoint = hingeOnRight ? rightJambCenter : leftJambCenter;
            var latchPoint = hingeOnRight ? leftJambCenter : rightJambCenter;
            var faceTopCenter = interpolateVector(corners.a, corners.b, 0.5);
            var faceBottomCenter = interpolateVector(corners.d, corners.c, 0.5);
            var clickedTopFace = undefined;

            if (!isNull(hostedObject.faceSide) && hostedObject.faceSide!=="") {
                clickedTopFace = hostedObject.faceSide==="top";
            }
            else {
                var sourceData = candidate.sourceEntity.getData();
                var sourceMid = new RVector(
                    (sourceData.getStartPoint().x + sourceData.getEndPoint().x) / 2.0,
                    (sourceData.getStartPoint().y + sourceData.getEndPoint().y) / 2.0
                );
                var sourceDx = sourceData.getEndPoint().x - sourceData.getStartPoint().x;
                var sourceDy = sourceData.getEndPoint().y - sourceData.getStartPoint().y;
                var sourceLength = Math.sqrt(sourceDx * sourceDx + sourceDy * sourceDy);
                if (sourceLength<=1e-6) {
                    return "Click a longer wall face for door placement.";
                }

                var sourceUx = sourceDx / sourceLength;
                var sourceUy = sourceDy / sourceLength;
                var parallelDot = Math.abs(sourceUx * ux + sourceUy * uy);
                if (parallelDot < 0.8) {
                    return "Click one of the long wall faces to place a door.";
                }

                clickedTopFace = sourceMid.getDistanceTo(faceTopCenter) <= sourceMid.getDistanceTo(faceBottomCenter);
                hostedObject.faceSide = clickedTopFace ? "top" : "bottom";
            }

            var clickedFaceCenter = clickedTopFace ? faceTopCenter : faceBottomCenter;
            var oppositeFaceCenter = clickedTopFace ? faceBottomCenter : faceTopCenter;
            var inwardDx = oppositeFaceCenter.x - clickedFaceCenter.x;
            var inwardDy = oppositeFaceCenter.y - clickedFaceCenter.y;
            var inwardLength = Math.sqrt(inwardDx * inwardDx + inwardDy * inwardDy);
            if (inwardLength<=1e-6) {
                inwardDx = -uy;
                inwardDy = ux;
                inwardLength = Math.sqrt(inwardDx * inwardDx + inwardDy * inwardDy);
            }
            inwardDx /= inwardLength;
            inwardDy /= inwardLength;

            var leafOpenEnd = new RVector(
                hingePoint.x + inwardDx * openingWidth,
                hingePoint.y + inwardDy * openingWidth
            );
            var closedAngle = Math.atan2(latchPoint.y - hingePoint.y, latchPoint.x - hingePoint.x);
            var openAngle = Math.atan2(leafOpenEnd.y - hingePoint.y, leafOpenEnd.x - hingePoint.x);
            var arcDelta = normalizeAngleDelta(openAngle - closedAngle);
            var arcReversed = arcDelta < 0;

            var doorLeaf = new RLineEntity(document, new RLineData(hingePoint, leafOpenEnd));
            var doorArc = new RArcEntity(document, new RArcData(hingePoint, openingWidth, closedAngle, openAngle, arcReversed));
            var singleDoorEntities = [ doorLeaf, doorArc ];
            for (var ds=0; ds<singleDoorEntities.length; ds++) {
                if (!isNull(symbolLayerId)) {
                    singleDoorEntities[ds].setLayerId(symbolLayerId);
                }
                singleDoorEntities[ds].setColor(new RColor("black"));
                this.addHostedMetadata(singleDoorEntities[ds], candidate, hostedObject, rotationDegrees);
                symbolAddOp.addObject(singleDoorEntities[ds], false);
            }
        }
    }
    else {
        var windowLine1 = new RLineEntity(document, new RLineData(
            interpolateVector(topLeft, bottomLeft, 0.35),
            interpolateVector(topRight, bottomRight, 0.35)
        ));
        var windowLine2 = new RLineEntity(document, new RLineData(
            interpolateVector(topLeft, bottomLeft, 0.65),
            interpolateVector(topRight, bottomRight, 0.65)
        ));
        if (!isNull(symbolLayerId)) {
            windowLine1.setLayerId(symbolLayerId);
            windowLine2.setLayerId(symbolLayerId);
        }
        windowLine1.setColor(new RColor("black"));
        windowLine2.setColor(new RColor("black"));
        this.addHostedMetadata(windowLine1, candidate, hostedObject, rotationDegrees);
        this.addHostedMetadata(windowLine2, candidate, hostedObject, rotationDegrees);
        symbolAddOp.addObject(windowLine1, false);
        symbolAddOp.addObject(windowLine2, false);
    }

    return undefined;
};

HostedLibraryPlacementAction.prototype.buildWallAndSymbolOperations = function(document, di, candidate) {
    var wallLength = candidate.axisStart.getDistanceTo(candidate.axisEnd);
    var openingWidth = this.getOpeningWidth();
    if (wallLength<=0 || openingWidth>=wallLength-1.0) {
        return {
            error: "Wall is too short for " + this.libraryItem.label + "."
        };
    }

    var corners = getWallCornersFromAxis(candidate.axisStart, candidate.axisEnd, candidate.thickness);
    if (isNull(corners)) {
        return {
            error: "Could not resolve wall geometry."
        };
    }

    var hostedObjects = getHostedWallObjects(document, candidate.groupId);
    var currentHostedObject = {
        objectId: createHostedObjectId(candidate.groupId, this.libraryItem.id, candidate.centerT),
        centerT: candidate.centerT,
        openingWidth: openingWidth,
        libraryItemId: this.libraryItem.id,
        libraryItem: cloneLibraryItemWithWidth(this.libraryItem, openingWidth),
        hostCategory: this.libraryItem.category,
        swingState: String(this.libraryItem.swingType || this.libraryItem.windowType || ""),
        faceSide: "",
        hingeSide: String(this.libraryItem.hingeSide || "")
    };
    hostedObjects.push(currentHostedObject);
    hostedObjects.sort(function(a, b) {
        return a.centerT - b.centerT;
    });

    var descriptorResult = buildHostedOpeningDescriptors(wallLength, corners, hostedObjects);
    if (!isNull(descriptorResult.error)) {
        return {
            error: descriptorResult.error
        };
    }

    var currentDescriptor = this.findDescriptorByObjectId(descriptorResult.descriptors, currentHostedObject.objectId);
    if (isNull(currentDescriptor)) {
        return {
            error: "Could not resolve the new hosted opening."
        };
    }

    var ops = this.createWallOperationsFromDescriptors(document, candidate, corners, descriptorResult.descriptors);
    var symbolAddOp = new RAddObjectsOperation();
    var symbolError = this.appendSymbolEntitiesForDescriptor(document, di, candidate, corners, currentDescriptor, symbolAddOp);
    if (!isNull(symbolError)) {
        return {
            error: symbolError
        };
    }

    return {
        deleteOp: ops.deleteOp,
        wallAddOp: ops.wallAddOp,
        symbolAddOp: symbolAddOp
    };
};

HostedLibraryPlacementAction.prototype.buildHostedWidthEditOperations = function(document, di, selectedInfo, newWidth) {
    var candidate = getHostedWallCandidateFromGroup(document, selectedInfo.groupId);
    if (isNull(candidate)) {
        return {
            error: "Could not resolve the wall for the selected hosted item."
        };
    }

    var wallLength = candidate.axisStart.getDistanceTo(candidate.axisEnd);
    if (wallLength<=0 || newWidth>=wallLength-1.0) {
        return {
            error: "The new width is too large for this wall."
        };
    }

    var corners = getWallCornersFromAxis(candidate.axisStart, candidate.axisEnd, candidate.thickness);
    if (isNull(corners)) {
        return {
            error: "Could not resolve wall geometry."
        };
    }

    var hostedObjects = getHostedWallObjects(document, selectedInfo.groupId);
    var targetObject = undefined;
    for (var i=0; i<hostedObjects.length; i++) {
        if (hostedObjects[i].objectId===selectedInfo.objectId) {
            targetObject = hostedObjects[i];
            break;
        }
    }
    if (isNull(targetObject)) {
        return {
            error: "Could not resolve the selected hosted object."
        };
    }

    targetObject.openingWidth = newWidth;
    targetObject.libraryItem = cloneLibraryItemWithWidth(getLibraryCatalogItemById(targetObject.libraryItemId), newWidth);
    if (isNull(targetObject.libraryItem)) {
        targetObject.libraryItem = cloneLibraryItemWithWidth(selectedInfo.libraryItem, newWidth);
    }
    targetObject.faceSide = selectedInfo.faceSide || targetObject.faceSide || "";
    targetObject.hingeSide = selectedInfo.libraryItem.hingeSide || targetObject.hingeSide || "";
    targetObject.libraryItem = cloneLibraryItemWithOverrides(targetObject.libraryItem, {
        hingeSide: targetObject.hingeSide
    });

    hostedObjects.sort(function(a, b) {
        return a.centerT - b.centerT;
    });

    var descriptorResult = buildHostedOpeningDescriptors(wallLength, corners, hostedObjects);
    if (!isNull(descriptorResult.error)) {
        return {
            error: descriptorResult.error
        };
    }

    var targetDescriptor = this.findDescriptorByObjectId(descriptorResult.descriptors, targetObject.objectId);
    if (isNull(targetDescriptor)) {
        return {
            error: "Could not resolve the edited hosted opening."
        };
    }

    var ops = this.createWallOperationsFromDescriptors(document, candidate, corners, descriptorResult.descriptors);
    var existingHostedEntities = getHostedEntitiesForObject(document, targetObject.objectId);
    for (var eh=0; eh<existingHostedEntities.length; eh++) {
        ops.deleteOp.deleteObject(existingHostedEntities[eh]);
    }

    var symbolAddOp = new RAddObjectsOperation();
    var symbolError = this.appendSymbolEntitiesForDescriptor(document, di, candidate, corners, targetDescriptor, symbolAddOp);
    if (!isNull(symbolError)) {
        return {
            error: symbolError
        };
    }

    return {
        deleteOp: ops.deleteOp,
        wallAddOp: ops.wallAddOp,
        symbolAddOp: symbolAddOp,
        updatedHostedObject: targetObject
    };
};

HostedLibraryPlacementAction.prototype.buildHostedRemovalOperations = function(document, di, selectedInfo) {
    var candidate = getHostedWallCandidateFromGroup(document, selectedInfo.groupId);
    if (isNull(candidate)) {
        return {
            error: "Could not resolve the wall for the selected hosted item."
        };
    }

    var corners = getWallCornersFromAxis(candidate.axisStart, candidate.axisEnd, candidate.thickness);
    if (isNull(corners)) {
        return {
            error: "Could not resolve wall geometry."
        };
    }

    var hostedObjects = getHostedWallObjects(document, selectedInfo.groupId);
    var remainingHostedObjects = [];
    var foundTarget = false;
    for (var i=0; i<hostedObjects.length; i++) {
        if (hostedObjects[i].objectId===selectedInfo.objectId) {
            foundTarget = true;
            continue;
        }
        remainingHostedObjects.push(hostedObjects[i]);
    }

    if (!foundTarget) {
        return {
            error: "Could not resolve the selected hosted object."
        };
    }

    var wallLength = candidate.axisStart.getDistanceTo(candidate.axisEnd);
    var descriptors = [];
    if (remainingHostedObjects.length>0) {
        remainingHostedObjects.sort(function(a, b) {
            return a.centerT - b.centerT;
        });
        var descriptorResult = buildHostedOpeningDescriptors(wallLength, corners, remainingHostedObjects);
        if (!isNull(descriptorResult.error)) {
            return {
                error: descriptorResult.error
            };
        }
        descriptors = descriptorResult.descriptors;
    }

    var ops = this.createWallOperationsFromDescriptors(document, candidate, corners, descriptors);
    var existingHostedEntities = getHostedEntitiesForObject(document, selectedInfo.objectId);
    for (var eh=0; eh<existingHostedEntities.length; eh++) {
        ops.deleteOp.deleteObject(existingHostedEntities[eh]);
    }

    return {
        deleteOp: ops.deleteOp,
        wallAddOp: ops.wallAddOp
    };
};

HostedLibraryPlacementAction.prototype.buildHostedRepositionOperations = function(document, di, selectedInfo, targetCandidate) {
    if (isNull(targetCandidate)) {
        return {
            error: "Click directly on a wall edge to reposition the hosted item."
        };
    }

    var sourceCandidate = getHostedWallCandidateFromGroup(document, selectedInfo.groupId);
    if (isNull(sourceCandidate)) {
        return {
            error: "Could not resolve the current wall for the selected hosted item."
        };
    }

    var sourceHostedObjects = getHostedWallObjects(document, selectedInfo.groupId);
    var movingObject = undefined;
    var sourceRemaining = [];
    for (var i=0; i<sourceHostedObjects.length; i++) {
        if (sourceHostedObjects[i].objectId===selectedInfo.objectId) {
            movingObject = sourceHostedObjects[i];
            continue;
        }
        sourceRemaining.push(sourceHostedObjects[i]);
    }

    if (isNull(movingObject)) {
        return {
            error: "Could not resolve the selected hosted item."
        };
    }

    movingObject.centerT = targetCandidate.centerT;
    movingObject.openingWidth = selectedInfo.openingWidth;
    movingObject.hingeSide = selectedInfo.libraryItem.hingeSide || movingObject.hingeSide || "";
    movingObject.faceSide = "";
    movingObject.libraryItem = cloneLibraryItemWithOverrides(
        cloneLibraryItemWithWidth(movingObject.libraryItem, movingObject.openingWidth),
        {
            hingeSide: movingObject.hingeSide
        }
    );

    var symbolDeleteOp = new RDeleteObjectsOperation();
    var existingHostedEntities = getHostedEntitiesForObject(document, selectedInfo.objectId);
    for (var eh=0; eh<existingHostedEntities.length; eh++) {
        symbolDeleteOp.deleteObject(existingHostedEntities[eh]);
    }

    if (sourceCandidate.groupId===targetCandidate.groupId) {
        var sameWallCorners = getWallCornersFromAxis(targetCandidate.axisStart, targetCandidate.axisEnd, targetCandidate.thickness);
        if (isNull(sameWallCorners)) {
            return {
                error: "Could not resolve wall geometry."
            };
        }

        var sameWallObjects = sourceRemaining.slice(0);
        sameWallObjects.push(movingObject);
        sameWallObjects.sort(function(a, b) {
            return a.centerT - b.centerT;
        });

        var sameWallLength = targetCandidate.axisStart.getDistanceTo(targetCandidate.axisEnd);
        var sameWallDescriptorResult = buildHostedOpeningDescriptors(sameWallLength, sameWallCorners, sameWallObjects);
        if (!isNull(sameWallDescriptorResult.error)) {
            return {
                error: sameWallDescriptorResult.error
            };
        }

        var movedDescriptor = this.findDescriptorByObjectId(sameWallDescriptorResult.descriptors, movingObject.objectId);
        if (isNull(movedDescriptor)) {
            return {
                error: "Could not resolve the moved hosted opening."
            };
        }

        var sameWallOps = this.createWallOperationsFromDescriptors(document, targetCandidate, sameWallCorners, sameWallDescriptorResult.descriptors);
        var sameWallSymbolAddOp = new RAddObjectsOperation();
        var sameWallSymbolError = this.appendSymbolEntitiesForDescriptor(document, di, targetCandidate, sameWallCorners, movedDescriptor, sameWallSymbolAddOp);
        if (!isNull(sameWallSymbolError)) {
            return {
                error: sameWallSymbolError
            };
        }

        return {
            sourceDeleteOp: sameWallOps.deleteOp,
            sourceWallAddOp: sameWallOps.wallAddOp,
            symbolDeleteOp: symbolDeleteOp,
            symbolAddOp: sameWallSymbolAddOp,
            updatedHostedObject: movingObject
        };
    }

    var sourceCorners = getWallCornersFromAxis(sourceCandidate.axisStart, sourceCandidate.axisEnd, sourceCandidate.thickness);
    if (isNull(sourceCorners)) {
        return {
            error: "Could not resolve source wall geometry."
        };
    }

    var sourceDescriptors = [];
    if (sourceRemaining.length>0) {
        sourceRemaining.sort(function(a, b) {
            return a.centerT - b.centerT;
        });
        var sourceWallLength = sourceCandidate.axisStart.getDistanceTo(sourceCandidate.axisEnd);
        var sourceDescriptorResult = buildHostedOpeningDescriptors(sourceWallLength, sourceCorners, sourceRemaining);
        if (!isNull(sourceDescriptorResult.error)) {
            return {
                error: sourceDescriptorResult.error
            };
        }
        sourceDescriptors = sourceDescriptorResult.descriptors;
    }

    var sourceOps = this.createWallOperationsFromDescriptors(document, sourceCandidate, sourceCorners, sourceDescriptors);

    var targetCorners = getWallCornersFromAxis(targetCandidate.axisStart, targetCandidate.axisEnd, targetCandidate.thickness);
    if (isNull(targetCorners)) {
        return {
            error: "Could not resolve target wall geometry."
        };
    }

    var targetHostedObjects = getHostedWallObjects(document, targetCandidate.groupId);
    targetHostedObjects.push(movingObject);
    targetHostedObjects.sort(function(a, b) {
        return a.centerT - b.centerT;
    });

    var targetWallLength = targetCandidate.axisStart.getDistanceTo(targetCandidate.axisEnd);
    var targetDescriptorResult = buildHostedOpeningDescriptors(targetWallLength, targetCorners, targetHostedObjects);
    if (!isNull(targetDescriptorResult.error)) {
        return {
            error: targetDescriptorResult.error
        };
    }

    var targetDescriptor = this.findDescriptorByObjectId(targetDescriptorResult.descriptors, movingObject.objectId);
    if (isNull(targetDescriptor)) {
        return {
            error: "Could not resolve the moved hosted opening."
        };
    }

    var targetOps = this.createWallOperationsFromDescriptors(document, targetCandidate, targetCorners, targetDescriptorResult.descriptors);
    var targetSymbolAddOp = new RAddObjectsOperation();
    var targetSymbolError = this.appendSymbolEntitiesForDescriptor(document, di, targetCandidate, targetCorners, targetDescriptor, targetSymbolAddOp);
    if (!isNull(targetSymbolError)) {
        return {
            error: targetSymbolError
        };
    }

    return {
        sourceDeleteOp: sourceOps.deleteOp,
        sourceWallAddOp: sourceOps.wallAddOp,
        targetDeleteOp: targetOps.deleteOp,
        targetWallAddOp: targetOps.wallAddOp,
        symbolDeleteOp: symbolDeleteOp,
        symbolAddOp: targetSymbolAddOp,
        updatedHostedObject: movingObject
    };
};

function HostedRepositionAction(guiAction, shellPanel, selectedInfo) {
    EAction.call(this, guiAction);
    this.shellPanel = shellPanel;
    this.selectedInfo = selectedInfo;
}

HostedRepositionAction.prototype = new EAction();

HostedRepositionAction.State = {
    SelectingWall: 0
};

HostedRepositionAction.prototype.beginEvent = function() {
    EAction.prototype.beginEvent.call(this);

    LandscapeShellRuntime.activeHostedPlacementAction = this;

    if (!isNull(this.shellPanel)) {
        this.shellPanel.setActiveBuildingCommand(this.selectedInfo.libraryItem.category);
        this.shellPanel.setScaleReferenceStatus("Click a new wall edge position for " + this.selectedInfo.libraryItem.label + ".");
    }

    this.setState(HostedRepositionAction.State.SelectingWall);
};

HostedRepositionAction.prototype.setState = function(state) {
    EAction.prototype.setState.call(this, state);

    this.getDocumentInterface().setClickMode(RAction.PickCoordinate);
    this.setCrosshairCursor();
    EAction.showSnapTools();

    if (state===HostedRepositionAction.State.SelectingWall) {
        this.setCommandPrompt("Click new wall position for " + this.selectedInfo.libraryItem.label);
        this.setLeftMouseTip("Click new wall position");
        this.setRightMouseTip(EAction.trCancel);
    }
};

HostedRepositionAction.prototype.terminate = function() {
    if (LandscapeShellRuntime.activeHostedPlacementAction===this) {
        LandscapeShellRuntime.activeHostedPlacementAction = undefined;
    }
    EAction.prototype.terminate.call(this);
};

HostedRepositionAction.prototype.reportIssue = function(text) {
    if (!isNull(this.shellPanel)) {
        this.shellPanel.setScaleReferenceStatus(text);
    }
    logLine("[ERR] hosted reposition: " + text);
};

HostedRepositionAction.prototype.coordinateEvent = function(event) {
    var di = this.getDocumentInterface();
    var document = this.getDocument();

    if (isNull(di) || isNull(document)) {
        this.reportIssue("No active drawing is available for hosted reposition.");
        return;
    }

    var targetCandidate = getHostedWallCandidateFromClick(document, event.getModelPosition(), 2.5);
    if (isNull(targetCandidate)) {
        this.reportIssue("Click directly on a wall edge to reposition the hosted item.");
        return;
    }

    var helperAction = new HostedLibraryPlacementAction(undefined, this.shellPanel, this.selectedInfo.libraryItem);
    var buildResult = helperAction.buildHostedRepositionOperations(document, di, this.selectedInfo, targetCandidate);
    if (!isNull(buildResult.error)) {
        this.reportIssue(buildResult.error);
        return;
    }

    if (!isNull(buildResult.symbolDeleteOp)) {
        di.applyOperation(buildResult.symbolDeleteOp);
    }
    if (!isNull(buildResult.sourceDeleteOp)) {
        di.applyOperation(buildResult.sourceDeleteOp);
    }
    if (!isNull(buildResult.targetDeleteOp)) {
        di.applyOperation(buildResult.targetDeleteOp);
    }
    if (!isNull(buildResult.sourceWallAddOp)) {
        di.applyOperation(buildResult.sourceWallAddOp);
    }
    if (!isNull(buildResult.targetWallAddOp)) {
        di.applyOperation(buildResult.targetWallAddOp);
    }
    if (!isNull(buildResult.symbolAddOp)) {
        di.applyOperation(buildResult.symbolAddOp);
    }
    forceDocumentRedraw(di);

    var updatedInfo = {
        entityId: this.selectedInfo.entityId,
        objectId: this.selectedInfo.objectId,
        groupId: targetCandidate.groupId,
        libraryItemId: this.selectedInfo.libraryItemId,
        libraryItem: buildResult.updatedHostedObject.libraryItem,
        openingWidth: buildResult.updatedHostedObject.openingWidth,
        centerT: buildResult.updatedHostedObject.centerT,
        faceSide: buildResult.updatedHostedObject.faceSide
    };

    if (!isNull(this.shellPanel)) {
        this.shellPanel.updateHostedSelectionUi(updatedInfo);
        this.shellPanel.setScaleReferenceStatus(updatedInfo.libraryItem.label + " repositioned on wall.");
    }

    logLine("[OK] hosted reposition complete: object=" + this.selectedInfo.objectId + ", targetWall=" + targetCandidate.groupId);
    this.terminate();
};

HostedLibraryPlacementAction.prototype.buildHostedFlipOperations = function(document, di, selectedInfo) {
    var candidate = getHostedWallCandidateFromGroup(document, selectedInfo.groupId);
    if (isNull(candidate)) {
        return {
            error: "Could not resolve the wall for the selected door."
        };
    }

    var corners = getWallCornersFromAxis(candidate.axisStart, candidate.axisEnd, candidate.thickness);
    if (isNull(corners)) {
        return {
            error: "Could not resolve wall geometry."
        };
    }

    var hostedObjects = getHostedWallObjects(document, selectedInfo.groupId);
    var targetObject = undefined;
    for (var i=0; i<hostedObjects.length; i++) {
        if (hostedObjects[i].objectId===selectedInfo.objectId) {
            targetObject = hostedObjects[i];
            break;
        }
    }
    if (isNull(targetObject)) {
        return {
            error: "Could not resolve the selected hosted door."
        };
    }

    if (!isSingleSwingDoorItem(targetObject.libraryItem)) {
        return {
            error: "Flip Swing currently works for single-swing doors only."
        };
    }

    var nextHingeSide = (targetObject.libraryItem.hingeSide==="right") ? "left" : "right";
    targetObject.hingeSide = nextHingeSide;
    targetObject.faceSide = selectedInfo.faceSide || targetObject.faceSide || "";
    targetObject.libraryItem = cloneLibraryItemWithOverrides(targetObject.libraryItem, {
        hingeSide: nextHingeSide
    });

    var wallLength = candidate.axisStart.getDistanceTo(candidate.axisEnd);
    hostedObjects.sort(function(a, b) {
        return a.centerT - b.centerT;
    });

    var descriptorResult = buildHostedOpeningDescriptors(wallLength, corners, hostedObjects);
    if (!isNull(descriptorResult.error)) {
        return {
            error: descriptorResult.error
        };
    }

    var targetDescriptor = this.findDescriptorByObjectId(descriptorResult.descriptors, targetObject.objectId);
    if (isNull(targetDescriptor)) {
        return {
            error: "Could not resolve the flipped hosted door."
        };
    }

    var ops = this.createWallOperationsFromDescriptors(document, candidate, corners, descriptorResult.descriptors);
    var existingHostedEntities = getHostedEntitiesForObject(document, targetObject.objectId);
    for (var eh=0; eh<existingHostedEntities.length; eh++) {
        ops.deleteOp.deleteObject(existingHostedEntities[eh]);
    }

    var symbolAddOp = new RAddObjectsOperation();
    var symbolError = this.appendSymbolEntitiesForDescriptor(document, di, candidate, corners, targetDescriptor, symbolAddOp);
    if (!isNull(symbolError)) {
        return {
            error: symbolError
        };
    }

    return {
        deleteOp: ops.deleteOp,
        wallAddOp: ops.wallAddOp,
        symbolAddOp: symbolAddOp,
        updatedHostedObject: targetObject
    };
};

HostedLibraryPlacementAction.prototype.coordinateEvent = function(event) {
    var di = this.getDocumentInterface();
    var document = this.getDocument();

    if (isNull(di) || isNull(document)) {
        this.reportIssue("No active drawing is available for hosted placement.");
        return;
    }

    var candidate = getHostedWallCandidateFromClick(document, event.getModelPosition(), 2.5);
    if (isNull(candidate)) {
        this.reportIssue("Click directly on a wall edge to place " + this.libraryItem.label + ".");
        return;
    }

    var buildResult = this.buildWallAndSymbolOperations(document, di, candidate);
    if (!isNull(buildResult.error)) {
        this.reportIssue(buildResult.error);
        return;
    }

    di.applyOperation(buildResult.deleteOp);
    di.applyOperation(buildResult.wallAddOp);
    di.applyOperation(buildResult.symbolAddOp);
    forceDocumentRedraw(di);

    var summary = this.libraryItem.label + " placed on wall with hosted opening.";
    if (!isNull(this.shellPanel)) {
        this.shellPanel.setScaleReferenceStatus(summary);
    }

    logLine("[OK] hosted library item placed: " + this.libraryItem.id + ", wall=" + candidate.groupId);
    this.terminate();
};

WallToolAction.prototype.getPhaseSpec = function() {
    switch (this.phase) {
    case "Existing":
        return {
            layerName: "WALL_EXISTING",
            colorName: "black"
        };

    case "Removal / Demo":
        return {
            layerName: "WALL_DEMO",
            colorName: "red"
        };

    case "Proposed":
    default:
        return {
            layerName: "WALL_PROPOSED",
            colorName: "darkblue"
        };
    }
};

WallToolAction.prototype.getWallCorners = function() {
    var dx = this.point2.x - this.point1.x;
    var dy = this.point2.y - this.point1.y;
    var length = Math.sqrt(dx*dx + dy*dy);
    if (length<=1e-9) {
        return undefined;
    }

    var halfThickness = this.thickness / 2.0;
    var px = -dy / length * halfThickness;
    var py = dx / length * halfThickness;

    return {
        a: new RVector(this.point1.x + px, this.point1.y + py),
        b: new RVector(this.point2.x + px, this.point2.y + py),
        c: new RVector(this.point2.x - px, this.point2.y - py),
        d: new RVector(this.point1.x - px, this.point1.y - py)
    };
};

WallToolAction.prototype.getPhaseStyle = function() {
    switch (this.phase) {
    case "Existing":
        return {
            outline: new RColor("black")
        };

    case "Removal / Demo":
        return {
            outline: new RColor("red")
        };

    case "Proposed":
    default:
        return {
            outline: new RColor("darkblue")
        };
    }
};

WallToolAction.prototype.addPrototypeWallMetadata = function(entity, groupId) {
    setAppCustomProperty(entity, "wallGroupId", groupId);
    setAppCustomProperty(entity, "wallThickness", String(this.thickness));
    setAppCustomProperty(entity, "wallPhase", this.phase);
    setAppCustomProperty(entity, "wallAxisStartX", String(this.point1.x));
    setAppCustomProperty(entity, "wallAxisStartY", String(this.point1.y));
    setAppCustomProperty(entity, "wallAxisEndX", String(this.point2.x));
    setAppCustomProperty(entity, "wallAxisEndY", String(this.point2.y));
};

WallToolAction.prototype.buildWallOperation = function(preview) {
    if (isNull(this.point1) || isNull(this.point2)) {
        return undefined;
    }

    var doc = this.getDocument();
    if (isNull(doc)) {
        return undefined;
    }

    var corners = this.getWallCorners();
    if (isNull(corners)) {
        return undefined;
    }

    ensureWallWrappersInitialized();

    var phaseSpec = this.getPhaseSpec();
    var phaseStyle = this.getPhaseStyle();
    var layerId = undefined;

    if (!preview) {
        var di = this.getDocumentInterface();
        ensureLayer(doc, di, phaseSpec.layerName, phaseSpec.colorName);
        var layer = doc.queryLayer(phaseSpec.layerName);
        if (!isNull(layer)) {
            layerId = layer.getId();
        }
    }

    var op = new RAddObjectsOperation();
    var groupId = "wall-" + String(new Date().getTime()) + "-" + String(Math.floor(Math.random()*100000));

    var lineDataList = [
        new RLineData(corners.a, corners.b),
        new RLineData(corners.b, corners.c),
        new RLineData(corners.c, corners.d),
        new RLineData(corners.d, corners.a)
    ];

    for (var i=0; i<lineDataList.length; i++) {
        var line = new RLineEntity(doc, lineDataList[i]);
        if (!isNull(layerId)) {
            line.setLayerId(layerId);
        }
        try {
            line.setColor(phaseStyle.outline);
        }
        catch (e3) {
        }
        try {
            line.setLineweight(RLineweight.Weight030);
        }
        catch (e4) {
        }
        if (!preview) {
            this.addPrototypeWallMetadata(line, groupId);
        }
        op.addObject(line, false);
    }

    return op;
};

WallToolAction.prototype.applyWall = function() {
    var di = this.getDocumentInterface();
    var doc = this.getDocument();
    if (isNull(di) || isNull(doc)) {
        if (!isNull(this.shellPanel)) {
            this.shellPanel.setScaleReferenceStatus("Could not access the drawing for wall creation.");
        }
        this.terminate();
        return false;
    }

    var op = this.buildWallOperation(false);
    if (isNull(op)) {
        if (!isNull(this.shellPanel)) {
            this.shellPanel.setScaleReferenceStatus("Wall points are too close together.");
        }
        this.terminate();
        return false;
    }

    di.applyOperation(op);
    forceDocumentRedraw(di);

    var wallLength = this.point1.getDistanceTo(this.point2);
    var summary = "Wall created. Length " + wallLength.toFixed(2) +
        ", thickness " + this.thickness.toFixed(2) +
        ", phase " + this.phase + ". Continue from the last endpoint or press Esc.";
    if (!isNull(this.shellPanel)) {
        this.shellPanel.setScaleReferenceStatus(summary);
    }
    logLine("[OK] wall created: length=" + wallLength.toFixed(2) + ", thickness=" + this.thickness.toFixed(2) + ", phase=" + this.phase);

    this.point1 = this.point2;
    this.point2 = undefined;
    this.setState(WallToolAction.State.SettingPoint2);
    return true;
};

WallToolAction.prototype.getOperation = function(preview) {
    return this.buildWallOperation(preview===true);
};

ScaleReferenceAction.prototype.completeInteractiveReference = function() {
    var measuredDistance = this.point1.getDistanceTo(this.point2);

    var knownDistance = this.promptKnownDistance(measuredDistance);
    if (isNull(knownDistance) || isNaN(knownDistance) || knownDistance<=0) {
        if (!isNull(this.shellPanel)) {
            this.shellPanel.setScaleReferenceStatus("Scale reference canceled.");
        }
        logLine("[OK] scale reference canceled after point capture");
        this.terminate();
        return;
    }

    var nonReferenceCount = this.getNonReferenceGeometryCount();
    if (!this.autoMode && nonReferenceCount>0 && !this.confirmNonReferenceCalibration(nonReferenceCount)) {
        if (!isNull(this.shellPanel)) {
            this.shellPanel.setScaleReferenceStatus("Calibration canceled.");
        }
        logLine("[OK] calibration canceled after non-reference geometry warning");
        this.terminate();
        return;
    }

    logLine("[OK] interactive scale reference captured. measured=" + measuredDistance + ", known=" + knownDistance);
    this.applyKnownDistance(knownDistance);
    LandscapeShellRuntime.activeScaleReferenceAction = undefined;
    this.terminate();
};

ScaleReferenceAction.prototype.terminate = function() {
    LandscapeShellRuntime.activeScaleReferenceAction = undefined;
    EAction.prototype.terminate.call(this);
};

ScaleReferenceAction.prototype.getActiveDocumentInterface = function() {
    try {
        var di = EAction.getDocumentInterface();
        if (!isNull(di)) {
            return di;
        }
    }
    catch (e) {
    }

    try {
        di = this.getDocumentInterface();
        if (!isNull(di)) {
            return di;
        }
    }
    catch (e2) {
    }

    return undefined;
};

ScaleReferenceAction.prototype.getActiveDocument = function() {
    try {
        var doc = EAction.getDocument();
        if (!isNull(doc)) {
            return doc;
        }
    }
    catch (e) {
    }

    var di = this.getActiveDocumentInterface();
    if (!isNull(di)) {
        try {
            return di.getDocument();
        }
        catch (e2) {
        }
    }

    return undefined;
};

function ensureActiveDocument() {
    var di = undefined;
    try {
        di = EAction.getDocumentInterface();
        if (!isNull(di)) {
            logLine("[OK] active document interface already available");
            return di;
        }
    }
    catch (e) {
    }

    safeCall("create new document", function() {
        if (!isNull(NewFile) && typeof NewFile.createMdiChild === "function") {
            NewFile.createMdiChild();
            return "NewFile.createMdiChild called";
        }

        var newFileAction = RGuiAction.getByScriptFile("scripts/File/NewFile/NewFile.js");
        if (!isNull(newFileAction)) {
            newFileAction.slotTrigger();
            return "NewFile action triggered";
        }

        return "no new document path found";
    });

    try {
        di = EAction.getDocumentInterface();
    }
    catch (e2) {
    }
    return di;
}

function registerLandscapeWallGuiAction() {
    if (!isNull(LandscapeShellRuntime.wallGuiAction)) {
        return LandscapeShellRuntime.wallGuiAction;
    }

    var scriptFile = LandscapeShellPanel.includeBasePath + "/LandscapeShellWallAction.js";

    try {
        var existing = RGuiAction.getByScriptFile(scriptFile);
        if (!isNull(existing)) {
            LandscapeShellRuntime.wallGuiAction = existing;
            logLine("[OK] reused existing wall gui action");
            return existing;
        }
    }
    catch (e) {
        logLine("[ERR] RGuiAction.getByScriptFile failed for wall action: " + e);
    }

    try {
        var action = new RGuiAction(qsTr("Landscape Walls Tool"), RMainWindowQt.getMainWindow());
        action.setRequiresDocument(true);
        action.setScriptFile(scriptFile);
        action.setObjectName("LandscapeShellWallToolGuiAction");
        action.setStatusTip(qsTr("Draw exterior or interior walls"));
        action.setDefaultCommands(["lpwall"]);
        LandscapeShellRuntime.wallGuiAction = action;
        logLine("[OK] registered wall gui action: " + scriptFile);
        return action;
    }
    catch (e2) {
        logLine("[ERR] failed to create wall gui action: " + e2);
        return undefined;
    }
}

function promptForUnderlayFile() {
    var appWin = EAction.getMainWindow();
    var initialPath = QDir.homePath();
    var imageFilter = qsTr("Image Files") + " (*.png *.jpg *.jpeg *.bmp *.gif *.tif *.tiff)";
    var filterAll = qsTr("All Files") + " (*)";

    var fileDialog = new QFileDialog(appWin, qsTr("Import Underlay"), initialPath, "");
    fileDialog.setNameFilters([ imageFilter, filterAll ]);
    fileDialog.selectNameFilter(imageFilter);
    fileDialog.setOption(QFileDialog.DontUseNativeDialog, getDontUseNativeDialog());
    fileDialog.fileMode = QFileDialog.ExistingFile;

    if (!fileDialog.exec()) {
        destrDialog(fileDialog);
        EAction.activateMainWindow();
        return undefined;
    }

    var files = fileDialog.selectedFiles();
    destrDialog(fileDialog);
    EAction.activateMainWindow();

    if (files.length===0) {
        return undefined;
    }

    return files[0];
}

function ensureImageWrappersInitialized() {
    if (typeof RImageData_Wrapper !== "undefined" && !isNull(RImageData_Wrapper) && typeof RImageData_Wrapper.init === "function") {
        RImageData_Wrapper.init();
    }
    if (typeof RImageEntity_Wrapper !== "undefined" && !isNull(RImageEntity_Wrapper) && typeof RImageEntity_Wrapper.init === "function") {
        RImageEntity_Wrapper.init();
    }
}

function ensureWallWrappersInitialized() {
    if (typeof RPolylineData_Wrapper !== "undefined" && !isNull(RPolylineData_Wrapper) && typeof RPolylineData_Wrapper.init === "function") {
        RPolylineData_Wrapper.init();
    }
    if (typeof RPolylineEntity_Wrapper !== "undefined" && !isNull(RPolylineEntity_Wrapper) && typeof RPolylineEntity_Wrapper.init === "function") {
        RPolylineEntity_Wrapper.init();
    }
}

function ensureGraphicsViewWrappersInitialized() {
    if (typeof RGraphicsView_Wrapper !== "undefined" && !isNull(RGraphicsView_Wrapper) && typeof RGraphicsView_Wrapper.init === "function") {
        RGraphicsView_Wrapper.init();
    }
    if (typeof RGraphicsViewQt_Wrapper !== "undefined" && !isNull(RGraphicsViewQt_Wrapper) && typeof RGraphicsViewQt_Wrapper.init === "function") {
        RGraphicsViewQt_Wrapper.init();
    }
}

function ensureLayer(document, di, layerName, colorName) {
    if (document.hasLayer(layerName)) {
        return layerName;
    }

    var op = new RModifyObjectsOperation();
    var linetypeId = document.getLinetypeId("CONTINUOUS");
    var layer = new RLayer(document, layerName, false, false, new RColor(colorName), linetypeId, RLineweight.Weight000);
    op.addObject(layer);
    di.applyOperation(op);
    logLine("[OK] created layer: " + layerName);
    return layerName;
}

function forceDocumentRedraw(di) {
    if (isNull(di)) {
        return;
    }

    try {
        di.regenerateScenes();
    }
    catch (e) {
    }

    try {
        di.repaintViews();
    }
    catch (e2) {
    }
}

function getReferenceUnderlayLayer(document) {
    if (isNull(document) || !document.hasLayer(LandscapeShellConstants.UnderlayLayerName)) {
        return undefined;
    }

    return document.queryLayer(LandscapeShellConstants.UnderlayLayerName);
}

function getAppCustomProperty(object, key, defaultValue) {
    try {
        var value = object.getCustomProperty(RSettings.getAppId(), key, defaultValue);
        if (!isNull(value)) {
            return value;
        }
    }
    catch (e) {
    }

    try {
        value = object.getCustomProperty(RSettings.getAppId(), key);
        if (!isNull(value)) {
            return value;
        }
    }
    catch (e2) {
    }

    return defaultValue;
}

function setAppCustomProperty(object, key, value) {
    try {
        object.setCustomProperty(RSettings.getAppId(), key, value);
        return true;
    }
    catch (e) {
        logLine("[ERR] could not set custom property " + key + ": " + e);
        return false;
    }
}

function applyModifiedLayer(di, layer) {
    var op = new RModifyObjectsOperation();
    op.addObject(layer);
    di.applyOperation(op);
    forceDocumentRedraw(di);
}

function persistReferenceUnderlayMetadata(di) {
    if (isNull(di) || isNull(LandscapeShellRuntime.latestUnderlayImport)) {
        return false;
    }

    var doc = di.getDocument();
    var layer = getReferenceUnderlayLayer(doc);
    if (isNull(layer)) {
        return false;
    }

    var metadata = LandscapeShellRuntime.latestUnderlayImport;
    setAppCustomProperty(layer, "underlayFilePath", metadata.fileName || "");
    setAppCustomProperty(layer, "underlayWidth", String(metadata.width || 0));
    setAppCustomProperty(layer, "underlayHeight", String(metadata.height || 0));
    setAppCustomProperty(layer, "underlayVisible", metadata.visible===false ? "false" : "true");
    setAppCustomProperty(layer, "underlayLocked", metadata.locked===true ? "true" : "false");
    setAppCustomProperty(layer, "underlayLastCalibrationRatio", String(metadata.lastCalibrationRatio || ""));
    setAppCustomProperty(layer, "underlayLastKnownDistance", String(metadata.lastKnownDistance || ""));
    setAppCustomProperty(layer, "underlayEntityIds", LandscapeShellRuntime.underlayEntityIds.join(","));
    applyModifiedLayer(di, layer);
    logLine("[OK] persisted reference underlay metadata");
    return true;
}

function restoreReferenceUnderlayRuntimeFromDocument(shellPanel) {
    var di = ensureActiveDocument();
    if (isNull(di)) {
        return false;
    }

    var doc = di.getDocument();
    var layer = getReferenceUnderlayLayer(doc);
    if (isNull(layer)) {
        LandscapeShellRuntime.underlayEntityIds = [];
        LandscapeShellRuntime.latestUnderlayImport = undefined;
        return false;
    }

    var referenceEntities = getReferenceUnderlayEntities(doc);
    var entityIds = [];
    for (var i=0; i<referenceEntities.length; i++) {
        try {
            entityIds.push(referenceEntities[i].getId());
        }
        catch (e) {
        }
    }
    LandscapeShellRuntime.underlayEntityIds = entityIds;

    if (referenceEntities.length===0) {
        LandscapeShellRuntime.latestUnderlayImport = undefined;
        return false;
    }

    LandscapeShellRuntime.latestUnderlayImport = {
        fileName: getAppCustomProperty(layer, "underlayFilePath", ""),
        width: parseFloat(getAppCustomProperty(layer, "underlayWidth", "0")) || 0,
        height: parseFloat(getAppCustomProperty(layer, "underlayHeight", "0")) || 0,
        visible: getAppCustomProperty(layer, "underlayVisible", "true")!=="false",
        locked: getAppCustomProperty(layer, "underlayLocked", "false")==="true",
        lastCalibrationRatio: parseFloat(getAppCustomProperty(layer, "underlayLastCalibrationRatio", "")) || undefined,
        lastKnownDistance: parseFloat(getAppCustomProperty(layer, "underlayLastKnownDistance", "")) || undefined
    };

    if (!isNull(shellPanel)) {
        shellPanel.setScaleReferenceStatus("Underlay restored from drawing.");
    }

    logLine("[OK] restored reference underlay runtime from drawing: ids=" + entityIds.join(","));
    return true;
}

function getTrackedUnderlayEntities(doc) {
    var result = [];
    if (isNull(doc) || isNull(LandscapeShellRuntime.underlayEntityIds)) {
        return result;
    }

    for (var i=0; i<LandscapeShellRuntime.underlayEntityIds.length; i++) {
        var id = LandscapeShellRuntime.underlayEntityIds[i];
        var entity = undefined;
        try {
            entity = doc.queryEntity(id);
        }
        catch (e) {
        }

        if (!isNull(entity)) {
            result.push(entity);
        }
    }

    return result;
}

function getReferenceUnderlayEntities(doc) {
    var result = [];
    var layer = getReferenceUnderlayLayer(doc);
    if (isNull(layer)) {
        return result;
    }

    var layerId = undefined;
    try {
        layerId = layer.getId();
    }
    catch (e) {
        return result;
    }

    var ids = doc.queryAllEntities();
    for (var i=0; i<ids.length; i++) {
        var entity = undefined;
        try {
            entity = doc.queryEntity(ids[i]);
        }
        catch (e2) {
        }

        if (isNull(entity)) {
            continue;
        }

        try {
            if (entity.getLayerId()===layerId) {
                result.push(entity);
            }
        }
        catch (e3) {
        }
    }

    return result;
}

function setReferenceUnderlayVisibility(visible) {
    var di = ensureActiveDocument();
    if (isNull(di)) {
        logLine("[ERR] no active document interface for underlay visibility");
        return false;
    }

    var doc = di.getDocument();
    var layer = getReferenceUnderlayLayer(doc);
    if (isNull(layer)) {
        logLine("[ERR] reference underlay layer not found for visibility change");
        return false;
    }

    var trackedEntities = getReferenceUnderlayEntities(doc);
    var entityChanged = false;

    if (trackedEntities.length>0) {
        var op = new RModifyObjectsOperation();
        for (var i=0; i<trackedEntities.length; i++) {
            try {
                trackedEntities[i].setVisible(visible);
                trackedEntities[i].setSelected(false);
                op.addObject(trackedEntities[i], false);
                entityChanged = true;
            }
            catch (e) {
            }
        }

        if (entityChanged) {
            di.applyOperation(op);
        }
    }

    var layerChanged = false;
    try {
        layer.setOff(!visible);
        layerChanged = true;
    }
    catch (e2) {
    }
    if (!layerChanged) {
        try {
            layer.setFrozen(!visible);
            layerChanged = true;
        }
        catch (e3) {
        }
    }
    if (layerChanged) {
        applyModifiedLayer(di, layer);
    }

    if (!entityChanged && !layerChanged) {
        logLine("[ERR] could not change underlay visibility");
        return false;
    }

    forceDocumentRedraw(di);

    if (!isNull(LandscapeShellRuntime.latestUnderlayImport)) {
        LandscapeShellRuntime.latestUnderlayImport.visible = visible;
    }
    persistReferenceUnderlayMetadata(di);

    logLine("[OK] underlay visibility changed: " + (visible ? "shown" : "hidden"));
    return true;
}

function setReferenceUnderlayLocked(locked) {
    var di = ensureActiveDocument();
    if (isNull(di)) {
        logLine("[ERR] no active document interface for underlay lock change");
        return false;
    }

    var doc = di.getDocument();
    var layer = getReferenceUnderlayLayer(doc);
    if (isNull(layer)) {
        logLine("[ERR] reference underlay layer not found for lock change");
        return false;
    }

    var changed = false;

    try {
        layer.setLocked(locked);
        changed = true;
    }
    catch (e) {
    }

    if (changed) {
        applyModifiedLayer(di, layer);
    }

    var trackedEntities = getReferenceUnderlayEntities(doc);
    for (var i=0; i<trackedEntities.length; i++) {
        try {
            trackedEntities[i].setSelected(false);
        }
        catch (e2) {
        }
    }

    forceDocumentRedraw(di);

    if (!isNull(LandscapeShellRuntime.latestUnderlayImport)) {
        LandscapeShellRuntime.latestUnderlayImport.locked = locked;
    }
    persistReferenceUnderlayMetadata(di);

    if (changed) {
        logLine("[OK] underlay lock changed: " + (locked ? "locked" : "unlocked"));
        return true;
    }

    logLine("[ERR] could not change underlay lock");
    return false;
}

function removeExistingReferenceUnderlays(doc, di) {
    var deleteOp = new RDeleteObjectsOperation();
    var removed = 0;

    var referenceEntities = getReferenceUnderlayEntities(doc);
    for (var i=0; i<referenceEntities.length; i++) {
        deleteOp.deleteObject(referenceEntities[i]);
        removed++;
    }

    if (removed>0) {
        di.applyOperation(deleteOp);
    }

    LandscapeShellRuntime.underlayEntityIds = [];
    LandscapeShellRuntime.latestUnderlayImport = undefined;
    forceDocumentRedraw(di);

    logLine("[OK] removed existing reference underlays: " + removed);
    return removed;
}

function indexEntityIds(ids) {
    var index = {};
    if (isNull(ids)) {
        return index;
    }

    for (var i=0; i<ids.length; i++) {
        index[String(ids[i])] = true;
    }

    return index;
}

function getNewEntityIds(beforeIds, afterIds) {
    var result = [];
    var beforeIndex = indexEntityIds(beforeIds);

    for (var i=0; i<afterIds.length; i++) {
        var id = afterIds[i];
        if (!beforeIndex[String(id)]) {
            result.push(id);
        }
    }

    return result;
}

function assignEntitiesToReferenceUnderlay(doc, di, entityIds) {
    var layer = getReferenceUnderlayLayer(doc);
    if (isNull(layer) || isNull(entityIds) || entityIds.length===0) {
        return 0;
    }

    var op = new RModifyObjectsOperation();
    var assigned = 0;

    for (var i=0; i<entityIds.length; i++) {
        var entity = undefined;
        try {
            entity = doc.queryEntity(entityIds[i]);
        }
        catch (e) {
        }

        if (isNull(entity)) {
            continue;
        }

        try {
            entity.setLayerId(layer.getId());
            op.addObject(entity, false);
            assigned++;
        }
        catch (e2) {
        }
    }

    if (assigned>0) {
        di.applyOperation(op);
        forceDocumentRedraw(di);
    }

    logLine("[OK] assigned entities to reference underlay layer: " + assigned);
    return assigned;
}

function getInitialUnderlaySize(fileName) {
    var maxDimension = LandscapeShellConstants.UnderlayMaxDimension;
    var result = {
        width: maxDimension,
        height: maxDimension
    };

    try {
        var image = new QImage();
        if (image.load(fileName)) {
            var imageWidth = image.width();
            var imageHeight = image.height();
            if (imageWidth>0 && imageHeight>0) {
                if (imageWidth>=imageHeight) {
                    result.width = maxDimension;
                    result.height = maxDimension * imageHeight / imageWidth;
                }
                else {
                    result.height = maxDimension;
                    result.width = maxDimension * imageWidth / imageHeight;
                }
            }
        }
    }
    catch (e) {
        logLine("[ERR] could not read underlay image size, using default square: " + e);
    }

    return result;
}

function importRasterUnderlay(fileName, shellPanel, replaceExisting) {
    var di = ensureActiveDocument();
    if (isNull(di)) {
        logLine("[ERR] no active document interface for underlay import");
        return false;
    }

    var doc = di.getDocument();
    if (isNull(doc)) {
        logLine("[ERR] no active document for underlay import");
        return false;
    }

    ensureImageWrappersInitialized();
    ensureLayer(doc, di, LandscapeShellConstants.UnderlayLayerName, "lightgray");

    if (replaceExisting===true) {
        removeExistingReferenceUnderlays(doc, di);
    }

    var beforeIds = doc.queryAllEntities();

    var size = getInitialUnderlaySize(fileName);
    var imageData = new RImageData();
    imageData.setFileName(fileName);
    imageData.setInsertionPoint(new RVector(0, 0));
    imageData.setWidth(size.width);
    imageData.setHeight(size.height);

    var entity = new RImageEntity(doc, imageData);

    var op = new RAddObjectsOperation();
    op.addObject(entity);
    di.applyOperation(op);

    var afterIds = doc.queryAllEntities();
    var newEntityIds = getNewEntityIds(beforeIds, afterIds);
    LandscapeShellRuntime.underlayEntityIds = newEntityIds;
    assignEntitiesToReferenceUnderlay(doc, di, newEntityIds);

    forceDocumentRedraw(di);

    LandscapeShellRuntime.latestUnderlayImport = {
        fileName: fileName,
        width: size.width,
        height: size.height,
        visible: true,
        locked: false,
        lastCalibrationRatio: undefined,
        lastKnownDistance: undefined
    };
    persistReferenceUnderlayMetadata(di);

    var summary = replaceExisting===true ?
        "Underlay replaced. Use Scale Reference to calibrate." :
        "Underlay imported. Use Scale Reference to calibrate.";
    if (!isNull(shellPanel)) {
        shellPanel.setScaleReferenceStatus(summary);
    }
    logLine("[OK] underlay imported: " + fileName + " (" + size.width.toFixed(2) + " x " + size.height.toFixed(2) + "), ids=" + newEntityIds.join(","));
    return true;
}

ScaleReferenceAction.prototype.applyReferenceLine = function() {
    var doc = this.getActiveDocument();
    var di = this.getActiveDocumentInterface();
    if (isNull(doc) || isNull(di)) {
        logLine("[ERR] could not resolve active document or document interface for reference line");
        return false;
    }
    var op = new RAddObjectsOperation();
    var line = new RLineEntity(doc, new RLineData(this.point1, this.point2));

    try {
        var layer = getReferenceUnderlayLayer(doc);
        if (!isNull(layer)) {
            line.setLayerId(layer.getId());
        }
    }
    catch (e) {
        logLine("[ERR] could not assign reference line to underlay layer: " + e);
    }

    op.addObject(line);
    di.applyOperation(op);
    logLine("[OK] reference line added");
    return true;
};

ScaleReferenceAction.prototype.getNonReferenceGeometryCount = function() {
    var doc = this.getActiveDocument();
    if (isNull(doc)) {
        return 0;
    }

    var referenceLayerId = undefined;
    try {
        var referenceLayer = getReferenceUnderlayLayer(doc);
        if (!isNull(referenceLayer)) {
            referenceLayerId = referenceLayer.getId();
        }
    }
    catch (e) {
    }

    var ids = doc.queryAllEntities();
    var count = 0;

    for (var i=0; i<ids.length; i++) {
        var entity = undefined;
        try {
            entity = doc.queryEntity(ids[i]);
        }
        catch (e2) {
        }

        if (isNull(entity)) {
            continue;
        }

        try {
            if (!isNull(referenceLayerId) && entity.getLayerId()===referenceLayerId) {
                continue;
            }
        }
        catch (e3) {
        }

        count++;
    }

    return count;
};

ScaleReferenceAction.prototype.confirmNonReferenceCalibration = function(nonReferenceCount) {
    var dialog = new QDialog(EAction.getMainWindow());
    dialog.windowTitle = "Scale Reference";

    var layout = new QVBoxLayout();

    var messageLabel = new QLabel(
        "This calibration will also affect " + nonReferenceCount +
        " existing drawing object" + (nonReferenceCount===1 ? "" : "s") +
        " outside Reference Underlay.",
        dialog
    );
    messageLabel.wordWrap = true;
    layout.addWidget(messageLabel);

    var helperLabel = new QLabel("Continue?", dialog);
    layout.addWidget(helperLabel);

    var buttonRow = new QHBoxLayout();
    var cancelButton = new QPushButton("Cancel", dialog);
    var continueButton = new QPushButton("Continue", dialog);
    buttonRow.addWidget(cancelButton);
    buttonRow.addWidget(continueButton);
    layout.addLayout(buttonRow);

    dialog.setLayout(layout);

    cancelButton.clicked.connect(function() {
        dialog.reject();
    });
    continueButton.clicked.connect(function() {
        dialog.accept();
    });

    var accepted = dialog.exec();
    destrDialog(dialog);
    EAction.activateMainWindow();

    logLine("[OK] non-reference calibration confirmation: " + (accepted ? "continue" : "cancel"));
    return accepted;
};

ScaleReferenceAction.prototype.scalePointAroundOrigin = function(point, origin, ratio) {
    var dx = point.x - origin.x;
    var dy = point.y - origin.y;
    return new RVector(origin.x + dx * ratio, origin.y + dy * ratio);
};

ScaleReferenceAction.prototype.copyPrototypeEntityAttributes = function(sourceEntity, targetEntity) {
    try {
        targetEntity.setLayerId(sourceEntity.getLayerId());
    }
    catch (e) {
    }

    try {
        targetEntity.setBlockId(sourceEntity.getBlockId());
    }
    catch (e2) {
    }

    try {
        targetEntity.setColor(sourceEntity.getColor());
    }
    catch (e3) {
    }

    try {
        targetEntity.setLinetypeId(sourceEntity.getLinetypeId());
    }
    catch (e4) {
    }

    try {
        targetEntity.setLineweight(sourceEntity.getLineweight());
    }
    catch (e5) {
    }

    try {
        targetEntity.setLinetypeScale(sourceEntity.getLinetypeScale());
    }
    catch (e6) {
    }
};

ScaleReferenceAction.prototype.isPrototypeImageEntity = function(entity) {
    if (isNull(entity)) {
        return false;
    }

    try {
        var data = entity.getData();
        return !isNull(data) &&
            typeof data.getInsertionPoint === "function" &&
            typeof data.getWidth === "function" &&
            typeof data.getHeight === "function";
    }
    catch (e) {
        return false;
    }
};

ScaleReferenceAction.prototype.getPrototypeImageFileName = function(entity, data) {
    try {
        if (!isNull(data) && typeof data.fileName === "function") {
            return data.fileName();
        }
    }
    catch (e) {
    }

    try {
        if (!isNull(entity) && typeof entity.fileName === "function") {
            return entity.fileName();
        }
    }
    catch (e2) {
    }

    try {
        if (!isNull(data) && typeof data.getFileName === "function") {
            return data.getFileName();
        }
    }
    catch (e3) {
    }

    try {
        if (!isNull(entity) && typeof entity.getFileName === "function") {
            return entity.getFileName();
        }
    }
    catch (e4) {
    }

    try {
        if (!isNull(entity) && typeof entity.getLayerId === "function") {
            var doc = this.getActiveDocument();
            if (!isNull(doc)) {
                var layer = doc.queryLayer(entity.getLayerId());
                if (!isNull(layer) && layer.getName()===LandscapeShellConstants.UnderlayLayerName) {
                    if (!isNull(LandscapeShellRuntime.latestUnderlayImport) &&
                            !isNull(LandscapeShellRuntime.latestUnderlayImport.fileName) &&
                            LandscapeShellRuntime.latestUnderlayImport.fileName!=="") {
                        logLine("[OK] using latest underlay import file name fallback for image entity");
                        return LandscapeShellRuntime.latestUnderlayImport.fileName;
                    }
                }
            }
        }
    }
    catch (e5) {
    }

    return undefined;
};

ScaleReferenceAction.prototype.applyPrototypeCalibration = function(ratio) {
    var doc = this.getActiveDocument();
    var di = this.getActiveDocumentInterface();
    if (isNull(doc) || isNull(di)) {
        logLine("[ERR] could not resolve active document for calibration transform");
        return {
            scaledLines: 0,
            scaledImages: 0
        };
    }

    ensureImageWrappersInitialized();

    var ids = doc.queryAllEntities();
    var deleteOp = new RDeleteObjectsOperation();
    var addOp = new RAddObjectsOperation();
    var scaledLines = 0;
    var scaledImages = 0;

    for (var i=0; i<ids.length; i++) {
        var entity = doc.queryEntity(ids[i]);
        if (isNull(entity)) {
            continue;
        }

        var data = entity.getData();
        if (isNull(data)) {
            continue;
        }

        if (isLineEntity(entity)) {
            var oldStart = data.getStartPoint();
            var oldEnd = data.getEndPoint();
            var newStart = this.scalePointAroundOrigin(oldStart, this.point1, ratio);
            var newEnd = this.scalePointAroundOrigin(oldEnd, this.point1, ratio);
            var replacement = new RLineEntity(doc, new RLineData(newStart, newEnd));
            this.copyPrototypeEntityAttributes(entity, replacement);
            deleteOp.deleteObject(entity);
            addOp.addObject(replacement, false);
            scaledLines++;
            continue;
        }

        if (this.isPrototypeImageEntity(entity)) {
            var oldInsertion = data.getInsertionPoint();
            var newInsertion = this.scalePointAroundOrigin(oldInsertion, this.point1, ratio);
            var oldWidth = data.getWidth();
            var oldHeight = data.getHeight();
            var imageFileName = this.getPrototypeImageFileName(entity, data);

            if (isNull(imageFileName) || imageFileName==="") {
                logLine("[ERR] skipped image entity without file name");
                continue;
            }

            var replacementData = new RImageData();
            replacementData.setFileName(imageFileName);
            replacementData.setInsertionPoint(newInsertion);
            replacementData.setWidth(oldWidth * ratio);
            replacementData.setHeight(oldHeight * ratio);

            var replacementImage = new RImageEntity(doc, replacementData);
            this.copyPrototypeEntityAttributes(entity, replacementImage);
            deleteOp.deleteObject(entity);
            addOp.addObject(replacementImage, false);
            scaledImages++;
        }
    }

    if (scaledLines + scaledImages > 0) {
        di.applyOperation(deleteOp);
        di.applyOperation(addOp);
    }

    logLine("[OK] prototype calibration scaled line entities: " + scaledLines);
    logLine("[OK] prototype calibration scaled image entities: " + scaledImages);
    return {
        scaledLines: scaledLines,
        scaledImages: scaledImages
    };
};

ScaleReferenceAction.prototype.applyKnownDistance = function(knownDistance) {
    var measuredDistance = this.point1.getDistanceTo(this.point2);
    var ratio = knownDistance / measuredDistance;

    this.applyReferenceLine();
    var scaleResult = this.applyPrototypeCalibration(ratio);

    LandscapeShellRuntime.latestScaleReference = {
        point1: this.point1,
        point2: this.point2,
        measuredDistance: measuredDistance,
        knownDistance: knownDistance,
        scaleRatio: ratio,
        scaledLineCount: scaleResult.scaledLines,
        scaledImageCount: scaleResult.scaledImages
    };

    if (!isNull(LandscapeShellRuntime.latestUnderlayImport) && scaleResult.scaledImages>0) {
        LandscapeShellRuntime.latestUnderlayImport.width = LandscapeShellRuntime.latestUnderlayImport.width * ratio;
        LandscapeShellRuntime.latestUnderlayImport.height = LandscapeShellRuntime.latestUnderlayImport.height * ratio;
        LandscapeShellRuntime.latestUnderlayImport.lastCalibrationRatio = ratio;
        LandscapeShellRuntime.latestUnderlayImport.lastKnownDistance = knownDistance;
        persistReferenceUnderlayMetadata(this.getActiveDocumentInterface());
    }

    var summary = "Measured " + measuredDistance.toFixed(2) +
        ", known " + knownDistance.toFixed(2) +
        ", ratio " + ratio.toFixed(4) +
        ", scaled " + scaleResult.scaledLines + " lines, " +
        scaleResult.scaledImages + " underlays";

    if (!isNull(this.shellPanel)) {
        this.shellPanel.setScaleReferenceStatus(summary);
    }

    logLine("[OK] scale reference applied: " + summary);
    return summary;
};

ScaleReferenceAction.prototype.promptKnownDistance = function(measuredDistance) {
    var loader = new QUiLoader();
    loader.setWorkingDirectory(new QDir(LandscapeShellPanel.includeBasePath));

    var file = new QFile(LandscapeShellPanel.includeBasePath + "/scale-reference-dialog.ui");
    file.open(makeQIODeviceOpenMode(QIODevice.ReadOnly, QIODevice.Text));
    var dialog = loader.load(file, EAction.getMainWindow());
    file.close();
    destr(loader);

    if (isNull(dialog)) {
        logLine("[ERR] failed to load scale reference dialog");
        return undefined;
    }

    var measuredDistanceValue = dialog.findChild("MeasuredDistanceValue");
    var knownDistanceEdit = dialog.findChild("KnownDistanceEdit");
    if (!isNull(measuredDistanceValue)) {
        measuredDistanceValue.text = measuredDistance.toFixed(2);
    }
    if (!isNull(knownDistanceEdit)) {
        knownDistanceEdit.text = measuredDistance.toFixed(2);
    }

    var accepted = dialog.exec();
    if (!accepted) {
        destrDialog(dialog);
        EAction.activateMainWindow();
        return undefined;
    }

    var rawValue = isNull(knownDistanceEdit) ? "" : knownDistanceEdit.text;
    destrDialog(dialog);
    EAction.activateMainWindow();

    var parsed = parseFloat(rawValue);
    if (isNaN(parsed) || parsed<=0) {
        QMessageBox.warning(EAction.getMainWindow(), "Scale Reference", "Enter a positive known distance.");
        return undefined;
    }

    return parsed;
};

ScaleReferenceAction.prototype.runSmokeTest = function(point1, point2, knownDistance) {
    this.point1 = point1;
    this.point2 = point2;
    return this.applyKnownDistance(knownDistance);
};

function addToolbarAction(toolbar, title, handler) {
    var button = new QToolButton(toolbar);
    button.text = title;
    button.toolButtonStyle = Qt.ToolButtonTextOnly;
    button.clicked.connect(handler);
    toolbar.addWidget(button);
    return button;
}

function getChildObjectName(object) {
    if (isNull(object)) {
        return "";
    }

    try {
        if (typeof object.objectName === "function") {
            return String(object.objectName());
        }
    }
    catch (e1) {
    }

    try {
        if (!isNull(object.objectName)) {
            return String(object.objectName);
        }
    }
    catch (e2) {
    }

    return "";
}

function getChildWindowTitle(object) {
    if (isNull(object)) {
        return "";
    }

    try {
        if (typeof object.windowTitle === "function") {
            return String(object.windowTitle());
        }
    }
    catch (e1) {
    }

    try {
        if (!isNull(object.windowTitle)) {
            return String(object.windowTitle);
        }
    }
    catch (e2) {
    }

    return "";
}

function getMetaClassName(object) {
    if (isNull(object)) {
        return "";
    }

    try {
        var metaObject = object.metaObject();
        if (!isNull(metaObject) && typeof metaObject.className === "function") {
            return String(metaObject.className());
        }
    }
    catch (e) {
    }

    return "";
}

function safeDisposeWidget(object) {
    if (isNull(object)) {
        return;
    }

    try {
        object.hide();
    }
    catch (e1) {
    }

    try {
        object.setParent(undefined);
    }
    catch (e2) {
    }

    try {
        if (typeof object.deleteLater === "function") {
            object.deleteLater();
        }
    }
    catch (e3) {
    }
}

function removeExistingLandscapeShellUi(appWin) {
    if (isNull(appWin)) {
        return;
    }

    try {
        var menuBar = appWin.menuBar();
        if (!isNull(menuBar) && typeof menuBar.actions === "function") {
            var actions = menuBar.actions();
            for (var i=actions.length-1; i>=0; i--) {
                var action = actions[i];
                var text = "";
                try {
                    text = String(action.text);
                }
                catch (eActionText) {
                }

                var menu = undefined;
                try {
                    if (typeof action.menu === "function") {
                        menu = action.menu();
                    }
                }
                catch (eActionMenu) {
                }

                if (text==="Landscape Planner" ||
                        getChildObjectName(menu)==="LandscapePlannerMenu" ||
                        getChildWindowTitle(menu)==="Landscape Planner") {
                    try {
                        menuBar.removeAction(action);
                    }
                    catch (eRemoveAction) {
                    }
                    safeDisposeWidget(menu);
                }
            }
        }
    }
    catch (eMenuBar) {
    }

    try {
        var children = appWin.children();
        for (var c=children.length-1; c>=0; c--) {
            var child = children[c];
            var className = getMetaClassName(child);
            var objectName = getChildObjectName(child);
            var windowTitle = getChildWindowTitle(child);

            if ((className==="QToolBar") &&
                    (objectName==="LandscapeWorkflowToolbar" || windowTitle==="Landscape Workflow")) {
                try {
                    if (typeof appWin.removeToolBar === "function") {
                        appWin.removeToolBar(child);
                    }
                }
                catch (eRemoveToolBar) {
                }
                safeDisposeWidget(child);
                continue;
            }

            if ((className==="QDockWidget") &&
                    (objectName==="LandscapePlannerDock" || windowTitle==="Landscape Planner")) {
                try {
                    if (typeof appWin.removeDockWidget === "function") {
                        appWin.removeDockWidget(child);
                    }
                }
                catch (eRemoveDock) {
                }
                safeDisposeWidget(child);
            }
        }
    }
    catch (eChildren) {
        logLine("[ERR] cleanup existing shell UI failed: " + eChildren);
    }
}

function main() {
    logLine("=== landscape shell prototype start ===");

    var appWin = safeCall("EAction.getMainWindow", function() {
        return EAction.getMainWindow();
    });

    if (isNull(appWin)) {
        logLine("[ERR] main window is null");
        QCoreApplication.quit();
        return;
    }

    safeCall("setWindowTitle", function() {
        appWin.setWindowTitle("Architecture Landscape CAD App - Prototype Shell (" + LandscapeShellConstants.BuildTag + ")");
        return "title updated";
    });

    safeCall("remove existing landscape shell ui", function() {
        removeExistingLandscapeShellUi(appWin);
        return "cleanup complete";
    });

    safeCall("add custom menu", function() {
        var menu = appWin.menuBar().addMenu("Landscape Planner");
        try {
            menu.setObjectName("LandscapePlannerMenu");
        }
        catch (eSetMenuName) {
        }

        var plantingAction = new QAction("Switch to Planting", menu);
        plantingAction.triggered.connect(function() {
            logLine("[OK] menu action triggered: Planting");
        });
        menu.addAction(plantingAction);

        var outputAction = new QAction("Switch to Output", menu);
        outputAction.triggered.connect(function() {
            logLine("[OK] menu action triggered: Output");
        });
        menu.addAction(outputAction);

        return "menu added";
    });

    safeCall("add workflow toolbar", function() {
        var toolbar = appWin.addToolBar("Landscape Workflow");
        try {
            toolbar.setObjectName("LandscapeWorkflowToolbar");
        }
        catch (eSetToolbarName) {
        }
        addToolbarAction(toolbar, "Site Setup", function() {
            logLine("[OK] toolbar action triggered: Site Setup");
        });
        addToolbarAction(toolbar, "Building", function() {
            logLine("[OK] toolbar action triggered: Building");
        });
        addToolbarAction(toolbar, "Planting", function() {
            logLine("[OK] toolbar action triggered: Planting");
        });
        addToolbarAction(toolbar, "Annotate", function() {
            logLine("[OK] toolbar action triggered: Annotate");
        });
        addToolbarAction(toolbar, "Output", function() {
            logLine("[OK] toolbar action triggered: Output");
        });
        return "toolbar added";
    });

    safeCall("add landscape dock", function() {
        var dock = new QDockWidget("Landscape Planner", appWin);
        try {
            dock.setObjectName("LandscapePlannerDock");
        }
        catch (eSetDockName) {
        }
        var panel = new LandscapeShellPanel(dock, appWin);
        dock.setWidget(panel);
        appWin.addDockWidget(Qt.RightDockWidgetArea, dock);
        LandscapeShellRuntime.shellPanel = panel;

        panel.setMode("Building");
        panel.setScaleReferenceStatus("Prototype build " + LandscapeShellConstants.BuildTag + " ready.");
        panel.toggleShellPiece("CadToolBar", false);
        panel.toggleShellPiece("StatusBar", false);

        return "dock added";
    });

    safeCall("probe known shell pieces", function() {
        var cadToolBar = appWin.findChild("CadToolBar");
        var statusBar = appWin.findChild("StatusBar");
        var layerList = appWin.findChild("LayerList");
        return "CadToolBar=" + isNull(cadToolBar) + ", StatusBar=" + isNull(statusBar) + ", LayerList=" + isNull(layerList);
    });

    safeCall("ensure active document", function() {
        var di = ensureActiveDocument();
        return isNull(di) ? "null" : "ready";
    });

    safeCall("register wall gui action", function() {
        var action = registerLandscapeWallGuiAction();
        return isNull(action) ? "null" : "ready";
    });

    safeCall("restore underlay runtime", function() {
        var restored = restoreReferenceUnderlayRuntimeFromDocument(LandscapeShellRuntime.shellPanel);
        return restored ? "restored" : "none";
    });

    if (LandscapeShellConstants.EnableStartupSmokeTest===true) {
        safeCall("scale reference smoke test", function() {
            var scaleAction = new ScaleReferenceAction(undefined, LandscapeShellRuntime.shellPanel, true);
            return scaleAction.runSmokeTest(new RVector(0, 0), new RVector(120, 0), 30);
        });
    }

    logLine("=== landscape shell prototype end ===");
}

if (!LandscapeShellSkipBootstrap) {
    try {
        main();
    }
    catch (e) {
        logLine("[FATAL] " + e);
        try {
            QCoreApplication.quit();
        }
        catch (e2) {
        }
    }
}
