/**
 * Base interface that all service factories must implement.
 * The factory is responsible for creating instances of the service
 * and managing the service's lifetime (singleton vs scoped).
 */
export interface IServiceFactory<T> {
  /**
   * Creates and returns an instance of the service.
   * The factory implementation determines whether this is a new instance
   * or a cached singleton instance.
   */
  Create(): T;
}
