import { Transient } from '../decorators';
import { ICountService } from '../interfaces/ICountService';
import { Environment } from '../Environment';

/**
 * Concrete implementation of ICountService that manages counter state.
 * This service maintains a count value and notifies subscribers of changes.
 * Active in all environments.
 */
@Transient("CountService")
export class CountService implements ICountService {
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
