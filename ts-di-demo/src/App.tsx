import React, { useState } from 'react';
// import { ServiceProvider } from './di/ServiceProvider';
// import { ServiceCollection } from './di/ServiceCollection';
// import { ColorServiceFactory } from './di/factories/ColorServiceFactory';
// import { CountServiceFactory } from './di/factories/CountServiceFactory';
// import { RealCustomerServiceFactory } from './di/factories/RealCustomerServiceFactory';
// import { FakeCustomerServiceFactory } from './di/factories/FakeCustomerServiceFactory';
// import { AppConfig } from './config/AppConfig';
import { ColorServiceConsumerView } from './components/View1';
// import { View2 } from './components/View2';
import { View3 } from './components/View3';
import { View4 } from './components/View4';
import { ApiDemoView } from './components/ApiDemoView';
import './App.css';
import { ColorContextProvider } from './contexts/color-context-provider';

type DemoMode = 'di' | 'api';

// NOTE: This is _actually_ ☝️🤓 creating an instance of the service
// for the _entire_ application. Even for the "scoped" components
//
// Create and configure the service collection
// const createServiceCollection = (): ServiceCollection => {
//   const services = new ServiceCollection();
  
//   // Register singleton ColorService
//   services.register('IColorService', new ColorServiceFactory());
  
//   // Register scoped CountService
//   services.register('ICountService', new CountServiceFactory());
  
//   // Register singleton CustomerService - configuration-driven factory selection
//   if (AppConfig.USE_REAL_API) {
//     services.register('ICustomerService', new RealCustomerServiceFactory());
//   } else {
//     services.register('ICustomerService', new FakeCustomerServiceFactory());
//   }
  
//   return services;
// };

const App: React.FC = () => {
  // const [services] = useState(() => createServiceCollection());
  const [demoMode, setDemoMode] = useState<DemoMode>('di');

  const renderContent = () => {
    if (demoMode === 'api') {
      return (
        <div className="single-view-container">
          <ApiDemoView />
        </div>
      );
    }

    return (
      <div className="views-grid">
        <ColorContextProvider>
          <div className="view-container">
            <ColorServiceConsumerView viewTitle={'View 1'} />
          </div>
          <div className="view-container">
            <ColorServiceConsumerView viewTitle={'View 2'} />
          </div>
        </ColorContextProvider>
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
    // <ServiceProvider services={services}>
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
        </nav>
        
        <main className="app-main">
          {renderContent()}
        </main>
        
        {renderFooter()}
      </div>
    // </ServiceProvider>
  );
};

export default App;
