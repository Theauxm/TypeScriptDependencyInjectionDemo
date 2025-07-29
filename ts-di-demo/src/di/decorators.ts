import { serviceContainer } from "./ServiceContainer";
import { ServiceMap, ServiceKey } from "./types";
import { isServiceSingleton, type ServiceLifecycleProfile } from "./ServiceLifecycle";

/**
 * Injectable decorator that registers a service with the container
 * Both environment and lifecycle configuration are determined by centralized configuration files
 * @param key - The service key to register under
 */
export function Injectable<K extends keyof ServiceMap>(key: K) {
  return function <T extends { new (...args: any[]): ServiceMap[K] }>(target: T) {
    const implementationName = target.name;
    const isSingleton = isServiceSingleton(key as keyof ServiceLifecycleProfile);
    serviceContainer.register(key, () => new target(), isSingleton, implementationName);
  };
}
