import { useState } from "react";
import MapCanvas from "./MapCanvas";

const COUNTRIES = [
  { code: "AE", name: "United Arab Emirates", flag: "🇦🇪" },
  { code: "SA", name: "Saudi Arabia", flag: "🇸🇦" },
  { code: "BH", name: "Bahrain", flag: "🇧🇭" },
  { code: "OM", name: "Oman", flag: "🇴🇲" },
  { code: "QA", name: "Qatar", flag: "🇶🇦" },
  { code: "KW", name: "Kuwait", flag: "🇰🇼" },
  { code: "EG", name: "Egypt", flag: "🇪🇬" },
];

export default function MapDemo() {
  const [selected, setSelected] = useState<string | null>(null);

  return (
    <div className="min-h-screen w-full bg-[#0A0A0A] text-white flex flex-col lg:flex-row">
      <div
        className="lg:flex-1 flex items-center justify-center p-4 lg:p-8 shrink-0"
        style={{ height: 460 }}
      >
        <MapCanvas
          selectedCode={selected}
          width={420}
          height={420}
          onSelect={(c) => setSelected(c)}
        />
      </div>

      <div className="w-full lg:w-[420px] p-6 lg:p-10 border-t lg:border-t-0 lg:border-l border-white/10 flex flex-col">
        <div className="text-xs uppercase tracking-[0.2em] text-white/40 mb-3">
          Step 1 of 3
        </div>
        <h1 className="text-3xl font-semibold mb-2">Where are you shopping?</h1>
        <p className="text-white/60 mb-8">
          Pick your country so we can show prices, delivery and payment options
          that work for you.
        </p>

        <div className="space-y-2 flex-1 overflow-auto">
          <button
            onClick={() => setSelected(null)}
            className={`w-full text-left rounded-xl px-4 py-3 border transition ${
              selected === null
                ? "border-[#FEEE95] bg-[#FEEE95]/10"
                : "border-white/10 hover:border-white/30"
            }`}
          >
            <span className="text-white/70">Show all</span>
          </button>
          {COUNTRIES.map((c) => {
            const active = selected === c.code;
            return (
              <button
                key={c.code}
                onClick={() => setSelected(c.code)}
                data-testid={`country-${c.code}`}
                className={`w-full flex items-center gap-3 rounded-xl px-4 py-3 border transition text-left ${
                  active
                    ? "border-[#FEEE95] bg-[#FEEE95]/10"
                    : "border-white/10 hover:border-white/30"
                }`}
              >
                <span className="text-2xl">{c.flag}</span>
                <span className="font-medium">{c.name}</span>
                <span className="ml-auto text-xs text-white/40">{c.code}</span>
              </button>
            );
          })}
        </div>

        <button
          disabled={!selected}
          className="mt-6 rounded-xl py-3 font-semibold bg-[#FEEE95] text-black disabled:opacity-30"
        >
          Continue
        </button>
      </div>
    </div>
  );
}
