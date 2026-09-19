import { SectionHeading } from './TopPerformanceCards';
import { computeLearnedSignals } from '../lib/insights';

const TILTS = ['tilt-1', 'tilt-3', 'tilt-2', 'tilt-4', 'tilt-1'];

export default function LearnedSignals() {
  const signals = computeLearnedSignals();

  return (
    <section className="mx-auto max-w-6xl px-6 py-10">
      <SectionHeading
        eyebrow="Section 3"
        title="What we learned"
        note="Labeled &ldquo;observed signals&rdquo; — the dataset is small, so read these as directional, not statistically proven."
      />
      <div className="mt-6 grid grid-cols-1 gap-5 sm:grid-cols-2">
        {signals.map((s, i) => (
          <div
            key={i}
            className={`sticker-card ${TILTS[i % TILTS.length]} bg-moss/10 p-5`}
            style={{ borderColor: 'rgba(111,122,79,0.4)' }}
          >
            <span className="label-tag rounded border border-moss/50 bg-charcoal px-2 py-0.5 text-[10px] uppercase tracking-wide text-moss">
              Observed signal
            </span>
            <p className="mt-3 text-sm leading-relaxed text-cream">{s}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
