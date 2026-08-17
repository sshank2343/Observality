const { callJudge } = require('./llm-judge.client');

const SYSTEM_PROMPT = `You are an evaluator scoring how relevant an AI's output is to the given input prompt.
Respond ONLY with JSON in this exact shape, no other text:
{"score": <float 0-1, where 1 means highly relevant>, "reasoning": "<one short sentence>"}`;

const evaluateRelevance = async ({ input, output }) => {
  const userPrompt = `Input: ${input || '(not provided)'}\n\nOutput: ${output}`;
  const result = await callJudge(SYSTEM_PROMPT, userPrompt);
  return { score: result.score, reasoning: result.reasoning };
};

module.exports = { evaluateRelevance };