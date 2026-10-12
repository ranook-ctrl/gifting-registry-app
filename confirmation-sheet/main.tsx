import React from "react";
import ReactDOM from "react-dom/client";
import { Retune } from "retune";
import "../src/fonts.css";
import ConfirmationBottomsheetDemo from "./ConfirmationBottomsheetDemo";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <ConfirmationBottomsheetDemo />
    <Retune force />
  </React.StrictMode>
);
