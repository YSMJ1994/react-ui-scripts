import React, { useContext } from "react";
import DocsCtx from "../../ctx/Docs";
import { withRouter, Route, Switch, Redirect } from "react-router-dom";
import withNavMenuControl from "../../hoc/withNavMenuControl";
import styles from './style.module.scss'

const DocMain = ({ match }) => {
  const docs = useContext(DocsCtx);
  const { path } = match;
  const firstPath = docs.length && `${path}/${docs[0].config.filename}`;
  return (
    <div className={styles.docMain}>
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
        <Redirect to={firstPath} />
      </Switch>
    </div>
  );
};

export default withRouter(DocMain);
