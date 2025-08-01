import React, { useState } from 'react';
import { ColorServiceConsumerView } from './components/View1';
import { View3 } from './components/View3';
import { ApiDemoView } from './components/ApiDemoView';
import { NwycDemoView } from './components/NwycDemoView';
import { SemanticServicesDemo } from './components/SemanticServicesDemo';
import { ConfigurationDemo } from './components/ConfigurationDemo';
import './App.css';
import { ColorContextProvider } from './contexts/color-context-provider';

type DemoMode = 'di' | 'api' | 'nwyc' | 'semantic' | 'config';

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

    if (demoMode === 'semantic') {
      return (
        <div className="single-view-container">
          <SemanticServicesDemo />
        </div>
      );
    }

    if (demoMode === 'config') {
      return (
        <div className="single-view-container">
          <ConfigurationDemo />
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

    if (demoMode === 'semantic') {
      return (
        <footer className="app-footer">
          <div className="legend">
            <h3>Semantic Services Layer Explanation:</h3>
            <ul>
              <li><strong>API Agnostic Abstraction:</strong> Domain-focused services that hide NWYC API complexity</li>
              <li><strong>Feature-Focused Design:</strong> AuthenticationService manages complete auth lifecycle with token handling</li>
              <li><strong>Domain-Driven Services:</strong> UserService, ContentService, etc. organized by business domain</li>
              <li><strong>Stateful Management:</strong> Services maintain internal state (tokens, user data) automatically</li>
            </ul>
            <h4>Architecture Benefits:</h4>
            <ul>
              <li><strong>Clean APIs:</strong> Simple method calls hide multi-step API operations</li>
              <li><strong>Composability:</strong> Services work together seamlessly (UserService uses AuthenticationService)</li>
              <li><strong>Maintainability:</strong> Business logic separated from API implementation details</li>
              <li><strong>Testability:</strong> Easy to mock domain services for unit testing</li>
              <li><strong>Developer Experience:</strong> Intuitive, business-focused method names and operations</li>
            </ul>
          </div>
        </footer>
      );
    }

    if (demoMode === 'config') {
      return (
        <footer className="app-footer">
          <div className="legend">
            <h3>Environment-Based Configuration Explanation:</h3>
            <ul>
              <li><strong>Environment-Specific Values:</strong> Different configuration values for Local, Development, and Production environments</li>
              <li><strong>Centralized Management:</strong> All configuration in one place with clear environment differences</li>
              <li><strong>Type Safety:</strong> Compile-time validation ensures all environments have consistent structure</li>
              <li><strong>Easy Environment Switching:</strong> Change environments by updating one constant in Environment.ts</li>
            </ul>
            <h4>Key Benefits:</h4>
            <ul>
              <li><strong>Consistency:</strong> Matches existing service profile pattern for familiar developer experience</li>
              <li><strong>Maintainability:</strong> Adding new configuration values requires updating all environments</li>
              <li><strong>Debugging:</strong> Utility functions help validate and inspect configuration across environments</li>
              <li><strong>Integration:</strong> Works seamlessly with dependency injection system and services</li>
              <li><strong>Scalability:</strong> Easy to add new environments or configuration values as needed</li>
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
          <button
            className={`demo-nav-button ${demoMode === 'semantic' ? 'active' : ''}`}
            onClick={() => setDemoMode('semantic')}
          >
            🧩 Semantic Services Demo
          </button>
          <button
            className={`demo-nav-button ${demoMode === 'config' ? 'active' : ''}`}
            onClick={() => setDemoMode('config')}
          >
            ⚙️ Environment Config Demo
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
