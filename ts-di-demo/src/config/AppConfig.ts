import { Environment, detectEnvironment } from '../di-lib/Environment';

// Get the current environment using the generic detection utility
const CURRENT_ENVIRONMENT = detectEnvironment() as Environment;

/**
 * Environment-specific configuration profiles
 * Each environment can have different values for the same configuration keys
 */
const CONFIG_PROFILES = {
  [Environment.Local]: {
    GRAPHQL_ENDPOINT: '/api/customers',
    NWYC_API_BASE_URL: 'http://localhost:3001', // Local development server
    REQUEST_TIMEOUT: 5000, // Shorter timeout for local development
    NWYC_REQUEST_TIMEOUT: 5000,
    API_RETRY_ATTEMPTS: 2, // Fewer retries for local development
    CACHE_TTL: 300000, // 5 minutes cache for local development
    DEBUG_MODE: true,
    LOG_LEVEL: 'debug' as const,
    ENABLE_MOCK_DATA: true,
  },
  [Environment.Development]: {
    GRAPHQL_ENDPOINT: '/api/customers',
    NWYC_API_BASE_URL: 'https://nwyc.dev.cvoice.io', // Current dev URL
    REQUEST_TIMEOUT: 10000, // Current timeout
    NWYC_REQUEST_TIMEOUT: 10000,
    API_RETRY_ATTEMPTS: 3, // Standard retries for development
    CACHE_TTL: 600000, // 10 minutes cache for development
    DEBUG_MODE: true,
    LOG_LEVEL: 'info' as const,
    ENABLE_MOCK_DATA: false,
  },
  [Environment.Production]: {
    GRAPHQL_ENDPOINT: '/api/customers',
    NWYC_API_BASE_URL: 'https://nwyc.com', // Production URL
    REQUEST_TIMEOUT: 15000, // Longer timeout for production
    NWYC_REQUEST_TIMEOUT: 15000,
    API_RETRY_ATTEMPTS: 5, // More retries for production reliability
    CACHE_TTL: 1800000, // 30 minutes cache for production
    DEBUG_MODE: false,
    LOG_LEVEL: 'error' as const,
    ENABLE_MOCK_DATA: false,
  }
} as const;

/**
 * Base configuration structure that all environments must follow
 */
export interface ConfigProfile {
  GRAPHQL_ENDPOINT: string;
  NWYC_API_BASE_URL: string;
  REQUEST_TIMEOUT: number;
  NWYC_REQUEST_TIMEOUT: number;
  API_RETRY_ATTEMPTS: number;
  CACHE_TTL: number;
  DEBUG_MODE: boolean;
  LOG_LEVEL: 'debug' | 'info' | 'warn' | 'error';
  ENABLE_MOCK_DATA: boolean;
}

/**
 * Compile-time validation to ensure all environments implement the ConfigProfile interface
 */
type ValidateConfigProfiles = {
  [K in Environment]: ConfigProfile
};
// This will cause a compile error if any environment is missing required keys or has wrong types
const _validateProfiles: ValidateConfigProfiles = CONFIG_PROFILES;

/**
 * Application configuration settings
 * Now uses environment-based configuration with different values per environment
 */
export const AppConfig = {
  /**
   * Current application environment
   * This determines which service implementations are used
   */
  ENVIRONMENT: CURRENT_ENVIRONMENT,
  
  /**
   * Environment-specific configuration values
   * These are automatically selected based on CURRENT_ENVIRONMENT
   */
  ...CONFIG_PROFILES[CURRENT_ENVIRONMENT]
} as const;

/**
 * Utility function to get configuration for a specific environment
 * Useful for testing or debugging
 */
export function getConfigForEnvironment(env: Environment): ConfigProfile {
  return CONFIG_PROFILES[env];
}

/**
 * Utility function to get all available configuration profiles
 * Useful for debugging and testing
 */
export function getAllConfigProfiles() {
  return CONFIG_PROFILES;
}

/**
 * Type guard to check if a configuration key exists
 */
export function isValidConfigKey(key: string): key is keyof ConfigProfile {
  return key in CONFIG_PROFILES[Environment.Local];
}
