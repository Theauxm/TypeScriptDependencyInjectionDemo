import axios, { AxiosInstance, AxiosRequestConfig, AxiosResponse, AxiosError } from 'axios';
import { Injectable } from '../../di-lib/decorators';
import { IAxiosService } from './IAxiosService';
import { AppConfig } from '../../config/AppConfig';

/**
 * Real implementation of IAxiosService that makes actual HTTP requests using Axios.
 * Handles network errors, HTTP errors, and provides proper timeout management.
 * Active in Production environment.
 */
@Injectable("AxiosService")
export class RealAxiosService implements IAxiosService {
  private axiosInstance: AxiosInstance;

  constructor() {
    this.axiosInstance = axios.create({
      baseURL: AppConfig.NWYC_API_BASE_URL,
      timeout: AppConfig.NWYC_REQUEST_TIMEOUT,
      headers: {
        'Content-Type': 'application/json',
      },
    });

    // Request interceptor for logging and auth
    this.axiosInstance.interceptors.request.use(
      (config) => {
        console.log(`[RealAxiosService] ${config.method?.toUpperCase()} ${config.url}`);
        return config;
      },
      (error) => {
        console.error('[RealAxiosService] Request error:', error);
        return Promise.reject(error);
      }
    );

    // Response interceptor for error handling
    this.axiosInstance.interceptors.response.use(
      (response) => {
        console.log(`[RealAxiosService] Response ${response.status} from ${response.config.url}`);
        return response;
      },
      (error: AxiosError) => {
        console.error('[RealAxiosService] Response error:', error.message);
        return Promise.reject(this.handleAxiosError(error));
      }
    );
  }

  async get<T = any>(url: string, config?: AxiosRequestConfig): Promise<T> {
    try {
      const response = await this.axiosInstance.get<T>(url, config);
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  async post<T = any>(url: string, data?: any, config?: AxiosRequestConfig): Promise<T> {
    try {
      const response = await this.axiosInstance.post<T>(url, data, config);
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  async put<T = any>(url: string, data?: any, config?: AxiosRequestConfig): Promise<T> {
    try {
      const response = await this.axiosInstance.put<T>(url, data, config);
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  async delete<T = any>(url: string, config?: AxiosRequestConfig): Promise<T> {
    try {
      const response = await this.axiosInstance.delete<T>(url, config);
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  async patch<T = any>(url: string, data?: any, config?: AxiosRequestConfig): Promise<T> {
    try {
      const response = await this.axiosInstance.patch<T>(url, data, config);
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  async getResponse<T = any>(url: string, config?: AxiosRequestConfig): Promise<AxiosResponse<T>> {
    try {
      return await this.axiosInstance.get<T>(url, config);
    } catch (error) {
      throw this.handleError(error);
    }
  }

  async postResponse<T = any>(url: string, data?: any, config?: AxiosRequestConfig): Promise<AxiosResponse<T>> {
    try {
      return await this.axiosInstance.post<T>(url, data, config);
    } catch (error) {
      throw this.handleError(error);
    }
  }

  private handleAxiosError(error: AxiosError): Error {
    if (error.code === 'ECONNABORTED') {
      return new Error(`Request timed out after ${AppConfig.NWYC_REQUEST_TIMEOUT / 1000} seconds`);
    }

    if (error.response) {
      // Server responded with error status
      const status = error.response.status;
      const statusText = error.response.statusText;
      return new Error(`HTTP Error: ${status} ${statusText}`);
    }

    if (error.request) {
      // Request was made but no response received
      return new Error('Network Error: No response received from server');
    }

    // Something else happened
    return new Error(`Request Error: ${error.message}`);
  }

  private handleError(error: unknown): Error {
    if (error instanceof Error) {
      return error;
    }

    return new Error('An unknown error occurred during HTTP request');
  }
}
