include("scripts/library.js");
include("scripts/EAction.js");
include("scripts/File/NewFile/NewFile.js");

function logLine(text) {
    var line = "[day3-post-new] " + text;
    print(line);

    try {
        var file = new QFile("/tmp/qcad-day3-post-new-gui.log");
        if (!file.open(QIODevice.WriteOnly | QIODevice.Append | QIODevice.Text)) {
            print("[day3-post-new] log file open failed");
            return;
        }
        file.write(line + "\n");
        file.flush();
        file.close();
    }
    catch (e) {
        print("[day3-post-new] log write failed: " + e);
    }
}

function safeCall(name, fn) {
    try {
        var result = fn();
        logLine("[OK] " + name + (result!==undefined ? ": " + result : ""));
        return result;
    }
    catch (e) {
        logLine("[ERR] " + name + ": " + e);
        return undefined;
    }
}

function methodExists(obj, name) {
    try {
        return !isNull(obj) && typeof obj[name] === "function";
    }
    catch (e) {
        return false;
    }
}

function main() {
    logLine("=== Day 3 post-new experiment start ===");

    safeCall("RMainWindowQt.getMainWindow at autostart", function() {
        var appWin = RMainWindowQt.getMainWindow();
        return isNull(appWin) ? "null" : appWin.toString();
    });

    safeCall("NewFile object available", function() {
        return typeof NewFile;
    });

    safeCall("NewFile.addPostNewAction exists", function() {
        return methodExists(NewFile, "addPostNewAction");
    });

    safeCall("NewFile.addPostOpenAction exists", function() {
        return methodExists(NewFile, "addPostOpenAction");
    });

    safeCall("NewFile.createMdiChild exists", function() {
        return methodExists(NewFile, "createMdiChild");
    });

    if (methodExists(NewFile, "addPostNewAction")) {
        safeCall("register post-new action", function() {
            NewFile.addPostNewAction("/Users/billfranklin/Documents/ChatGPT/Architecture Landscape CAD App/scripts/day3-post-new-action.js");
            return "registered";
        });
    }

    if (methodExists(NewFile, "addPostOpenAction")) {
        safeCall("register post-open action", function() {
            NewFile.addPostOpenAction("/Users/billfranklin/Documents/ChatGPT/Architecture Landscape CAD App/scripts/day3-post-new-action.js");
            return "registered";
        });
    }

    var newFileAction = safeCall("RGuiAction.getByScriptFile(NewFile)", function() {
        return RGuiAction.getByScriptFile("scripts/File/NewFile/NewFile.js");
    });

    if (!isNull(newFileAction)) {
        safeCall("trigger NewFile action", function() {
            newFileAction.slotTrigger();
            return "triggered";
        });
    }
    else if (methodExists(NewFile, "createMdiChild")) {
        safeCall("call NewFile.createMdiChild", function() {
            NewFile.createMdiChild();
            return "called";
        });
    }
    else {
        logLine("[ERR] no way found to trigger new document");
        try {
            QCoreApplication.quit();
        }
        catch (e) {
        }
    }

    logLine("=== Day 3 post-new experiment handoff ===");
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
