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

const config = {
  cssPreprocessor: "scss",
  typescript: false,
  pkg: "yarn",
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
