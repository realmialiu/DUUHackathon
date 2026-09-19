import StickerCard from './StickerCard';
import { SectionHeading } from './TopPerformanceCards';
import { getRecommendationForGoal, GOALS } from '../lib/recommendations';

export default function NextPostRecommendation({ goal }) {
  const rec = getRecommendationForGoal(goal);
  const goalLabel = GOALS.find((g) => g.id === goal)?.label || 'Maximize reach';

  return (
    <section className="mx-auto max-w-6xl px-6 py-10">
      <SectionHeading eyebrow="Section 4" title="What to post next" note={`Based on: ${goalLabel}`} />
      <StickerCard className="mt-6" tilt="tilt-2" tape>
        <div className="grid grid-cols-1 gap-8 md:grid-cols-[1.2fr_1fr]">
          <div>
            <p className="label-tag text-xs uppercase tracking-wide text-rust">Recommended next post</p>
            <h3 className="font-display mt-2 text-2xl leading-snug text-cream">{rec.idea}</h3>

            <dl className="mt-6 space-y-4 text-sm">
              <div>
                <dt className="label-tag text-creamdim">Format</dt>
                <dd className="mt-1 text-cream">{rec.format}</dd>
              </div>
              <div>
                <dt className="label-tag text-creamdim">Suggested hook</dt>
                <dd className="scrawl mt-1 text-xl text-rust">{rec.hook}</dd>
              </div>
              <div>
                <dt className="label-tag text-creamdim">Why</dt>
                <dd className="mt-1 leading-relaxed text-cream">{rec.why}</dd>
              </div>
            </dl>
          </div>

          <div className="space-y-4">
            <div className="rounded border border-moss/40 bg-moss/10 p-4">
              <p className="label-tag text-xs uppercase tracking-wide text-moss">Expected outcome</p>
              <p className="mt-2 text-sm leading-relaxed text-cream">{rec.expectedOutcome}</p>
            </div>
            <div className="rounded border border-cream/15 bg-charcoal2 p-4">
              <p className="label-tag text-xs uppercase tracking-wide text-creamdim">Metrics to track</p>
              <ul className="mt-2 space-y-1 text-sm text-cream">
                {rec.metrics.map((m) => (
                  <li key={m} className="flex items-center gap-2">
                    <span className="h-1.5 w-1.5 rounded-full bg-rust" />
                    {m}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </StickerCard>
    </section>
  );
}
