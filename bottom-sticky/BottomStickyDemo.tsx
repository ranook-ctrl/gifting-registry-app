import { StickyBottom } from '../src/components';
import { colour } from '../src/field-ds';

export default function BottomStickyDemo() {
  return (
    <div
      style={{
        minHeight: '100vh',
        backgroundColor: colour.surface.tertiary,
        display: 'flex',
        alignItems: 'flex-end',
        justifyContent: 'center',
        boxSizing: 'border-box',
      }}
    >
      <StickyBottom label="Create Registry" onPress={() => {}} />
    </div>
  );
}
