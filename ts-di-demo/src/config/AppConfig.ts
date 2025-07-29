import { Environment, CURRENT_ENVIRONMENT } from '../di-lib/Environment';

/**
 * Application configuration settings
 * Now uses environment-based configuration instead of individual boolean flags
 */
export const AppConfig = {
  /**
   * Current application environment
   * This determines which service implementations are used
   */
  ENVIRONMENT: CURRENT_ENVIRONMENT,

  /**
   * GraphQL API endpoint
   * Uses server-side API endpoint to bypass CORS
   */
  GRAPHQL_ENDPOINT: '/api/customers',

  /**
   * Request timeout in milliseconds
   */
  REQUEST_TIMEOUT: 10000,

  /**
   * NWYC API base URL
   * Production: https://nwyc.com
   * Development: https://nwyc.dev.cvoice.io
   */
  NWYC_API_BASE_URL: 'https://nwyc.dev.cvoice.io',

  /**
   * NWYC API request timeout in milliseconds
   */
  NWYC_REQUEST_TIMEOUT: 10000,

} as const;
