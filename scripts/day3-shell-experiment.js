include("scripts/library.js");
include("scripts/EAction.js");

var Day3ShellExperiment = {};
Day3ShellExperiment.logPath = "/Users/billfranklin/Documents/ChatGPT/Architecture Landscape CAD App/day3-shell-experiment.log";

Day3ShellExperiment.logLine = function(text) {
    try {
        var file = new QFile(Day3ShellExperiment.logPath);
        var mode = makeQIODeviceOpenMode(QIODevice.WriteOnly, QIODevice.Text);
        if (!file.open(mode)) {
            print("[day3-shell] failed to open log file");
            return;
        }
        file.seek(file.size());

        var ts = new QTextStream(file);
        ts << text << "\n";
        ts.flush();
        file.close();
        print("[day3-shell] " + text);
    }
    catch (e) {
        print("[day3-shell] logger error: " + e);
    }
};

Day3ShellExperiment.safeCall = function(name, fn) {
    try {
        var result = fn();
        Day3ShellExperiment.logLine("[OK] " + name + (result!==undefined ? ": " + result : ""));
        return result;
    }
    catch (e) {
        Day3ShellExperiment.logLine("[ERR] " + name + ": " + e);
        return undefined;
    }
};

Day3ShellExperiment.run = function() {
    Day3ShellExperiment.logLine("=== Day 3 shell experiment start ===");

    var appWin = Day3ShellExperiment.safeCall("RMainWindowQt.getMainWindow", function() {
        return RMainWindowQt.getMainWindow();
    });

    if (isNull(appWin)) {
        Day3ShellExperiment.logLine("[ERR] Main window is null");
        return;
    }

    Day3ShellExperiment.safeCall("setWindowTitle", function() {
        appWin.setWindowTitle("Architecture Landscape CAD App - Shell Experiment");
        return "title updated";
    });

    Day3ShellExperiment.safeCall("main window class", function() {
        return appWin.metaObject().className();
    });

    Day3ShellExperiment.safeCall("menuBar", function() {
        var mb = appWin.menuBar();
        return isNull(mb) ? "null" : mb.metaObject().className();
    });

    Day3ShellExperiment.safeCall("statusBar", function() {
        var sb = appWin.statusBar();
        return isNull(sb) ? "null" : sb.metaObject().className();
    });

    Day3ShellExperiment.safeCall("hide a likely stock toolbar", function() {
        var children = appWin.findChildren("QToolBar");
        var hiddenCount = 0;
        for (var i=0; i<children.length; i++) {
            var tb = children[i];
            if (!isNull(tb) && !isNull(tb.windowTitle) && tb.windowTitle.length!==0) {
                tb.hide();
                hiddenCount++;
                break;
            }
        }
        return "hidden toolbars: " + hiddenCount;
    });

    Day3ShellExperiment.safeCall("add shell experiment menu", function() {
        var menuBar = appWin.menuBar();
        var menu = menuBar.addMenu("Landscape Planner");
        var action = new QAction("Shell Experiment Action", menu);
        action.triggered.connect(function() {
            Day3ShellExperiment.logLine("[OK] Shell Experiment Action triggered");
            EAction.handleUserMessage("Shell Experiment Action triggered");
        });
        menu.addAction(action);
        return "menu added";
    });

    Day3ShellExperiment.safeCall("add shell experiment toolbar", function() {
        var toolbar = appWin.addToolBar("Landscape Planner");
        var action = new QAction("Planting", toolbar);
        action.triggered.connect(function() {
            Day3ShellExperiment.logLine("[OK] Planting toolbar action triggered");
            EAction.handleUserMessage("Planting mode placeholder triggered");
        });
        toolbar.addAction(action);
        return "toolbar added";
    });

    Day3ShellExperiment.safeCall("show status text", function() {
        EAction.showStatusText("Architecture Landscape CAD App shell experiment active");
        return "status text shown";
    });

    Day3ShellExperiment.logLine("=== Day 3 shell experiment end ===");
};

try {
    Day3ShellExperiment.run();
}
catch (e) {
    Day3ShellExperiment.logLine("[FATAL] " + e);
}
