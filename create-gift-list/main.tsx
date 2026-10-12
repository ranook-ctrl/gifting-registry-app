import React, { useState } from "react";
import ReactDOM from "react-dom/client";
import { Retune } from "retune";
import "../src/fonts.css";
import {
  CreateGiftList,
  GiftListDetails,
  CreatorEmptyState,
  CreatorHome,
  RegistrySettings,
  DEFAULT_OCCASIONS,
} from "../src/components";

const MONTHS = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December",
];

/** Event date with an ordinal day, e.g. "14th July" — matches the Creator hero. */
function formatEventDate(d: Date) {
  const day = d.getDate();
  const tens = day % 100;
  const suffix =
    tens >= 11 && tens <= 13 ? "th"
    : day % 10 === 1 ? "st"
    : day % 10 === 2 ? "nd"
    : day % 10 === 3 ? "rd"
    : "th";
  return `${day}${suffix} ${MONTHS[d.getMonth()]}`;
}

/** Whole days from today until the event, e.g. "20 days to go!". */
function formatCountdown(d: Date) {
  const DAY_MS = 24 * 60 * 60 * 1000;
  const now = new Date();
  const start = Date.UTC(now.getFullYear(), now.getMonth(), now.getDate());
  const end = Date.UTC(d.getFullYear(), d.getMonth(), d.getDate());
  const days = Math.round((end - start) / DAY_MS);
  if (days > 0) return `${days} day${days === 1 ? "" : "s"} to go!`;
  if (days === 0) return "Today!";
  return "Event passed";
}

// Create → Details → Creator dashboard. Tapping "Continue" on the details step
// carries the collected name/occasion/date into the Creator flow, which opens on
// its empty state; "Search gifts" then advances to the full home view.
type Step = "create" | "details" | "creatorEmpty" | "creatorHome" | "settings";

function CreateGiftListFlow() {
  const [step, setStep] = useState<Step>("create");
  // Which creator screen to return to when leaving Registry Settings.
  const [settingsReturn, setSettingsReturn] = useState<Step>("creatorHome");
  const [name, setName] = useState("Prasanna");
  const [occasion, setOccasion] = useState<number | null>(null);
  const [eventDate, setEventDate] = useState<Date | null>(null);

  const occasionLabel =
    occasion != null ? DEFAULT_OCCASIONS[occasion].label : "";
  const title = `${name}’s ${occasionLabel}`;
  const dateLabel = eventDate ? formatEventDate(eventDate) : undefined;
  const countdown = eventDate ? formatCountdown(eventDate) : undefined;

  const openSettings = (from: Step) => {
    setSettingsReturn(from);
    setStep("settings");
  };

  switch (step) {
    case "create":
      return (
        <CreateGiftList
          creatorName={name}
          onChangeName={setName}
          selectedOccasion={occasion}
          onSelectOccasion={setOccasion}
          onContinue={() => setStep("details")}
        />
      );
    case "details":
      return (
        <GiftListDetails
          title={title}
          eventDate={eventDate}
          onChangeDate={setEventDate}
          onBack={() => setStep("create")}
          onContinue={() => setStep("creatorEmpty")}
        />
      );
    case "creatorEmpty":
      return (
        <CreatorEmptyState
          title={title}
          date={dateLabel}
          countdown={countdown}
          onBack={() => setStep("details")}
          onSearchGifts={() => setStep("creatorHome")}
          onOpenSettings={() => openSettings("creatorEmpty")}
        />
      );
    case "creatorHome":
      return (
        <CreatorHome
          title={title}
          date={dateLabel}
          countdown={countdown}
          onBack={() => setStep("creatorEmpty")}
          onOpenSettings={() => openSettings("creatorHome")}
        />
      );
    case "settings":
      return (
        <RegistrySettings
          hostName={name}
          giftListName={title}
          occasion={occasionLabel || undefined}
          occasionDate={dateLabel}
          contactName={name}
          onBack={() => setStep(settingsReturn)}
        />
      );
  }
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
      <CreateGiftListFlow />
    </div>
    <Retune force />
  </React.StrictMode>
);
