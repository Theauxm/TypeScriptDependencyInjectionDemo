import React from 'react';

interface NavigationProps {
  activeView: string;
  onViewChange: (view: string) => void;
}

export const Navigation: React.FC<NavigationProps> = ({ activeView, onViewChange }) => {
  const views = [
    { id: 'view1', label: 'View 1 (Singleton Color)' },
    { id: 'view2', label: 'View 2 (Singleton Color)' },
    { id: 'view3', label: 'View 3 (Scoped Counter)' },
    { id: 'view4', label: 'View 4 (Scoped Counter)' }
  ];

  return (
    <nav className="navigation">
      {views.map(view => (
        <button
          key={view.id}
          className={`nav-button ${activeView === view.id ? 'active' : ''}`}
          onClick={() => onViewChange(view.id)}
        >
          {view.label}
        </button>
      ))}
    </nav>
  );
};
