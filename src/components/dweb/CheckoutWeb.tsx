import { useState, type CSSProperties, type ReactNode } from 'react';
import { colour, space, radius } from '../../field-ds';
import { type, font, money, DIRHAM, SITE_WIDTH, SITE_GUTTER, EASE } from './_shared';
import { bagTotals, type GiftBagLine } from './GiftBagDrawer';
import {
  ChevronIcon,
  ShieldIcon,
  TruckIcon,
  GiftIcon,
  CheckIcon,
  PinIcon,
  VerifiedIcon,
} from './icons';

export interface DeliverySlot {
  id: string;
  label: string;
  window: string;
  /** Fee for this slot; 0 renders as "Free". */
  fee: number;
  tag?: string;
}

export const DELIVERY_SLOTS: DeliverySlot[] = [
  { id: 'today', label: 'Today', window: '6 PM – 10 PM', fee: 12, tag: 'express' },
  { id: 'tomorrow', label: 'Tomorrow', window: '9 AM – 1 PM', fee: 0 },
  { id: 'occasion', label: 'On the occasion', window: '14th June, 9 AM – 1 PM', fee: 0, tag: 'recommended' },
];

export type PaymentMethod = 'card' | 'cod' | 'wallet';

export interface CheckoutWebProps {
  lines: GiftBagLine[];
  /** Recipient shown in the delivery card. */
  deliveryTo: string;
  deliveryHint?: string;
  hostName: string;
  onBack: () => void;
  onChangeAddress?: () => void;
  /** Fired when the order is placed; the caller runs the placed-order reveal. */
  onPlaceOrder: (opts: { slot: DeliverySlot; payment: PaymentMethod; giftNote: string }) => void;
}

/**
 * Gifter flow · dWeb checkout.
 *
 * Built from real markup, unlike the mobile ../CheckoutPage.tsx whose body is a
 * single baked PNG — a desktop page has to reflow, and the gifting-specific bits
 * (delivery slot, gift note, "hide the price from the recipient") need to be
 * live controls rather than pixels.
 *
 * Layout follows noon's desktop checkout: the steps in a wide left column, an
 * order summary sticky in a narrower right column.
 */
export function CheckoutWeb({
  lines,
  deliveryTo,
  deliveryHint,
  hostName,
  onBack,
  onChangeAddress,
  onPlaceOrder,
}: CheckoutWebProps) {
  const [slotId, setSlotId] = useState(DELIVERY_SLOTS[2].id);
  const [payment, setPayment] = useState<PaymentMethod>('card');
  const [giftNote, setGiftNote] = useState('');
  const [hidePrice, setHidePrice] = useState(true);
  const [placing, setPlacing] = useState(false);

  const slot = DELIVERY_SLOTS.find((s) => s.id === slotId) ?? DELIVERY_SLOTS[0];
  const { items, subtotal } = bagTotals(lines);
  const shipping = slot.fee;
  const total = subtotal + shipping;

  const placeOrder = () => {
    if (placing) return;
    setPlacing(true);
    onPlaceOrder({ slot, payment, giftNote });
  };

  return (
    <div style={page}>
      {/* ---------- Page header ---------- */}
      <div style={pageHeader}>
        <div style={pageHeaderInner}>
          <button type="button" onClick={onBack} style={backBtn}>
            <ChevronIcon dir="left" size={20} color={colour['text-n-icon'].primary} />
            <span style={{ ...type.b14Semi, color: colour['text-n-icon'].primary }}>Back to the gift list</span>
          </button>
          <h1 style={{ margin: 0, ...type.h24, color: colour['text-n-icon'].primary }}>Checkout</h1>
          <div style={{ display: 'flex', alignItems: 'center', gap: space[6] }}>
            <ShieldIcon size={18} color={colour['text-n-icon'].success} />
            <span style={{ ...type.b13, color: colour['text-n-icon'].secondary }}>Secure payment</span>
          </div>
        </div>
      </div>

      <div style={columns}>
        {/* ================= Left: the steps ================= */}
        <div style={mainCol}>
          {/* ---------- 1 · Delivery address ---------- */}
          <Step index={1} title="Delivery address">
            <div style={addressCard}>
              <span style={iconWell}>
                <GiftIcon size={20} color={colour['text-n-icon'].action} />
              </span>
              <div style={{ display: 'flex', flexDirection: 'column', gap: space[4], flex: '1 1 auto', minWidth: 0 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: space[8], flexWrap: 'wrap' }}>
                  <span style={{ ...type.b14Semi, color: colour['text-n-icon'].primary }}>{deliveryTo}</span>
                  <span style={{ ...chip, ...chipAction }}>Gift list address</span>
                </div>
                {deliveryHint && (
                  <span style={{ ...type.b13, color: colour['text-n-icon'].secondary }}>{deliveryHint}</span>
                )}
                <div style={{ display: 'flex', alignItems: 'flex-start', gap: space[6], marginTop: space[2] }}>
                  <ShieldIcon size={16} color={colour['text-n-icon'].action} />
                  <span style={{ ...type.b12, color: colour['text-n-icon'].action }}>
                    Kept private — the full address isn&rsquo;t shown to you or printed on your invoice.
                  </span>
                </div>
              </div>
              <button type="button" onClick={onChangeAddress} style={changeBtn}>
                <PinIcon size={16} color={colour['text-n-icon'].action} />
                <span style={{ ...type.b13, fontFamily: font.semibold, fontWeight: 600, color: colour['text-n-icon'].action }}>
                  Change
                </span>
              </button>
            </div>
          </Step>

          {/* ---------- 2 · Delivery slot ---------- */}
          <Step index={2} title="When should it arrive?">
            <div style={{ display: 'flex', flexDirection: 'column', gap: space[10] }}>
              {DELIVERY_SLOTS.map((s) => {
                const on = s.id === slotId;
                return (
                  <label
                    key={s.id}
                    style={{
                      ...selectRow,
                      borderColor: on ? colour.border['action-bold'] : colour.border.primary,
                      backgroundColor: on ? colour.surface['action-subtle'] : colour.surface.primary,
                    }}
                  >
                    <input type="radio" name="slot" checked={on} onChange={() => setSlotId(s.id)} style={srOnly} />
                    <span style={{ ...radioOuter, borderColor: on ? colour.border['action-bold'] : colour.border.medium }}>
                      {on && <span style={radioInner} />}
                    </span>
                    <TruckIcon size={20} color={colour['text-n-icon'].secondary} />
                    <span style={{ display: 'flex', flexDirection: 'column', gap: 1, flex: '1 1 auto', minWidth: 0 }}>
                      <span style={{ display: 'flex', alignItems: 'center', gap: space[8], flexWrap: 'wrap' }}>
                        <span style={{ ...type.b14Semi, color: colour['text-n-icon'].primary }}>{s.label}</span>
                        {s.tag === 'express' && <span style={expressTag}>express</span>}
                        {s.tag === 'recommended' && <span style={{ ...chip, ...chipAction }}>Recommended</span>}
                      </span>
                      <span style={{ ...type.b13, color: colour['text-n-icon'].tertiary }}>{s.window}</span>
                    </span>
                    <span
                      style={{
                        ...type.b14Semi,
                        color: s.fee === 0 ? colour['text-n-icon'].success : colour['text-n-icon'].primary,
                        whiteSpace: 'nowrap',
                      }}
                    >
                      {s.fee === 0 ? 'Free' : money(s.fee)}
                    </span>
                  </label>
                );
              })}
            </div>
          </Step>

          {/* ---------- 3 · Gift options ---------- */}
          <Step index={3} title="Gift options">
            <div style={{ display: 'flex', flexDirection: 'column', gap: space[14] }}>
              <label style={{ display: 'flex', flexDirection: 'column', gap: space[8] }}>
                <span style={{ ...type.b14Semi, color: colour['text-n-icon'].primary }}>
                  Add a note for {hostName}
                </span>
                <textarea
                  value={giftNote}
                  onChange={(e) => setGiftNote(e.target.value)}
                  maxLength={200}
                  rows={3}
                  placeholder={`Happy birthday, ${hostName}! Hope you love this.`}
                  style={textarea}
                />
                <span style={{ ...type.b12, color: colour['text-n-icon'].tertiary, alignSelf: 'flex-end' }}>
                  {giftNote.length}/200
                </span>
              </label>

              <label
                style={{
                  ...selectRow,
                  cursor: 'pointer',
                  borderColor: hidePrice ? colour.border['action-bold'] : colour.border.primary,
                  backgroundColor: hidePrice ? colour.surface['action-subtle'] : colour.surface.primary,
                }}
              >
                <input type="checkbox" checked={hidePrice} onChange={() => setHidePrice((v) => !v)} style={srOnly} />
                <span
                  style={{
                    ...checkbox,
                    backgroundColor: hidePrice ? colour.surface['action-extrabold'] : colour.surface.primary,
                    borderColor: hidePrice ? colour.border['action-bold'] : colour.border.medium,
                  }}
                >
                  {hidePrice && <CheckIcon size={14} color={colour['text-n-icon']['on-surface-bold']} />}
                </span>
                <span style={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                  <span style={{ ...type.b14Semi, color: colour['text-n-icon'].primary }}>
                    Hide the price from {hostName}
                  </span>
                  <span style={{ ...type.b13, color: colour['text-n-icon'].tertiary }}>
                    The parcel ships without an invoice or price tag.
                  </span>
                </span>
              </label>
            </div>
          </Step>

          {/* ---------- 4 · Payment ---------- */}
          <Step index={4} title="Payment">
            <div style={{ display: 'flex', flexDirection: 'column', gap: space[10] }}>
              {(
                [
                  { id: 'card', label: 'Card ending 4291', hint: 'Visa · expires 06/28' },
                  { id: 'wallet', label: 'noon wallet', hint: `Balance ${DIRHAM} 240.00` },
                  { id: 'cod', label: 'Cash on delivery', hint: 'Not available for gift list orders' },
                ] as { id: PaymentMethod; label: string; hint: string }[]
              ).map((m) => {
                // Cash on delivery would expose the price to the recipient, which
                // defeats the point of a gift list — so it's shown but disabled.
                const disabled = m.id === 'cod';
                const on = m.id === payment && !disabled;
                return (
                  <label
                    key={m.id}
                    style={{
                      ...selectRow,
                      opacity: disabled ? 0.55 : 1,
                      cursor: disabled ? 'not-allowed' : 'pointer',
                      borderColor: on ? colour.border['action-bold'] : colour.border.primary,
                      backgroundColor: on ? colour.surface['action-subtle'] : colour.surface.primary,
                    }}
                  >
                    <input
                      type="radio"
                      name="payment"
                      checked={on}
                      disabled={disabled}
                      onChange={() => setPayment(m.id)}
                      style={srOnly}
                    />
                    <span style={{ ...radioOuter, borderColor: on ? colour.border['action-bold'] : colour.border.medium }}>
                      {on && <span style={radioInner} />}
                    </span>
                    <span style={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                      <span style={{ ...type.b14Semi, color: colour['text-n-icon'].primary }}>{m.label}</span>
                      <span style={{ ...type.b13, color: colour['text-n-icon'].tertiary }}>{m.hint}</span>
                    </span>
                  </label>
                );
              })}
            </div>
          </Step>
        </div>

        {/* ================= Right: order summary ================= */}
        <aside style={summaryCol} aria-label="Order summary">
          <div style={summaryCard}>
            <span style={{ ...type.h18, color: colour['text-n-icon'].primary }}>Order summary</span>

            <div style={summaryLines}>
              {lines.map((l) => (
                <div key={l.id} style={{ display: 'flex', gap: space[10], alignItems: 'center' }}>
                  <div style={summaryThumb}>
                    <img src={l.imageUrl} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                    {l.quantity > 1 && <span style={qtyBadge}>{l.quantity}</span>}
                  </div>
                  <span style={{ ...type.b13, color: colour['text-n-icon'].secondary, ...clamp2, flex: '1 1 auto' }}>
                    {l.name}
                  </span>
                  <span style={{ ...type.b13, fontFamily: font.semibold, fontWeight: 600, color: colour['text-n-icon'].primary, whiteSpace: 'nowrap' }}>
                    {DIRHAM} {l.price}
                  </span>
                </div>
              ))}
            </div>

            <div style={rule} />

            <Row label={`Subtotal (${items} ${items === 1 ? 'item' : 'items'})`} value={money(subtotal)} />
            <Row
              label={`Delivery · ${slot.label}`}
              value={shipping === 0 ? 'Free' : money(shipping)}
              accent={shipping === 0 ? colour['text-n-icon'].success : undefined}
            />

            <div style={rule} />

            <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', gap: space[8] }}>
              <span style={{ ...type.b16, fontFamily: font.semibold, fontWeight: 600, color: colour['text-n-icon'].primary }}>
                Total
              </span>
              <span style={{ ...type.h24, color: colour['text-n-icon'].primary }}>{money(total)}</span>
            </div>
            <span style={{ ...type.b12, color: colour['text-n-icon'].tertiary }}>Inclusive of VAT</span>

            <button type="button" onClick={placeOrder} disabled={placing || lines.length === 0} style={{ ...placeBtn, opacity: placing ? 0.6 : 1 }}>
              <span style={{ ...type.b16, fontFamily: font.semibold, fontWeight: 600, color: colour['text-n-icon']['on-surface-bold'] }}>
                {placing ? 'Placing order…' : `Send gift · ${money(total)}`}
              </span>
            </button>

            <div style={{ display: 'flex', alignItems: 'flex-start', gap: space[6] }}>
              <VerifiedIcon size={16} color={colour['text-n-icon'].success} />
              <span style={{ ...type.b12, color: colour['text-n-icon'].tertiary }}>
                We&rsquo;ll mark these gifts as taken on {hostName}&rsquo;s list so nobody buys them twice.
              </span>
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------- pieces */

function Step({ index, title, children }: { index: number; title: string; children: ReactNode }) {
  return (
    <section style={stepCard}>
      <div style={{ display: 'flex', alignItems: 'center', gap: space[10] }}>
        <span style={stepNum}>{index}</span>
        <h2 style={{ margin: 0, ...type.h18, color: colour['text-n-icon'].primary }}>{title}</h2>
      </div>
      {children}
    </section>
  );
}

function Row({ label, value, accent }: { label: string; value: string; accent?: string }) {
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

const page: CSSProperties = {
  width: '100%',
  minHeight: '100vh',
  backgroundColor: colour.surface.tertiary,
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  boxSizing: 'border-box',
};

const pageHeader: CSSProperties = {
  width: '100%',
  backgroundColor: colour.surface.primary,
  borderBottom: `1px solid ${colour.border.primary}`,
  display: 'flex',
  justifyContent: 'center',
};

const pageHeaderInner: CSSProperties = {
  width: '100%',
  maxWidth: SITE_WIDTH,
  paddingInline: SITE_GUTTER,
  paddingBlock: space[16],
  boxSizing: 'border-box',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  gap: space[16],
  flexWrap: 'wrap',
};

const backBtn: CSSProperties = {
  display: 'flex',
  alignItems: 'center',
  gap: space[4],
  border: 'none',
  background: 'transparent',
  padding: 0,
  cursor: 'pointer',
};

const columns: CSSProperties = {
  width: '100%',
  maxWidth: SITE_WIDTH,
  paddingInline: SITE_GUTTER,
  paddingBlock: space[24],
  boxSizing: 'border-box',
  display: 'flex',
  alignItems: 'flex-start',
  gap: space[24],
  flexWrap: 'wrap',
};

const mainCol: CSSProperties = {
  flex: '1 1 560px',
  minWidth: 320,
  display: 'flex',
  flexDirection: 'column',
  gap: space[16],
};

const summaryCol: CSSProperties = {
  flex: '0 1 360px',
  minWidth: 300,
  position: 'sticky',
  // Clears the sticky noon chrome above the checkout page.
  top: space[24],
};

const stepCard: CSSProperties = {
  display: 'flex',
  flexDirection: 'column',
  gap: space[16],
  padding: space[20],
  borderRadius: radius[12],
  backgroundColor: colour.surface.primary,
  border: `1px solid ${colour.border.subtle}`,
  boxSizing: 'border-box',
};

const stepNum: CSSProperties = {
  width: 26,
  height: 26,
  borderRadius: radius.rounded,
  backgroundColor: colour.surface['action-extrabold'],
  color: colour['text-n-icon']['on-surface-bold'],
  ...type.b13,
  fontFamily: font.bold,
  fontWeight: 700,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  flexShrink: 0,
};

const addressCard: CSSProperties = {
  display: 'flex',
  alignItems: 'flex-start',
  gap: space[12],
  padding: space[16],
  borderRadius: radius[10],
  border: `1px solid ${colour.border.action}`,
  backgroundColor: colour.surface['action-subtle'],
  boxSizing: 'border-box',
  flexWrap: 'wrap',
};

const iconWell: CSSProperties = {
  width: 36,
  height: 36,
  borderRadius: radius.rounded,
  backgroundColor: colour.surface.primary,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  flexShrink: 0,
};

const changeBtn: CSSProperties = {
  display: 'flex',
  alignItems: 'center',
  gap: space[4],
  height: 34,
  paddingInline: space[12],
  borderRadius: radius[8],
  border: `1px solid ${colour.border.action}`,
  backgroundColor: colour.surface.primary,
  cursor: 'pointer',
  flexShrink: 0,
};

const selectRow: CSSProperties = {
  display: 'flex',
  alignItems: 'center',
  gap: space[12],
  padding: space[14],
  borderRadius: radius[10],
  border: '1.5px solid',
  cursor: 'pointer',
  boxSizing: 'border-box',
  transition: `border-color 160ms ${EASE}, background-color 160ms ${EASE}`,
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
  boxSizing: 'border-box',
};

const radioInner: CSSProperties = {
  width: 10,
  height: 10,
  borderRadius: radius.rounded,
  backgroundColor: colour.surface['action-extrabold'],
};

const checkbox: CSSProperties = {
  width: 18,
  height: 18,
  borderRadius: radius[4],
  border: '1.5px solid',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  flexShrink: 0,
  boxSizing: 'border-box',
};

const srOnly: CSSProperties = {
  position: 'absolute',
  width: 1,
  height: 1,
  opacity: 0,
  pointerEvents: 'none',
};

const textarea: CSSProperties = {
  width: '100%',
  padding: space[12],
  borderRadius: radius[10],
  border: `1px solid ${colour.border.medium}`,
  backgroundColor: colour.surface.primary,
  resize: 'vertical',
  ...type.b14,
  color: colour['text-n-icon'].primary,
  boxSizing: 'border-box',
  outline: 'none',
};

const chip: CSSProperties = {
  ...type.b11,
  color: colour['text-n-icon'].tertiary,
  backgroundColor: colour.surface.tertiary,
  borderRadius: radius[4],
  paddingInline: space[6],
  paddingBlock: space[2],
  whiteSpace: 'nowrap',
};

const chipAction: CSSProperties = {
  color: colour['text-n-icon'].action,
  backgroundColor: colour.surface.primary,
};

const expressTag: CSSProperties = {
  ...type.b11,
  fontFamily: font.extrabold,
  fontWeight: 800,
  fontStyle: 'italic',
  color: colour['text-n-icon'].primary,
  backgroundColor: colour.surface['brand-primary'],
  paddingInline: space[6],
  paddingBlock: space[2],
  borderRadius: radius[4],
};

const summaryCard: CSSProperties = {
  display: 'flex',
  flexDirection: 'column',
  gap: space[12],
  padding: space[20],
  borderRadius: radius[12],
  backgroundColor: colour.surface.primary,
  border: `1px solid ${colour.border.subtle}`,
  boxSizing: 'border-box',
};

const summaryLines: CSSProperties = {
  display: 'flex',
  flexDirection: 'column',
  gap: space[12],
  maxHeight: 260,
  overflowY: 'auto',
};

const summaryThumb: CSSProperties = {
  position: 'relative',
  width: 52,
  height: 52,
  flexShrink: 0,
  borderRadius: radius[8],
  overflow: 'hidden',
  backgroundColor: colour.surface.secondary,
};

const qtyBadge: CSSProperties = {
  position: 'absolute',
  bottom: 2,
  insetInlineEnd: 2,
  minWidth: 18,
  height: 18,
  paddingInline: 4,
  borderRadius: radius.rounded,
  backgroundColor: colour.surface['primary-inverted'],
  color: colour['text-n-icon']['on-surface-bold'],
  ...type.b11,
  lineHeight: '18px',
  textAlign: 'center',
  boxSizing: 'border-box',
};

const clamp2: CSSProperties = {
  display: '-webkit-box',
  WebkitLineClamp: 2,
  WebkitBoxOrient: 'vertical',
  overflow: 'hidden',
};

const rule: CSSProperties = {
  height: 1,
  width: '100%',
  backgroundColor: colour.border.primary,
};

const placeBtn: CSSProperties = {
  height: 52,
  width: '100%',
  border: 'none',
  borderRadius: radius[10],
  backgroundColor: colour.surface['action-extrabold'],
  cursor: 'pointer',
  marginTop: space[4],
  boxSizing: 'border-box',
};
