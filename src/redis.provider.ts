import * as Redis from 'ioredis';
import { RedisClientOptions, RedisModuleOptions } from './redis.interface';
import { NotFoundException, Provider } from '@nestjs/common';
import { createClientToken } from './utils/create.token';
import { REDIS_CLIENT_DEFAULT_KEY, REDIS_CLIENT_MODULE_OPTIONS } from './redis.constant';

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
   * @param {RedisModuleOptions[]} options
   * @param {Provider} optionProvider
   * @return {Provider[]}
   */
  public static init(options: RedisModuleOptions[]): Provider[] {
    return options.map(option => this.createRedisClientProvider(option));
  }

  /**
   * 得到 redis 客户端连接的 provider
   * @param {RedisModuleOptions} option
   * @param optionProvider
   * @return {Provider}
   */
  private static createRedisClientProvider(option: RedisModuleOptions): Provider {
    const token = createClientToken(option.name);
    let client: Redis.Redis;
    if (clients.get(token)) {
      client = clients.get(token);
      return {
        provide: token,
        useValue: client,
      };
    } else {
      return {
        provide: token,
        useFactory: (options: RedisModuleOptions[]) => {
          const config = options.find(item => (item.name === option.name) || (option.name === REDIS_CLIENT_DEFAULT_KEY && item.name === undefined));
          option = {...option, ...config};
          client =  this.createClient(option);
          clients.set(token, client);
          return client;
        },
        inject: [REDIS_CLIENT_MODULE_OPTIONS],
      };
    }
  }
}
