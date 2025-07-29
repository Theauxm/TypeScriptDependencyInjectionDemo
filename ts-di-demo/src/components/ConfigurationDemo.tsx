import React from 'react';
import { AppConfig, getConfigForEnvironment, getAllConfigProfiles } from '../config/AppConfig';
import { Environment } from '../di-lib/Environment';

/**
 * React component demonstrating the environment-based configuration system
 */
export const ConfigurationDemo: React.FC = () => {
  const allConfigs = getAllConfigProfiles();

  return (
    <div style={{ padding: '20px', fontFamily: 'monospace' }}>
      <h2>🌍 Environment-Based Configuration Demo</h2>
      
      {/* Current Environment Section */}
      <div style={{ marginBottom: '30px', padding: '15px', backgroundColor: '#f5f5f5', borderRadius: '8px' }}>
        <h3>Current Environment: {AppConfig.ENVIRONMENT}</h3>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
          <div><strong>API URL:</strong> {AppConfig.NWYC_API_BASE_URL}</div>
          <div><strong>Request Timeout:</strong> {AppConfig.REQUEST_TIMEOUT}ms</div>
          <div><strong>Debug Mode:</strong> {AppConfig.DEBUG_MODE ? '✅ Enabled' : '❌ Disabled'}</div>
          <div><strong>Log Level:</strong> {AppConfig.LOG_LEVEL}</div>
          <div><strong>API Retries:</strong> {AppConfig.API_RETRY_ATTEMPTS}</div>
          <div><strong>Cache TTL:</strong> {AppConfig.CACHE_TTL / 60000} minutes</div>
          <div><strong>Mock Data:</strong> {AppConfig.ENABLE_MOCK_DATA ? '✅ Enabled' : '❌ Disabled'}</div>
        </div>
      </div>

      {/* Environment Comparison Table */}
      <div style={{ marginBottom: '30px' }}>
        <h3>📊 Configuration Across All Environments</h3>
        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '12px' }}>
          <thead>
            <tr style={{ backgroundColor: '#e0e0e0' }}>
              <th style={{ border: '1px solid #ccc', padding: '8px', textAlign: 'left' }}>Configuration</th>
              <th style={{ border: '1px solid #ccc', padding: '8px', textAlign: 'left' }}>Local</th>
              <th style={{ border: '1px solid #ccc', padding: '8px', textAlign: 'left' }}>Development</th>
              <th style={{ border: '1px solid #ccc', padding: '8px', textAlign: 'left' }}>Production</th>
            </tr>
          </thead>
          <tbody>
            {Object.keys(allConfigs[Environment.Local]).map((key) => (
              <tr key={key}>
                <td style={{ border: '1px solid #ccc', padding: '8px', fontWeight: 'bold' }}>{key}</td>
                <td style={{ border: '1px solid #ccc', padding: '8px' }}>
                  {String(allConfigs[Environment.Local][key as keyof typeof allConfigs[Environment.Local]])}
                </td>
                <td style={{ border: '1px solid #ccc', padding: '8px' }}>
                  {String(allConfigs[Environment.Development][key as keyof typeof allConfigs[Environment.Development]])}
                </td>
                <td style={{ border: '1px solid #ccc', padding: '8px' }}>
                  {String(allConfigs[Environment.Production][key as keyof typeof allConfigs[Environment.Production]])}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Practical Usage Examples */}
      <div style={{ marginBottom: '30px' }}>
        <h3>💡 Practical Usage Examples</h3>
        <div style={{ backgroundColor: '#f9f9f9', padding: '15px', borderRadius: '8px' }}>
          <h4>Environment-Specific Behavior:</h4>
          {AppConfig.DEBUG_MODE ? (
            <div style={{ color: '#ff6b35' }}>
              🐛 Debug mode is enabled - showing detailed information and logs
            </div>
          ) : (
            <div style={{ color: '#28a745' }}>
              🚀 Production mode - optimized for performance with minimal logging
            </div>
          )}

          <h4 style={{ marginTop: '15px' }}>API Configuration:</h4>
          <div>🌐 Making API calls to: <code>{AppConfig.NWYC_API_BASE_URL}</code></div>
          <div>⏱️ Using timeout: <code>{AppConfig.REQUEST_TIMEOUT}ms</code></div>
          <div>🔄 Will retry <code>{AppConfig.API_RETRY_ATTEMPTS}</code> times on failure</div>

          <h4 style={{ marginTop: '15px' }}>Cache Configuration:</h4>
          <div>💾 Cache expires after <code>{AppConfig.CACHE_TTL / 60000}</code> minutes</div>

          <h4 style={{ marginTop: '15px' }}>Mock Data:</h4>
          {AppConfig.ENABLE_MOCK_DATA ? (
            <div style={{ color: '#ffc107' }}>
              🎭 Mock data is enabled - using fake responses for development
            </div>
          ) : (
            <div style={{ color: '#28a745' }}>
              📡 Using real API responses
            </div>
          )}
        </div>
      </div>

      {/* Environment Switching Instructions */}
      <div style={{ backgroundColor: '#e3f2fd', padding: '15px', borderRadius: '8px' }}>
        <h3>🔄 How to Switch Environments</h3>
        <p>To switch environments, update the <code>CURRENT_ENVIRONMENT</code> constant in <code>src/di-lib/Environment.ts</code>:</p>
        <pre style={{ backgroundColor: '#f5f5f5', padding: '10px', borderRadius: '4px', overflow: 'auto' }}>
{`// For local development
export const CURRENT_ENVIRONMENT: Environment = Environment.Local;

// For development environment  
export const CURRENT_ENVIRONMENT: Environment = Environment.Development;

// For production
export const CURRENT_ENVIRONMENT: Environment = Environment.Production;`}
        </pre>
        <p><strong>Current setting:</strong> <code>Environment.{AppConfig.ENVIRONMENT}</code></p>
      </div>

      {/* Code Examples */}
      <div style={{ marginTop: '30px', backgroundColor: '#f8f9fa', padding: '15px', borderRadius: '8px' }}>
        <h3>📝 Code Usage Examples</h3>
        <pre style={{ backgroundColor: '#f5f5f5', padding: '10px', borderRadius: '4px', overflow: 'auto', fontSize: '12px' }}>
{`// Basic usage
import { AppConfig } from '../config/AppConfig';

const apiUrl = AppConfig.NWYC_API_BASE_URL;
const timeout = AppConfig.REQUEST_TIMEOUT;
const debugMode = AppConfig.DEBUG_MODE;

// Environment-specific logic
if (AppConfig.ENVIRONMENT === Environment.Local) {
  console.log('Running in local development mode');
}

// Get configuration for specific environment
import { getConfigForEnvironment } from '../config/AppConfig';
const prodConfig = getConfigForEnvironment(Environment.Production);`}
        </pre>
      </div>
    </div>
  );
};

export default ConfigurationDemo;
