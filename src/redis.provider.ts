import * as Redis from 'ioredis';
import { RedisClientOptions, RedisModuleOptions } from './redis.interface';
import { Provider } from '@nestjs/common';
import { createClientToken } from './utils/create.token';

const clients: Map<string, Redis.Redis> = new Map();

export class RedisProvider {
    /**
     * 创建连接
     * @param options
     */
    public static createClient(options: RedisClientOptions) {
        return new Redis(options);
    }

    /**
     * 获取所有的 redis 连接的 provider 数组
     * @param options
     */
    public static init(options: RedisModuleOptions[]): Provider[] {
        return options.map(option => this.createRedisClientProvider(option));
    }

    /**
     * 得到 redis 客户端连接的 provider
     * @param option
     */
    private static createRedisClientProvider(option: RedisModuleOptions): Provider {
        const token = createClientToken(option.name);
        let client: Redis.Redis;
        if (clients.get(token)) {
            client = clients.get(token);
        } else {
            client = this.createClient(option);
            clients.set(token, client);
        }
        return {
            provide: token,
            useValue: client,
        };
    }

    public static getClients() {
        return clients.values();
    }

}
