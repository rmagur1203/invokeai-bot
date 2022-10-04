import * as cacheManager from 'cache-manager';
import { ModuleInterface } from './discord';
import { injectDependency } from './inject';

export async function registCacheManager(
  store: any | 'memory',
  storeOptions: any,
  modules: ModuleInterface[]
) {
  const redisCache = await cacheManager.caching(store, storeOptions);
  injectDependency('CACHE_MANAGER', redisCache, modules);
}
