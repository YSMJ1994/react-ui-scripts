import React, { FC, useContext } from "react";
import CompsCtx from "../../ctx/Comps";
import {
  withRouter,
  Route,
  Switch,
  Redirect,
  RouteComponentProps
} from "react-router-dom";
import withNavMenuControl from "../../hoc/withNavMenuControl";
import "./style.scss";
import withToc from "../../hoc/withToc";
import navMenuControl from "../../ctx/NavMenuControl";
import cs from "classnames";

interface TocItem {
  filename: string;
  name: string;
}
const Toc = withToc<TocItem>(({ list }) => (
  <ul className="toc-ul">
    {list.map(({ filename, name }) => {
      const href = `#${filename}`;
      const isActive =
        location.hash === href || decodeURI(location.hash) === href;
      return (
        <li key={filename}>
          <a
            className={cs({ "toc-li-a--active": isActive })}
            href={`#${filename}`}
          >
            {name}
          </a>
        </li>
      );
    })}
  </ul>
));
const CompMain: FC<RouteComponentProps> = ({ match }) => {
  const { groups, comps } = useContext(CompsCtx);
  const [activeId] = useContext(navMenuControl);
  const activeComp = comps.find(c => c.config.id === activeId);
  const titleList =
    activeComp &&
    activeComp.config.demos.map(d => ({
      filename: d.config.filename,
      name: d.config.title
    }));
  const { path } = match;
  const firstPath = comps.length && `${path}/${comps[0].config.name}`;
  return (
    <div className="comp-main">
      <Switch>
        {comps.map(comp => {
          const {
            config: { id, name },
            component
          } = comp;
          return (
            <Route
              key={id}
              path={`${path}/${name}`}
              component={withNavMenuControl(component, id)}
            />
          );
        })}
        {!!firstPath && <Redirect to={firstPath} />}
      </Switch>
      <Toc list={titleList} />
    </div>
  );
};

export default withRouter(CompMain);
