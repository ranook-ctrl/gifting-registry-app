import { AddressSheet } from '../src/components';
import { colour, space } from '../src/field-ds';

export default function AddressSheetDemo() {
  return (
    <div
      style={{
        minHeight: '100vh',
        backgroundColor: colour.surface.tertiary,
        display: 'flex',
        alignItems: 'flex-start',
        justifyContent: 'center',
        flexWrap: 'wrap',
        gap: space[40],
        padding: space[40],
        boxSizing: 'border-box',
      }}
    >
      <AddressSheet variant="creator" />
      <AddressSheet variant="gifter" />
    </div>
  );
}
