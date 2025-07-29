/**
 * Service lifecycle types and utilities
 * This file provides generic lifecycle management without hardcoded service configurations
 */

export enum ServiceLifecycle {
  Singleton = "Singleton",
  Transient = "Transient"
}

/**
 * Utility function to check if a service should be a singleton
 * @param serviceKey - The service key to check
 * @param lifecycleConfig - The lifecycle configuration object
 * @returns true if the service should be a singleton, false if transient
 */
export function isServiceSingleton<TServiceKeys extends string>(
  serviceKey: TServiceKeys,
  lifecycleConfig: Record<TServiceKeys, 'Singleton' | 'Transient'>
): boolean {
  const lifecycle = lifecycleConfig[serviceKey];
  if (lifecycle === undefined) {
    // Default to singleton if not configured
    console.warn(`No lifecycle configuration found for service '${serviceKey}', defaulting to Singleton`);
    return true;
  }
  return lifecycle === 'Singleton';
}

/**
 * Get the lifecycle type for a service
 * @param serviceKey - The service key to check
 * @param lifecycleConfig - The lifecycle configuration object
 * @returns The ServiceLifecycle enum value
 */
export function getServiceLifecycle<TServiceKeys extends string>(
  serviceKey: TServiceKeys,
  lifecycleConfig: Record<TServiceKeys, 'Singleton' | 'Transient'>
): ServiceLifecycle {
  const lifecycle = lifecycleConfig[serviceKey];
  if (lifecycle === undefined) {
    console.warn(`No lifecycle configuration found for service '${serviceKey}', defaulting to Singleton`);
    return ServiceLifecycle.Singleton;
  }
  return lifecycle === 'Singleton' ? ServiceLifecycle.Singleton : ServiceLifecycle.Transient;
}
