const path = require("path");
const { readDir, isFile, getFilename, exists } = require("../utils/fs");
const { resolveHTMLToJSX } = require("../utils");

const getMDT = require("../utils/MDT");
const MDT = getMDT();
const demoReplaceRegExp = /<!--\s*demo\s*-->/i;

async function compLoader(source, map, meta) {
  const callback = this.async();
  if (!meta) {
    callback(new Error("comp-loader require after config-loader"));
    return;
  }
  let { name, order, sub = '', type = '未分配' } = meta;
  const compBase = this.context;
  const compName = name || getFilename(compBase);
  const demoBase = path.resolve(compBase, "demo");
  const demos = [];
  this.addContextDependency(demoBase);
  if (exists(demoBase)) {
    const demoChildren = await readDir(demoBase);
    for (let i = 0, len = demoChildren.length; i < len; i++) {
      const demoChildName = demoChildren[i];
      const demoChildPath = path.resolve(demoBase, demoChildName);
      if (isFile(demoChildPath) && /\.md$/.test(demoChildName)) {
        demos.push(`./demo/${demoChildName}`);
        // demos.push(`{ component: withActiveAnchor(${demo.component}), config: ${demo.config} }`);
      }
    }
  }
  let html = resolveHTMLToJSX(MDT.render(source));
  if (html.match(demoReplaceRegExp)) {
    html = html.replace(demoReplaceRegExp, "<DemoWrap list={demos}/>");
  } else {
    html += "\n<DemoWrap list={demos}/>";
  }

  const result = `import React from "react";
import withActiveAnchor from "toolSrc/hoc/withActiveAnchor";
import DemoWrap from "toolSrc/components/DemoWrap";
${demos
  .map((path, i) => {
    return `import demo_${i}, { config as demo_${i}_config } from '${path}';`;
  })
  .join("\n")}
const demos = [${demos
    .map((path, i) => {
      return `{ component: withActiveAnchor(demo_${i}), config: demo_${i}_config }`;
    })
    .join(",")}].sort((a, b) => {
  if (a.config.order === b.config.order) {
    return a.config.title >= b.config.title ? 1 : -1;
  } else {
    return a.config.order - b.config.order;
  }
});
const Comp = ({demos}) => {
	return (
		<article>${html}</article>
	)
}

export default {
  config: {
    id: ${JSON.stringify(compBase)},
    order: ${JSON.stringify(order)},
    type: ${JSON.stringify(type)},
    name: ${JSON.stringify(compName)},
    sub: ${JSON.stringify(sub)},
    demos
  },
  component: () => <Comp demos={demos} />
};
`;
  callback(null, result);
}

module.exports = compLoader;
