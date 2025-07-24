import React, { useState } from 'react';
import { ServiceProvider } from './di/ServiceProvider';
import { ServiceCollection } from './di/ServiceCollection';
import { ColorServiceFactory } from './di/factories/ColorServiceFactory';
import { CountServiceFactory } from './di/factories/CountServiceFactory';
import { View1 } from './components/View1';
import { View2 } from './components/View2';
import { View3 } from './components/View3';
import { View4 } from './components/View4';
import './App.css';

// Create and configure the service collection
const createServiceCollection = (): ServiceCollection => {
  const services = new ServiceCollection();
  
  // Register singleton ColorService
  services.register('IColorService', new ColorServiceFactory());
  
  // Register scoped CountService
  services.register('ICountService', new CountServiceFactory());
  
  return services;
};

const App: React.FC = () => {
  const [services] = useState(() => createServiceCollection());

  return (
    <ServiceProvider services={services}>
      <div className="app">
        <header className="app-header">
          <h1>TypeScript Dependency Injection Demo</h1>
          <p>Demonstrating C#-style DI with React Context API</p>
        </header>
        
        <main className="app-main">
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
        </main>
        
        <footer className="app-footer">
          <div className="legend">
            <h3>Demo Explanation:</h3>
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
      </div>
    </ServiceProvider>
  );
};

export default App;
