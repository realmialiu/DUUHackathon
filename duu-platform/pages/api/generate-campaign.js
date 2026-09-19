import { generateLocalCampaign } from '../../lib/aiFallback';
import { computeTopPerformers, computeLearnedSignals } from '../../lib/insights';

const DATASET_CONTEXT_PROMPT = () => {
  const top = computeTopPerformers();
  const signals = computeLearnedSignals();
  const topLines = top
    .filter((t) => t.post)
    .map((t) => `- ${t.title}: "${t.post.label}" (${t.metric})`)
    .join('\n');
  return `Here is a small Instagram performance dataset for a college-affiliated music collective ("DUU Tech" / "Small Town Records", STR):\n\nTop performers:\n${topLines}\n\nObserved signals (small dataset, directional not statistical):\n${signals.map((s) => `- ${s}`).join('\n')}`;
};

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.status(405).json({ error: 'Method not allowed' });
    return;
  }

  const { goal } = req.body || {};
  const goalText = typeof goal === 'string' ? goal.slice(0, 500) : '';

  const apiKey = process.env.ANTHROPIC_API_KEY;

  if (!apiKey) {
    const campaign = generateLocalCampaign(goalText);
    res.status(200).json({ source: 'local', campaign });
    return;
  }

  try {
    const Anthropic = (await import('@anthropic-ai/sdk')).default;
    const client = new Anthropic({ apiKey });

    const system = `You are a social media strategist for a college music collective (Small Town Records / DUU Tech). ${DATASET_CONTEXT_PROMPT()}\n\nDesign a NEW six-post campaign grounded in these performance signals. Always respond with ONLY valid JSON, no markdown fences, no preamble, matching this exact shape:\n{"posts": [{"stage": string, "format": string, "idea": string, "hook": string, "cta": string, "goal": string, "metric": string}, ...]} with exactly 6 posts in this order: Teaser, Artist or student spotlight, Main event announcement, Reminder post, Day-of content, Follow-up post.`;

    const message = await client.messages.create({
      model: 'claude-sonnet-4-6',
      max_tokens: 2000,
      system,
      messages: [
        {
          role: 'user',
          content: `Campaign goal: ${goalText || 'Promote an upcoming STR event and maximize attendance'}\n\nGenerate the 6-post campaign as JSON.`,
        },
      ],
    });

    const textBlock = message.content.find((b) => b.type === 'text');
    const raw = textBlock ? textBlock.text : '{}';
    const cleaned = raw.replace(/```json|```/g, '').trim();
    const parsed = JSON.parse(cleaned);

    if (!parsed.posts || !Array.isArray(parsed.posts) || parsed.posts.length === 0) {
      throw new Error('Malformed AI response');
    }

    res.status(200).json({ source: 'ai', campaign: { goal: goalText, posts: parsed.posts } });
  } catch (err) {
    console.error('generate-campaign AI error, falling back to local:', err.message);
    const campaign = generateLocalCampaign(goalText);
    res.status(200).json({ source: 'local-fallback', campaign, note: 'AI request failed; showing rule-based campaign instead.' });
  }
}
