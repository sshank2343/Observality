const Trace = require("../modules/traces/trace.model");
const { prisma } = require("../config/postgres.config");
const { createQueue, createWorker, QUEUE_NAMES } = require("./queue.config");

// Aggregates the last completed hour of raw traces per project into Postgres.
const runRollup = async () => {
  const now = new Date();
  const hourStart = new Date(now);
  hourStart.setMinutes(0, 0, 0);
  hourStart.setHours(hourStart.getHours() - 1); // previous full hour
  const hourEnd = new Date(hourStart);
  hourEnd.setHours(hourEnd.getHours() + 1);

  // Get distinct projects that had traces in this window
  const projectIds = await Trace.distinct("projectId", {
    createdAt: { $gte: hourStart, $lt: hourEnd },
  });

  for (const projectId of projectIds) {
    const results = await Trace.aggregate([
      {
        $match: {
          projectId,
          createdAt: {
            $gte: hourStart,
            $lt: hourEnd,
          },
        },
      },
      {
        $group: {
          _id: null,
          requestCount: { $sum: 1 },
          avgLatencyMs: { $avg: "$latencyMs" },
          totalCostUsd: { $sum: "$costUsd" },
          errorCount: {
            $sum: { $cond: [{ $eq: ["$status", "error"] }, 1, 0] },
          },
        },
      },
    ]);

    const stats = results[0];
    if (!stats) continue;

    const errorRate = stats.requestCount
      ? stats.errorCount / stats.requestCount
      : 0;

    // Upsert — reruns of the same hour just overwrite, safe to retry
    await prisma.hourlyMetric.upsert({
      where: { projectId_hour: { projectId, hour: hourStart } },
      update: {
        requestCount: stats.requestCount,
        avgLatencyMs: stats.avgLatencyMs,
        totalCostUsd: stats.totalCostUsd,
        errorRate,
      },
      create: {
        projectId,
        hour: hourStart,
        requestCount: stats.requestCount,
        avgLatencyMs: stats.avgLatencyMs,
        totalCostUsd: stats.totalCostUsd,
        errorRate,
      },
    });
  }

  console.log(
    `Rollup complete for ${projectIds.length} project(s), hour ${hourStart.toISOString()}`,
  );
};

const rollupQueue = createQueue(QUEUE_NAMES.ROLLUP);

const startRollupWorker = () => {
  createWorker(QUEUE_NAMES.ROLLUP, async () => {
    await runRollup();
  });
};

module.exports = { rollupQueue, startRollupWorker, runRollup };
