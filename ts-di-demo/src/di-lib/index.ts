/**
 * DI Library - Core dependency injection framework
 * This library provides the fundamental dependency injection capabilities
 * without being tied to any specific service implementations
 */

export { ServiceContainer, serviceContainer } from './ServiceContainer';
export { Injectable } from './decorators';
export { Environment, isServiceEnabledForEnvironment, getExpectedImplementation } from './Environment';
export { ServiceLifecycle, isServiceSingleton, getServiceLifecycle } from './ServiceLifecycle';
export type { 
  ServiceKey, 
  ServiceMap, 
  ServiceInterfaceMap, 
  ServiceLifecycleConfig, 
  ServiceEnvironmentConfig, 
  DIConfiguration 
} from './types';
