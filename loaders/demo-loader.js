const HighLight = require("highlight.js");
const path = require("path");
const { assetsStyle, assetsStyleRoot } = require("../config/paths");
const { writeFile } = require("../utils/fs");
const { hasImportReact, string2hex } = require("../utils");
const getMDT = require("../utils/MDT");
const MDT = getMDT();
const demoCodeRegExp = /^```.*[jt]sx.*\n([\s\S]*?)```$/im;
const demoCssCodeRegExp = /^```(css|sass|scss|less).*\n([\s\S]*?)```$/im;
const defaultDemoCode = "export default () => null;";

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
  let { id, filename, order, title, name } = config;
  if(!title) {
      title = name;
  }
  let importCssStr = "";
  if (css) {
    const cssFilename = `${string2hex(modulePath)}.${cssSuffix}`;
    const cssCacheFilePath = path.resolve(assetsStyleRoot, cssFilename);
    await writeFile(cssCacheFilePath, css);
    importCssStr = `import 'react-ui-scripts/${assetsStyle}/${cssFilename}';`;
  }
  return `${hasImportReact(code) ? "" : `import React from 'react';`}
${importCssStr}
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
};
