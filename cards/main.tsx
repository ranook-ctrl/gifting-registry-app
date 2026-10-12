import React from "react";
import ReactDOM from "react-dom/client";
import { Retune } from "retune";
import "../src/fonts.css";
import { CardsGallery } from "./CardsGallery";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <CardsGallery />
    {import.meta.env.DEV && <Retune />}
  </React.StrictMode>
);
