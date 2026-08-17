include("scripts/EAction.js");

if (typeof LandscapeShellSkipBootstrap === "undefined") {
    var LandscapeShellSkipBootstrap = false;
}

if (typeof WallToolAction === "undefined") {
    LandscapeShellSkipBootstrap = true;
    include(includeBasePath + "/landscape-shell-prototype.js");
}

function LandscapeShellWallAction(guiAction) {
    var panel = undefined;
    var thickness = 6;
    var phase = "Proposed";

    try {
        if (typeof LandscapeShellRuntime !== "undefined" && !isNull(LandscapeShellRuntime)) {
            panel = LandscapeShellRuntime.shellPanel;
            if (!isNull(LandscapeShellRuntime.wallDefaults)) {
                var runtimeThickness = parseFloat(LandscapeShellRuntime.wallDefaults.thickness);
                if (!isNaN(runtimeThickness) && runtimeThickness>0) {
                    thickness = runtimeThickness;
                }
                if (!isNull(LandscapeShellRuntime.wallDefaults.phase) && LandscapeShellRuntime.wallDefaults.phase!=="") {
                    phase = String(LandscapeShellRuntime.wallDefaults.phase);
                }
            }
        }
    }
    catch (e) {
    }

    try {
        if (!isNull(panel)) {
            var panelThickness = panel.getWallThickness();
            if (!isNull(panelThickness) && panelThickness>0) {
                thickness = panelThickness;
            }
            var panelPhase = panel.getWallPhase();
            if (!isNull(panelPhase) && panelPhase!=="") {
                phase = String(panelPhase);
            }
            panel.persistWallDefaults();
        }
    }
    catch (e2) {
    }

    WallToolAction.call(this, guiAction, panel, thickness, phase);
}

LandscapeShellWallAction.prototype = new WallToolAction();

LandscapeShellWallAction.prototype.beginEvent = function() {
    try {
        if (!isNull(LandscapeShellRuntime.activeWallToolAction) &&
                LandscapeShellRuntime.activeWallToolAction!==this) {
            LandscapeShellRuntime.activeWallToolAction.terminate();
            logLine("[OK] terminated previous wall action from registered gui action");
        }
    }
    catch (e) {
        logLine("[ERR] failed to terminate previous wall action from registered gui action: " + e);
    }

    LandscapeShellRuntime.activeWallToolAction = this;
    try {
        if (!isNull(LandscapeShellRuntime.shellPanel) &&
                typeof LandscapeShellRuntime.shellPanel.setActiveBuildingCommand === "function") {
            LandscapeShellRuntime.shellPanel.setActiveBuildingCommand("Walls");
        }
    }
    catch (e2) {
        logLine("[ERR] failed to sync active building command from registered wall action: " + e2);
    }
    WallToolAction.prototype.beginEvent.call(this);
    logLine("[OK] registered gui wall action beginEvent");
}
