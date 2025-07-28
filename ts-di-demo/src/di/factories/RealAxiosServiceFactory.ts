import { IServiceFactory } from '../interfaces/IServiceFactory';
import { IAxiosService } from '../interfaces/IAxiosService';
import { RealAxiosService } from '../services/RealAxiosService';

/**
 * Factory for creating RealAxiosService instances.
 * Implements singleton pattern to ensure consistent HTTP service behavior
 * across the application.
 */
export class RealAxiosServiceFactory implements IServiceFactory<IAxiosService> {
  private static instance: IAxiosService | null = null;

  Create(): IAxiosService {
    if (RealAxiosServiceFactory.instance === null) {
      console.log('🌐 Creating Real Axios Service (HTTP calls)');
      RealAxiosServiceFactory.instance = new RealAxiosService();
    }

    return RealAxiosServiceFactory.instance;
  }
}
