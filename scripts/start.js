"use strict";

process.env.BABEL_ENV = "development";
process.env.NODE_ENV = "development";
process.on("unhandledRejection", err => {
  throw err;
});
require('../config/env');
const compileDoc = require("./compileDoc");
const compileComponents = require("./compileComponents");
const devServer = require("./devServer");

async function start() {
  await compileDoc.start();
  await compileComponents.start();
  devServer.start();
}
// start();
module.exports = start;
