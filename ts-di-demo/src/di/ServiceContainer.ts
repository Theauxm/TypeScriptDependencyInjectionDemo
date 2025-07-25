import { ServiceCollection } from './ServiceCollection';
import { ServiceRegistry, ServiceKey, ServiceType } from './ServiceRegistry';
import { IServiceFactory } from './interfaces/IServiceFactory';

/**
 * Global singleton service container that manages the service collection
 * without relying on React Context. This container is initialized once
 * at application startup and provides type-safe service resolution.
 */
export class ServiceContainer {
  private static instance: ServiceContainer | null = null;
  private serviceCollection: ServiceCollection;
  private isInitialized: boolean = false;

  private constructor() {
    this.serviceCollection = new ServiceCollection();
  }

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
   * Registers a service factory with type safety.
   * 
   * @param serviceKey - Type-safe service key from ServiceRegistry
   * @param factory - Factory that creates instances of the service
   */
  public register<K extends ServiceKey>(
    serviceKey: K,
    factory: IServiceFactory<ServiceType<K>>
  ): void {
    if (this.isInitialized) {
      throw new Error(
        `Cannot register service '${serviceKey}' after container initialization. ` +
        'All services must be registered during the initialization phase.'
      );
    }
    this.serviceCollection.register(serviceKey, factory);
  }

  /**
   * Resolves a service instance with full type safety.
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

    const factory = this.serviceCollection.getFactory<ServiceType<K>>(serviceKey);
    return factory.Create();
  }

  /**
   * Checks if a service is registered in the container.
   * 
   * @param serviceKey - Type-safe service key from ServiceRegistry
   * @returns True if the service is registered, false otherwise
   */
  public isRegistered<K extends ServiceKey>(serviceKey: K): boolean {
    return this.serviceCollection.isRegistered(serviceKey);
  }

  /**
   * Resets the container instance. This is primarily for testing purposes.
   * In production, the container should only be initialized once.
   */
  public static reset(): void {
    ServiceContainer.instance = null;
  }
}
