import { serviceContainer } from "./ServiceContainer";
import { ServiceMap } from "./types";
import { isServiceSingleton } from "./ServiceLifecycle";

/**
 * Injectable decorator that registers a service with the container
 * Both environment and lifecycle configuration are determined by centralized configuration files
 * @param key - The service key to register under
 */
export function Injectable<K extends keyof ServiceMap>(key: K) {
  return function <T extends { new (...args: any[]): any }>(target: T) {
    const implementationName = target.name;
    const isSingleton = isServiceSingleton(key as any);
    serviceContainer.register(key, () => new target(), isSingleton, implementationName);
  };
}
