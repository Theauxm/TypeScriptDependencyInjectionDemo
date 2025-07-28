import { IServiceFactory } from '../interfaces/IServiceFactory';
import { IAxiosService } from '../interfaces/IAxiosService';
import { FakeAxiosService } from '../services/FakeAxiosService';

/**
 * Factory for creating FakeAxiosService instances.
 * Implements singleton pattern to ensure consistent mock behavior
 * across the application during testing and development.
 */
export class FakeAxiosServiceFactory implements IServiceFactory<IAxiosService> {
  private static instance: IAxiosService | null = null;

  Create(): IAxiosService {
    if (FakeAxiosServiceFactory.instance === null) {
      console.log('🎭 Creating Fake Axios Service (Mock data)');
      FakeAxiosServiceFactory.instance = new FakeAxiosService();
    }

    return FakeAxiosServiceFactory.instance;
  }
}
