const { configPath } = require("./paths");
const { exists } = require("../utils/fs");

const userConfig = exists(configPath) ? require(configPath) : {};
const baseConfig = Object.keys(userConfig).reduce(
  (pre, key) =>
    ((typeof userConfig[key] !== "object" && (pre[key] = userConfig[key])) ||
      true) &&
    pre,
  {}
);
if (/^less$/.test(baseConfig.cssPreprocessor)) {
  baseConfig.cssPreprocessor = "less";
} else {
  baseConfig.cssPreprocessor = "scss";
}

if (/^yarn$/.test(baseConfig.pkg)) {
    baseConfig.pkg = "yarn";
} else {
    baseConfig.pkg = "npm";
}

const config = {
  cssPreprocessor: "scss",
  typescript: false,
  pkg: "yarn",
  enableBabelImport: true,
  output: {
    doc: "build-doc",
    library: "build-library",
    ...userConfig.output
  },
  static: {
    doc: "public",
    library: "libraryStatic",
    ...userConfig.static
  },
  src: {
    doc: "doc",
    library: "components",
    ...userConfig.src
  },
  ...baseConfig
};

module.exports = config;
