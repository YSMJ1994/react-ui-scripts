const chokidar = require("chokidar");
const chalk = require("chalk");
const paths = require("../utils/paths");
const cruConfig = require("../config/config");
const path = require("path");
const { executeDelay } = require("../utils");
const channel = require("./channel");
const {
  readDir,
  isDir,
  isFile,
  readFile,
  writeFile,
  emptyDir,
  getFilename,
  exists
} = require("../utils/fs");

const { componentRoot, assetsComponentRoot, assetsStyleRoot } = paths;

let componentsCompileArr = [];
const components = {};
const generateIndexTask = [];
const suffix = cruConfig.typescript ? "tsx" : "jsx";

async function parseOne(compBase) {
  const compBaseName = getFilename(compBase);
  const mdPath = path.resolve(compBase, "index.md");
  if (!exists(mdPath)) {
    return;
  }
  const mdContent = await readFile(mdPath);
  const nameMatch = mdContent.match(/---[\s\S]*name[:：]\s*(\w+)[\s\S]*---/i);
  const name = nameMatch ? nameMatch[1] : compBaseName;
  components[compBase] = {
    mdName: `${compBaseName}/index.md`,
    compBaseName,
    name
  };
  componentsCompileArr.push(compBaseName);
  console.log(
    `parse component: [ ${chalk.greenBright(compBaseName)} ] success!`
  );
}

async function generateIndex() {
  const indexPath = path.resolve(assetsComponentRoot, "index.js");
  const compsPath = path.resolve(assetsComponentRoot, "comps.js");
  const compsArr = [];
  const importArr = [];
  const exportArr = [];
  const keys = Object.keys(components);
  // 写入组件
  keys.forEach((key, i) => {
    const { mdName, compBaseName, name } = components[key];
    compsArr.push(
      `export {default as ${name}} from 'components/${compBaseName}';`
    );
    const importName = `Comp_${i}`;
    importArr.push(`import ${importName} from 'components/${mdName}';`);
    exportArr.push(importName);
  });
  const compsContent = compsArr.join("\n");
  const indexContent = `${importArr.join(
    "\n"
  )}\n\nexport default [${exportArr.join(", ")}].sort((a, b) => {
  if (a.config.order === b.config.order) {
    return a.config.name >= b.config.name ? 1 : -1;
  } else {
    return a.config.order - b.config.order;
  }
});`;
  await writeFile(compsPath, compsContent);
  await writeFile(indexPath, indexContent);
  if (generateIndexTask.length) {
    // 依次执行任务
    for (let i = 0, len = generateIndexTask.length; i < len; i++) {
      const fn = generateIndexTask[i];
      if (typeof fn === "function") {
        try {
          await fn();
        } catch (e) {}
      }
    }
    // 清空任务
    generateIndexTask.splice(0, generateIndexTask.length);
  }
  channel.emit(null, componentsCompileArr);
  componentsCompileArr = [];
}

function getRelativePath(basePath, fullPath) {
  let matchPath;
  if (fullPath.startsWith(basePath)) {
    matchPath = fullPath.replace(basePath, "");
  } else {
    matchPath = fullPath;
  }
  const sep = path.sep === "/" ? "/" : "\\\\";
  const reg = new RegExp(`^${sep}`, "g");
  return matchPath.replace(reg, "");
}

function shouldResolve(filePath) {
  const relativePath = getRelativePath(componentRoot, filePath);
  if (!relativePath) {
    return false;
  }
  const pathStep = relativePath.split(path.sep);
  if (pathStep.length > 3) {
    return false;
  }
  const compFilename = pathStep[0];
  const compBase = path.resolve(componentRoot, compFilename);
  if (pathStep.length === 1) {
    // 是组件根目录，对目录的操作不做处理
    return false;
  } else if (pathStep.length === 2) {
    // 对组件根目录下的index 和 index.md文件处理
    if (exists(filePath)) {
      // 文件还存在
      return (
        isFile(filePath) &&
        new RegExp(`^index\\.(md|${suffix})$`).test(pathStep[1])
      );
    } else {
      // 文件不存在则只判断文件名
      return new RegExp(`^index\\.(md|${suffix})$`).test(pathStep[1]);
    }
  } else if (pathStep.length === 3) {
    // 只处理demo目录下的markdown文件
    if (exists(filePath)) {
      return (
        pathStep[1] === "demo" && isFile(filePath) && /\.md$/.test(pathStep[2])
      );
    } else {
      return pathStep[1] === "demo" && /\.md$/.test(pathStep[2]);
    }
  }
}

async function build() {
  // clean
  // await emptyDir(assetsComponentRoot);
  await emptyDir(assetsStyleRoot);
  // parse
  const children = await readDir(componentRoot, true);
  for (let i = 0, len = children.length; i < len; i++) {
    const compBase = children[i];
    if (
      isDir(compBase) &&
      exists(path.resolve(compBase, `index.${suffix}`)) &&
      exists(path.resolve(compBase, "index.md"))
    ) {
      // 若是文件夹并且该文件夹下存在index及index.md，则当作组件解析
      await parseOne(compBase);
    }
  }
  await generateIndex();
}

async function start() {
  await build();
  const watcher = chokidar.watch(componentRoot, {
    ignoreInitial: true
  });
  watcher.on("all", async (action, filePath, stat) => {
    // 过滤不需要处理的路径
    if (!shouldResolve(filePath)) {
      return;
    }
    // console.log("action", action);
    let relativePath = getRelativePath(componentRoot, filePath);
    if (!relativePath) {
      return;
    }
    // console.log("relativePath", relativePath);
    const pathStep = relativePath.split(path.sep);
    if (pathStep.length <= 1) {
      return;
    }
    const compIdPath = path.resolve(componentRoot, pathStep[0]);
    const comp = components[compIdPath];
    switch (action) {
      case "add": {
        // 添加文件
        if (pathStep.length === 2) {
          await parseOne(compIdPath);
        }
        break;
      }
      case "change": {
        // 修改index.md
        if (pathStep.length === 2 && pathStep[1] === "index.md") {
          await parseOne(compIdPath);
        }
        break;
      }
      case "unlink": {
        // 删除文件
        if (
          pathStep.length === 2 &&
          (pathStep[1] === "index.md" ||
            pathStep[1] === "index.tsx" ||
            pathStep[1] === "index.tsx")
        ) {
          Reflect.deleteProperty(components, compIdPath);
        }
        break;
      }
    }
    // 500毫秒后生成index
    executeDelay(generateIndex, 500);
  });
}

module.exports = {
  start,
  build
};
