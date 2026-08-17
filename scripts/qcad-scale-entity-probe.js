include("scripts/library.js");
include("scripts/EAction.js");
include("scripts/File/NewFile/NewFile.js");

function logLine(text) {
    var line = "[qcad-scale-probe] " + text;
    print(line);
    try {
        var file = new QFile("/tmp/qcad-scale-entity-probe.log");
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
    var di = EAction.getDocumentInterface();
    if (!isNull(di)) {
        return di;
    }
    if (!isNull(NewFile) && typeof NewFile.createMdiChild === "function") {
        NewFile.createMdiChild();
    }
    return EAction.getDocumentInterface();
}

function main() {
    logLine("=== scale entity probe start ===");
    var di = ensureActiveDocument();
    var doc = EAction.getDocument();
    if (isNull(di) || isNull(doc)) {
        logLine("[ERR] no active document");
        QCoreApplication.quit();
        return;
    }

    var createOp = new RAddObjectsOperation();
    var line = new RLineEntity(doc, new RLineData(new RVector(0, 0), new RVector(40, 0)));
    createOp.addObject(line);
    di.applyOperation(createOp);

    var ids = doc.queryAllEntities();
    var id = ids[ids.length - 1];
    var entity = doc.queryEntity(id);
    var beforeLength = entity.getLength ? entity.getLength() : -1;
    logLine("[OK] before length: " + beforeLength);

    safeCall("entity.scale", function() {
        entity.scale(0.25, new RVector(0, 0));
        return "scaled";
    });

    var op = new RModifyObjectsOperation();
    op.addObject(entity, false);
    di.applyOperation(op);

    var afterEntity = doc.queryEntity(id);
    var afterLength = afterEntity.getLength ? afterEntity.getLength() : -1;
    logLine("[OK] after length: " + afterLength);
    logLine("=== scale entity probe end ===");
    QCoreApplication.quit();
}

main();
