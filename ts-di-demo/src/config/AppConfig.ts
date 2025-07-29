/**
 * Application configuration settings
 */
export const AppConfig = {
  /**
   * Determines whether to use the real API service or the fake/mock service
   * Set to true for real API calls, false for mock data
   */
  USE_REAL_API: true,

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
   * Determines whether to use the real NWYC API service or the fake/mock service
   * Set to true for real NWYC API calls, false for mock data
   */
  USE_REAL_NWYC_API: true,

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
