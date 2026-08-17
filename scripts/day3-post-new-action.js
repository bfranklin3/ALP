include("scripts/library.js");
include("scripts/EAction.js");

function logLine(text) {
    var line = "[day3-post-new-action] " + text;
    print(line);

    try {
        var file = new QFile("/tmp/qcad-day3-post-new-gui.log");
        if (!file.open(QIODevice.WriteOnly | QIODevice.Append | QIODevice.Text)) {
            print("[day3-post-new-action] log file open failed");
            return;
        }
        file.write(line + "\n");
        file.flush();
        file.close();
    }
    catch (e) {
        print("[day3-post-new-action] log write failed: " + e);
    }
}

function Day3PostNewAction() {
    EAction.call(this);
}

Day3PostNewAction.prototype = new EAction();

Day3PostNewAction.prototype.beginEvent = function() {
    logLine("begin");

    try {
        var doc = this.getDocument();
        if (!isNull(doc)) {
            var fileName = doc.getFileName();
            logLine("document file name: " + fileName);
        }
        else {
            logLine("document is null");
        }
    }
    catch (e) {
        logLine("document probe failed: " + e);
    }

    try {
        var appWin = RMainWindowQt.getMainWindow();
        logLine("main window null: " + isNull(appWin));

        if (!isNull(appWin)) {
            appWin.setWindowTitle("Architecture Landscape CAD App - Post New Hook");
            logLine("title updated");
        }
    }
    catch (e2) {
        logLine("main window probe failed: " + e2);
    }

    try {
        QCoreApplication.quit();
        logLine("requested app quit");
    }
    catch (e3) {
        logLine("quit failed: " + e3);
    }

    this.terminate();
};
