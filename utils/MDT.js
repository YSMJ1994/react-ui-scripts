const HighLight = require("highlight.js");
const MarkdownIt = require("markdown-it");
const anchor = require("markdown-it-anchor");
const uslug = require("uslug");

const defaultConfig = {
  html: true,
  linkify: true,
  typographer: true,
  highlight: function(str, lang) {
    if (lang && HighLight.getLanguage(lang)) {
      try {
        return HighLight.highlight(lang, str).value;
      } catch (__) {}
    }
    return "";
  }
};
function getMDT(config, opts = {}) {
  const md = MarkdownIt({
    ...defaultConfig,
    ...config
  });
  return md.use(anchor, {
    level: [2],
    permalink: true,
    permalinkSymbol: "#",
    ...opts,
    slugify: s => {
      if (opts.slugify) {
        s = opts.slugify(s);
      }
      return uslug(s);
    }
  });
}
module.exports = getMDT;
