const { calculateCost } = require("../../utils/costCalculator")
const Trace = require('../traces/trace.model');


const ingestTrace = async({traceData, projectId, orgId }) => {
    const costUsd = traceData.costUsd??calculateCost({
        provider:traceData.provider,
        model:traceData.model,
        inputTokens:traceData.inputTokens,
        outputTokens:traceData.outputTokens,
    });

    const trace = await Trace.create({
    ...traceData,
    costUsd,
    projectId,
    orgId,
    createdAt: traceData.timestamp ? new Date(traceData.timestamp) : new Date(),
  });

  return trace;
};

module.exports = { ingestTrace };