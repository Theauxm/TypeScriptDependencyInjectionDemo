/**
 * DI Library - Core dependency injection framework
 * This library provides the fundamental dependency injection capabilities
 * without being tied to any specific service implementations
 */

export { serviceContainer } from './ServiceContainer';
export { Injectable } from './decorators';
export { Environment, CURRENT_ENVIRONMENT, DEFAULT_SERVICE_PROFILE, isServiceEnabledForEnvironment, getExpectedImplementation } from './Environment';
export { ServiceLifecycle, DEFAULT_LIFECYCLE_PROFILE, isServiceSingleton, getServiceLifecycle } from './ServiceLifecycle';
export type { ServiceKey, ServiceMap, ServiceInterfaceMap } from './types';
export type { ServiceProfile } from './Environment';
export type { ServiceLifecycleProfile } from './ServiceLifecycle';
