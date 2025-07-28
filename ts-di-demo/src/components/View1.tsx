import React, { useState, } from 'react';
import { useColorContext } from '../contexts/color-context-provider';

export const ColorServiceConsumerView: React.FC<{ viewTitle: string }> = ({
  viewTitle,
}) => {
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
      <h2>{viewTitle} - Singleton Color Service</h2>
      <div className="service-info">
        <p>This view uses a <strong>singleton</strong> IColorService instance.</p>
        <p>Changes made here will be reflected in all instances.</p>
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

      {isMounted && <ColorComponent key={mountKey} viewName={viewTitle} />}
      
      <div className="technical-info">
        <h4>Technical Details:</h4>
        <ul>
          <li>Service retrieved via: <code>useService&lt;IColorService&gt;('IColorService')</code></li>
          <li>Factory type: <code>ColorServiceFactory</code> (Singleton)</li>
          <li>Same instance shared across all consumers</li>
          <li>State persists across component mount/unmount cycles</li>
        </ul>
      </div>
    </div>
  );
};

const ColorComponent: React.FC<{ viewName: string }> = ({ viewName }) => {
  const colorContext= useColorContext();

  return (
    <div className="color-demo">
      <div 
        className="color-box"
        style={{ backgroundColor: colorContext.color }}
        title={`Current color: ${colorContext.color}`}
      >
        <span className="color-text">{colorContext.color}</span>
      </div>
      
      <button 
        className="action-button"
        onClick={colorContext.generateColor}
      >
        Generate New Color
      </button>
      
      <p className="instance-info">
        <strong>{viewName}</strong> - Singleton instance (state persists)
      </p>
    </div>
  );
};
