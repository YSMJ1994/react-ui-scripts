import React from "react";
import ReactDOM from "react-dom";
import App from "./App";
import { load } from "./utils/loadIcon";
import 'highlight.js/styles/atom-one-light.css';

load();
ReactDOM.render(<App />, document.getElementById("root"));
