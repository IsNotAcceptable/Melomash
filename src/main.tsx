import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import { ThemeProvider } from "./context/ThemeContext";
import { ServicesProvider } from "./context/ServicesContext";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <ThemeProvider>
      <ServicesProvider>
        <App />
      </ServicesProvider>
    </ThemeProvider>
  </React.StrictMode>,
);
