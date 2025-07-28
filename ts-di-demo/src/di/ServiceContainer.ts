import type { ServiceKey, ServiceMap } from "./types";

type ServiceFactory<T> = () => T;

interface ServiceMetadata<T> {
  factory: ServiceFactory<T>;
  singleton: boolean;
  instance?: T;
}

class ServiceContainer {
  private registry = new Map<ServiceKey, ServiceMetadata<any>>();

  register<K extends ServiceKey>(
    key: K,
    factory: ServiceFactory<ServiceMap[K]>,
    singleton: boolean
  ) {
    if (this.registry.has(key)) {
      throw new Error(`Service '${key}' already registered`);
    }
    this.registry.set(key, { factory, singleton });
  }

  resolve<K extends ServiceKey>(key: K): ServiceMap[K] {
    const meta = this.registry.get(key);
    if (!meta) throw new Error(`Service '${key}' not registered`);
    if (meta.singleton) {
      if (!meta.instance) {
        meta.instance = meta.factory();
      }
      return meta.instance;
    }
    return meta.factory();
  }
}

export const serviceContainer = new ServiceContainer();
