import { useState } from 'react';
import { colour, space } from '../field-ds';
import { PhoneHeader, PageHeader, SubtlerBg } from './atoms';
import { FormFields } from './FormFields';
import type { FormFieldsOccasion } from './FormFields';
import { StickyBottom } from './StickyBottom';

export interface CreateGiftListProps {
  className?: string;
  /** Prefilled name(s) shown in the "Who's creating this list?" field. */
  creatorName?: string;
  /** Occasion tiles. Defaults to the Field DS gift-registry occasion set. */
  occasions?: FormFieldsOccasion[];
  /** Controlled selected occasion index. Omit to let the screen manage it. */
  selectedOccasion?: number | null;
  onSelectOccasion?: (index: number) => void;
  onChangeName?: (value: string) => void;
  onContinue?: () => void;
  /** When set, a back button shows in the header (e.g. to exit to the entry page). */
  onBack?: () => void;
  /** Fill the parent height instead of the fixed 812 frame — use in the app
   *  shell so the Continue CTA sticks just above the bottom nav. */
  fill?: boolean;
}

/**
 * Gift List Creation · Step 1 — "Create New Gift List".
 * Composes the phone status bar, a centred page header, the two form-field
 * cards (creator name + occasion picker) over the Subtler BG, and a Continue
 * CTA that unlocks once a name and an occasion are set.
 */
export function CreateGiftList({
  className,
  creatorName = 'Prasanna',
  occasions,
  selectedOccasion,
  onSelectOccasion,
  onChangeName,
  onContinue,
  onBack,
  fill = false,
}: CreateGiftListProps) {
  const [name, setName] = useState(creatorName);
  const [internalOccasion, setInternalOccasion] = useState<number | null>(null);
  const activeOccasion = selectedOccasion !== undefined ? selectedOccasion : internalOccasion;

  const selectOccasion = (i: number) => {
    if (selectedOccasion === undefined) setInternalOccasion(i);
    onSelectOccasion?.(i);
  };
  const changeName = (v: string) => {
    setName(v);
    onChangeName?.(v);
  };

  const canContinue = name.trim().length > 0 && activeOccasion != null;

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
        <PageHeader centered title="Create New Gift List" onBack={onBack} />

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
            variant="text"
            label="Who’s creating this list?"
            value={name}
            onValueChange={changeName}
            helperText="You can add multiple names as well"
          />
          <FormFields
            variant="occasion"
            label="What’s the occassion?"
            occasions={occasions}
            selectedOccasion={activeOccasion}
            onSelectOccasion={selectOccasion}
          />
        </div>
      </div>

      {/* Pinned CTA */}
      <div style={{ position: 'absolute', bottom: 0, left: 0, width: 375, zIndex: 2 }}>
        <StickyBottom
          label="Continue"
          disabled={!canContinue}
          onPress={onContinue}
        />
      </div>
    </div>
  );
}
