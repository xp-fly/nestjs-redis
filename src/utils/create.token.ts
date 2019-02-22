import { REDIS_CLIENT_PROVIDER } from '../redis.constant';

export const createClientToken = (name: string): string => {
  return `${REDIS_CLIENT_PROVIDER}_${name}`;
};

