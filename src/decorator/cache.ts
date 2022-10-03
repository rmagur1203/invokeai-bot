import * as cacheManager from 'cache-manager';
import { ModuleInterface } from './discord';

export async function registCacheManager(
  store: any | 'memory',
  storeOptions: any,
  modules: ModuleInterface[]
) {
  const redisCache = await cacheManager.caching(store, storeOptions);
  for (const module of modules) {
    Reflect.defineMetadata('CACHE_MANAGER', redisCache, module.prototype);
  }
}
