const express = require("express");
const Kevin = require("kevin-middleware");
const webpackConfigs = require("./webpack.config");
const path = require("path");

const app = express();
const kevin = new Kevin(webpackConfigs, {
    kevinPublicPath: "http://localhost:9275",
    getAssetName: (requestPath) => {
        // We're stripping off leading forward slash and js extension. This is because
        // Kevin will store things as `app-a/a1`, but requests will be for `/app-a/a1.js`.
        // I think we'll have to address this within Kevin itself, but for now, this is the workaround.
        return requestPath.replace(/^\//, "").replace(/\.js$/, "");
    },
});

app.use(kevin.getMiddleware());

/**
 * Now, we also need to serve static files (e.g. HTML).
 * With a Webpack project, your HTML typically comes from either of two places:
 *     1. HTML that's not generated by Webpack (this could be generated on the server
 *        side, or maybe you have static files). This is the use-case we had in mind
 *        when designing Kevin.
 *     2. HTML that's generated by Webpack (e.g. through HtmlWebpackPlugin). This
 *        is not the use-case we had in mind when designing Kevin, so it works less
 *        smoothly. Kevin expects the HTML page to exist before the JS is built. If Webpack
 *        is responsible for building your HTML, though, this can't be the case.
 */

/**
 * (default) Uncomment line 40 and comment out line 58 to use the static HTML files in this repo:
 *     - app-a.html
 *     - app-b.html
 * Visit http://localhost:9275/app-a.html and http://localhost:9275/app-b.html
 * to see it in action.
 *
 * This illustrates the standard Kevin use-case — your HTML does not rely on Webpack.
 */
app.use(express.static(path.resolve(__dirname)));

/**
 * Uncomment line 58 and comment out line 40 to use the Webpack-generated HTML files:
 *     - dist/app-a/index.html
 *     - dist/app-b/index.html
 * You'll find that if you start with an empty `dist` directory, you won't be able to
 * visit http://localhost:9275/app-a/index.html or http://localhost:9275/app-b/index.html
 * without first directly hitting a request for one of the entrypoints. For example,
 * you'd need to do this in order to visit the App A page:
 *     1. Visit http://localhost:9275/app-a/a1.js
 *     2. Visit http://localhost:9275/app-a/index.html
 *
 * This is because Kevin only knows about files from the `entries` property on the
 * Webpack config object. Kevin waits for a request to a JS file before building that
 * config. The HTML files aren't generated until that config is built, so they won't
 * be available unless they're cached from a previous build.
 */
// app.use(express.static(webpackConfigs[0].output.path));

app.listen(9275);
