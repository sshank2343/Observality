const config = require("../config");
const { Queue, Worker } = require('bullmq');


const connection = {
    url: config.redisUrl,
};

const QUEUE_NAMES = {
    ROLLUP: 'rollup-queue',
    RETENTION: 'retention-queue',
    ALERT_CHECK: 'alert-check-queue',
}

const createQueue = (name) => new Queue(name, { connection });

const createWorker = (name, processor) =>
  new Worker(name, processor, { connection });

module.exports = { connection, QUEUE_NAMES, createQueue, createWorker };