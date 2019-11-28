import { hasImportReact } from "../utils/index";
import HighLight from "highlight.js";
import getMDT from "../utils/MDT";

const mdtConfig = {
  highlight: function(str, lang) {
    if (lang && HighLight.getLanguage(lang)) {
      try {
        let highLightHtmlStr = HighLight.highlight(lang, str).value;
        highLightHtmlStr = highLightHtmlStr.replace(/class="/g, '__cls="');
        return `<pre><code class="language-${lang}" dangerouslySetInnerHTML={{__html: \`${highLightHtmlStr}\`}}></code></pre>`;
      } catch (__) {}
    }
    return "";
  }
};
function resolveHTMLToJSX(html) {
  return String(html)
    .replace(/class="/g, 'className="')
    .replace(/style="([^"]*)"/g, "style={}")
    .replace(/__cls/g, "class");
}

function docLoader(source, map, meta) {
  if (!meta) {
    this.callback(new Error("doc-loader require after config-loader"), source);
    return;
  }
  let titleList = [];
  const MDT = getMDT(mdtConfig, {
    slugify: s => {
      titleList.push(s);
      return s;
    }
  });
  const html = resolveHTMLToJSX(MDT.render(source));
  const { dependencies = "", id, name, filename, order } = meta;
  const result = `${
    hasImportReact(dependencies) ? "" : `import React from 'react'`
  }
${dependencies}
import withActiveAnchor from 'toolSrc/hoc/withActiveAnchor';

export default {
	component: withActiveAnchor(() => (<article>${html}</article>)),
	config: {
		id: ${JSON.stringify(id)},
        filename: ${JSON.stringify(filename)},
        name: ${JSON.stringify(name)},
        order: ${JSON.stringify(order)},
        titleList: ${JSON.stringify(titleList)}
	}
}
`;
  this.callback(null, result, map);
}

module.exports = docLoader;
