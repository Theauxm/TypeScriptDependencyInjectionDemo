/**
 * Interface for the color service that provides RGB color functionality.
 * This will be implemented as a singleton to demonstrate shared state.
 */
export interface IColorService {
  /**
   * Gets the current RGB color as a CSS-compatible string (e.g., "rgb(255, 0, 0)")
   */
  getRgbColor(): string;

  /**
   * Generates a new random RGB color and updates the current color
   */
  generateNewColor(): void;

  /**
   * Subscribes to color changes for reactive updates
   */
  subscribe(callback: () => void): () => void;
}
