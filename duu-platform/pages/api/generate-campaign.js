import { generateLocalCampaign } from '../../lib/aiFallback';
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

  return `Instagram performance data for DUU Tech / Small Town Records:

Top performers:
${topLines}

Observed signals:
${signals.map((s) => `- ${s}`).join('\n')}

The dataset is small and directional. Do not claim that event attendance, registrations, or music streams were measured unless those metrics appear directly in the dataset.`;
};

const STR_AI_CONTEXT = `
You are a social media strategist for Duke Small Town Records, a student music organization.

Use the selected campaign goal:
- Discover a Duke artist
- Stream an artist's music
- Attend an STR event
- Build STR awareness

Duke students respond to:
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

Create new ideas. Do not simply repeat previous posts.
Optimize for the selected real-world action, not just views or likes.
Use realistic expected outcomes.
`;

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.status(405).json({ error: 'Method not allowed' });
    return;
  }

  const { goal } = req.body || {};

  const goalText =
    typeof goal === 'string'
      ? goal.slice(0, 500)
      : 'Promote an upcoming STR event and maximize attendance';

  const apiKey = process.env.OPENAI_API_KEY;

  console.log('OpenAI key loaded:', Boolean(apiKey));

  if (!apiKey) {
    const campaign = generateLocalCampaign(goalText);

    res.status(200).json({
      source: 'local',
      campaign,
    });

    return;
  }

  try {
    const OpenAI = (await import('openai')).default;
    const openaiClient = new OpenAI({ apiKey });

    const system = `
${STR_AI_CONTEXT}

${DATASET_CONTEXT_PROMPT()}

Generate exactly 6 coordinated posts in this exact order:

1. Teaser
2. Artist or student spotlight
3. Main event announcement
4. Reminder post
5. Day-of content
6. Follow-up post

Return only valid JSON with no markdown or explanation.

Use exactly this JSON shape:

{
  "posts": [
    {
      "stage": "string",
      "format": "string",
      "idea": "string",
      "hook": "string",
      "cta": "string",
      "goal": "string",
      "metric": "string"
    }
  ]
}

Include timing, content details, and reasoning inside the existing fields.
Do not add any additional fields.
`;

    console.log('Calling OpenAI API for campaign...');

    const response = await openaiClient.responses.create({
      model: 'gpt-4o-mini',
      instructions: system,
      input: `Selected campaign goal: ${goalText}

Generate exactly 6 campaign posts as JSON.`,
    });

    console.log('OpenAI campaign response received');

    const raw = response.output_text || '{}';

    const cleaned = raw
      .replace(/```json/g, '')
      .replace(/```/g, '')
      .trim();

    const parsed = JSON.parse(cleaned);

    if (
      !parsed.posts ||
      !Array.isArray(parsed.posts) ||
      parsed.posts.length !== 6
    ) {
      throw new Error(
        'Malformed AI response: expected exactly 6 campaign posts'
      );
    }

    res.status(200).json({
      source: 'ai',
      campaign: {
        goal: goalText,
        posts: parsed.posts,
      },
    });
  } catch (err) {
    console.error('OpenAI campaign error:', err);

    const campaign = generateLocalCampaign(goalText);

    res.status(200).json({
      source: 'local-fallback',
      campaign,
      error: err.message,
      note: 'AI request failed; showing rule-based campaign instead.',
    });
  }
}