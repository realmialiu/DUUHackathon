# DUU Tech × Small Town Records — Content Decisions

A single-page MVP that turns Instagram performance data into content decisions: top
performers, organized insights, plain-language "observed signals," a goal-based
next-post recommendation, and two AI generators (content ideas + a multi-post
campaign) that fall back to a built-in rule-based generator when no AI API key
is configured.

## What's in this project

```
pages/
  index.js              the entire dashboard (single page, 8 sections)
  api/generate-ideas.js       AI idea generator endpoint (+ local fallback)
  api/generate-campaign.js    AI campaign generator endpoint (+ local fallback)
components/              one file per dashboard section
lib/
  rawPosts.js            the Instagram dataset, converted to a JS array
  insights.js            all ranking / comparison / signal computation
  recommendations.js     goal → next-post recommendation logic
  aiFallback.js           local, rule-based idea & campaign generator
data/
  Instagram_Insights_Dataset.xlsx   the original source file, kept for reference
.env.example             copy to .env.local and add a key if you want live AI
```

## How the data flows

1. `data/Instagram_Insights_Dataset.xlsx` is the original 12-row export (kept
   for reference/auditing — it is not read at runtime).
2. `lib/rawPosts.js` is that same data as a plain JS array, used by the app.
3. `lib/insights.js` computes everything the dashboard shows — top posts,
   format comparisons, reach splits, retention, and the "What we learned"
   signals — from that array. Nothing is hardcoded from a screenshot; every
   number recalculates from the array in `rawPosts.js`.
4. Two rows in the dataset ("unmatched_audience_001/002") have no post-level
   metrics at all and are excluded from every ranking, but stay in the data
   file. A few fields are missing on individual posts (e.g. `profile_visits`,
   `typical_skip_rate`) — these are treated as unknown and simply left out of
   the relevant comparison, never treated as zero.

## Running it

Requires Node.js 18+.

```bash
npm install
npm run dev
```

Open http://localhost:3000.

To build and run a production version:

```bash
npm run build
npm run start
```

## Using real AI generation (optional)

By default there is no API key configured, and both generators use a
built-in, rule-based fallback that is still grounded in the dataset's top
performers and signals — the app is fully functional with zero setup.

To turn on live AI generation:

```bash
cp .env.example .env.local
# then edit .env.local and set:
# ANTHROPIC_API_KEY=sk-ant-...
```

Restart `npm run dev` / `npm run start` after adding the key. If the key is
missing, invalid, or the request fails for any reason, the app automatically
falls back to the local generator rather than showing an error — you'll see a
small "Generated locally" note under the results either way, so it's always
clear which path produced them.

`.env` and `.env.local` are already git-ignored — never commit a real key.

## Updating the dataset

Swap in a new export by regenerating `lib/rawPosts.js` from a new Excel file
(any script that reads the sheet with `pandas`/`openpyxl` and writes the rows
out as a JS array in the same shape works), or edit the array by hand for a
quick tweak. Every card, chart, and signal recalculates automatically — no
other file needs to change unless a field is renamed.

## What to check when demoing (under 3 minutes)

1. **Header** — goal selector. Click a different goal and watch Section 4
   ("What to post next") change its recommendation.
2. **Top performers** — six cards, each with a plain-language "why it
   matters."
3. **Performance insights** — Reels vs. carousels, follower/non-follower
   reach, shares & saves leaderboard, retention.
4. **What we learned** — 3–5 observed signals, explicitly labeled as
   directional given the small dataset.
5. **What to post next** — changes with the goal selector.
6. **AI idea generator** — type a goal, generate 3 ideas.
7. **AI campaign generator** — click generate, scroll through the 6-post
   campaign.
8. **What to measure next** — fields not yet in the dataset (registrations,
   attendance, QR scans, etc.), stated plainly as future work.

## Notes on scope

This is intentionally an MVP: no Instagram authentication, no scheduling or
auto-posting, no database — the dataset is static and bundled with the app.
The AI generation endpoints are the only server-side logic, and they never
expose the API key to the browser (it's read from `process.env` only inside
the API routes).
