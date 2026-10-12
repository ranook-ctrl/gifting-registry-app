import React from "react";
import ReactDOM from "react-dom/client";
import { Retune } from "retune";
import "../src/fonts.css";
import { PageHeaderHero } from "../src/components";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        flexWrap: "wrap",
        gap: 40,
        justifyContent: "center",
        alignItems: "flex-start",
        padding: 40,
        boxSizing: "border-box",
        background: "#e9eaf0",
      }}
    >
      <PageHeaderHero variant="receiver" />
      <PageHeaderHero variant="gifter" />
    </div>
    <Retune force />
  </React.StrictMode>
);
