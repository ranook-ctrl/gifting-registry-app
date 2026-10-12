import { useState } from 'react';
import { FormFields } from '../src/components';
import { colour, space } from '../src/field-ds';

export default function FormFieldsDemo() {
  const [checked, setChecked] = useState(true);

  return (
    <div
      style={{
        minHeight: '100vh',
        backgroundColor: colour.surface.tertiary,
        display: 'flex',
        alignItems: 'flex-start',
        justifyContent: 'center',
        padding: space[40],
        boxSizing: 'border-box',
      }}
    >
      <div style={{ display: 'flex', flexDirection: 'column', gap: space[16], alignItems: 'flex-start' }}>
        <FormFields variant="text" />
        <FormFields variant="address" onEditAddress={() => {}} />
        <FormFields variant="leave-at-door" checked={checked} onToggle={setChecked} />
        <FormFields variant="occasion" onSelectOccasion={() => {}} />
      </div>
    </div>
  );
}
