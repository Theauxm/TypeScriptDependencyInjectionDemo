/**
 * Core DI library types
 * This file defines the fundamental types for the dependency injection system
 * without importing any specific service implementations
 */

// These will be defined by the services layer that uses this DI library
export interface ServiceMap {}
export interface ServiceInterfaceMap {}

export type ServiceKey = keyof ServiceMap;
