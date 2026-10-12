import { DateInput } from '../src/components';
import { colour, space } from '../src/field-ds';

// July 2026 reference state from Figma: every date is selectable,
// event dots on the 2nd, 6th and 8th, and the 15th rendered as "today".
const JULY = (d: number) => new Date(2026, 6, d);

export default function DateInputDemo() {
  return (
    <div
      style={{
        minHeight: '100vh',
        backgroundColor: colour.surface.tertiary,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: space[40],
        boxSizing: 'border-box',
      }}
    >
      <div style={{ width: 351 }}>
        <DateInput
          month={JULY(1)}
          today={JULY(15)}
          markedDates={[JULY(2), JULY(6), JULY(8)]}
          onConfirm={() => {}}
          onClose={() => {}}
        />
      </div>
    </div>
  );
}
