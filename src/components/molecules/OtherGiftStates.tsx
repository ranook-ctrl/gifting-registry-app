import React from 'react';
import { space, radius } from '../../field-ds/tokens';
import { colors, font, PRODUCT } from '../atoms/_shared';
import {
  VerifiedFilledIcon,
  PurchasedBadgeIcon,
  InvoiceIcon,
  RewindCheckIcon,
  InfoCircleFilledIcon,
  WarrantyIcon,
  InstallationV2Icon,
} from '../atoms/icons';
import { MarketplaceTagsPills } from '../atoms/MarketplaceTagsPills';
import { LinearGradientFill } from '../atoms/Gradient';

const WASHING_MACHINE = `${PRODUCT}/washing-machine.png`;
const AIRPODS_BOX = `${PRODUCT}/airpods-box.png`;

export type OtherGiftStatesVariant = 'Delivered' | 'Purchased' | 'All edge cases';

export interface OtherGiftStatesProps {
  property1?: OtherGiftStatesVariant;
}

const PRODUCT_TITLE =
  'Samsung 8KG Washer With 6KG Dryer, Eco Bubble, Air Wash, Hygiene Steam With Digital Inverter Technology 1400 RPM 8.0 kg';

function Frame({ size, children }: { size: number; children: React.ReactNode }) {
  return (
    <span style={{ width: size, height: size, display: 'inline-flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
      {children}
    </span>
  );
}

/** Green "Delivered on April 16, 2026" attribute pill. */
function DeliveredPill() {
  return (
    <div style={styles.deliveredPill}>
      <LinearGradientFill
        stops={[
          { offset: 0, color: '#e3fcf2' },
          { offset: 1, color: colors.surface.primary },
        ]}
        radius={radius[8]}
        start={{ x: 0, y: 0.5 }}
        end={{ x: 1, y: 0.5 }}
      />
      <span style={styles.deliveredText}>
        <span style={styles.deliveredBold}>Delivered </span>
        <span style={styles.deliveredDate}>on April 16, 2026</span>
      </span>
    </div>
  );
}

function ProductTile({ image, dimmed = false }: { image: string; dimmed?: boolean }) {
  return (
    <div style={styles.tile}>
      <img src={image} style={styles.tileImage} alt="" />
      {dimmed && <div style={styles.tileDim} />}
    </div>
  );
}

/**
 * "OtherGiftStates" — a 351-wide gift status card. `property1` selects the
 * layout: a delivered notice, a purchased notice (dimmed cover), or the
 * "All edge cases" card that stacks return/warranty attributes, an Invoice
 * action, and a scheduled-installation strip.
 */
export function OtherGiftStates({ property1 = 'Delivered' }: OtherGiftStatesProps) {
  const isAllEdgeCases = property1 === 'All edge cases';
  const isDelivered = property1 === 'Delivered';
  const isPurchased = property1 === 'Purchased';
  const isDeliveredOrAllEdge = isDelivered || isAllEdgeCases;

  return (
    <div style={{ ...styles.card, ...(isAllEdgeCases ? styles.cardEdge : styles.cardDefault) }}>
      {/* Header */}
      <div style={{ ...styles.header, ...(isAllEdgeCases ? styles.headerEdge : styles.headerDefault) }}>
        <div style={styles.headerRow}>
          <div style={{ ...styles.headerLeft, gap: isPurchased ? space[8] : space[4] }}>
            {isDeliveredOrAllEdge && (
              <Frame size={18}>
                <VerifiedFilledIcon />
              </Frame>
            )}
            {isPurchased && (
              <Frame size={14}>
                <PurchasedBadgeIcon />
              </Frame>
            )}
            <span style={styles.headerText}>
              {isDeliveredOrAllEdge ? (
                <>
                  <span style={styles.nameSuccess}>Ayush</span>
                  <span style={styles.headerBody}>‘s gift has been delivered</span>
                </>
              ) : (
                <>
                  <span style={styles.nameAction}>Tanaya</span>
                  <span style={styles.headerBody}> has purchased this gift for you</span>
                </>
              )}
            </span>
          </div>

          {isAllEdgeCases && (
            <div style={styles.invoiceButton}>
              <span style={styles.invoiceText}>Invoice</span>
              <Frame size={16}>
                <InvoiceIcon />
              </Frame>
            </div>
          )}
        </div>
      </div>

      {/* Body */}
      <div style={styles.body}>
        <div style={styles.productRow}>
          <div style={{ ...styles.productLeft, alignItems: isAllEdgeCases ? 'flex-start' : 'center' }}>
            <ProductTile image={isPurchased ? AIRPODS_BOX : WASHING_MACHINE} dimmed={isPurchased} />

            <div style={styles.textCol}>
              <span style={styles.productTitle}>{PRODUCT_TITLE}</span>

              {isAllEdgeCases && (
                <div style={styles.attributes}>
                  <div style={styles.attrRow}>
                    <div style={styles.attrItem}>
                      <Frame size={16}>
                        <RewindCheckIcon />
                      </Frame>
                      <span style={styles.attrText}>Returns &amp; exchanges available</span>
                    </div>
                    <Frame size={14}>
                      <InfoCircleFilledIcon />
                    </Frame>
                  </div>
                  <div style={styles.attrItem}>
                    <Frame size={16}>
                      <WarrantyIcon />
                    </Frame>
                    <span style={styles.attrText}>1-year warranty</span>
                  </div>
                </div>
              )}

              {isDeliveredOrAllEdge && <DeliveredPill />}
            </div>
          </div>

          {isDeliveredOrAllEdge && (
            <div style={styles.pillWrap}>
              <MarketplaceTagsPills tag="express" />
            </div>
          )}
        </div>
      </div>

      {/* Installation strip (All edge cases only) */}
      {isAllEdgeCases && (
        <div style={styles.stripOuter}>
          <div style={styles.strip}>
            <div style={styles.receiver}>
              <div style={styles.installIconBox}>
                <Frame size={20}>
                  <InstallationV2Icon />
                </Frame>
              </div>
              <div style={styles.receiverText}>
                <div style={styles.receiverRow}>
                  <span style={styles.installTitle}>Installation scheduled</span>
                  <span style={styles.dotDark} />
                  <span style={styles.installFree}>Free</span>
                </div>
                <div style={styles.receiverRow}>
                  <span style={styles.installMeta}>12:00 PM</span>
                  <span style={styles.dotMuted} />
                  <span style={styles.installMeta}>Feb 12, 2026</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

const styles: Record<string, React.CSSProperties> = {
  card: {
    position: 'relative',
    width: 351,
    borderRadius: radius[16],
    backgroundColor: colors.surface.primary,
    boxSizing: 'border-box',
  },
  cardDefault: { overflow: 'hidden', boxShadow: '0px 4px 12px 0px rgba(0,0,0,0.02)' },
  cardEdge: { paddingBottom: 3, boxShadow: '0px 4px 6px 0px rgba(0,0,0,0.02)' },

  header: {
    backgroundColor: colors.surface.secondary,
    border: `3px solid ${colors.surface.primary}`,
    borderTopLeftRadius: radius[16],
    borderTopRightRadius: radius[16],
    width: '100%',
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    boxSizing: 'border-box',
  },
  headerDefault: { paddingLeft: space[10], paddingRight: space[10], paddingTop: space[12], paddingBottom: space[12] },
  headerEdge: { paddingLeft: space[10], paddingRight: space[6], paddingTop: 9, paddingBottom: 9 },
  headerRow: { flex: 1, display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  headerLeft: { display: 'flex', flexDirection: 'row', alignItems: 'center' },
  headerText: { flexShrink: 1, minWidth: 0, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' },
  headerBody: { fontFamily: font.medium, fontSize: 12, lineHeight: '18px', letterSpacing: -0.1, fontWeight: 500, color: colors.text.primary },
  nameSuccess: { fontFamily: font.bold, fontSize: 12, lineHeight: '18px', letterSpacing: -0.1, fontWeight: 700, color: colors.text.success },
  nameAction: { fontFamily: font.bold, fontSize: 12, lineHeight: '18px', letterSpacing: -0.1, fontWeight: 700, color: colors.text.action },

  invoiceButton: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: space[4],
    height: 24,
    paddingLeft: space[6],
    paddingRight: space[6],
    paddingTop: space[4],
    paddingBottom: space[4],
    borderRadius: radius[4],
    flexShrink: 0,
    boxSizing: 'border-box',
  },
  invoiceText: { fontFamily: font.semibold, fontSize: 12, lineHeight: '16px', fontWeight: 600, color: colors.text.action },

  body: {
    display: 'flex',
    flexDirection: 'column',
    gap: space[12],
    justifyContent: 'center',
    paddingTop: space[10],
    paddingBottom: space[12],
    paddingLeft: space[12],
    paddingRight: space[12],
    width: '100%',
    boxSizing: 'border-box',
  },
  productRow: { display: 'flex', flexDirection: 'row', alignItems: 'flex-end', gap: space[16], width: '100%' },
  productLeft: { flex: 1, minWidth: 0, display: 'flex', flexDirection: 'row', gap: space[12] },
  textCol: { flex: 1, minWidth: 0, display: 'flex', flexDirection: 'column', gap: space[8], justifyContent: 'center' },
  productTitle: {
    fontFamily: font.regular,
    fontSize: 12,
    lineHeight: '18px',
    letterSpacing: -0.1,
    fontWeight: 400,
    color: colors.text.secondary,
    display: '-webkit-box',
    WebkitLineClamp: 2,
    WebkitBoxOrient: 'vertical',
    overflow: 'hidden',
  } as React.CSSProperties,

  tile: { position: 'relative', width: 57, height: 76, borderRadius: radius[8], backgroundColor: colors.surface.secondary, overflow: 'hidden', flexShrink: 0 },
  tileImage: { width: '100%', height: '100%', objectFit: 'cover' },
  tileDim: { position: 'absolute', inset: 0, backgroundColor: 'rgba(242,243,247,0.5)', mixBlendMode: 'darken' },

  deliveredPill: {
    position: 'relative',
    display: 'inline-flex',
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
    gap: space[4],
    paddingLeft: space[6],
    paddingRight: space[6],
    paddingTop: space[4],
    paddingBottom: space[4],
    borderRadius: radius[8],
    overflow: 'hidden',
  },
  deliveredText: { position: 'relative', zIndex: 1, fontSize: 12, lineHeight: '18px', letterSpacing: -0.1, whiteSpace: 'nowrap' },
  deliveredBold: { fontFamily: font.semibold, fontWeight: 600, color: colors.text.success },
  deliveredDate: { fontFamily: font.regular, fontWeight: 400, color: colors.text.primary },

  pillWrap: { width: 54, paddingTop: space[8], paddingBottom: space[8], display: 'flex', alignItems: 'flex-start', flexShrink: 0 },

  attributes: { display: 'flex', flexDirection: 'column', gap: space[4], width: '100%' },
  attrRow: { display: 'flex', flexDirection: 'row', alignItems: 'center', gap: space[4] },
  attrItem: { display: 'flex', flexDirection: 'row', alignItems: 'center', gap: space[4] },
  attrText: { fontFamily: font.medium, fontSize: 12, lineHeight: '18px', letterSpacing: -0.1, fontWeight: 500, color: colors.text.tertiary },

  stripOuter: { display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', paddingLeft: 3, paddingRight: 3, width: '100%', boxSizing: 'border-box' },
  strip: {
    backgroundColor: '#f5faff',
    display: 'flex',
    flexDirection: 'column',
    gap: space[10],
    paddingLeft: space[8],
    paddingRight: space[4],
    paddingTop: space[6],
    paddingBottom: space[6],
    borderBottomLeftRadius: radius[14],
    borderBottomRightRadius: radius[14],
    width: '100%',
    overflow: 'hidden',
    boxSizing: 'border-box',
  },
  receiver: { display: 'flex', flexDirection: 'row', alignItems: 'center', gap: space[8], width: '100%' },
  installIconBox: { backgroundColor: colors.surface.primary, display: 'flex', flexDirection: 'row', alignItems: 'center', padding: space[8], borderRadius: radius[6] },
  receiverText: { flex: 1, minWidth: 0, display: 'flex', flexDirection: 'column', gap: space[2] },
  receiverRow: { display: 'flex', flexDirection: 'row', alignItems: 'center', gap: space[6] },
  installTitle: { fontFamily: font.semibold, fontSize: 13, lineHeight: '20px', letterSpacing: -0.1, fontWeight: 600, color: colors.text.primary },
  installFree: { fontFamily: font.semibold, fontSize: 13, lineHeight: '20px', letterSpacing: -0.1, fontWeight: 600, color: colors.text.success },
  installMeta: { fontFamily: font.medium, fontSize: 12, lineHeight: '18px', letterSpacing: -0.1, fontWeight: 500, color: colors.text.tertiary },
  dotDark: { width: 2, height: 2, borderRadius: 1, backgroundColor: '#101628' },
  dotMuted: { width: 2, height: 2, borderRadius: 1, backgroundColor: '#989fb3' },
};
