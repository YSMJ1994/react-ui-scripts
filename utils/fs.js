const fs = require("fs-extra");
const path = require("path");
async function readDir(dirPath, fullPath = false) {
  if (!fs.existsSync(dirPath)) {
    return Promise.resolve([]);
  }
  const children = await fs.readdir(dirPath);
  return children.map(childName => {
    return fullPath ? path.resolve(dirPath, childName) : childName;
  });
}

function isDir(targetPath) {
  const stat = fs.statSync(targetPath);
  return stat.isDirectory();
}

function isFile(targetPath) {
  if (!fs.existsSync(targetPath)) {
    return false;
  }
  const stat = fs.statSync(targetPath);
  return stat.isFile();
}

async function readFile(filePath) {
  return await fs.readFile(filePath, "utf-8");
}

function getFilename(filePath, ext) {
  return path.basename(filePath, ext);
  // return (String(path).match(/[\\\/](\w+)\.[^\\/]+$/) || [])[1];
}

function writeFile(filePath, content) {
  fs.ensureFileSync(filePath);
  return fs.writeFile(filePath, content);
}

function removeFile(filePath) {
  if (fs.existsSync(filePath)) {
    fs.removeSync(filePath);
  }
}

async function isChild(parentPath, targetPath, targetDir = false) {
	if(!fs.existsSync(parentPath) || !isDir(parentPath)) {
		return false
	}
	if(!targetPath.startsWith(parentPath)) {
		return false
	}
	const targetRelativePath = targetPath.replace(parentPath, '').replace(/^[/\\]/, '');
	const children = await readDir(parentPath)
	return !!children.find(t => t === targetRelativePath)
}

module.exports = {
  readDir,
  isDir,
  isFile,
  readFile,
  writeFile,
  removeFile,
  getFilename,
	isChild
};
