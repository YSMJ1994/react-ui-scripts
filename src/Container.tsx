import React, { Suspense } from "react";
import {
  BrowserRouter as Router,
  Route,
  Switch,
  Redirect
} from "react-router-dom";
import "./style.scss";
import asyncComponent from "./components/asyncComponent";
import NavMenu from "./components/NavMenu";
const DocMain = asyncComponent(() =>
  import(/* webpackChunkName: "docMain" */ "./components/DocMain")
);
const CompMain = asyncComponent(() =>
  import(/* webpackChunkName: "compMain" */ "./components/CompMain")
);
const Container = () => {
  const basename = process.env.CRU_PUBLIC_URL || "";
  console.log("basename", basename);
  return (
    <div className="App">
      <Router basename={basename}>
        <section className="AppNav">
          <NavMenu />
        </section>
        <section className="AppMain">
          <Switch>
            <Route path="/docs" component={DocMain} />
            <Route path="/components" component={CompMain} />
            <Redirect to="/docs" />
          </Switch>
        </section>
      </Router>
    </div>
  );
};

export default Container;
