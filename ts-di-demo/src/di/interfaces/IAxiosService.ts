/**
 * Interface for HTTP service abstraction.
 * Provides a clean abstraction over HTTP operations for dependency injection.
 * This allows for easy mocking and testing by swapping implementations.
 */
export interface IAxiosService {
  /**
   * Performs a GET request
   * @param url - The URL to request
   * @param config - Optional request configuration
   * @returns Promise with the response data
   */
  get<T = any>(url: string, config?: RequestConfig): Promise<T>;

  /**
   * Performs a POST request
   * @param url - The URL to request
   * @param data - The data to send in the request body
   * @param config - Optional request configuration
   * @returns Promise with the response data
   */
  post<T = any>(url: string, data?: any, config?: RequestConfig): Promise<T>;

  /**
   * Performs a PUT request
   * @param url - The URL to request
   * @param data - The data to send in the request body
   * @param config - Optional request configuration
   * @returns Promise with the response data
   */
  put<T = any>(url: string, data?: any, config?: RequestConfig): Promise<T>;

  /**
   * Performs a DELETE request
   * @param url - The URL to request
   * @param config - Optional request configuration
   * @returns Promise with the response data
   */
  delete<T = any>(url: string, config?: RequestConfig): Promise<T>;

  /**
   * Sets the authentication token for subsequent requests
   * @param token - The authentication token
   */
  setAuthToken(token: string | null): void;

  /**
   * Sets the base URL for all requests
   * @param baseURL - The base URL
   */
  setBaseURL(baseURL: string): void;
}

/**
 * Configuration options for HTTP requests
 */
export interface RequestConfig {
  headers?: Record<string, string>;
  params?: Record<string, any>;
  timeout?: number;
  responseType?: 'json' | 'text' | 'blob' | 'arraybuffer';
}
