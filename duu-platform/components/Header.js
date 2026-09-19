import { GOALS } from '../lib/recommendations';

export default function Header({ goal, setGoal }) {
  return (
    <header className="relative overflow-hidden border-b-2 border-cream/10 bg-ink">
      <div className="absolute -right-16 -top-24 h-72 w-72 halftone-disc opacity-70" />
      <div className="absolute right-10 top-6 h-6 w-6 rounded-full border-2 border-cream/40" />
      <div className="relative mx-auto max-w-6xl px-6 py-10 sm:py-14">
        <div className="flex flex-wrap items-baseline gap-3">
          <span className="label-tag rounded border border-moss/60 bg-moss/20 px-2 py-1 text-xs text-moss">
            DUU Tech × Small Town Records
          </span>
        </div>
        <h1 className="font-display mt-4 max-w-2xl text-4xl leading-[1.05] text-cream sm:text-5xl">
          What should STR post next?
        </h1>
        <p className="scrawl mt-3 max-w-xl text-2xl text-rust">
          Turn Instagram performance into the next best content decision.
        </p>

        <div className="mt-8">
          <p className="label-tag mb-2 text-xs uppercase tracking-wide text-creamdim">
            What are you optimizing for right now?
          </p>
          <div className="flex flex-wrap gap-2">
            {GOALS.map((g) => {
              const active = g.id === goal;
              return (
                <button
                  key={g.id}
                  onClick={() => setGoal(g.id)}
                  className={`label-tag rounded-full border px-4 py-2 text-sm transition-colors ${
                    active
                      ? 'border-rust bg-rust text-cream shadow-[3px_3px_0_rgba(0,0,0,0.35)]'
                      : 'border-cream/20 bg-charcoal2 text-creamdim hover:border-cream/40 hover:text-cream'
                  }`}
                >
                  {g.label}
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </header>
  );
}
