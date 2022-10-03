export function Inject(key: string) {
  return function (target: any, propertyKey: string) {
    Object.defineProperty(target, propertyKey, {
      get: function () {
        return Reflect.getMetadata(key, target);
      },
    });
  };
}
