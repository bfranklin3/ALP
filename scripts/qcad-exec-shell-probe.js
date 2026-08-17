include("scripts/library.js");
include("scripts/EAction.js");

function logLine(text) {
    var line = "[qcad-exec] " + text;
    print(line);

    try {
        var file = new QFile("/tmp/qcad-exec-shell-probe.log");
        if (!file.open(QIODevice.WriteOnly | QIODevice.Append | QIODevice.Text)) {
            print("[qcad-exec] log file open failed");
            return;
        }
        file.write(line + "\n");
        file.flush();
        file.close();
    }
    catch (e) {
        print("[qcad-exec] log write failed: " + e);
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

function main() {
    logLine("=== exec shell probe start ===");

    var appWin = safeCall("RMainWindowQt.getMainWindow", function() {
        return RMainWindowQt.getMainWindow();
    });

    if (isNull(appWin)) {
        logLine("[ERR] main window is null");
        QCoreApplication.quit();
        return;
    }

    safeCall("main window class", function() {
        return appWin.metaObject().className();
    });

    safeCall("setWindowTitle", function() {
        appWin.setWindowTitle("Architecture Landscape CAD App - Exec Probe");
        return "title updated";
    });

    safeCall("menuBar", function() {
        var menuBar = appWin.menuBar();
        return isNull(menuBar) ? "null" : menuBar.metaObject().className();
    });

    safeCall("statusBar", function() {
        var statusBar = appWin.statusBar();
        return isNull(statusBar) ? "null" : statusBar.metaObject().className();
    });

    safeCall("toolbar count", function() {
        var children = appWin.findChildren("QToolBar");
        return children.length;
    });

    safeCall("add custom menu", function() {
        var menu = appWin.menuBar().addMenu("Landscape Planner");
        var action = new QAction("Exec Probe Action", menu);
        menu.addAction(action);
        return "menu added";
    });

    safeCall("add custom toolbar", function() {
        var toolbar = appWin.addToolBar("Landscape Planner");
        var action = new QAction("Planting", toolbar);
        toolbar.addAction(action);
        return "toolbar added";
    });

    safeCall("show status text", function() {
        EAction.showStatusText("QCAD exec shell probe completed");
        return "status text shown";
    });

    logLine("=== exec shell probe end ===");
    QCoreApplication.quit();
}

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
