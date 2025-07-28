/**
 * Application configuration settings
 */
export const AppConfig = {
  /**
   * Determines whether to use the real API service or the fake/mock service
   * Set to true for real API calls, false for mock data
   * This setting applies to both Customer API and NWYC API services
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

  /**
   * NWYC API Configuration
   */
  
  /**
   * NWYC API base URL
   */
  NWYC_API_BASE_URL: 'https://nwyc.com',

  /**
   * NWYC API development base URL
   */
  NWYC_DEV_API_BASE_URL: 'https://nwyc.dev.cvoice.io',

  /**
   * NWYC API request timeout in milliseconds
   */
  NWYC_REQUEST_TIMEOUT: 10000,
} as const;
