const path = require("path");
const {src, static: staticObj} = require('../config/config')

const targetRoot = process.cwd();
const toolRoot = path.resolve(__dirname, "../");

const resolveTarget = relativePath => path.resolve(targetRoot, relativePath);
const resolveTool = relativePath => path.resolve(toolRoot, relativePath);

const docRoot = resolveTarget(src.doc);
const componentRoot = resolveTarget(src.library);
const publicRoot = resolveTarget(staticObj.doc);
const assetsComponentRoot = resolveTool("assets/components");
const assetsDocRoot = resolveTool("assets/docs");
const toolSrc = resolveTool("src");
const targetPkgName = require(resolveTarget("package.json")).name;

module.exports = {
  targetRoot,
  toolRoot,
  docRoot,
  componentRoot,
  publicRoot,
  assetsComponentRoot,
  assetsDocRoot,
  toolSrc,
  targetPkgName,
  resolveTarget,
  resolveTool
};
