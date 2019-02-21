import {Inject, Injectable} from '@nestjs/common';
import {REDIS_CLIENT} from './redis.constant';
import * as Redis from 'ioredis';

@Injectable()
export class RedisClientProvider {
    @Inject(REDIS_CLIENT)
    private redisClient: Redis.Redis;
}
