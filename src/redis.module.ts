import {DynamicModule, Module, Provider} from '@nestjs/common';
import { RedisProvider } from './redis.provider';
import {RedisModuleAsyncOption, RedisModuleOptions} from './redis.interface';
import {REDIS_CLIENT_DEFAULT_KEY, REDIS_CLIENT_MODULE_OPTIONS} from './redis.constant';

@Module({})
export class RedisModule {
    /**
     * 注册所有的 redis 连接
     * @param options
     */
    static forRoot(options: RedisModuleOptions | RedisModuleOptions[]): DynamicModule {
        const optionProvider: Provider = this.createAsyncOptionsProvider({
            useValue: Array.isArray(options) ? options : [options],
        });
        const redisClientProviders = RedisProvider.init(this.resolveOptions(options));

        return {
            module: RedisModule,
            providers: [optionProvider, ...redisClientProviders],
            exports: redisClientProviders,
        };
    }

    /**
     * 异步获取redis客户端
     * @param options
     * @param injectOption
     */
    static forAsync(options: RedisModuleOptions | RedisModuleOptions[], injectOption: RedisModuleAsyncOption) {
        const optionProvider = this.createAsyncOptionsProvider(injectOption);
        const redisClientProviders = RedisProvider.init(this.resolveOptions(options));
        return {
            module: RedisModule,
            providers: [optionProvider, ...redisClientProviders],
            exports: redisClientProviders,
        };
    }

    /**
     * 返回所有的 redis 连接
     */
    static forFeature(clientNames: string[]) {
        clientNames = clientNames.length ? clientNames : [REDIS_CLIENT_DEFAULT_KEY];
        return {
            module: RedisModule,
            providers: RedisProvider.getClients(clientNames),
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

    /**
     * 生成配置提供者
     * @param {RedisModuleAsyncOption} options
     * @return {Provider}
     */
    private static createAsyncOptionsProvider(options: RedisModuleAsyncOption): Provider {
        return {
            provide: REDIS_CLIENT_MODULE_OPTIONS,
            useValue: options.useValue,
            useFactory: options.useFactory,
            inject: options.inject || [],
        };
    }
}
