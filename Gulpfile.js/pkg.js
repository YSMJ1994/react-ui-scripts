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
const pkgPath = path.resolve(libraryBuild, "package.json");

async function generatePkg() {
  const json = JSON.parse(JSON.stringify(targetPkgJson));
  Reflect.deleteProperty(json, "scripts");
  Reflect.deleteProperty(json, "private");
  Reflect.deleteProperty(json, "typings");
  Reflect.deleteProperty(json.dependencies, "react-ui-scripts");
  json.files = [...(json.files || []), "es", "lib"];
  // 去重
  arrayDuplicateRemoval(json.files);
  json.main = "lib/index.js";
  json["module"] = "es/index.js";
  json.license = "MIT";
  // json.typings = "es/index.d.ts";

  isTs &&
    exists(path.resolve(libraryBuild, "es/index.d.ts")) &&
    (json.typings = "es/index.d.ts");
  if(exists(pkgPath)) {
      const oldPkg = require(pkgPath);
      json.version = oldPkg.version
  }
  await writeJSON(pkgPath, json);
}

async function copyLibraryStatic() {
  await copyDir(libraryStatic, libraryBuild);
}

module.exports = parallel(generatePkg, copyLibraryStatic);
