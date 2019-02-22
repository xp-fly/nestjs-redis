import {DynamicModule, Module} from '@nestjs/common';
import { RedisProvider } from './redis.provider';
import { RedisModuleOptions } from './redis.interface';
import { REDIS_CLIENT_DEFAULT_KEY } from './redis.constant';

@Module({})
export class RedisModule {
    /**
     * 注册所有的 redis 连接
     * @param options
     */
    static forRoot(options: RedisModuleOptions | RedisModuleOptions[]): DynamicModule {
        const redisClientProviders = RedisProvider.init(this.resolveOptions(options));

        return {
            module: RedisModule,
            providers: redisClientProviders,
            exports: redisClientProviders,
        };
    }

    /**
     * 返回所有的 redis 连接
     */
    static forFeature() {
        return {
            module: RedisModule,
            providers: RedisProvider.getClients(),
        };
    }

    private static resolveOptions(options: RedisModuleOptions | RedisModuleOptions[]) {
        if (!Array.isArray(options) && options.name === undefined) {
            options.name = REDIS_CLIENT_DEFAULT_KEY;
        }
        if (!Array.isArray(options)) {
            options = [options];
        }
        options.forEach((option, index) => {
            if (option.name === undefined) {
                option.name = index.toString();
            }
        });

        return options;
    }
}
