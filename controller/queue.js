const { Queue } = require('bullmq');
const IORedis = require('ioredis');

const connection = new IORedis({
    // host: 'redis',
    // port: 6379,
    maxRetriesPerRequest: null
  });

const downloadQueue = new Queue('jobQueue', { connection });

module.exports = downloadQueue;