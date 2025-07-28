import { injectable } from 'inversify';
import { IColorService } from '../../di/interfaces/IColorService';

/**
 * Inversify-decorated ColorService implementation.
 * This service maintains shared state across all consumers (singleton behavior).
 */
@injectable()
export class InversifyColorService implements IColorService {
  private currentColor: string = '#3498db';
  private subscribers: (() => void)[] = [];

  getRgbColor(): string {
    return this.currentColor;
  }

  generateNewColor(): void {
    // Generate a random color
    const colors = [
      '#e74c3c', '#3498db', '#2ecc71', '#f39c12', 
      '#9b59b6', '#1abc9c', '#34495e', '#e67e22'
    ];
    
    let newColor;
    do {
      newColor = colors[Math.floor(Math.random() * colors.length)];
    } while (newColor === this.currentColor);
    
    this.currentColor = newColor;
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
