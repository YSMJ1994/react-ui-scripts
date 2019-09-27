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

const { docRoot, assetsDocRoot } = paths;

const docs = {};
const suffix = "jsx";

const mdHeaderConfigRegExp = /^---(?!dependencies)((?:.|\n|\r|\u2028|\u2029)*?)---$/im;
const mdHeaderDependenciesRegExp = /^---dependencies((?:.|\n|\r|\u2028|\u2029)+)---$/im;
const configMapRegExp = /(order|name)[:：]\s*([^\s\n]*)/gi;

function getConfig(configStr, filename, index = 0) {
  const defaultName = getFilename(filename, ".md");
  if (!configStr) {
    return {
      order: index,
      name: defaultName
    };
  } else {
    const config = {};
    let match;
    while ((match = configMapRegExp.exec(configStr))) {
      const [, key, value = ""] = match;
      config[key] = String(value).trim();
    }
    if (!config.name) {
      config.name = defaultName;
    }
    if (!config.order) {
      config.order = 0;
    }
    if (typeof config.order !== "number") {
      config.order = isNaN(+config.order) ? 0 : +config.order;
    }
    return config;
  }
}

async function parseOne(mdPath, index) {
  if (!isFile(mdPath)) {
    return;
  }
  // 读取内容
  const id = mdPath;
  if (docs[id]) {
    removeFile(docs[id].writePath);
  }
  const content = await readFile(mdPath);
  const filename = getFilename(mdPath);
  const md = {};
  const mdHeaderConfigMatch =
    (content.match(mdHeaderConfigRegExp) || [])[1] || "";
  const mdHeaderDependencies =
    (content.match(mdHeaderDependenciesRegExp) || [])[1] || "";
  // console.log("mdHeaderConfig", mdHeaderConfig);
  // console.log("mdHeaderDependencies", mdHeaderDependencies);
  const config = getConfig(mdHeaderConfigMatch, filename, index);
  const { name, order } = config;
  md.id = id;
  md.filename = filename;
  md.name = name;
  md.order = order;
  md.dependencies = mdHeaderDependencies;
  let cleanContent = content
    .replace(mdHeaderConfigRegExp, "")
    .replace(mdHeaderDependenciesRegExp, "");
  md.html = MDT.render(cleanContent);
  md.content = content;
  // console.log("md", md);
  const writeJsPath = path.resolve(assetsDocRoot, `${md.name}.${suffix}`);
  md.writePath = writeJsPath;
  const writeContent = `import React from 'react';\n${
    md.dependencies
  }\nexport default {component: () => (<article>${
    md.html
  }</article>), config: ${JSON.stringify(md)}}`;
  await writeFile(writeJsPath, writeContent);
  docs[id] = md;
  console.log(`parsing doc: [ ${chalk.greenBright(filename)} ] success!`);
}

async function generateIndex() {
  const indexPath = path.resolve(assetsDocRoot, "index.js");

  const importArr = [];
  const exportArr = [];
  Object.keys(docs).forEach(key => {
    const md = docs[key];
    const { name } = md;
    const filename = `${name}.${suffix}`;
    const index = importArr.length;
    const importName = `comp_${index}`;
    importArr.push(`import ${importName} from './${filename}';`);
    exportArr.push(importName);
  });
  const indexContent = `${importArr.join(
    "\n"
  )}\n\nexport default [${exportArr.join(", ")}].sort((a, b) => {
  if (a.config.order === b.config.order) {
    return a.config.name >= b.config.name ? -1 : 1;
  } else {
    return a.config.order - b.config.order;
  }
});`;
  await writeFile(indexPath, indexContent);
}

async function start() {
  const watcher = chokidar.watch(docRoot, {});
  return new Promise(resolve => {
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
      executeDelay(function() {
        generateIndex().then(resolve);
      }, 500);
    });
  });
}

module.exports = {
  start
};
