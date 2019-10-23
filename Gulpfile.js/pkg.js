"use strict";

const path = require("path");
const paths = require("../config/paths");
const cruConfig = require("../config/config");
const { libraryBuild, targetPkg, libraryStatic } = paths;
const { writeJSON, exists, copyDir } = require("../utils/fs");
const { arrayDuplicateRemoval } = require("../utils");
const { src, dest, series, parallel } = require("gulp");
const targetPkgJson = require(targetPkg);
const isTs = cruConfig.typescript;

async function generatePkg() {
  const json = JSON.parse(JSON.stringify(targetPkgJson));
  Reflect.deleteProperty(json, "scripts");
  Reflect.deleteProperty(json, "private");
  Reflect.deleteProperty(json.dependencies, "react-ui-scripts");
  json.files = [...(json.files || []), "es", "lib", "typings"];
  // 去重
  arrayDuplicateRemoval(json.files);
  json.main = "lib/index.js";
  json["module"] = "es/index.js";
  json.license = "MIT";
  json.typings = "typings/index.d.ts";

  isTs &&
    exists(path.resolve(libraryBuild, "es/index.d.ts")) &&
    (json.typings = "es/index.d.ts");
  const pkgPath = path.resolve(libraryBuild, "package.json");
  await writeJSON(pkgPath, json);
}

async function copyLibraryStatic() {
  await copyDir(libraryStatic, libraryBuild);
}

module.exports = parallel(generatePkg, copyLibraryStatic);
