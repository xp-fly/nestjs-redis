import {DynamicModule, Module, Provider} from '@nestjs/common';
import {RedisModuleAsyncOption, RedisModuleOptions} from './redis.interface';
import { RedisCoreModule } from './redis-core.module';

@Module({})
export class RedisModule {
    /**
     * 注册所有的 redis 连接
     * @param options
     */
    static forRoot(options: RedisModuleOptions | RedisModuleOptions[]): DynamicModule {
        return {
          module: RedisModule,
          imports: [RedisCoreModule.forRoot(options)],
        };
    }

    /**
     * 异步获取redis客户端
     * @param options
     * @param injectOption
     */
    static forAsync(options: Partial<RedisModuleOptions> | Array<Partial<RedisModuleOptions>>, injectOption: RedisModuleAsyncOption) {
        return {
          module: RedisModule,
          imports: [RedisCoreModule.forAsync(options, injectOption)],
        };
    }
}
