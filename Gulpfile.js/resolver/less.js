"use strict";

const NodeSass = require("node-sass");
const sass = require("gulp-sass");
const gulp = require("gulp");
sass.compiler = NodeSass;

module.exports = function (src, dest) {
    return function () {
        return gulp.src(src)
            .pipe(sass().on("error", sass.logError))
            .pipe(dest);
    }
}
