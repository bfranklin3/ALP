include("scripts/library.js");

function logLine(text) {
    var line = "[qcad-env] " + text;
    print(line);

    try {
        var file = new QFile("/tmp/qcad-environment-probe.log");
        if (!file.open(QIODevice.WriteOnly | QIODevice.Append | QIODevice.Text)) {
            print("[qcad-env] log file open failed");
            return;
        }
        file.write(line + "\n");
        file.flush();
        file.close();
    }
    catch (e) {
        print("[qcad-env] log write failed: " + e);
    }
}

function tryCall(label, fn) {
    try {
        var result = fn();
        logLine(label + ": " + result);
    }
    catch (e) {
        logLine(label + " failed: " + e);
    }
}

function stringify(value) {
    try {
        if (isNull(value)) {
            return "null";
        }
    }
    catch (e) {
    }

    try {
        if (typeof value === "string") {
            return value;
        }
        if (typeof value === "number" || typeof value === "boolean") {
            return "" + value;
        }
        if (typeof value.length !== "undefined") {
            var parts = [];
            for (var i = 0; i < value.length; i++) {
                parts.push(value[i]);
            }
            return parts.join(" | ");
        }
    }
    catch (e2) {
    }

    return "" + value;
}

logLine("=== environment probe start ===");
tryCall("RSettings.getApplicationPath", function() {
    return stringify(RSettings.getApplicationPath());
});
tryCall("RSettings.getLaunchPath", function() {
    return stringify(RSettings.getLaunchPath());
});
tryCall("RSettings.getPluginPath", function() {
    return stringify(RSettings.getPluginPath());
});
tryCall("RSettings.getPluginPaths", function() {
    return stringify(RSettings.getPluginPaths());
});
tryCall("QDir.homePath", function() {
    return stringify(QDir.homePath());
});
tryCall("QDir.tempPath", function() {
    return stringify(QDir.tempPath());
});
tryCall("QCoreApplication.applicationDirPath", function() {
    return stringify(QCoreApplication.applicationDirPath());
});
tryCall("QCoreApplication.applicationFilePath", function() {
    return stringify(QCoreApplication.applicationFilePath());
});
logLine("=== environment probe end ===");
