import React from "react";
import ReactDOM from "react-dom/client";
import { Retune } from "retune";
import "../src/fonts.css";
import AddressPillDemo from "./AddressPillDemo";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <AddressPillDemo />
    <Retune force />
  </React.StrictMode>
);
