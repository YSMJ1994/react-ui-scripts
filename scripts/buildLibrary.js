"use strict";
const paths = require("../config/paths");
const path = require("path");
const { exists } = require("../utils/fs");
const { spawn } = require("child_process");
const chalk = require('chalk')
const { targetRoot, toolRoot, targetPkg, libraryBuild } = paths;
const {name} = require(targetPkg);

module.exports = async function() {
  const targetGulpBinPath = path.resolve(targetRoot, "node_modules/.bin/gulp");
  const toolGulpBinPath = path.resolve(toolRoot, "node_modules/.bin/gulp");
  let gulpBin = exists(targetGulpBinPath)
    ? targetGulpBinPath
    : exists(toolGulpBinPath)
    ? toolGulpBinPath
    : null;
  if (!gulpBin) {
    console.error("not found gulp!");
    process.exit(1);
  }
  const gulpConfig = path.resolve(toolRoot, "Gulpfile.js");
  return new Promise(resolve => {
    const gulp = spawn(gulpBin, ["-f", gulpConfig, "--cwd", targetRoot], {
      // stdio: "inherit"
      stdio: "ignore"
    });
    gulp.on("close", function () {
        console.log(`generate library [ ${chalk.greenBright(name)} ] success!`)
        console.log(`The ${chalk.cyanBright(path.relative(targetRoot, libraryBuild))} folder is ready to be deployed.`)
        resolve()
    });
  });
};
