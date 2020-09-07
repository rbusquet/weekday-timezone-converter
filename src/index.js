import React from "react"
import ReactDOM from "react-dom"
import { createBrowserHistory } from "history"

import App from "./App"
import Footer from "./Footer"

const history = createBrowserHistory()
const rootElement = document.getElementById("root")
ReactDOM.render(
  <React.StrictMode>
    <App history={history} />
    <Footer />
  </React.StrictMode>,
  rootElement
)
