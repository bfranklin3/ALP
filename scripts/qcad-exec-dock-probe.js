include("scripts/library.js");
include("scripts/EAction.js");

function logLine(text) {
    var line = "[qcad-dock] " + text;
    print(line);

    try {
        var file = new QFile("/tmp/qcad-exec-dock-probe.log");
        if (!file.open(QIODevice.WriteOnly | QIODevice.Append | QIODevice.Text)) {
            print("[qcad-dock] log file open failed");
            return;
        }
        file.write(line + "\n");
        file.flush();
        file.close();
    }
    catch (e) {
        print("[qcad-dock] log write failed: " + e);
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
    logLine("=== exec dock probe start ===");

    var appWin = safeCall("EAction.getMainWindow", function() {
        return EAction.getMainWindow();
    });

    if (isNull(appWin)) {
        logLine("[ERR] main window is null");
        QCoreApplication.quit();
        return;
    }

    safeCall("add empty dock widget", function() {
        var dock = new QDockWidget("Landscape Sidebar", appWin);
        var inner = new QWidget(dock);
        dock.setWidget(inner);
        appWin.addDockWidget(Qt.RightDockWidgetArea, dock);
        return "dock added";
    });

    safeCall("findChild LayerList", function() {
        var child = appWin.findChild("LayerList");
        return isNull(child) ? "null" : child.toString();
    });

    safeCall("findChild LayerCombo", function() {
        var child = appWin.findChild("LayerCombo");
        return isNull(child) ? "null" : child.toString();
    });

    logLine("=== exec dock probe end ===");
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
