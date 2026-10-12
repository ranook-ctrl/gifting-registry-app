import { Retune } from 'retune';
import { OrderStatusBar } from './components';

export default function GiftStatusBarDemo() {
  return (
    <div
      style={{
        minHeight: '100vh',
        display: 'flex',
        justifyContent: 'center',
        padding: '40px 0',
        background: 'linear-gradient(135deg, #f6f6fe 0%, #fff4f8 100%)',
      }}
    >
      <div style={{ display: 'flex', flexDirection: 'column', gap: 40, width: 375 }}>
        <OrderStatusBar variant="multiple" />
        <OrderStatusBar variant="single" />
        <OrderStatusBar variant="allDelivered" />
        <OrderStatusBar variant="gifter" />
      </div>
      <Retune />
    </div>
  );
}
