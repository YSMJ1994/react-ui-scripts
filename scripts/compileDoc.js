const chokidar = require("chokidar");
const paths = require("../utils/paths");
const path = require("path");
const channel = require("./channel");
const { executeDelay } = require("../utils");
const {
  readDir,
  isFile,
  writeFile,
  emptyDir,
  getFilename
} = require("../utils/fs");
const { docRoot, assetsDocRoot } = paths;
let docsCompileArr = [];

const docs = {};

async function parseOne(mdPath) {
  const filename = getFilename(mdPath);
  docs[mdPath] = filename;
  docsCompileArr.push(filename);
  console.log(`parse doc: [ ${chalk.greenBright(filename)} ] success!`);
}

async function generateIndex() {
  const indexPath = path.resolve(assetsDocRoot, "index.js");

  const importArr = [];
  const exportArr = [];
  const keys = Object.keys(docs);
  keys.forEach((key, index) => {
    const mdName = docs[key];
    const importName = `comp_${index}`;
    importArr.push(`import ${importName} from 'doc/${mdName}';`);
    exportArr.push(importName);
  });
  const indexContent = `${importArr.join(
    "\n"
  )}\n\nexport default [${exportArr.join(", ")}].sort((a, b) => {
  if (a.config.order === b.config.order) {
    return a.config.name >= b.config.name ? 1 : -1;
  } else {
    return a.config.order - b.config.order;
  }
});`;
  await writeFile(indexPath, indexContent);
  console.log();
  channel.emit(docsCompileArr);
  docsCompileArr = [];
}

async function build() {
  // clean
  // await emptyDir(assetsDocRoot);
  // parse
  const children = await readDir(docRoot, true);
  for (let i = 0, len = children.length; i < len; i++) {
    const childPath = children[i];
    if (/\.md$/.test(childPath) && isFile(childPath)) {
      // 若是文件夹并且该文件夹下存在index及index.md，则当作组件解析
      await parseOne(childPath);
    }
  }
  await generateIndex();
}

async function start() {
  await build();
  const watcher = chokidar.watch(docRoot, {
    ignoreInitial: true
  });
  watcher.on("all", (action, filePath, stat) => {
    // 过滤出md文件
    if (!/\.md$/.test(filePath)) {
      return;
    }
    switch (action) {
      case "add": {
        parseOne(filePath);
        break;
      }
      case "unlink": {
        Reflect.deleteProperty(docs, filePath);
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
