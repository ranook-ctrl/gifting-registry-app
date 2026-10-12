import React from "react";
import ReactDOM from "react-dom/client";
import { Retune } from "retune";
import "../src/fonts.css";
import ShareSheetDemo from "./ShareSheetDemo";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <ShareSheetDemo />
    <Retune force />
  </React.StrictMode>
);
