export enum HttpMethod {
  GET = 'GET',
  POST = 'POST',
  PUT = 'PUT',
  DELETE = 'DELETE',
  PATCH = 'PATCH'
}

export interface RequestOptions {
  data?: any;
  queryParams?: Record<string, string | number | boolean>;
  authToken?: string;
  headers?: Record<string, string>;
}
