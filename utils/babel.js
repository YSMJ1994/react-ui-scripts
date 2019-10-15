const core = require("@babel/core");
const cruConfig = require("../config/config");
const enabledTypescript = cruConfig.typescript;
function transform2es(code) {
  return core.transform(code, {
    presets: [
      [
        "@babel/preset-react",
        {
          development: false
        }
      ],
      enabledTypescript && [
        "@babel/preset-typescript",
        {
          isTSX: true,
          allExtensions: true
        }
      ]
    ].filter(Boolean),
    configFile: false,
    babelrc: false
  });
}

function transform2lib(code) {
  return core.transform(code, {
    presets: [
      [
        "@babel/preset-env",
        {
          modules: "cjs"
        }
      ],
      [
        "@babel/preset-react",
        {
          development: false
        }
      ],
      enabledTypescript && [
        "@babel/preset-typescript",
        {
          isTSX: true,
          allExtensions: true
        }
      ]
    ].filter(Boolean),
    configFile: false,
    babelrc: false
  });
}

module.exports = {
  transform2es,
  transform2lib
};
