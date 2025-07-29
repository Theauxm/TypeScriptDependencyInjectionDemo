import { useRef } from "react";
import { serviceContainer } from "../di-lib/ServiceContainer";
import type { ServiceKey, ServiceMap, ServiceInterfaceMap } from "../di-lib/types";

export const getService = <T extends ServiceKey>(serviceKey: T): ServiceInterfaceMap[T] => {
  // Get the concrete implementation from the container
  const concreteService: ServiceMap[T] = serviceContainer.resolve(serviceKey);
  // Return it typed as the interface (safe cast from concrete to interface)
  return concreteService as ServiceInterfaceMap[T];
};

// Only usable within react components
export const useService = <T extends ServiceKey>(serviceKey: T): ServiceInterfaceMap[T] => {
  // useRef required to not re-create a service instance
  // and tie this reference to the lifecycle of the component using it
  // We call the returned service function that would:
  // a. return the global instance for singleton services
  // b. create a new instance for transient services
  const serviceRef = useRef<ServiceInterfaceMap[T] | null>(null);
  if (!serviceRef.current) {
    // Get the concrete implementation from the container
    const concreteService: ServiceMap[T] = serviceContainer.resolve(serviceKey);
    // Store it typed as the interface (safe cast from concrete to interface)
    serviceRef.current = concreteService as ServiceInterfaceMap[T];
  }
  return serviceRef.current;
};
