import React from "react";
import ReactDOM from "react-dom/client";
import { Retune } from "retune";
import "../src/fonts.css";
import DateInputDemo from "./DateInputDemo";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <DateInputDemo />
    <Retune force />
  </React.StrictMode>
);
