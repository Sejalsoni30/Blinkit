interface CacheEntry<T> {
  data: T;
  expiresAt: number;
}

class MemoryCache {
  private cache = new Map<string, CacheEntry<any>>();

  get<T>(key: string): T | null {
    const entry = this.cache.get(key);
    if (!entry) return null;

    if (Date.now() > entry.expiresAt) {
      this.cache.delete(key);
      return null;
    }

    return entry.data;
  }

  set<T>(key: string, data: T, ttlSeconds = 60): void {
    this.cache.set(key, {
      data,
      expiresAt: Date.now() + ttlSeconds * 1000,
    });
  }

  clear(): void {
    this.cache.clear();
  }
}

export const cache = new MemoryCache();
