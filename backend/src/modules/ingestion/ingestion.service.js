const Trace = require('../traces/trace.model');
const { calculateCost } = require('../../utils/costCalculator');
const { publishEvent } = require('../realtime/pubsub.service');

const ingestTrace = async ({ traceData, projectId, orgId }) => {
  const costUsd =
    traceData.costUsd ??
    calculateCost({
      provider: traceData.provider,
      model: traceData.model,
      inputTokens: traceData.inputTokens,
      outputTokens: traceData.outputTokens,
    });

  const trace = await Trace.create({
    ...traceData,
    costUsd,
    projectId,
    orgId,
    createdAt: traceData.timestamp ? new Date(traceData.timestamp) : new Date(),
  });

  // Fire-and-forget: don't block the ingestion response on pub/sub delivery
  publishEvent(orgId, {
    type: 'trace.created',
    trace: {
      id: trace._id,
      projectId: trace.projectId,
      provider: trace.provider,
      model: trace.model,
      latencyMs: trace.latencyMs,
      costUsd: trace.costUsd,
      status: trace.status,
      createdAt: trace.createdAt,
    },
  }).catch((err) => console.error('Failed to publish trace event:', err));

  return trace;
};

module.exports = { ingestTrace };