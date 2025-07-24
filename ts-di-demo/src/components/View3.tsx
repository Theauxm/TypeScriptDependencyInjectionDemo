import React, { useState, useEffect } from 'react';
import { useService } from '../di/useService';
import { ICountService } from '../di/interfaces/ICountService';

export const View3: React.FC = () => {
  const [isMounted, setIsMounted] = useState(true);
  const [mountKey, setMountKey] = useState(0);

  const handleToggleMount = () => {
    if (isMounted) {
      setIsMounted(false);
    } else {
      setMountKey(prev => prev + 1);
      setIsMounted(true);
    }
  };

  return (
    <div className="view">
      <h2>View 3 - Scoped Count Service</h2>
      <div className="service-info">
        <p>This view uses a <strong>scoped</strong> ICountService instance.</p>
        <p>Each mount creates a new independent service instance.</p>
      </div>
      
      <div className="mount-controls">
        <button 
          className="mount-button"
          onClick={handleToggleMount}
        >
          {isMounted ? 'Unmount Component' : 'Mount Component'}
        </button>
      </div>

      {isMounted && <CounterComponent key={mountKey} viewName="View 3" />}
      
      <div className="technical-info">
        <h4>Technical Details:</h4>
        <ul>
          <li>Service retrieved via: <code>useService&lt;ICountService&gt;('ICountService')</code></li>
          <li>Factory type: <code>CountServiceFactory</code> (Scoped)</li>
          <li>New instance created on each component mount</li>
          <li>Independent from View 4's counter instance</li>
        </ul>
      </div>
    </div>
  );
};

const CounterComponent: React.FC<{ viewName: string }> = ({ viewName }) => {
  const countService = useService<ICountService>('ICountService');
  const [currentCount, setCurrentCount] = useState(countService.getCount());

  useEffect(() => {
    // Subscribe to count changes
    const unsubscribe = countService.subscribe(() => {
      setCurrentCount(countService.getCount());
    });

    return unsubscribe;
  }, [countService]);

  const handleIncrement = () => {
    countService.increment();
  };

  const handleReset = () => {
    countService.reset();
  };

  return (
    <div className="counter-demo">
      <div className="counter-display">
        <span className="counter-value">{currentCount}</span>
        <span className="counter-label">Current Count</span>
      </div>
      
      <div className="counter-controls">
        <button 
          className="action-button"
          onClick={handleIncrement}
        >
          Increment (+1)
        </button>
        <button 
          className="action-button secondary"
          onClick={handleReset}
        >
          Reset
        </button>
      </div>
      
      <p className="instance-info">
        <strong>{viewName}</strong> - Independent scoped instance
      </p>
    </div>
  );
};
