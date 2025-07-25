import React, { useState, useEffect } from 'react';
import { Customer } from '../types/CustomerTypes';
import { AppConfig } from '../config/AppConfig';
import { useService } from '../hooks/use-service';

export const ApiDemoView: React.FC = () => {
  const customerService = useService('CustomerServiceFactory');

  const [customers, setCustomers] = useState<Customer[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const fetchCustomers = async () => {
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
      setError('An unexpected error occurred');
    } finally {
      setLoading(false);
    }
  };

  // Load data on component mount
  useEffect(() => {
    fetchCustomers();
  }, []);

  const handleRefresh = () => {
    fetchCustomers();
  };

  return (
    <div className="view">
      <h2>API Demo - Customer Data</h2>
      
      <div className="service-info">
        <p>This demo showcases <strong>interface-based dependency injection</strong> with real vs mock implementations.</p>
        <p>
          <strong>Current Implementation:</strong> {' '}
          <span className={`implementation-badge ${AppConfig.USE_REAL_API ? 'real' : 'fake'}`}>
            {AppConfig.USE_REAL_API ? '🌐 Real API Service' : '🎭 Fake Mock Service'}
          </span>
        </p>
        <p>
          <em>Change the <code>USE_REAL_API</code> setting in AppConfig.ts and restart to switch implementations.</em>
        </p>
      </div>

      <div className="api-controls">
        <button 
          className="action-button"
          onClick={handleRefresh}
          disabled={loading}
        >
          {loading ? 'Loading...' : 'Refresh Data'}
        </button>
      </div>

      {loading && (
        <div className="loading-state">
          <div className="loading-spinner"></div>
          <p>Fetching customer data...</p>
        </div>
      )}

      {error && (
        <div className="error-state">
          <h4>❌ Error Loading Data</h4>
          <p>{error}</p>
          <button className="action-button secondary" onClick={handleRefresh}>
            Try Again
          </button>
        </div>
      )}

      {!loading && !error && customers.length > 0 && (
        <div className="customer-table-container">
          <h3>Customer Data ({customers.length} records)</h3>
          <div className="table-wrapper">
            <table className="customer-table">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Full Name</th>
                  <th>Latitude</th>
                  <th>Longitude</th>
                  <th>Location</th>
                </tr>
              </thead>
              <tbody>
                {customers.map((customer) => (
                  <tr key={customer.id}>
                    <td>{customer.id}</td>
                    <td className="company-name">{customer.fullname}</td>
                    <td>{customer.custentityLatitude?.toFixed(4) ?? 'N/A'}</td>
                    <td>{customer.custentityLongitude?.toFixed(4) ?? 'N/A'}</td>
                    <td>
                      {customer.custentityLatitude && customer.custentityLongitude ? (
                        <a
                          href={`https://www.google.com/maps?q=${customer.custentityLatitude},${customer.custentityLongitude}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="map-link"
                        >
                          📍 View on Map
                        </a>
                      ) : (
                        'No location'
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {!loading && !error && customers.length === 0 && (
        <div className="empty-state">
          <h4>No Data Available</h4>
          <p>No customer records were found.</p>
        </div>
      )}

      <div className="technical-info">
        <h4>Technical Details:</h4>
        <ul>
          <li>Service retrieved via: <code>useService&lt;ICustomerService&gt;('ICustomerService')</code></li>
          <li>Factory type: <code>{AppConfig.USE_REAL_API ? 'RealCustomerServiceFactory' : 'FakeCustomerServiceFactory'}</code> (Singleton)</li>
          <li>Implementation: <code>{AppConfig.USE_REAL_API ? 'RealCustomerService' : 'FakeCustomerService'}</code></li>
          <li>Error handling: Service-level error management with user-friendly messages</li>
          <li>Loading states: Async operation feedback with loading indicators</li>
        </ul>
      </div>
    </div>
  );
};
