/**
 * Core DI library types
 * This file defines the fundamental types for the dependency injection system
 * without importing any specific service implementations
 */

// Default service map that can be extended by consumers
export interface ServiceMap extends Record<string, any> {}
export interface ServiceInterfaceMap extends Record<string, any> {}

// ServiceKey defaults to string if ServiceMap is empty, otherwise uses the keys
export type ServiceKey = keyof ServiceMap extends never ? string : keyof ServiceMap;

/**
 * Generic service lifecycle configuration interface
 * Consumers provide their own configuration object that maps service keys to lifecycle types
 */
export type ServiceLifecycleConfig<TServiceKeys extends string = string> = {
  readonly [K in TServiceKeys]: 'Singleton' | 'Transient';
}

/**
 * Generic service environment configuration interface
 * Consumers provide their own configuration object that maps service keys to environment-specific implementations
 */
export type ServiceEnvironmentConfig<
  TServiceKeys extends string = string,
  TEnvironments extends string = string
> = {
  readonly [K in TServiceKeys]: {
    readonly [E in TEnvironments]: string;
  };
}

/**
 * DI Configuration interface that consumers must provide
 */
export interface DIConfiguration<
  TServiceKeys extends string = string,
  TEnvironments extends string = string
> {
  lifecycleConfig: ServiceLifecycleConfig<TServiceKeys>;
  environmentConfig: ServiceEnvironmentConfig<TServiceKeys, TEnvironments>;
  currentEnvironment: TEnvironments;
}
