import React, { useState, useEffect } from 'react';
import { useInversifyService } from '../useInversifyService';
import { ICountServiceId } from '../serviceIdentifiers';

export const InversifyView3: React.FC = () => {
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
      <h2>Inversify View 3 - Transient Count Service</h2>
      <div className="service-info">
        <p>This view uses a <strong>transient</strong> ICountService instance via Inversify.</p>
        <p>Each component gets its own instance, but it's cached per component lifecycle.</p>
        <p><strong>Note:</strong> Unmounting and remounting creates a new instance (resets count)!</p>
      </div>
      
      <div className="mount-controls">
        <button 
          className="mount-button"
          onClick={handleToggleMount}
        >
          {isMounted ? 'Unmount Component' : 'Mount Component'}
        </button>
      </div>

      {isMounted && <InversifyCountComponent key={mountKey} viewName="Inversify View 3" />}
      
      <div className="technical-info">
        <h4>Technical Details:</h4>
        <ul>
          <li>Service retrieved via: <code>useInversifyService(SERVICE_IDENTIFIERS.ICountService)</code></li>
          <li>Binding: <code>container.bind&lt;ICountService&gt;().to(InversifyCountService).inTransientScope()</code></li>
          <li>Each component gets its own instance (cached by useRef)</li>
          <li>State resets when component unmounts/remounts</li>
        </ul>
      </div>
    </div>
  );
};

const InversifyCountComponent: React.FC<{ viewName: string }> = ({ viewName }) => {
  const countService = useInversifyService(ICountServiceId);
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
    <div className="count-demo">
      <div className="count-display">
        <span className="count-value">{currentCount}</span>
      </div>
      
      <div className="count-controls">
        <button 
          className="action-button"
          onClick={handleIncrement}
        >
          Increment
        </button>
        
        <button 
          className="action-button"
          onClick={handleReset}
        >
          Reset
        </button>
      </div>
      
      <p className="instance-info">
        <strong>{viewName}</strong> - Transient instance (component-scoped)
      </p>
    </div>
  );
};
