import { IServiceFactory } from '../interfaces/IServiceFactory';
import { ICustomerService } from '../interfaces/ICustomerService';
import { FakeCustomerService } from '../services/FakeCustomerService';

/**
 * Factory specifically for FakeCustomerService that returns mock data.
 * This factory is responsible for creating and managing the singleton instance
 * of the fake customer service implementation for testing and development.
 */
export class FakeCustomerServiceFactory implements IServiceFactory<ICustomerService> {
  private static instance: ICustomerService | null = null;

  Create(): ICustomerService {
    // Implement as singleton to ensure consistent behavior across the application
    if (FakeCustomerServiceFactory.instance === null) {
      console.log('🎭 Creating Fake Customer Service (mock data)');
      FakeCustomerServiceFactory.instance = new FakeCustomerService();
    }

    return FakeCustomerServiceFactory.instance;
  }
}
