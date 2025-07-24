import { IServiceFactory } from '../interfaces/IServiceFactory';
import { IColorService } from '../interfaces/IColorService';
import { ColorService } from '../services/ColorService';

/**
 * Factory for IColorService that implements singleton pattern.
 * This factory ensures only one instance of ColorService exists
 * and is shared across all consumers.
 */
export class ColorServiceFactory implements IServiceFactory<IColorService> {
  private static instance: IColorService | null = null;

  Create(): IColorService {
    if (ColorServiceFactory.instance === null) {
      ColorServiceFactory.instance = new ColorService();
    }
    return ColorServiceFactory.instance;
  }
}
