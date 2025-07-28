import React, { useState } from 'react';
import { ColorServiceConsumerView } from './components/View1';
import { View3 } from './components/View3';
import { ApiDemoView } from './components/ApiDemoView';
import { NwycDemoView } from './components/NwycDemoView';
import './App.css';
import { ColorContextProvider } from './contexts/color-context-provider';

type DemoMode = 'di' | 'api' | 'nwyc';

const App: React.FC = () => {
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
          <NwycDemoView />
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
          <View3 viewTitle={'View3'} />
        </div>
        <div className="view-container">
          <View3 viewTitle={'View4'} />
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
            <h3>NWYC API Demo Explanation:</h3>
            <ul>
              <li><strong>Complete API Wrapper:</strong> Full implementation of all 44 NWYC API endpoints with TypeScript types</li>
              <li><strong>Layered Architecture:</strong> NwycService → IAxiosService → Real/Fake HTTP implementations</li>
              <li><strong>TanStack Query Integration:</strong> Built-in caching, loading states, and error handling</li>
              <li><strong>Dependency Injection:</strong> HTTP layer is abstracted and mockable for testing</li>
            </ul>
            <h4>Architecture Benefits:</h4>
            <ul>
              <li><strong>HTTP Abstraction:</strong> Real vs Mock HTTP calls determined by configuration</li>
              <li><strong>Type Safety:</strong> Complete TypeScript coverage for all request/response types</li>
              <li><strong>Error Handling:</strong> Consistent ServiceResult pattern across all endpoints</li>
              <li><strong>Testability:</strong> Easy to test with fake HTTP responses</li>
              <li><strong>Maintainability:</strong> Clean separation between business logic and HTTP concerns</li>
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
            🏛️ NWYC API Demo
          </button>
        </nav>
        
        <main className="app-main">
          {renderContent()}
        </main>
        
        {renderFooter()}
      </div>
  );
};

export default App;
