import { injectable } from 'inversify';
import { ICountService } from '../../di/interfaces/ICountService';

/**
 * Inversify-decorated CountService implementation.
 * This service provides transient behavior - each component gets its own instance.
 */
@injectable()
export class InversifyCountService implements ICountService {
  private count: number = 0;
  private subscribers: (() => void)[] = [];

  getCount(): number {
    return this.count;
  }

  increment(): void {
    this.count++;
    this.notifySubscribers();
  }

  reset(): void {
    this.count = 0;
    this.notifySubscribers();
  }

  subscribe(callback: () => void): () => void {
    this.subscribers.push(callback);
    
    // Return unsubscribe function
    return () => {
      const index = this.subscribers.indexOf(callback);
      if (index > -1) {
        this.subscribers.splice(index, 1);
      }
    };
  }

  private notifySubscribers(): void {
    this.subscribers.forEach(callback => callback());
  }
}
