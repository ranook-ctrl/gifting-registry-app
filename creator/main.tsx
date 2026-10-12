import React, { useState } from "react";
import ReactDOM from "react-dom/client";
import { Retune } from "retune";
import "../src/fonts.css";
import { CreatorEmptyState, CreatorHome } from "../src/components";

// List Creator's dashboard flow: the empty state loads first; tapping "Search
// gifts" advances to the home / full view.
function CreatorFlow() {
  const [view, setView] = useState<"empty" | "home">("empty");

  return view === "empty" ? (
    <CreatorEmptyState onSearchGifts={() => setView("home")} />
  ) : (
    <CreatorHome onBack={() => setView("empty")} />
  );
}

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
      <CreatorFlow />
    </div>
    <Retune force />
  </React.StrictMode>
);
