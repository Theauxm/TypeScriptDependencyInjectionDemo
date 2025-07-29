import { ICustomerService } from '../interfaces/ICustomerService';
import { CustomerDataResult, Customer } from '../../types/CustomerTypes';
import { Injectable } from '../decorators';

/**
 * Fake implementation of ICustomerService that returns hardcoded mock data.
 * Useful for testing, development, and demonstrating dependency injection patterns.
 * Simulates network delay to mimic real API behavior.
 * Environment and lifecycle configuration are handled centrally.
 */
@Injectable("CustomerService")
export class FakeCustomerService implements ICustomerService {
  private readonly mockCustomers: Customer[] = [
    {
      id: "1001",
      fullname: "Acme Corporation",
      custentityLatitude: 40.7128,
      custentityLongitude: -74.0060
    },
    {
      id: "1002",
      fullname: "Global Tech Solutions",
      custentityLatitude: 34.0522,
      custentityLongitude: -118.2437
    },
    {
      id: "1003",
      fullname: "Metro Industries",
      custentityLatitude: 41.8781,
      custentityLongitude: -87.6298
    },
    {
      id: "1004",
      fullname: "Pacific Enterprises",
      custentityLatitude: 37.7749,
      custentityLongitude: -122.4194
    },
    {
      id: "1005",
      fullname: "Eastern Manufacturing",
      custentityLatitude: 42.3601,
      custentityLongitude: -71.0589
    },
    {
      id: "1006",
      fullname: "Southern Logistics",
      custentityLatitude: 29.7604,
      custentityLongitude: -95.3698
    },
    {
      id: "1007",
      fullname: "Mountain View Systems",
      custentityLatitude: 39.7392,
      custentityLongitude: -104.9903
    },
    {
      id: "1008",
      fullname: "Coastal Services Inc",
      custentityLatitude: 25.7617,
      custentityLongitude: -80.1918
    },
    {
      id: "1009",
      fullname: "Midwest Solutions",
      custentityLatitude: 39.0458,
      custentityLongitude: -76.6413
    },
    {
      id: "1010",
      fullname: "Northwest Partners",
      custentityLatitude: 47.6062,
      custentityLongitude: -122.3321
    }
  ];

  async getCustomers(): Promise<CustomerDataResult> {
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 800));

    // Always return success with mock data
    // (You could add logic here to simulate errors for testing)
    return {
      success: true,
      data: [...this.mockCustomers], // Return a copy to prevent mutations
    };
  }
}
