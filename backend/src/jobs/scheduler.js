const { rollupQueue, startRollupWorker } = require('./rollup.job');
const { startRetentionWorker } = require('./retention-cleanup.job');
const { startAlertCheckWorker } = require('./alert-check.job');

const initJobs = async () => {
  // Start workers (the processes that actually execute jobs)
  startRollupWorker();
  startRetentionWorker();
  startAlertCheckWorker();

  // Schedule rollup to run at the top of every hour, repeatedly
  await rollupQueue.add(
    'hourly-rollup',
    {},
    {
      repeat: { pattern: '5 * * * *' }, // 5 minutes past every hour — gives the hour time to fully close
      removeOnComplete: true,
      removeOnFail: false,
    }
  );

  console.log('Background jobs initialized (rollup, retention, alert-check)');
};

module.exports = { initJobs };