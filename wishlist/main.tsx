import React from "react";
import ReactDOM from "react-dom/client";
import { Retune } from "retune";
import "../src/fonts.css";
import "./wishlist.css";
import WishlistPage from "./components/WishlistPage";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <div className="flex min-h-screen w-full items-start justify-center bg-[#e9ebf0] py-8">
      <WishlistPage />
    </div>
    <Retune force />
  </React.StrictMode>
);
