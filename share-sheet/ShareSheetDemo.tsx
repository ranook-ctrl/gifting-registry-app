import { ShareSheet } from '../src/components';
import { colour } from '../src/field-ds';

export default function ShareSheetDemo() {
  return (
    <div
      style={{
        minHeight: '100vh',
        backgroundColor: colour.surface.tertiary,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 24,
        boxSizing: 'border-box',
      }}
    >
      <ShareSheet title="Prasanna’s Birthday" itemCount={13} onShare={() => {}} />
    </div>
  );
}
