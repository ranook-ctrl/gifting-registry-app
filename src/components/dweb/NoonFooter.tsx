import type { CSSProperties } from 'react';
import { colour, space, type, SITE_WIDTH, SITE_GUTTER } from './_shared';

const COLUMNS: { title: string; links: string[] }[] = [
  { title: 'Let us help you', links: ['Your account', 'Track your order', 'Returns', 'Shipping rates & policies', 'Help centre'] },
  { title: 'About noon', links: ['Careers', 'Warranty policy', 'Sell with us', 'Terms of use', 'Privacy policy'] },
  { title: 'Make money with us', links: ['Sell on noon', 'Become a sales partner', 'Fulfilment by noon', 'Warehouse deals'] },
];

export interface NoonFooterProps {
  /** Country / language strip label. */
  region?: string;
}

/**
 * Trimmed noon.com desktop footer. Its job is to close the page so the registry
 * reads as a real noon surface rather than a floating prototype — the links are
 * inert, so this stays deliberately short rather than mirroring every column.
 */
export function NoonFooter({ region = 'United Arab Emirates | English' }: NoonFooterProps) {
  return (
    <footer style={root}>
      <div style={inner}>
        <div style={columns}>
          {COLUMNS.map((col) => (
            <div key={col.title} style={{ display: 'flex', flexDirection: 'column', gap: space[10] }}>
              <span style={{ ...type.b14Semi, color: colour['text-n-icon']['on-surface-bold'] }}>{col.title}</span>
              {col.links.map((l) => (
                <span key={l} style={{ ...type.b14Reg, color: colour['text-n-icon']['on-surface-subtle'], cursor: 'pointer' }}>
                  {l}
                </span>
              ))}
            </div>
          ))}

          <div style={{ display: 'flex', flexDirection: 'column', gap: space[10] }}>
            <span style={{ ...type.b14Semi, color: colour['text-n-icon']['on-surface-bold'] }}>Shop on the go</span>
            <span style={{ ...type.b14Reg, color: colour['text-n-icon']['on-surface-subtle'] }}>
              Download the noon app for gift lists, live tracking and express delivery.
            </span>
          </div>
        </div>

        <div style={rule} />

        <div style={bottomRow}>
          <span style={{ ...type.b14Reg, color: colour['text-n-icon']['on-surface-subtle'] }}>{region}</span>
          <span style={{ ...type.b14Reg, color: colour['text-n-icon']['on-surface-subtle'] }}>
            © noon. All Rights Reserved.
          </span>
        </div>
      </div>
    </footer>
  );
}

/* ------------------------------------------------------------------ styles */

const root: CSSProperties = {
  width: '100%',
  marginTop: 'auto',
  backgroundColor: colour.surface['primary-inverted'],
  display: 'flex',
  justifyContent: 'center',
};

const inner: CSSProperties = {
  width: '100%',
  maxWidth: SITE_WIDTH,
  paddingInline: SITE_GUTTER,
  paddingBlock: space[40],
  boxSizing: 'border-box',
  display: 'flex',
  flexDirection: 'column',
  gap: space[28],
};

const columns: CSSProperties = {
  display: 'grid',
  gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
  gap: space[32],
};

const rule: CSSProperties = {
  height: 1,
  width: '100%',
  backgroundColor: colour.surface['tertiary-inverted'],
};

const bottomRow: CSSProperties = {
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  gap: space[16],
  flexWrap: 'wrap',
};
