import { ConfirmationBottomsheet, type ConfirmationVariant } from '../src/components';
import { colour } from '../src/field-ds';

const VARIANTS: ConfirmationVariant[] = ['mark-purchased', 'deactivate', 'delete', 'marked-mistake'];

export default function ConfirmationBottomsheetDemo() {
  return (
    <div
      style={{
        minHeight: '100vh',
        backgroundColor: colour.surface.tertiary,
        display: 'flex',
        flexWrap: 'wrap',
        alignItems: 'flex-start',
        justifyContent: 'center',
        gap: 24,
        padding: 24,
        boxSizing: 'border-box',
      }}
    >
      {VARIANTS.map((v) => (
        <ConfirmationBottomsheet key={v} variant={v} onConfirm={() => {}} />
      ))}
    </div>
  );
}
