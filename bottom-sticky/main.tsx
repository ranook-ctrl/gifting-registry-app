import React from "react";
import ReactDOM from "react-dom/client";
import { Retune } from "retune";
import "../src/fonts.css";
import BottomStickyDemo from "./BottomStickyDemo";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <BottomStickyDemo />
    <Retune force />
  </React.StrictMode>
);
