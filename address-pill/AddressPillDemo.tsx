import { AdressPill } from '../src/components/atoms';
import { space } from '../src/field-ds';

// The pill is a translucent glass element meant to float over imagery, so the
// backdrops here (photo-like gradient + flat grey) reveal the 40% fill.
export default function AddressPillDemo() {
  return (
    <div
      style={{
        minHeight: '100vh',
        display: 'grid',
        gridTemplateRows: '1fr 1fr',
        boxSizing: 'border-box',
      }}
    >
      <Stage bg="linear-gradient(135deg, #6b7280 0%, #9ca3af 50%, #cbd5e1 100%)">
        <AdressPill name="Prasanna" />
      </Stage>
      <Stage bg="#4d4d4d">
        <AdressPill name="Prasanna" onPress={() => {}} />
      </Stage>
    </div>
  );
}

function Stage({ bg, children }: { bg: string; children: React.ReactNode }) {
  return (
    <div
      style={{
        background: bg,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: space[40],
        boxSizing: 'border-box',
      }}
    >
      {children}
    </div>
  );
}
