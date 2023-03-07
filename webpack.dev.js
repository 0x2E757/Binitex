const { merge } = require("webpack-merge");
const common = require("./webpack.common.js");

module.exports = merge(common, {
    mode: "development",
    devtool: "eval-source-map",
    devServer: {
        static: {
            directory: common.output.path,
        },
        port: 8080,
        hot: true,
    },
    optimization: {
        minimize: false,
    },
});