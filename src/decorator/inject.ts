import { ModuleInterface } from './discord';

export async function injectDependency(
  key: string,
  value: any,
  modules: ModuleInterface[]
) {
  for (const module of modules) {
    Reflect.defineMetadata(key, value, module.prototype);
  }
}

export function Inject(key: string) {
  return function (target: any, propertyKey: string) {
    Object.defineProperty(target, propertyKey, {
      get: function () {
        return Reflect.getMetadata(key, target);
      },
    });
  };
}
