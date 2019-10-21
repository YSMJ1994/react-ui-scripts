const chokidar = require("chokidar");
const chalk = require("chalk");
const paths = require("../utils/paths");
const cruConfig = require("../config/config");
const path = require("path");
const channel = require("./channel");
const { executeDelay } = require("../utils");
const {
  readDir,
  isDir,
  isFile,
  readFile,
  writeFile,
  emptyDir,
  removeFile,
  getFilename
} = require("../utils/fs");
const getMDT = require("./MDT");
const HighLight = require("highlight.js");
const mdtConfig = {
  highlight: function(str, lang) {
    if (lang && HighLight.getLanguage(lang)) {
      try {
        let highLightHtmlStr = HighLight.highlight(lang, str).value;
        highLightHtmlStr = highLightHtmlStr.replace(/class="/g, '__cls="');
        return `<pre><code class="language-${lang}" dangerouslySetInnerHTML={{__html: \`${highLightHtmlStr}\`}}></code></pre>`;
      } catch (__) {}
    }
    return "";
  }
};

const { docRoot, assetsDocRoot } = paths;
let docsCompileArr = [];

const docs = {};
const suffix = cruConfig.typescript ? "tsx" : "jsx";

const mdHeaderConfigRegExp = /^---(?!dependencies)([\s\S]*?)---$/im;
const mdHeaderDependenciesRegExp = /^---dependencies([\s\S]+)---$/im;
const configMapRegExp = /(order|name)[:：]\s*([^\r\n;]*)\s*/gi;

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

function hasImportReact(code) {
    if (!code) {
        return false;
    }
    return /import\s+.+\s+from\s+['"]react['"];?/.test(code);
}

function resolveHTMLToJSX(html) {
  return String(html)
    .replace(/class="/g, 'className="')
    .replace(/style="([^"]*)"/g, "style={}")
    .replace(/__cls/g, "class");
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
  let titleList = [];
  const MDT = getMDT(mdtConfig, {
    slugify: s => {
      titleList.push(s);
      return s;
    }
  });
  md.titleList = titleList;
  md.html = resolveHTMLToJSX(MDT.render(cleanContent));
  md.content = content;
  // console.log("md", md);
  const filenameWithoutExt = getFilename(md.filename, ".md");
  const compFilename = `${filenameWithoutExt}.${suffix}`;
  const jsFilename = `${filenameWithoutExt}-data.${suffix}`;
  md.jsFilename = jsFilename;
  md.compFilename = compFilename;
  const writeJsPath = path.resolve(assetsDocRoot, jsFilename);
  const writeCompPath = path.resolve(assetsDocRoot, compFilename);
  md.writePath = writeJsPath;
  const writeContent = `import React from 'react';
import asyncComponent from 'toolSrc/components/asyncComponent';
import withActiveAnchor from 'toolSrc/hoc/withActiveAnchor';

const Comp = asyncComponent(() => import(/* webpackChunkName: "doc-${filenameWithoutExt}" */'./${compFilename}'), withActiveAnchor);
export default {component: () => <Comp/>, config: ${JSON.stringify(md)}}`;
  const writeCompContent = `${hasImportReact(md.dependencies) ? '' : `import React from 'react';`}
${md.dependencies}

export default () => (<article>${md.html}</article>)`;
  // await writeFile(writeCompPath, writeCompContent);
  // await writeFile(writeJsPath, writeContent);
  md.write = async () => {
    await writeFile(writeCompPath, writeCompContent);
    await writeFile(writeJsPath, writeContent);
  };
  docs[id] = md;
  console.log(`parse doc: [ ${chalk.greenBright(filename)} ] success!`);
  docsCompileArr.push(filename);
}

async function generateIndex() {
  const indexPath = path.resolve(assetsDocRoot, "index.js");

  const importArr = [];
  const exportArr = [];
  const keys = Object.keys(docs);
  // 写入变化
  for (let i = 0, len = keys.length; i < len; i++) {
    const md = docs[keys[i]];
    await md.write();
  }
  keys.forEach(key => {
    const md = docs[key];
    const { jsFilename } = md;
    const index = importArr.length;
    const importName = `comp_${index}`;
    importArr.push(`import ${importName} from './${jsFilename}';`);
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
  await emptyDir(assetsDocRoot);
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
    // console.log("action", action, "filepath", filePath);
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

module.exports = {
  start,
  build
};
