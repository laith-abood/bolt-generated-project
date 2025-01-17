import { Cache } from './Cache';

export * from './Cache';

// Re-export factory function
export const createCache = (options: CacheOptions = {}): Cache => {
  return Cache.getInstance(options);
};

// Cache types
export interface CacheOptions {
  ttl?: number; // Time to live in seconds
  prefix?: string; // Key prefix for namespacing
  serialize?: boolean; // Whether to serialize/deserialize values
}

export interface CacheStats {
  hits: number;
  misses: number;
  keys: number;
  hitRate?: number; // Calculated as hits / (hits + misses)
  missRate?: number; // Calculated as misses / (hits + misses)
  avgLatency?: number; // Average operation latency in milliseconds
}

export interface CacheEntry<T> {
  value: T;
  expires: number;
  created: number;
  lastAccessed?: number;
  accessCount?: number;
}

export interface CacheConfig {
  maxSize?: number; // Maximum number of entries
  maxMemory?: number; // Maximum memory usage in bytes
  pruneInterval?: number; // Interval to check for expired entries
  evictionPolicy?: 'lru' | 'lfu' | 'fifo'; // Cache eviction policy
}

// Type guards
export function isCacheEntry<T>(obj: unknown): obj is CacheEntry<T> {
  return (
    typeof obj === 'object' &&
    obj !== null &&
    'value' in obj &&
    'expires' in obj &&
    'created' in obj &&
    typeof obj.expires === 'number' &&
    typeof obj.created === 'number'
  );
}

export function isCacheConfig(obj: unknown): obj is CacheConfig {
  return (
    typeof obj === 'object' &&
    obj !== null &&
    (!('maxSize' in obj) || typeof obj.maxSize === 'number') &&
    (!('maxMemory' in obj) || typeof obj.maxMemory === 'number') &&
    (!('pruneInterval' in obj) || typeof obj.pruneInterval === 'number') &&
    (!('evictionPolicy' in obj) ||
      ['lru', 'lfu', 'fifo'].includes(obj.evictionPolicy as string))
  );
}

// Cache events
export enum CacheEvent {
  HIT = 'hit',
  MISS = 'miss',
  SET = 'set',
  DELETE = 'delete',
  EXPIRE = 'expire',
  ERROR = 'error',
  CLEAR = 'clear',
  EVICT = 'evict',
}

export interface CacheEventData {
  event: CacheEvent;
  key: string;
  timestamp: number;
  metadata?: Record<string, unknown>;
}

// Cache error types
export class CacheError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'CacheError';
  }
}

export class CacheConnectionError extends CacheError {
  constructor(message: string) {
    super(message);
    this.name = 'CacheConnectionError';
  }
}

export class CacheSerializationError extends CacheError {
  constructor(message: string) {
    super(message);
    this.name = 'CacheSerializationError';
  }
}

// Utility functions
export function calculateCacheStats(stats: CacheStats): Required<CacheStats> {
  const total = stats.hits + stats.misses;
  return {
    ...stats,
    hitRate: total > 0 ? stats.hits / total : 0,
    missRate: total > 0 ? stats.misses / total : 0,
    avgLatency: stats.avgLatency ?? 0,
  };
}
