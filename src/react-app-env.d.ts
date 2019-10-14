/// <reference types="node" />
/// <reference types="react" />
/// <reference types="react-dom" />

import React, { FC, PropsWithChildren } from "react";

declare namespace NodeJS {
  interface ProcessEnv {
    readonly NODE_ENV: "development" | "production" | "test";
    readonly PUBLIC_URL: string;
    readonly BASE_API: string;
    readonly ICON_URL: string;
    readonly GITHUB_TOKEN: string;
    readonly PROXY_PATH: string;
    readonly CRU_PUBLIC_URL: string;
  }
}

declare module "*.bmp" {
  const src: string;
  export default src;
}

declare module "*.gif" {
  const src: string;
  export default src;
}

declare module "*.jpg" {
  const src: string;
  export default src;
}

declare module "*.jpeg" {
  const src: string;
  export default src;
}

declare module "*.png" {
  const src: string;
  export default src;
}

declare module "*.webp" {
  const src: string;
  export default src;
}

declare module "*.svg" {
  import * as React from "react";

  export const ReactComponent: React.FunctionComponent<
    React.SVGProps<SVGSVGElement>
  >;

  const src: string;
  export default src;
}

declare module "*.module.css" {
  const classes: { [key: string]: string };
  export default classes;
}

declare module "*.module.scss" {
  const classes: { [key: string]: string };
  export default classes;
}

declare module "*.module.sass" {
  const classes: { [key: string]: string };
  export default classes;
}

interface CruDoc {
  component: FC<PropsWithChildren<any>>;
  config: {
    id: string;
    filename: string;
    name: string;
    order: number;
    dependencies: string;
    titleList: string[];
    html: string;
    content: string;
    writePath: string;
  };
}

declare global {
  interface Doc {
    component: FC<PropsWithChildren<any>>;
    config: {
      id: string;
      filename: string;
      name: string;
      order: number;
      dependencies: string;
      titleList: string[];
      html: string;
      content: string;
      writePath: string;
    };
  }
  interface Demo {
    component: FC;
    config: {
      id: string;
      filename: string;
      order: number;
      title: string;
      description: string;
      code: string;
    };
  }
  interface Comp {
    config: {
      id: string;
      order: number;
      type: string;
      name: string;
      sub: string;
      demos: Demo[];
    };
    component: FC;
  }
}
