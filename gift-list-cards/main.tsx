import React from "react";
import ReactDOM from "react-dom/client";
import { Retune } from "retune";
import "../src/fonts.css";
import GiftListCardsDemo from "./GiftListCardsDemo";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <GiftListCardsDemo />
    {/* force: the dev-mode auto-detect fails inside Vite-optimized deps */}
    <Retune force />
  </React.StrictMode>
);
