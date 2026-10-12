import { useLayoutEffect, useState } from 'react';

/**
 * Viewport scaling for the Gifting Registry shell.
 *
 * Every screen in this repo is laid out against a fixed 375pt Figma canvas —
 * `width: 375` is hard-coded in ~15 components, and all floating chrome
 * (bottom sheets, the Gifter cart, skeleton overlays) is pinned with
 * `position: fixed; left: 50%; translateX(-50%); width: 375`. Reflowing all of
 * that fluidly would be a rewrite, so instead we keep the canvas and scale it
 * to the device: shrink it on a 320pt iPhone SE, grow it on a 430pt Pro Max.
 *
 * ## Why `zoom` and not `transform: scale()`
 *
 * `transform` establishes a containing block for `position: fixed`
 * descendants, which would re-anchor every one of those overlays to the frame
 * and break the hero's pinned sticky bar (see the note in `App.tsx`). `zoom`
 * re-runs layout at the scaled size instead: fixed chrome stays
 * viewport-relative and text rasterises crisply rather than being resampled.
 *
 * Because the scaled frame is exactly as wide as the viewport, "centred on the
 * viewport" and "centred on the frame" coincide — the existing `left: 50%`
 * chrome lands correctly with no per-component change.
 *
 * Unsupported in Firefox < 126, where the frame simply renders unscaled at
 * 375 — the behaviour we had before this module.
 */

/** The reference canvas every screen is designed against. */
export const DESIGN_WIDTH = 375;

/** Floor: below a ~262pt viewport, legibility beats edge-to-edge fit. */
const MIN_SCALE = 0.7;

/**
 * Ceiling: a 431pt phone (iPhone 16 Pro Max class). Anything wider — tablet,
 * unfolded foldable, desktop — is not a phone, so it gets a centred frame with
 * gutters instead of a blown-up one.
 */
const MAX_SCALE = 431 / DESIGN_WIDTH;

export interface DeviceScale {
  /** Multiplier to apply as `zoom` on the phone frame. */
  scale: number;
  /**
   * Bottom safe-area inset (home indicator), expressed in *design* px — i.e.
   * already divided by `scale`, so it can be used directly in the canvas's
   * coordinate space alongside the hard-coded 375-based values.
   */
  safeBottom: number;
}

/**
 * Layout-viewport width. `documentElement.clientWidth` excludes the desktop
 * scrollbar (unlike `innerWidth`), and ignores pinch-zoom (unlike
 * `visualViewport`) so pinching doesn't re-lay-out the app.
 */
function viewportWidth(): number {
  return document.documentElement.clientWidth || window.innerWidth || DESIGN_WIDTH;
}

function measureScale(): number {
  const raw = viewportWidth() / DESIGN_WIDTH;
  const clamped = Math.min(MAX_SCALE, Math.max(MIN_SCALE, raw));
  // Floor rather than round: the scaled frame must never exceed the viewport,
  // or a sub-pixel overhang gives the page a horizontal scrollbar.
  return Math.floor(clamped * 1000) / 1000;
}

/**
 * `env()` is only readable from CSS, so measure it with a throwaway probe.
 * Returns real px — callers divide by `scale` to get design px.
 */
function measureSafeBottom(): number {
  const probe = document.createElement('div');
  probe.style.cssText =
    'position:fixed;left:0;bottom:0;width:0;visibility:hidden;pointer-events:none;' +
    'height:env(safe-area-inset-bottom,0px);';
  document.body.appendChild(probe);
  const height = probe.getBoundingClientRect().height;
  probe.remove();
  return height;
}

function measure(): DeviceScale {
  const scale = measureScale();
  return { scale, safeBottom: measureSafeBottom() / scale };
}

/** Tracks the device scale across resize, rotation and browser-chrome changes. */
export function useDeviceScale(): DeviceScale {
  // Seed from the scale alone: it's a pure layout read, so the first render is
  // already at the right zoom. `safeBottom` needs a probe element and so can't
  // be measured here — mutating the DOM from a render React may discard is
  // unsafe — the layout effect below fills it in before the first paint.
  const [value, setValue] = useState<DeviceScale>(() =>
    typeof window === 'undefined' ? { scale: 1, safeBottom: 0 } : { scale: measureScale(), safeBottom: 0 }
  );

  // Layout, not passive: this runs before paint, so the nav never flashes at
  // the wrong height on a notched phone.
  useLayoutEffect(() => {
    const update = () =>
      setValue((prev) => {
        const next = measure();
        // Skip the re-render when nothing moved — these fire continuously on
        // mobile as the URL bar collapses.
        return prev.scale === next.scale && prev.safeBottom === next.safeBottom ? prev : next;
      });

    update();

    // Observe the root element rather than relying on `resize` alone: the
    // window event is skipped for some layout-viewport changes (notably
    // devtools device emulation), which strands the frame at a stale zoom.
    // ResizeObserver fires on every actual box change.
    const observer = new ResizeObserver(update);
    observer.observe(document.documentElement);

    // Still listen for these — orientation changes can alter the safe-area
    // insets without changing the root element's box.
    window.addEventListener('resize', update);
    window.addEventListener('orientationchange', update);
    return () => {
      observer.disconnect();
      window.removeEventListener('resize', update);
      window.removeEventListener('orientationchange', update);
    };
  }, []);

  return value;
}
