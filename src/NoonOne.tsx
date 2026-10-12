import { useState, useMemo, useEffect } from "react";

/* ============================================================
   noon One — Web subscription flow rough designs
   Single-file mockup. Loaded inside the noon Account shell
   (yellow header + left sidebar). The right content area is
   what we are designing.
   ============================================================ */

type Screen =
  | "subscribed"
  | "payment"
  | "upgrading"
  | "success"
  | "manage"
  | "change-plan"
  | "invoice"
  | "update-payment"
  | "cancel-reason"
  | "cancel-done";

type PlanState =
  | "trial-active"
  | "trial-cancelled"
  | "trial-upcoming"
  | "active-paid"
  | "cancelled-gt15"
  | "cancelled-lt15"
  | "cancelled-upcoming";

const SCREENS: { id: Screen; label: string; group: string }[] = [
  { id: "payment", label: "1. Payment", group: "Purchase" },
  { id: "upgrading", label: "2. Upgrading…", group: "Purchase" },
  { id: "success", label: "3. Success", group: "Purchase" },
  { id: "subscribed", label: "Subscribed landing", group: "Member" },
  { id: "manage", label: "Manage membership", group: "Member" },
  { id: "change-plan", label: "Change plan", group: "Manage" },
  { id: "invoice", label: "View invoice", group: "Manage" },
  { id: "update-payment", label: "Update payment", group: "Manage" },
  { id: "cancel-reason", label: "Cancel: select reason", group: "Manage" },
  { id: "cancel-done", label: "Cancel: confirmed", group: "Manage" },
];

const PLAN_STATES: { id: PlanState; label: string }[] = [
  { id: "trial-active", label: "Trial · Active" },
  { id: "trial-cancelled", label: "Trial · Cancelled" },
  { id: "trial-upcoming", label: "Trial · w/ upcoming" },
  { id: "active-paid", label: "Active · Paid" },
  { id: "cancelled-gt15", label: "Cancelled · >15d" },
  { id: "cancelled-lt15", label: "Cancelled · <15d" },
  { id: "cancelled-upcoming", label: "Cancelled · w/ upcoming" },
];

export default function NoonOneApp() {
  const [screen, setScreen] = useState<Screen>("subscribed");
  const [planState, setPlanState] = useState<PlanState>("active-paid");

  return (
    <div className="min-h-screen bg-[#F4F4F4] font-sans text-[#1F1F1F]">
      <DevSwitcher
        screen={screen}
        setScreen={setScreen}
        planState={planState}
        setPlanState={setPlanState}
      />
      <NoonHeader />
      <div className="mx-auto flex max-w-[1440px] gap-6 px-6 py-6">
        <Sidebar activeScreen={screen} onNavigate={setScreen} />
        <main className="min-w-0 flex-1">
          <ScreenRouter
            screen={screen}
            planState={planState}
            setScreen={setScreen}
          />
        </main>
      </div>
    </div>
  );
}

/* ----------------------------- Dev switcher ---------------------------- */

function DevSwitcher({
  screen,
  setScreen,
  planState,
  setPlanState,
}: {
  screen: Screen;
  setScreen: (s: Screen) => void;
  planState: PlanState;
  setPlanState: (s: PlanState) => void;
}) {
  const groups = useMemo(() => {
    const g: Record<string, typeof SCREENS> = {};
    SCREENS.forEach((s) => {
      (g[s.group] ||= []).push(s);
    });
    return g;
  }, []);
  return (
    <div className="sticky top-0 z-50 border-b border-neutral-800 bg-neutral-900 px-4 py-2 text-[12px] text-neutral-200">
      <div className="mx-auto flex max-w-[1440px] flex-wrap items-center gap-x-6 gap-y-2">
        <span className="font-mono text-neutral-500">DEV · noon One revamp</span>
        {Object.entries(groups).map(([group, items]) => (
          <div key={group} className="flex items-center gap-1.5">
            <span className="text-[10px] uppercase tracking-wider text-neutral-500">
              {group}
            </span>
            {items.map((s) => (
              <button
                key={s.id}
                onClick={() => setScreen(s.id)}
                className={`rounded px-2 py-1 ${
                  screen === s.id
                    ? "bg-yellow-300 text-black"
                    : "bg-neutral-800 hover:bg-neutral-700"
                }`}
              >
                {s.label}
              </button>
            ))}
          </div>
        ))}
        {screen === "subscribed" && (
          <div className="flex items-center gap-1.5">
            <span className="text-[10px] uppercase tracking-wider text-neutral-500">
              Plan state
            </span>
            {PLAN_STATES.map((s) => (
              <button
                key={s.id}
                onClick={() => setPlanState(s.id)}
                className={`rounded px-2 py-1 ${
                  planState === s.id
                    ? "bg-yellow-300 text-black"
                    : "bg-neutral-800 hover:bg-neutral-700"
                }`}
              >
                {s.label}
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

/* ----------------------------- Header & shell --------------------------- */

function NoonHeader() {
  return (
    <header className="bg-[#FEEE00]">
      <div className="mx-auto flex h-[68px] max-w-[1440px] items-center gap-6 px-6">
        <div className="flex items-baseline gap-3">
          <span className="text-[28px] font-black tracking-tight">noon</span>
          <span className="text-[14px] font-medium text-black/70">| account</span>
        </div>
        <div className="flex flex-1 items-center rounded-md bg-white px-4 py-3 text-[14px] text-neutral-400">
          <SearchIcon className="mr-3 h-4 w-4" />
          What are you looking for?
        </div>
        <button className="flex items-center gap-1.5 text-[14px] font-medium">
          <GlobeIcon className="h-5 w-5" /> العربية
        </button>
        <button className="flex items-center gap-2 text-[14px] font-medium">
          <UserIcon className="h-5 w-5" /> Hi, arushi ▾
        </button>
        <button className="flex items-center gap-2 text-[14px] font-medium">
          <CartIcon className="h-5 w-5" /> Cart
        </button>
      </div>
    </header>
  );
}

function Sidebar({
  activeScreen,
  onNavigate,
}: {
  activeScreen: Screen;
  onNavigate: (s: Screen) => void;
}) {
  const onOne =
    activeScreen === "subscribed" ||
    activeScreen === "manage" ||
    activeScreen === "change-plan" ||
    activeScreen === "invoice" ||
    activeScreen === "update-payment" ||
    activeScreen === "cancel-reason" ||
    activeScreen === "cancel-done";
  return (
    <aside className="w-[300px] flex-shrink-0 space-y-4">
      {/* Profile card */}
      <div className="rounded-2xl bg-white p-5">
        <div className="flex items-center gap-3">
          <div className="grid h-12 w-12 place-items-center rounded-full bg-neutral-300 text-[14px] font-semibold text-white">
            ab
          </div>
          <div className="min-w-0">
            <div className="truncate text-[15px] font-bold">Hala arushi!</div>
            <div className="truncate text-[12px] text-neutral-500">
              arushibtg@gmail.com
            </div>
          </div>
        </div>
        <div className="mt-4">
          <div className="mb-1.5 flex items-center gap-2 text-[12px]">
            <span className="text-neutral-700">Profile Completion</span>
            <span className="rounded-full bg-yellow-300 px-1.5 py-0.5 font-semibold">
              70%
            </span>
          </div>
          <div className="h-1.5 w-full overflow-hidden rounded-full bg-neutral-200">
            <div className="h-full w-[70%] bg-yellow-400" />
          </div>
        </div>
        <button
          onClick={() => onNavigate("subscribed")}
          className={`mt-4 flex w-full items-center justify-between rounded-xl border px-3 py-2.5 text-[13px] font-semibold transition ${
            onOne
              ? "border-red-400 bg-red-50/60"
              : "border-red-300 bg-white hover:bg-red-50/40"
          }`}
        >
          <span className="flex items-center gap-2">
            <NoonOneBadge /> member
          </span>
          <span>›</span>
        </button>
      </div>

      {/* Primary nav */}
      <div className="rounded-2xl bg-white p-2">
        <NavItem icon="📦" label="Orders" />
        <NavItem icon="↩️" label="Returns" />
        <NavItem icon="💳" label="noon Credits" />
        <NavItem icon="❤️" label="Wishlist" right="12 items" />
      </div>

      {/* My account */}
      <div className="rounded-2xl bg-white p-2">
        <div className="px-3 pb-1 pt-2 text-[11px] font-semibold uppercase tracking-wider text-neutral-500">
          My account
        </div>
        <NavItem icon="👤" label="Profile" />
        <NavItem icon="📍" label="Addresses" />
        <NavItem icon="💳" label="Payments" />
        <NavItem icon="🛡️" label="Warranty Claims" />
        <NavItem icon="🎁" label="Gift Cards" />
        <NavItem icon="📇" label="Digital Cards" />
      </div>

      <div className="rounded-2xl bg-white p-2">
        <div className="px-3 pb-1 pt-2 text-[11px] font-semibold uppercase tracking-wider text-neutral-500">
          Others
        </div>
        <NavItem icon="🔔" label="Notifications" />
        <NavItem icon="🔒" label="Security Settings" />
      </div>
    </aside>
  );
}

function NavItem({
  icon,
  label,
  active,
  right,
}: {
  icon: string;
  label: string;
  active?: boolean;
  right?: string;
}) {
  return (
    <div
      className={`flex items-center justify-between rounded-xl px-3 py-3 text-[14px] ${
        active ? "bg-yellow-100 font-semibold" : "hover:bg-neutral-50"
      }`}
    >
      <span className="flex items-center gap-3">
        <span className="grid h-5 w-5 place-items-center text-[14px]">
          {icon}
        </span>
        {label}
      </span>
      {right && <span className="text-[12px] text-neutral-500">{right}</span>}
    </div>
  );
}

/* ----------------------------- Router ----------------------------------- */

function ScreenRouter({
  screen,
  planState,
  setScreen,
}: {
  screen: Screen;
  planState: PlanState;
  setScreen: (s: Screen) => void;
}) {
  switch (screen) {
    case "payment":
      return <PaymentScreen onSubmit={() => setScreen("upgrading")} />;
    case "upgrading":
      return <UpgradingScreen onDone={() => setScreen("success")} />;
    case "success":
      return <SuccessScreen onContinue={() => setScreen("subscribed")} />;
    case "subscribed":
      return (
        <SubscribedLanding
          state={planState}
          onManage={() => setScreen("manage")}
        />
      );
    case "manage":
      return <ManageMembership onNavigate={setScreen} />;
    case "change-plan":
      return <ChangePlanNudge onBack={() => setScreen("manage")} />;
    case "invoice":
      return <InvoiceScreen onBack={() => setScreen("manage")} />;
    case "update-payment":
      return <UpdatePaymentScreen onBack={() => setScreen("manage")} />;
    case "cancel-reason":
      return (
        <CancelReasonScreen
          onBack={() => setScreen("manage")}
          onConfirm={() => setScreen("cancel-done")}
        />
      );
    case "cancel-done":
      return <CancelDoneScreen onContinue={() => setScreen("subscribed")} />;
  }
}

/* ============================================================
   1. PAYMENT
   ============================================================ */

function PaymentScreen({ onSubmit }: { onSubmit: () => void }) {
  return (
    <div className="space-y-4">
      <PageHeader
        title="Complete your noon One subscription"
        subtitle="Free for 15 days, then dh24.99/month — cancel anytime."
      />

      <div className="grid grid-cols-[1fr_400px] gap-4">
        {/* Left: payment form */}
        <div className="space-y-4">
          <Card>
            {/* Trial clarity strip — top of payment to make terms unmissable */}
            <div className="rounded-xl bg-[#FFF8D7] p-4">
              <div className="mb-3 flex items-center gap-2 text-[13px] font-semibold">
                <span className="rounded-full bg-yellow-300 px-2 py-0.5 text-[11px] uppercase tracking-wider">
                  Free trial
                </span>
                15 days free, then auto-renews
              </div>
              <Timeline />
            </div>

            <div className="mt-6">
              <h3 className="mb-3 text-[15px] font-bold">Payment method</h3>
              <div className="space-y-2">
                <PaymentRow
                  selected
                  brand="VISA"
                  last4="4242"
                  expiry="08/27"
                />
                <PaymentRow brand="MC" last4="1180" expiry="12/26" />
                <button className="flex w-full items-center justify-center gap-2 rounded-xl border border-dashed border-neutral-300 py-3 text-[13px] font-medium text-neutral-700 hover:bg-neutral-50">
                  + Add new card
                </button>
              </div>
            </div>

            <div className="mt-6">
              <h3 className="mb-3 text-[15px] font-bold">Billing address</h3>
              <div className="rounded-xl border border-neutral-200 p-3 text-[13px] text-neutral-700">
                Hala arushi, Apt 402, JLT Cluster X, Dubai, UAE · +971 50 xxx xxxx
                <button className="ml-2 text-[12px] font-semibold text-blue-600">
                  Change
                </button>
              </div>
            </div>
          </Card>
        </div>

        {/* Right: summary */}
        <div className="space-y-4">
          <Card>
            <h3 className="mb-3 text-[15px] font-bold">Order summary</h3>
            <div className="flex items-center gap-3 rounded-xl bg-[#FFF8D7] p-3">
              <NoonOneBadgeLarge />
              <div className="min-w-0">
                <div className="text-[14px] font-bold">noon One Standard</div>
                <div className="text-[12px] text-neutral-600">Monthly plan</div>
              </div>
            </div>

            <dl className="mt-4 space-y-2 text-[13px]">
              <Row k="Subscription">dh24.99/month</Row>
              <Row k="Free trial">−dh24.99</Row>
              <Row k="VAT (5%)">dh0.00</Row>
              <hr className="my-2 border-neutral-200" />
              <Row k="Due today" emphasize>
                dh0.00
              </Row>
            </dl>

            <button
              onClick={onSubmit}
              className="mt-5 w-full rounded-full bg-black py-3.5 text-[14px] font-semibold text-white hover:bg-neutral-800"
            >
              Start 15 day free trial
            </button>

            {/* Recurring terms — explicit so user knows what & when they pay */}
            <p className="mt-3 text-[11px] leading-relaxed text-neutral-500">
              Your free trial starts today, <b>4 May 2026</b>. We'll charge{" "}
              <b>dh24.99 to your VISA ···· 4242 on 19 May 2026</b>, then every
              month after that until you cancel. You can cancel anytime in{" "}
              <i>Manage membership</i> — no charge if you cancel before 19 May.
            </p>
          </Card>

          <Card compact>
            <div className="flex items-center gap-2 text-[12px] text-neutral-600">
              <span>🔒</span> Secure checkout · 3D-Secure · PCI compliant
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}

function Timeline() {
  return (
    <div className="relative pl-1">
      <div className="absolute left-[7px] top-2 h-[calc(100%-16px)] w-px bg-neutral-300" />
      {[
        {
          k: "Today · 4 May",
          v: "Trial begins · dh0.00 charged",
          done: true,
        },
        {
          k: "17 May",
          v: "We email you 2 days before billing",
        },
        {
          k: "19 May",
          v: "First charge of dh24.99 (then monthly)",
        },
      ].map((row, i) => (
        <div key={i} className="relative flex items-start gap-3 py-1.5">
          <div
            className={`mt-1 h-3.5 w-3.5 rounded-full border-2 ${
              row.done
                ? "border-black bg-yellow-300"
                : "border-neutral-400 bg-white"
            }`}
          />
          <div className="text-[12px]">
            <div className="font-semibold">{row.k}</div>
            <div className="text-neutral-600">{row.v}</div>
          </div>
        </div>
      ))}
    </div>
  );
}

function PaymentRow({
  selected,
  brand,
  last4,
  expiry,
}: {
  selected?: boolean;
  brand: string;
  last4: string;
  expiry: string;
}) {
  return (
    <div
      className={`flex items-center gap-3 rounded-xl border p-3 ${
        selected ? "border-black bg-neutral-50" : "border-neutral-200"
      }`}
    >
      <div
        className={`grid h-5 w-5 place-items-center rounded-full border-2 ${
          selected ? "border-black" : "border-neutral-300"
        }`}
      >
        {selected && <div className="h-2.5 w-2.5 rounded-full bg-black" />}
      </div>
      <div className="grid h-7 w-11 place-items-center rounded bg-neutral-100 text-[10px] font-bold">
        {brand}
      </div>
      <div className="flex-1 text-[13px]">···· ···· ···· {last4}</div>
      <div className="text-[12px] text-neutral-500">Exp {expiry}</div>
    </div>
  );
}

/* ============================================================
   2. UPGRADING ANIMATION
   ============================================================ */

function UpgradingScreen({ onDone }: { onDone: () => void }) {
  useEffect(() => {
    const t = setTimeout(onDone, 2400);
    return () => clearTimeout(t);
  }, [onDone]);
  return (
    <div className="relative grid min-h-[640px] place-items-center overflow-hidden rounded-3xl">
      {/* Soft gradient background that mirrors the mobile splash */}
      <div className="absolute inset-0 bg-gradient-to-br from-yellow-200 via-yellow-300 to-amber-400" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(255,255,255,0.55),transparent_60%)]" />

      <div className="relative z-10 flex flex-col items-center text-center">
        {/* spinning halo */}
        <div className="relative mb-8 h-32 w-32">
          <div className="absolute inset-0 animate-spin rounded-full border-[6px] border-white/40 border-t-black" />
          <div className="absolute inset-3 grid place-items-center rounded-full bg-white shadow-xl">
            <NoonOneBadgeLarge />
          </div>
        </div>
        <h2 className="text-[28px] font-black tracking-tight">
          Upgrading your experience
        </h2>
        <p className="mt-2 max-w-md text-[14px] text-black/70">
          Unlocking unlimited free delivery, 10% off &amp; partner perks…
        </p>

        <div className="mt-6 flex items-center gap-2 text-[12px] text-black/60">
          <Tick /> Securing payment
          <span className="mx-2">·</span>
          <Tick /> Activating perks
          <span className="mx-2">·</span>
          <span className="inline-block h-1.5 w-1.5 animate-pulse rounded-full bg-black" />{" "}
          Almost done
        </div>
      </div>
    </div>
  );
}

function Tick() {
  return (
    <span className="grid h-4 w-4 place-items-center rounded-full bg-black text-[9px] text-yellow-300">
      ✓
    </span>
  );
}

/* ============================================================
   3. SUCCESS
   ============================================================ */

function SuccessScreen({ onContinue }: { onContinue: () => void }) {
  return (
    <div className="rounded-3xl bg-gradient-to-b from-yellow-200 to-yellow-100 p-12 text-center">
      <div className="mx-auto mb-6 grid h-20 w-20 place-items-center rounded-full bg-black">
        <span className="text-[36px] text-yellow-300">✓</span>
      </div>
      <h1 className="text-[36px] font-black tracking-tight">Welcome to noon One, Hala!</h1>
      <p className="mt-2 text-[15px] text-black/70">
        Your free trial is active until <b>19 May 2026</b>.
      </p>

      <div className="mx-auto mt-8 grid max-w-3xl grid-cols-3 gap-3">
        <PerkTile
          icon="🚚"
          title="Unlimited free delivery"
          body="On everything, every order"
        />
        <PerkTile
          icon="🏷️"
          title="10% off on the 1st"
          body="Save more on the 1st of every month"
        />
        <PerkTile
          icon="🎬"
          title="Activate partner perks"
          body="OSN+ or Yango Plus included"
        />
      </div>

      <div className="mt-8 flex justify-center gap-3">
        <button className="rounded-full border border-black bg-white px-6 py-3 text-[14px] font-semibold">
          View receipt
        </button>
        <button
          onClick={onContinue}
          className="rounded-full bg-black px-6 py-3 text-[14px] font-semibold text-white"
        >
          Explore your benefits
        </button>
      </div>
    </div>
  );
}

function PerkTile({
  icon,
  title,
  body,
}: {
  icon: string;
  title: string;
  body: string;
}) {
  return (
    <div className="rounded-2xl bg-white p-4 text-left">
      <div className="text-[28px]">{icon}</div>
      <div className="mt-2 text-[14px] font-bold">{title}</div>
      <div className="mt-1 text-[12px] text-neutral-600">{body}</div>
    </div>
  );
}

/* ============================================================
   SUBSCRIBED LANDING — the main page with state variants
   ============================================================ */

function SubscribedLanding({
  state,
  onManage,
}: {
  state: PlanState;
  onManage: () => void;
}) {
  return (
    <div className="space-y-4">
      <PageHeader title="noon One" subtitle="Manage your membership & perks" />

      <PlanWidget state={state} onManage={onManage} />

      <SavingsWidget state={state} />

      <PartnerActivation />

      <WatchWidgets />

      <BenefitsBlock />

      <FAQBlock />
    </div>
  );
}

/* --------------------- The plan widget — 7 states --------------------- */

type PlanCopy = {
  statusTag: string;
  statusTone: "green" | "red" | "neutral";
  renewLine: React.ReactNode;
  cta: "manage" | "renew+manage";
  showUpcoming?: boolean;
  hidePrice?: boolean;
};

const PLAN_COPY: Record<PlanState, PlanCopy> = {
  "trial-active": {
    statusTag: "Free trial · ends in 11 days",
    statusTone: "green",
    renewLine: (
      <>
        Auto-renews on <b>19 May 2026</b> for <b>dh24.99</b>
      </>
    ),
    cta: "manage",
  },
  "trial-cancelled": {
    statusTag: "Expires in 7 days",
    statusTone: "red",
    renewLine: (
      <>
        Plan ends on <b>11 May 2026</b> · won't auto-renew
      </>
    ),
    cta: "renew+manage",
  },
  "trial-upcoming": {
    statusTag: "Free trial · ends in 11 days",
    statusTone: "green",
    renewLine: (
      <>
        Plan ends on <b>15 May 2026</b> · won't auto-renew
      </>
    ),
    cta: "manage",
    showUpcoming: true,
  },
  "active-paid": {
    statusTag: "Active",
    statusTone: "green",
    renewLine: (
      <>
        Auto-renews on <b>19 Jun 2026</b> for <b>dh24.99</b>
      </>
    ),
    cta: "manage",
  },
  "cancelled-gt15": {
    statusTag: "Active",
    statusTone: "green",
    renewLine: (
      <>
        Plan ends on <b>3 Jun 2026</b> · won't auto-renew
      </>
    ),
    cta: "renew+manage",
  },
  "cancelled-lt15": {
    statusTag: "Expires in 9 days",
    statusTone: "red",
    renewLine: (
      <>
        Plan ends on <b>13 May 2026</b>, renew to keep saving
      </>
    ),
    cta: "renew+manage",
  },
  "cancelled-upcoming": {
    statusTag: "Active",
    statusTone: "green",
    renewLine: (
      <>
        Plan ends on <b>3 Jun 2026</b> · won't auto-renew
      </>
    ),
    cta: "manage",
    showUpcoming: true,
  },
};

function PlanWidget({
  state,
  onManage,
}: {
  state: PlanState;
  onManage: () => void;
}) {
  const copy = PLAN_COPY[state];
  const toneClass =
    copy.statusTone === "green"
      ? "bg-green-100 text-green-800"
      : copy.statusTone === "red"
      ? "bg-red-100 text-red-700"
      : "bg-neutral-100 text-neutral-700";

  return (
    <div className="overflow-hidden rounded-xl bg-gradient-to-br from-[#FFF1A8] via-[#FFE571] to-[#FFD93D] p-[2px] shadow-sm">
      <div className="rounded-[10px] bg-white">
        <div className="flex items-center gap-4 px-4 py-3">
          <NoonOneBadgeLarge />
          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-2">
              <span className="text-[15px] font-bold">noon One Standard</span>
              <span className={`rounded-full px-2 py-0.5 text-[10px] font-semibold ${toneClass}`}>
                {copy.statusTag}
              </span>
            </div>
            <div className="mt-0.5 text-[12px] text-neutral-600">
              {copy.renewLine}
              {!copy.hidePrice && (
                <span className="ml-2 text-neutral-400">· VISA ···· 4242</span>
              )}
            </div>
          </div>

          <div className="flex items-center gap-3">
            {copy.cta === "renew+manage" && (
              <button className="rounded-full bg-black px-4 py-2 text-[12px] font-semibold text-white">
                Renew now
              </button>
            )}
            <button
              onClick={onManage}
              className="whitespace-nowrap text-[12px] font-semibold text-blue-600 hover:underline"
            >
              Manage ›
            </button>
          </div>
        </div>

        {copy.showUpcoming && (
          <div className="mx-3 mb-3 flex items-center gap-3 rounded-lg border border-green-200 bg-green-50 px-3 py-2">
            <span className="text-[10px] font-semibold uppercase tracking-wider text-green-700">
              ↻ Upcoming
            </span>
            <div className="min-w-0 flex-1 text-[12px]">
              <span className="font-bold">noon One Bundle · OSN+</span>
              <span className="ml-1 text-neutral-600">
                · Starts <b>4 Jun</b> for <b>dh29.99/mo</b>
              </span>
            </div>
            <button className="text-[11px] font-semibold text-blue-600 hover:underline">
              Edit
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

/* ----------------------- Partner activation block --------------------- */

/* ----------------------- Savings widget ------------------------------- */

function SavingsWidget({ state }: { state: PlanState }) {
  // Trial states haven't accumulated meaningful savings yet — show an
  // anticipatory empty state instead of the full breakdown.
  const isTrial =
    state === "trial-active" ||
    state === "trial-cancelled" ||
    state === "trial-upcoming";

  if (isTrial) {
    return (
      <div className="rounded-2xl bg-gradient-to-br from-[#FFF8D7] to-[#FFEAA8] p-5">
        <div className="flex items-center gap-4">
          <div className="grid h-14 w-14 place-items-center rounded-2xl bg-white text-[24px]">
            💰
          </div>
          <div className="min-w-0 flex-1">
            <div className="text-[15px] font-bold">Your savings start here</div>
            <div className="mt-0.5 text-[12px] text-neutral-700">
              Place your first order with free delivery — we'll start tracking
              everything you save.
            </div>
          </div>
          <button className="rounded-full bg-black px-4 py-2 text-[12px] font-semibold text-white">
            Shop now
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="overflow-hidden rounded-xl bg-gradient-to-br from-[#FFF6D6] via-white to-white px-4 py-3 shadow-sm">
      <div className="flex items-center gap-5">
        {/* Hero — inline with line items */}
        <div className="flex items-baseline gap-2 pr-4">
          <div>
            <div className="text-[11px] font-medium leading-tight text-neutral-600">
              You've saved
            </div>
            <div className="text-[24px] font-black leading-none tracking-tight">
              <span className="text-neutral-400 line-through decoration-[2px]">dh</span>
              <span>124.34</span>
            </div>
          </div>
          <span className="rounded-full bg-green-100 px-2 py-0.5 text-[10px] font-semibold text-green-800">
            3× paid
          </span>
        </div>

        <div className="h-10 w-px bg-neutral-200" />

        <SavingsChip icon="🚚" tone="green" title="Free deliveries" meta="21×" value="dh79.22" />
        <SavingsChip icon="🏷️" tone="green" title="Member deals" meta="3×" value="dh48.22" />
        <SavingsChip icon="🎬" tone="purple" title="OSN+" meta="Active" value="dh29.99" />

        <button className="ml-auto whitespace-nowrap text-[11px] font-semibold text-blue-600 hover:underline">
          History ›
        </button>
      </div>
    </div>
  );
}

function SavingsChip({
  icon,
  tone,
  title,
  meta,
  value,
}: {
  icon: string;
  tone: "green" | "purple";
  title: string;
  meta: string;
  value: string;
}) {
  const toneClass =
    tone === "green" ? "bg-green-50" : "bg-purple-50";
  return (
    <div className="flex min-w-0 items-center gap-2">
      <div className={`grid h-8 w-8 place-items-center rounded-lg text-[14px] ${toneClass}`}>
        {icon}
      </div>
      <div className="min-w-0">
        <div className="flex items-baseline gap-1.5">
          <span className="truncate text-[12px] font-semibold leading-tight">{title}</span>
          <span className="text-[10px] text-neutral-400">{meta}</span>
        </div>
        <div className="text-[13px] font-black leading-tight text-neutral-400 line-through decoration-[1.5px]">
          {value}
        </div>
      </div>
    </div>
  );
}

function PartnerActivation() {
  return (
    <Card>
      <div className="mb-3 flex items-center justify-between">
        <h3 className="text-[15px] font-bold">Activate your partner perks</h3>
        <span className="text-[11px] text-neutral-500">Included with your plan</span>
      </div>
      <div className="grid grid-cols-2 gap-3">
        <PartnerCard
          name="OSN+"
          color="from-purple-600 to-fuchsia-700"
          desc="Watch HBO originals, premieres & more"
          status="not-activated"
        />
        <PartnerCard
          name="Yango Play"
          color="from-pink-500 to-rose-500"
          desc="Movies, music & cashback on rides"
          status="activated"
        />
      </div>
    </Card>
  );
}

function PartnerCard({
  name,
  color,
  desc,
  status,
}: {
  name: string;
  color: string;
  desc: string;
  status: "activated" | "not-activated";
}) {
  return (
    <div
      className={`relative overflow-hidden rounded-2xl bg-gradient-to-br ${color} p-4 text-white`}
    >
      <div className="text-[18px] font-black">{name}</div>
      <div className="mt-1 max-w-[180px] text-[12px] opacity-90">{desc}</div>
      <div className="mt-4">
        {status === "activated" ? (
          <button className="rounded-full bg-white/20 px-3 py-1.5 text-[12px] font-semibold backdrop-blur">
            ✓ Activated · Watch now ›
          </button>
        ) : (
          <button className="rounded-full bg-white px-3 py-1.5 text-[12px] font-semibold text-black">
            Activate now ›
          </button>
        )}
      </div>
      <div className="absolute -right-4 -top-4 h-20 w-20 rounded-full bg-white/10" />
    </div>
  );
}

/* --------------------------- Watch widgets ---------------------------- */

function WatchWidgets() {
  return (
    <Card>
      <div className="mb-3 flex items-center justify-between">
        <h3 className="text-[15px] font-bold">Continue watching</h3>
        <a className="text-[12px] font-semibold text-blue-600">See all ›</a>
      </div>
      <div className="grid grid-cols-4 gap-3">
        {[
          { t: "House of Dragon", b: "OSN+" },
          { t: "True Detective", b: "OSN+" },
          { t: "Fast X", b: "Yango Play" },
          { t: "Top Gun: Maverick", b: "Yango Play" },
        ].map((m) => (
          <div
            key={m.t}
            className="overflow-hidden rounded-xl bg-neutral-100"
          >
            <div className="aspect-[3/4] bg-gradient-to-br from-neutral-700 to-neutral-900" />
            <div className="p-2.5">
              <div className="truncate text-[13px] font-semibold">{m.t}</div>
              <div className="text-[11px] text-neutral-500">{m.b}</div>
            </div>
          </div>
        ))}
      </div>
    </Card>
  );
}

/* ---------------------------- Benefits block -------------------------- */

function BenefitsBlock() {
  return (
    <Card>
      <h3 className="mb-3 text-[15px] font-bold">Your benefits</h3>
      <div className="grid grid-cols-3 gap-3">
        <Benefit icon="🚚" t="Unlimited free delivery" b="No min. order, every category" />
        <Benefit icon="🏷️" t="10% off on the 1st" b="Once a month on everything" />
        <Benefit icon="⚡" t="Priority support" b="Faster help, fewer waits" />
        <Benefit icon="🎬" t="OSN+ included" b="Premium streaming, no extra cost" />
        <Benefit icon="🚖" t="Yango Plus" b="Cashback on rides, music, movies" />
        <Benefit icon="💎" t="Member-only deals" b="Exclusive prices weekly" />
      </div>
    </Card>
  );
}

function Benefit({ icon, t, b }: { icon: string; t: string; b: string }) {
  return (
    <div className="rounded-xl bg-[#FFF8D7] p-3">
      <div className="text-[24px]">{icon}</div>
      <div className="mt-1 text-[13px] font-bold">{t}</div>
      <div className="text-[11px] text-neutral-600">{b}</div>
    </div>
  );
}

/* --------------------------------- FAQ -------------------------------- */

function FAQBlock() {
  const [open, setOpen] = useState(0);
  const faqs = [
    {
      q: "When will I be charged?",
      a: "Your free trial lasts 15 days. We'll charge dh24.99 on 19 May 2026 to your VISA ···· 4242, then monthly until you cancel.",
    },
    { q: "How do I cancel?", a: "Open Manage membership → Cancel. You can keep using benefits until your billing period ends." },
    { q: "Can I switch plans?", a: "Yes — change between Standard and Bundle in Manage membership. Changes apply on the next billing cycle." },
    { q: "What's included with OSN+ / Yango Plus?", a: "Both partner perks come bundled with your noon One subscription at no extra cost. Activate them from this page." },
  ];
  return (
    <Card>
      <h3 className="mb-3 text-[15px] font-bold">Frequently asked</h3>
      <div className="divide-y divide-neutral-200">
        {faqs.map((f, i) => (
          <div key={i} className="py-3">
            <button
              onClick={() => setOpen(open === i ? -1 : i)}
              className="flex w-full items-center justify-between text-left text-[14px] font-semibold"
            >
              {f.q}
              <span className="text-neutral-400">{open === i ? "−" : "+"}</span>
            </button>
            {open === i && (
              <p className="mt-2 text-[13px] text-neutral-600">{f.a}</p>
            )}
          </div>
        ))}
      </div>
    </Card>
  );
}

/* ============================================================
   MANAGE MEMBERSHIP
   ============================================================ */

function ManageMembership({ onNavigate }: { onNavigate: (s: Screen) => void }) {
  return (
    <div className="space-y-4">
      <PageHeader
        title="Manage membership"
        subtitle="Make changes to your noon One plan"
        backTo={{ label: "noon One", action: () => onNavigate("subscribed") }}
      />

      <Card>
        <div className="flex items-start justify-between">
          <div>
            <div className="flex items-center gap-2">
              <NoonOneBadgeLarge />
              <span className="rounded-full bg-green-100 px-2.5 py-1 text-[11px] font-semibold text-green-800">
                Active
              </span>
            </div>
            <div className="mt-2 text-[16px] font-bold">noon One Standard</div>
            <div className="text-[13px] text-neutral-600">
              Auto-renews on <b>19 Jun 2026</b> for <b>dh24.99</b>
            </div>
          </div>
          <div className="text-right text-[12px] text-neutral-500">
            Member since 4 May 2026
          </div>
        </div>
      </Card>

      <Card>
        <div className="divide-y divide-neutral-100">
          <ManageRow
            icon="🔄"
            title="Change plan"
            body="Switch between Standard and Bundle"
            onClick={() => onNavigate("change-plan")}
          />
          <ManageRow
            icon="📄"
            title="View invoices"
            body="See your billing history"
            onClick={() => onNavigate("invoice")}
          />
          <ManageRow
            icon="💳"
            title="Update payment method"
            body="VISA ···· 4242 · Exp 08/27"
            onClick={() => onNavigate("update-payment")}
          />
          <ManageRow
            icon="❌"
            title="Cancel membership"
            body="You can re-subscribe anytime"
            tone="danger"
            onClick={() => onNavigate("cancel-reason")}
          />
        </div>
      </Card>
    </div>
  );
}

function ManageRow({
  icon,
  title,
  body,
  onClick,
  tone,
}: {
  icon: string;
  title: string;
  body: string;
  onClick: () => void;
  tone?: "danger";
}) {
  return (
    <button
      onClick={onClick}
      className="flex w-full items-center gap-4 py-4 text-left hover:bg-neutral-50"
    >
      <div
        className={`grid h-10 w-10 place-items-center rounded-full text-[18px] ${
          tone === "danger" ? "bg-red-50" : "bg-yellow-100"
        }`}
      >
        {icon}
      </div>
      <div className="flex-1">
        <div
          className={`text-[14px] font-semibold ${
            tone === "danger" ? "text-red-700" : ""
          }`}
        >
          {title}
        </div>
        <div className="text-[12px] text-neutral-600">{body}</div>
      </div>
      <span className="text-neutral-400">›</span>
    </button>
  );
}

/* --------------------- Change plan: app nudge ------------------------ */

function ChangePlanNudge({ onBack }: { onBack: () => void }) {
  return (
    <div className="space-y-4">
      <PageHeader
        title="Change plan"
        backTo={{ label: "Manage membership", action: onBack }}
      />
      <Card>
        <div className="grid grid-cols-[1fr_280px] items-center gap-8">
          <div>
            <div className="mb-2 inline-block rounded-full bg-yellow-200 px-2 py-1 text-[11px] font-semibold">
              📱 App-only feature
            </div>
            <h3 className="text-[22px] font-black tracking-tight">
              Change your plan in the noon app
            </h3>
            <p className="mt-2 text-[14px] text-neutral-600">
              Plan changes — including switching between Standard and Bundle, or
              upgrading to Annual — are managed in the noon app today. We're
              bringing this to web soon.
            </p>

            <div className="mt-5 flex gap-3">
              <button className="flex items-center gap-2 rounded-xl bg-black px-4 py-2.5 text-white">
                <AppleIcon /> App Store
              </button>
              <button className="flex items-center gap-2 rounded-xl bg-black px-4 py-2.5 text-white">
                <PlayIcon /> Google Play
              </button>
            </div>

            <div className="mt-5 flex items-center gap-2 text-[12px] text-neutral-500">
              <span>or scan the QR code →</span>
            </div>
          </div>

          <div className="grid place-items-center rounded-2xl bg-[#FFF8D7] p-6">
            <div className="grid h-44 w-44 place-items-center rounded-2xl bg-white p-3">
              <div
                className="h-full w-full bg-black"
                style={{
                  maskImage:
                    "radial-gradient(circle, transparent 4px, black 5px)",
                  maskSize: "10px 10px",
                  WebkitMaskImage:
                    "radial-gradient(circle, transparent 4px, black 5px)",
                  WebkitMaskSize: "10px 10px",
                }}
              />
            </div>
            <div className="mt-3 text-[12px] font-medium text-neutral-700">
              Open camera to scan
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
}

/* ----------------------------- Invoices ------------------------------ */

function InvoiceScreen({ onBack }: { onBack: () => void }) {
  const rows = [
    { d: "4 Apr 2026", a: "dh24.99", id: "INV-2026-0007", s: "Paid" },
    { d: "4 Mar 2026", a: "dh24.99", id: "INV-2026-0006", s: "Paid" },
    { d: "4 Feb 2026", a: "dh24.99", id: "INV-2026-0005", s: "Paid" },
    { d: "4 Jan 2026", a: "dh24.99", id: "INV-2026-0004", s: "Paid" },
    { d: "4 Dec 2025", a: "dh0.00", id: "INV-2025-0003", s: "Trial" },
  ];
  return (
    <div className="space-y-4">
      <PageHeader
        title="Invoices"
        subtitle="Download receipts for your records"
        backTo={{ label: "Manage membership", action: onBack }}
      />
      <Card>
        <table className="w-full text-[13px]">
          <thead>
            <tr className="text-left text-[11px] uppercase tracking-wider text-neutral-500">
              <th className="pb-3">Date</th>
              <th className="pb-3">Invoice</th>
              <th className="pb-3">Amount</th>
              <th className="pb-3">Status</th>
              <th className="pb-3"></th>
            </tr>
          </thead>
          <tbody className="divide-y divide-neutral-100">
            {rows.map((r) => (
              <tr key={r.id}>
                <td className="py-3.5">{r.d}</td>
                <td className="py-3.5 font-mono text-[12px] text-neutral-600">
                  {r.id}
                </td>
                <td className="py-3.5 font-semibold">{r.a}</td>
                <td className="py-3.5">
                  <span
                    className={`rounded-full px-2 py-0.5 text-[11px] font-semibold ${
                      r.s === "Paid"
                        ? "bg-green-100 text-green-800"
                        : "bg-yellow-100 text-yellow-800"
                    }`}
                  >
                    {r.s}
                  </span>
                </td>
                <td className="py-3.5 text-right">
                  <button className="text-[12px] font-semibold text-blue-600">
                    Download PDF ↓
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </Card>
    </div>
  );
}

/* -------------------------- Update payment --------------------------- */

function UpdatePaymentScreen({ onBack }: { onBack: () => void }) {
  return (
    <div className="space-y-4">
      <PageHeader
        title="Update payment method"
        subtitle="Choose what we charge for noon One renewals"
        backTo={{ label: "Manage membership", action: onBack }}
      />
      <Card>
        <div className="space-y-2">
          <PaymentRow selected brand="VISA" last4="4242" expiry="08/27" />
          <PaymentRow brand="MC" last4="1180" expiry="12/26" />
          <PaymentRow brand="AMEX" last4="0034" expiry="04/28" />
          <button className="flex w-full items-center justify-center gap-2 rounded-xl border border-dashed border-neutral-300 py-3 text-[13px] font-medium text-neutral-700 hover:bg-neutral-50">
            + Add new card
          </button>
        </div>
        <div className="mt-5 flex justify-end gap-2">
          <button className="rounded-full border border-neutral-300 px-5 py-2.5 text-[13px] font-semibold">
            Cancel
          </button>
          <button className="rounded-full bg-black px-5 py-2.5 text-[13px] font-semibold text-white">
            Save changes
          </button>
        </div>
      </Card>
    </div>
  );
}

/* ----------------------------- Cancel flow --------------------------- */

function CancelReasonScreen({
  onBack,
  onConfirm,
}: {
  onBack: () => void;
  onConfirm: () => void;
}) {
  const [reason, setReason] = useState<string | null>(null);
  const reasons = [
    "Too expensive",
    "I don't shop on noon often enough",
    "I don't use the partner perks",
    "Found a better deal elsewhere",
    "Delivery issues",
    "Just trying it out",
    "Other",
  ];
  return (
    <div className="space-y-4">
      <PageHeader
        title="Cancel membership"
        backTo={{ label: "Manage membership", action: onBack }}
      />

      <Card>
        <div className="mb-4 rounded-xl bg-yellow-50 p-4">
          <div className="text-[14px] font-semibold">
            You'll keep your benefits until <b>19 Jun 2026</b>
          </div>
          <div className="mt-1 text-[12px] text-neutral-600">
            After that, free delivery, 10% off and partner perks will end.
          </div>
        </div>

        <h3 className="mb-3 text-[14px] font-bold">
          Why are you cancelling? <span className="text-neutral-400">(optional)</span>
        </h3>
        <div className="space-y-2">
          {reasons.map((r) => (
            <label
              key={r}
              className={`flex cursor-pointer items-center gap-3 rounded-xl border p-3 text-[13px] ${
                reason === r ? "border-black bg-neutral-50" : "border-neutral-200"
              }`}
            >
              <input
                type="radio"
                name="reason"
                checked={reason === r}
                onChange={() => setReason(r)}
                className="h-4 w-4 accent-black"
              />
              {r}
            </label>
          ))}
        </div>

        <div className="mt-5 flex items-center justify-between gap-3">
          <button
            onClick={onBack}
            className="rounded-full bg-yellow-300 px-5 py-2.5 text-[13px] font-semibold"
          >
            ← Keep my membership
          </button>
          <button
            onClick={onConfirm}
            className="rounded-full border border-red-300 bg-white px-5 py-2.5 text-[13px] font-semibold text-red-700 hover:bg-red-50"
          >
            Cancel anyway
          </button>
        </div>
      </Card>
    </div>
  );
}

function CancelDoneScreen({ onContinue }: { onContinue: () => void }) {
  return (
    <div className="space-y-4">
      <Card>
        <div className="py-6 text-center">
          <div className="mx-auto mb-4 grid h-14 w-14 place-items-center rounded-full bg-neutral-100">
            ✓
          </div>
          <h2 className="text-[22px] font-black tracking-tight">
            Your membership has been cancelled
          </h2>
          <p className="mx-auto mt-2 max-w-md text-[13px] text-neutral-600">
            You can keep enjoying noon One benefits until <b>19 Jun 2026</b>.
            After that, your account will return to a regular noon account.
          </p>

          <div className="mx-auto mt-5 max-w-md rounded-xl border border-neutral-200 bg-neutral-50 p-3 text-left text-[12px]">
            <div className="font-semibold">Changed your mind?</div>
            <div className="mt-1 text-neutral-600">
              You can resume your membership anytime before 19 Jun 2026 and
              avoid losing access.
            </div>
            <button className="mt-3 rounded-full bg-black px-4 py-2 text-[12px] font-semibold text-white">
              Resume membership
            </button>
          </div>

          <button
            onClick={onContinue}
            className="mt-6 text-[13px] font-semibold text-blue-600"
          >
            Back to noon One ›
          </button>
        </div>
      </Card>
    </div>
  );
}

/* ============================================================
   Generic UI bits
   ============================================================ */

function PageHeader({
  title,
  subtitle,
  backTo,
}: {
  title: string;
  subtitle?: string;
  backTo?: { label: string; action: () => void };
}) {
  return (
    <div>
      {backTo && (
        <button
          onClick={backTo.action}
          className="mb-1 text-[12px] font-medium text-neutral-500 hover:text-black"
        >
          ← {backTo.label}
        </button>
      )}
      <h1 className="text-[24px] font-black tracking-tight">{title}</h1>
      {subtitle && (
        <p className="mt-1 text-[13px] text-neutral-600">{subtitle}</p>
      )}
    </div>
  );
}

function Card({
  children,
  compact,
}: {
  children: React.ReactNode;
  compact?: boolean;
}) {
  return (
    <div
      className={`rounded-2xl bg-white ${compact ? "p-3" : "p-5"} shadow-sm`}
    >
      {children}
    </div>
  );
}

function Row({
  k,
  children,
  emphasize,
}: {
  k: string;
  children: React.ReactNode;
  emphasize?: boolean;
}) {
  return (
    <div className="flex justify-between">
      <dt className="text-neutral-600">{k}</dt>
      <dd className={emphasize ? "text-[15px] font-bold" : "font-medium"}>
        {children}
      </dd>
    </div>
  );
}

/* ----------------------------- Logos & icons -------------------------- */

function NoonOneBadge() {
  // mini version for sidebar
  return (
    <span className="inline-flex items-center gap-0.5 rounded-md bg-black px-1.5 py-0.5">
      <span className="text-[10px] font-black leading-none text-yellow-300">
        noon
      </span>
      <span className="rounded bg-yellow-300 px-1 text-[9px] font-black leading-none text-black">
        one
      </span>
    </span>
  );
}

function NoonOneBadgeLarge() {
  return (
    <span className="inline-flex items-center gap-1 rounded-lg bg-black px-2 py-1">
      <span className="text-[14px] font-black leading-none text-yellow-300">
        noon
      </span>
      <span className="rounded-md bg-yellow-300 px-1.5 py-0.5 text-[11px] font-black leading-none text-black">
        one
      </span>
    </span>
  );
}

function SearchIcon({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="none" stroke="currentColor" strokeWidth="2">
      <circle cx="11" cy="11" r="7" />
      <path d="m20 20-3.5-3.5" />
    </svg>
  );
}

function GlobeIcon({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="none" stroke="currentColor" strokeWidth="2">
      <circle cx="12" cy="12" r="9" />
      <path d="M3 12h18M12 3a14 14 0 0 1 0 18M12 3a14 14 0 0 0 0 18" />
    </svg>
  );
}

function UserIcon({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="none" stroke="currentColor" strokeWidth="2">
      <circle cx="12" cy="9" r="3.5" />
      <path d="M5 20a7 7 0 0 1 14 0" />
      <circle cx="12" cy="12" r="9" />
    </svg>
  );
}

function CartIcon({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M5 6h15l-2 9H7L5 6zM5 6 4 3H2" />
      <circle cx="9" cy="20" r="1.5" />
      <circle cx="17" cy="20" r="1.5" />
    </svg>
  );
}

function AppleIcon() {
  return <span className="text-[16px]"></span>;
}
function PlayIcon() {
  return <span className="text-[16px]">▶</span>;
}
