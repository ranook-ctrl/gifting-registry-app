import { useState } from 'react';
import { colour, space } from '../field-ds';
import { PhoneHeader, PageHeader, SubtlerBg } from './atoms';
import { FormFields } from './FormFields';
import { DateInput } from './DateInput';
import { AddressSheet, type AddressItem } from './AddressSheet';
import { StickyBottom } from './StickyBottom';
import { BottomSheet } from './BottomSheet';

const MONTHS = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December',
] as const;

/** "14 July'26" — day, full month, apostrophe + 2-digit year. */
const formatDate = (d: Date) =>
  `${d.getDate()} ${MONTHS[d.getMonth()]}'${String(d.getFullYear()).slice(-2)}`;

// Calendar demo data, matching the Figma "Get the gift by" sheet: July 2026,
// today = 15th, event dots on the 2nd, 6th and 8th. Dates before today are
// struck-through and non-selectable; today onward is selectable.
const CAL_MONTH = new Date(2026, 6, 1);
const CAL_TODAY = new Date(2026, 6, 15);
const CAL_MARKED = [new Date(2026, 6, 2), new Date(2026, 6, 6), new Date(2026, 6, 8)];

export interface GiftListDetailsProps {
  className?: string;
  /** Header title — the list being configured. */
  title?: string;
  /** Prefilled event date. Omit to start on the "Select Date" placeholder. */
  eventDate?: Date | null;
  onChangeDate?: (date: Date) => void;
  /** Fired when the header back button is tapped (returns to Step 1). */
  onBack?: () => void;
  /** Fired when the address card's edit pencil is tapped. */
  onEditAddress?: () => void;
  /** Leave-at-door toggle state (uncontrolled if omitted). */
  leaveAtDoor?: boolean;
  onToggleLeaveAtDoor?: (next: boolean) => void;
  onContinue?: () => void;
  /** Fill the parent height instead of the fixed 812 frame — use in the app
   *  shell so the Continue CTA sticks just above the bottom nav. */
  fill?: boolean;
}

/**
 * Gift List Creation · Step 2 — event date, delivery address & instructions.
 * Reached by tapping "Continue" on Step 1. Tapping the date field opens the
 * "Get the gift by" calendar sheet; tapping the address edit pencil opens the
 * address sheet. Confirming a day fills the field and unlocks the Continue CTA.
 */
export function GiftListDetails({
  className,
  title = 'Prasanna’s Birthday',
  eventDate = null,
  onChangeDate,
  onBack,
  onEditAddress,
  leaveAtDoor,
  onToggleLeaveAtDoor,
  onContinue,
  fill = false,
}: GiftListDetailsProps) {
  const [selectedDate, setSelectedDate] = useState<Date | null>(eventDate);
  const [draftDate, setDraftDate] = useState<Date | null>(eventDate);
  const [calendarOpen, setCalendarOpen] = useState(false);
  const [addressOpen, setAddressOpen] = useState(false);
  const [address, setAddress] = useState<AddressItem | null>(null);
  const [addressId, setAddressId] = useState<string | undefined>(undefined);
  const [internalDoor, setInternalDoor] = useState(true);

  const doorChecked = leaveAtDoor !== undefined ? leaveAtDoor : internalDoor;
  const toggleDoor = (next: boolean) => {
    if (leaveAtDoor === undefined) setInternalDoor(next);
    onToggleLeaveAtDoor?.(next);
  };

  const openCalendar = () => {
    setDraftDate(selectedDate);
    setCalendarOpen(true);
  };
  const confirmDate = (d: Date) => {
    setSelectedDate(d);
    onChangeDate?.(d);
    setCalendarOpen(false);
  };

  const openAddress = () => {
    setAddressOpen(true);
    onEditAddress?.();
  };
  const selectAddress = (id: string, item: AddressItem) => {
    setAddress(item);
    setAddressId(id);
    // Delay the sheet close so the selection highlight is visible briefly
    // before the sheet slides away (per design feedback: 800ms dwell).
    setTimeout(() => setAddressOpen(false), 800);
  };

  return (
    <div
      className={className}
      style={{
        position: 'relative',
        width: 375,
        minHeight: fill ? '100%' : 812,
        backgroundColor: colour.surface.tertiary,
        overflow: 'hidden',
      }}
    >
      {/* Decorative backdrop */}
      <div style={{ position: 'absolute', top: 0, left: 0 }}>
        <SubtlerBg />
      </div>

      {/* Foreground content */}
      <div style={{ position: 'relative', zIndex: 1 }}>
        <PhoneHeader />
        <div style={{ height: space[6] }} />
        <PageHeader centered title={title} onBack={onBack} />

        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            gap: space[12],
            paddingInline: space[16],
            paddingTop: space[20],
          }}
        >
          <FormFields
            variant="date"
            required
            label="When is your event?"
            dateValue={selectedDate ? formatDate(selectedDate) : undefined}
            onDatePress={openCalendar}
          />
          <FormFields
            variant="address"
            label="Where should we deliver the gifts?"
            addressTitle={address?.title}
            addressLine={address?.address}
            contactName={address?.contactName}
            contactPhone={address?.contactPhone}
            onEditAddress={openAddress}
          />
          <FormFields
            variant="leave-at-door"
            label="Delivery instructions"
            instructionLabel="Leave at door"
            checked={doorChecked}
            onToggle={toggleDoor}
          />
        </div>
      </div>

      {/* Pinned CTA */}
      <div style={{ position: 'absolute', bottom: 0, left: 0, width: 375, zIndex: 2 }}>
        <StickyBottom label="Continue" disabled={!selectedDate} onPress={onContinue} />
      </div>

      {/* Calendar action sheet */}
      <BottomSheet open={calendarOpen} onClose={() => setCalendarOpen(false)}>
        <div style={{ width: 351 }}>
          <DateInput
            month={CAL_MONTH}
            today={CAL_TODAY}
            minDate={CAL_TODAY}
            markedDates={CAL_MARKED}
            value={draftDate}
            onChange={setDraftDate}
            onConfirm={confirmDate}
            onClose={() => setCalendarOpen(false)}
          />
        </div>
      </BottomSheet>

      {/* Address action sheet */}
      <BottomSheet open={addressOpen} onClose={() => setAddressOpen(false)}>
        <div style={{ width: 351 }}>
          <AddressSheet variant="creator" selectedId={addressId} onSelect={selectAddress} />
        </div>
      </BottomSheet>
    </div>
  );
}
