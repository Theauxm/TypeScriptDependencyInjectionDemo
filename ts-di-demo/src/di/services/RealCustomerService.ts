import { ICustomerService } from '../interfaces/ICustomerService';
import { CustomerDataResult, GraphQLRequest, GraphQLResponse, GetCustomersResponse } from '../../types/CustomerTypes';
import { AppConfig } from '../../config/AppConfig';
import { Injectable } from '../decorators';

/**
 * Real implementation of ICustomerService that makes actual HTTP requests to the GraphQL API.
 * Handles network errors, HTTP errors, and GraphQL errors at the service level.
 * Environment and lifecycle configuration are handled centrally.
 */
@Injectable("CustomerService")
export class RealCustomerService implements ICustomerService {
  private readonly graphqlQuery = `
    query GetDncEntitiesForCache {
      customers(order: { id: ASC }, where: { custentityLongitude: { neq: null } }) {
        pageInfo {
          endCursor
          hasNextPage
          hasPreviousPage
          startCursor
        }
        nodes {
          custentityLatitude
          custentityLongitude
          id
          fullname
        }
      }
    }
  `;

  async getCustomers(): Promise<CustomerDataResult> {
    try {
      const request: GraphQLRequest = {
        query: this.graphqlQuery,
      };

      // Create abort controller for timeout
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), AppConfig.REQUEST_TIMEOUT);

      const response = await fetch(AppConfig.GRAPHQL_ENDPOINT, {
        method: 'GET',
        signal: controller.signal,
      });

      clearTimeout(timeoutId);

      // Handle HTTP errors
      if (!response.ok) {
        return {
          success: false,
          error: `HTTP Error: ${response.status} ${response.statusText}`,
        };
      }

      const graphqlResponse: GraphQLResponse<GetCustomersResponse> = await response.json();

      // Handle GraphQL errors
      if (graphqlResponse.errors && graphqlResponse.errors.length > 0) {
        const errorMessages = graphqlResponse.errors.map(error => error.message).join(', ');
        return {
          success: false,
          error: `GraphQL Error: ${errorMessages}`,
        };
      }

      // Handle missing data
      if (!graphqlResponse.data || !graphqlResponse.data.customers) {
        return {
          success: false,
          error: 'No customer data received from API',
        };
      }

      const customers = graphqlResponse.data.customers.nodes;

      return {
        success: true,
        data: customers,
      };

    } catch (error) {
      // Handle network errors, timeout, and other exceptions
      if (error instanceof Error) {
        if (error.name === 'AbortError') {
          return {
            success: false,
            error: `Request timed out after ${AppConfig.REQUEST_TIMEOUT / 1000} seconds`,
          };
        }
        
        return {
          success: false,
          error: `Network Error: ${error.message}`,
        };
      }

      return {
        success: false,
        error: 'An unknown error occurred while fetching customer data',
      };
    }
  }
}
