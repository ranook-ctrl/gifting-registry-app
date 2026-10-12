import { useState, type CSSProperties } from 'react';
import { colour, space } from '../src/field-ds';
import { GifterFlow, CreatorFlow, CreateListFlow } from './flows';
import { DESIGN_WIDTH, useDeviceScale } from './useDeviceScale';

/* ------------------------------------------------------------------ config */

type TabId = 'gifter' | 'creator' | 'create';

const NAV_H = 64;

const SANS =
  '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif';

const TABS: { id: TabId; label: string; Icon: (p: { active: boolean }) => JSX.Element }[] = [
  { id: 'gifter', label: 'Gifter', Icon: GiftIcon },
  { id: 'creator', label: 'Creator', Icon: StoreIcon },
  { id: 'create', label: 'Create list', Icon: PlusIcon },
];

/* ------------------------------------------------------------------- shell */

/**
 * Gifting Registry landing — a mobile phone-frame that hosts each registry flow
 * behind a Field DS bottom navigation bar. The active flow scrolls inside a
 * transformed container so its own fixed/sticky chrome (floating cart, sticky
 * footers, full-screen sheets) stays neatly above the persistent tab bar.
 */
export function App() {
  const [tab, setTab] = useState<TabId>('gifter');
  const { scale, safeBottom } = useDeviceScale();

  // The 375pt canvas is scaled to the device by `zoom` (see useDeviceScale).
  // Lengths inside the frame are therefore *design* px, so the viewport-unit
  // height has to be divided back out — `100dvh` would otherwise be multiplied
  // by `zoom` and overflow the screen. dvh (not vh) so the frame tracks mobile
  // browser chrome collapsing without a JS listener.
  //
  // Published as `--frame-height` so descendants can size against the visible
  // screen too: inside the zoom, a raw `dvh`/`vh` unit is off by the zoom factor,
  // so anything wanting "n% of the viewport" must go through this variable.
  // Consumers should fall back to `100dvh` for the standalone (unzoomed) entries.
  const frame = {
    ...appFrame,
    zoom: scale,
    '--frame-height': `calc(100dvh / ${scale})`,
    height: 'var(--frame-height)',
    maxHeight: 'var(--frame-height)',
  } as CSSProperties;

  return (
    <div style={frame}>
      {/* Re-mount the flow on tab change so each tab opens at its start. */}
      <div key={tab} style={scrollArea}>
        {tab === 'gifter' && <GifterFlow safeBottom={safeBottom} />}
        {tab === 'creator' && <CreatorFlow />}
        {tab === 'create' && <CreateListFlow />}
      </div>

      {/* Reserve the home-indicator strip below the row (border-box, so the
          buttons keep their full NAV_H) — otherwise the labels sit under it. */}
      <nav
        style={{ ...navBar, height: NAV_H + safeBottom, paddingBottom: safeBottom }}
        aria-label="Flows"
      >
        {TABS.map(({ id, label, Icon }) => {
          const active = id === tab;
          return (
            <button
              key={id}
              type="button"
              role="tab"
              aria-selected={active}
              onClick={() => setTab(id)}
              style={navItem}
            >
              <Icon active={active} />
              <span
                style={{
                  ...navLabel,
                  color: active ? colour['text-n-icon'].action : colour['text-n-icon'].tertiary,
                  fontFamily: `${active ? 'Noontree-SemiBold' : 'Noontree-Medium'}, ${SANS}`,
                  fontWeight: active ? 600 : 500,
                }}
              >
                {label}
              </span>
            </button>
          );
        })}
      </nav>
    </div>
  );
}

/* ------------------------------------------------------------------- icons */
// Outline icons that tint via `active` — Field DS action blue when selected,
// blue-gray/600 otherwise. Stroked at 1.6 to match the app's icon weight.

function iconColor(active: boolean) {
  return active ? colour['text-n-icon'].action : colour['text-n-icon'].tertiary;
}

function GiftIcon({ active }: { active: boolean }) {
  const c = iconColor(active);
  return (
    <svg width={24} height={24} viewBox="0 0 24 24" fill="none">
      <path d="M20 12v8.5a.5.5 0 0 1-.5.5h-15a.5.5 0 0 1-.5-.5V12" stroke={c} strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M21 7.5H3v4h18v-4Z" stroke={c} strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M12 7.5V21" stroke={c} strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M12 7.5S10.6 3 8.2 3C6.8 3 6 3.9 6 5c0 1.4 1.3 2.5 3 2.5h3Zm0 0S13.4 3 15.8 3C17.2 3 18 3.9 18 5c0 1.4-1.3 2.5-3 2.5h-3Z" stroke={c} strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function StoreIcon({ active }: { active: boolean }) {
  const c = iconColor(active);
  return (
    <svg width={24} height={24} viewBox="0 0 24 24" fill="none">
      <path d="M4 10.5V20a.5.5 0 0 0 .5.5h15a.5.5 0 0 0 .5-.5v-9.5" stroke={c} strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M3.6 4.5h16.8l1.1 4.2a2.2 2.2 0 0 1-4.3.8 2.2 2.2 0 0 1-4.3 0 2.2 2.2 0 0 1-4.3 0 2.2 2.2 0 0 1-4.3-.8L3.6 4.5Z" stroke={c} strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M9.5 20.5v-5h5v5" stroke={c} strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function PlusIcon({ active }: { active: boolean }) {
  const c = iconColor(active);
  return (
    <svg width={24} height={24} viewBox="0 0 24 24" fill="none">
      <rect x="3.5" y="3.5" width="17" height="17" rx="4.5" stroke={c} strokeWidth="1.6" />
      <path d="M12 8.5v7M8.5 12h7" stroke={c} strokeWidth="1.6" strokeLinecap="round" />
    </svg>
  );
}

/* ------------------------------------------------------------------ styles */

// Height comes from `App`, which divides 100dvh back out of the zoom factor.
const appFrame: CSSProperties = {
  position: 'relative',
  width: DESIGN_WIDTH,
  // The canvas is sized by `zoom`, never by the parent: as a flex item it would
  // otherwise be shrunk below 375 design px on a narrow viewport, squeezing the
  // layout on top of the scale.
  flexShrink: 0,
  margin: '0 auto',
  display: 'flex',
  flexDirection: 'column',
  overflow: 'hidden',
  backgroundColor: colour.surface.tertiary,
  boxShadow: '0 12px 40px rgba(16, 22, 40, 0.16)',
};

const scrollArea: CSSProperties = {
  flex: '1 1 0',
  minHeight: 0,
  width: '100%',
  position: 'relative',
  overflowY: 'auto',
  overflowX: 'hidden',
  // NB: intentionally no `transform` here. A transform would make each flow's
  // `position: fixed` chrome relative to this box — which breaks the hero's
  // minimised sticky bar (it would scroll away instead of pinning). Instead we
  // let fixed chrome be viewport-relative; full-screen sheets/overlays cover the
  // tab bar (immersive), the sticky footers stick within this scroller, and the
  // Gifter floating cart is lifted above the nav via `floatingCartBottom`.
  WebkitOverflowScrolling: 'touch',
  scrollbarWidth: 'none',
};

const navBar: CSSProperties = {
  flexShrink: 0,
  display: 'flex',
  flexDirection: 'row',
  alignItems: 'stretch',
  width: '100%',
  height: NAV_H,
  backgroundColor: colour.surface.primary,
  borderTop: `1px solid ${colour.border.subtle}`,
  boxShadow: '0 -4px 16px rgba(16, 22, 40, 0.06)',
  boxSizing: 'border-box',
  paddingInline: space[8],
  // Below the flows' full-screen overlays (cart/checkout/sheets, z 40–60) so
  // those are immersive; the tab bar is a normal flex row so nothing else
  // overlaps it.
  zIndex: 5,
};

const navItem: CSSProperties = {
  flex: '1 1 0',
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center',
  gap: space[4],
  border: 'none',
  background: 'transparent',
  cursor: 'pointer',
  padding: 0,
  userSelect: 'none',
};

const navLabel: CSSProperties = {
  fontSize: 11,
  lineHeight: '14px',
  letterSpacing: -0.1,
  whiteSpace: 'nowrap',
};
