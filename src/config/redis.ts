import IORedis from 'ioredis';

const redis = new IORedis({
    host: process.env.REDIS_HOST,
    port: Number(process.env.REDIS_PORT || 6379),
    maxRetriesPerRequest: null
});

redis.on('ready', () => {
    console.log('[server]: Sucesso na conexão com o Redis.')
})

// subscriber
const redis_subscriber = new IORedis({
    host: process.env.REDIS_HOST,
    port: Number(process.env.REDIS_PORT || 6379),
    maxRetriesPerRequest: null
});

export { redis_subscriber };
export default redis;