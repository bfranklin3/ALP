include("scripts/library.js");
include("scripts/EAction.js");
include("scripts/File/NewFile/NewFile.js");

function logLine(text) {
    var line = "[landscape-shell-launcher] " + text;
    print(line);

    try {
        var file = new QFile("/tmp/qcad-landscape-shell-launcher.log");
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

function loadPrototypeShell() {
    try {
        logLine("loading prototype shell");
        include(includeBasePath + "/landscape-shell-post-start-v16.js");
    }
    catch (e) {
        logLine("failed to load prototype shell: " + e);
        try {
            QCoreApplication.quit();
        }
        catch (e2) {
        }
    }
}

function isLiveSessionReady() {
    try {
        var appWin = EAction.getMainWindow();
        if (isNull(appWin)) {
            return false;
        }

        return true;
    }
    catch (e) {
        return false;
    }
}

function tryAttachToCurrentSession(maxWaitMs) {
    var started = new Date().getTime();

    while (new Date().getTime() - started < maxWaitMs) {
        if (isLiveSessionReady()) {
            logLine("current session became ready after " + (new Date().getTime() - started) + "ms");
            loadPrototypeShell();
            return true;
        }

        try {
            QCoreApplication.processEvents();
        }
        catch (e) {
        }
    }

    logLine("current session was not ready within " + maxWaitMs + "ms");
    return false;
}

function main() {
    if (!isNull(NewFile)) {
        var postStartScript = includeBasePath + "/landscape-shell-post-start-v16.js";
        NewFile.addPostNewAction(postStartScript);
        NewFile.addPostOpenAction(postStartScript);
        logLine("registered post-start shell actions: " + postStartScript);
    }

    if (tryAttachToCurrentSession(5000)) {
        return;
    }

    logLine("falling back without a ready current session");
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
