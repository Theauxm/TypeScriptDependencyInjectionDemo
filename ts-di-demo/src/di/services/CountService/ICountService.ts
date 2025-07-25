/**
 * Interface for the count service that provides counter functionality.
 * This will be implemented as a scoped service to demonstrate independent instances.
 */
export interface ICountService {
  /**
   * Gets the current count value
   */
  getCount(): number;

  /**
   * Increments the count by 1
   */
  increment(): void;

  /**
   * Resets the count to 0
   */
  reset(): void;

  /**
   * Subscribes to count changes for reactive updates
   */
  subscribe(callback: () => void): () => void;
}
