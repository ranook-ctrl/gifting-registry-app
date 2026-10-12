import { BirthdayBackground } from '../src/components';

export default function BirthdayBackgroundDemo() {
  return (
    <div
      style={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: '#f4f4f5',
        padding: 40,
      }}
    >
      <div
        style={{
          width: 375,
          height: 416,
          borderRadius: 16,
          overflow: 'hidden',
          boxShadow: '0 12px 40px rgba(0,0,0,0.18)',
        }}
      >
        <BirthdayBackground width={375} height={416} />
      </div>
    </div>
  );
}
