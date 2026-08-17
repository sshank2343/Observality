const Trace = require('../traces/trace.model');
const { evaluateHallucination } = require('./hallucination.evaluator');
const { evaluateRelevance } = require('./relevance.evaluator');
const { evaluateToxicity } = require('./toxicity.evaluator');

const runEvalsForTrace = async ({ traceId, projectId }) => {
  const trace = await Trace.findOne({ _id: traceId, projectId });
  if (!trace) {
    const err = new Error('Trace not found');
    err.status = 404;
    throw err;
  }

  if (!trace.output) {
    const err = new Error('Trace has no output text to evaluate');
    err.status = 400;
    throw err;
  }

  // Run all three evaluators in parallel — independent judge calls
  const [hallucination, relevance, toxicity] = await Promise.all([
    evaluateHallucination({ input: trace.input, output: trace.output }),
    evaluateRelevance({ input: trace.input, output: trace.output }),
    evaluateToxicity({ output: trace.output }),
  ]);

  trace.evals = {
    hallucination,
    relevance,
    toxicity,
    evaluatedAt: new Date(),
  };

  await trace.save();
  return trace;
};

module.exports = { runEvalsForTrace };