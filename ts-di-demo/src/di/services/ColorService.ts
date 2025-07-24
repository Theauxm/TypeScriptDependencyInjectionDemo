import { IColorService } from '../interfaces/IColorService';

/**
 * Concrete implementation of IColorService that manages RGB color state.
 * This service maintains a current color and notifies subscribers of changes.
 */
export class ColorService implements IColorService {
  private currentColor: { r: number; g: number; b: number };
  private subscribers: (() => void)[] = [];

  constructor() {
    // Initialize with a random color
    this.currentColor = this.generateRandomColor();
  }

  getRgbColor(): string {
    const { r, g, b } = this.currentColor;
    return `rgb(${r}, ${g}, ${b})`;
  }

  generateNewColor(): void {
    this.currentColor = this.generateRandomColor();
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

  private generateRandomColor(): { r: number; g: number; b: number } {
    return {
      r: Math.floor(Math.random() * 256),
      g: Math.floor(Math.random() * 256),
      b: Math.floor(Math.random() * 256)
    };
  }

  private notifySubscribers(): void {
    this.subscribers.forEach(callback => callback());
  }
}
