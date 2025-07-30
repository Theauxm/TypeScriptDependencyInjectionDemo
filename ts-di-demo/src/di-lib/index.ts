/**
 * DI Library - Core dependency injection framework
 * This library provides the fundamental dependency injection capabilities
 * without being tied to any specific service implementations
 */

export { ServiceContainer } from './ServiceContainer';
export { Injectable, setActiveContainer } from './decorators';
export { Environment, isServiceEnabledForEnvironment, getExpectedImplementation, detectEnvironment } from './Environment';
export { ServiceLifecycle, isServiceSingleton, getServiceLifecycle } from './ServiceLifecycle';
export { getService, useService, createContainerHooks } from './react';
export type { 
  ServiceKey, 
  ServiceMap, 
  ServiceInterfaceMap, 
  ServiceLifecycleConfig, 
  ServiceEnvironmentConfig, 
  DIConfiguration 
} from './types';
