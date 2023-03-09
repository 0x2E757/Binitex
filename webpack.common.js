const path = require("path");
const uuid = require("uuid");
const utils = require("./utils.js");

const ForkTsCheckerWebpackPlugin = require("fork-ts-checker-webpack-plugin");
const CleanTerminalPlugin = require("clean-terminal-webpack-plugin");

const jsName = "index";
const htmlName = "index";
const libDirName = "lib";
const buildUuid = uuid.v4();

const directories = {
    dist: "./dist/",
    src: "./src/",
    static: "./static/",
};

const externals = {
    "jquery": {
        scope: "$",
        file: "./dist/jquery.min.js",
        fileDev: "./dist/jquery.js",
    },
    "react": {
        scope: "React",
        file: "./umd/react.production.min.js",
        fileDev: "./umd/react.development.js",
    },
    "react-dom": {
        scope: "ReactDOM",
        file: "./umd/react-dom.production.min.js",
        fileDev: "./umd/react-dom.development.js",
    },
    "lodash": {
        scope: "_",
        file: "./lodash.min.js",
        fileDev: "./lodash.js",
    },
    "moment": {
        scope: "moment",
        file: "./min/moment-with-locales.js",
        fileDev: "./min/moment-with-locales.min.js",
    }
};

utils.ensureDirectoryExists(directories.dist);
utils.cleanupDirectory(directories.dist);
utils.copyFiles(directories.static, directories.dist);
utils.ensureDirectoryExists(path.join(directories.dist, libDirName));
utils.copyExternals(externals, path.join(directories.dist, libDirName));
utils.emitHtml(jsName, htmlName, libDirName, buildUuid, directories, externals);

module.exports = {
    entry: path.resolve(__dirname, directories.src, `${jsName}.tsx`),
    externals: Object.keys(externals).map(key => ({ [key]: externals[key].scope })),
    resolve: {
        extensions: [".tsx", ".ts", ".js", ".jsx"],
    },
    module: {
        rules: [
            {
                test: /\.tsx?$|\.jsx$/,
                loader: "ts-loader",
                exclude: /node_modules/,
                options: {
                    transpileOnly: true,
                },
            },
        ],
    },
    plugins: [
        new ForkTsCheckerWebpackPlugin(),
        new CleanTerminalPlugin(),
    ],
    output: {
        filename: `${jsName}.${buildUuid}.js`,
        path: path.resolve(__dirname, directories.dist),
    },
};