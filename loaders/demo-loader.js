const HighLight = require("highlight.js");
const path = require("path");
const { resolveTool } = require("../config/paths");
const { writeFile } = require("../utils/fs");
const { hasImportReact, string2hex } = require("../utils");
const getMDT = require("../utils/MDT");
const MDT = getMDT();
const demoCodeRegExp = /^```.*[jt]sx.*\n([\s\S]*?)```$/im;
const demoCssCodeRegExp = /^```(css|sass|scss|less).*\n([\s\S]*?)```$/im;
const defaultDemoCode = "export default () => null;";
const cacheBase = resolveTool("src/assets/styles/");

async function demoLoader(modulePath, source, config) {
  const demoCodeMatch = source.match(demoCodeRegExp) || [];
  const demoCssMatch = source.match(demoCssCodeRegExp) || [];
  const code = demoCodeMatch[1] || defaultDemoCode;
  const css = demoCssMatch[2];
  const cssSuffix = demoCssMatch[1];
  const demoParseContent = source
    .replace(demoCodeRegExp, "")
    .replace(demoCssCodeRegExp, "");
  const description = MDT.render(demoParseContent);
  const highLightCode = HighLight.highlight("jsx", code).value;
  const { id, filename, order, title } = config;
  const cssFilename = `${string2hex(modulePath)}.${cssSuffix}`;
  const cssCacheFilePath = path.resolve(cacheBase, cssFilename);
  await writeFile(cssCacheFilePath, css || "");
  return `${hasImportReact(code) ? "" : `import React from 'react';`}
import '/node_modules/react-ui-scripts/src/assets/styles/${cssFilename}';
${code}

export const config = {
	id: ${JSON.stringify(id)},
	filename: ${JSON.stringify(filename)},
	order: ${JSON.stringify(order)},
	title: ${JSON.stringify(title)},
	description: ${JSON.stringify(description)},
	code: ${JSON.stringify(highLightCode)}
}
`;
}

module.exports = async function(source, map, meta) {
  const callback = this.async();
  if (!meta) {
    callback(new Error("comp-loader require after config-loader"));
    return;
  }
  const modulePath = this.resourcePath;
  const result = await demoLoader(modulePath, source, meta);
  callback(null, result);
}
