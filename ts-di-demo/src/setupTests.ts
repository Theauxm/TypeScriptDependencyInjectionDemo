// jest-dom adds custom jest matchers for asserting on DOM nodes.
// allows you to do things like:
// expect(element).toHaveTextContent(/react/i)
// learn more: https://github.com/testing-library/jest-dom
import '@testing-library/jest-dom';

// Set up test environment for DI
import { Environment } from './di-lib/Environment';

// Mock the CURRENT_ENVIRONMENT to use Test environment during tests
jest.mock('./di-lib/Environment', () => {
  const originalModule = jest.requireActual('./di-lib/Environment');
  return {
    ...originalModule,
    CURRENT_ENVIRONMENT: originalModule.Environment.Test,
  };
});

// Global test setup
beforeEach(() => {
  // Clear all mocks before each test
  jest.clearAllMocks();
});
