import { useRef } from "react";
import { ServiceCollection } from "../di/ServiceCollection";
import { IServiceFactory } from "../di/interfaces/IServiceFactory";

type ExtractServiceType<T> = T extends IServiceFactory<infer U> ? U : never;

export const useService = <T extends keyof typeof ServiceCollection>(
  serviceKey: T
) => {
  // useRef required to not re-create a service instance
  // and tie this reference to the lifecycle of the component using it
  const serviceRef = useRef(ServiceCollection[serviceKey].Create());
  return serviceRef.current as ExtractServiceType<typeof ServiceCollection[T]>;
};
