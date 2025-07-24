import React, { createContext, useContext, ReactNode } from 'react';
import { ServiceCollection } from './ServiceCollection';

/**
 * React Context that provides access to the service collection.
 * This enables dependency injection throughout the React component tree.
 */
const ServiceContext = createContext<ServiceCollection | null>(null);

interface ServiceProviderProps {
  services: ServiceCollection;
  children: ReactNode;
}

/**
 * React component that provides the service collection to child components
 * via React Context API.
 */
export const ServiceProvider: React.FC<ServiceProviderProps> = ({ services, children }) => {
  return (
    <ServiceContext.Provider value={services}>
      {children}
    </ServiceContext.Provider>
  );
};

/**
 * Hook to access the service collection from React Context.
 * Throws an error if used outside of a ServiceProvider.
 */
export const useServiceCollection = (): ServiceCollection => {
  const services = useContext(ServiceContext);
  if (!services) {
    throw new Error('useServiceCollection must be used within a ServiceProvider');
  }
  return services;
};
