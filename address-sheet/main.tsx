import React from "react";
import ReactDOM from "react-dom/client";
import { Retune } from "retune";
import "../src/fonts.css";
import AddressSheetDemo from "./AddressSheetDemo";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <AddressSheetDemo />
    <Retune force />
  </React.StrictMode>
);
