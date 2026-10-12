import React from 'react';
import { colors, type } from './_shared';
import { OccassionDate, type OccassionDateProps } from './OccassionDate';

export interface PageTitleProps extends OccassionDateProps {
  /** Occasion heading, e.g. "Our Eid Celebration". */
  title?: string;
}

/** "Page Title" — centred H28 heading stacked over the Occassion Date row. */
export function PageTitle({ title = 'Our Eid Celebration', ...occasion }: PageTitleProps) {
  return (
    <div style={container}>
      <span style={titleStyle}>{title}</span>
      <OccassionDate {...occasion} />
    </div>
  );
}

const container: React.CSSProperties = { display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4 };
const titleStyle: React.CSSProperties = { ...type.h28Bold, color: colors.text.primary, textAlign: 'center' };
