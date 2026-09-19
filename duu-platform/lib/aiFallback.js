// Deterministic, rule-based generator. Used whenever ANTHROPIC_API_KEY is not
// set, so the app is always fully functional without an API key. It reuses
// the same grounded data points as the recommendation engine, but produces
// three distinct ideas and a six-post campaign shaped by the user's typed
// goal text (simple keyword matching, not a model).

const ANGLES = [
  {
    tag: 'artist-forward',
    format: 'Reel (10–15 sec)',
    hook: 'Open on the artist mid-performance or mid-sentence — no title card first.',
    audience: 'Non-followers who discover through Reels / Explore',
  },
  {
    tag: 'event-forward',
    format: 'Carousel (4–6 slides), multiple collaborators tagged',
    hook: 'Slide 1 states the who/what/when in one line.',
    audience: 'Existing followers and their networks (share-driven)',
  },
  {
    tag: 'direct-CTA',
    format: 'Single post or short Reel with clear on-screen text',
    hook: 'State the action and deadline in the first line, no preamble.',
    audience: 'People already aware of STR, ready to act',
  },
];

function cleanGoalText(goalText) {
  return (goalText || '').trim();
}

export function generateLocalIdeas(goalText) {
  const goal = cleanGoalText(goalText) || 'grow reach and engagement for an upcoming STR event';

  return ANGLES.map((angle, i) => {
    const idx = i + 1;
    return {
      title: `Idea ${idx}: ${angle.tag === 'artist-forward'
        ? 'Artist spotlight tied to the goal'
        : angle.tag === 'event-forward'
        ? 'Tagged event carousel'
        : 'Direct call-to-action post'}`,
      format: angle.format,
      hook: angle.hook,
      captionConcept: `Short, direct caption naming the goal plainly (e.g. "${goal}") followed by one concrete detail (date, artist, or link) and a one-line CTA.`,
      targetAudience: angle.audience,
      expectedOutcome:
        angle.tag === 'artist-forward'
          ? 'Increased reach among non-followers and stronger artist recognition.'
          : angle.tag === 'event-forward'
          ? 'Higher shares and saves, and reach extended through collaborator tags.'
          : 'Higher interaction rate and more direct actions (link taps, profile visits).',
      metrics:
        angle.tag === 'artist-forward'
          ? ['Non-follower view %', 'Profile visits', 'Follows']
          : angle.tag === 'event-forward'
          ? ['Shares', 'Saves', 'Views']
          : ['Interaction rate', 'External link taps', 'Profile visits'],
      whyItFits:
        angle.tag === 'artist-forward'
          ? 'Reels in the dataset reached non-followers at the highest rate of any format observed — the best lever for discovery-shaped goals.'
          : angle.tag === 'event-forward'
          ? 'The single highest-reach and highest-share post in the dataset was a multi-collaborator event carousel, by a wide margin.'
          : 'The highest interaction rate in the dataset came from a short, direct, deadline-driven post rather than a broad-reach one.',
    };
  });
}

const CAMPAIGN_TEMPLATE = [
  {
    stage: 'Teaser',
    format: 'Reel (6–10 sec)',
    idea: 'Quick, low-context teaser — a sound clip, a date reveal, or a single visual — no full explanation yet.',
    hook: 'Open mid-action; text on screen says only "Something\'s coming."',
    cta: 'Follow for the reveal.',
    goal: 'Build early curiosity without spending the full story yet.',
    metric: 'Watch time / skip rate',
  },
  {
    stage: 'Artist or student spotlight',
    format: 'Reel (10–15 sec)',
    idea: 'Introduce a specific artist or student organizer by name and personality, one memorable detail each.',
    hook: '"Meet [name] — you\'ll want to remember this."',
    cta: 'Tap the link in bio to learn more.',
    goal: 'Drive discovery among non-followers via a human, specific story.',
    metric: 'Non-follower view %, profile visits',
  },
  {
    stage: 'Main event announcement',
    format: 'Carousel (4–6 slides), all collaborators tagged',
    idea: 'Full event details in one place: who, what, when, where, and why it matters.',
    hook: 'Slide 1: the event name and date, nothing else.',
    cta: 'Save this post and register at the link in bio.',
    goal: 'Maximize reach and shares using the tagged-carousel format that performed best historically.',
    metric: 'Views, shares, saves',
  },
  {
    stage: 'Reminder post',
    format: 'Single post or story-style Reel',
    idea: 'A short, plain reminder with the date and a sense of urgency ("this week", "tomorrow").',
    hook: '"[X] days left."',
    cta: 'Register now — link in bio.',
    goal: 'Convert people who saw earlier posts but haven\'t acted yet.',
    metric: 'External link taps, profile visits',
  },
  {
    stage: 'Day-of content',
    format: 'Reel or live-style story sequence',
    idea: 'Real-time energy — crowd, sound check, arrival shots. Minimal editing, high immediacy.',
    hook: 'Open on ambient sound/crowd, then one line of on-screen text.',
    cta: 'Tag yourself / share your story.',
    goal: 'Capture proof-of-life content for future recaps and show momentum to people who didn\'t attend.',
    metric: 'Shares, story replies',
  },
  {
    stage: 'Follow-up post',
    format: 'Carousel or Reel recap',
    idea: 'Best moments recap — photos or clips from the event plus a thank-you to collaborators.',
    hook: '"That\'s a wrap on [event]."',
    cta: 'Follow for what\'s next.',
    goal: 'Sustain engagement and set up the next event in the pipeline.',
    metric: 'Views, follows, saves',
  },
];

export function generateLocalCampaign(goalText) {
  const goal = cleanGoalText(goalText) || 'promote an upcoming STR event';
  return {
    goal,
    posts: CAMPAIGN_TEMPLATE.map((p) => ({ ...p })),
  };
}
