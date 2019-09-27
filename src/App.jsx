import React, { useContext, Suspense } from "react";
import logo from "./logo.svg";
import {
  BrowserRouter as Router,
  Route,
  Switch,
  Redirect
} from "react-router-dom";
import styles from "./App.module.scss";
import { Provider as DocsProvider } from "./ctx/Docs";
import { Provider as NavMenuControlProvider } from "./ctx/NavMenuControl";
const DocMain = React.lazy(() =>
  import(/* webpackChunkName: "docMain" */ "./components/DocMain")
);
const CompMain = React.lazy(() =>
  import(/* webpackChunkName: "compMain" */ "./components/CompMain")
);
const NavMenu = React.lazy(() =>
  import(/* webpackChunkName: "navMenu" */ "./components/NavMenu")
);

const App = () => {
  return (
    <div className={styles.App}>
      <NavMenuControlProvider>
        <DocsProvider>
          <section className={styles.AppNav}>
            <Suspense fallback={null}>
              <NavMenu />
            </Suspense>
          </section>
          <section className={styles.AppMain}>
            <Router>
              <Suspense fallback={null}>
                <Switch>
                  <Route path="/docs" component={DocMain} />
                  <Route path="/components" component={CompMain} />
                  <Redirect to="/docs" />
                </Switch>
              </Suspense>
            </Router>
          </section>
        </DocsProvider>
      </NavMenuControlProvider>
    </div>
  );
};

export default App;
