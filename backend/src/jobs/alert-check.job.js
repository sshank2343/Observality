// Placeholder for now — will check HourlyMetric rows against AlertRule thresholds
// once the alerts module is built (next major piece after jobs).

const { createQueue, createWorker, QUEUE_NAMES } = require('./queue.config');

const alertCheckQueue = createQueue(QUEUE_NAMES.ALERT_CHECK);

const startAlertCheckWorker = () => {
  createWorker(QUEUE_NAMES.ALERT_CHECK, async () => {
    console.log('Alert check job ran (logic added when alerts module is built)');
  });
};

module.exports = { alertCheckQueue, startAlertCheckWorker };