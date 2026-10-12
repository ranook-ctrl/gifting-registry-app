import React from 'react';
import { colors, type, font } from './_shared';
import { ChevronLeftIcon, PreferencesIcon } from './icons';
import { PhoneHeader } from './PhoneHeader';
import { PageTitle } from './PageTitle';

export interface PageHeaderProps {
  title?: string;
  /** Optional secondary line under the title (B12/Regular, secondary). */
  subtitle?: string;
  /**
   * Layout variant. "default" is the 375×56 nav bar. "creator" composes the iOS
   * status bar + a back/preferences nav row + the centred occasion PageTitle
   * (title • date • countdown) — the shared creator-screen header.
   */
  variant?: 'default' | 'creator';
  /**
   * "Title-Center" layout: centred B16/SemiBold title, back button, and an
   * invisible trailing spacer so the title stays optically centred. Matches the
   * Figma M-PageHeader Type=Title-Center. Default (false) keeps the original
   * left-aligned title + visible preferences action.
   */
  centered?: boolean;
  /**
   * Show the trailing preferences action. When false the slot stays present but
   * invisible so the title/subtitle column keeps its width (Figma empty slot).
   */
  showAction?: boolean;
  /** Fired when the back button is tapped. */
  onBack?: () => void;
  /** Fired when the trailing preferences button is tapped. */
  onPreferences?: () => void;
  /** Status-bar time (creator variant). */
  time?: string;
  /** Occasion date, e.g. "14th June" (creator variant). */
  date?: string;
  /** Countdown label, e.g. "20 days to go!" (creator variant). */
  countdown?: string;
}

/**
 * "Page Header" — 375×56 nav bar: circular back button, title, circular action.
 * With `variant="creator"` it becomes the full creator-screen header stack:
 * status bar + nav row + occasion PageTitle.
 */
export function PageHeader({
  title = 'Page title',
  subtitle,
  variant = 'default',
  centered = false,
  showAction = true,
  onBack,
  onPreferences,
  time,
  date,
  countdown,
}: PageHeaderProps) {
  if (variant === 'creator') {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', width: '100%' }}>
        <PhoneHeader time={time} />
        <div style={{ ...bar, marginTop: 6 }}>
          <div
            role={onBack ? 'button' : undefined}
            aria-label={onBack ? 'Back' : undefined}
            onClick={onBack}
            style={{ ...circle, cursor: onBack ? 'pointer' : 'default' }}
          >
            <ChevronLeftIcon size={20} />
          </div>
          <div style={{ flex: 1 }} />
          <div
            role={onPreferences ? 'button' : undefined}
            aria-label={onPreferences ? 'Preferences' : undefined}
            onClick={onPreferences}
            style={{ ...circle, cursor: onPreferences ? 'pointer' : 'default' }}
          >
            <PreferencesIcon size={20} />
          </div>
        </div>
        <div style={{ marginTop: 20 }}>
          <PageTitle title={title} date={date} countdown={countdown} />
        </div>
      </div>
    );
  }

  const actionHidden = centered || !showAction;
  return (
    <div style={bar}>
      <div
        role={onBack ? 'button' : undefined}
        aria-label={onBack ? 'Back' : undefined}
        onClick={onBack}
        style={{ ...circle, cursor: onBack ? 'pointer' : 'default' }}
      >
        <ChevronLeftIcon size={20} />
      </div>
      <div style={centered ? contentCentered : content}>
        <span style={centered ? titleCentered : titleStyle}>{title}</span>
        {!centered && subtitle && <span style={subtitleStyle}>{subtitle}</span>}
      </div>
      {/* Trailing slot: present but invisible when centred or action hidden, to balance the row. */}
      <div
        role={!actionHidden && onPreferences ? 'button' : undefined}
        aria-label={!actionHidden && onPreferences ? 'Preferences' : undefined}
        onClick={actionHidden ? undefined : onPreferences}
        style={
          actionHidden
            ? { ...circle, opacity: 0, pointerEvents: 'none' }
            : { ...circle, cursor: onPreferences ? 'pointer' : 'default' }
        }
      >
        <PreferencesIcon size={20} />
      </div>
    </div>
  );
}

const bar: React.CSSProperties = {
  width: 375,
  height: 56,
  display: 'flex',
  flexDirection: 'row',
  alignItems: 'center',
  paddingLeft: 16,
  paddingRight: 16,
  paddingTop: 8,
  paddingBottom: 8,
  gap: 4,
  boxSizing: 'border-box',
};
const circle: React.CSSProperties = {
  width: 40,
  height: 40,
  borderRadius: 9999,
  backgroundColor: colors.surface.primary,
  border: `1px solid ${colors.border.subtle}`,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  flexShrink: 0,
  boxSizing: 'border-box',
};
const content: React.CSSProperties = {
  flex: 1,
  minWidth: 0,
  paddingLeft: 8,
  paddingRight: 4,
  display: 'flex',
  flexDirection: 'column',
  gap: 2,
};
const titleStyle: React.CSSProperties = {
  ...type.h16Bold,
  color: colors.text.primary,
  display: 'block',
  overflow: 'hidden',
  textOverflow: 'ellipsis',
  whiteSpace: 'nowrap',
};
// B12/Regular secondary — the occasion subtitle, e.g. "Eidii 2026".
const subtitleStyle: React.CSSProperties = {
  fontFamily: font.regular,
  fontWeight: 400,
  fontSize: 12,
  lineHeight: '18px',
  letterSpacing: -0.1,
  color: colors.text.secondary,
  display: 'block',
  overflow: 'hidden',
  textOverflow: 'ellipsis',
  whiteSpace: 'nowrap',
};

const contentCentered: React.CSSProperties = {
  flex: 1,
  minWidth: 0,
  height: '100%',
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center',
  overflow: 'hidden',
};
// B16/SemiBold — 16/22, -0.15 tracking (Figma Title-Center title token).
const titleCentered: React.CSSProperties = {
  fontFamily: font.semibold,
  fontWeight: 600,
  fontSize: 16,
  lineHeight: '22px',
  letterSpacing: -0.15,
  color: colors.text.primary,
  textAlign: 'center',
  width: '100%',
};
