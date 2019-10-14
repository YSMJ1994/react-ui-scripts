"use strict";

require("../config/env");
process.env.BABEL_ENV = "production";
process.env.NODE_ENV = "production";

const es = require("./es");
const dist = require("./dist");
const lib = require("./lib");
const pkg = require("./pkg");
const { series } = require("gulp");

exports.default = series(es, dist, lib, pkg);
