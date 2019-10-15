const core = require("@babel/core");
const cruConfig = require("../config/config");
const enabledTypescript = cruConfig.typescript;
function transform2es(code) {
  return core.transform(code, {
    presets: [
      [
        require.resolve("@babel/preset-react"),
        {
          development: false
        }
      ],
      enabledTypescript && [require.resolve("@babel/preset-typescript")]
    ].filter(Boolean),
    configFile: false,
    babelrc: false
  });
}

function transform2lib(code) {
  return core.transform(code, {
    presets: [
      [
        require.resolve("@babel/preset-env"),
        {
          modules: "cjs"
        }
      ],
      [
        require.resolve("@babel/preset-react"),
        {
          development: false
        }
      ],
      enabledTypescript && [require.resolve("@babel/preset-typescript")]
    ].filter(Boolean),
    configFile: false,
    babelrc: false
  });
}

module.exports = {
  transform2es,
  transform2lib
};
