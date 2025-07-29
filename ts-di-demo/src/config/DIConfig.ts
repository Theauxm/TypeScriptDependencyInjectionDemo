import { Environment } from '../di-lib/Environment';
import type { DIConfiguration } from '../di-lib/types';

/**
 * Service keys used in the demo application
 */
export type DemoServiceKeys = 
  | 'ColorService'
  | 'CountService'
  | 'CustomerService'
  | 'PaymentService'
  | 'AxiosService'
  | 'NwycService'
  | 'StorageService'
  | 'AuthenticationService';

/**
 * Lifecycle configuration - defines whether each service is singleton or transient
 */
export const lifecycleConfig = {
  ColorService: 'Singleton',
  CountService: 'Singleton',
  CustomerService: 'Singleton',
  PaymentService: 'Singleton',
  AxiosService: 'Singleton',
  NwycService: 'Singleton',
  StorageService: 'Singleton',
  AuthenticationService: 'Singleton',
} as const;

/**
 * Environment configuration - defines which implementation to use in each environment
 */
export const environmentConfig = {
  ColorService: {
    [Environment.Local]: 'ColorService',
    [Environment.Development]: 'ColorService',
    [Environment.Production]: 'ColorService',
  },
  CountService: {
    [Environment.Local]: 'CountService',
    [Environment.Development]: 'CountService',
    [Environment.Production]: 'CountService',
  },
  CustomerService: {
    [Environment.Local]: 'FakeCustomerService',
    [Environment.Development]: 'RealCustomerService',
    [Environment.Production]: 'RealCustomerService',
  },
  PaymentService: {
    [Environment.Local]: 'PaymentService',
    [Environment.Development]: 'PaymentService',
    [Environment.Production]: 'PaymentService',
  },
  AxiosService: {
    [Environment.Local]: 'FakeAxiosService',
    [Environment.Development]: 'RealAxiosService',
    [Environment.Production]: 'RealAxiosService',
  },
  NwycService: {
    [Environment.Local]: 'NwycService',
    [Environment.Development]: 'NwycService',
    [Environment.Production]: 'NwycService',
  },
  StorageService: {
    [Environment.Local]: 'MemoryStorageService',
    [Environment.Development]: 'MemoryStorageService',
    [Environment.Production]: 'MemoryStorageService',
  },
  AuthenticationService: {
    [Environment.Local]: 'AuthenticationService',
    [Environment.Development]: 'AuthenticationService',
    [Environment.Production]: 'AuthenticationService',
  },
} as const;

/**
 * Complete DI configuration for the demo application
 */
export const demoConfiguration: DIConfiguration<DemoServiceKeys, Environment> = {
  lifecycleConfig,
  environmentConfig,
  currentEnvironment: Environment.Local, // Default to Local, can be overridden
};
