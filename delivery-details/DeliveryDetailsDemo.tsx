import { useState } from 'react';
import { DeliveryDetails } from '../src/components';
import { colour, space } from '../src/field-ds';

// Controlled expanded card — keeps the component props-in/callbacks-out.
function InteractiveDeliveryDetails() {
  const [expanded, setExpanded] = useState(true);
  const [leaveAtDoor, setLeaveAtDoor] = useState(true);
  return (
    <DeliveryDetails
      variant={expanded ? 'expanded' : 'minimised'}
      leaveAtDoor={leaveAtDoor}
      onToggleExpand={() => setExpanded((v) => !v)}
      onToggleLeaveAtDoor={setLeaveAtDoor}
    />
  );
}

export default function DeliveryDetailsDemo() {
  return (
    <div
      style={{
        minHeight: '100vh',
        boxSizing: 'border-box',
        backgroundColor: colour.surface.tertiary,
        display: 'flex',
        flexWrap: 'wrap',
        gap: space[24],
        alignItems: 'flex-start',
        justifyContent: 'center',
        padding: space[40],
      }}
    >
      <DeliveryDetails variant="minimised" />
      <InteractiveDeliveryDetails />
    </div>
  );
}
