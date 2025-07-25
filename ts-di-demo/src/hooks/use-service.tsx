import { useRef } from "react";
import { ServiceCollection } from "../di/ServiceCollection";
import { IServiceFactory } from "../di/interfaces/IServiceFactory";

type ServiceName = keyof typeof ServiceCollection;
type Service<T extends ServiceName> = (typeof ServiceCollection)[T];
type ServiceType<T> = T extends IServiceFactory<infer U> ? U : never;

// Useful to use anywhere outside of react components
export const getServiceFactory = <T extends ServiceName>(serviceKey: T) =>
  ServiceCollection[serviceKey];

// Only usable within react components
export const useService = <T extends ServiceName>(serviceKey: T) => {
  // useRef required to not re-create a service instance
  // and tie this reference to the lifecycle of the component using it
  const serviceRef = useRef(getServiceFactory(serviceKey).Create());
  return serviceRef.current as ServiceType<Service<T>>;
};
