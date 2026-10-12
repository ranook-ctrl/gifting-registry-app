import { useState } from 'react';
import { colour, palette, space, radius, typography } from '../field-ds';

/**
 * DateInput — "Get the gift by" calendar action sheet (Field DS).
 * Pixel-built from Figma. Renders a single month grid; selecting an available
 * day enables the Confirm CTA. Dates after `maxDate` (or in `disabledDates`)
 * render struck-through and are not selectable. `markedDates` show an event dot.
 */

const WEEKDAYS = ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'] as const;
const MONTHS = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December',
] as const;

export interface DateInputProps {
  /** Any day within the month to display. Defaults to today. */
  month?: Date;
  /** Selected date (controlled). */
  value?: Date | null;
  /** Initial selection (uncontrolled). */
  defaultValue?: Date | null;
  /** Fires when an available day is tapped. */
  onChange?: (date: Date) => void;
  /** Earliest selectable date (inclusive). Earlier days are struck-through. */
  minDate?: Date;
  /** Latest selectable date (inclusive). Later days are struck-through. */
  maxDate?: Date;
  /** Explicitly disabled days (struck-through, non-selectable). */
  disabledDates?: Date[];
  /** Days that show an event dot marker. */
  markedDates?: Date[];
  /** Day rendered in the "today" weight (medium). */
  today?: Date;
  /** Header title. */
  title?: string;
  /** Secondary (left) button label. */
  closeLabel?: string;
  /** Primary (right) button label. */
  confirmLabel?: string;
  onClose?: () => void;
  /** Fires with the selected date when Confirm is tapped. */
  onConfirm?: (date: Date) => void;
  /** Tap on the year pill in the header. */
  onYearPress?: () => void;
}

const sameDay = (a: Date, b: Date) =>
  a.getFullYear() === b.getFullYear() &&
  a.getMonth() === b.getMonth() &&
  a.getDate() === b.getDate();

/** Start-of-day for range comparisons. */
const day0 = (d: Date) => new Date(d.getFullYear(), d.getMonth(), d.getDate()).getTime();

export function DateInput({
  month,
  value,
  defaultValue = null,
  onChange,
  minDate,
  maxDate,
  disabledDates = [],
  markedDates = [],
  today,
  title = 'Get the gift by',
  closeLabel = 'Close',
  confirmLabel = 'Confirm',
  onClose,
  onConfirm,
  onYearPress,
}: DateInputProps) {
  const view = month ?? new Date();
  const [internal, setInternal] = useState<Date | null>(defaultValue);
  const selected = value !== undefined ? value : internal;

  const year = view.getFullYear();
  const monthIndex = view.getMonth();

  const isDisabled = (d: Date) => {
    if (minDate && day0(d) < day0(minDate)) return true;
    if (maxDate && day0(d) > day0(maxDate)) return true;
    return disabledDates.some((x) => sameDay(x, d));
  };
  const isMarked = (d: Date) => markedDates.some((x) => sameDay(x, d));

  const handleSelect = (d: Date) => {
    if (value === undefined) setInternal(d);
    onChange?.(d);
  };

  // Build the 6-slot-wide week rows for this month.
  const firstOfMonth = new Date(year, monthIndex, 1);
  const leading = firstOfMonth.getDay(); // 0 = Sunday
  const daysInMonth = new Date(year, monthIndex + 1, 0).getDate();

  const cells: (number | null)[] = [];
  for (let i = 0; i < leading; i++) cells.push(null);
  for (let d = 1; d <= daysInMonth; d++) cells.push(d);
  while (cells.length % 7 !== 0) cells.push(null);
  const weeks: (number | null)[][] = [];
  for (let i = 0; i < cells.length; i += 7) weeks.push(cells.slice(i, i + 7));

  const hasSelection = !!selected;

  return (
    <div
      style={{
        backgroundColor: colour.surface.primary,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        overflow: 'hidden',
        borderRadius: radius[16],
        width: '100%',
        boxSizing: 'border-box',
      }}
    >
      {/* Header */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          width: '100%',
          paddingTop: space[16],
          paddingBottom: space[10],
          paddingInline: space[16],
          boxSizing: 'border-box',
        }}
      >
        <span
          style={{
            fontFamily: 'Noontree-Bold',
            fontSize: typography.H18_Bold.fontSize,
            lineHeight: `${typography.H18_Bold.lineHeight}px`,
            letterSpacing: typography.H18_Bold.letterSpacing,
            color: colour['text-n-icon'].primary,
            whiteSpace: 'nowrap',
          }}
        >
          {title}
        </span>

        {/* M-NeutralRoundButton — year pill */}
        <button
          type="button"
          onClick={onYearPress}
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: space[6],
            minHeight: 40,
            maxHeight: 40,
            paddingInline: space[16],
            paddingBlock: space[10],
            backgroundColor: colour.surface.primary,
            border: `1px solid ${colour.border.primary}`,
            borderRadius: radius.rounded,
            cursor: 'pointer',
            boxSizing: 'border-box',
          }}
        >
          <span
            style={{
              fontFamily: 'Noontree-SemiBold',
              fontSize: 14,
              lineHeight: '20px',
              color: colour['text-n-icon'].primary,
              whiteSpace: 'nowrap',
            }}
          >
            {year}
          </span>
          <ChevronDown />
        </button>
      </div>

      {/* Calendar body */}
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          gap: space[12],
          width: '100%',
          paddingInline: space[16],
          boxSizing: 'border-box',
        }}
      >
        {/* Weekday labels */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', width: '100%' }}>
          {WEEKDAYS.map((w) => (
            <div
              key={w}
              style={{
                width: 32,
                height: 32,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexShrink: 0,
              }}
            >
              <span
                style={{
                  fontFamily: 'Noontree-Medium',
                  fontSize: 12,
                  lineHeight: '18px',
                  letterSpacing: -0.1,
                  color: colour['text-n-icon'].muted,
                  textAlign: 'center',
                }}
              >
                {w}
              </span>
            </div>
          ))}
        </div>

        {/* Month label */}
        <div style={{ display: 'flex', alignItems: 'center', paddingBlock: space[4], width: '100%' }}>
          <span
            style={{
              fontFamily: 'Noontree-SemiBold',
              fontSize: 13,
              lineHeight: '20px',
              letterSpacing: -0.1,
              color: colour['text-n-icon'].primary,
              whiteSpace: 'nowrap',
            }}
          >
            {MONTHS[monthIndex]} {year}
          </span>
        </div>

        {/* Weeks */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: space[6], width: '100%' }}>
          {weeks.map((week, wi) => (
            <div
              key={wi}
              style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', width: '100%' }}
            >
              {week.map((d, di) => {
                if (d === null) {
                  return <div key={di} style={{ width: 44, height: 44, flexShrink: 0, opacity: 0 }} />;
                }
                const date = new Date(year, monthIndex, d);
                const disabled = isDisabled(date);
                const isSelected = selected ? sameDay(selected, date) : false;
                const isToday = today ? sameDay(today, date) : false;
                const marked = isMarked(date);

                return (
                  <button
                    key={di}
                    type="button"
                    disabled={disabled}
                    onClick={() => !disabled && handleSelect(date)}
                    aria-pressed={isSelected}
                    aria-label={`${d} ${MONTHS[monthIndex]} ${year}`}
                    style={{
                      position: 'relative',
                      width: 44,
                      height: 44,
                      flexShrink: 0,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      padding: 0,
                      border: 'none',
                      borderRadius: radius.rounded,
                      backgroundColor: isSelected ? colour.surface['action-bold'] : 'transparent',
                      cursor: disabled ? 'default' : 'pointer',
                    }}
                  >
                    <span
                      style={{
                        fontFamily: disabled
                          ? 'Noontree-Regular'
                          : isToday && !isSelected
                            ? 'Noontree-Medium'
                            : 'Noontree-SemiBold',
                        fontSize: 13,
                        lineHeight: '18px',
                        letterSpacing: -0.1,
                        textAlign: 'center',
                        textDecoration: disabled ? 'line-through' : 'none',
                        color: disabled
                          ? palette.grey[400]
                          : isSelected
                            ? colour['text-n-icon']['on-surface-bold']
                            : colour['text-n-icon'].primary,
                      }}
                    >
                      {d}
                    </span>
                    {marked && !isSelected && (
                      <span
                        style={{
                          position: 'absolute',
                          bottom: 7,
                          left: '50%',
                          transform: 'translateX(-50%)',
                          width: 3,
                          height: 3,
                          borderRadius: radius.rounded,
                          backgroundColor: colour.surface['action-bold'],
                        }}
                      />
                    )}
                  </button>
                );
              })}
            </div>
          ))}
        </div>
      </div>

      {/* Footer CTAs */}
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          width: '100%',
          paddingTop: space[16],
          paddingBottom: space[16],
          paddingInline: space[12],
          boxSizing: 'border-box',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: space[12], width: '100%' }}>
          {/* M-SecondaryNeutralButton */}
          <button
            type="button"
            onClick={onClose}
            style={{
              flex: '1 0 0',
              minWidth: 0,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: space[6],
              minHeight: 48,
              maxHeight: 48,
              paddingInline: space[16],
              paddingBlock: space[14],
              backgroundColor: colour.surface.primary,
              border: `1px solid ${colour.border.primary}`,
              borderRadius: radius[10],
              overflow: 'hidden',
              cursor: 'pointer',
              boxSizing: 'border-box',
            }}
          >
            <span
              style={{
                fontFamily: 'Noontree-SemiBold',
                fontSize: 14,
                lineHeight: '20px',
                color: colour['text-n-icon'].primary,
                whiteSpace: 'nowrap',
              }}
            >
              {closeLabel}
            </span>
          </button>

          {/* M-PrimaryButton */}
          <button
            type="button"
            disabled={!hasSelection}
            onClick={() => hasSelection && selected && onConfirm?.(selected)}
            style={{
              flex: '1 0 0',
              minWidth: 0,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: space[6],
              minHeight: 48,
              maxHeight: 48,
              paddingInline: space[24],
              paddingBlock: space[14],
              border: 'none',
              borderRadius: radius[10],
              backgroundColor: hasSelection ? colour.surface['action-bold'] : colour.surface.muted,
              cursor: hasSelection ? 'pointer' : 'default',
              boxSizing: 'border-box',
            }}
          >
            <span
              style={{
                fontFamily: 'Noontree-SemiBold',
                fontSize: 14,
                lineHeight: '20px',
                color: hasSelection
                  ? colour['text-n-icon']['on-surface-bold']
                  : colour['text-n-icon'].muted,
                whiteSpace: 'nowrap',
              }}
            >
              {confirmLabel}
            </span>
          </button>
        </div>
      </div>
    </div>
  );
}

function ChevronDown() {
  return (
    <svg width={20} height={20} viewBox="0 0 20 20" fill="none" aria-hidden="true">
      <path
        d="M6.25 8.125L10 11.875L13.75 8.125"
        stroke={colour['text-n-icon'].primary}
        strokeWidth={1.5}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
