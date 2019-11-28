const nodePath = require("path");
const delayTagMap = new Map();

const executeDelay = (function() {
  return function(task, timeout) {
    clearTimeout(delayTagMap[task]);
    delayTagMap[task] = setTimeout(task, timeout);
  };
})();

function path2GulpPath(path) {
  if (!path || typeof path !== "string") {
    throw new Error(`invalid argument: path[ ${path} ]`);
  }
  return path.split(nodePath.sep).join("/");
}

/**
 * 数组去重
 * @param arr 目标数组 改变原数组
 * @return {[]} 删除的元素组成的数组
 */
function arrayDuplicateRemoval(arr) {
  if (typeof arr !== "object" || !Array.isArray(arr)) {
    throw new Error(`arr must been an array`);
  }
  const cache = new Map();
  let i = 0;
  const deleteArr = [];
  while (i < arr.length) {
    const item = arr[i];
    if (cache.has(item)) {
      // 已存在，则删除该位置的元素，
      const dArr = arr.splice(i, 1);
      deleteArr.push.apply(deleteArr, dArr);
    } else {
      // 缓存中没有，则缓存该元素，并继续下一次
      cache.set(item, true);
      i++;
    }
  }
  return deleteArr;
}

function hasImportReact(code) {
  if (!code) {
    return false;
  }
  const match = String(code).match(/import\s+(.+)\s+from\s+['"]react['"];?/);
  return !!match && !!String(match[1]).match(/React/);
}

function string2hex(str, encoding = "utf8") {
  return Buffer.from(str, encoding).toString("hex");
}

function hex2string(str, encoding = "hex") {
  return Buffer.from(str, encoding).toString("utf8");
}

function resolveHTMLToJSX(html) {
  return String(html)
    .replace(/class="/g, 'className="')
    .replace(/style="([^"]*)"/g, "style={}")
    .replace(/__cls/g, "class");
}

module.exports = {
  executeDelay,
  path2GulpPath,
  arrayDuplicateRemoval,
  hasImportReact,
  string2hex,
  hex2string,
  resolveHTMLToJSX
};
