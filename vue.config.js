
const path = require("path");

module.exports = {
  outputDir: path.resolve(__dirname, "./dist"),
  assetsDir: "./build",
  chainWebpack: config => config.resolve.symlinks(false),
  publicPath: './'
}


