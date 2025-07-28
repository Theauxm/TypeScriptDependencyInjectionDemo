import React, { useState, useEffect } from 'react';
import { initializeInversifyContainer } from './container';
import { InversifyView1 } from './components/InversifyView1';
import { InversifyView2 } from './components/InversifyView2';
import { InversifyView3 } from './components/InversifyView3';
import { InversifyApiDemoView } from './components/InversifyApiDemoView';
import '../App.css';

type ViewType = 'view1' | 'view2' | 'view3' | 'api';

export const InversifyApp: React.FC = () => {
  const [currentView, setCurrentView] = useState<ViewType>('view1');
  const [isInitialized, setIsInitialized] = useState(false);

  useEffect(() => {
    // Initialize the Inversify container
    try {
      initializeInversifyContainer();
      setIsInitialized(true);
    } catch (error) {
      console.error('Failed to initialize Inversify container:', error);
    }
  }, []);

  if (!isInitialized) {
    return (
      <div className="app">
        <div className="loading">
          <h2>Initializing Inversify Container...</h2>
          <p>Setting up dependency injection services...</p>
        </div>
      </div>
    );
  }

  const renderCurrentView = () => {
    switch (currentView) {
      case 'view1':
        return <InversifyView1 />;
      case 'view2':
        return <InversifyView2 />;
      case 'view3':
        return <InversifyView3 />;
      case 'api':
        return <InversifyApiDemoView />;
      default:
        return <InversifyView1 />;
    }
  };

  return (
    <div className="app">
      <header className="app-header">
        <h1>🔄 Inversify Dependency Injection Demo</h1>
        <p className="app-subtitle">
          TypeScript React application demonstrating Inversify-based dependency injection patterns
        </p>
      </header>

      <nav className="navigation">
        <button 
          className={`nav-button ${currentView === 'view1' ? 'active' : ''}`}
          onClick={() => setCurrentView('view1')}
        >
          Inversify View 1
        </button>
        <button 
          className={`nav-button ${currentView === 'view2' ? 'active' : ''}`}
          onClick={() => setCurrentView('view2')}
        >
          Inversify View 2
        </button>
        <button 
          className={`nav-button ${currentView === 'view3' ? 'active' : ''}`}
          onClick={() => setCurrentView('view3')}
        >
          Inversify View 3
        </button>
        <button 
          className={`nav-button ${currentView === 'api' ? 'active' : ''}`}
          onClick={() => setCurrentView('api')}
        >
          Inversify API Demo
        </button>
      </nav>

      <main className="main-content">
        {renderCurrentView()}
      </main>

      <footer className="app-footer">
        <div className="comparison-info">
          <h3>🔍 Inversify Implementation Highlights</h3>
          <ul>
            <li><strong>Decorator-based:</strong> Uses @injectable decorators on service classes</li>
            <li><strong>Symbol identifiers:</strong> Type-safe service resolution with symbols</li>
            <li><strong>Container binding:</strong> Explicit service registration with lifetime scopes</li>
            <li><strong>React integration:</strong> Custom hook with component-scoped caching</li>
            <li><strong>External dependency:</strong> Adds ~100KB to bundle size</li>
          </ul>
        </div>
      </footer>
    </div>
  );
};
