# Environment-Based Configuration System

This document explains the environment-based configuration system that allows different configuration values for Local, Development, and Production environments.

## Overview

The configuration system provides:

1. **Environment-Specific Values**: Different configuration values for each environment
2. **Type Safety**: Compile-time validation that all environments have the same configuration structure
3. **Centralized Management**: All configuration in one place with clear environment differences
4. **Easy Environment Switching**: Change environments by updating one constant

## Configuration Structure

### Current Configuration Values

| Configuration Key | Local | Development | Production | Description |
|------------------|-------|-------------|------------|-------------|
| `GRAPHQL_ENDPOINT` | `/api/customers` | `/api/customers` | `/api/customers` | GraphQL API endpoint |
| `NWYC_API_BASE_URL` | `http://localhost:3001` | `https://nwyc.dev.cvoice.io` | `https://nwyc.com` | NWYC API base URL |
| `REQUEST_TIMEOUT` | `5000` | `10000` | `15000` | Request timeout (ms) |
| `NWYC_REQUEST_TIMEOUT` | `5000` | `10000` | `15000` | NWYC request timeout (ms) |
| `API_RETRY_ATTEMPTS` | `2` | `3` | `5` | Number of API retry attempts |
| `CACHE_TTL` | `300000` (5 min) | `600000` (10 min) | `1800000` (30 min) | Cache time-to-live (ms) |
| `DEBUG_MODE` | `true` | `true` | `false` | Enable debug logging |
| `LOG_LEVEL` | `debug` | `info` | `error` | Logging level |
| `ENABLE_MOCK_DATA` | `true` | `false` | `false` | Enable mock data responses |

## Usage

### Basic Usage

```typescript
import { AppConfig } from '../config/AppConfig';

// Access configuration values - automatically environment-specific
const apiUrl = AppConfig.NWYC_API_BASE_URL;
const timeout = AppConfig.REQUEST_TIMEOUT;
const debugMode = AppConfig.DEBUG_MODE;

// Check current environment
console.log(`Running in ${AppConfig.ENVIRONMENT} mode`);
```

### Environment-Specific Logic

```typescript
import { AppConfig, Environment } from '../config/AppConfig';

// Conditional logic based on environment
if (AppConfig.ENVIRONMENT === Environment.Local) {
  console.log('Running in local development mode');
} else if (AppConfig.ENVIRONMENT === Environment.Production) {
  console.log('Running in production mode');
}

// Use debug mode flag
if (AppConfig.DEBUG_MODE) {
  console.log('Debug information:', { apiUrl: AppConfig.NWYC_API_BASE_URL });
}
```

### Testing Different Environments

```typescript
import { getConfigForEnvironment, Environment } from '../config/AppConfig';

// Get configuration for specific environment (useful for testing)
const localConfig = getConfigForEnvironment(Environment.Local);
const prodConfig = getConfigForEnvironment(Environment.Production);

console.log('Local API URL:', localConfig.NWYC_API_BASE_URL);
console.log('Production API URL:', prodConfig.NWYC_API_BASE_URL);
```

## Environment Switching

To switch environments, update the `CURRENT_ENVIRONMENT` constant in `src/di-lib/Environment.ts`:

```typescript
// For local development
export const CURRENT_ENVIRONMENT: Environment = Environment.Local;

// For development environment
export const CURRENT_ENVIRONMENT: Environment = Environment.Development;

// For production
export const CURRENT_ENVIRONMENT: Environment = Environment.Production;
```

## Adding New Configuration Values

### Step 1: Update the ConfigProfile Interface

Add the new configuration key to the `ConfigProfile` interface in `AppConfig.ts`:

```typescript
export interface ConfigProfile {
  // ... existing properties
  NEW_CONFIG_VALUE: string; // Add your new configuration
}
```

### Step 2: Add Values for All Environments

Update the `CONFIG_PROFILES` object with values for all environments:

```typescript
const CONFIG_PROFILES = {
  [Environment.Local]: {
    // ... existing values
    NEW_CONFIG_VALUE: 'local-value',
  },
  [Environment.Development]: {
    // ... existing values
    NEW_CONFIG_VALUE: 'dev-value',
  },
  [Environment.Production]: {
    // ... existing values
    NEW_CONFIG_VALUE: 'prod-value',
  }
} as const;
```

### Step 3: Use the New Configuration

```typescript
import { AppConfig } from '../config/AppConfig';

const newValue = AppConfig.NEW_CONFIG_VALUE;
```

## Type Safety Features

### Compile-Time Validation

The system includes compile-time validation to ensure:

1. **All environments have the same structure**: Missing properties will cause TypeScript errors
2. **Correct types**: Wrong types will be caught at compile time
3. **Required properties**: All configuration keys must be present in all environments

### Example of Type Safety

```typescript
// This will cause a TypeScript error if the key doesn't exist
const invalidKey = AppConfig.NON_EXISTENT_KEY; // ❌ Error

// This will work and provide autocomplete
const validKey = AppConfig.NWYC_API_BASE_URL; // ✅ Works
```

## Best Practices

### 1. Environment-Appropriate Values

- **Local**: Use localhost URLs, shorter timeouts, more debugging
- **Development**: Use development servers, moderate timeouts, some debugging
- **Production**: Use production URLs, longer timeouts, minimal debugging

### 2. Consistent Naming

Use descriptive, consistent naming for configuration keys:

```typescript
// Good
NWYC_API_BASE_URL: 'https://api.example.com'
REQUEST_TIMEOUT: 10000

// Avoid
url: 'https://api.example.com'
timeout: 10000
```

### 3. Documentation

Document what each configuration value does and why it differs between environments:

```typescript
API_RETRY_ATTEMPTS: 2, // Fewer retries for local development to fail fast
```

### 4. Sensible Defaults

Choose sensible defaults that work well for each environment:

- Local: Fast feedback, easy debugging
- Development: Realistic but forgiving
- Production: Robust and performant

## Integration with Services

The configuration system works seamlessly with your dependency injection system:

```typescript
// In a service
import { AppConfig } from '../config/AppConfig';

@Singleton("ApiService")
export class ApiService {
  private baseUrl = AppConfig.NWYC_API_BASE_URL;
  private timeout = AppConfig.REQUEST_TIMEOUT;
  private retryAttempts = AppConfig.API_RETRY_ATTEMPTS;

  async makeRequest(endpoint: string) {
    // Use environment-specific configuration
    const url = `${this.baseUrl}${endpoint}`;
    // ... implementation using timeout and retry attempts
  }
}
```

## Debugging and Utilities

### Available Utility Functions

```typescript
import { 
  getConfigForEnvironment, 
  getAllConfigProfiles, 
  isValidConfigKey 
} from '../config/AppConfig';

// Get configuration for specific environment
const config = getConfigForEnvironment(Environment.Production);

// Get all configurations (useful for debugging)
const allConfigs = getAllConfigProfiles();

// Check if a configuration key exists
if (isValidConfigKey('NWYC_API_BASE_URL')) {
  // Key exists
}
```

### Debugging Configuration

```typescript
// Log current configuration
console.log('Current configuration:', {
  environment: AppConfig.ENVIRONMENT,
  apiUrl: AppConfig.NWYC_API_BASE_URL,
  timeout: AppConfig.REQUEST_TIMEOUT,
  debugMode: AppConfig.DEBUG_MODE
});

// Compare configurations across environments
const allConfigs = getAllConfigProfiles();
Object.entries(allConfigs).forEach(([env, config]) => {
  console.log(`${env}:`, config.NWYC_API_BASE_URL);
});
```

## Migration from Previous System

If you're migrating from a previous configuration system:

1. **Identify current configuration values** used throughout the application
2. **Add them to the ConfigProfile interface** with appropriate types
3. **Set environment-specific values** in CONFIG_PROFILES
4. **Update imports** to use the new AppConfig
5. **Test each environment** to ensure correct values are used

## Troubleshooting

### Common Issues

1. **TypeScript errors about missing properties**
   - Ensure all environments have the same configuration keys
   - Check that the ConfigProfile interface includes all required properties

2. **Wrong values being used**
   - Verify CURRENT_ENVIRONMENT is set correctly
   - Check that the correct environment profile has the expected values

3. **Import errors**
   - Ensure you're importing from the correct path: `../config/AppConfig`
   - Check that all required exports are available

### Debug Commands

```typescript
// Check current environment and configuration
console.log('Environment:', AppConfig.ENVIRONMENT);
console.log('Configuration:', AppConfig);

// Verify all environments have required keys
const allConfigs = getAllConfigProfiles();
const keys = Object.keys(allConfigs[Environment.Local]);
Object.entries(allConfigs).forEach(([env, config]) => {
  const envKeys = Object.keys(config);
  const missingKeys = keys.filter(key => !envKeys.includes(key));
  if (missingKeys.length > 0) {
    console.error(`${env} missing keys:`, missingKeys);
  }
});
