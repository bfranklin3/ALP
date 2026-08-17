include("scripts/library.js");
include("scripts/EAction.js");

function logLine(text) {
    var line = "[qcad-exec-2] " + text;
    print(line);

    try {
        var file = new QFile("/tmp/qcad-exec-shell-probe-2.log");
        if (!file.open(QIODevice.WriteOnly | QIODevice.Append | QIODevice.Text)) {
            print("[qcad-exec-2] log file open failed");
            return;
        }
        file.write(line + "\n");
        file.flush();
        file.close();
    }
    catch (e) {
        print("[qcad-exec-2] log write failed: " + e);
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

function describeFn(obj, name) {
    try {
        return typeof obj[name];
    }
    catch (e) {
        return "error";
    }
}

function main() {
    logLine("=== exec shell probe 2 start ===");

    var appWin = safeCall("EAction.getMainWindow", function() {
        return EAction.getMainWindow();
    });

    if (isNull(appWin)) {
        logLine("[ERR] main window is null");
        QCoreApplication.quit();
        return;
    }

    safeCall("typeof addDockWidget", function() {
        return describeFn(appWin, "addDockWidget");
    });

    safeCall("typeof addToolBar", function() {
        return describeFn(appWin, "addToolBar");
    });

    safeCall("typeof findChild", function() {
        return describeFn(appWin, "findChild");
    });

    safeCall("typeof findChildren", function() {
        return describeFn(appWin, "findChildren");
    });

    safeCall("typeof getMdiArea", function() {
        return describeFn(appWin, "getMdiArea");
    });

    safeCall("mdi area", function() {
        var mdiArea = appWin.getMdiArea();
        return isNull(mdiArea) ? "null" : mdiArea.toString();
    });

    safeCall("add dock widget", function() {
        var dock = new QDockWidget("Landscape Sidebar", appWin);
        var list = new QListWidget(dock);
        list.addItem("Site Setup");
        list.addItem("Planting");
        list.addItem("Annotate");
        dock.setWidget(list);
        appWin.addDockWidget(Qt.RightDockWidgetArea, dock);
        return "dock added";
    });

    safeCall("add second toolbar", function() {
        var toolbar = appWin.addToolBar("Landscape Workflow");
        toolbar.addAction("Site Setup");
        toolbar.addAction("Planting");
        return "toolbar added";
    });

    logLine("=== exec shell probe 2 end ===");
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
