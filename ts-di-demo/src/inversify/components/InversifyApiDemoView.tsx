import React, { useState } from 'react';
import { useInversifyService } from '../useInversifyService';
import { ICustomerServiceId } from '../serviceIdentifiers';
import { Customer } from '../../types/CustomerTypes';

export const InversifyApiDemoView: React.FC = () => {
  const customerService = useInversifyService(ICustomerServiceId);
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleLoadCustomers = async () => {
    setLoading(true);
    setError(null);
    
    try {
      const result = await customerService.getCustomers();
      
      if (result.success) {
        setCustomers(result.data);
      } else {
        setError(result.error);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error occurred');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="view">
      <h2>Inversify API Demo - Customer Service</h2>
      <div className="service-info">
        <p>This view demonstrates <strong>configuration-driven service selection</strong> via Inversify.</p>
        <p>The implementation (Real vs Fake API) is chosen based on <code>AppConfig.USE_REAL_API</code>.</p>
        <p><strong>Current:</strong> Using {process.env.NODE_ENV === 'development' ? 'Fake' : 'Real'} Customer Service</p>
      </div>

      <div className="api-demo">
        <button 
          className="action-button"
          onClick={handleLoadCustomers}
          disabled={loading}
        >
          {loading ? 'Loading...' : 'Load Customers'}
        </button>

        {error && (
          <div className="error-message">
            <strong>Error:</strong> {error}
          </div>
        )}

        {customers.length > 0 && (
          <div className="customer-list">
            <h3>Customer Data:</h3>
            {customers.map(customer => (
              <div key={customer.id} className="customer-item">
                <div className="customer-info">
                  <strong>{customer.fullname}</strong>
                  <span className="customer-id">ID: {customer.id}</span>
                </div>
                <div className="customer-location">
                  {customer.custentityLatitude && customer.custentityLongitude ? (
                    <span>
                      📍 {customer.custentityLatitude.toFixed(4)}, {customer.custentityLongitude.toFixed(4)}
                    </span>
                  ) : (
                    <span>📍 Location not available</span>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="technical-info">
        <h4>Technical Details:</h4>
        <ul>
          <li>Service retrieved via: <code>useInversifyService(ICustomerServiceId)</code></li>
          <li>Binding: <code>container.bind&lt;ICustomerService&gt;().to(Implementation).inSingletonScope()</code></li>
          <li>Implementation selected based on <code>AppConfig.USE_REAL_API</code></li>
          <li>Demonstrates dependency injection for swappable implementations</li>
        </ul>
      </div>
    </div>
  );
};
