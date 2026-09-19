import StickerCard from './StickerCard';
import { computeTopPerformers } from '../lib/insights';

const TILTS = ['tilt-1', 'tilt-2', 'tilt-3', 'tilt-4', 'tilt-1', 'tilt-3'];
const TYPE_LABEL = {
  reel: 'Reel',
  carousel: 'Carousel',
  post_or_carousel: 'Post / Carousel',
};

export default function TopPerformanceCards() {
  const cards = computeTopPerformers();

  return (
    <section className="mx-auto max-w-6xl px-6 py-10">
      <SectionHeading eyebrow="Section 1" title="Top performers" />
      <div className="mt-6 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {cards.map((c, i) => (
          <StickerCard key={c.key} tilt={TILTS[i % TILTS.length]} tape pin={i % 2 === 0}>
            <p className="label-tag text-xs uppercase tracking-wide text-rust">{c.title}</p>
            {c.post ? (
              <>
                <h3 className="font-display mt-2 text-lg leading-snug text-cream">{c.post.label}</h3>
                <span className="label-tag mt-2 inline-block rounded border border-moss/50 bg-moss/15 px-2 py-0.5 text-xs text-moss">
                  {TYPE_LABEL[c.post.type] || c.post.type}
                </span>
                <p className="scrawl mt-3 text-3xl text-cream">{c.metric}</p>
                <p className="mt-3 text-sm leading-relaxed text-creamdim">{c.why}</p>
              </>
            ) : (
              <p className="mt-4 text-sm text-creamdim">Not enough data for this metric yet.</p>
            )}
          </StickerCard>
        ))}
      </div>
    </section>
  );
}

export function SectionHeading({ eyebrow, title, note }) {
  return (
    <div className="flex flex-wrap items-end justify-between gap-3 border-b-2 border-dashed border-cream/15 pb-3">
      <div>
        <p className="scrawl text-lg text-rust">{eyebrow}</p>
        <h2 className="font-display text-2xl text-cream sm:text-3xl">{title}</h2>
      </div>
      {note && <p className="max-w-sm text-sm text-creamdim">{note}</p>}
    </div>
  );
}
