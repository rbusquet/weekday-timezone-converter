import React from "react"
import ReactDOM from "react-dom"
import { createBrowserHistory } from "history"
import * as serviceWorkerRegistration from "./serviceWorkerRegistration"

import App from "./App"

const history = createBrowserHistory()
const rootElement = document.getElementById("root")
ReactDOM.render(
  <React.StrictMode>
    <App history={history} />
  </React.StrictMode>,
  rootElement
)

serviceWorkerRegistration.unregister()
