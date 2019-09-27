const chokidar = require("chokidar");
const chalk = require("chalk");
const paths = require("../utils/paths");
const path = require("path");
const { executeDelay } = require("../utils");
const {
  readDir,
  isDir,
  isFile,
  readFile,
  writeFile,
  removeFile,
  getFilename
} = require("../utils/fs");
const HighLight = require("highlight.js");
const config = {
  html: true,
  linkify: false,
  typographer: true,
  highlight: function(str, lang) {
    if (lang && HighLight.getLanguage(lang)) {
      try {
        return HighLight.highlight(lang, str).value;
      } catch (__) {}
    }
    return "";
  }
};
const MDT = require("markdown-it")(config);

const { docRoot, assetsComponentRoot } = paths;

const components = {};
const suffix = "jsx";

const indexConfigRegExp = /^---((?:.|\n|\r|\u2028|\u2029)*?)---$/im;

function getConfig(configStr, filename, index = 0) {
  const indexConfigMapRegExp = /(order|type|name|sub)[:：]\s*([^\s\n]*)/gi;
  if (!configStr) {
    return {
      order: index,
      type: "其他",
      name: filename,
      sub: ""
    };
  } else {
    let config = {};
    let match;
    while ((match = indexConfigMapRegExp.exec(configStr))) {
      const [, key, value = ""] = match;
      config[key] = String(value).trim();
    }
    if (!config.name) {
      config.name = filename;
    }
    if (!config.order) {
      config.order = 0;
    }
    if (!config.type) {
      config.type = "其他";
    }
    if (!config.sub) {
      config.sub = "";
    }
    if (typeof config.order !== "number") {
      config.order = isNaN(+config.order) ? 0 : +config.order;
    }
    return config;
  }
}

async function parseOne(mdPath, index) {
  
  console.log(`parsing doc: [ ${chalk.greenBright(filename)} ] success!`);
}

async function generateIndex() {
  const indexPath = path.resolve(assetsComponentRoot, "index.js");

  const importArr = [];
  const exportArr = [];
  Object.keys(components).forEach(key => {
    const md = components[key];
    const { name } = md;
    const filename = `${name}.${suffix}`;
    const index = importArr.length;
    const importName = `comp_${index}`;
    // importArr.push(`import ${importName} from './${filename}';`);
    // exportArr.push(importName);
  });
  const indexContent = `${importArr.join(
    "\n"
  )}\n\nexport default [${exportArr.join(", ")}]`;
  await writeFile(indexPath, indexContent);
}

async function start() {
  const watcher = chokidar.watch(docRoot, {});
  watcher.on("all", (action, filePath, stat) => {
    // 过滤出md文件
    if (!/\.md$/.test(filePath)) {
      return;
    }
    console.log("action", action, "filepath", filePath);
    switch (action) {
      case "add": {
        parseOne(filePath);
        break;
      }
      case "unlink": {
        const id = filePath;
        if (docs[id]) {
          const { writePath } = docs[id];
          Reflect.deleteProperty(docs, id);
          removeFile(writePath);
        }
        break;
      }
      case "change": {
        parseOne(filePath, 0, true);
        break;
      }
    }
    // 500毫秒后生成index
    executeDelay(generateIndex, 500);
  });
}

start();

module.exports = {
  start
};
