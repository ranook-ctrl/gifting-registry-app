import { useEffect, useRef, useState, type CSSProperties, type ReactNode } from 'react';
import { colour, space, radius, type, OVERLAY_SHADOW, EASE } from './_shared';
import { CloseIcon } from './icons';

export interface WebDialogProps {
  open: boolean;
  onClose: () => void;
  children: ReactNode;
  /** Heading rendered in the dialog's title bar; omit for a chrome-less dialog. */
  title?: string;
  /** Max width of the panel. Defaults to 520 (a confirmation-sized dialog). */
  width?: number;
  /** `'centre'` for a modal card, `'end'` for a right-edge drawer. */
  placement?: 'centre' | 'end';
  /** Hides the close button — for dialogs that must be answered. */
  hideClose?: boolean;
  /** Extra styles merged onto the panel. */
  panelStyle?: CSSProperties;
  label?: string;
}

/* ------------------------------------------------------- background scroll */

// Reference-counted, module-level scroll lock.
//
// A per-instance save/restore leaks as soon as one dialog opens on top of
// another (quick view → "mark as purchased"): the inner dialog captures the
// outer one's `overflow: hidden` as the value to restore, so whichever unmounts
// last can leave the page permanently frozen. Counting instead means the lock is
// applied on the first dialog and released only when the last one closes.
let lockCount = 0;
let saved: { overflow: string; padding: string } | null = null;

function acquireScrollLock(): () => void {
  const { body, documentElement: html } = document;
  if (lockCount === 0) {
    // Compensate for the scrollbar so the page behind doesn't shift sideways.
    const gap = window.innerWidth - html.clientWidth;
    saved = { overflow: body.style.overflow, padding: body.style.paddingInlineEnd };
    body.style.overflow = 'hidden';
    if (gap > 0) body.style.paddingInlineEnd = `${gap}px`;
  }
  lockCount += 1;

  let released = false;
  return () => {
    // Guard against a double release (StrictMode re-runs effect cleanups).
    if (released) return;
    released = true;
    lockCount = Math.max(0, lockCount - 1);
    if (lockCount === 0 && saved) {
      body.style.overflow = saved.overflow;
      body.style.paddingInlineEnd = saved.padding;
      saved = null;
    }
  };
}

const KEYFRAMES = `
@keyframes dw-scrim-in { from { opacity: 0 } to { opacity: 1 } }
@keyframes dw-scrim-out { from { opacity: 1 } to { opacity: 0 } }
@keyframes dw-centre-in {
  from { opacity: 0; transform: translateY(12px) scale(0.985) }
  to { opacity: 1; transform: translateY(0) scale(1) }
}
@keyframes dw-centre-out {
  from { opacity: 1; transform: translateY(0) scale(1) }
  to { opacity: 0; transform: translateY(8px) scale(0.99) }
}
@keyframes dw-end-in { from { transform: translateX(100%) } to { transform: translateX(0) } }
@keyframes dw-end-out { from { transform: translateX(0) } to { transform: translateX(100%) } }
`;

/**
 * Modal primitive for the dWeb registry — the desktop stand-in for the mobile
 * ../BottomSheet.tsx.
 *
 * Deliberately *not* a bottom sheet: a sheet's grabber handle and iOS home
 * indicator are touch affordances that read as broken with a mouse. Instead
 * `placement="centre"` gives a centred card (confirmations, address picker,
 * quick view) and `placement="end"` gives a right-edge drawer (the gift bag).
 *
 * Both share the sheet's lifecycle contract, so callers swap one for the other:
 * a plain `open` boolean, stays mounted through its exit animation, closes on
 * scrim click and Escape, and locks background scroll while open.
 */
export function WebDialog({
  open,
  onClose,
  children,
  title,
  width = 520,
  placement = 'centre',
  hideClose,
  panelStyle,
  label,
}: WebDialogProps) {
  const [mounted, setMounted] = useState(open);
  const [closing, setClosing] = useState(false);
  const panelRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (open) {
      setMounted(true);
      setClosing(false);
    } else {
      setMounted((was) => {
        if (was) setClosing(true);
        return was;
      });
    }
  }, [open]);

  // Deterministic unmount: animationend can be missed if the tab is backgrounded
  // mid-transition, which would leave a dead scrim over the page.
  useEffect(() => {
    if (!closing) return;
    const t = window.setTimeout(() => {
      setMounted(false);
      setClosing(false);
    }, 320);
    return () => window.clearTimeout(t);
  }, [closing]);

  useEffect(() => {
    if (!mounted || closing) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [mounted, closing, onClose]);

  // Lock background scroll, compensating for the scrollbar so the page behind
  // doesn't shift horizontally as it disappears.
  useEffect(() => {
    if (!mounted) return;
    return acquireScrollLock();
  }, [mounted]);

  // Move focus into the panel so Tab stays in the dialog and Escape is live.
  useEffect(() => {
    if (mounted && !closing) panelRef.current?.focus();
  }, [mounted, closing]);

  if (!mounted) return null;

  const isDrawer = placement === 'end';
  const anim = isDrawer
    ? closing
      ? `dw-end-out 240ms ${EASE} both`
      : `dw-end-in 320ms ${EASE} both`
    : closing
      ? `dw-centre-out 180ms ${EASE} both`
      : `dw-centre-in 260ms ${EASE} both`;

  return (
    <div
      style={{
        ...scrim,
        alignItems: isDrawer ? 'stretch' : 'center',
        justifyContent: isDrawer ? 'flex-end' : 'center',
        animation: closing ? `dw-scrim-out 200ms ${EASE} both` : `dw-scrim-in 200ms ${EASE} both`,
      }}
      onClick={onClose}
    >
      <style>{KEYFRAMES}</style>

      <div
        ref={panelRef}
        role="dialog"
        aria-modal
        aria-label={label ?? title}
        tabIndex={-1}
        onClick={(e) => e.stopPropagation()}
        style={{
          ...panel,
          ...(isDrawer ? drawerPanel : centrePanel),
          width: isDrawer ? width : '100%',
          maxWidth: width,
          animation: anim,
          ...panelStyle,
        }}
      >
        {/* With a title, the close button lives in a title bar. Without one it
            floats over the content — an empty bar just to hold an X reads as a
            rendering bug (and it costs the quick view 56px of gallery). */}
        {title ? (
          <div style={titleBar}>
            <span style={{ ...type.h18, color: colour['text-n-icon'].primary }}>{title}</span>
            {!hideClose && (
              <button type="button" aria-label="Close" onClick={onClose} style={closeBtn}>
                <CloseIcon size={20} />
              </button>
            )}
          </div>
        ) : (
          !hideClose && (
            <button type="button" aria-label="Close" onClick={onClose} style={{ ...closeBtn, ...floatingClose }}>
              <CloseIcon size={20} />
            </button>
          )
        )}
        {children}
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ styles */

const scrim: CSSProperties = {
  position: 'fixed',
  inset: 0,
  // Above the sticky masthead (20); the checkout page sits at 30, so dialogs
  // opened from it still land on top.
  zIndex: 40,
  display: 'flex',
  padding: space[24],
  boxSizing: 'border-box',
  backgroundColor: 'rgba(16, 22, 40, 0.55)',
  backdropFilter: 'blur(2px)',
  WebkitBackdropFilter: 'blur(2px)',
  overflowY: 'auto',
};

const panel: CSSProperties = {
  position: 'relative',
  display: 'flex',
  flexDirection: 'column',
  backgroundColor: colour.surface.primary,
  boxShadow: OVERLAY_SHADOW,
  boxSizing: 'border-box',
  outline: 'none',
};

const centrePanel: CSSProperties = {
  borderRadius: radius[20],
  maxHeight: '100%',
  overflow: 'hidden',
};

const drawerPanel: CSSProperties = {
  // Full-height flush drawer: cancel the scrim's padding on the trailing edge.
  margin: `${-space[24]}px ${-space[24]}px ${-space[24]}px 0`,
  height: 'auto',
  minHeight: '100vh',
  borderStartStartRadius: radius[20],
  borderEndStartRadius: radius[20],
};

const titleBar: CSSProperties = {
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  gap: space[16],
  padding: `${space[16]}px ${space[20]}px`,
  borderBottom: `1px solid ${colour.border.primary}`,
  flexShrink: 0,
};

const closeBtn: CSSProperties = {
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  width: 32,
  height: 32,
  borderRadius: radius.rounded,
  border: 'none',
  backgroundColor: colour.surface.tertiary,
  cursor: 'pointer',
  padding: 0,
  flexShrink: 0,
};

const floatingClose: CSSProperties = {
  position: 'absolute',
  top: space[14],
  insetInlineEnd: space[14],
  // Above the panel's own content (the quick view's gallery sits at the default
  // stacking level).
  zIndex: 2,
  width: 34,
  height: 34,
  backgroundColor: colour.surface.primary,
  boxShadow: '0 2px 8px rgba(16, 22, 40, 0.16)',
};
