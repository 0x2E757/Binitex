const fs = require("fs");
const path = require("path");

function ensureDirectoryExists(name) {
    if (!fs.existsSync(path.resolve(__dirname, name)))
        fs.mkdirSync(path.resolve(__dirname, name));
}

function cleanupDirectory(name) {
    fs.rmSync(path.resolve(__dirname, name), { recursive: true });
    fs.mkdirSync(path.resolve(__dirname, name));
}

function copyFiles(dirSrc, dirDest) {
    const names = fs.readdirSync(path.resolve(__dirname, dirSrc));
    for (const name of names) {
        const fileSrc = path.resolve(__dirname, dirSrc, name);
        const fileDest = path.resolve(__dirname, dirDest, name);
        const stats = fs.statSync(fileSrc);
        if (stats.isFile())
            fs.copyFileSync(fileSrc, fileDest);
        if (stats.isDirectory()) {
            ensureDirectoryExists(fileDest);
            copyFiles(path.join(dirSrc, name), path.join(dirDest, name))
        }
    }
}

function copyExternals(list, dirDest) {
    for (const name in list) {
        const meta = list[name];
        const json = require(path.resolve(__dirname, "node_modules", name, "package.json"));
        const file = process.env.NODE_ENV === "development" && meta.fileDev || meta.file;
        const fileSrc = path.resolve(__dirname, "node_modules", name, file);
        const fileDest = path.resolve(__dirname, dirDest, `${path.basename(file, ".js")}.${json.version}.js`);
        fs.copyFileSync(fileSrc, fileDest);
    }
}

function emitHtml(jsName, htmlName, libDirName, buildUuid, directories, externals) {
    const externalsRegExp = /([^\n]*){{template:externals}}([^\n]*)/;
    const externalsReplacer = (match, leftPart, rightPart) => list.map(item => leftPart + item + rightPart).join("\n");
    const appRegExp = /([^\n]*){{template:app}}([^\n]*)/;
    const appReplacer = (match, leftPart, rightPart) => `${leftPart}./${jsName}.${buildUuid}.js${rightPart}`;
    const list = [];
    for (const name in externals) {
        const meta = externals[name];
        const json = require(path.resolve(__dirname, "node_modules", name, "package.json"));
        const file = process.env.NODE_ENV === "development" && meta.fileDev || meta.file;
        list.push(`./${libDirName}/${path.basename(file, ".js")}.${json.version}.js`);
    }
    const fileSrc = path.resolve(__dirname, directories.src, `${htmlName}.html`);
    const htmlRaw = fs.readFileSync(fileSrc).toString();
    const html = htmlRaw.replace(externalsRegExp, externalsReplacer).replace(appRegExp, appReplacer);
    fs.writeFileSync(path.resolve(__dirname, directories.dist, `${htmlName}.html`), html);
}

module.exports = {
    ensureDirectoryExists,
    cleanupDirectory,
    copyFiles,
    copyExternals,
    emitHtml,
};