const path = require("path");

const targetRoot = process.cwd();
const toolRoot = path.resolve(__dirname, "../");

const resolveTarget = relativePath => path.resolve(targetRoot, relativePath);
const resolveTool = relativePath => path.resolve(toolRoot, relativePath);

const docRoot = resolveTarget("doc");
const componentRoot = resolveTarget("components");
const publicRoot = resolveTarget("public");
const assetsComponentRoot = resolveTool("assets/components");
const assetsDocRoot = resolveTool("assets/docs");
const toolSrc = resolveTool("src");
const targetPkgName = require(resolveTarget('package.json')).name

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
