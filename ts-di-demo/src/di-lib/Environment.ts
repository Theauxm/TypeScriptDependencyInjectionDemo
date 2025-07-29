/**
 * Application environment types and utilities
 * This file provides generic environment management without hardcoded service configurations
 */

export enum Environment {
  Local = "Local",
  Development = "Development", 
  Production = "Production"
}

/**
 * Current environment - can be overridden by environment variable or build configuration
 */
export const CURRENT_ENVIRONMENT = (process.env.REACT_APP_ENVIRONMENT as Environment) || Environment.Local;

/**
 * Utility function to check if a service should be enabled
 * in the current environment based on the service profile
 */
export function isServiceEnabledForEnvironment<
  TServiceKeys extends string,
  TEnvironments extends string
>(
  serviceKey: TServiceKeys,
  implementationName: string,
  environmentConfig: Record<TServiceKeys, Record<TEnvironments, string>>,
  environment: TEnvironments
): boolean {
  const profile = environmentConfig[serviceKey];
  if (!profile) {
    // If no profile exists for this service, default to enabled
    return true;
  }
  
  return profile[environment] === implementationName;
}

/**
 * Get the expected service implementation for a given service key and environment
 */
export function getExpectedImplementation<
  TServiceKeys extends string,
  TEnvironments extends string
>(
  serviceKey: TServiceKeys,
  environmentConfig: Record<TServiceKeys, Record<TEnvironments, string>>,
  environment: TEnvironments
): string | null {
  const profile = environmentConfig[serviceKey];
  return profile ? profile[environment] : null;
}
