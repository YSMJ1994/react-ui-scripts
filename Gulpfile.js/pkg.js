"use strict";

const path = require("path");
const paths = require("../config/paths");
const { libraryBuild, targetPkg, libraryStatic } = paths;
const { writeJSON, exists, copyDir } = require("../utils/fs");
const { src, dest, series, parallel } = require("gulp");
const targetPkgJson = require(targetPkg);
const isTs = process.env.TYPESCRIPT === "true";

async function generatePkg() {
  const json = JSON.parse(JSON.stringify(targetPkgJson));
  Reflect.deleteProperty(json, "scripts");
  Reflect.deleteProperty(json.dependencies, "react-ui-scripts");
  json.files = ["es", "lib"];
  json.main = "lib/index.js";
  json["module"] = "es/index.js";
  json.license = "MIT";

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
