import { SectionHeading } from './TopPerformanceCards';

const FUTURE_FIELDS = [
  'Event registrations',
  'Attendance',
  'QR-code scans',
  'Artist-profile clicks',
  'Music-platform clicks',
  'Streams',
  'Link clicks',
];

export default function FutureMeasurement() {
  return (
    <section className="mx-auto max-w-6xl px-6 py-10">
      <SectionHeading eyebrow="Section 8" title="What to measure next" />
      <div className="mt-6 rounded border-2 border-dashed border-cream/15 bg-charcoal2 p-6">
        <p className="text-sm leading-relaxed text-creamdim">
          None of the following are in the current dataset. Connecting them would let DUU tie content directly to
          real-world outcomes, not just Instagram engagement.
        </p>
        <div className="mt-4 flex flex-wrap gap-2">
          {FUTURE_FIELDS.map((f) => (
            <span
              key={f}
              className="label-tag rounded-full border border-cream/20 bg-ink px-3 py-1.5 text-xs text-creamdim"
            >
              {f}
            </span>
          ))}
        </div>
      </div>
    </section>
  );
}
