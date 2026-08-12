const Redis = require('ioredis')
const config = require('../../config')


const redisClient = new Redis(config.redisUrl);


redisClient.on('connect', ()=>{
    console.log('Redis Connected');
})

redisClient.on('error',(err)=>{
    console.error('Redis connection error:', err.message);
})

const redisPublisher = new Redis(config.redisUrl);
const redisSubscriber = new Redis(config.redisUrl);

module.exports = { redisClient, redisPublisher, redisSubscriber };