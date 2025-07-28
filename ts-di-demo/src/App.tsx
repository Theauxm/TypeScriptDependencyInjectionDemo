import React, { useState } from 'react';
import { ServiceProvider } from './di/ServiceProvider';
import { ServiceCollection } from './di/ServiceCollection';
import { ColorServiceFactory } from './di/factories/ColorServiceFactory';
import { CountServiceFactory } from './di/factories/CountServiceFactory';
import { RealCustomerServiceFactory } from './di/factories/RealCustomerServiceFactory';
import { FakeCustomerServiceFactory } from './di/factories/FakeCustomerServiceFactory';
import { RealAxiosServiceFactory } from './di/factories/RealAxiosServiceFactory';
import { FakeAxiosServiceFactory } from './di/factories/FakeAxiosServiceFactory';
import { NwycServiceFactory } from './di/factories/NwycServiceFactory';
import { AppConfig } from './config/AppConfig';
import { View1 } from './components/View1';
import { View2 } from './components/View2';
import { View3 } from './components/View3';
import { View4 } from './components/View4';
import { ApiDemoView } from './components/ApiDemoView';
import { NwycServiceDemo } from './components/NwycServiceDemo';
import './App.css';

type DemoMode = 'di' | 'api' | 'nwyc';

// Create and configure the service collection
const createServiceCollection = (): ServiceCollection => {
  const services = new ServiceCollection();
  
  // Register singleton ColorService
  services.register('IColorService', new ColorServiceFactory());
  
  // Register scoped CountService
  services.register('ICountService', new CountServiceFactory());
  
  // Register singleton CustomerService - configuration-driven factory selection
  if (AppConfig.USE_REAL_API) {
    services.register('ICustomerService', new RealCustomerServiceFactory());
  } else {
    services.register('ICustomerService', new FakeCustomerServiceFactory());
  }
  
  // Register NWYC services - configuration-driven factory selection
  const axiosServiceFactory = AppConfig.USE_REAL_API 
    ? new RealAxiosServiceFactory() 
    : new FakeAxiosServiceFactory();
  
  services.register('IAxiosService', axiosServiceFactory);
  services.register('INwycService', new NwycServiceFactory(axiosServiceFactory));
  
  return services;
};

const App: React.FC = () => {
  const [services] = useState(() => createServiceCollection());
  const [demoMode, setDemoMode] = useState<DemoMode>('di');

  const renderContent = () => {
    if (demoMode === 'api') {
      return (
        <div className="single-view-container">
          <ApiDemoView />
        </div>
      );
    }

    if (demoMode === 'nwyc') {
      return (
        <div className="single-view-container">
          <NwycServiceDemo />
        </div>
      );
    }

    return (
      <div className="views-grid">
        <div className="view-container">
          <View1 />
        </div>
        <div className="view-container">
          <View2 />
        </div>
        <div className="view-container">
          <View3 />
        </div>
        <div className="view-container">
          <View4 />
        </div>
      </div>
    );
  };

  const renderFooter = () => {
    if (demoMode === 'api') {
      return (
        <footer className="app-footer">
          <div className="legend">
            <h3>API Demo Explanation:</h3>
            <ul>
              <li><strong>Interface-based Design:</strong> Same ICustomerService interface with different implementations</li>
              <li><strong>Runtime Configuration:</strong> Switch between real API and mock data via AppConfig.USE_REAL_API</li>
              <li><strong>Error Handling:</strong> Service-level error management for network, HTTP, and GraphQL errors</li>
              <li><strong>Loading States:</strong> Proper async operation feedback with loading indicators</li>
            </ul>
            <h4>Key Benefits:</h4>
            <ul>
              <li><strong>Testability:</strong> Easy to swap real services with mocks for testing</li>
              <li><strong>Environment Flexibility:</strong> Different implementations for dev/staging/production</li>
              <li><strong>Maintainability:</strong> Changes to implementation don't affect consumers</li>
            </ul>
          </div>
        </footer>
      );
    }

    if (demoMode === 'nwyc') {
      return (
        <footer className="app-footer">
          <div className="legend">
            <h3>NWYC Service Demo Explanation:</h3>
            <ul>
              <li><strong>Complete API Wrapper:</strong> 47 endpoints covering authentication, content, topics, polls, alerts, campaigns, and publications</li>
              <li><strong>Layered Architecture:</strong> IAxiosService (HTTP) → INwycService (Business Logic) with dependency injection</li>
              <li><strong>Type Safety:</strong> Full TypeScript coverage with OpenAPI-generated types for all requests/responses</li>
              <li><strong>Authentication:</strong> Token-based authentication with automatic header injection</li>
              <li><strong>Error Handling:</strong> Comprehensive error management at service level with user-friendly messages</li>
              <li><strong>Mock Support:</strong> Complete fake service implementation for testing and development</li>
            </ul>
            <h4>Key Features:</h4>
            <ul>
              <li><strong>47 API Endpoints:</strong> Authentication, content management, legislative data, alerts, campaigns</li>
              <li><strong>Dependency Injection:</strong> Easy testing with real/fake service swapping via configuration</li>
              <li><strong>Service Abstraction:</strong> Clean business logic layer over HTTP operations</li>
              <li><strong>Configuration-Driven:</strong> Switch between real API and mock data via AppConfig.USE_REAL_API</li>
            </ul>
          </div>
        </footer>
      );
    }

    return (
      <footer className="app-footer">
        <div className="legend">
          <h3>DI Demo Explanation:</h3>
          <ul>
            <li><strong>Views 1 & 2:</strong> Use singleton IColorService - shared RGB color state (notice they update together and state persists when unmounted/remounted)</li>
            <li><strong>Views 3 & 4:</strong> Use scoped ICountService - independent counter instances (notice they operate separately and reset when remounted)</li>
          </ul>
          <h4>Key Differences:</h4>
          <ul>
            <li><strong>Singleton:</strong> State persists across component mount/unmount cycles - the service instance lives in memory</li>
            <li><strong>Scoped:</strong> New instances created on each mount - state is lost when component unmounts</li>
          </ul>
        </div>
      </footer>
    );
  };

  return (
    <ServiceProvider services={services}>
      <div className="app">
        <header className="app-header">
          <h1>TypeScript Dependency Injection Demo</h1>
          <p>Demonstrating C#-style DI with React Context API</p>
        </header>

        <nav className="demo-navigation">
          <button
            className={`demo-nav-button ${demoMode === 'di' ? 'active' : ''}`}
            onClick={() => setDemoMode('di')}
          >
            🎯 DI Patterns Demo
          </button>
          <button
            className={`demo-nav-button ${demoMode === 'api' ? 'active' : ''}`}
            onClick={() => setDemoMode('api')}
          >
            🌐 API Integration Demo
          </button>
          <button
            className={`demo-nav-button ${demoMode === 'nwyc' ? 'active' : ''}`}
            onClick={() => setDemoMode('nwyc')}
          >
            🏛️ NWYC Service Demo
          </button>
        </nav>
        
        <main className="app-main">
          {renderContent()}
        </main>
        
        {renderFooter()}
      </div>
    </ServiceProvider>
  );
};

export default App;
