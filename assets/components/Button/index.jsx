import React from "react";
import demo1 from "./demo/basic";
import DemoWrap from "toolSrc/components/DemoWrap";

const demos = [
  {
    component: demo1,
    config: {
      id:
        "/Users/soberz/workspace/my-git-repo/react-ui-temp-js/components/Button/demo/basic.md",
      order: 0,
      title: "按钮类型",
      content: "",
      description:
        "<h3>描述内容</h3><p>房间里看见风口浪尖风拉升空间疯狂拉升就分开了</p>",
      code: `import { Button } from "cur-test";

export default function demo() {
  return (
    <div>
      <Button>Click me</Button>
    </div>
  );
}`,
      writePath: ""
    }
  }
].sort((a, b) => {
  if (a.config.order === b.config.order) {
    return a.config.title >= b.config.title ? -1 : 1;
  } else {
    return a.config.order - b.config.order;
  }
});

export default {
  config: {
    id:
      "/Users/soberz/workspace/my-git-repo/react-ui-temp-js/components/Button",
    order: 0,
    type: "通用",
    name: "Button",
    sub: "按钮",
    demos: demos,
    html: ""
  },
  component: () => (
    <div>
      <h1>123</h1>
      <h1>代码演示</h1>
      <DemoWrap list={demos} />
    </div>
  )
};
