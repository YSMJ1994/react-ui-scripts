import React from "react";
import combineCtxProvider from "./utils/combineCtxProvider";
import { Provider as DocsProvider } from "./ctx/Docs";
import { Provider as CompsProvider } from "./ctx/Comps";
import { Provider as NavMenuControlProvider } from "./ctx/NavMenuControl";
import Container from "./Container";
const CtxProvider = combineCtxProvider([
  DocsProvider,
  CompsProvider,
  NavMenuControlProvider
]);

const App = () => {
  return (
    <CtxProvider>
      <Container />
    </CtxProvider>
  );
};

export default App;
