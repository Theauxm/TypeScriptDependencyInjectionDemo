import { useRef } from "react";
import type { ServiceContainer } from "./ServiceContainer";
import type { ServiceKey, ServiceMap, ServiceInterfaceMap } from "./types";

/**
 * React hooks and utilities for dependency injection
 * These utilities work with any ServiceContainer instance
 */

/**
 * Get a service from a container (non-React utility)
 * @param container - The service container to resolve from
 * @param serviceKey - The service key to resolve
 */
export const getService = <
  TServiceMap extends Record<string, any>,
  TServiceKey extends keyof TServiceMap
>(
  container: ServiceContainer<TServiceMap, any, any>,
  serviceKey: TServiceKey
): any => {
  // Get the concrete implementation from the container
  const concreteService: TServiceMap[TServiceKey] = container.resolve(serviceKey);
  // Return it typed as the interface (safe cast from concrete to interface)
  return concreteService;
};

/**
 * React hook to get a service from a container
 * @param container - The service container to resolve from
 * @param serviceKey - The service key to resolve
 */
export const useService = <
  TServiceMap extends Record<string, any>,
  TServiceKey extends keyof TServiceMap
>(
  container: ServiceContainer<TServiceMap, any, any>,
  serviceKey: TServiceKey
): any => {
  // useRef required to not re-create a service instance
  // and tie this reference to the lifecycle of the component using it
  // We call the returned service function that would:
  // a. return the global instance for singleton services
  // b. create a new instance for transient services
  const serviceRef = useRef<any>(null);
  if (!serviceRef.current) {
    // Get the concrete implementation from the container
    const concreteService: TServiceMap[TServiceKey] = container.resolve(serviceKey);
    // Store it typed as the interface (safe cast from concrete to interface)
    serviceRef.current = concreteService;
  }
  return serviceRef.current;
};

/**
 * Create container-specific hooks for a given container instance
 * This is a convenience function to avoid passing the container to every hook call
 */
export function createContainerHooks<
  TServiceMap extends Record<string, any>,
  TServiceKeys extends string,
  TEnvironments extends string
>(container: ServiceContainer<TServiceMap, TServiceKeys, TEnvironments>) {
  return {
    getService: <TServiceKey extends keyof TServiceMap>(
      serviceKey: TServiceKey
    ): any => {
      return getService(container, serviceKey);
    },
    
    useService: <TServiceKey extends keyof TServiceMap>(
      serviceKey: TServiceKey
    ): any => {
      return useService(container, serviceKey);
    }
  };
}
