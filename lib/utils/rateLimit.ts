import { Redis } from 'ioredis';

class RateLimiter {
  private redis: Redis;

  constructor() {
    if (!process.env.REDIS_URL) {
      throw new Error('REDIS_URL environment variable is required');
    }
    this.redis = new Redis(process.env.REDIS_URL);
  }

  async check(key: string, limit: number, window: string): Promise<boolean> {
    const count = await this.redis.incr(`ratelimit:${key}`);
    if (count === 1) {
      await this.redis.expire(`ratelimit:${key}`, this.parseWindow(window));
    }
    return count <= limit;
  }

  async increment(key: string): Promise<void> {
    await this.redis.incr(`ratelimit:${key}`);
  }

  async reset(key: string): Promise<void> {
    await this.redis.del(`ratelimit:${key}`);
  }

  private parseWindow(window: string): number {
    const value = parseInt(window);
    const unit = window.slice(-1);
    switch (unit) {
      case 'h':
        return value * 60 * 60;
      case 'm':
        return value * 60;
      case 's':
        return value;
      default:
        return 60 * 60; // Default 1 hour
    }
  }
}

export const rateLimit = new RateLimiter();
