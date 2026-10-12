import { colour, space, radius } from '../field-ds';

const ASSETS = '/gift-registry';

const SANS =
  '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif';

// B13/B12 body styles from the Field DS type ramp used in the design.
const type = {
  b13Regular: { fontFamily: `Noontree-Regular, ${SANS}`, fontWeight: 400, fontSize: 13, lineHeight: '20px', letterSpacing: '-0.1px' },
  b13Bold: { fontFamily: `Noontree-Bold, ${SANS}`, fontWeight: 700, fontSize: 13, lineHeight: '20px', letterSpacing: '-0.1px' },
  b13SemiBold: { fontFamily: `Noontree-SemiBold, ${SANS}`, fontWeight: 600, fontSize: 13, lineHeight: '20px', letterSpacing: '-0.1px' },
  b12Regular: { fontFamily: `Noontree-Regular, ${SANS}`, fontWeight: 400, fontSize: 12, lineHeight: '18px', letterSpacing: '-0.1px' },
} as const;

type Inset = { top: number; right: number; bottom: number; left: number };

// Renders a Field DS system icon at its exact Figma placement: an <img> absolutely
// positioned inside a fixed-size box using the design's inset percentages, so the
// glyph's optical alignment matches 1:1 (icons aren't always centred in their box).
function Icon({ src, size, inset }: { src: string; size: number; inset: Inset }) {
  return (
    <div style={{ position: 'relative', width: size, height: size, flexShrink: 0, overflow: 'hidden' }}>
      <img
        src={src}
        alt=""
        style={{
          position: 'absolute',
          top: `${inset.top}%`,
          right: `${inset.right}%`,
          bottom: `${inset.bottom}%`,
          left: `${inset.left}%`,
          width: 'auto',
          height: 'auto',
          display: 'block',
        }}
      />
    </div>
  );
}

const ICON = {
  home: { src: `${ASSETS}/dd-home.svg`, inset: { top: 13.54, right: 9.37, bottom: 13.54, left: 9.38 } },
  userCircle: { src: `${ASSETS}/dd-user-circle.svg`, inset: { top: 9.38, right: 9.38, bottom: 9.38, left: 9.38 } },
  doorOpen: { src: `${ASSETS}/dd-door-open.svg`, inset: { top: 10.7, right: 5.21, bottom: 13.54, left: 5.21 } },
  chevronDown: { src: `${ASSETS}/dd-chevron-down.svg`, inset: { top: 38.54, right: 21.87, bottom: 30.21, left: 21.88 } },
  chevronUp: { src: `${ASSETS}/dd-chevron-up.svg`, inset: { top: 30.21, right: 21.88, bottom: 38.54, left: 21.88 } },
} as const;

// Grey rounded tile that frames a 20px leading icon (surface/secondary, radius 8, pad 10).
function IconTile({ icon }: { icon: { src: string; inset: Inset } }) {
  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        backgroundColor: colour.surface.secondary,
        padding: space[10],
        borderRadius: radius[8],
        flexShrink: 0,
      }}
    >
      <Icon src={icon.src} size={20} inset={icon.inset} />
    </div>
  );
}

export type DeliveryDetailsVariant = 'minimised' | 'expanded';

export interface DeliveryDetailsProps {
  /** Collapsed header only, or the full expanded panel. */
  variant?: DeliveryDetailsVariant;
  /** Prefix before the bold address label, e.g. "Delivering to". */
  deliveringToLabel?: string;
  /** Bold address label, e.g. "Home". */
  addressLabel?: string;
  /** Full address line (truncates with an ellipsis). */
  addressLine?: string;
  /** Recipient name shown in the contact row (expanded only). */
  recipientName?: string;
  /** Recipient phone shown in the contact row (expanded only). */
  recipientPhone?: string;
  /** Helper note under the contact row (expanded only). */
  contactNote?: string;
  /** "Leave at door" label (expanded only). */
  leaveAtDoorLabel?: string;
  /** Whether the "Leave at door" option is selected. */
  leaveAtDoor?: boolean;
  /** Fired when the expand/collapse chevron is pressed. */
  onToggleExpand?: () => void;
  /** Fired when the "Leave at door" checkbox is toggled. */
  onToggleLeaveAtDoor?: (next: boolean) => void;
  style?: React.CSSProperties;
}

export function DeliveryDetails({
  variant = 'minimised',
  deliveringToLabel = 'Delivering to',
  addressLabel = 'Home',
  addressLine = 'HSBC Tower, Emaar Square - Ground floor - Burj Khalifa - Downtown Dubai - Dubai - United Arab Emirates',
  recipientName = 'Arushi',
  recipientPhone = '+971 (0) 412 3456',
  contactNote = 'Delivery partner will call on this number',
  leaveAtDoorLabel = 'Leave at door',
  leaveAtDoor = true,
  onToggleExpand,
  onToggleLeaveAtDoor,
  style,
}: DeliveryDetailsProps) {
  const isExpanded = variant === 'expanded';

  const ellipsis: React.CSSProperties = {
    alignSelf: 'stretch',
    width: '100%',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    whiteSpace: 'nowrap',
  };

  return (
    <div
      style={{
        boxSizing: 'border-box',
        width: 351,
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'flex-start',
        padding: space[12],
        borderRadius: radius[16],
        backgroundColor: colour.surface.primary,
        ...style,
      }}
    >
      {/* Header row: address + expand/collapse chevron. The whole row toggles the
          minimised ↔ expanded state (Retune). */}
      <div
        onClick={onToggleExpand}
        style={{ display: 'flex', gap: space[16], alignItems: 'center', width: '100%', cursor: onToggleExpand ? 'pointer' : 'default' }}
      >
        <div style={{ display: 'flex', flex: '1 0 0', minWidth: 0, gap: space[12], alignItems: 'center' }}>
          <IconTile icon={ICON.home} />
          <div style={{ display: 'flex', flex: '1 0 0', minWidth: 0, flexDirection: 'column', alignItems: 'flex-start', gap: space[2] }}>
            <div style={{ display: 'flex', gap: space[4], alignItems: 'center', color: colour['text-n-icon'].primary, whiteSpace: 'nowrap' }}>
              <span style={type.b13Regular}>{deliveringToLabel}</span>
              <span style={type.b13Bold}>{addressLabel}</span>
            </div>
            <p style={{ margin: 0, ...type.b12Regular, color: colour['text-n-icon'].tertiary, ...ellipsis }}>
              {addressLine}
            </p>
          </div>
        </div>
        <button
          type="button"
          aria-label={isExpanded ? 'Collapse delivery details' : 'Expand delivery details'}
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: space[4],
            borderRadius: radius.rounded,
            backgroundColor: colour.surface.primary,
            border: `1px solid ${colour.border.subtle}`,
            cursor: onToggleExpand ? 'pointer' : 'default',
            flexShrink: 0,
          }}
        >
          <Icon {...(isExpanded ? ICON.chevronUp : ICON.chevronDown)} size={20} />
        </button>
      </div>

      {/* Expanded panel — smoothly grows/collapses (grid-rows 0fr↔1fr) with the
          content fading in/out. 300ms ease-in-out (Retune). */}
      <div
        style={{
          width: '100%',
          display: 'grid',
          gridTemplateRows: isExpanded ? '1fr' : '0fr',
          opacity: isExpanded ? 1 : 0,
          transition: 'grid-template-rows 300ms ease-in-out, opacity 300ms ease-in-out',
        }}
      >
        {/* Clipper: no padding of its own so it collapses fully to 0 when the
            grid track is 0fr (minimised → clean 12px card padding, no residual). */}
        <div style={{ overflow: 'hidden', minHeight: 0 }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: space[16], paddingTop: space[16] }}>
          {/* Contact row */}
          <div style={{ display: 'flex', gap: space[16], alignItems: 'center', width: '100%' }}>
            <div style={{ display: 'flex', flex: '1 0 0', minWidth: 0, gap: space[12], alignItems: 'center' }}>
              <IconTile icon={ICON.userCircle} />
              <div style={{ display: 'flex', flex: '1 0 0', minWidth: 0, flexDirection: 'column', alignItems: 'flex-start', gap: space[2] }}>
                <div style={{ display: 'flex', gap: space[8], height: 18, alignItems: 'center', width: '100%' }}>
                  <span style={{ ...type.b13SemiBold, color: colour['text-n-icon'].primary, whiteSpace: 'nowrap' }}>{recipientName}</span>
                  <span
                    style={{
                      width: 1,
                      height: 13,
                      flexShrink: 0,
                      backgroundColor: colour.border.medium,
                      borderRadius: 9999,
                    }}
                  />
                  <span style={{ ...type.b13SemiBold, color: colour['text-n-icon'].primary, whiteSpace: 'nowrap' }}>{recipientPhone}</span>
                </div>
                <p style={{ margin: 0, ...type.b12Regular, color: colour['text-n-icon'].tertiary, ...ellipsis }}>
                  {contactNote}
                </p>
              </div>
            </div>
            {/* Invisible 36px spacer — matches the design's opacity-0 icon button to keep
                the contact text width aligned with the header row above it. */}
            <div style={{ width: 36, height: 36, flexShrink: 0 }} aria-hidden />
          </div>

          {/* Dashed divider */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', width: '100%', paddingInline: space[4] }}>
            <div
              style={{
                width: '100%',
                height: 0,
                borderTop: `1px dashed ${colour.surface.muted}`,
              }}
            />
          </div>

          {/* Leave at door row */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', width: '100%' }}>
            <div style={{ display: 'flex', gap: space[10], alignItems: 'center' }}>
              <IconTile icon={ICON.doorOpen} />
              <span style={{ ...type.b13SemiBold, lineHeight: '18px', color: colour['text-n-icon'].primary, whiteSpace: 'nowrap' }}>
                {leaveAtDoorLabel}
              </span>
            </div>
            <button
              type="button"
              role="checkbox"
              aria-checked={leaveAtDoor}
              aria-label={leaveAtDoorLabel}
              onClick={() => onToggleLeaveAtDoor?.(!leaveAtDoor)}
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                width: 24,
                height: 24,
                padding: 0,
                border: 'none',
                background: 'transparent',
                cursor: onToggleLeaveAtDoor ? 'pointer' : 'default',
                flexShrink: 0,
              }}
            >
              {leaveAtDoor ? (
                <Icon src={`${ASSETS}/dd-checkbox.svg`} size={24} inset={{ top: 10.86, right: 10.86, bottom: 10.86, left: 10.86 }} />
              ) : (
                <span
                  style={{
                    width: 18.79,
                    height: 18.79,
                    borderRadius: radius[6],
                    border: `1.5px solid ${colour.border.medium}`,
                    boxSizing: 'border-box',
                  }}
                />
              )}
            </button>
          </div>
          </div>
        </div>
      </div>
    </div>
  );
}
