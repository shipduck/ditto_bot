import Redis from 'ioredis';

// workaround since type declarations of ioredis-mock do not exist
// tslint:disable-next-line
const RedisMock = require('ioredis-mock');

function getRedisClient() {
	switch (process.env.NODE_ENV) {
		case 'test': {
			return new RedisMock();
		}
		case 'dev': {
			return new Redis();
		}
		default: {
			return new Redis(process.env.REDIS_HOST);
		}
	}
}

export const redis = getRedisClient();
