import * as cacheManager from 'cache-manager';
import { injectDependency, ModuleInterface } from '.';

export async function registCacheManager(
  store: any | 'memory',
  storeOptions: any,
  modules: ModuleInterface[]
) {
  const redisCache = await cacheManager.caching(store, storeOptions);
  injectDependency('CACHE_MANAGER', redisCache, modules);
}
