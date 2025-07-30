import { createContainerHooks } from "../di-lib/react";
import { demoServiceContainer } from "../config/DIInitialization";
import type { ServiceKey, ServiceInterfaceMap } from "../di-lib/types";

// Create demo-specific hooks using the demo's container
const { getService: getServiceFromContainer, useService: useServiceFromContainer } = createContainerHooks(demoServiceContainer);

export const getService = <T extends ServiceKey>(serviceKey: T): ServiceInterfaceMap[T] => {
  return getServiceFromContainer(serviceKey);
};

// Only usable within react components
export const useService = <T extends ServiceKey>(serviceKey: T): ServiceInterfaceMap[T] => {
  return useServiceFromContainer(serviceKey);
};
