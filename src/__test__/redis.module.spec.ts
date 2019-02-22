import { Test, TestingModule } from '@nestjs/testing';
import { RedisModule } from '../redis.module';
import * as Redis from 'ioredis';
import { createClientToken } from '../utils/create.token';
import { Injectable } from '@nestjs/common';
import { InjectRedisClient } from '../decorators';

describe('RedisModule', () => {
  it('Instance Redis', async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [RedisModule.forRoot({
        host: '127.0.0.1',
        port: 6379,
        password: '123456',
      })],
    }).compile();

    const app = module.createNestApplication();
    await app.init();
    const redisModule = module.get(RedisModule);
    expect(redisModule).toBeInstanceOf(RedisModule);

    await app.close();
  });

  it('Instance Redis client provider', async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [RedisModule.forRoot([{
        name: '1',
        host: '127.0.0.1',
        port: 6379,
        password: '123456',
      }, {
        name: 'test',
        host: '127.0.0.1',
        port: 6379,
        password: '123456',
      }])],
    }).compile();

    const app = module.createNestApplication();
    await app.init();
    const redisClient = module.get(createClientToken('1'));
    const redisClientTest = module.get(createClientToken('test'));

    expect(redisClient).toBeInstanceOf(Redis);
    expect(redisClientTest).toBeInstanceOf(Redis);

    await app.close();
  });

  it('inject redis connection', async () => {

    @Injectable()
    class TestProvider {
      constructor(
        @InjectRedisClient() private redisClient: Redis.Redis,
      ) {}

      getClient() {
        return this.redisClient;
      }
    }

    const module: TestingModule = await Test.createTestingModule({
      imports: [RedisModule.forRoot({
        host: '127.0.0.1',
        port: 6379,
        password: '123456',
      })],
      providers: [TestProvider],
    }).compile();

    const app = module.createNestApplication();
    await app.init();

    const provider = module.get(TestProvider);
    expect(provider.getClient()).toBeInstanceOf(Redis);

    await app.close();
  });
});
