import React, { FC } from "react";
import "./style.scss";
import DemoGrid from "../DemoGrid";

interface DemoWrapProps {
  list: Demo[];
}

const DemoWrap: FC<DemoWrapProps> = ({ list }) => {
  /*let leftList: Demo[] = [],
    rightList: Demo[] = [];
  list.forEach((demo, i) => {
    if (i % 2 === 0) {
      leftList.push(demo);
    } else {
      rightList.push(demo);
    }
  });*/
  return (
    <article className="demo-wrap">
      {list.map(demo => {
        const {
          component,
          config: { id, title, description, code, filename }
        } = demo;
        return (
          <DemoGrid
            key={id}
            Comp={component}
            title={title}
            desc={description}
            code={code}
            linkName={filename}
          />
        );
      })}
      {/*<div className="demo-wrap__left">
        {leftList.map(demo => {
          const {
            component,
            config: { id, title, description, code, filename }
          } = demo;
          return (
            <DemoGrid
              key={id}
              Comp={component}
              title={title}
              desc={description}
              code={code}
              linkName={filename}
            />
          );
        })}
      </div>
      <div className="demo-wrap__right">
        {rightList.map(demo => {
          const {
            component,
            config: { id, title, description, code, filename }
          } = demo;
          return (
            <DemoGrid
              key={id}
              Comp={component}
              title={title}
              desc={description}
              code={code}
              linkName={filename}
            />
          );
        })}
      </div>*/}
    </article>
  );
};

export default DemoWrap;
