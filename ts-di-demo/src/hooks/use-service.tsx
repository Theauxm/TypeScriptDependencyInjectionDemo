import { useRef } from "react";
import { ServiceCollection } from "../di/ServiceCollection";

type SingletonServicesKey = keyof (typeof ServiceCollection)["Singleton"];
type TransientServicesKey = keyof (typeof ServiceCollection)["Transient"];
type ServiceKey = SingletonServicesKey | TransientServicesKey;
type Service<T extends ServiceKey> = T extends SingletonServicesKey
  ? ReturnType<(typeof ServiceCollection)["Singleton"][T]>
  : T extends TransientServicesKey
  ? ReturnType<(typeof ServiceCollection)["Transient"][T]>
  : never;

export const getService = <T extends ServiceKey>(serviceKey: T) => {
  if (Object.keys(ServiceCollection.Singleton).includes(serviceKey))
    return ServiceCollection.Singleton[serviceKey as SingletonServicesKey]();
  else return ServiceCollection.Transient[serviceKey as TransientServicesKey]();
};

// Only usable within react components
export const useService = <T extends ServiceKey>(serviceKey: T) => {
  // useRef required to not re-create a service instance
  // and tie this reference to the lifecycle of the component using it
  // We call the returned service function that would:
  // a. return the global instance for singleton services
  // b. create a new instance for transient services
  const serviceRef = useRef(getService(serviceKey));
  return serviceRef.current as Service<T>;
};
