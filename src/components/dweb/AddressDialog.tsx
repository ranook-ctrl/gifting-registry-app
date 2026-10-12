import type { CSSProperties } from 'react';
import { colour, space, radius } from '../../field-ds';
import { type, font } from './_shared';
import { WebDialog } from './WebDialog';
import { GiftIcon, HomeIcon, PinIcon, ShieldIcon, PlusIcon } from './icons';

export type AddressKind = 'registry' | 'home' | 'work' | 'other';

export interface WebAddressItem {
  id: string;
  kind: AddressKind;
  title: string;
  address: string;
  /** Distance chip, e.g. "24 m". */
  distance?: string;
  contactName?: string;
  contactPhone?: string;
  /** Renders the blue privacy notice instead of the contact row. */
  privacyNote?: string;
}

/**
 * Default gifter address set — mirrors `GIFTER_ADDRESSES` in ../AddressSheet.tsx
 * so both views offer the same choices: ship to the host's private registry
 * address, or to one of your own.
 */
export const GIFTER_ADDRESSES: WebAddressItem[] = [
  {
    id: 'registry',
    kind: 'registry',
    title: 'Prasanna’s address',
    address: 'Somewhere in Downtown Dubai',
    privacyNote: 'Kept private — you won’t see the full address, and it won’t appear on your invoice.',
  },
  {
    id: 'home',
    kind: 'home',
    title: 'Home',
    distance: '24 m',
    address: 'Apt 1204, Bay Square Building 3, Business Bay, Dubai',
    contactName: 'Ayush Bhardwaj',
    contactPhone: '+971 50 123 4567',
  },
  {
    id: 'dubai',
    kind: 'other',
    title: 'Ayush’s Dubai Place',
    distance: '24 m',
    address: 'Villa 7, Street 12, Al Barsha 2, Dubai',
    contactName: 'Ayush Bhardwaj',
    contactPhone: '+971 50 123 4567',
  },
];

export interface AddressDialogProps {
  open: boolean;
  addresses?: WebAddressItem[];
  selectedId: string;
  onSelect: (id: string, item: WebAddressItem) => void;
  onClose: () => void;
  onAddAddress?: () => void;
}

function KindIcon({ kind }: { kind: AddressKind }) {
  const c = kind === 'registry' ? colour['text-n-icon'].action : colour['text-n-icon'].secondary;
  if (kind === 'registry') return <GiftIcon size={20} color={c} />;
  if (kind === 'home') return <HomeIcon size={20} color={c} />;
  return <PinIcon size={20} color={c} />;
}

/**
 * Gifter flow · dWeb delivery-address picker.
 *
 * Desktop counterpart of ../AddressSheet.tsx `variant="gifter"` (fixed at 351px
 * for the phone canvas). Same rows and same privacy notice, in a centred dialog.
 */
export function AddressDialog({
  open,
  addresses = GIFTER_ADDRESSES,
  selectedId,
  onSelect,
  onClose,
  onAddAddress,
}: AddressDialogProps) {
  return (
    <WebDialog open={open} onClose={onClose} title="Where should this gift go?" width={560}>
      <div style={body}>
        {addresses.map((item) => {
          const selected = item.id === selectedId;
          return (
            <button
              key={item.id}
              type="button"
              onClick={() => onSelect(item.id, item)}
              style={{
                ...row,
                borderColor: selected ? colour.border['action-bold'] : colour.border.primary,
                backgroundColor: selected ? colour.surface['action-subtle'] : colour.surface.primary,
              }}
            >
              <span style={{ ...radioOuter, borderColor: selected ? colour.border['action-bold'] : colour.border.medium }}>
                {selected && <span style={radioInner} />}
              </span>

              <span style={iconWell}>
                <KindIcon kind={item.kind} />
              </span>

              <span style={rowBody}>
                <span style={{ display: 'flex', alignItems: 'center', gap: space[8], flexWrap: 'wrap' }}>
                  <span style={{ ...type.b14Semi, color: colour['text-n-icon'].primary }}>{item.title}</span>
                  {item.distance && <span style={chip}>{item.distance}</span>}
                  {item.kind === 'registry' && <span style={{ ...chip, ...chipAction }}>Gift list address</span>}
                </span>

                <span style={{ ...type.b13, color: colour['text-n-icon'].secondary }}>{item.address}</span>

                {item.privacyNote ? (
                  <span style={privacyRow}>
                    <ShieldIcon size={16} color={colour['text-n-icon'].action} />
                    <span style={{ ...type.b12, color: colour['text-n-icon'].action }}>{item.privacyNote}</span>
                  </span>
                ) : (
                  (item.contactName || item.contactPhone) && (
                    <span style={{ ...type.b12, color: colour['text-n-icon'].tertiary }}>
                      {[item.contactName, item.contactPhone].filter(Boolean).join(' · ')}
                    </span>
                  )
                )}
              </span>
            </button>
          );
        })}

        <button type="button" onClick={onAddAddress} style={addRow}>
          <PlusIcon size={20} />
          <span style={{ ...type.b14Semi, color: colour['text-n-icon'].action }}>Add a new address</span>
        </button>
      </div>
    </WebDialog>
  );
}

/* ------------------------------------------------------------------ styles */

const body: CSSProperties = {
  display: 'flex',
  flexDirection: 'column',
  gap: space[10],
  padding: space[20],
  overflowY: 'auto',
  boxSizing: 'border-box',
};

const row: CSSProperties = {
  display: 'flex',
  alignItems: 'flex-start',
  gap: space[12],
  width: '100%',
  padding: space[14],
  borderRadius: radius[12],
  border: '1.5px solid',
  cursor: 'pointer',
  textAlign: 'start',
  boxSizing: 'border-box',
};

const radioOuter: CSSProperties = {
  width: 18,
  height: 18,
  borderRadius: radius.rounded,
  border: '1.5px solid',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  flexShrink: 0,
  marginTop: 2,
  boxSizing: 'border-box',
};

const radioInner: CSSProperties = {
  width: 10,
  height: 10,
  borderRadius: radius.rounded,
  backgroundColor: colour.surface['action-extrabold'],
};

const iconWell: CSSProperties = {
  width: 36,
  height: 36,
  borderRadius: radius.rounded,
  backgroundColor: colour.surface.tertiary,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  flexShrink: 0,
};

const rowBody: CSSProperties = {
  display: 'flex',
  flexDirection: 'column',
  gap: space[4],
  minWidth: 0,
  flex: '1 1 auto',
};

const chip: CSSProperties = {
  ...type.b11,
  color: colour['text-n-icon'].tertiary,
  backgroundColor: colour.surface.tertiary,
  borderRadius: radius[4],
  paddingInline: space[6],
  paddingBlock: space[2],
};

const chipAction: CSSProperties = {
  color: colour['text-n-icon'].action,
  backgroundColor: colour.surface['action-subtle'],
};

const privacyRow: CSSProperties = {
  display: 'flex',
  alignItems: 'flex-start',
  gap: space[6],
  marginTop: space[2],
};

const addRow: CSSProperties = {
  display: 'flex',
  alignItems: 'center',
  gap: space[8],
  width: '100%',
  padding: space[14],
  borderRadius: radius[12],
  border: `1.5px dashed ${colour.border.action}`,
  backgroundColor: colour.surface.primary,
  cursor: 'pointer',
  boxSizing: 'border-box',
  fontFamily: font.semibold,
};
