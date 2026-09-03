import { InMemoryCache } from '../src/services/cacheService';

describe('InMemoryCache', () => {
  let cache: InMemoryCache;

  beforeEach(() => {
    cache = new InMemoryCache();
  });

  it('should store and retrieve values within TTL', () => {
    cache.set('key1', { data: 'test' }, 60);
    expect(cache.get('key1')).toEqual({ data: 'test' });
  });

  it('should return null for non-existent keys', () => {
    expect(cache.get('unknown')).toBeNull();
  });

  it('should return null for expired items', async () => {
    // Set 0.05 second TTL (50ms)
    cache.set('expiringKey', 'val', 0.05);
    expect(cache.get('expiringKey')).toBe('val');

    await new Promise((resolve) => setTimeout(resolve, 80));
    expect(cache.get('expiringKey')).toBeNull();
  });

  it('should clear all entries', () => {
    cache.set('a', 1);
    cache.set('b', 2);
    cache.clear();

    expect(cache.get('a')).toBeNull();
    expect(cache.get('b')).toBeNull();
  });
});
