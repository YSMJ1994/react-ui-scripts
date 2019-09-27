"use strict";

const path = require("path");
const fs = require("fs");

const targetRoot = process.cwd();
const toolRoot = path.resolve(__dirname, "../");

const resolveTarget = relativePath => path.resolve(targetRoot, relativePath);
const resolveTool = relativePath => path.resolve(toolRoot, relativePath);
const docRoot = resolveTarget("doc");
const componentRoot = resolveTarget("components");
const publicRoot = resolveTarget("public");
const assetsComponentRoot = resolveTool("assets/components");
const assetsDocRoot = resolveTool("assets/docs");
const toolSrc = resolveTool("src");
console.log("componentRoot", componentRoot);
const moduleFileExtensions = [
  "web.mjs",
  "mjs",
  "web.js",
  "js",
  "json",
  "web.jsx",
  "jsx"
];

// Resolve file paths in the same order as webpack
const resolveModule = (resolveFn, filePath) => {
  const extension = moduleFileExtensions.find(extension =>
    fs.existsSync(resolveFn(`${filePath}.${extension}`))
  );

  if (extension) {
    return resolveFn(`${filePath}.${extension}`);
  }

  return resolveFn(`${filePath}.js`);
};

// config after eject: we're in ./config/
module.exports = {
  targetPkg: resolveTarget("package.json"),
  dotenv: resolveTarget(".env"),
  appPath: resolveTool("."),
  appBuild: resolveTarget("build"),
  appPublic: resolveTarget("public"),
  appHtml: resolveTarget("public/index.html"),
  appIndexJs: resolveModule(resolveTool, "src/index"),
  appSrc: resolveTool("src"),
  appJsConfig: resolveTool("jsconfig.json"),
  yarnLockFile: resolveTarget("yarn.lock"),
  proxySetup: resolveTarget("setupProxy.js"),
  appNodeModules: resolveTarget("node_modules"),
  appModules: [targetRoot, toolRoot],
  publicUrl: ".",
  servedPath: "./",
  targetRoot,
  toolRoot,
  docRoot,
  componentRoot,
  publicRoot,
  assetsComponentRoot,
  assetsDocRoot,
  toolSrc
};

module.exports.moduleFileExtensions = moduleFileExtensions;
