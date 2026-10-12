import React from "react";
import ReactDOM from "react-dom/client";
import { Retune } from "retune";
import "../src/fonts.css";
import FormFieldsDemo from "./FormFieldsDemo";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <FormFieldsDemo />
    <Retune force />
  </React.StrictMode>
);
