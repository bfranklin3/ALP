include("scripts/library.js");
include("scripts/EAction.js");
include("scripts/File/NewFile/NewFile.js");

function logLine(text) {
    var line = "[image-underlay-probe] " + text;
    print(line);

    try {
        var file = new QFile("/tmp/qcad-image-underlay-probe.log");
        if (!file.open(QIODevice.WriteOnly | QIODevice.Append | QIODevice.Text)) {
            print("[image-underlay-probe] log file open failed");
            return;
        }
        file.write(line + "\n");
        file.flush();
        file.close();
    }
    catch (e) {
        print("[image-underlay-probe] log write failed: " + e);
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

function ensureActiveDocument() {
    var di = undefined;
    try {
        di = EAction.getDocumentInterface();
        if (!isNull(di)) {
            logLine("[OK] active document interface already available");
            return di;
        }
    }
    catch (e) {
    }

    safeCall("create new document", function() {
        if (!isNull(NewFile) && typeof NewFile.createMdiChild === "function") {
            NewFile.createMdiChild();
            return "NewFile.createMdiChild called";
        }

        var newFileAction = RGuiAction.getByScriptFile("scripts/File/NewFile/NewFile.js");
        if (!isNull(newFileAction)) {
            newFileAction.slotTrigger();
            return "NewFile action triggered";
        }

        return "no new document path found";
    });

    try {
        di = EAction.getDocumentInterface();
    }
    catch (e2) {
    }

    return di;
}

function getProbeImagePath() {
    var candidates = [
        "/var/folders/pb/phjznlxx4czbfss9tg3sbthc0000gn/T/TemporaryItems/NSIRD_screencaptureui_amIP2B/Screenshot 2026-08-12 at 4.59.57 PM.png",
        "/var/folders/pb/phjznlxx4czbfss9tg3sbthc0000gn/T/TemporaryItems/NSIRD_screencaptureui_MB3wG4/Screenshot 2026-08-12 at 4.56.03 PM.png",
        "/var/folders/pb/phjznlxx4czbfss9tg3sbthc0000gn/T/TemporaryItems/NSIRD_screencaptureui_DJG19U/Screenshot 2026-08-12 at 4.49.45 PM.png"
    ];

    for (var i=0; i<candidates.length; i++) {
        var fi = new QFileInfo(candidates[i]);
        if (fi.exists() && fi.isFile()) {
            return fi.absoluteFilePath();
        }
    }

    return undefined;
}

function main() {
    logLine("=== image underlay probe start ===");

    var di = ensureActiveDocument();
    if (isNull(di)) {
        logLine("[ERR] no active document interface");
        return;
    }

    var doc = di.getDocument();
    if (isNull(doc)) {
        logLine("[ERR] no active document");
        return;
    }

    var imagePath = getProbeImagePath();
    if (isNull(imagePath)) {
        logLine("[ERR] no probe image path found");
        return;
    }
    logLine("[OK] probe image path: " + imagePath);

    safeCall("init image wrappers", function() {
        if (typeof RImageData_Wrapper !== "undefined" && !isNull(RImageData_Wrapper) && typeof RImageData_Wrapper.init === "function") {
            RImageData_Wrapper.init();
        }
        if (typeof RImageEntity_Wrapper !== "undefined" && !isNull(RImageEntity_Wrapper) && typeof RImageEntity_Wrapper.init === "function") {
            RImageEntity_Wrapper.init();
        }
        return "wrappers initialized";
    });

    var imageData = safeCall("construct RImageData", function() {
        return new RImageData();
    });

    if (isNull(imageData)) {
        imageData = safeCall("construct RImageData_Wrapper", function() {
            return new RImageData_Wrapper();
        });
    }

    if (isNull(imageData)) {
        logLine("[ERR] could not create image data object");
        return;
    }

    safeCall("configure image data", function() {
        imageData.setFileName(imagePath);
        imageData.setInsertionPoint(new RVector(0, 0));
        imageData.setWidth(200);
        imageData.setHeight(120);
        return "configured";
    });

    var entity = safeCall("construct RImageEntity", function() {
        return new RImageEntity(doc, imageData);
    });

    if (isNull(entity)) {
        entity = safeCall("construct RImageEntity_Wrapper", function() {
            return new RImageEntity_Wrapper(doc, imageData);
        });
    }

    if (isNull(entity)) {
        logLine("[ERR] could not create image entity");
        return;
    }

    safeCall("add image entity", function() {
        var op = new RAddObjectsOperation();
        op.addObject(entity);
        di.applyOperation(op);
        return "applied";
    });

    logLine("=== image underlay probe end ===");
}

main();
