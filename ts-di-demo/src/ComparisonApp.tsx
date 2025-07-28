import React, { useState } from 'react';
import App from './App';
import { InversifyApp } from './inversify/InversifyApp';
import './App.css';

type ImplementationType = 'original' | 'inversify';

export const ComparisonApp: React.FC = () => {
  const [currentImplementation, setCurrentImplementation] = useState<ImplementationType>('original');

  return (
    <div className="comparison-wrapper">
      <div className="implementation-selector">
        <h2>🔄 Dependency Injection Implementation Comparison</h2>
        <p>Switch between the original custom DI implementation and the Inversify implementation to compare approaches.</p>
        
        <div className="selector-buttons">
          <button 
            className={`selector-button ${currentImplementation === 'original' ? 'active' : ''}`}
            onClick={() => setCurrentImplementation('original')}
          >
            📦 Original Custom DI
          </button>
          <button 
            className={`selector-button ${currentImplementation === 'inversify' ? 'active' : ''}`}
            onClick={() => setCurrentImplementation('inversify')}
          >
            🔄 Inversify Implementation
          </button>
        </div>

        <div className="implementation-info">
          {currentImplementation === 'original' ? (
            <div className="info-panel original">
              <h3>📦 Original Custom Implementation</h3>
              <ul>
                <li><strong>Zero dependencies:</strong> Completely self-contained</li>
                <li><strong>Superior TypeScript integration:</strong> Compile-time type safety</li>
                <li><strong>React-optimized:</strong> Custom useService hook with caching</li>
                <li><strong>Simple architecture:</strong> Easy to understand and debug</li>
                <li><strong>Flexible factories:</strong> Complete control over service creation</li>
              </ul>
            </div>
          ) : (
            <div className="info-panel inversify">
              <h3>🔄 Inversify Implementation</h3>
              <ul>
                <li><strong>Industry standard:</strong> Popular DI framework with large community</li>
                <li><strong>Decorator-based:</strong> Uses @injectable and symbol identifiers</li>
                <li><strong>Advanced features:</strong> Built-in circular dependency detection</li>
                <li><strong>External dependency:</strong> Adds ~100KB to bundle size</li>
                <li><strong>Complex binding:</strong> More verbose service registration</li>
              </ul>
            </div>
          )}
        </div>
      </div>

      <div className="implementation-content">
        {currentImplementation === 'original' ? <App /> : <InversifyApp />}
      </div>
    </div>
  );
};
