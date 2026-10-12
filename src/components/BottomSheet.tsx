import { useEffect, useRef, useState, type CSSProperties, type ReactNode, type AnimationEvent as ReactAnimationEvent } from 'react';
import { colour, space, radius } from '../field-ds';

// Enter: slides up, eases in-out, overshoots a touch then settles (slight bounce).
// Exit: slides straight down, eases out, no bounce. Scrim cross-fades to match.
const SHEET_KEYFRAMES = `
@keyframes gld-sheet-in {
  0% { transform: translateY(100%); }
  70% { transform: translateY(-1.8%); }
  100% { transform: translateY(0); }
}
@keyframes gld-sheet-out {
  0% { transform: translateY(0); }
  100% { transform: translateY(100%); }
}
@keyframes gld-scrim-in { 0% { opacity: 0; } 100% { opacity: 1; } }
@keyframes gld-scrim-out { 0% { opacity: 1; } 100% { opacity: 0; } }
`;

export interface BottomSheetProps {
  open: boolean;
  onClose: () => void;
  children: ReactNode;
  /**
   * Positioning strategy. "absolute" (default) pins the sheet to the bottom of
   * the nearest positioned ancestor — use inside a fixed-height phone frame.
   * "fixed" pins it to the viewport bottom (centred to the 375px phone width) —
   * use on tall, scrollable screens where the CTA lives far below the fold.
   */
  fixed?: boolean;
  /**
   * Overrides the overlay stacking order. Defaults to 30 (fixed) / 3 (absolute).
   * Raise it when the sheet must sit above another full-screen overlay — e.g.
   * a confirmation shown on top of the product-explorer carousel.
   */
  zIndex?: number;
}

/**
 * iOS-style bottom sheet: scrim + slide-in-with-bounce / slide-out chrome shared
 * by the calendar, address and share sheets. Stays mounted while animating out
 * (driven by `closing` + `onAnimationEnd`) so the exit animation can play before
 * unmount.
 */
export function BottomSheet({ open, onClose, children, fixed = false, zIndex }: BottomSheetProps) {
  const [mounted, setMounted] = useState(open);
  const [closing, setClosing] = useState(false);
  // Mirror `mounted` into a ref so the close effect can read the latest value
  // without listing it as a dependency (and without a setState-inside-updater).
  const mountedRef = useRef(open);
  mountedRef.current = mounted;

  useEffect(() => {
    if (open) {
      setMounted(true);
      setClosing(false);
      return;
    }
    // Closing: only act if we were actually mounted.
    if (!mountedRef.current) return;
    setClosing(true);
    // Fallback: some environments (backgrounded tabs, reduced-motion, missed
    // events) throttle or drop CSS `animationend`, which would leave the sheet
    // stuck open. Unmount deterministically after the exit duration so the
    // slide-out can't hang — whichever of this timer or `onAnimationEnd` fires
    // first wins; the other becomes a harmless no-op.
    const t = window.setTimeout(() => {
      setMounted(false);
      setClosing(false);
    }, 320);
    return () => window.clearTimeout(t);
  }, [open]);

  if (!mounted) return null;

  const onSheetAnimEnd = (e: ReactAnimationEvent<HTMLDivElement>) => {
    // Ignore animationend events bubbling up from sheet content.
    if (e.target !== e.currentTarget) return;
    if (closing) {
      setMounted(false);
      setClosing(false);
    }
  };

  const overlayStyle: CSSProperties = fixed
    ? {
        position: 'fixed',
        top: 0,
        bottom: 0,
        left: '50%',
        transform: 'translateX(-50%)',
        width: 375,
        zIndex: zIndex ?? 30,
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'flex-end',
      }
    : {
        position: 'absolute',
        inset: 0,
        zIndex: zIndex ?? 3,
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'flex-end',
      };

  return (
    <div style={overlayStyle}>
      <style>{SHEET_KEYFRAMES}</style>

      {/* Scrim */}
      <div
        onClick={onClose}
        style={{
          position: 'absolute',
          inset: 0,
          backgroundColor: 'rgba(17, 21, 33, 0.5)',
          animation: `${closing ? 'gld-scrim-out 240ms ease-out' : 'gld-scrim-in 560ms ease-in-out'} both`,
        }}
      />

      {/* Sheet */}
      <div
        onAnimationEnd={onSheetAnimEnd}
        style={{
          position: 'relative',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: space[4],
          width: '100%',
          animation: `${closing ? 'gld-sheet-out 240ms ease-out' : 'gld-sheet-in 580ms ease-in-out'} both`,
        }}
      >
        {/* Grabber */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', paddingBlock: space[12], width: '100%' }}>
          <div style={{ width: 36, height: 4, borderRadius: radius.rounded, backgroundColor: colour.surface.primary }} />
        </div>

        {children}

        {/* iOS home indicator */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: 34, width: '100%' }}>
          <div style={{ width: 134, height: 5, borderRadius: 100, backgroundColor: colour.surface.primary, marginTop: 21 }} />
        </div>
      </div>
    </div>
  );
}
