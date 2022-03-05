import React from "react";
import ReactDOM from "react-dom";
import "./main.css";
import App from "./App";
import { BrowserRouter } from "react-router-dom";
import { AuthContextProvider } from "./context/AuthContext";
import ErrorBoundary from "./UI/errorPages/ErrorBoundary";

ReactDOM.render(
  <React.StrictMode>
    <ErrorBoundary>
      <AuthContextProvider>
        <BrowserRouter>
          <App />
        </BrowserRouter>
      </AuthContextProvider>
    </ErrorBoundary>
  </React.StrictMode>,
  document.getElementById("root")
);
