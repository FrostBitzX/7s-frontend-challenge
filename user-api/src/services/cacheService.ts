interface CacheEntry<T> {
  value: T;
  expiresAt: number;
}

export class InMemoryCache {
  private store = new Map<string, CacheEntry<unknown>>();

  /**
   * Retrieves an item from cache if present and not expired.
   */
  get<T>(key: string): T | null {
    const entry = this.store.get(key);
    if (!entry) {
      return null;
    }

    if (Date.now() > entry.expiresAt) {
      this.store.delete(key);
      return null;
    }

    return entry.value as T;
  }

  /**
   * Stores an item with a time-to-live in seconds.
   */
  set<T>(key: string, value: T, ttlSeconds: number = 60): void {
    const expiresAt = Date.now() + ttlSeconds * 1000;
    this.store.set(key, { value, expiresAt });
  }

  /**
   * Clears all cache entries.
   */
  clear(): void {
    this.store.clear();
  }
}

export const defaultCache = new InMemoryCache();
