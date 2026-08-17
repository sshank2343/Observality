const { callJudge } = require('./llm-judge.client');

const SYSTEM_PROMPT = `You are a strict fact-checking evaluator. Given an input prompt and an AI's output response, score how likely the output contains hallucinated (fabricated, unsupported) claims.
Respond ONLY with JSON in this exact shape, no other text:
{"score": <float 0-1, where 1 means highly likely to contain hallucination>, "reasoning": "<one short sentence>"}`;

const evaluateHallucination = async ({ input, output }) => {
  const userPrompt = `Input: ${input || '(not provided)'}\n\nOutput: ${output}`;
  const result = await callJudge(SYSTEM_PROMPT, userPrompt);
  return { score: result.score, reasoning: result.reasoning };
};

module.exports = { evaluateHallucination };
