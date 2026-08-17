include("scripts/library.js");
include("scripts/EAction.js");

function logPostStartLine(text) {
    var line = "[landscape-shell-post-start] " + text;
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

try {
    if (typeof LandscapeShellRuntime !== "undefined" &&
            !isNull(LandscapeShellRuntime) &&
            !isNull(LandscapeShellRuntime.shellPanel)) {
        logPostStartLine("shell already loaded; skipping duplicate startup");
    }
    else {
        logPostStartLine("including prototype shell from post-start hook");
        include(includeBasePath + "/landscape-shell-prototype-v16.js");
    }
}
catch (e) {
    logPostStartLine("failed: " + e);
}
