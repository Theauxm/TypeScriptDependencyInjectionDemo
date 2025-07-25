import 'reflect-metadata';
import { ServiceRegistry, ServiceKey, ServiceType } from '../registration/ServiceRegistry';

/**
 * Service lifetime enumeration for dependency injection.
 */
export enum ServiceLifetime {
  Singleton,
  Transient
}

/**
 * Type for service constructors.
 */
type ServiceConstructor<T> = new (...args: any[]) => T;

/**
 * Internal service registration information.
 */
interface ServiceRegistration<T> {
  lifetime: ServiceLifetime;
  constructor: ServiceConstructor<T>;
  dependencies: string[];
}

/**
 * Global singleton service container that manages services with decorator-based
 * dependency injection. This container supports both Singleton and Transient
 * lifecycles with automatic dependency resolution.
 */
export class ServiceContainer {
  private static instance: ServiceContainer | null = null;
  private services = new Map<string, ServiceRegistration<any>>();
  private singletonInstances = new Map<string, any>();
  private isResolving = new Set<string>();
  private isInitialized: boolean = false;

  private constructor() {}

  /**
   * Gets the singleton instance of the ServiceContainer.
   * Throws an error if the container hasn't been initialized.
   */
  public static getInstance(): ServiceContainer {
    if (ServiceContainer.instance === null) {
      throw new Error(
        'ServiceContainer has not been initialized. Call ServiceContainer.initialize() before using services.'
      );
    }
    return ServiceContainer.instance;
  }

  /**
   * Initializes the ServiceContainer singleton.
   * This should be called once at application startup.
   * 
   * @param configureServices - Function that registers services in the container
   */
  public static initialize(configureServices: (container: ServiceContainer) => void): void {
    if (ServiceContainer.instance !== null) {
      console.warn('ServiceContainer is already initialized. Subsequent calls to initialize() are ignored.');
      return;
    }

    ServiceContainer.instance = new ServiceContainer();
    configureServices(ServiceContainer.instance);
    ServiceContainer.instance.isInitialized = true;
  }

  /**
   * Registers a service with the container using decorator-based dependency injection.
   * 
   * @param serviceKey - Type-safe service key from ServiceRegistry
   * @param constructor - Constructor function for the service
   * @param lifetime - Service lifetime (Singleton or Transient)
   */
  public register<K extends ServiceKey>(
    serviceKey: K,
    constructor: ServiceConstructor<ServiceType<K>>,
    lifetime: ServiceLifetime = ServiceLifetime.Transient
  ): void {
    if (this.isInitialized) {
      throw new Error(
        `Cannot register service '${serviceKey}' after container initialization. ` +
        'All services must be registered during the initialization phase.'
      );
    }

    // Get dependency metadata from decorator
    const dependencies = Reflect.getMetadata('inject:dependencies', constructor) || [];
    
    this.services.set(serviceKey, {
      lifetime,
      constructor,
      dependencies
    });
  }

  /**
   * Registers a service as a singleton.
   * 
   * @param serviceKey - Type-safe service key from ServiceRegistry
   * @param constructor - Constructor function for the service
   */
  public registerSingleton<K extends ServiceKey>(
    serviceKey: K,
    constructor: ServiceConstructor<ServiceType<K>>
  ): void {
    this.register(serviceKey, constructor, ServiceLifetime.Singleton);
  }

  /**
   * Registers a service as transient (new instance each time).
   * 
   * @param serviceKey - Type-safe service key from ServiceRegistry
   * @param constructor - Constructor function for the service
   */
  public registerTransient<K extends ServiceKey>(
    serviceKey: K,
    constructor: ServiceConstructor<ServiceType<K>>
  ): void {
    this.register(serviceKey, constructor, ServiceLifetime.Transient);
  }

  /**
   * Resolves a service instance with full type safety and automatic dependency injection.
   * 
   * @param serviceKey - Type-safe service key from ServiceRegistry
   * @returns The service instance of the correct type
   */
  public resolve<K extends ServiceKey>(serviceKey: K): ServiceType<K> {
    if (!this.isInitialized) {
      throw new Error(
        'ServiceContainer is not fully initialized. Services cannot be resolved during initialization.'
      );
    }

    // Circular dependency detection
    if (this.isResolving.has(serviceKey)) {
      throw new Error(`Circular dependency detected for service: ${serviceKey}`);
    }

    const registration = this.services.get(serviceKey);
    if (!registration) {
      throw new Error(`Service ${serviceKey} is not registered. Make sure to register the service before using it.`);
    }

    // Return cached singleton if exists
    if (registration.lifetime === ServiceLifetime.Singleton && this.singletonInstances.has(serviceKey)) {
      return this.singletonInstances.get(serviceKey);
    }

    // Resolve dependencies and create instance
    this.isResolving.add(serviceKey);
    try {
      const resolvedDeps = registration.dependencies.map(dep => this.resolve(dep as ServiceKey));
      const instance = new registration.constructor(...resolvedDeps);
      
      // Cache singleton instances
      if (registration.lifetime === ServiceLifetime.Singleton) {
        this.singletonInstances.set(serviceKey, instance);
      }
      
      return instance;
    } finally {
      this.isResolving.delete(serviceKey);
    }
  }

  /**
   * Checks if a service is registered in the container.
   * 
   * @param serviceKey - Type-safe service key from ServiceRegistry
   * @returns True if the service is registered, false otherwise
   */
  public isRegistered<K extends ServiceKey>(serviceKey: K): boolean {
    return this.services.has(serviceKey);
  }

  /**
   * Resets the container instance. This is primarily for testing purposes.
   * In production, the container should only be initialized once.
   */
  public static reset(): void {
    ServiceContainer.instance = null;
  }
}
