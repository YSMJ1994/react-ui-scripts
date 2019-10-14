"use strict";

const fs = require("fs");
const {
  targetRoot,
  toolRoot,
  docRoot,
  componentRoot,
  publicRoot,
  assetsComponentRoot,
  assetsDocRoot,
  toolSrc,
  resolveTarget,
  resolveTool
} = require("../utils/paths");

const moduleFileExtensions = [
  "web.mjs",
  "mjs",
  "web.js",
  "js",
  "ts",
  "json",
  "web.jsx",
  "jsx",
  "tsx"
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
  appBuild: resolveTarget("build-doc"),
  configPath: resolveTarget("cru.config.js"),
  libraryBuild: resolveTarget("build-library"),
  libraryStatic: resolveTarget("libraryStatic"),
  appPublic: resolveTarget("public"),
  appHtml: resolveTarget("public/index.html"),
  appIndexJs: resolveModule(resolveTool, "src/index"),
  appSrc: resolveTool("src"),
  appJsConfig: resolveTool("jsconfig.json"),
  yarnLockFile: resolveTarget("yarn.lock"),
  proxySetup: resolveTarget("setupProxy.js"),
  appNodeModules: resolveTarget("node_modules"),
  appModules: [targetRoot, toolRoot],
  publicUrl: process.env.CRU_PUBLIC_URL || ".",
  servedPath: process.env.CRU_PUBLIC_URL || "./",
  toolComponentIndex: resolveTool("assets/components/comps.js"),
  targetRoot,
  toolRoot,
  docRoot,
  componentRoot,
  publicRoot,
  assetsComponentRoot,
  assetsDocRoot,
  toolSrc,
  resolveTarget,
  resolveTool
};

module.exports.moduleFileExtensions = moduleFileExtensions;
