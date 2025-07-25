import 'reflect-metadata';

/**
 * Decorator to mark injectable dependencies in constructor parameters.
 * @param serviceKey - The service key that identifies the dependency
 */
export function Inject(serviceKey: string) {
  return function (target: any, propertyKey: string | symbol | undefined, parameterIndex: number) {
    const existingDependencies = Reflect.getMetadata('inject:dependencies', target) || [];
    existingDependencies[parameterIndex] = serviceKey;
    Reflect.defineMetadata('inject:dependencies', existingDependencies, target);
  };
}

/**
 * Class decorator to mark a class as injectable.
 * This is optional but helps with clarity and could be extended for additional metadata.
 */
export function Injectable(target: any) {
  // Could add additional metadata here if needed in the future
  return target;
}
