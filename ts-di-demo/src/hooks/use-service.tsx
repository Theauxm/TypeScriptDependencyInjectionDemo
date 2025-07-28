import { useRef } from "react";
import { serviceContainer } from "../di/ServiceContainer";
import type { ServiceKey, ServiceMap } from "../di/types";

export const getService = <T extends ServiceKey>(serviceKey: T) =>
  serviceContainer.resolve(serviceKey);

// Only usable within react components
export const useService = <T extends ServiceKey>(serviceKey: T) => {
  // useRef required to not re-create a service instance
  // and tie this reference to the lifecycle of the component using it
  // We call the returned service function that would:
  // a. return the global instance for singleton services
  // b. create a new instance for transient services
  const serviceRef = useRef<ServiceMap[T] | null>(null);
  if (!serviceRef.current) {
    serviceRef.current = serviceContainer.resolve(serviceKey);
  }
  return serviceRef.current;
};
