export class CacheService {
  private static cache = new Map<
    string,
    {
      data: any;
      expiry: number;
    }
  >();

  static set(key: string, data: any, ttl = 5 * 60 * 1000): void {
    this.cache.set(key, {
      data,
      expiry: Date.now() + ttl,
    });
  }

  static get<T>(key: string): T | null {
    const entry = this.cache.get(key);
    if (entry && entry.expiry > Date.now()) {
      return entry.data;
    }
    this.cache.delete(key);
    return null;
  }

  static clear(key?: string): void {
    if (key) {
      this.cache.delete(key);
    } else {
      this.cache.clear();
    }
  }

  static has(key: string): boolean {
    const entry = this.cache.get(key);
    return entry ? entry.expiry > Date.now() : false;
  }
}
