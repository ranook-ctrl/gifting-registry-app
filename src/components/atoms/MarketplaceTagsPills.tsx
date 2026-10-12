import React from 'react';
import { colors, radius } from './_shared';
import { ExpressLogo, SupermallLogo, MarketLogo, GlobalLogo } from './icons';

export type MarketplaceTag = 'express' | 'supermall' | 'market' | 'global';

const BG: Record<MarketplaceTag, string> = {
  express: colors.surface.brandPrimary, // base.colour.noon.400 #feee00
  supermall: '#2122b8', // base.colour.supermall.800
  market: '#d3efb6',
  global: '#f0ddff',
};

const LOGO: Record<MarketplaceTag, React.ReactNode> = {
  express: <ExpressLogo width={38.9} height={7.2} />,
  supermall: <SupermallLogo width={43.8} height={9.7} />,
  market: <MarketLogo width={41.9} height={8.5} />,
  global: <GlobalLogo width={39.7} height={11.5} />,
};

/**
 * "MarketplaceTagsPills" — a rounded brand pill (height 16) housing one of the
 * express / supermall / market / global wordmark logos.
 */
export function MarketplaceTagsPills({ tag = 'express' }: { tag?: MarketplaceTag }) {
  return (
    <div style={{ ...pill, backgroundColor: BG[tag] }}>{LOGO[tag]}</div>
  );
}

const pill: React.CSSProperties = {
  display: 'inline-flex',
  height: 16,
  paddingLeft: 6,
  paddingRight: 6,
  borderRadius: radius.rounded,
  alignItems: 'center',
  justifyContent: 'center',
  boxSizing: 'border-box',
};
