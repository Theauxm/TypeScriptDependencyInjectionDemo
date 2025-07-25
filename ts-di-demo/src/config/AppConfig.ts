/**
 * Application configuration settings
 */
export const AppConfig = {
  /**
   * Determines whether to use the real API service or the fake/mock service
   * Set to true for real API calls, false for mock data
   */
  USE_REAL_API: false,

  /**
   * GraphQL API endpoint
   * Uses server-side API endpoint to bypass CORS
   */
  GRAPHQL_ENDPOINT: '/api/customers',

  /**
   * Request timeout in milliseconds
   */
  REQUEST_TIMEOUT: 10000,
} as const;
