import { IServiceFactory } from '../interfaces/IServiceFactory';
import { ICustomerService } from '../interfaces/ICustomerService';
import { RealCustomerService } from '../services/RealCustomerService';
import { FakeCustomerService } from '../services/FakeCustomerService';
import { AppConfig } from '../../config/AppConfig';

/**
 * Factory for ICustomerService that chooses between real and fake implementations
 * based on application configuration. This demonstrates how dependency injection
 * can be used to swap implementations at runtime based on configuration.
 */
export class CustomerServiceFactory implements IServiceFactory<ICustomerService> {
  private static instance: ICustomerService | null = null;

  Create(): ICustomerService {
    // Implement as singleton to ensure consistent behavior across the application
    if (CustomerServiceFactory.instance === null) {
      if (AppConfig.USE_REAL_API) {
        console.log('🌐 Using Real Customer Service (API calls)');
        CustomerServiceFactory.instance = new RealCustomerService();
      } else {
        console.log('🎭 Using Fake Customer Service (mock data)');
        CustomerServiceFactory.instance = new FakeCustomerService();
      }
    }

    return CustomerServiceFactory.instance;
  }
}
