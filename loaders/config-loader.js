import { getFilename } from "../utils/fs";

const configRegExp = /---(?!dependencies)([\s\S]*?)---/i;
const dependenciesRegExp = /---dependencies([\s\S]*?)---/i;
const configMapRegExp = /(order|type|name|sub|title)[:：]\s*([^\r\n;]*)\s*/gi;

function getConfigByStr(string) {
  string = String(string);
  let match;
  const config = {};
  while ((match = configMapRegExp.exec(string))) {
    const [, key, value = ""] = match;
    config[key] = String(value).trim();
  }
  return config;
}

export function configLoader(modulePath, source) {
  const name = getFilename(modulePath, ".md");
  const filename = getFilename(modulePath);
  let str = source;
  let config = {
    id: modulePath,
    filename
  };
  // 解析dependencies
  let cacheMatch;
  while ((cacheMatch = str.match(dependenciesRegExp))) {
    const [matchStr, dependenciesStr = ""] = cacheMatch;
    const { index } = cacheMatch;
    str = String(str).slice(0, index) + str.slice(index + matchStr.length);
    // console.log("dependenciesStr", dependenciesStr);
    config.dependencies =
      (config.dependencies || "").replace(/\n$/, "") +
      "\n" +
      dependenciesStr.replace(/^\n/, "");
  }
  // 解析config
  while ((cacheMatch = str.match(configRegExp))) {
    const [matchStr, configStr] = cacheMatch;
    const { index } = cacheMatch;
    str = str.slice(0, index) + str.slice(index + matchStr.length);
    config = {
      ...config,
      ...getConfigByStr(configStr)
    };
  }
  str = str.replace(/^[\n\s]+/, "");
  str = str.replace(/[\n\s]+$/, "");
  if (!config.name) {
    config.name = name;
  }
  if (!config.order) {
    config.order = 0;
  }
  if (typeof config.order !== "number") {
    config.order = isNaN(+config.order) ? 0 : +config.order;
  }
  return {
    result: str,
    config
  };
}

export default function(source) {
  const modulePath = this.resourcePath;
  const { result, config } = configLoader(modulePath, source);
  this.callback(null, result, source, config);
  return;
}
