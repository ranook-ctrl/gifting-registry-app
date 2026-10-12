import React from "react";
import ReactDOM from "react-dom/client";
import { Retune } from "retune";
import "../src/fonts.css";
import { GiftTracking } from "../src/components";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        justifyContent: "center",
        background: "#e9eaf0",
      }}
    >
      <GiftTracking />
    </div>
    <Retune force />
  </React.StrictMode>
);
