import React, { useState, useEffect } from 'react';
import { useService } from '../di/useService';
import { IColorService } from '../di/interfaces/IColorService';

export const View2: React.FC = () => {
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
      <h2>View 2 - Singleton Color Service</h2>
      <div className="service-info">
        <p>This view uses the <strong>same singleton</strong> IColorService instance as View 1.</p>
        <p>Changes made here will be reflected in View 1 as well.</p>
        <p><strong>Note:</strong> Unmounting and remounting preserves the singleton's state!</p>
      </div>
      
      <div className="mount-controls">
        <button 
          className="mount-button"
          onClick={handleToggleMount}
        >
          {isMounted ? 'Unmount Component' : 'Mount Component'}
        </button>
      </div>

      {isMounted && <ColorComponent key={mountKey} viewName="View 2" />}
      
      <div className="technical-info">
        <h4>Technical Details:</h4>
        <ul>
          <li>Service retrieved via: <code>useService&lt;IColorService&gt;('IColorService')</code></li>
          <li>Factory type: <code>ColorServiceFactory</code> (Singleton)</li>
          <li>Identical instance to View 1 - demonstrates shared state</li>
          <li>State persists across component mount/unmount cycles</li>
        </ul>
      </div>
    </div>
  );
};

const ColorComponent: React.FC<{ viewName: string }> = ({ viewName }) => {
  const colorService = useService('IColorService');
  const [currentColor, setCurrentColor] = useState(colorService.getRgbColor());

  useEffect(() => {
    // Subscribe to color changes
    const unsubscribe = colorService.subscribe(() => {
      setCurrentColor(colorService.getRgbColor());
    });

    return unsubscribe;
  }, [colorService]);

  const handleGenerateColor = () => {
    colorService.generateNewColor();
  };

  return (
    <div className="color-demo">
      <div 
        className="color-box"
        style={{ backgroundColor: currentColor }}
        title={`Current color: ${currentColor}`}
      >
        <span className="color-text">{currentColor}</span>
      </div>
      
      <button 
        className="action-button"
        onClick={handleGenerateColor}
      >
        Generate New Color
      </button>
      
      <p className="instance-info">
        <strong>{viewName}</strong> - Singleton instance (state persists)
      </p>
    </div>
  );
};
