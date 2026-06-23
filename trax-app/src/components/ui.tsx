import type { Ampel } from '../types';

export const AMPEL_LABEL: Record<Ampel, string> = {
  gruen: 'On Track',
  gelb: 'Aufmerksamkeit',
  rot: 'Kritisch',
};

export function AmpelPill({ ampel }: { ampel: Ampel }) {
  return (
    <span className={`pill ${ampel}`}>
      <span className={`dot ${ampel}`} />
      {AMPEL_LABEL[ampel]}
    </span>
  );
}

export function Dot({ ampel }: { ampel: Ampel }) {
  return <span className={`dot ${ampel}`} />;
}
