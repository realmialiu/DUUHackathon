import RAW_POSTS from './rawPosts';

// Only rows that represent an actual identifiable piece of content.
// The two "unmatched_audience" rows carry no post metrics at all, and the
// two "unknown" screenshots have no content_label worth surfacing as a
// ranked post — they're kept in the raw dataset but excluded from rankings.
const USABLE_TYPES = new Set(['post_or_carousel', 'carousel', 'reel']);

export function getUsablePosts() {
  return RAW_POSTS.filter((p) => USABLE_TYPES.has(p.type));
}

export function getAllPosts() {
  return RAW_POSTS;
}

function topBy(posts, field, opts = {}) {
  const { filter } = opts;
  const pool = posts.filter((p) => p[field] !== null && p[field] !== undefined && (!filter || filter(p)));
  if (pool.length === 0) return null;
  return pool.reduce((best, p) => (p[field] > best[field] ? p : best), pool[0]);
}

function fmtInt(n) {
  if (n === null || n === undefined) return '—';
  return Math.round(n).toLocaleString('en-US');
}

function fmtPct(n, digits = 1) {
  if (n === null || n === undefined) return '—';
  return `${(n * 100).toFixed(digits)}%`;
}

export function computeTopPerformers() {
  const posts = getUsablePosts();
  const reels = posts.filter((p) => p.type === 'reel');

  const topViews = topBy(posts, 'views');
  const topInteractions = topBy(posts, 'interactions');
  const topShares = topBy(posts, 'shares');
  const topInteractionRate = topBy(posts, 'interactionRate');
  const bestReel = topBy(reels, 'interactions');
  const highestSkipReel = topBy(reels, 'skipRate');

  return [
    {
      key: 'views',
      title: 'Top post by views',
      post: topViews,
      metric: topViews ? `${fmtInt(topViews.views)} views` : 'No data',
      why: 'Raw reach — how many accounts saw this content at all, regardless of who engaged.',
    },
    {
      key: 'interactions',
      title: 'Top post by interactions',
      post: topInteractions,
      metric: topInteractions ? `${fmtInt(topInteractions.interactions)} interactions` : 'No data',
      why: 'Total likes, comments, shares, reposts and saves combined — the clearest single signal of overall engagement.',
    },
    {
      key: 'shares',
      title: 'Top post by shares',
      post: topShares,
      metric: topShares ? `${fmtInt(topShares.shares)} shares` : 'No data',
      why: 'Shares mean people found it worth sending to someone else — the strongest word-of-mouth signal in the data.',
    },
    {
      key: 'interactionRate',
      title: 'Top post by interaction rate',
      post: topInteractionRate,
      metric: topInteractionRate ? `${fmtPct(topInteractionRate.interactionRate, 2)} of viewers engaged` : 'No data',
      why: 'Engagement relative to how many people actually saw it — small reach can still mean a resonant post.',
    },
    {
      key: 'bestReel',
      title: 'Best-performing Reel',
      post: bestReel,
      metric: bestReel ? `${fmtInt(bestReel.interactions)} interactions` : 'No data',
      why: 'Highest total engagement among Reels specifically — the format DUU is scaling.',
    },
    {
      key: 'skipRate',
      title: 'Reel with the highest skip rate',
      post: highestSkipReel,
      metric: highestSkipReel ? `${fmtPct(highestSkipReel.skipRate)} skipped` : 'No data',
      why: 'The share of viewers who scrolled past before it finished — usually a sign the opening seconds need work.',
    },
  ];
}

export function computeFormatComparison() {
  const posts = getUsablePosts();
  const reels = posts.filter((p) => p.type === 'reel');
  const feedPosts = posts.filter((p) => p.type !== 'reel');

  const avg = (arr, field) => {
    const vals = arr.map((p) => p[field]).filter((v) => v !== null && v !== undefined);
    if (vals.length === 0) return null;
    return vals.reduce((a, b) => a + b, 0) / vals.length;
  };

  return {
    reels: {
      count: reels.length,
      avgInteractionRate: avg(reels, 'interactionRate'),
      avgNonfollowerViews: avg(reels, 'nonfollowerViewsPct'),
      avgViews: avg(reels, 'views'),
    },
    feedPosts: {
      count: feedPosts.length,
      avgInteractionRate: avg(feedPosts, 'interactionRate'),
      avgNonfollowerViews: avg(feedPosts, 'nonfollowerViewsPct'),
      avgViews: avg(feedPosts, 'views'),
    },
  };
}

export function computeReachSplit() {
  const posts = getUsablePosts().filter(
    (p) => p.followerViewsPct !== null && p.nonfollowerViewsPct !== null
  );
  const avg = (field) => posts.reduce((a, p) => a + p[field], 0) / posts.length;
  return {
    sampleSize: posts.length,
    avgFollowerViews: posts.length ? avg('followerViewsPct') : null,
    avgNonfollowerViews: posts.length ? avg('nonfollowerViewsPct') : null,
    posts: posts
      .map((p) => ({ id: p.id, label: p.label, type: p.type, nonfollowerViewsPct: p.nonfollowerViewsPct }))
      .sort((a, b) => b.nonfollowerViewsPct - a.nonfollowerViewsPct),
  };
}

export function computeSharesAndSaves() {
  const posts = getUsablePosts().filter((p) => p.shares !== null || p.saves !== null);
  return posts
    .map((p) => ({
      id: p.id,
      label: p.label,
      type: p.type,
      shares: p.shares,
      saves: p.saves,
      combined: (p.shares || 0) + (p.saves || 0),
    }))
    .sort((a, b) => b.combined - a.combined)
    .slice(0, 5);
}

export function computeRetention() {
  const reels = getUsablePosts().filter((p) => p.type === 'reel' && p.skipRate !== null);
  return reels
    .map((p) => ({
      id: p.id,
      label: p.label,
      skipRate: p.skipRate,
      typicalSkipRate: p.typicalSkipRate,
      delta: p.typicalSkipRate !== null ? p.skipRate - p.typicalSkipRate : null,
      avgWatchTimeSec: p.avgWatchTimeSec,
      durationSec: p.durationSec,
    }))
    .sort((a, b) => a.skipRate - b.skipRate);
}

export function computeLearnedSignals() {
  const format = computeFormatComparison();
  const reach = computeReachSplit();
  const retention = computeRetention();
  const top = computeTopPerformers();
  const signals = [];

  const topViewsPost = top.find((t) => t.key === 'views')?.post;
  if (topViewsPost) {
    signals.push(
      `"${topViewsPost.label}" generated the highest overall reach (${fmtInt(topViewsPost.views)} views) and highest shares (${fmtInt(topViewsPost.shares)}) in the dataset — the carousel format tied to a named event and multiple collaborator accounts appears to compound distribution.`
    );
  }

  const strongRetentionReel = retention.find((r) => r.delta !== null && r.delta < 0);
  if (strongRetentionReel) {
    signals.push(
      `The Reel "${strongRetentionReel.label}" had a skip rate well below what's typical (${fmtPct(strongRetentionReel.skipRate)} vs. a typical ${fmtPct(strongRetentionReel.typicalSkipRate)}), and reached a large share of non-followers — a strong pairing of retention and discovery.`
    );
  }

  if (format.reels.avgNonfollowerViews !== null && format.feedPosts.avgNonfollowerViews !== null) {
    signals.push(
      `Reels reached non-followers at a higher average rate (${fmtPct(format.reels.avgNonfollowerViews)}) than feed posts and carousels (${fmtPct(format.feedPosts.avgNonfollowerViews)}), suggesting Reels are doing more discovery work than feed content right now.`
    );
  }

  const highRateLowReach = getUsablePosts()
    .filter((p) => p.interactionRate !== null && p.views !== null)
    .sort((a, b) => b.interactionRate - a.interactionRate)[0];
  if (highRateLowReach) {
    signals.push(
      `"${highRateLowReach.label}" had a comparatively small audience (${fmtInt(highRateLowReach.views)} views) but the highest interaction rate in the dataset (${fmtPct(highRateLowReach.interactionRate, 2)}), showing that direct, specific messages can spark disproportionate engagement even without broad reach.`
    );
  }

  const weakRetentionReel = [...retention].sort((a, b) => b.skipRate - a.skipRate)[0];
  if (weakRetentionReel) {
    signals.push(
      `The Reel "${weakRetentionReel.label}" had the highest skip rate observed (${fmtPct(weakRetentionReel.skipRate)}), suggesting the opening seconds may need a faster hook.`
    );
  }

  return signals;
}

export const FORMATTERS = { fmtInt, fmtPct };
