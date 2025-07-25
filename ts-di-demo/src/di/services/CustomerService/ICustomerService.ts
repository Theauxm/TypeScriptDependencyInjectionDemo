import { CustomerDataResult } from '../../../types/CustomerTypes';

/**
 * Interface for customer data service operations.
 * This interface can be implemented by both real API services and mock services,
 * demonstrating the power of dependency injection for swapping implementations.
 */
export interface ICustomerService {
  /**
   * Retrieves customer data with location information.
   * Returns a ServiceResult that contains either the customer data or an error message.
   * 
   * @returns Promise<CustomerDataResult> - Success with customer array or failure with error message
   */
  getCustomers(): Promise<CustomerDataResult>;
}
