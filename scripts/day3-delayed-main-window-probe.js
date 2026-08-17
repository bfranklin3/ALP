include("scripts/library.js");
include("scripts/EAction.js");

function logLine(text) {
    var line = "[day3-delayed] " + text;
    print(line);

    try {
        var file = new QFile("/tmp/qcad-day3-delayed-main-window.log");
        if (!file.open(QIODevice.WriteOnly | QIODevice.Append | QIODevice.Text)) {
            print("[day3-delayed] log file open failed");
            return;
        }
        file.write(line + "\n");
        file.flush();
        file.close();
    }
    catch (e) {
        print("[day3-delayed] log write failed: " + e);
    }
}

function probe(label) {
    try {
        var appWin = RMainWindowQt.getMainWindow();
        var isWindowNull = isNull(appWin);
        logLine(label + " main window null: " + isWindowNull);

        if (!isWindowNull) {
            appWin.setWindowTitle("Architecture Landscape CAD App - Delayed Probe");
            logLine(label + " title updated");
        }
    }
    catch (e) {
        logLine(label + " probe failed: " + e);
    }
}

var timers = [];

function scheduleProbe(delayMs, label, quitAfter) {
    var timer = new QTimer();
    timer.setSingleShot(true);
    timer.timeout.connect(function() {
        probe(label);
        if (quitAfter===true) {
            logLine("requesting app quit");
            QCoreApplication.quit();
        }
    });
    timer.start(delayMs);
    timers.push(timer);
    logLine("scheduled " + label + " probe at " + delayMs + "ms");
}

function main() {
    logLine("=== delayed main window probe start ===");
    probe("immediate");

    try {
        scheduleProbe(250, "250ms", false);
        scheduleProbe(1000, "1000ms", false);
        scheduleProbe(2500, "2500ms", true);
        logLine("timers scheduled");
    }
    catch (e) {
        logLine("timer scheduling failed: " + e);
        try {
            QCoreApplication.quit();
        }
        catch (e2) {
        }
    }
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
