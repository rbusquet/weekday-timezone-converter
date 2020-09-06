import React from "react";
import ReactDOM from "react-dom";

import App from "./App";
import { createBrowserHistory } from "history";

const history = createBrowserHistory();
const rootElement = document.getElementById("root");
ReactDOM.render(
  <React.StrictMode>
    <App history={history} />
  </React.StrictMode>,
  rootElement
);
