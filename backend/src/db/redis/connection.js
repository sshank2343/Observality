const Redis = require('ioredis')
const config = require('../../config')


const redisOptions = {
  maxRetriesPerRequest: null,
  enableReadyCheck: false,
};

const redisClient = new Redis(config.redisUrl, redisOptions);

redisClient.on('connect', () => {
  console.log('Redis Connected');
});

redisClient.on('error', (err) => {
  console.error('Redis connection error:', err.message);
});

const redisPublisher = new Redis(config.redisUrl, redisOptions);
redisPublisher.on('error', (err) => {
  console.error('Redis Publisher error:', err.message);
});

const redisSubscriber = new Redis(config.redisUrl, redisOptions);
redisSubscriber.on('error', (err) => {
  console.error('Redis Subscriber error:', err.message);
});

module.exports = { redisClient, redisPublisher, redisSubscriber };