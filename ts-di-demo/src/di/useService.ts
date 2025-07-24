import { useRef } from 'react';
import { useServiceCollection } from './ServiceProvider';

/**
 * Generic hook for accessing services from the dependency injection container.
 * This hook retrieves the factory for the specified service interface,
 * calls Create() on the factory, and returns the service instance.
 * 
 * For scoped services, the instance is cached per component instance to ensure
 * the same service instance is used throughout the component's lifecycle.
 * For singleton services, the factory handles the caching internally.
 * 
 * @template T - The service interface type
 * @param serviceKey - Unique key identifying the service interface
 * @returns The service instance of type T
 * 
 * @example
 * const colorService = useService<IColorService>('IColorService');
 * const countService = useService<ICountService>('ICountService');
 */
export function useService<T>(serviceKey: string): T {
  const serviceCollection = useServiceCollection();
  const serviceRef = useRef<T | null>(null);

  // Only create the service instance once per component instance
  if (serviceRef.current === null) {
    const factory = serviceCollection.getFactory<T>(serviceKey);
    serviceRef.current = factory.Create();
  }

  return serviceRef.current;
}
