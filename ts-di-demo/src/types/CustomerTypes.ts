/**
 * Customer data structure from the GraphQL API
 */
export interface Customer {
  id: string;
  fullname: string;
  custentityLatitude: number | null;
  custentityLongitude: number | null;
}

/**
 * Pagination information from GraphQL
 */
export interface PageInfo {
  endCursor: string | null;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
  startCursor: string | null;
}

/**
 * Customer connection structure from GraphQL
 */
export interface CustomerConnection {
  pageInfo: PageInfo;
  nodes: Customer[];
}

/**
 * Complete GraphQL response structure
 */
export interface GetCustomersResponse {
  customers: CustomerConnection;
}

/**
 * GraphQL request structure
 */
export interface GraphQLRequest {
  query: string;
  variables?: Record<string, any>;
}

/**
 * GraphQL response wrapper
 */
export interface GraphQLResponse<T = any> {
  data?: T;
  errors?: Array<{
    message: string;
    locations?: Array<{
      line: number;
      column: number;
    }>;
    path?: string[];
  }>;
}

/**
 * Service result wrapper for handling success/error states
 */
export type ServiceResult<T> = 
  | { success: true; data: T }
  | { success: false; error: string };

/**
 * Customer data result type
 */
export type CustomerDataResult = ServiceResult<Customer[]>;
