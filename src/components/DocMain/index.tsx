import React, { FC, useContext } from "react";
import DocsCtx from "../../ctx/Docs";
import {
  withRouter,
  Route,
  Switch,
  Redirect,
  RouteComponentProps
} from "react-router-dom";
import withNavMenuControl from "../../hoc/withNavMenuControl";
import navMenuControl from "../../ctx/NavMenuControl";
import withToc from "../../hoc/withToc";
import "./style.scss";
import cs from "classnames";

const Toc = withToc<string>(({ list = [] }) => {
  return (
    <ul className="toc-ul">
      {list.map((name, i) => {
        const href = `#${name}`;
        const isActive =
          location.hash === href || decodeURI(location.hash) === href;
        return (
          <li key={`${name}_${i}`}>
            <a className={cs({ "toc-li-a--active": isActive })} href={href}>
              {name}
            </a>
          </li>
        );
      })}
    </ul>
  );
});

const DocMain: FC<RouteComponentProps> = ({ match }) => {
  const docs = useContext(DocsCtx);
  const [activeId] = useContext(navMenuControl);
  const activeDoc = docs.find(d => d.config.id === activeId);
  const titleList = activeDoc && activeDoc.config.titleList;
  const { path } = match;
  const firstPath = docs.length && `${path}/${docs[0].config.filename}`;
  return (
    <div className="doc-main">
      <Switch>
        {docs.map(doc => {
          const {
            config: { id, filename },
            component
          } = doc;
          return (
            <Route
              key={id}
              path={`${path}/${filename}`}
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

export default withRouter(DocMain);
