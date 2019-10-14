"use strict";

process.env.GENERATE_SOURCEMAP = "false";
process.env.INLINE_RUNTIME_CHUNK = "false";
process.env.BABEL_ENV = "production";
process.env.NODE_ENV = "production";
process.on("unhandledRejection", err => {
  throw err;
});
require("../config/env");
const buildDoc = require("./buildDoc");
const buildLibrary = require("./buildLibrary");

module.exports = async function(target) {
  (!target || target === "doc") && (await buildDoc());
  (!target || target === "library") && (await buildLibrary());
};
