import { serviceContainer } from "./ServiceContainer";
import { ServiceMap } from "./types";

/**
 * Singleton decorator that registers a service as a singleton
 * Environment configuration is determined by the Environment.ts file
 * @param key - The service key to register under
 */
export function Singleton<K extends keyof ServiceMap>(key: K) {
  return function <T extends { new (...args: any[]): any }>(target: T) {
    const implementationName = target.name;
    serviceContainer.register(key, () => new target(), true, implementationName);
  };
}

/**
 * Transient decorator that registers a service as transient
 * Environment configuration is determined by the Environment.ts file
 * @param key - The service key to register under
 */
export function Transient<K extends keyof ServiceMap>(key: K) {
  return function <T extends { new (...args: any[]): any }>(target: T) {
    const implementationName = target.name;
    serviceContainer.register(key, () => new target(), false, implementationName);
  };
}
