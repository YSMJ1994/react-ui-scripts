import React from 'react';
import asyncComponent from 'toolSrc/components/asyncComponent';
import withActiveAnchor from 'toolSrc/hoc/withActiveAnchor';
        
const demos = [{ component: asyncComponent(() => import(/* webpackChunkName: "comp-Button_demo-basic" */'./demo/basic.jsx'), withActiveAnchor), config: { id: "/Users/soberz/workspace/my-git-repo/react-ui-temp-js/components/Button/demo/basic.md", filename: "basic.md", order: 0, title: "按钮类型", description: "<p>按钮有五种类型：主按钮、次按钮、虚线按钮、危险按钮和链接按钮。主按钮在同一个操作区域最多出现一次。</p>\n", code: "<span class=\"hljs-keyword\">import</span> { Button } <span class=\"hljs-keyword\">from</span> <span class=\"hljs-string\">\"unknown\"</span>;\n<span class=\"hljs-keyword\">import</span> <span class=\"hljs-string\">\"unknown/Button/style/index.scss\"</span>;\n\n<span class=\"hljs-keyword\">export</span> <span class=\"hljs-keyword\">default</span> <span class=\"hljs-function\"><span class=\"hljs-keyword\">function</span> <span class=\"hljs-title\">demo</span>(<span class=\"hljs-params\"></span>) </span>{\n  <span class=\"hljs-keyword\">return</span> (\n    <span class=\"xml\"><span class=\"hljs-tag\">&lt;<span class=\"hljs-name\">div</span>&gt;</span>\n      <span class=\"hljs-tag\">&lt;<span class=\"hljs-name\">Button</span> <span class=\"hljs-attr\">className</span>=<span class=\"hljs-string\">\"btn\"</span>&gt;</span>Click me<span class=\"hljs-tag\">&lt;/<span class=\"hljs-name\">Button</span>&gt;</span>\n      <span class=\"hljs-tag\">&lt;<span class=\"hljs-name\">Button</span> <span class=\"hljs-attr\">className</span>=<span class=\"hljs-string\">\"btn\"</span> <span class=\"hljs-attr\">fill</span>&gt;</span>\n        Click me\n      <span class=\"hljs-tag\">&lt;/<span class=\"hljs-name\">Button</span>&gt;</span>\n    <span class=\"hljs-tag\">&lt;/<span class=\"hljs-name\">div</span>&gt;</span></span>\n  );\n}\n" } },
{ component: asyncComponent(() => import(/* webpackChunkName: "comp-Button_demo-basic2" */'./demo/basic2.jsx'), withActiveAnchor), config: { id: "/Users/soberz/workspace/my-git-repo/react-ui-temp-js/components/Button/demo/basic2.md", filename: "basic2.md", order: 1, title: "测试", description: "<p>test</p>\n", code: "<span class=\"hljs-keyword\">import</span> { Button } <span class=\"hljs-keyword\">from</span> <span class=\"hljs-string\">\"unknown\"</span>;\n<span class=\"hljs-keyword\">import</span> <span class=\"hljs-string\">\"unknown/Button/style/index.scss\"</span>;\n\n<span class=\"hljs-keyword\">export</span> <span class=\"hljs-keyword\">default</span> <span class=\"hljs-function\"><span class=\"hljs-keyword\">function</span> <span class=\"hljs-title\">demo</span>(<span class=\"hljs-params\"></span>) </span>{\n  <span class=\"hljs-keyword\">return</span> (\n    <span class=\"xml\"><span class=\"hljs-tag\">&lt;<span class=\"hljs-name\">div</span>&gt;</span>\n      <span class=\"hljs-tag\">&lt;<span class=\"hljs-name\">Button</span>&gt;</span>Test<span class=\"hljs-tag\">&lt;/<span class=\"hljs-name\">Button</span>&gt;</span>\n    <span class=\"hljs-tag\">&lt;/<span class=\"hljs-name\">div</span>&gt;</span></span>\n  );\n}\n" } }].sort((a, b) => {
  if (a.config.order === b.config.order) {
    return a.config.title >= b.config.title ? 1 : -1;
  } else {
    return a.config.order - b.config.order;
  }
});
const Comp = asyncComponent(() => import(/* webpackChunkName: "comp-Button" */'./comp'), withActiveAnchor);
export default {
    config: {
        id: "/Users/soberz/workspace/my-git-repo/react-ui-temp-js/components/Button",
        order: 0,
        type: "通用",
        name: "Button",
        sub: "按钮",
        demos: demos
    },
    component: () => (
        <Comp demos={demos}/>
    )
}