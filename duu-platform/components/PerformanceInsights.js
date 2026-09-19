import StickerCard from './StickerCard';
import { SectionHeading } from './TopPerformanceCards';
import {
  computeFormatComparison,
  computeReachSplit,
  computeSharesAndSaves,
  computeRetention,
  FORMATTERS,
} from '../lib/insights';

const { fmtInt, fmtPct } = FORMATTERS;

function Bar({ label, value, max, color = 'bg-rust' }) {
  const pct = max > 0 ? Math.max(4, Math.round((value / max) * 100)) : 0;
  return (
    <div>
      <div className="mb-1 flex items-baseline justify-between text-sm">
        <span className="text-creamdim">{label}</span>
        <span className="label-tag text-cream">{fmtPct(value)}</span>
      </div>
      <div className="h-3 w-full overflow-hidden rounded-full bg-charcoal2">
        <div className={`h-full ${color}`} style={{ width: `${pct}%` }} />
      </div>
    </div>
  );
}

export default function PerformanceInsights() {
  const format = computeFormatComparison();
  const reach = computeReachSplit();
  const sharesSaves = computeSharesAndSaves();
  const retention = computeRetention();

  return (
    <section className="mx-auto max-w-6xl px-6 py-10">
      <SectionHeading
        eyebrow="Section 2"
        title="Performance insights"
        note="Organized comparisons, not a raw column dump."
      />

      <div className="mt-6 grid grid-cols-1 gap-6 lg:grid-cols-2">
        {/* Reels vs feed posts */}
        <StickerCard tilt="tilt-2">
          <h3 className="font-display text-lg text-cream">Reels vs. carousels &amp; posts</h3>
          <p className="mt-1 text-sm text-creamdim">Average interaction rate and non-follower reach by format.</p>
          <div className="mt-5 space-y-4">
            <Bar
              label={`Reels avg. interaction rate (n=${format.reels.count})`}
              value={format.reels.avgInteractionRate || 0}
              max={Math.max(format.reels.avgInteractionRate || 0, format.feedPosts.avgInteractionRate || 0)}
              color="bg-rust"
            />
            <Bar
              label={`Carousels/posts avg. interaction rate (n=${format.feedPosts.count})`}
              value={format.feedPosts.avgInteractionRate || 0}
              max={Math.max(format.reels.avgInteractionRate || 0, format.feedPosts.avgInteractionRate || 0)}
              color="bg-moss"
            />
            <Bar
              label="Reels avg. non-follower views"
              value={format.reels.avgNonfollowerViews || 0}
              max={1}
              color="bg-rust"
            />
            <Bar
              label="Carousels/posts avg. non-follower views"
              value={format.feedPosts.avgNonfollowerViews || 0}
              max={1}
              color="bg-moss"
            />
          </div>
        </StickerCard>

        {/* Follower vs non-follower reach */}
        <StickerCard tilt="tilt-3">
          <h3 className="font-display text-lg text-cream">Follower vs. non-follower reach</h3>
          <p className="mt-1 text-sm text-creamdim">
            Share of views from non-followers, by post ({reach.sampleSize} posts with data).
          </p>
          <div className="mt-5 space-y-3">
            {reach.posts.map((p) => (
              <Bar key={p.id} label={p.label} value={p.nonfollowerViewsPct} max={1} color="bg-rust" />
            ))}
          </div>
        </StickerCard>

        {/* Shares & saves leaderboard */}
        <StickerCard tilt="tilt-1">
          <h3 className="font-display text-lg text-cream">Most shares &amp; saves</h3>
          <p className="mt-1 text-sm text-creamdim">Combined shares + saves, top 5.</p>
          <ol className="mt-5 space-y-3">
            {sharesSaves.map((p, i) => (
              <li key={p.id} className="flex items-center justify-between gap-3 border-b border-dashed border-cream/10 pb-2">
                <div className="flex items-center gap-3">
                  <span className="scrawl text-2xl text-rust">{i + 1}</span>
                  <span className="text-sm text-cream">{p.label}</span>
                </div>
                <span className="label-tag whitespace-nowrap text-sm text-creamdim">
                  {fmtInt(p.shares)} shares · {fmtInt(p.saves)} saves
                </span>
              </li>
            ))}
          </ol>
        </StickerCard>

        {/* Retention */}
        <StickerCard tilt="tilt-4">
          <h3 className="font-display text-lg text-cream">Reel retention (skip rate)</h3>
          <p className="mt-1 text-sm text-creamdim">Lower is better — sorted strongest to weakest.</p>
          <ol className="mt-5 space-y-3">
            {retention.map((r) => (
              <li key={r.id} className="border-b border-dashed border-cream/10 pb-2">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-cream">{r.label}</span>
                  <span className="label-tag text-creamdim">{fmtPct(r.skipRate)}</span>
                </div>
                {r.delta !== null && (
                  <p className={`mt-1 text-xs ${r.delta < 0 ? 'text-moss' : 'text-rust'}`}>
                    {r.delta < 0 ? 'Below' : 'Above'} typical ({fmtPct(r.typicalSkipRate)}) by {fmtPct(Math.abs(r.delta))}
                  </p>
                )}
              </li>
            ))}
          </ol>
        </StickerCard>
      </div>
    </section>
  );
}
