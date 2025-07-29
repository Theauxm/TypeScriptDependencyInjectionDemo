/**
 * Generic storage service interface.
 * Provides abstract storage operations for any type of data.
 */
export interface IStorageService {
  /**
   * Store a value with a key
   */
  set<T>(key: string, value: T): void;

  /**
   * Retrieve a value by key
   */
  get<T>(key: string): T | null;

  /**
   * Remove a value by key
   */
  remove(key: string): void;

  /**
   * Check if a key exists
   */
  has(key: string): boolean;

  /**
   * Clear all stored data
   */
  clear(): void;

  /**
   * Get all stored keys
   */
  keys(): string[];
}
