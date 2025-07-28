import { serviceContainer } from "./ServiceContainer";
import { ServiceMap } from "./types";

export function Singleton<K extends keyof ServiceMap>(
  key: K,
  enabled: boolean = true
) {
  return function <T extends { new (...args: any[]): any }>(target: T) {
    if (enabled) serviceContainer.register(key, () => new target(), true);
  };
}

export function Transient<K extends keyof ServiceMap>(
  key: K,
  enabled: boolean = true
) {
  return function <T extends { new (...args: any[]): any }>(target: T) {
    if (enabled) serviceContainer.register(key, () => new target(), false);
  };
}
