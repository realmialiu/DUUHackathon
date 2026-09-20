import { generateLocalIdeas } from '../../lib/aiFallback';
import {
  computeTopPerformers,
  computeLearnedSignals,
} from '../../lib/insights';

const DATASET_CONTEXT_PROMPT = () => {
  const top = computeTopPerformers();
  const signals = computeLearnedSignals();

  const topLines = top
    .filter((t) => t.post)
    .map((t) => `- ${t.title}: "${t.post.label}" (${t.metric})`)
    .join('\n');

  return `Here is a small Instagram performance dataset for a college-affiliated music collective ("DUU Tech" / "Small Town Records", STR).

Top performers:
${topLines}

Observed signals:
${signals.map((s) => `- ${s}`).join('\n')}

The dataset is small and directional. Do not claim that event attendance, registrations, or music streams were measured unless those metrics appear directly in the dataset.`;
};

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.status(405).json({ error: 'Method not allowed' });
    return;
  }

  const { goal } = req.body || {};

  const goalText =
    typeof goal === 'string'
      ? goal.slice(0, 500)
      : 'Promote an upcoming STR event and grow engagement';

  const apiKey = process.env.OPENAI_API_KEY;

  console.log('OpenAI key loaded:', Boolean(apiKey));

  if (!apiKey) {
    const ideas = generateLocalIdeas(goalText);

    res.status(200).json({
      source: 'local',
      ideas,
    });

    return;
  }

  try {
    const OpenAI = (await import('openai')).default;
    const openaiClient = new OpenAI({ apiKey });

    const system = `
You are a social media strategist for Duke Small Town Records (STR), a student music organization.

${DATASET_CONTEXT_PROMPT()}

Use the selected goal from the user:
- Discover a Duke artist
- Stream an artist's music
- Attend an STR event
- Build STR awareness

Use Instagram performance data and Duke student research.

Students respond to:
- Short entertaining Reels
- Strong first 1–3 second hooks
- Music clips and artist personality
- Duke and student-life references
- Humor and trends
- Friends, social proof, and community
- Clear event details and incentives
- Repeated reminders and day-of Stories

For events, emphasize the experience, artists, atmosphere, logistics, social proof, incentives, and reminders.

For artist discovery, lead with the music, then show personality and Duke identity.

For music streams, use compelling snippets, lyrics, performance clips, repeated exposure, and direct CTAs.

For STR awareness, demonstrate what STR does through entertaining music content.

Create new ideas. Do not simply repeat past posts.
Optimize for the selected real-world action, not just views or likes.
Use realistic expected outcomes.

Return only valid JSON with no markdown or explanation.

Use exactly this format:
{
  "ideas": [
    {
      "title": "string",
      "format": "string",
      "hook": "string",
      "captionConcept": "string",
      "targetAudience": "string",
      "expectedOutcome": "string",
      "metrics": ["string"],
      "whyItFits": "string"
    }
  ]
}

Return exactly 3 ideas and no additional fields.
`;

    console.log('Calling OpenAI API...');

    const response = await openaiClient.responses.create({
      model: 'gpt-4o-mini',
      instructions: system,
      input: `Selected goal: ${goalText}

Generate exactly 3 content ideas as JSON.`,
    });

    console.log('OpenAI API responded successfully');

    const raw = response.output_text || '{}';

    const cleaned = raw
      .replace(/```json/g, '')
      .replace(/```/g, '')
      .trim();

    const parsed = JSON.parse(cleaned);

    if (
      !parsed.ideas ||
      !Array.isArray(parsed.ideas) ||
      parsed.ideas.length !== 3
    ) {
      throw new Error(
        'Malformed AI response: expected exactly 3 ideas'
      );
    }

    res.status(200).json({
      source: 'ai',
      ideas: parsed.ideas,
    });
  } catch (err) {
    console.error('OpenAI request failed:', err);

    const ideas = generateLocalIdeas(goalText);

    res.status(200).json({
      source: 'local-fallback',
      ideas,
      error: err.message,
      note: 'AI request failed; showing rule-based ideas instead.',
    });
  }
}