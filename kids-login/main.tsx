import React from "react";
import ReactDOM from "react-dom/client";
import { Retune } from "retune";
import "../src/fonts.css";
import KidsLoginDemo from "./KidsLoginDemo";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <KidsLoginDemo />
    <Retune force />
  </React.StrictMode>
);
