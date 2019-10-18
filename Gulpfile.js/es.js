"use strict";
const path = require("path");
const paths = require("../config/paths");
const cruConfig = require("../config/config");
const { libraryBuild, componentRoot, toolRoot, targetRoot } = paths;
const { src, dest, series, parallel } = require("gulp");
const plugin = require("./utils/plugin");
const { transform2es } = require("../utils/babel");
const { path2GulpPath } = require("../utils");
const sassResolver = require("./resolver/sass");
const lessResolver = require("./resolver/less");
const ts = require("gulp-typescript");
const { typescript: isTs, cssPreprocessor: cssSuffix } = cruConfig;
const tsProject = ts.createProject("tsconfig.json", {
  declaration: true,
  noEmit: false,
  isolatedModules: false,
  allowJs: false
});
const {
  copyDir,
  copyFile,
  emptyDir,
  readDir,
  exists,
  removeFile,
  writeFile,
  getFilename
} = require("../utils/fs");

const suffix = isTs ? "tsx" : "jsx";
const jsSuffixArr = isTs ? ["tsx", "ts"] : ["jsx", "js"];
const output = "es";
const nodeDestPath = path.resolve(libraryBuild, output);
const destPath = path2GulpPath(nodeDestPath + "/");
const typingPath = path2GulpPath(path.resolve(libraryBuild, "typings"));
const root = path2GulpPath(componentRoot);

const scssJsContent = `import "../../style/index.${cssSuffix}";\nimport "./index.${cssSuffix}";\n`;
const cssJsContent = `import "../../style/index.css";\nimport "./index.css";\n`;

async function clean() {
  await emptyDir(nodeDestPath);
}

/**
 * 编译组件文件
 */
function resolveEs() {
  return src([
    ...jsSuffixArr.map(suffix => `${root}/**/*.${suffix}`),
    `!${root}/**/*.d.ts`
  ])
    .pipe(
      plugin(async function(file) {
        const content = file.isBuffer()
          ? file.contents.toString()
          : file.contents;
        const transform = transform2es(content);
        file.contents = Buffer.from(transform.code);
        file.extname = ".js";
        return file;
      })
    )
    .pipe(dest(destPath));
}

function resolveTypings() {
  return src([...["tsx", "ts"].map(suffix => `${root}/**/*.${suffix}`)])
    .pipe(tsProject())
    .dts.pipe(dest(typingPath));
}

/**
 * 编译预处理样式文件scss sass
 */
const resolveScss = sassResolver(
  [`${root}/**/*.scss`, `${root}/**/*.sass`],
  dest(destPath)
);

/**
 * 编译预处理样式文件less
 */
const resolveLess = lessResolver(`${root}/**/*.less`, dest(destPath));

function resolveDTS() {
  return src([`${root}/**/*.d.ts`]).pipe(dest(typingPath));
}

/**
 * 复制其余的文件
 */
function resolveOther() {
  return src([
    `${root}/**/*`,
    ...jsSuffixArr.map(suffix => `!${root}/**/*.${suffix}`),
    `!${root}/*/demo/*.md`,
    `!${root}/*/index.md`
  ]).pipe(dest(destPath));
}

let comps = [];

/**
 * 收集所有组件集合
 */
function resolveComps() {
  comps = [];
  return src(`${root}/*/index.md`).pipe(
    plugin(async file => {
      const dirname = file.dirname;
      const dir = getFilename(dirname);
      const compIndex = path.resolve(dirname, `index.${suffix}`);
      const mdContent = file.contents.toString();
      const name =
        (mdContent.match(/^---[\s\S]*name:\s*(.*)[\s\S]*---$/im) || [])[1] ||
        dir;
      if (exists(compIndex)) {
        comps.push({
          name,
          dir,
          dirname
        });
      }
    })
  );
}

/**
 * 清理多余文件夹
 */
async function cleanExtra() {
  for (let i = 0, len = comps.length; i < len; i++) {
    const { dir } = comps[i];
    // 清理空demo目录
    const demoPath = path.resolve(nodeDestPath, `${dir}/demo`);
    if (exists(demoPath)) {
      await removeFile(demoPath);
    }
  }
}

/**
 * 生成动态引入的css文件
 * @return {Promise<void>}
 */
async function generateImportCss() {
  for (let i = 0, len = comps.length; i < len; i++) {
    const { dir } = comps[i];
    const styleScss = path.resolve(
      nodeDestPath,
      `${dir}/style/index.${cssSuffix}`
    );
    const styleCss = path.resolve(nodeDestPath, `${dir}/style/index.css`);
    const scssJs = path.resolve(nodeDestPath, `${dir}/style/index.js`);
    const cssJs = path.resolve(nodeDestPath, `${dir}/style/css.js`);
    await writeFile(scssJs, exists(styleScss) ? scssJsContent : "");
    await writeFile(cssJs, exists(styleCss) ? cssJsContent : "");
  }
}

/**
 * 生成index
 */
async function generateIndex() {
  const compIndexJs = path.resolve(nodeDestPath, "index.js");
  const compIndexTyping = path.resolve(typingPath, "index.d.ts");
  const content = comps
    .map(({ name, dir }) => {
      return `export { default as ${name} } from './${dir}';`;
    })
    .join("\n");
  await writeFile(compIndexJs, content);
  isTs && await writeFile(compIndexTyping, content);
}

module.exports = series.apply(
  null,
  [
    clean,
    parallel(resolveEs, resolveScss, resolveLess, resolveDTS, resolveOther),
    resolveComps,
    cruConfig.enableBabelImport && generateImportCss,
    cleanExtra,
    resolveTypings,
    generateIndex
  ].filter(Boolean)
);
