/**
 * Application environment types and configuration
 */

export enum Environment {
  Local = "Local",
  Development = "Development", 
  Production = "Production"
}

/**
 * Default service profile configuration
 * This defines which service implementations are used in each environment
 * The type is automatically derived from this implementation to ensure consistency
 */
export const DEFAULT_SERVICE_PROFILE = {
  CustomerService: {
    [Environment.Local]: "FakeCustomerService",
    [Environment.Development]: "FakeCustomerService",
    [Environment.Production]: "RealCustomerService"
  },
  AxiosService: {
    [Environment.Local]: "FakeAxiosService",
    [Environment.Development]: "FakeAxiosService",
    [Environment.Production]: "RealAxiosService"
  },
  ColorService: {
    [Environment.Local]: "ColorService",
    [Environment.Development]: "ColorService",
    [Environment.Production]: "ColorService"
  },
  CountService: {
    [Environment.Local]: "CountService",
    [Environment.Development]: "CountService",
    [Environment.Production]: "CountService"
  },
  PaymentService: {
    [Environment.Local]: "PaymentService",
    [Environment.Development]: "PaymentService",
    [Environment.Production]: "PaymentService"
  },
  NwycService: {
    [Environment.Local]: "NwycService",
    [Environment.Development]: "NwycService",
    [Environment.Production]: "NwycService"
  },
  
  // Semantic Services Layer
  StorageService: {
    [Environment.Local]: "MemoryStorageService",
    [Environment.Development]: "MemoryStorageService",
    [Environment.Production]: "MemoryStorageService"
  },
  AuthenticationService: {
    [Environment.Local]: "AuthenticationService",
    [Environment.Development]: "AuthenticationService",
    [Environment.Production]: "AuthenticationService"
  }
} as const;

/**
 * Service profile type derived from the actual implementation
 * This ensures the type and implementation can never drift apart
 */
export type ServiceProfile = typeof DEFAULT_SERVICE_PROFILE;

/**
 * Current application environment
 * This should be set based on your deployment environment
 */
export const CURRENT_ENVIRONMENT: Environment = Environment.Local;

/**
 * Utility function to check if a service should be enabled
 * in the current environment based on the service profile
 */
export function isServiceEnabledForEnvironment(
  serviceKey: keyof ServiceProfile,
  implementationName: string,
  environment: Environment = CURRENT_ENVIRONMENT
): boolean {
  const profile = DEFAULT_SERVICE_PROFILE[serviceKey];
  if (!profile) {
    // If no profile exists for this service, default to enabled
    return true;
  }
  
  return profile[environment] === implementationName;
}

/**
 * Get the expected service implementation for a given service key and environment
 */
export function getExpectedImplementation(
  serviceKey: keyof ServiceProfile,
  environment: Environment = CURRENT_ENVIRONMENT
): string | null {
  const profile = DEFAULT_SERVICE_PROFILE[serviceKey];
  return profile ? profile[environment] : null;
}
