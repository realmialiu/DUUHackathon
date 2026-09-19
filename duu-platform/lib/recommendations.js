export const GOALS = [
  { id: 'reach', label: 'Maximize reach' },
  { id: 'shares', label: 'Increase shares' },
  { id: 'retention', label: 'Improve Reel retention' },
  { id: 'discovery', label: 'Increase artist discovery' },
  { id: 'event', label: 'Promote an upcoming event' },
  { id: 'registrations', label: 'Increase event registrations' },
];

// Each recommendation is written to point back at a specific data point
// from the dataset, not a generic best practice.
export const NEXT_POST_RECOMMENDATIONS = {
  reach: {
    idea: 'A multi-collaborator carousel recapping an upcoming event, tagging every co-hosting account (artists, clubs, venue).',
    format: 'Carousel (4–6 slides), cross-posted with collaborators',
    hook: 'Slide 1: "You\'re invited — here\'s everything happening at [event]."',
    why: 'The Duke Music Day carousel with multiple tagged collaborators drew 30,158 views — by far the largest reach in the dataset, roughly 4x the next-closest post. Tagging multiple accounts appears to be the single strongest reach lever observed.',
    expectedOutcome: 'Reach in the range of the top-performing carousel, driven by each collaborator\'s audience seeing the post via their own tag notification.',
    metrics: ['Views', 'Follower vs. non-follower view split', 'Reach by traffic source (explore, profile, tagged)'],
  },
  shares: {
    idea: 'A save-and-send-worthy carousel: a clean event lineup graphic or "who\'s playing" reveal, styled for screenshotting.',
    format: 'Carousel, first slide is the standalone graphic',
    hook: '"Tag the friend you\'re bringing."',
    why: 'The Duke Music Day carousel produced 226 shares and 28 saves — roughly 10x the shares of any other post. Event-lineup, tag-a-friend content is the clearest share driver in the data.',
    expectedOutcome: 'Shares meaningfully above the ~5–20 range seen on typical posts, approaching the top performer.',
    metrics: ['Shares', 'Saves', 'Reposts'],
  },
  retention: {
    idea: 'A fast-cut Reel that states the point in the first 2 seconds — no logo intro, no slow build.',
    format: 'Reel, 6–10 seconds',
    hook: 'Open on the payoff line first (e.g. the event date or artist name), explain second.',
    why: '"Let the STR reels era begin" had a skip rate of 35.7% against a typical 61.1% for similar content — the strongest retention observed — and it opens immediately, runs only 6 seconds, and reached 88.5% non-followers. By contrast, the two reels with slower openings had skip rates of 69–71%.',
    expectedOutcome: 'Skip rate closer to the ~36% seen on the strongest reel, well under the ~60–70% typical range.',
    metrics: ['Skip rate vs. typical skip rate', 'Average watch time', 'Watch time as % of duration'],
  },
  discovery: {
    idea: 'A short Reel introducing one STR artist — face, sound, and one memorable detail — with a light event tie-in at the end.',
    format: 'Reel, 10–15 seconds',
    hook: '"Meet [artist] — you\'ll want to remember this name."',
    why: 'Reels in this dataset reached non-followers at a much higher rate than feed posts (Reels averaged well over 80% non-follower views vs. lower rates for carousels), making Reels the strongest discovery format observed.',
    expectedOutcome: 'A meaningful share of viewers who are new to the account, plus incremental profile visits and follows.',
    metrics: ['Non-follower view %', 'Profile visits', 'Follows', 'Traffic from Explore / Reels tab'],
  },
  event: {
    idea: 'Pair two posts: a Reel introducing an artist tied to the event, and a carousel with the full event details and every collaborator tagged.',
    format: 'Reel + Carousel combo',
    hook: 'Reel: "Meet the artist playing [event]." Carousel: "Everything you need to know about [event]."',
    why: 'This combines the two strongest signals in the dataset: Reels reach the most non-followers (discovery), and tagged multi-account carousels drive the most reach and shares (distribution). Used together they cover both new-audience discovery and existing-audience amplification.',
    expectedOutcome: 'Broader awareness among people who don\'t already follow the account, plus higher-intent shares among people who do.',
    metrics: ['Views', 'Shares', 'Profile visits', 'External link taps', 'Non-follower reach'],
  },
  registrations: {
    idea: 'A direct, plainly-worded Reel or post stating the action and deadline clearly, with a link-in-bio call to action.',
    format: 'Reel (15–20 sec) or single post',
    hook: '"[Action] closes [date] — here\'s the link."',
    why: '"Artist Manager Applications Close" had the highest interaction rate in the dataset (3.13%) despite modest reach, showing that direct, deadline-driven messaging converts attention into action efficiently. Profile activity and link taps are the metrics DUU should watch most closely for a registration push.',
    expectedOutcome: 'A high interaction rate relative to reach, plus a measurable rise in profile visits and link clicks in the day the post goes up.',
    metrics: ['Profile visits', 'External link taps', 'Follows', 'Interaction rate'],
  },
};

export function getRecommendationForGoal(goalId) {
  return NEXT_POST_RECOMMENDATIONS[goalId] || NEXT_POST_RECOMMENDATIONS.reach;
}
