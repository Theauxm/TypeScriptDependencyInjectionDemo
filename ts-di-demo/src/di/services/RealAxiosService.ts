import axios, { AxiosInstance, AxiosRequestConfig, AxiosResponse } from 'axios';
import { IAxiosService, RequestConfig } from '../interfaces/IAxiosService';

/**
 * Real implementation of IAxiosService using the Axios library.
 * Handles actual HTTP requests with proper error handling, authentication,
 * and request/response interceptors.
 */
export class RealAxiosService implements IAxiosService {
  private axiosInstance: AxiosInstance;
  private authToken: string | null = null;

  constructor(baseURL?: string) {
    this.axiosInstance = axios.create({
      baseURL: baseURL || 'https://nwyc.com',
      timeout: 10000,
      headers: {
        'Content-Type': 'application/json',
      },
    });

    this.setupInterceptors();
  }

  private setupInterceptors(): void {
    // Request interceptor to add authentication token
    this.axiosInstance.interceptors.request.use(
      (config) => {
        if (this.authToken) {
          config.headers = config.headers || {};
          config.headers['Authentication'] = this.authToken;
        }
        return config;
      },
      (error) => {
        return Promise.reject(error);
      }
    );

    // Response interceptor for error handling
    this.axiosInstance.interceptors.response.use(
      (response: AxiosResponse) => {
        return response;
      },
      (error) => {
        if (error.response) {
          // Server responded with error status
          const message = error.response.data?.message || `HTTP Error: ${error.response.status}`;
          throw new Error(message);
        } else if (error.request) {
          // Request was made but no response received
          throw new Error('Network Error: No response received from server');
        } else {
          // Something else happened
          throw new Error(`Request Error: ${error.message}`);
        }
      }
    );
  }

  async get<T = any>(url: string, config?: RequestConfig): Promise<T> {
    try {
      const axiosConfig: AxiosRequestConfig = this.buildAxiosConfig(config);
      const response = await this.axiosInstance.get<T>(url, axiosConfig);
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  async post<T = any>(url: string, data?: any, config?: RequestConfig): Promise<T> {
    try {
      const axiosConfig: AxiosRequestConfig = this.buildAxiosConfig(config);
      
      // Handle form data for NWYC API endpoints that expect form-encoded data
      if (data && typeof data === 'object' && !config?.headers?.['Content-Type']) {
        axiosConfig.headers = {
          ...axiosConfig.headers,
          'Content-Type': 'application/x-www-form-urlencoded',
        };
        
        // Convert object to URLSearchParams for form encoding
        const formData = new URLSearchParams();
        Object.keys(data).forEach(key => {
          const value = data[key];
          if (Array.isArray(value)) {
            value.forEach(item => formData.append(key, item));
          } else if (value !== undefined && value !== null) {
            formData.append(key, value.toString());
          }
        });
        data = formData.toString();
      }

      const response = await this.axiosInstance.post<T>(url, data, axiosConfig);
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  async put<T = any>(url: string, data?: any, config?: RequestConfig): Promise<T> {
    try {
      const axiosConfig: AxiosRequestConfig = this.buildAxiosConfig(config);
      const response = await this.axiosInstance.put<T>(url, data, axiosConfig);
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  async delete<T = any>(url: string, config?: RequestConfig): Promise<T> {
    try {
      const axiosConfig: AxiosRequestConfig = this.buildAxiosConfig(config);
      const response = await this.axiosInstance.delete<T>(url, axiosConfig);
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  setAuthToken(token: string | null): void {
    this.authToken = token;
  }

  setBaseURL(baseURL: string): void {
    this.axiosInstance.defaults.baseURL = baseURL;
  }

  private buildAxiosConfig(config?: RequestConfig): AxiosRequestConfig {
    if (!config) return {};

    return {
      headers: config.headers,
      params: config.params,
      timeout: config.timeout,
      responseType: config.responseType,
    };
  }

  private handleError(error: any): Error {
    if (error instanceof Error) {
      return error;
    }
    return new Error('An unknown error occurred');
  }
}
