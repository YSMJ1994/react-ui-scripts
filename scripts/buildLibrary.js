"use strict";
const paths = require("../config/paths");
const path = require("path");
const { exists } = require("../utils/fs");
const { spawn, exec } = require("child_process");
const chalk = require("chalk");
const { targetRoot, toolRoot, targetPkg, libraryBuild } = paths;
const { name } = require(targetPkg);

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
  return new Promise((resolve, reject) => {
    exec(`${gulpBin} -f ${gulpConfig} --cwd ${targetRoot}`, err => {
      if (err) {
        console.log();
        console.error(err);
        console.log(`generate library [ ${chalk.greenBright(name)} ] failed!`);
        reject();
      } else {
        console.log();
        console.log(`generate library [ ${chalk.greenBright(name)} ] success!`);
        console.log(
          `The ${chalk.cyan(
            path.relative(targetRoot, libraryBuild)
          )} folder is ready to publish.`
        );
        resolve();
      }
    });

    /*const gulp = spawn(gulpBin, ["-f", gulpConfig, "--cwd", targetRoot], {
      // stdio: "inherit"
      stdio: "ignore"
    });
    gulp.on("close", function() {
      console.log();
      console.log(`generate library [ ${chalk.greenBright(name)} ] success!`);
      console.log(
        `The ${chalk.cyan(
          path.relative(targetRoot, libraryBuild)
        )} folder is ready to publish.`
      );
      resolve();
    });
    gulp.on("error", function(err) {
      console.error(err);
      console.log(`generate library [ ${chalk.greenBright(name)} ] failed!`);
      reject();
    });*/
  });
};
