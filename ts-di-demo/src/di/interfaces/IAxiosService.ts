import { AxiosRequestConfig, AxiosResponse } from 'axios';

/**
 * Interface for HTTP service operations using Axios.
 * This interface abstracts the HTTP layer, allowing for both real HTTP calls
 * and mock implementations for testing and development.
 */
export interface IAxiosService {
  /**
   * Perform a GET request
   * @param url - The URL to request
   * @param config - Optional Axios configuration
   * @returns Promise with the response data
   */
  get<T = any>(url: string, config?: AxiosRequestConfig): Promise<T>;

  /**
   * Perform a POST request
   * @param url - The URL to request
   * @param data - The data to send in the request body
   * @param config - Optional Axios configuration
   * @returns Promise with the response data
   */
  post<T = any>(url: string, data?: any, config?: AxiosRequestConfig): Promise<T>;

  /**
   * Perform a PUT request
   * @param url - The URL to request
   * @param data - The data to send in the request body
   * @param config - Optional Axios configuration
   * @returns Promise with the response data
   */
  put<T = any>(url: string, data?: any, config?: AxiosRequestConfig): Promise<T>;

  /**
   * Perform a DELETE request
   * @param url - The URL to request
   * @param config - Optional Axios configuration
   * @returns Promise with the response data
   */
  delete<T = any>(url: string, config?: AxiosRequestConfig): Promise<T>;

  /**
   * Perform a PATCH request
   * @param url - The URL to request
   * @param data - The data to send in the request body
   * @param config - Optional Axios configuration
   * @returns Promise with the response data
   */
  patch<T = any>(url: string, data?: any, config?: AxiosRequestConfig): Promise<T>;

  /**
   * Get the full Axios response (including headers, status, etc.)
   * @param url - The URL to request
   * @param config - Optional Axios configuration
   * @returns Promise with the full Axios response
   */
  getResponse<T = any>(url: string, config?: AxiosRequestConfig): Promise<AxiosResponse<T>>;

  /**
   * Post and get the full Axios response (including headers, status, etc.)
   * @param url - The URL to request
   * @param data - The data to send in the request body
   * @param config - Optional Axios configuration
   * @returns Promise with the full Axios response
   */
  postResponse<T = any>(url: string, data?: any, config?: AxiosRequestConfig): Promise<AxiosResponse<T>>;
}
