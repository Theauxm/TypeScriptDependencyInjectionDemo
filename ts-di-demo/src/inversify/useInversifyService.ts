import { useRef } from 'react';
import { getInversifyContainer } from './container';
import { ServiceKey, ServiceType } from './types';

/**
 * Type-safe hook for accessing services from the Inversify dependency injection container.
 * This hook retrieves services directly from the Inversify container and provides
 * component-scoped caching to match the behavior of the original useService hook.
 * 
 * For transient services (like CountService), the instance is cached per component 
 * instance to ensure the same service instance is used throughout the component's lifecycle.
 * For singleton services (like ColorService), Inversify handles the caching internally.
 * 
 * @template K - The service identifier type (must be a key from InversifyServiceRegistry)
 * @param serviceIdentifier - Service identifier symbol from SERVICE_IDENTIFIERS
 * @returns The service instance with full type safety
 * 
 * @example
 * const colorService = useInversifyService(SERVICE_IDENTIFIERS.IColorService);       // Type: IColorService
 * const countService = useInversifyService(SERVICE_IDENTIFIERS.ICountService);       // Type: ICountService
 * const customerService = useInversifyService(SERVICE_IDENTIFIERS.ICustomerService); // Type: ICustomerService
 */
export function useInversifyService<K extends ServiceKey>(serviceIdentifier: K): ServiceType<K> {
  const serviceRef = useRef<ServiceType<K> | null>(null);

  // Only create the service instance once per component instance
  // This provides component-scoped caching for transient services
  if (serviceRef.current === null) {
    const container = getInversifyContainer();
    serviceRef.current = container.get<ServiceType<K>>(serviceIdentifier);
  }

  return serviceRef.current;
}
