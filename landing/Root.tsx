import { useEffect, useState, type CSSProperties } from 'react';
import { App } from './App';
import { GifterRegistryWeb } from '../src/components/dweb';

/**
 * Entry router for the Gifting Registry prototype.
 *
 * Two views ship from one build, because they're two renderings of the same
 * product and reviewers need to flip between them:
 *
 *   /            → the mobile app (a 375pt phone frame, scaled — see App.tsx)
 *   /dweb        → the desktop web gifter flow, full-bleed in noon.com chrome
 *
 * `?view=mweb|dweb` overrides the path, which is what the floating switcher uses
 * so it works on hosts that don't rewrite unknown paths to index.html.
 */
type View = 'mweb' | 'dweb';

function readView(): View {
  const params = new URLSearchParams(window.location.search);
  const q = params.get('view');
  if (q === 'dweb' || q === 'mweb') return q;
  return window.location.pathname.replace(/\/+$/, '').endsWith('/dweb') ? 'dweb' : 'mweb';
}

export function Root() {
  const [view, setView] = useState<View>(readView);

  // Keep the view in sync with Back/Forward.
  useEffect(() => {
    const onPop = () => setView(readView());
    window.addEventListener('popstate', onPop);
    return () => window.removeEventListener('popstate', onPop);
  }, []);

  // Per-view document setup. Two things differ, and both have to be undone when
  // switching back:
  //
  //  1. Background — the phone frame sits on a grey desk, the desktop site fills
  //     the window.
  //  2. Page scrolling. Two global rules exist for the phone frame's benefit:
  //     `wishlist/wishlist.css` pins `html, body, #root { height: 100% }`, and
  //     index.html sets `overflow-x: hidden` on body (which makes body its own
  //     scrollport). Together they cap the document at one viewport — fine for
  //     the mobile view, where the frame is exactly 100dvh and each flow scrolls
  //     internally, but it leaves the desktop page unable to scroll at all. So
  //     dWeb releases the height cap and hands scrolling back to the viewport.
  useEffect(() => {
    const { body } = document;
    const root = document.getElementById('root');
    const prev = {
      background: body.style.background,
      overflow: body.style.overflow,
      height: root?.style.height ?? '',
      minHeight: root?.style.minHeight ?? '',
    };

    if (view === 'dweb') {
      body.style.background = '#ffffff';
      body.style.overflow = 'visible';
      if (root) {
        root.style.height = 'auto';
        root.style.minHeight = '100dvh';
      }
    } else {
      body.style.background = '#e9eaf0';
    }

    return () => {
      body.style.background = prev.background;
      body.style.overflow = prev.overflow;
      if (root) {
        root.style.height = prev.height;
        root.style.minHeight = prev.minHeight;
      }
    };
  }, [view]);

  const go = (next: View) => {
    const url = next === 'dweb' ? '/dweb' : '/';
    window.history.pushState({}, '', url);
    setView(next);
    window.scrollTo({ top: 0, left: 0 });
  };

  return (
    <>
      {view === 'dweb' ? (
        <GifterRegistryWeb />
      ) : (
        <div style={phoneDesk}>
          <App />
        </div>
      )}

      <ViewSwitcher view={view} onChange={go} />
    </>
  );
}

/**
 * Floating mWeb/dWeb toggle. A review affordance, not product chrome, so it has
 * to stay out of the way of both views' own bottom chrome. Bottom-left clears
 * the mobile flow's floating gift-bag pill (bottom-centre) and the desktop
 * drawer (right edge); on mobile it also has to sit *above* the 64px tab bar,
 * which it would otherwise cover.
 */
function ViewSwitcher({ view, onChange }: { view: View; onChange: (v: View) => void }) {
  return (
    <div
      style={{ ...switcher, bottom: view === 'mweb' ? 76 : 16 }}
      role="group"
      aria-label="Prototype view"
    >
      {(
        [
          { id: 'mweb', label: 'Mobile' },
          { id: 'dweb', label: 'Desktop' },
        ] as { id: View; label: string }[]
      ).map((opt) => {
        const on = opt.id === view;
        return (
          <button
            key={opt.id}
            type="button"
            aria-pressed={on}
            onClick={() => onChange(opt.id)}
            style={{
              ...switchBtn,
              backgroundColor: on ? '#0f61ff' : 'transparent',
              color: on ? '#ffffff' : '#475067',
            }}
          >
            {opt.label}
          </button>
        );
      })}
    </div>
  );
}

/* ------------------------------------------------------------------ styles */

const phoneDesk: CSSProperties = {
  minHeight: '100dvh',
  display: 'flex',
  justifyContent: 'center',
  background: '#e9eaf0',
};

const switcher: CSSProperties = {
  position: 'fixed',
  bottom: 16,
  left: 16,
  // Above the page and the sticky masthead, below full-screen overlays (40+)
  // so a dialog is never fighting the switcher for the same pixels.
  zIndex: 30,
  display: 'flex',
  gap: 2,
  padding: 3,
  borderRadius: 999,
  background: 'rgba(255,255,255,0.92)',
  border: '1px solid #eaecf0',
  boxShadow: '0 4px 16px rgba(16,22,40,0.16)',
  backdropFilter: 'blur(8px)',
  WebkitBackdropFilter: 'blur(8px)',
};

const switchBtn: CSSProperties = {
  border: 'none',
  borderRadius: 999,
  padding: '6px 14px',
  cursor: 'pointer',
  fontFamily: 'Noontree-SemiBold, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
  fontWeight: 600,
  fontSize: 12,
  lineHeight: '16px',
  letterSpacing: -0.1,
};
