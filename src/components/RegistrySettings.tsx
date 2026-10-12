import React, { useState } from 'react';
import { colour, space, radius } from '../field-ds';
import { font } from './atoms/_shared';
import { PhoneHeader, SubtlerBg } from './atoms';
import { ChevronLeftIcon } from './atoms/icons';
import { BottomSheet } from './BottomSheet';
import { ConfirmationBottomsheet } from './ConfirmationBottomsheet';

/* ---- Type ramp (Field DS body/heading presets used on this screen) ---- */
const t = {
  // H16/Bold — header title
  h16Bold: { fontFamily: font.bold, fontWeight: 700, fontSize: 16, lineHeight: '20px', letterSpacing: -0.15 },
  // Label2/Bold — section card titles
  label2Bold: { fontFamily: font.bold, fontWeight: 700, fontSize: 16, lineHeight: '20px', letterSpacing: -0.16 },
  // B12/Regular — field labels + header subtitle
  b12Regular: { fontFamily: font.regular, fontWeight: 400, fontSize: 12, lineHeight: '18px', letterSpacing: -0.1 },
  // B14/SemiBold — field values
  b14SemiBold: { fontFamily: font.semibold, fontWeight: 600, fontSize: 14, lineHeight: '20px', letterSpacing: -0.1 },
  // B14/Medium — menu rows + phone number
  b14Medium: { fontFamily: font.medium, fontWeight: 500, fontSize: 14, lineHeight: '20px', letterSpacing: -0.1 },
  // B13/SemiBold — action rows
  b13SemiBold: { fontFamily: font.semibold, fontWeight: 600, fontSize: 13, lineHeight: '18px', letterSpacing: -0.1 },
} as const;

const SECTION_TITLE = '#343d54'; // blue-gray/800
const DELETE_RED = '#de1c1c'; // utility/text/red-secondary

/* -------------------------------- Icons -------------------------------- */
type IconProps = { size?: number; color?: string };

// Field DS `system-edit` — outline pencil (24-grid, 2px stroke, rounded joins).
// Best-effort match to the Field DS system icon (the exact Figma vector was
// unavailable at build time); shared by every edit row on this screen.
const EditIcon = ({ size = 12.1, color = colour['text-n-icon'].primary }: IconProps) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" aria-hidden>
    <path
      d="M21.174 6.812a1 1 0 0 0-3.986-3.987L3.842 16.174a2 2 0 0 0-.5.83l-1.321 4.352a.5.5 0 0 0 .623.622l4.353-1.32a2 2 0 0 0 .83-.497z"
      stroke={color}
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path d="M15 5l4 4" stroke={color} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

const ChevronRightIcon = ({ size = 12.1, color = colour['text-n-icon'].primary }: IconProps) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" aria-hidden>
    <path d="M9 5l7 7-7 7" stroke={color} strokeWidth={2.4} strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

// M-Icon/System-Icon/message — Figma glyph (12.576×11.425) inset within a 16px box.
const MessageIcon = ({ size = 16, color = colour['text-n-icon'].primary }: IconProps) => (
  <svg width={size} height={size} viewBox="0 0 16 16" fill="none" aria-hidden>
    <g transform="translate(1.712 2.408)" fill={color}>
      <path d="M8.95437 5.67497C9.36858 5.67497 9.70437 5.33918 9.70437 4.92497C9.70437 4.51075 9.36858 4.17497 8.95437 4.17497C8.54016 4.17497 8.20437 4.51075 8.20437 4.92497C8.20437 5.33918 8.54016 5.67497 8.95437 5.67497Z" />
      <path d="M6.2877 5.67497C6.70192 5.67497 7.0377 5.33918 7.0377 4.92497C7.0377 4.51075 6.70192 4.17497 6.2877 4.17497C5.87349 4.17497 5.5377 4.51075 5.5377 4.92497C5.5377 5.33918 5.87349 5.67497 6.2877 5.67497Z" />
      <path d="M3.62104 5.67497C4.03525 5.67497 4.37104 5.33918 4.37104 4.92497C4.37104 4.51075 4.03525 4.17497 3.62104 4.17497C3.20682 4.17497 2.87104 4.51075 2.87104 4.92497C2.87104 5.33918 3.20682 5.67497 3.62104 5.67497Z" />
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M10.204 9.60609C9.46901 9.69799 8.73155 9.76392 7.99303 9.80387L7.25859 10.9058C6.7968 11.5978 5.77877 11.599 5.31726 10.9053L4.58318 9.80387C3.8447 9.76391 3.10728 9.69799 2.37231 9.60609C1.27557 9.46859 0.398506 8.62709 0.216223 7.53659C-0.072018 5.80798 -0.0721032 4.04213 0.216141 2.31353C0.398392 1.22317 1.27451 0.381354 2.37231 0.243864C4.97267 -0.0812879 7.60357 -0.0812879 10.2039 0.243864C11.3007 0.381363 12.1777 1.22285 12.36 2.31336C12.6483 4.04197 12.6483 5.80773 12.36 7.53634C12.1778 8.62669 11.3018 9.4686 10.204 9.60609ZM8.69191 8.75526C9.15527 8.7187 9.61801 8.67155 10.0797 8.61382L10.1105 8.60967C10.7549 8.51552 11.266 8.01612 11.3737 7.37171C11.6437 5.75212 11.6437 4.09783 11.3737 2.47824L11.3682 2.44764C11.2478 1.80811 10.7277 1.31733 10.0798 1.23605C7.56187 0.921204 5.01438 0.921285 2.49641 1.23613C1.83763 1.31871 1.31196 1.82365 1.20255 2.47824C0.932506 4.09783 0.932504 5.75212 1.20255 7.37171L1.20792 7.40231C1.32837 8.04188 1.84863 8.53259 2.49658 8.61382C2.95827 8.67155 3.42096 8.71869 3.88428 8.75525C4.30065 8.78811 4.71754 8.81241 5.13466 8.82817C5.90336 8.8572 6.67289 8.8572 7.4416 8.82817C7.8587 8.81242 8.27556 8.78811 8.69191 8.75526Z"
      />
    </g>
  </svg>
);

// M-Icon/System-Icon/warning-triangle-small — Figma glyph (12.40×11.59) inset within a 16px box.
const WarningTriangleIcon = ({ size = 16, color = colour['text-n-icon'].primary }: IconProps) => (
  <svg width={size} height={size} viewBox="0 0 16 16" fill="none" aria-hidden>
    <g transform="translate(1.798 2.205)" fill={color}>
      <path d="M5.70171 6.62V3.28667C5.70171 3.01052 5.92557 2.78667 6.20171 2.78667C6.47786 2.78667 6.70171 3.01052 6.70171 3.28667V6.62C6.70171 6.89614 6.47786 7.12 6.20171 7.12C5.92557 7.12 5.70171 6.89614 5.70171 6.62Z" />
      <path d="M6.20171 9.37C6.61593 9.37 6.95171 9.03421 6.95171 8.62C6.95171 8.20579 6.61593 7.87 6.20171 7.87C5.7875 7.87 5.45171 8.20579 5.45171 8.62C5.45171 9.03421 5.7875 9.37 6.20171 9.37Z" />
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M4.17166 1.04053C5.1694 -0.346683 7.23395 -0.347055 8.23106 1.04069L8.37478 1.24202C9.80597 3.25954 11.0453 5.40592 12.0767 7.6534L12.1791 7.8785L12.2108 7.95174C12.8484 9.48893 11.8277 11.2194 10.1596 11.3929C10.1563 11.3933 10.1531 11.3939 10.1498 11.3942C7.5242 11.6567 4.87917 11.6567 2.25361 11.3942C0.552672 11.2243 -0.479675 9.43582 0.223494 7.87842C1.30883 5.47313 2.63133 3.18261 4.17157 1.04061L4.17166 1.04053ZM7.41897 1.62427C6.83042 0.805089 5.62092 0.791914 5.01199 1.58602L4.9835 1.62443C3.48212 3.71239 2.19293 5.94513 1.13495 8.28979V8.28996C0.713163 9.22418 1.3324 10.2973 2.35305 10.3992C4.91223 10.655 7.4904 10.655 10.0496 10.3992L10.0971 10.3936C11.0893 10.2638 11.6829 9.21029 11.2676 8.28979C10.2096 5.94596 8.92047 3.71317 7.41905 1.62435L7.41897 1.62427Z"
      />
    </g>
  </svg>
);

const CrossCircleIcon = ({ size = 16, color = colour['text-n-icon'].primary }: IconProps) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" aria-hidden>
    <circle cx="12" cy="12" r="9" stroke={color} strokeWidth={2} />
    <path d="M9 9l6 6M15 9l-6 6" stroke={color} strokeWidth={2} strokeLinecap="round" />
  </svg>
);

const BinIcon = ({ size = 16, color = DELETE_RED }: IconProps) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" aria-hidden>
    <path d="M4 6.5h16" stroke={color} strokeWidth={2} strokeLinecap="round" />
    <path
      d="M6.5 6.5 7.5 20a1 1 0 0 0 1 1h7a1 1 0 0 0 1-1l1-13.5"
      stroke={color}
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path d="M9.5 6.5V4.5a1 1 0 0 1 1-1h3a1 1 0 0 1 1 1v2" stroke={color} strokeWidth={2} strokeLinejoin="round" />
    <path d="M10 10.5v6M14 10.5v6" stroke={color} strokeWidth={2} strokeLinecap="round" />
  </svg>
);

/* ------------------------------- Pieces -------------------------------- */

/** 28×28 circular white icon button used for the trailing edit/chevron glyphs. */
function CircleButton({
  onPress,
  ariaLabel,
  children,
}: {
  onPress?: () => void;
  ariaLabel: string;
  children: React.ReactNode;
}) {
  return (
    <div
      role={onPress ? 'button' : undefined}
      aria-label={ariaLabel}
      onClick={onPress}
      style={{
        width: 28,
        height: 28,
        flexShrink: 0,
        borderRadius: radius.rounded,
        backgroundColor: colour.surface.primary,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        cursor: onPress ? 'pointer' : 'default',
        boxSizing: 'border-box',
      }}
    >
      {children}
    </div>
  );
}

const divider: React.CSSProperties = {
  height: 1,
  width: '100%',
  backgroundColor: colour.border.subtle,
};

/** A label-above-value field row with an optional trailing edit pencil. */
function FieldRow({
  label,
  children,
  editable,
  onEdit,
  clamp,
}: {
  label: string;
  children: React.ReactNode;
  editable?: boolean;
  onEdit?: () => void;
  clamp?: boolean;
}) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: space[16], width: '100%' }}>
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: space[2], justifyContent: 'center', minWidth: 0 }}>
        <span style={{ ...t.b12Regular, color: colour['text-n-icon'].primary, whiteSpace: 'nowrap' }}>{label}</span>
        <span
          style={{
            ...t.b14SemiBold,
            color: colour['text-n-icon'].primary,
            ...(clamp
              ? { display: '-webkit-box', WebkitLineClamp: 3, WebkitBoxOrient: 'vertical' as const, overflow: 'hidden' }
              : {}),
          }}
        >
          {children}
        </span>
      </div>
      {editable ? (
        <CircleButton ariaLabel={`Edit ${label}`} onPress={onEdit}>
          <EditIcon />
        </CircleButton>
      ) : null}
    </div>
  );
}

/** A tappable menu row: text (+ optional leading icon) with a trailing chevron. */
function MenuRow({
  text,
  leading,
  onPress,
}: {
  text: string;
  leading?: React.ReactNode;
  onPress?: () => void;
}) {
  return (
    <div
      role={onPress ? 'button' : undefined}
      onClick={onPress}
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: space[16],
        width: '100%',
        cursor: onPress ? 'pointer' : 'default',
      }}
    >
      <div style={{ flex: 1, display: 'flex', alignItems: 'center', gap: space[8], minWidth: 0 }}>
        {leading}
        <span style={{ ...t.b14Medium, color: colour['text-n-icon'].primary }}>{text}</span>
      </div>
      <CircleButton ariaLabel={text}>
        <ChevronRightIcon />
      </CircleButton>
    </div>
  );
}

/** White section card: bold title + inner grey content card. */
function SectionCard({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div
      style={{
        width: '100%',
        backgroundColor: colour.surface.primary,
        borderRadius: radius[16],
        padding: space[12],
        display: 'flex',
        flexDirection: 'column',
        gap: space[12],
        boxSizing: 'border-box',
      }}
    >
      <span style={{ ...t.label2Bold, color: SECTION_TITLE, fontFeatureSettings: '"case"' }}>{title}</span>
      <div
        style={{
          width: '100%',
          backgroundColor: colour.surface.secondary,
          border: `1px solid ${colour.border.subtle}`,
          borderRadius: radius[12],
          padding: space[12],
          display: 'flex',
          flexDirection: 'column',
          boxSizing: 'border-box',
        }}
      >
        {children}
      </div>
    </div>
  );
}

/** A full-width action button row (Deactivate / Delete). */
function ActionRow({
  label,
  icon,
  color = colour['text-n-icon'].primary,
  onPress,
}: {
  label: string;
  icon: React.ReactNode;
  color?: string;
  onPress?: () => void;
}) {
  return (
    <div
      role={onPress ? 'button' : undefined}
      onClick={onPress}
      style={{
        width: '100%',
        backgroundColor: colour.surface.primary,
        border: `1px solid ${colour.border.subtle}`,
        borderRadius: radius[12],
        paddingBlock: space[16],
        paddingInline: space[12],
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: space[4],
        cursor: onPress ? 'pointer' : 'default',
        boxSizing: 'border-box',
      }}
    >
      {icon}
      <span style={{ ...t.b13SemiBold, color }}>{label}</span>
    </div>
  );
}

/* ------------------------------- Screen -------------------------------- */

export interface RegistrySettingsProps {
  className?: string;
  hostName?: string;
  giftListName?: string;
  occasion?: string;
  occasionDate?: string;
  deliveryAddress?: string;
  contactName?: string;
  contactPhone?: string;
  notifications?: string;
  registryLabel?: string;
  onBack?: () => void;
  onEditHostName?: () => void;
  onEditGiftListName?: () => void;
  onEditDate?: () => void;
  onOpenNotifications?: () => void;
  onOpenFaq?: (question: string) => void;
  onChatSupport?: () => void;
  onReportIssue?: () => void;
  onDeactivate?: () => void;
  onDelete?: () => void;
}

const FAQS = [
  'How does the address privacy work?',
  'Can I update gifts after sharing?',
  'What happens when a gift is purchased?',
] as const;

/**
 * "Registry settings" — manage a gift registry: host/list details, delivery
 * info, notification & FAQ shortcuts, help, and destructive deactivate/delete
 * actions. Pixel port of the Figma Registry Settings screen.
 */
export function RegistrySettings({
  className,
  hostName = 'Sarah Ali',
  giftListName = 'Sarah’s Baby Shower',
  occasion = 'Baby Shower',
  occasionDate = '27 July’26',
  deliveryAddress = 'HSBC Tower, Emaar Square - Ground floor - Burj Khalifa - Downtown Dubai - Dubai - United Arab Emirates',
  contactName = 'Prasanna',
  contactPhone = '+971 (0) 412 3456',
  notifications = 'Push and Email',
  registryLabel = 'Eidii 2026',
  onBack,
  onEditHostName,
  onEditGiftListName,
  onEditDate,
  onOpenNotifications,
  onOpenFaq,
  onChatSupport,
  onReportIssue,
  onDeactivate,
  onDelete,
}: RegistrySettingsProps) {
  // Destructive-action confirmation sheet. `sheetVariant` is kept even while the
  // sheet slides out so its content stays mounted through the exit animation
  // (BottomSheet only unmounts once the slide-out finishes).
  const [sheetOpen, setSheetOpen] = useState(false);
  const [sheetVariant, setSheetVariant] = useState<'deactivate' | 'delete'>('deactivate');
  const openSheet = (variant: 'deactivate' | 'delete') => {
    setSheetVariant(variant);
    setSheetOpen(true);
  };

  return (
    <div
      className={className}
      style={{
        position: 'relative',
        width: 375,
        minHeight: 812,
        backgroundColor: colour.surface.tertiary,
        overflow: 'hidden',
      }}
    >
      {/* Decorative backdrop */}
      <div style={{ position: 'absolute', top: 0, left: 0 }}>
        <SubtlerBg />
      </div>

      {/* Foreground */}
      <div style={{ position: 'relative', zIndex: 1, display: 'flex', flexDirection: 'column' }}>
        <PhoneHeader />

        {/* Header — back button + title/subtitle */}
        <div
          style={{
            height: 56,
            display: 'flex',
            alignItems: 'center',
            gap: space[4],
            paddingBlock: space[8],
            paddingInline: space[12],
            boxSizing: 'border-box',
          }}
        >
          <div
            role={onBack ? 'button' : undefined}
            aria-label="Back"
            onClick={onBack}
            style={{
              width: 40,
              height: 40,
              flexShrink: 0,
              borderRadius: radius.rounded,
              backgroundColor: colour.surface.primary,
              border: `1px solid ${colour.border.subtle}`,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: onBack ? 'pointer' : 'default',
              boxSizing: 'border-box',
            }}
          >
            <ChevronLeftIcon size={20} />
          </div>
          <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: space[2], paddingLeft: space[8], paddingRight: space[4], minWidth: 0 }}>
            <span style={{ ...t.h16Bold, color: colour['text-n-icon'].primary }}>Gift list settings</span>
            <span style={{ ...t.b12Regular, color: colour['text-n-icon'].secondary }}>{registryLabel}</span>
          </div>
          <div style={{ width: 40, height: 40, flexShrink: 0 }} />
        </div>

        {/* Card stack */}
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            gap: space[16],
            width: 351,
            marginInline: 'auto',
            paddingTop: space[16],
            paddingBottom: space[16],
          }}
        >
          <div style={{ display: 'flex', flexDirection: 'column', gap: space[12], width: '100%' }}>
            {/* Details */}
            <SectionCard title="Details">
              <FieldRow label="Host name" editable onEdit={onEditHostName}>
                {hostName}
              </FieldRow>
              <div style={{ ...divider, marginBlock: space[16] }} />
              <FieldRow label="Gift list name" editable onEdit={onEditGiftListName}>
                {giftListName}
              </FieldRow>
              <div style={{ ...divider, marginBlock: space[16] }} />
              <FieldRow label="Occasion">{occasion}</FieldRow>
              <div style={{ ...divider, marginBlock: space[16] }} />
              <FieldRow label="Date of occasion" editable onEdit={onEditDate}>
                {occasionDate}
              </FieldRow>
            </SectionCard>

            {/* Delivery information */}
            <SectionCard title="Delivery information">
              <FieldRow label="Delivering to" clamp>
                {deliveryAddress}
              </FieldRow>
              <div style={{ ...divider, marginBlock: space[16] }} />
              <div style={{ display: 'flex', flexDirection: 'column', gap: space[2], width: '100%' }}>
                <span style={{ ...t.b12Regular, color: colour['text-n-icon'].primary }}>Contact</span>
                <div style={{ display: 'flex', alignItems: 'center', gap: space[8] }}>
                  <span style={{ ...t.b14SemiBold, color: colour['text-n-icon'].primary }}>{contactName}</span>
                  <span style={{ width: 1, height: 13, backgroundColor: colour.border.medium }} />
                  <span style={{ ...t.b14Medium, color: colour['text-n-icon'].primary }}>{contactPhone}</span>
                </div>
              </div>
            </SectionCard>

            {/* Notifications */}
            <SectionCard title="Notifications">
              <MenuRow text={notifications} onPress={onOpenNotifications} />
            </SectionCard>

            {/* FAQs */}
            <SectionCard title="FAQs">
              {FAQS.map((q, i) => (
                <React.Fragment key={q}>
                  {i > 0 ? <div style={{ ...divider, marginBlock: space[16] }} /> : null}
                  <MenuRow text={q} onPress={onOpenFaq ? () => onOpenFaq(q) : undefined} />
                </React.Fragment>
              ))}
            </SectionCard>

            {/* Get help */}
            <SectionCard title="Get help">
              <MenuRow text="Chat with noon Support" leading={<MessageIcon />} onPress={onChatSupport} />
              <div style={{ ...divider, marginBlock: space[16] }} />
              <MenuRow text="Report an issue with this registry" leading={<WarningTriangleIcon />} onPress={onReportIssue} />
            </SectionCard>
          </div>

          {/* Destructive actions — each opens its confirmation sheet. */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: space[16], width: '100%' }}>
            <ActionRow label="Deactivate this gift list" icon={<CrossCircleIcon />} onPress={() => openSheet('deactivate')} />
            <ActionRow label="Delete this gift list" icon={<BinIcon />} color={DELETE_RED} onPress={() => openSheet('delete')} />
          </div>
        </div>
      </div>

      {/* Deactivate / Delete confirmation — reuses the shared BottomSheet chrome
          (grabber, home indicator, slide in/out) like every other sheet. `fixed`
          pins it to the viewport bottom since this screen scrolls past 812px. */}
      <BottomSheet open={sheetOpen} onClose={() => setSheetOpen(false)} fixed>
        <ConfirmationBottomsheet
          variant={sheetVariant}
          onCancel={() => setSheetOpen(false)}
          onConfirm={() => {
            if (sheetVariant === 'deactivate') onDeactivate?.();
            else onDelete?.();
            setSheetOpen(false);
          }}
        />
      </BottomSheet>
    </div>
  );
}
