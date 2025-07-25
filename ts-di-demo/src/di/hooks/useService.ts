import { useRef } from 'react';
import { ServiceContainer } from '../internal/ServiceContainer';
import { ServiceKey, ServiceType } from '../registration/ServiceRegistry';

/**
 * React hook for accessing services from the dependency injection container.
 * This hook provides type-safe service resolution with proper React lifecycle management.
 * 
 * - Singleton services: Cached at container level, shared across all components
 * - Transient services: Cached per component instance using useRef to maintain state
 *   during the component's lifecycle while still being independent between components
 * 
 * @param serviceKey - Type-safe service key from ServiceRegistry
 * @returns The resolved service instance with correct typing
 * 
 * @example
 * ```typescript
 * const colorService = useService('IColorService'); // Singleton - shared across components
 * const countService = useService('ICountService'); // Transient - unique per component
 * ```
 */
export function useService<K extends ServiceKey>(serviceKey: K): ServiceType<K> {
  const instanceRef = useRef<ServiceType<K> | null>(null);
  
  // Only resolve once per component instance
  // Singletons will be cached at container level
  // Transients will be cached per component via useRef
  if (instanceRef.current === null) {
    instanceRef.current = ServiceContainer.getInstance().resolve(serviceKey);
  }
  
  return instanceRef.current!;
}
