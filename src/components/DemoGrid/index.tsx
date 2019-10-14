import React, { FC, useState } from "react";
import cs from "classnames";
import "./style.scss";
import Icon from "../Icon";
import CollapseList from "../CollapseList";

interface DemoGridProps {
  Comp: FC;
  title: string;
  desc: string;
  code: string;
  linkName: string;
}

const DemoGrid: FC<DemoGridProps> = ({ Comp, title, desc, code, linkName }) => {
  const [showCode, setShowCode] = useState(false);
  const isActive =
    location.hash === `#${linkName}` ||
    decodeURI(location.hash) === `#${linkName}`;
  return (
    <div
      className={cs("demo-grid", { "demo-grid--active": isActive })}
      id={linkName}
    >
      <div className="comp-wrap">
        <Comp />
        <div className="comp-title-box">
          <a href={`#${linkName}`}>{title}</a>
        </div>
      </div>
      <div className="desc-wrap" dangerouslySetInnerHTML={{ __html: desc }} />
      <div className="code-wrap">
        <div className="code-nav" onClick={() => setShowCode(!showCode)}>
          <Icon
            className={cs("code-nav-icon", {
              "code-nav-icon-rotate": showCode
            })}
            name="arrow-down"
            size={20}
          />
          <span className="code-nav-text">
            {showCode ? "隐藏" : "显示"}代码
          </span>
        </div>
        <CollapseList className="code-box" show={showCode}>
          <pre className="code-pre">
            <code
              dangerouslySetInnerHTML={{
                __html: code
              }}
            />
          </pre>
        </CollapseList>
      </div>
    </div>
  );
};

export default DemoGrid;
