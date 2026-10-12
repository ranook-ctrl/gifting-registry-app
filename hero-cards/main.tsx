import React from "react";
import ReactDOM from "react-dom/client";
import { Retune } from "retune";
import "../src/fonts.css";
import HeroCardsDemo from "./HeroCardsDemo";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <HeroCardsDemo />
    <Retune force />
  </React.StrictMode>
);
