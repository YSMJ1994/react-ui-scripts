const path = require("path");

const targetRoot = process.cwd();
const toolRoot = path.resolve(__dirname, "../");
// console.log("targetRoot", targetRoot);
// console.log("toolRoot", toolRoot);

const docRoot = path.resolve(targetRoot, 'doc');
const componentRoot = path.resolve(targetRoot, 'components');
const publicRoot = path.resolve(targetRoot, 'public');
const assetsComponentRoot = path.resolve(toolRoot, 'assets/components');
const assetsDocRoot = path.resolve(toolRoot, 'assets/docs');

module.exports = {
	targetRoot,
	toolRoot,
	docRoot,
	componentRoot,
	publicRoot,
	assetsComponentRoot,
	assetsDocRoot
}
