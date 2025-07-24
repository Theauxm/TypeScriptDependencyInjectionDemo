import { IServiceFactory } from '../interfaces/IServiceFactory';
import { ICustomerService } from '../interfaces/ICustomerService';
import { RealCustomerService } from '../services/RealCustomerService';

/**
 * Factory specifically for RealCustomerService that makes actual API calls.
 * This factory is responsible for creating and managing the singleton instance
 * of the real customer service implementation.
 */
export class RealCustomerServiceFactory implements IServiceFactory<ICustomerService> {
  private static instance: ICustomerService | null = null;

  Create(): ICustomerService {
    // Implement as singleton to ensure consistent behavior across the application
    if (RealCustomerServiceFactory.instance === null) {
      console.log('🌐 Creating Real Customer Service (API calls)');
      RealCustomerServiceFactory.instance = new RealCustomerService();
    }

    return RealCustomerServiceFactory.instance;
  }
}
