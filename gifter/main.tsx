import React from "react";
import ReactDOM from "react-dom/client";
import { Retune } from "retune";
import "../src/fonts.css";
import GifterCardsDemo from "./GifterCardsDemo";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <GifterCardsDemo />
    <Retune force />
  </React.StrictMode>
);
