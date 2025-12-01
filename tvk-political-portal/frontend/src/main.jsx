// src/main.jsx
import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import App from "./App.jsx";
import "./index.css";

// restore token before rendering so axios has Authorization header
import { getToken } from "./auth.js";
import { setAuthToken } from "./api.js";

const token = getToken();
if (token) {
  setAuthToken(token);
  console.log("Auth token restored at startup");
} else {
  console.log("No auth token found at startup");
}

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </React.StrictMode>
);
