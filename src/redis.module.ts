import {DynamicModule, Module} from '@nestjs/common';
import {RedisModuleOptions} from './redis.interface';

@Module({})
export class RedisModule {
    static forRoot(options: RedisModuleOptions): DynamicModule {
        return {
            module: RedisModule,
        };
    }
}
