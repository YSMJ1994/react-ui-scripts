const chokidar = require("chokidar");
const chalk = require("chalk");
const paths = require("../utils/paths");
const cruConfig = require("../config/config");
const path = require("path");
const { executeDelay } = require("../utils");
const HighLight = require("highlight.js");
const channel = require("./channel");
const {
  readDir,
  isDir,
  isFile,
  readFile,
  writeFile,
  removeFile,
  emptyDir,
  removeFileAsync,
  getFilename,
  exists
} = require("../utils/fs");
const getMDT = require("./MDT");
const MDT = getMDT();

function resolveHTMLToJSX(html) {
  return String(html)
    .replace(/class="/g, 'className="')
    .replace(/style="([^"]*)"/g, "style={}")
    .replace(/__cls/g, "class");
}

function hasImportReact(code) {
  if (!code) {
    return false;
  }
  const match = String(code).match(/import\s+(.+)\s+from\s+['"]react['"];?/);
  return !!match && !!String(match[1]).match(/React/);
}

const {
  componentRoot,
  assetsComponentRoot,
  targetPkgName,
  assetsStyleRoot
} = paths;

let componentsCompileArr = [];
const components = {};
const generateIndexTask = [];
const suffix = cruConfig.typescript ? "tsx" : "jsx";
const configRegExp = /^---([\s\S]*?)---$/im;
const demoReplaceRegExp = /^<!--\s*demo\s*-->$/im;
const demoConfigRegExp = /^---$/im;
const demoCodeRegExp = /^```.*jsx.*\n([\s\S]*?)```$/im;
const demoCssCodeRegExp = /^```(css|sass|scss|less).*\n([\s\S]*?)```$/im;

const defaultDemoCode = "export default () => null;";

function getConfig(configStr, filename) {
  const indexConfigMapRegExp = /(order|type|name|sub)[:：]\s*([^\s\n]*)/gi;
  if (!configStr) {
    return {
      order: 0,
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

function getDemoConfig(configStr, filename) {
  const configMapRegExp = /(order|title)[:：]\s*([^\s\n]*)/gi;
  if (!configStr) {
    return {
      order: 0,
      title: filename
    };
  } else {
    let config = {};
    let match;
    while ((match = configMapRegExp.exec(configStr))) {
      const [, key, value = ""] = match;
      config[key] = String(value).trim();
    }
    if (!config.title) {
      config.title = filename;
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

async function deleteExtraFile(dir, retainFiles) {
  if (!exists(dir) || !isDir(dir)) {
    return;
  }
  // console.log("dir", dir);
  // console.log("retainFiles", retainFiles);
  const children = await readDir(dir);
  const retainObj = retainFiles.reduce((pre, name) => {
    pre[name] = true;
    return pre;
  }, {});
  await Promise.all(
    children
      .filter(name => !retainObj[name])
      .map(name => removeFileAsync(path.resolve(dir, name)))
  );
}

async function writeComp(comp) {
  const {
    indexInfo: { config, html, writeBase },
    demoInfo
  } = comp;
  const compBase = config.id;
  const demoStrArr = [];
  const demoCompCodeArr = [];
  const demoCssCodeArr = [];
  const demos = Object.keys(demoInfo).reduce((pre, key) => {
    pre.push(demoInfo[key]);
    return pre;
  }, []);
  demos.forEach((demo, i) => {
    const {
      filename,
      id,
      order,
      title,
      description,
      code,
      css,
      cssSuffix
    } = demo;
    const name = getFilename(filename, ".md");
    const demoCompPath = `./demo/${name}.${suffix}`;
    demoStrArr.push(
      `{ component: asyncComponent(() => import(/* webpackChunkName: "comp-${
        config.name
      }_demo-${name}" */'${demoCompPath}'), withActiveAnchor), config: { id: ${JSON.stringify(
        id
      )}, filename: ${JSON.stringify(filename)}, order: ${JSON.stringify(
        order
      )}, title: ${JSON.stringify(title)}, description: ${JSON.stringify(
        description
      )}, code: ${JSON.stringify(HighLight.highlight("jsx", code).value)} } }`
    );
    const cssName = css && `${name}.${cssSuffix}`;
    demoCompCodeArr.push({
      filename: `${name}.${suffix}`,
      code: code,
      cssName
    });
    cssName && demoCssCodeArr.push({ filename: cssName, css });
  });
  const writeIndexContent = `import React from 'react';
import asyncComponent from 'toolSrc/components/asyncComponent';
import withActiveAnchor from 'toolSrc/hoc/withActiveAnchor';

const demos = [${demoStrArr.join(",\n")}].sort((a, b) => {
  if (a.config.order === b.config.order) {
    return a.config.title >= b.config.title ? 1 : -1;
  } else {
    return a.config.order - b.config.order;
  }
});
const Comp = asyncComponent(() => import(/* webpackChunkName: "comp-${
    config.name
  }" */'./comp'), withActiveAnchor);
export default {
    config: {
        id: ${JSON.stringify(config.id)},
        order: ${JSON.stringify(config.order)},
        type: ${JSON.stringify(config.type)},
        name: ${JSON.stringify(config.name)},
        sub: ${JSON.stringify(config.sub)},
        demos: demos
    },
    component: () => (
        <Comp demos={demos}/>
    )
}`;
  const writeCompContent = `import React from 'react';
import DemoWrap from "toolSrc/components/DemoWrap";

export default ({demos}) => (<article>${html}</article>);
`;
  // console.log("writeBase", writeBase);
  const demoWriteBase = path.resolve(writeBase, "demo");
  // write demos
  await Promise.all(
    demoCompCodeArr.map(({ filename, code, cssName }) =>
      writeFile(
        path.resolve(demoWriteBase, filename),
        `${hasImportReact(code) ? "" : `import React from 'react'`};\n${
          cssName ? `import './${cssName}';\n` : "\n"
        }${code}`
      )
    )
  );
  await Promise.all(
    demoCssCodeArr.map(({ filename, css }) =>
      writeFile(
        path.resolve(demoWriteBase, filename),
        `@charset "UTF-8";\n${css}`
      )
    )
  );
  // write component index
  const writeIndexPath = path.resolve(writeBase, `index.${suffix}`);
  const writeCompPath = path.resolve(writeBase, `comp.${suffix}`);
  await writeFile(writeCompPath, writeCompContent);
  await writeFile(writeIndexPath, writeIndexContent);
  // 清空demo目录内多余的文件
  await deleteExtraFile(
    demoWriteBase,
    [...demoCompCodeArr, ...demoCssCodeArr].map(d => d.filename)
  );
}

async function parseOne(compBase) {
  const compBaseName = getFilename(compBase);
  const mdPath = path.resolve(compBase, "index.md");
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
      case "unlink": {
        // 删除文件
        if (pathStep.length === 2) {
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
