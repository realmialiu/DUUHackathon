import { generateLocalIdeas } from '../../lib/aiFallback';
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
    const ideas = generateLocalIdeas(goalText);
    res.status(200).json({ source: 'local', ideas });
    return;
  }

  try {
    const Anthropic = (await import('@anthropic-ai/sdk')).default;
    const client = new Anthropic({ apiKey });

    const system = `You are a social media strategist for a college music collective (Small Town Records / DUU Tech). ${DATASET_CONTEXT_PROMPT()}\n\nGenerate NEW content ideas grounded in these performance signals — do not simply restate past posts. Always respond with ONLY valid JSON, no markdown fences, no preamble, matching this exact shape:\n{"ideas": [{"title": string, "format": string, "hook": string, "captionConcept": string, "targetAudience": string, "expectedOutcome": string, "metrics": string[], "whyItFits": string}, ...]} with exactly 3 ideas.`;

    const message = await client.messages.create({
      model: 'claude-sonnet-4-6',
      max_tokens: 1500,
      system,
      messages: [
        {
          role: 'user',
          content: `Goal: ${goalText || 'Promote an upcoming STR event and grow engagement'}\n\nGenerate 3 content ideas as JSON.`,
        },
      ],
    });

    const textBlock = message.content.find((b) => b.type === 'text');
    const raw = textBlock ? textBlock.text : '{}';
    const cleaned = raw.replace(/```json|```/g, '').trim();
    const parsed = JSON.parse(cleaned);

    if (!parsed.ideas || !Array.isArray(parsed.ideas) || parsed.ideas.length === 0) {
      throw new Error('Malformed AI response');
    }

    res.status(200).json({ source: 'ai', ideas: parsed.ideas });
  } catch (err) {
    console.error('generate-ideas AI error, falling back to local:', err.message);
    const ideas = generateLocalIdeas(goalText);
    res.status(200).json({ source: 'local-fallback', ideas, note: 'AI request failed; showing rule-based ideas instead.' });
  }
}
