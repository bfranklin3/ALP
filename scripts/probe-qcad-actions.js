include("scripts/library.js");
include("scripts/EAction.js");

function probeLog(text) {
    var line = "[qcad-action-probe] " + text;
    print(line);

    try {
        var file = new QFile("/tmp/qcad-action-probe.log");
        if (!file.open(QIODevice.WriteOnly | QIODevice.Append | QIODevice.Text)) {
            return;
        }
        file.write(line + "\n");
        file.flush();
        file.close();
    }
    catch (e) {
    }
}

function safeString(value) {
    if (isNull(value) || value===undefined) {
        return "";
    }

    try {
        return String(value);
    }
    catch (e) {
        return "";
    }
}

function tryGetText(object) {
    try {
        if (typeof object.text === "function") {
            return safeString(object.text());
        }
    }
    catch (e) {
    }

    try {
        return safeString(object.text);
    }
    catch (e2) {
    }

    return "";
}

function tryGetObjectName(object) {
    try {
        if (typeof object.objectName === "function") {
            return safeString(object.objectName());
        }
    }
    catch (e) {
    }

    try {
        return safeString(object.objectName);
    }
    catch (e2) {
    }

    return "";
}

function tryGetToolTip(object) {
    try {
        if (typeof object.toolTip === "function") {
            return safeString(object.toolTip());
        }
    }
    catch (e) {
    }

    try {
        return safeString(object.toolTip);
    }
    catch (e2) {
    }

    return "";
}

function getClassName(object) {
    try {
        if (!isNull(object.metaObject())) {
            return safeString(object.metaObject().className());
        }
    }
    catch (e) {
    }

    return "";
}

function shouldKeep(text) {
    var normalized = safeString(text).toLowerCase();
    if (normalized==="") {
        return false;
    }

    return normalized.indexOf("line")!==-1 ||
        normalized.indexOf("polyline")!==-1 ||
        normalized.indexOf("rectangle")!==-1 ||
        normalized.indexOf("offset")!==-1 ||
        normalized.indexOf("trim")!==-1 ||
        normalized.indexOf("extend")!==-1 ||
        normalized.indexOf("arc")!==-1 ||
        normalized.indexOf("draw")!==-1;
}

function collectFromObject(object, hits) {
    var className = getClassName(object);
    var objectName = tryGetObjectName(object);
    var text = tryGetText(object);
    var toolTip = tryGetToolTip(object);

    if (shouldKeep(objectName) || shouldKeep(text) || shouldKeep(toolTip)) {
        hits.push(
            className +
            " | objectName=" + objectName +
            " | text=" + text +
            " | toolTip=" + toolTip
        );
    }
}

function visitChildren(object, hits) {
    if (isNull(object)) {
        return;
    }

    collectFromObject(object, hits);

    var children = [];
    try {
        children = object.children();
    }
    catch (e5) {
    }

    for (var i=0; i<children.length; i++) {
        visitChildren(children[i], hits);
    }
}

function collectActionList(title, objects, hits) {
    if (isNull(objects)) {
        probeLog(title + ": none");
        return;
    }

    probeLog(title + ": " + objects.length);
    for (var i=0; i<objects.length; i++) {
        collectFromObject(objects[i], hits);
    }
}

function probe() {
    var appWin = EAction.getMainWindow();
    if (isNull(appWin)) {
        probeLog("main window not available");
        QCoreApplication.quit();
        return;
    }

    var hits = [];

    visitChildren(appWin, hits);

    try {
        collectActionList("mainWindow.findChildren(QAction)", appWin.findChildren("QAction"), hits);
    }
    catch (e) {
        probeLog("mainWindow.findChildren(QAction) failed: " + e);
    }

    try {
        var menuBar = appWin.menuBar();
        if (!isNull(menuBar)) {
            collectActionList("menuBar.actions()", menuBar.actions(), hits);
        }
    }
    catch (e2) {
        probeLog("menuBar.actions() failed: " + e2);
    }

    probeLog("matched entries: " + hits.length);
    for (var i=0; i<hits.length; i++) {
        probeLog(hits[i]);
    }

    QCoreApplication.quit();
}

probe();
