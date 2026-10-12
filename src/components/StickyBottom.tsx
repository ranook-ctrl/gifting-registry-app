import type { CSSProperties, ReactNode } from 'react';
import { colour, space, radius } from '../field-ds';

export interface StickyBottomProps {
  className?: string;
  /** CTA label. */
  label?: string;
  /** Fired when the button is pressed. */
  onPress?: () => void;
  /** Disables the button. */
  disabled?: boolean;
  /** Shows a spinner and hides the label; size is preserved to avoid layout shift. */
  loading?: boolean;
  /** Optional leading adornment (Field DS icon node). */
  iconLeft?: ReactNode;
  /** Optional trailing adornment (Field DS icon node). */
  iconRight?: ReactNode;
}

const ff = (family: string) => `${family}, 'SF Pro Text', system-ui, sans-serif`;

// A17/SemiBold — the Field DS action type token used by M-PrimaryButton (H56).
const a17SemiBold: CSSProperties = {
  fontFamily: ff('Noontree-SemiBold'),
  fontWeight: 600,
  fontSize: 17,
  lineHeight: '24px',
  letterSpacing: -0.25,
};

function Spinner() {
  return (
    <span
      aria-hidden
      style={{
        width: 20,
        height: 20,
        borderRadius: radius.rounded,
        border: `2px solid ${colour['text-n-icon']['on-surface-subtle']}`,
        borderTopColor: colour['text-n-icon']['on-surface-bold'],
        animation: 'sticky-bottom-spin 0.7s linear infinite',
      }}
    />
  );
}

export function StickyBottom({
  className,
  label = 'Create Registry',
  onPress,
  disabled = false,
  loading = false,
  iconLeft,
  iconRight,
}: StickyBottomProps) {
  const interactive = !disabled && !loading;

  return (
    <div
      className={className}
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'flex-start',
        width: 375,
        paddingTop: space[48],
        paddingBottom: space[16],
        paddingInline: space[16],
        boxSizing: 'border-box',
        // Vertical fade: transparent → surface/tertiary, solid by 24.219%.
        background: `linear-gradient(to bottom, rgba(242,243,247,0) 0%, ${colour.surface.tertiary} 24.219%)`,
      }}
    >
      <style>{'@keyframes sticky-bottom-spin{to{transform:rotate(360deg)}}'}</style>
      <button
        type="button"
        onClick={interactive ? onPress : undefined}
        disabled={!interactive}
        aria-busy={loading || undefined}
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: space[8],
          width: '100%',
          minHeight: 56,
          maxHeight: 56,
          paddingInline: space[24],
          paddingBlock: space[16],
          border: 'none',
          borderRadius: radius[12],
          // Disabled swaps to Field DS muted surface + muted label (not a faded
          // blue), matching M-PrimaryButton's disabled state.
          backgroundColor: disabled ? colour.surface.muted : colour.surface['action-bold'],
          color: disabled ? colour['text-n-icon'].muted : colour['text-n-icon']['on-surface-bold'],
          cursor: interactive && onPress ? 'pointer' : 'default',
          boxSizing: 'border-box',
        }}
      >
        {loading ? (
          <Spinner />
        ) : (
          <>
            {iconLeft}
            <span style={{ ...a17SemiBold, whiteSpace: 'nowrap', wordBreak: 'break-word' }}>{label}</span>
            {iconRight}
          </>
        )}
      </button>
    </div>
  );
}
