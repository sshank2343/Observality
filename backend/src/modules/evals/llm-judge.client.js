const config = require('../../config');

// Generic LLM-as-judge caller — sends a scoring prompt, expects strict JSON back.
const callJudge = async (systemPrompt, userPrompt) => {
  if (!config.anthropicApiKey) {
    throw new Error('ANTHROPIC_API_KEY not configured — evals are disabled');
  }

  const res = await fetch('https://api.anthropic.com/v1/messages', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-api-key': config.anthropicApiKey,
      'anthropic-version': '2023-06-01',
    },
    body: JSON.stringify({
      model: config.judgeModel,
      max_tokens: 300,
      system: systemPrompt,
      messages: [{ role: 'user', content: userPrompt }],
    }),
  });

  if (!res.ok) {
    const errText = await res.text();
    throw new Error(`Judge API call failed: ${res.status} ${errText}`);
  }

  const data = await res.json();
  const rawText = data.content?.[0]?.text || '';

  try {
    // Strip markdown fences in case the model wraps its JSON
    const cleaned = rawText.replace(/```json|```/g, '').trim();
    return JSON.parse(cleaned);
  } catch {
    throw new Error(`Judge returned non-JSON response: ${rawText}`);
  }
};

module.exports = { callJudge };