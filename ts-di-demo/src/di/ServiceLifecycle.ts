/**
 * Service lifecycle types and configuration
 * This file centralizes all service lifecycle management decisions
 */

export enum ServiceLifecycle {
  Singleton = "Singleton",
  Transient = "Transient"
}

/**
 * Default service lifecycle configuration
 * This defines whether each service should be a singleton or transient
 * The type is automatically derived from this implementation to ensure consistency
 */
export const DEFAULT_LIFECYCLE_PROFILE = {
  CustomerService: ServiceLifecycle.Singleton,
  AxiosService: ServiceLifecycle.Singleton,
  ColorService: ServiceLifecycle.Singleton,
  CountService: ServiceLifecycle.Transient,
  PaymentService: ServiceLifecycle.Transient,
  NwycService: ServiceLifecycle.Singleton,
  
  // Semantic Services Layer
  StorageService: ServiceLifecycle.Singleton,
  AuthenticationService: ServiceLifecycle.Singleton
} as const;

/**
 * Service lifecycle profile type derived from the actual implementation
 * This ensures the type and implementation can never drift apart
 */
export type ServiceLifecycleProfile = typeof DEFAULT_LIFECYCLE_PROFILE;

/**
 * Utility function to check if a service should be a singleton
 * @param serviceKey - The service key to check
 * @returns true if the service should be a singleton, false if transient
 */
export function isServiceSingleton(serviceKey: keyof ServiceLifecycleProfile): boolean {
  const lifecycle = DEFAULT_LIFECYCLE_PROFILE[serviceKey];
  if (lifecycle === undefined) {
    // Default to singleton if not configured
    console.warn(`No lifecycle configuration found for service '${serviceKey}', defaulting to Singleton`);
    return true;
  }
  return lifecycle === ServiceLifecycle.Singleton;
}

/**
 * Get the lifecycle type for a service
 * @param serviceKey - The service key to check
 * @returns The ServiceLifecycle enum value
 */
export function getServiceLifecycle(serviceKey: keyof ServiceLifecycleProfile): ServiceLifecycle {
  const lifecycle = DEFAULT_LIFECYCLE_PROFILE[serviceKey];
  if (lifecycle === undefined) {
    console.warn(`No lifecycle configuration found for service '${serviceKey}', defaulting to Singleton`);
    return ServiceLifecycle.Singleton;
  }
  return lifecycle;
}
