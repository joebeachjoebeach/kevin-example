const path = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");

/**
 * Each config will extend this base config
 */
const baseConfig = {
  devtool: "none",
  mode: "development",
  output: {
    filename: "[name].js",
    path: path.resolve(__dirname, "dist"),
    publicPath: "http://localhost:9275",
  },
};

/**
 * Config for App A
 */
const configA = {
  name: "config-a",
  entry: {
    "app-a/a1": "./src/app-a/a1.js",
    "app-a/a2": "./src/app-a/a2.js",
    "app-a/a3": "./src/app-a/a3.js",
  },
  plugins: [
    new HtmlWebpackPlugin({
      title: "App A",
      filename: "app-a/index.html",
      templateContent: `
<html>
  <body>
    <h1>This is App A</h1>
  </body>
</html>
      `,
    }),
  ],
  ...baseConfig,
};

/**
 * Config for App B
 */
const configB = {
  name: "config-b",
  entry: {
    "app-b/b1": "./src/app-b/b1.js",
    "app-b/b2": "./src/app-b/b2.js",
  },
  plugins: [
    new HtmlWebpackPlugin({
      title: "App B",
      filename: "app-b/index.html",
      templateContent: `
<html>
  <body>
    <h1>This is App B</h1>
  </body>
</html>
      `,
    }),
  ],
  ...baseConfig,
};

module.exports = [configA, configB];
