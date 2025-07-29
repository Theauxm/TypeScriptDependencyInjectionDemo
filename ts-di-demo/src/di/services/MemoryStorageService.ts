import { Injectable } from '../decorators';
import { IStorageService } from '../interfaces/IStorageService';

/**
 * Generic singleton memory-based storage service.
 * Stores any type of data in memory for the duration of the application session.
 * Provides a key-value store abstraction that can be used by other services.
 */
@Injectable("StorageService")
export class MemoryStorageService implements IStorageService {
  private storage: Map<string, any> = new Map();

  /**
   * Store a value with a key
   */
  set<T>(key: string, value: T): void {
    this.storage.set(key, value);
  }

  /**
   * Retrieve a value by key
   */
  get<T>(key: string): T | null {
    return this.storage.get(key) ?? null;
  }

  /**
   * Remove a value by key
   */
  remove(key: string): void {
    this.storage.delete(key);
  }

  /**
   * Check if a key exists
   */
  has(key: string): boolean {
    return this.storage.has(key);
  }

  /**
   * Clear all stored data
   */
  clear(): void {
    this.storage.clear();
  }

  /**
   * Get all stored keys
   */
  keys(): string[] {
    return Array.from(this.storage.keys());
  }
}
