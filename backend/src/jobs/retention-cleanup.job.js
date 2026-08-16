// Note: MongoDB's TTL index (set in trace.model.js) already handles automatic
// deletion after 30 days. This job exists for cases needing custom, per-project
// retention windows beyond the default TTL — e.g. a project on a "7-day retention"

const Trace = require("../modules/traces/trace.model");
const { createQueue, createWorker, QUEUE_NAMES } = require('./queue.config');


const  runRetentionCleanup = async({projectId, retentionDays}) => {
    const cutoff = new Date(Date.now() - retentionDays * 24 * 60 * 60 * 1000);

    const result = await Trace.deleteMany({
        projectId,
        createdAt: { $lt: cutoff },
    });

    console.log(`Retention cleanup: deleted ${result.deleteCount} traces for project ${projectId}`);
    return result.deletedCount;
};

const retentionQueue = createQueue(QUEUE_NAMES.RETENTION)

const startRetentionWorker = () => {
  createWorker(QUEUE_NAMES.RETENTION, async (job) => {
    await runRetentionCleanup(job.data);
  });
};

module.exports = { retentionQueue, startRetentionWorker, runRetentionCleanup };