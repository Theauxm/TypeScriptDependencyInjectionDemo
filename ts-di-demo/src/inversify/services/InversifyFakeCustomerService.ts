import { injectable } from 'inversify';
import { ICustomerService } from '../../di/interfaces/ICustomerService';
import { CustomerDataResult } from '../../types/CustomerTypes';

/**
 * Inversify-decorated fake customer service implementation.
 * This service provides mock data for development and testing purposes.
 */
@injectable()
export class InversifyFakeCustomerService implements ICustomerService {
  async getCustomers(): Promise<CustomerDataResult> {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 800));

    // Return mock customer data
    return {
      success: true,
      data: [
        {
          id: '1',
          fullname: 'John Doe',
          custentityLatitude: 40.7128,
          custentityLongitude: -74.0060
        },
        {
          id: '2',
          fullname: 'Jane Smith',
          custentityLatitude: 34.0522,
          custentityLongitude: -118.2437
        },
        {
          id: '3',
          fullname: 'Bob Johnson',
          custentityLatitude: 41.8781,
          custentityLongitude: -87.6298
        }
      ]
    };
  }
}
