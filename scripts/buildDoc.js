"use strict";
const compileDoc = require("./compileDoc");
const compileComponents = require("./compileComponents");
const docBuild = require("./docBuild");

async function start() {
  await compileDoc.build();
  await compileComponents.build();
  await docBuild.start();
}

module.exports = start;
