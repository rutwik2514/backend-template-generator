const { Queue } = require('bullmq');
const IORedis = require('ioredis');

const connection = new IORedis({
    maxRetriesPerRequest: null
});

const downloadQueue = new Queue('jobQueue', { connection });

module.exports = downloadQueue;