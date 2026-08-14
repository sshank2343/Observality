const Trace = require('../traces/trace.model');

// Naive version for now — reads raw Mongo directly.
// Will be replaced by querying Postgres rollup tables once the rollup job exists (Phase 4).
const getSummaryMetrics = async ({ projectId, since }) => {
  const sinceDate = since ? new Date(since) : new Date(Date.now() - 24 * 60 * 60 * 1000);

  const results = await Trace.aggregate([
    { $match: { projectId, createdAt: { $gte: sinceDate } } },
    {
      $group: {
        _id: null,
        requestCount: { $sum: 1 },
        avgLatencyMs: { $avg: '$latencyMs' },
        totalCostUsd: { $sum: '$costUsd' },
        errorCount: {
          $sum: { $cond: [{ $eq: ['$status', 'error'] }, 1, 0] },
        },
      },
    },
  ]);

  const summary = results[0] || {
    requestCount: 0,
    avgLatencyMs: 0,
    totalCostUsd: 0,
    errorCount: 0,
  };

  return {
    requestCount: summary.requestCount,
    avgLatencyMs: Number((summary.avgLatencyMs || 0).toFixed(2)),
    totalCostUsd: Number((summary.totalCostUsd || 0).toFixed(4)),
    errorRate: summary.requestCount
      ? Number((summary.errorCount / summary.requestCount).toFixed(4))
      : 0,
    since: sinceDate.toISOString(),
  };
};

// Time-series for charts — buckets by hour
const getTimeSeriesMetrics = async ({ projectId, since }) => {
  const sinceDate = since ? new Date(since) : new Date(Date.now() - 24 * 60 * 60 * 1000);

  const results = await Trace.aggregate([
    { $match: { projectId, createdAt: { $gte: sinceDate } } },
    {
      $group: {
        _id: {
          $dateToString: { format: '%Y-%m-%dT%H:00:00', date: '$createdAt' },
        },
        requestCount: { $sum: 1 },
        avgLatencyMs: { $avg: '$latencyMs' },
        totalCostUsd: { $sum: '$costUsd' },
      },
    },
    { $sort: { _id: 1 } },
  ]);

  return results.map((r) => ({
    hour: r._id,
    requestCount: r.requestCount,
    avgLatencyMs: Number(r.avgLatencyMs.toFixed(2)),
    totalCostUsd: Number(r.totalCostUsd.toFixed(4)),
  }));
};

module.exports = { getSummaryMetrics, getTimeSeriesMetrics };