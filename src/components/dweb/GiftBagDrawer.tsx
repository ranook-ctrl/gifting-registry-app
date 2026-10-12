import type { CSSProperties } from 'react';
import { colour, space, radius } from '../../field-ds';
import { type, font, DIRHAM, money } from './_shared';
import { WebDialog } from './WebDialog';
import { PlusIcon, MinusIcon, TrashIcon, GiftIcon, ShieldIcon, PinIcon, ChevronIcon } from './icons';

const ACTION_TINT = '#ebf0fd';

export interface GiftBagLine {
  id: string;
  imageUrl: string;
  name: string;
  /** Unit price, digits only. e.g. "899". */
  price: string;
  quantity: number;
}

export interface GiftBagDrawerProps {
  open: boolean;
  lines: GiftBagLine[];
  /** Name in the "Delivering to" row. */
  deliveryTo: string;
  /** Masked address line, e.g. "Somewhere in Downtown Dubai". */
  deliveryHint?: string;
  /** Free-delivery threshold; drives the nudge copy. 0 disables it. */
  freeDeliveryOver?: number;
  /** Flat delivery fee applied below the threshold. */
  deliveryFee?: number;
  onClose: () => void;
  onIncrement: (id: string) => void;
  onDecrement: (id: string) => void;
  onRemove: (id: string) => void;
  onCheckout: () => void;
  onChangeAddress?: () => void;
  onKeepBrowsing?: () => void;
}

/** Line totals + fees, shared by the drawer and the checkout summary. */
export function bagTotals(
  lines: GiftBagLine[],
  { freeDeliveryOver = 100, deliveryFee = 12 }: { freeDeliveryOver?: number; deliveryFee?: number } = {},
) {
  const items = lines.reduce((n, l) => n + l.quantity, 0);
  const subtotal = lines.reduce((sum, l) => sum + Number(l.price.replace(/,/g, '')) * l.quantity, 0);
  const freeDelivery = freeDeliveryOver > 0 && subtotal >= freeDeliveryOver;
  const shipping = lines.length === 0 || freeDelivery ? 0 : deliveryFee;
  return { items, subtotal, shipping, total: subtotal + shipping, freeDelivery };
}

/**
 * Gifter flow · dWeb gift bag.
 *
 * A right-edge drawer rather than a full page: the mobile flow has to leave the
 * registry to show the cart (../CartPage.tsx, whose body is a baked PNG), but on
 * desktop keeping the list visible behind the bag is what lets a gifter add a
 * second gift without losing their place. Checkout is still a full page.
 */
export function GiftBagDrawer({
  open,
  lines,
  deliveryTo,
  deliveryHint,
  freeDeliveryOver = 100,
  deliveryFee = 12,
  onClose,
  onIncrement,
  onDecrement,
  onRemove,
  onCheckout,
  onChangeAddress,
  onKeepBrowsing,
}: GiftBagDrawerProps) {
  const { items, subtotal, shipping, total, freeDelivery } = bagTotals(lines, { freeDeliveryOver, deliveryFee });
  const empty = lines.length === 0;
  const toFreeDelivery = Math.max(0, freeDeliveryOver - subtotal);

  return (
    <WebDialog
      open={open}
      onClose={onClose}
      placement="end"
      width={420}
      title={empty ? 'Your gift bag' : `Your gift bag (${items})`}
      panelStyle={{ minHeight: '100vh' }}
    >
      {empty ? (
        <div style={emptyState}>
          <span style={emptyArt}>
            <GiftIcon size={40} color={colour['text-n-icon'].action} />
          </span>
          <span style={{ ...type.h18, color: colour['text-n-icon'].primary }}>Nothing in the bag yet</span>
          <span style={{ ...type.b14, color: colour['text-n-icon'].secondary, textAlign: 'center' }}>
            Add a gift from {deliveryTo}&rsquo;s list and it&rsquo;ll show up here.
          </span>
          <button type="button" onClick={onKeepBrowsing ?? onClose} style={ghostBtn}>
            <span style={{ ...type.b14Semi, color: colour['text-n-icon'].action }}>Browse the gift list</span>
          </button>
        </div>
      ) : (
        <>
          {/* ---------- Delivery ---------- */}
          <button type="button" onClick={onChangeAddress} style={deliveryRow}>
            <span style={deliveryIcon}>
              <PinIcon size={18} color={colour['text-n-icon'].action} />
            </span>
            <span style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start', gap: 1, minWidth: 0 }}>
              <span style={{ ...type.b12, color: colour['text-n-icon'].tertiary }}>Delivering to</span>
              <span style={{ ...type.b14Semi, color: colour['text-n-icon'].primary }}>{deliveryTo}</span>
              {deliveryHint && (
                <span style={{ ...type.b12, color: colour['text-n-icon'].tertiary, ...ellipsis }}>{deliveryHint}</span>
              )}
            </span>
            <ChevronIcon dir="right" size={20} color={colour['text-n-icon'].tertiary} />
          </button>

          {/* Free-delivery nudge — a GMV lever, so it earns its place here. */}
          {freeDeliveryOver > 0 && (
            <div style={{ ...nudge, backgroundColor: freeDelivery ? colour.surface['success-subtle'] : colour.surface['action-subtle'] }}>
              <span
                style={{
                  ...type.b13,
                  color: freeDelivery ? colour['text-n-icon'].success_bold : colour['text-n-icon'].action,
                }}
              >
                {freeDelivery ? (
                  <>You&rsquo;ve unlocked <strong style={bold}>free delivery</strong>.</>
                ) : (
                  <>Add <strong style={bold}>{money(toFreeDelivery)}</strong> more for free delivery.</>
                )}
              </span>
            </div>
          )}

          {/* ---------- Lines ---------- */}
          <div style={lineList}>
            {lines.map((line) => (
              <div key={line.id} style={lineRow}>
                <div style={lineThumb}>
                  <img src={line.imageUrl} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                </div>

                <div style={lineBody}>
                  <span style={{ ...type.b13, color: colour['text-n-icon'].primary, ...clamp2 }}>{line.name}</span>
                  <span style={{ ...type.b14Semi, color: colour['text-n-icon'].primary }}>
                    {DIRHAM} {line.price}
                  </span>

                  <div style={lineStepper}>
                    <button
                      type="button"
                      aria-label={line.quantity <= 1 ? `Remove ${line.name}` : 'Decrease quantity'}
                      onClick={() => (line.quantity <= 1 ? onRemove(line.id) : onDecrement(line.id))}
                      style={stepBtn}
                    >
                      {line.quantity <= 1 ? <TrashIcon size={16} /> : <MinusIcon size={16} />}
                    </button>
                    <span style={{ ...type.b14Semi, color: colour['text-n-icon'].action, minWidth: 16, textAlign: 'center' }}>
                      {line.quantity}
                    </span>
                    <button type="button" aria-label="Increase quantity" onClick={() => onIncrement(line.id)} style={stepBtn}>
                      <PlusIcon size={16} />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* ---------- Footer ---------- */}
          <div style={footer}>
            <SummaryRow label={`Subtotal (${items} ${items === 1 ? 'item' : 'items'})`} value={money(subtotal)} />
            <SummaryRow
              label="Delivery"
              value={shipping === 0 ? 'Free' : money(shipping)}
              accent={shipping === 0 ? colour['text-n-icon'].success : undefined}
            />
            <div style={footerRule} />
            <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', gap: space[8] }}>
              <span style={{ ...type.b14Semi, color: colour['text-n-icon'].primary }}>Total</span>
              <span style={{ ...type.h20, color: colour['text-n-icon'].primary }}>{money(total)}</span>
            </div>

            <button type="button" onClick={onCheckout} style={checkoutBtn}>
              <span style={{ ...type.b16, fontFamily: font.semibold, fontWeight: 600, color: colour['text-n-icon']['on-surface-bold'] }}>
                Checkout
              </span>
            </button>

            <div style={{ display: 'flex', alignItems: 'center', gap: space[6], justifyContent: 'center' }}>
              <ShieldIcon size={16} color={colour['text-n-icon'].tertiary} />
              <span style={{ ...type.b12, color: colour['text-n-icon'].tertiary }}>
                {deliveryTo} won&rsquo;t see what you paid
              </span>
            </div>
          </div>
        </>
      )}
    </WebDialog>
  );
}

function SummaryRow({ label, value, accent }: { label: string; value: string; accent?: string }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: space[8] }}>
      <span style={{ ...type.b13, color: colour['text-n-icon'].secondary }}>{label}</span>
      <span style={{ ...type.b13, fontFamily: font.semibold, fontWeight: 600, color: accent ?? colour['text-n-icon'].primary }}>
        {value}
      </span>
    </div>
  );
}

/* ------------------------------------------------------------------ styles */

const bold: CSSProperties = { fontFamily: font.bold, fontWeight: 700 };

const ellipsis: CSSProperties = {
  overflow: 'hidden',
  textOverflow: 'ellipsis',
  whiteSpace: 'nowrap',
  maxWidth: '100%',
};

const clamp2: CSSProperties = {
  display: '-webkit-box',
  WebkitLineClamp: 2,
  WebkitBoxOrient: 'vertical',
  overflow: 'hidden',
};

const emptyState: CSSProperties = {
  flex: '1 1 auto',
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center',
  gap: space[12],
  padding: space[32],
  boxSizing: 'border-box',
};

const emptyArt: CSSProperties = {
  width: 76,
  height: 76,
  borderRadius: radius.rounded,
  backgroundColor: colour.surface['action-subtle'],
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  marginBottom: space[4],
};

const ghostBtn: CSSProperties = {
  height: 44,
  paddingInline: space[20],
  borderRadius: radius[10],
  border: `1px solid ${colour.border.action}`,
  backgroundColor: colour.surface.primary,
  cursor: 'pointer',
  marginTop: space[4],
};

const deliveryRow: CSSProperties = {
  display: 'flex',
  alignItems: 'center',
  gap: space[10],
  width: '100%',
  padding: space[16],
  border: 'none',
  borderBottom: `1px solid ${colour.border.subtle}`,
  backgroundColor: colour.surface.secondary,
  cursor: 'pointer',
  boxSizing: 'border-box',
  textAlign: 'start',
  flexShrink: 0,
};

const deliveryIcon: CSSProperties = {
  width: 34,
  height: 34,
  borderRadius: radius.rounded,
  backgroundColor: colour.surface['action-subtle'],
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  flexShrink: 0,
};

const nudge: CSSProperties = {
  padding: `${space[10]}px ${space[16]}px`,
  flexShrink: 0,
};

const lineList: CSSProperties = {
  flex: '1 1 auto',
  minHeight: 0,
  overflowY: 'auto',
  display: 'flex',
  flexDirection: 'column',
};

const lineRow: CSSProperties = {
  display: 'flex',
  gap: space[12],
  padding: space[16],
  borderBottom: `1px solid ${colour.border.subtle}`,
  boxSizing: 'border-box',
};

const lineThumb: CSSProperties = {
  width: 72,
  height: 72,
  flexShrink: 0,
  borderRadius: radius[8],
  overflow: 'hidden',
  backgroundColor: colour.surface.secondary,
};

const lineBody: CSSProperties = {
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'flex-start',
  gap: space[6],
  minWidth: 0,
  flex: '1 1 auto',
};

const lineStepper: CSSProperties = {
  display: 'flex',
  alignItems: 'center',
  gap: space[12],
  height: 32,
  paddingInline: space[10],
  borderRadius: radius[8],
  backgroundColor: ACTION_TINT,
  marginTop: space[2],
};

const stepBtn: CSSProperties = {
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  width: 22,
  height: 22,
  border: 'none',
  background: 'transparent',
  cursor: 'pointer',
  padding: 0,
};

const footer: CSSProperties = {
  flexShrink: 0,
  display: 'flex',
  flexDirection: 'column',
  gap: space[8],
  padding: space[16],
  borderTop: `1px solid ${colour.border.primary}`,
  backgroundColor: colour.surface.primary,
  // Sticks to the drawer's bottom edge while the line list scrolls.
  position: 'sticky',
  bottom: 0,
  boxSizing: 'border-box',
};

const footerRule: CSSProperties = {
  height: 1,
  backgroundColor: colour.border.primary,
  marginBlock: space[2],
};

const checkoutBtn: CSSProperties = {
  height: 48,
  width: '100%',
  border: 'none',
  borderRadius: radius[10],
  backgroundColor: colour.surface['action-extrabold'],
  cursor: 'pointer',
  marginTop: space[4],
  boxSizing: 'border-box',
};
