include("scripts/library.js");

function logBoth(text) {
    print("[day3-file-log] " + text);

    try {
        var path = "/tmp/qcad-day3-file-log-probe.txt";
        var file = new QFile(path);
        if (!file.open(QIODevice.WriteOnly | QIODevice.Append | QIODevice.Text)) {
            print("[day3-file-log] file open failed");
            return;
        }

        file.write(text + "\n");
        file.flush();
        file.close();
        print("[day3-file-log] write ok");
    }
    catch (e) {
        print("[day3-file-log] write failed: " + e);
    }
}

logBoth("probe-start");
logBoth("probe-end");
