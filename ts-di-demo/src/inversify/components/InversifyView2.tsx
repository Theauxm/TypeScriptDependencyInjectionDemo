import React, { useState, useEffect } from 'react';
import { useInversifyService } from '../useInversifyService';
import { IColorServiceId } from '../serviceIdentifiers';

export const InversifyView2: React.FC = () => {
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
      <h2>Inversify View 2 - Singleton Color Service</h2>
      <div className="service-info">
        <p>This view also uses the <strong>singleton</strong> IColorService instance via Inversify.</p>
        <p>Changes made here will be reflected in Inversify View 1 as well.</p>
        <p><strong>Note:</strong> This is the same singleton instance as View 1!</p>
      </div>
      
      <div className="mount-controls">
        <button 
          className="mount-button"
          onClick={handleToggleMount}
        >
          {isMounted ? 'Unmount Component' : 'Mount Component'}
        </button>
      </div>

      {isMounted && <InversifyColorComponent key={mountKey} viewName="Inversify View 2" />}
      
      <div className="technical-info">
        <h4>Technical Details:</h4>
        <ul>
          <li>Service retrieved via: <code>useInversifyService(SERVICE_IDENTIFIERS.IColorService)</code></li>
          <li>Binding: <code>container.bind&lt;IColorService&gt;().to(InversifyColorService).inSingletonScope()</code></li>
          <li>Same singleton instance as View 1</li>
          <li>Shared state across all components</li>
        </ul>
      </div>
    </div>
  );
};

const InversifyColorComponent: React.FC<{ viewName: string }> = ({ viewName }) => {
  const colorService = useInversifyService(IColorServiceId);
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
        <strong>{viewName}</strong> - Singleton instance (shared state)
      </p>
    </div>
  );
};
