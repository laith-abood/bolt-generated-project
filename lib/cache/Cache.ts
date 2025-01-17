import Redis from 'ioredis';

import { ErrorHandler } from '@/lib/errors/ErrorHandler';

export interface CacheOptions {
  ttl?: number; // Time to live in seconds
  prefix?: string; // Key prefix for namespacing
}

export class Cache {
  private static instance: Cache;
  private redis: Redis;
  private options: Required<CacheOptions>;

  private constructor(options: CacheOptions = {}) {
    this.options = {
      ttl: 3600, // 1 hour default TTL
      prefix: 'cache:',
      ...options,
    };

    const redisUrl = process.env.REDIS_URL;
    if (!redisUrl) {
      throw new Error('REDIS_URL environment variable is required');
    }

    this.redis = new Redis(redisUrl, {
      retryStrategy: (times) => {
        const delay = Math.min(times * 50, 2000);
        return delay;
      },
    });

    // Handle Redis connection errors
    this.redis.on('error', (error: Error) => {
      void ErrorHandler.handleError(error, {
        action: 'redis_connection_error',
      });
    });
  }

  public static getInstance(options: CacheOptions = {}): Cache {
    if (!Cache.instance) {
      Cache.instance = new Cache(options);
    }
    return Cache.instance;
  }

  private getKey(key: string): string {
    return `${this.options.prefix}${key}`;
  }

  public async get<T>(key: string): Promise<T | undefined> {
    try {
      const value = await this.redis.get(this.getKey(key));
      return value ? (JSON.parse(value) as T) : undefined;
    } catch (error) {
      await ErrorHandler.handleError(error as Error, {
        action: 'cache_get',
        context: { key },
      });
      return undefined;
    }
  }

  public async set<T>(key: string, value: T): Promise<void> {
    try {
      const serializedValue = JSON.stringify(value);
      await this.redis.set(
        this.getKey(key),
        serializedValue,
        'EX',
        this.options.ttl
      );
    } catch (error) {
      await ErrorHandler.handleError(error as Error, {
        action: 'cache_set',
        context: { key },
      });
    }
  }

  public async delete(key: string): Promise<void> {
    try {
      await this.redis.del(this.getKey(key));
    } catch (error) {
      await ErrorHandler.handleError(error as Error, {
        action: 'cache_delete',
        context: { key },
      });
    }
  }

  public async has(key: string): Promise<boolean> {
    try {
      return (await this.redis.exists(this.getKey(key))) === 1;
    } catch (error) {
      await ErrorHandler.handleError(error as Error, {
        action: 'cache_has',
        context: { key },
      });
      return false;
    }
  }

  public async clear(): Promise<void> {
    try {
      const pattern = this.getKey('*');
      const keys = await this.redis.keys(pattern);
      if (keys.length > 0) {
        await this.redis.del(...keys);
      }
    } catch (error) {
      await ErrorHandler.handleError(error as Error, {
        action: 'cache_clear',
      });
    }
  }

  public async disconnect(): Promise<void> {
    try {
      await this.redis.quit();
    } catch (error) {
      await ErrorHandler.handleError(error as Error, {
        action: 'cache_disconnect',
      });
    }
  }
}
