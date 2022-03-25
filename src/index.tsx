import React from "react";
import ReactDOM from "react-dom";
import "./index.css";
import { BrowserRouter as Router } from "react-router-dom";
import { Provider } from "react-redux";
import { ReactKeycloakProvider } from "@react-keycloak/web";
import App from "./App";
import { store } from "./store";
import keycloak from "./keycloak";

ReactDOM.render(
  <ReactKeycloakProvider authClient={keycloak}>
    <Provider store={store}>
      <Router>
        <React.StrictMode>
          <App />
        </React.StrictMode>
      </Router>
    </Provider>
  </ReactKeycloakProvider>,
  document.getElementById("root")
);
