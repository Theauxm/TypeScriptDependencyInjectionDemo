import { injectable } from 'inversify';
import { ICustomerService } from '../../di/interfaces/ICustomerService';
import { CustomerDataResult, GraphQLRequest, GraphQLResponse, GetCustomersResponse } from '../../types/CustomerTypes';

/**
 * Inversify-decorated real customer service implementation.
 * This service makes actual API calls to retrieve customer data.
 */
@injectable()
export class InversifyRealCustomerService implements ICustomerService {
  private readonly apiUrl = '/api/graphql';

  async getCustomers(): Promise<CustomerDataResult> {
    try {
      const query = `
        query GetCustomers {
          customers(first: 10) {
            pageInfo {
              hasNextPage
              hasPreviousPage
              startCursor
              endCursor
            }
            nodes {
              id
              fullname
              custentityLatitude
              custentityLongitude
            }
          }
        }
      `;

      const request: GraphQLRequest = {
        query: query.trim()
      };

      const response = await fetch(this.apiUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(request)
      });

      if (!response.ok) {
        return {
          success: false,
          error: `HTTP error! status: ${response.status}`
        };
      }

      const result: GraphQLResponse<GetCustomersResponse> = await response.json();

      if (result.errors && result.errors.length > 0) {
        return {
          success: false,
          error: result.errors[0].message
        };
      }

      if (!result.data?.customers?.nodes) {
        return {
          success: false,
          error: 'No customer data received from API'
        };
      }

      return {
        success: true,
        data: result.data.customers.nodes
      };

    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error occurred'
      };
    }
  }
}
