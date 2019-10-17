"use strict";

const less = require("gulp-less");
const gulp = require("gulp");

module.exports = function(src, dest) {
  return function resolveLess() {
    return gulp
      .src(src)
      .pipe(less())
      .pipe(dest);
  };
};
