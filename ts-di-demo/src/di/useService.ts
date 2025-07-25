import { useRef } from 'react';
import { ServiceContainer } from './ServiceContainer';
import { ServiceKey, ServiceType } from './ServiceRegistry';

/**
 * Type-safe hook for accessing services from the global dependency injection container.
 * This hook retrieves services directly from the ServiceContainer without relying on
 * React Context, providing better performance and cleaner architecture.
 * 
 * For scoped services, the instance is cached per component instance to ensure
 * the same service instance is used throughout the component's lifecycle.
 * For singleton services, the factory handles the caching internally.
 * 
 * @template K - The service key type (must be a key from ServiceRegistry)
 * @param serviceKey - Type-safe service key from ServiceRegistry
 * @returns The service instance with full type safety
 * 
 * @example
 * const colorService = useService('IColorService');    // Type: IColorService
 * const countService = useService('ICountService');    // Type: ICountService
 * const customerService = useService('ICustomerService'); // Type: ICustomerService
 */
export function useService<K extends ServiceKey>(serviceKey: K): ServiceType<K> {
  const serviceRef = useRef<ServiceType<K> | null>(null);

  // Only create the service instance once per component instance
  if (serviceRef.current === null) {
    const container = ServiceContainer.getInstance();
    serviceRef.current = container.resolve(serviceKey);
  }

  return serviceRef.current;
}
