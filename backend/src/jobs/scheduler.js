const { rollupQueue, startRollupWorker } = require('./rollup.job');
const { startRetentionWorker } = require('./retention-cleanup.job');
const { alertCheckQueue, startAlertCheckWorker } = require('./alert-check.job');

const initJobs = async () => {
  startRollupWorker();
  startRetentionWorker();
  startAlertCheckWorker();

  await rollupQueue.add(
    'hourly-rollup',
    {},
    { repeat: { pattern: '5 * * * *' }, removeOnComplete: true, removeOnFail: false }
  );

  // Check alert rules every 10 minutes
  await alertCheckQueue.add(
    'periodic-alert-check',
    {},
    { repeat: { pattern: '*/10 * * * *' }, removeOnComplete: true, removeOnFail: false }
  );

  console.log('Background jobs initialized (rollup, retention, alert-check)');
};

module.exports = { initJobs };