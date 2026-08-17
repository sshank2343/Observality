// Compares current metric values against alert rule thresholds.
// Static threshold check for now — the "smarter" statistical/z-score based
// anomaly detection mentioned in the roadmap can replace/extend this later
// without changing the calling code below.

const METRIC_FIELD_MAP = {
  latency: 'avgLatencyMs',
  cost: 'totalCostUsd',
  error_rate: 'errorRate',
  request_volume: 'requestCount',
};

const evaluateRule = (rule, currentMetrics) => {
  const field = METRIC_FIELD_MAP[rule.metric];
  const value = currentMetrics[field];

  if (value === undefined) return { breached: false };

  const breached = rule.condition === 'gt' ? value > rule.threshold : value < rule.threshold;

  return { breached, value, field };
};

module.exports = { evaluateRule };