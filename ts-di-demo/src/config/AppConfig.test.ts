import { AppConfig, getConfigForEnvironment, getAllConfigProfiles, isValidConfigKey, ConfigProfile } from './AppConfig';
import { Environment } from '../di-lib/Environment';

describe('AppConfig Environment-Based Configuration', () => {
  
  describe('Basic Configuration Access', () => {
    it('should provide access to all configuration values', () => {
      expect(AppConfig.GRAPHQL_ENDPOINT).toBeDefined();
      expect(AppConfig.NWYC_API_BASE_URL).toBeDefined();
      expect(AppConfig.REQUEST_TIMEOUT).toBeDefined();
      expect(AppConfig.NWYC_REQUEST_TIMEOUT).toBeDefined();
      expect(AppConfig.API_RETRY_ATTEMPTS).toBeDefined();
      expect(AppConfig.CACHE_TTL).toBeDefined();
      expect(AppConfig.DEBUG_MODE).toBeDefined();
      expect(AppConfig.LOG_LEVEL).toBeDefined();
      expect(AppConfig.ENABLE_MOCK_DATA).toBeDefined();
      expect(AppConfig.ENVIRONMENT).toBeDefined();
    });

    it('should have correct types for configuration values', () => {
      expect(typeof AppConfig.GRAPHQL_ENDPOINT).toBe('string');
      expect(typeof AppConfig.NWYC_API_BASE_URL).toBe('string');
      expect(typeof AppConfig.REQUEST_TIMEOUT).toBe('number');
      expect(typeof AppConfig.NWYC_REQUEST_TIMEOUT).toBe('number');
      expect(typeof AppConfig.API_RETRY_ATTEMPTS).toBe('number');
      expect(typeof AppConfig.CACHE_TTL).toBe('number');
      expect(typeof AppConfig.DEBUG_MODE).toBe('boolean');
      expect(typeof AppConfig.LOG_LEVEL).toBe('string');
      expect(typeof AppConfig.ENABLE_MOCK_DATA).toBe('boolean');
    });
  });

  describe('Environment-Specific Configuration', () => {
    it('should provide different configurations for different environments', () => {
      const localConfig = getConfigForEnvironment(Environment.Local);
      const devConfig = getConfigForEnvironment(Environment.Development);
      const prodConfig = getConfigForEnvironment(Environment.Production);

      // URLs should be different across environments
      expect(localConfig.NWYC_API_BASE_URL).toBe('http://localhost:3001');
      expect(devConfig.NWYC_API_BASE_URL).toBe('https://nwyc.dev.cvoice.io');
      expect(prodConfig.NWYC_API_BASE_URL).toBe('https://nwyc.com');

      // Timeouts should increase from local to production
      expect(localConfig.REQUEST_TIMEOUT).toBe(5000);
      expect(devConfig.REQUEST_TIMEOUT).toBe(10000);
      expect(prodConfig.REQUEST_TIMEOUT).toBe(15000);

      // Retry attempts should increase from local to production
      expect(localConfig.API_RETRY_ATTEMPTS).toBe(2);
      expect(devConfig.API_RETRY_ATTEMPTS).toBe(3);
      expect(prodConfig.API_RETRY_ATTEMPTS).toBe(5);

      // Debug mode should be off only in production
      expect(localConfig.DEBUG_MODE).toBe(true);
      expect(devConfig.DEBUG_MODE).toBe(true);
      expect(prodConfig.DEBUG_MODE).toBe(false);

      // Mock data should be enabled only in local
      expect(localConfig.ENABLE_MOCK_DATA).toBe(true);
      expect(devConfig.ENABLE_MOCK_DATA).toBe(false);
      expect(prodConfig.ENABLE_MOCK_DATA).toBe(false);
    });

    it('should have appropriate log levels for each environment', () => {
      const localConfig = getConfigForEnvironment(Environment.Local);
      const devConfig = getConfigForEnvironment(Environment.Development);
      const prodConfig = getConfigForEnvironment(Environment.Production);

      expect(localConfig.LOG_LEVEL).toBe('debug');
      expect(devConfig.LOG_LEVEL).toBe('info');
      expect(prodConfig.LOG_LEVEL).toBe('error');
    });

    it('should have appropriate cache TTL for each environment', () => {
      const localConfig = getConfigForEnvironment(Environment.Local);
      const devConfig = getConfigForEnvironment(Environment.Development);
      const prodConfig = getConfigForEnvironment(Environment.Production);

      expect(localConfig.CACHE_TTL).toBe(300000); // 5 minutes
      expect(devConfig.CACHE_TTL).toBe(600000); // 10 minutes
      expect(prodConfig.CACHE_TTL).toBe(1800000); // 30 minutes
    });
  });

  describe('Utility Functions', () => {
    it('should return all configuration profiles', () => {
      const allProfiles = getAllConfigProfiles();
      
      expect(allProfiles).toHaveProperty(Environment.Local);
      expect(allProfiles).toHaveProperty(Environment.Development);
      expect(allProfiles).toHaveProperty(Environment.Production);
    });

    it('should validate configuration keys correctly', () => {
      expect(isValidConfigKey('NWYC_API_BASE_URL')).toBe(true);
      expect(isValidConfigKey('REQUEST_TIMEOUT')).toBe(true);
      expect(isValidConfigKey('DEBUG_MODE')).toBe(true);
      expect(isValidConfigKey('INVALID_KEY')).toBe(false);
      expect(isValidConfigKey('')).toBe(false);
    });
  });

  describe('Configuration Consistency', () => {
    it('should have the same configuration keys across all environments', () => {
      const allProfiles = getAllConfigProfiles();
      const localKeys = Object.keys(allProfiles[Environment.Local]).sort();
      const devKeys = Object.keys(allProfiles[Environment.Development]).sort();
      const prodKeys = Object.keys(allProfiles[Environment.Production]).sort();

      expect(localKeys).toEqual(devKeys);
      expect(devKeys).toEqual(prodKeys);
    });

    it('should have all required configuration properties', () => {
      const requiredKeys = [
        'GRAPHQL_ENDPOINT',
        'NWYC_API_BASE_URL',
        'REQUEST_TIMEOUT',
        'NWYC_REQUEST_TIMEOUT',
        'API_RETRY_ATTEMPTS',
        'CACHE_TTL',
        'DEBUG_MODE',
        'LOG_LEVEL',
        'ENABLE_MOCK_DATA'
      ];

      const allProfiles = getAllConfigProfiles();
      
      Object.values(allProfiles).forEach(profile => {
        requiredKeys.forEach(key => {
          expect(profile).toHaveProperty(key);
        });
      });
    });
  });

  describe('Current Environment Configuration', () => {
    it('should use the current environment configuration', () => {
      // The current configuration should match the configuration for the current environment
      const currentEnvConfig = getConfigForEnvironment(AppConfig.ENVIRONMENT);
      
      expect(AppConfig.NWYC_API_BASE_URL).toBe(currentEnvConfig.NWYC_API_BASE_URL);
      expect(AppConfig.REQUEST_TIMEOUT).toBe(currentEnvConfig.REQUEST_TIMEOUT);
      expect(AppConfig.DEBUG_MODE).toBe(currentEnvConfig.DEBUG_MODE);
      expect(AppConfig.API_RETRY_ATTEMPTS).toBe(currentEnvConfig.API_RETRY_ATTEMPTS);
      expect(AppConfig.CACHE_TTL).toBe(currentEnvConfig.CACHE_TTL);
    });
  });

  describe('Type Safety', () => {
    it('should enforce ConfigProfile interface', () => {
      const allProfiles = getAllConfigProfiles();
      
      Object.values(allProfiles).forEach((profile: ConfigProfile) => {
        // These should not throw TypeScript errors
        expect(typeof profile.GRAPHQL_ENDPOINT).toBe('string');
        expect(typeof profile.NWYC_API_BASE_URL).toBe('string');
        expect(typeof profile.REQUEST_TIMEOUT).toBe('number');
        expect(typeof profile.NWYC_REQUEST_TIMEOUT).toBe('number');
        expect(typeof profile.API_RETRY_ATTEMPTS).toBe('number');
        expect(typeof profile.CACHE_TTL).toBe('number');
        expect(typeof profile.DEBUG_MODE).toBe('boolean');
        expect(['debug', 'info', 'warn', 'error']).toContain(profile.LOG_LEVEL);
        expect(typeof profile.ENABLE_MOCK_DATA).toBe('boolean');
      });
    });
  });
});
