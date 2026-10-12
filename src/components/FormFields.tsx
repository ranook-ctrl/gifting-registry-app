import { useState } from 'react';
import type { CSSProperties, ReactNode } from 'react';
import { colour, palette, space, radius, fontFamily } from '../field-ds';

import iconInfo from './assets/form-fields/info-circle-filled.svg';
import iconDoorOpen from './assets/form-fields/door-open.svg';
import iconCheckbox from './assets/form-fields/checkbox-checked.svg';
import iconHome from './assets/form-fields/home.svg';
import iconEdit from './assets/form-fields/edit.svg';
import iconUserCircle from './assets/form-fields/user-circle.svg';
import iconCalendar from './assets/form-fields/calendar.svg';
import bgEllipse from './assets/form-fields/ellipse.svg';
import bannerNotch from './assets/form-fields/notch.svg';

import occEid from './assets/form-fields/occ-eid.png';
import occBirthday from './assets/form-fields/occ-birthday.png';
import occBabyshower from './assets/form-fields/occ-babyshower.png';
import occAnniversary from './assets/form-fields/occ-anniversary.png';
import occWedding from './assets/form-fields/occ-wedding.png';
import occHousewarming from './assets/form-fields/occ-housewarming.png';
import occOther from './assets/form-fields/occ-other.png';

export type FormFieldVariant = 'text' | 'date' | 'address' | 'leave-at-door' | 'occasion';

export interface FormFieldsOccasion {
  label: string;
  imageUrl: string;
}

export interface FormFieldsProps {
  variant: FormFieldVariant;
  className?: string;

  // --- Text ---
  /** Field label (Text / Occasion variants) e.g. "Who's creating this list?". */
  label?: string;
  /** Show the red required asterisk. */
  required?: boolean;
  /** Render the field's label row. Set false for the label-less address card. */
  showLabel?: boolean;
  /** Filled value shown in the text field. */
  value?: string;
  /** Placeholder shown when the text field is empty. */
  placeholder?: string;
  /** Fired as the user edits the text field. */
  onValueChange?: (value: string) => void;
  /** Supportive helper text under the field. */
  helperText?: string;

  // --- Date ---
  /** Filled date label (e.g. "14 July'26"). Omit to show the placeholder. */
  dateValue?: string;
  /** Placeholder shown when no date is picked. */
  datePlaceholder?: string;
  /** Fired when the date field is tapped (opens the calendar sheet). */
  onDatePress?: () => void;

  // --- Address ---
  addressTitle?: string;
  addressLine?: string;
  contactName?: string;
  contactPhone?: string;
  contactNote?: string;
  /** Info banner: bold lead sentence + trailing regular sentence. */
  noticeLead?: string;
  noticeBody?: string;
  onEditAddress?: () => void;

  // --- Leave at door ---
  instructionLabel?: string;
  checked?: boolean;
  onToggle?: (next: boolean) => void;

  // --- Occasion ---
  occasions?: FormFieldsOccasion[];
  /** Controlled selected index (single-select). Omit to let the component manage it. */
  selectedOccasion?: number | null;
  onSelectOccasion?: (index: number) => void;
}

// Info-banner text colour (accent/600). No matching Field DS semantic token —
// kept verbatim from the Figma source for a 1:1 match.
const NOTICE_BLUE = '#0076ff';

const ff = (family: string) => `${family}, 'SF Pro Text', system-ui, sans-serif`;

const FONT = {
  regular: { fontFamily: ff(fontFamily.regular.fontFamily), fontWeight: 400 },
  medium: { fontFamily: ff(fontFamily.medium.fontFamily), fontWeight: 500 },
  semibold: { fontFamily: ff('Noontree-SemiBold'), fontWeight: 600 },
  bold: { fontFamily: ff(fontFamily.bold.fontFamily), fontWeight: 700 },
} as const satisfies Record<string, CSSProperties>;

// Text presets — sizes/line-heights/tracking straight from the Figma type tokens.
const b13Semibold20: CSSProperties = { ...FONT.semibold, fontSize: 13, lineHeight: '20px', letterSpacing: -0.1 };
const b13Semibold18: CSSProperties = { ...FONT.semibold, fontSize: 13, lineHeight: '18px', letterSpacing: -0.1 };
const b12Regular18: CSSProperties = { ...FONT.regular, fontSize: 12, lineHeight: '18px', letterSpacing: -0.1 };
const b12Medium18: CSSProperties = { ...FONT.medium, fontSize: 12, lineHeight: '18px', letterSpacing: -0.1 };
const b14Medium20: CSSProperties = { ...FONT.medium, fontSize: 14, lineHeight: '20px', letterSpacing: -0.1 };
const b14Regular20: CSSProperties = { ...FONT.regular, fontSize: 14, lineHeight: '20px', letterSpacing: -0.1 };

export const DEFAULT_OCCASIONS: FormFieldsOccasion[] = [
  { label: 'Eid-ul-fitr', imageUrl: occEid },
  { label: 'Birthday', imageUrl: occBirthday },
  { label: 'Baby shower', imageUrl: occBabyshower },
  { label: 'Anniversary', imageUrl: occAnniversary },
  { label: 'Wedding', imageUrl: occWedding },
  { label: 'House warming', imageUrl: occHousewarming },
  { label: 'Other', imageUrl: occOther },
];

// Per-tile image placement, mirroring the absolute offsets in the Figma source.
type OccPlacement =
  | { kind: 'cover'; top: number; left: string; centered?: boolean; w: number; h: number }
  | { kind: 'crop'; top: number; left: string; w: number; h: number; imgLeft: string; imgTop: string; imgW: string; imgH: string };

const OCC_PLACEMENT: OccPlacement[] = [
  { kind: 'cover', top: 19, left: 'calc(50% - 3.5px)', centered: true, w: 129, h: 129 },
  { kind: 'crop', top: 49, left: 'calc(50% - 0.25px)', w: 115.5, h: 88, imgLeft: '15.28%', imgTop: '0', imgW: '69.43%', imgH: '99.71%' },
  { kind: 'cover', top: 36, left: 'calc(50% + 1px)', centered: true, w: 110, h: 110 },
  { kind: 'cover', top: 30, left: '-8px', w: 109, h: 111 },
  { kind: 'cover', top: 41, left: '3px', w: 92, h: 92 },
  { kind: 'cover', top: 41, left: 'calc(50% - 3px)', centered: true, w: 92, h: 92 },
  { kind: 'cover', top: 32, left: '-9px', w: 112, h: 112 },
];

function Glyph({ src, w, h, box }: { src: string; w: number; h: number; box: number }) {
  return (
    <span
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        width: box,
        height: box,
        flexShrink: 0,
        overflow: 'hidden',
      }}
    >
      <img alt="" src={src} style={{ width: w, height: h, display: 'block' }} />
    </span>
  );
}

// White rounded icon chip used inside the address/instruction cards.
function IconChip({ children }: { children: ReactNode }) {
  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        padding: space[8],
        backgroundColor: colour.surface.primary,
        borderRadius: radius[8],
        flexShrink: 0,
      }}
    >
      {children}
    </div>
  );
}

function LabelRow({ children, gap, align, width }: { children: ReactNode; gap: number; align: CSSProperties['alignItems']; width?: number | string }) {
  return (
    <div
      style={{
        display: 'flex',
        gap,
        alignItems: align,
        width: width ?? '100%',
        overflow: 'hidden',
        flexShrink: 0,
      }}
    >
      {children}
    </div>
  );
}

const cardBase: CSSProperties = {
  backgroundColor: colour.surface.primary,
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'flex-start',
  padding: space[12],
  borderRadius: radius[16],
  boxSizing: 'border-box',
};

export function FormFields({
  variant,
  className,
  label,
  required = true,
  showLabel = true,
  value = 'Prasanna',
  placeholder,
  onValueChange,
  helperText,
  dateValue,
  datePlaceholder = 'Select Date',
  onDatePress,
  addressTitle = 'Home',
  addressLine = '676D, Downtown, Dubai',
  contactName = 'Prasanna',
  contactPhone = '+971 (0) 412 3456',
  contactNote = 'Delivery partner will call this number',
  noticeLead = 'This can’t be changed later.',
  noticeBody = 'Your address stays private, noon will deliver gifts here.',
  onEditAddress,
  instructionLabel = 'Leave at door',
  checked = true,
  onToggle,
  occasions = DEFAULT_OCCASIONS,
  selectedOccasion,
  onSelectOccasion,
}: FormFieldsProps) {
  const [internalOccasion, setInternalOccasion] = useState<number | null>(null);
  const activeOccasion = selectedOccasion !== undefined ? selectedOccasion : internalOccasion;
  const selectOccasion = (i: number) => {
    if (selectedOccasion === undefined) setInternalOccasion(i);
    onSelectOccasion?.(i);
  };
  if (variant === 'text') {
    return (
      <div className={className} style={{ ...cardBase, gap: space[8], minWidth: 160, width: 343, overflow: 'hidden' }}>
        <LabelRow gap={space[2]} align="flex-start">
          <span style={{ ...b13Semibold20, color: colour['text-n-icon'].primary, whiteSpace: 'nowrap' }}>
            {label ?? 'Who’s creating this list?'}
          </span>
          {required && <span style={{ ...b14Medium20, color: colour['text-n-icon'].error, whiteSpace: 'nowrap' }}>*</span>}
        </LabelRow>

        <div
          style={{
            display: 'flex',
            gap: space[8],
            alignItems: 'center',
            paddingInline: space[16],
            paddingBlock: space[12],
            width: '100%',
            backgroundColor: colour.surface.secondary,
            borderRadius: radius[12],
            boxSizing: 'border-box',
          }}
        >
          <div style={{ display: 'flex', flex: '1 0 0', gap: space[2], alignItems: 'center', minWidth: 0, overflow: 'hidden' }}>
            <input
              type="text"
              defaultValue={value}
              placeholder={placeholder}
              onChange={(e) => onValueChange?.(e.target.value)}
              style={{
                flex: '1 0 0',
                minWidth: 0,
                width: '100%',
                ...b14Medium20,
                color: colour['text-n-icon'].primary,
                background: 'transparent',
                border: 'none',
                outline: 'none',
                padding: 0,
                margin: 0,
                textOverflow: 'ellipsis',
              }}
            />
          </div>
        </div>

        <div style={{ display: 'flex', gap: space[8], alignItems: 'flex-start', width: '100%', overflow: 'hidden' }}>
          <span style={{ flex: '1 0 0', minWidth: 0, ...b12Regular18, color: colour['text-n-icon'].tertiary }}>{helperText ?? 'You can add multiple names as well'}</span>
        </div>
      </div>
    );
  }

  if (variant === 'date') {
    const filled = dateValue != null && dateValue !== '';
    return (
      <div className={className} style={{ ...cardBase, gap: space[8], minWidth: 160, width: 343, overflow: 'hidden' }}>
        <LabelRow gap={space[2]} align="flex-start">
          <span style={{ ...b13Semibold20, color: colour['text-n-icon'].primary, whiteSpace: 'nowrap' }}>
            {label ?? 'When is your event?'}
          </span>
          {required && <span style={{ ...b14Medium20, color: colour['text-n-icon'].error, whiteSpace: 'nowrap' }}>*</span>}
        </LabelRow>

        <button
          type="button"
          onClick={onDatePress}
          style={{
            display: 'flex',
            gap: space[8],
            alignItems: 'center',
            minHeight: 48,
            maxHeight: 48,
            paddingInline: space[16],
            paddingBlock: space[12],
            width: '100%',
            backgroundColor: colour.surface.secondary,
            borderRadius: radius[12],
            border: 'none',
            cursor: onDatePress ? 'pointer' : 'default',
            boxSizing: 'border-box',
          }}
        >
          <div style={{ display: 'flex', flex: '1 0 0', gap: space[2], alignItems: 'center', minWidth: 0, overflow: 'hidden' }}>
            <span
              style={{
                flex: '1 0 0',
                minWidth: 0,
                textAlign: 'start',
                ...b14Regular20,
                color: filled ? colour['text-n-icon'].primary : colour['text-n-icon'].muted,
                textOverflow: 'ellipsis',
                overflow: 'hidden',
                whiteSpace: 'nowrap',
              }}
            >
              {filled ? dateValue : datePlaceholder}
            </span>
          </div>
          <Glyph src={iconCalendar} w={15.6954} h={14.2838} box={20} />
        </button>

        <div style={{ display: 'flex', gap: space[8], alignItems: 'flex-start', width: '100%', overflow: 'hidden' }}>
          <span style={{ flex: '1 0 0', minWidth: 0, ...b12Regular18, color: colour['text-n-icon'].tertiary }}>
            {helperText ?? 'This helps us recommend products that arrive on time, you can always update this later.'}
          </span>
        </div>
      </div>
    );
  }

  if (variant === 'occasion') {
    return (
      <div className={className} style={{ ...cardBase, gap: space[8], minWidth: 160, width: 343, overflow: 'hidden' }}>
        <LabelRow gap={space[2]} align="flex-start">
          <span style={{ ...b13Semibold20, color: colour['text-n-icon'].primary, whiteSpace: 'nowrap' }}>
            {label ?? 'What’s the occassion?'}
          </span>
          {required && <span style={{ ...b14Medium20, color: colour['text-n-icon'].error, whiteSpace: 'nowrap' }}>*</span>}
        </LabelRow>

        <div style={{ display: 'flex', flexWrap: 'wrap', gap: space[12], alignItems: 'center', alignContent: 'center', width: 319 }}>
          {occasions.map((occ, i) => {
            const placement = OCC_PLACEMENT[i] ?? OCC_PLACEMENT[OCC_PLACEMENT.length - 1];
            const isSelected = activeOccasion === i;
            return (
              <div
                key={`${occ.label}-${i}`}
                role="button"
                aria-pressed={isSelected}
                onClick={() => selectOccasion(i)}
                style={{
                  position: 'relative',
                  width: 98,
                  height: 120,
                  overflow: 'hidden',
                  flexShrink: 0,
                  cursor: 'pointer',
                }}
              >
                {/* Option BG: tile surface + soft radial ellipse + label */}
                <div
                  style={{
                    position: 'absolute',
                    inset: 0,
                    boxSizing: 'border-box',
                    backgroundColor: isSelected ? palette.brandBlue[50] : colour.surface.primary,
                    // Reserve the border in both states (transparent when unselected) so
                    // box-sizing:border-box doesn't nudge the absolute label on select.
                    border: `1.5px solid ${isSelected ? colour.border['action-bold'] : 'transparent'}`,
                    borderRadius: radius[12],
                    overflow: 'hidden',
                  }}
                >
                  <div style={{ position: 'absolute', left: -52, top: -16, width: 202, height: 202 }}>
                    <img alt="" src={bgEllipse} style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', display: 'block' }} />
                  </div>
                  <p
                    style={{
                      position: 'absolute',
                      top: 12,
                      left: '50%',
                      transform: 'translateX(-50%)',
                      width: 86,
                      margin: 0,
                      textAlign: 'center',
                      wordBreak: 'break-word',
                      fontSize: 12,
                      lineHeight: '18px',
                      letterSpacing: -0.1,
                      ...(isSelected ? FONT.bold : FONT.medium),
                      color: isSelected ? colour['text-n-icon'].action : colour['text-n-icon'].secondary,
                    }}
                  >
                    {occ.label}
                  </p>
                </div>

                {/* Occasion artwork */}
                {placement.kind === 'crop' ? (
                  <div
                    style={{
                      position: 'absolute',
                      top: placement.top,
                      left: placement.left,
                      transform: 'translateX(-50%)',
                      width: placement.w,
                      height: placement.h,
                      overflow: 'hidden',
                    }}
                  >
                    <img
                      alt=""
                      src={occ.imageUrl}
                      style={{ position: 'absolute', left: placement.imgLeft, top: placement.imgTop, width: placement.imgW, height: placement.imgH, maxWidth: 'none', pointerEvents: 'none' }}
                    />
                  </div>
                ) : (
                  <div
                    style={{
                      position: 'absolute',
                      top: placement.top,
                      left: placement.left,
                      transform: placement.centered ? 'translateX(-50%)' : undefined,
                      width: placement.w,
                      height: placement.h,
                    }}
                  >
                    <img
                      alt=""
                      src={occ.imageUrl}
                      style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover', pointerEvents: 'none' }}
                    />
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    );
  }

  if (variant === 'leave-at-door') {
    return (
      <div className={className} style={{ ...cardBase, width: 343 }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: space[6], alignItems: 'flex-start', width: '100%' }}>
          <LabelRow gap={space[4]} align="center" width={319}>
            <span style={{ ...b13Semibold20, color: colour['text-n-icon'].primary, whiteSpace: 'nowrap', wordBreak: 'break-word' }}>
              {label ?? 'Delivery instructions'}
            </span>
            <Glyph src={iconInfo} w={13} h={13} box={16} />
          </LabelRow>

          <div style={{ display: 'flex', gap: space[12], alignItems: 'flex-start', width: '100%' }}>
            <div
              style={{
                display: 'flex',
                flex: '1 0 0',
                flexDirection: 'column',
                gap: space[24],
                alignItems: 'center',
                minWidth: 0,
                overflow: 'hidden',
                paddingInlineStart: space[12],
                paddingInlineEnd: space[16],
                paddingBlock: space[12],
                backgroundColor: colour.surface.secondary,
                borderRadius: radius[12],
                boxSizing: 'border-box',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', width: '100%' }}>
                <div style={{ display: 'flex', gap: space[10], alignItems: 'center' }}>
                  <IconChip>
                    <Glyph src={iconDoorOpen} w={17.9167} h={15.1511} box={20} />
                  </IconChip>
                  <span style={{ ...b13Semibold18, color: colour['text-n-icon'].primary, whiteSpace: 'nowrap', wordBreak: 'break-word' }}>
                    {instructionLabel}
                  </span>
                </div>
                <button
                  type="button"
                  role="checkbox"
                  aria-label={instructionLabel}
                  aria-checked={checked}
                  onClick={onToggle ? () => onToggle(!checked) : undefined}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    width: 24,
                    height: 24,
                    padding: 0,
                    border: 'none',
                    background: 'transparent',
                    cursor: onToggle ? 'pointer' : 'default',
                    flexShrink: 0,
                  }}
                >
                  {checked ? (
                    <img alt="" src={iconCheckbox} style={{ width: 18.7856, height: 18.7866, display: 'block' }} />
                  ) : (
                    <span
                      style={{
                        width: 18.7856,
                        height: 18.7866,
                        boxSizing: 'border-box',
                        border: `1.5px solid ${colour.border.medium}`,
                        borderRadius: 6.5,
                        backgroundColor: colour.surface.primary,
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

  // variant === 'address'
  return (
    <div className={className} style={{ ...cardBase, width: 343 }}>
      <div style={{ display: 'flex', flexDirection: 'column', gap: space[6], alignItems: 'flex-start', width: '100%' }}>
        {showLabel && (
          <LabelRow gap={space[2]} align="flex-start" width={319}>
            <span style={{ ...b13Semibold20, color: colour['text-n-icon'].primary, wordBreak: 'break-word' }}>
              {label ?? 'Where should we deliver the gifts?'}
            </span>
            {required && <span style={{ ...b12Medium18, color: colour['text-n-icon'].error }}>*</span>}
          </LabelRow>
        )}

        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start', width: '100%' }}>
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              gap: space[24],
              alignItems: 'center',
              width: '100%',
              paddingInlineStart: space[12],
              paddingInlineEnd: space[10],
              paddingBlock: space[16],
              backgroundColor: colour.surface.secondary,
              borderRadius: radius[12],
              boxSizing: 'border-box',
            }}
          >
            {/* Row 1 — address */}
            <div style={{ display: 'flex', gap: space[16], alignItems: 'center', width: '100%' }}>
              <div style={{ display: 'flex', flex: '1 0 0', gap: space[10], alignItems: 'center', minWidth: 0 }}>
                <IconChip>
                  <Glyph src={iconHome} w={16.2506} h={14.5833} box={20} />
                </IconChip>
                <div style={{ display: 'flex', flex: '1 0 0', flexDirection: 'column', gap: space[2], alignItems: 'flex-start', justifyContent: 'center', minWidth: 0 }}>
                  <span style={{ ...b13Semibold18, color: colour['text-n-icon'].primary, whiteSpace: 'nowrap' }}>{addressTitle}</span>
                  <span
                    style={{
                      ...b12Regular18,
                      color: colour['text-n-icon'].tertiary,
                      maxWidth: 208,
                      whiteSpace: 'nowrap',
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                    }}
                  >
                    {addressLine}
                  </span>
                </div>
              </div>
              <button
                type="button"
                aria-label="Edit address"
                onClick={onEditAddress}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  width: 36,
                  height: 36,
                  padding: space[8],
                  borderRadius: radius.rounded,
                  border: 'none',
                  background: 'transparent',
                  cursor: onEditAddress ? 'pointer' : 'default',
                  flexShrink: 0,
                  boxSizing: 'border-box',
                }}
              >
                <Glyph src={iconEdit} w={13.75} h={12.9881} box={20} />
              </button>
            </div>

            {/* Row 2 — contact */}
            <div style={{ display: 'flex', alignItems: 'center', width: '100%' }}>
              <div style={{ display: 'flex', flex: '1 0 0', gap: space[10], alignItems: 'center', minWidth: 0 }}>
                <IconChip>
                  <Glyph src={iconUserCircle} w={16.25} h={16.25} box={20} />
                </IconChip>
                <div style={{ display: 'flex', flex: '1 0 0', flexDirection: 'column', gap: space[2], alignItems: 'flex-start', justifyContent: 'center', minWidth: 0 }}>
                  <div style={{ display: 'flex', gap: space[8], height: 18, alignItems: 'center', width: '100%' }}>
                    <span style={{ ...b13Semibold18, color: colour['text-n-icon'].primary, whiteSpace: 'nowrap' }}>{contactName}</span>
                    <span style={{ width: 1, height: 13, backgroundColor: colour.border.medium, borderRadius: 1, flexShrink: 0 }} />
                    <span style={{ ...b13Semibold18, color: colour['text-n-icon'].primary, whiteSpace: 'nowrap' }}>{contactPhone}</span>
                  </div>
                  <span style={{ ...b12Regular18, color: colour['text-n-icon'].tertiary, width: '100%' }}>{contactNote}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Info notice with pointer notch */}
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start', width: '100%' }}>
          <div style={{ width: 60, height: 8 }}>
            <img alt="" src={bannerNotch} style={{ display: 'block', width: '100%', height: '100%' }} />
          </div>
          <div
            style={{
              display: 'flex',
              gap: space[10],
              alignItems: 'center',
              padding: space[12],
              width: '100%',
              backgroundColor: colour.surface['action-subtle'],
              borderRadius: radius[12],
              boxSizing: 'border-box',
            }}
          >
            <p style={{ flex: '1 0 0', minWidth: 0, margin: 0, fontSize: 12, letterSpacing: -0.1, color: NOTICE_BLUE }}>
              <span style={{ ...FONT.bold, lineHeight: '18px' }}>{`${noticeLead} `}</span>
              <span style={{ ...FONT.regular, lineHeight: '18px' }}>{`${noticeBody} `}</span>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
