import { serviceContainer } from './ServiceContainer';
import { Environment, CURRENT_ENVIRONMENT } from './Environment';

/**
 * Demonstration of the new environment-based dependency injection system
 * This file shows how the system works and can be used for testing
 */
export class EnvironmentDemo {
  
  /**
   * Demonstrates the current service registrations
   */
  static showRegistrationInfo(): void {
    console.log('\n=== Environment-Based Dependency Injection Demo ===');
    console.log(`Current Environment: ${CURRENT_ENVIRONMENT}`);
    console.log('\nRegistered Services:');
    
    const registrationInfo = serviceContainer.getRegistrationInfo();
    Object.entries(registrationInfo).forEach(([serviceKey, info]) => {
      console.log(`  ${serviceKey}:`);
      console.log(`    Implementation: ${info.implementation}`);
      console.log(`    Singleton: ${info.singleton}`);
    });

    console.log('\nRegistration Attempts:');
    const attempts = serviceContainer.getRegistrationAttempts();
    Object.entries(attempts).forEach(([serviceKey, implementations]) => {
      console.log(`  ${serviceKey}: [${implementations.join(', ')}]`);
    });
  }

  /**
   * Tests service resolution
   */
  static testServiceResolution(): void {
    console.log('\n=== Service Resolution Test ===');
    
    try {
      // Test CustomerService resolution
      const customerService = serviceContainer.resolve("CustomerService");
      console.log(`✅ CustomerService resolved: ${customerService.constructor.name}`);
      
      // Test AxiosService resolution
      const axiosService = serviceContainer.resolve("AxiosService");
      console.log(`✅ AxiosService resolved: ${axiosService.constructor.name}`);
      
      // Test other services
      const colorService = serviceContainer.resolve("ColorService");
      console.log(`✅ ColorService resolved: ${colorService.constructor.name}`);
      
      const countService = serviceContainer.resolve("CountService");
      console.log(`✅ CountService resolved: ${countService.constructor.name}`);
      
      const paymentService = serviceContainer.resolve("PaymentService");
      console.log(`✅ PaymentService resolved: ${paymentService.constructor.name}`);
      
      const nwycService = serviceContainer.resolve("NwycService");
      console.log(`✅ NwycService resolved: ${nwycService.constructor.name}`);
      
    } catch (error) {
      console.error(`❌ Service resolution failed:`, error);
    }
  }

  /**
   * Demonstrates what happens in different environments
   */
  static showEnvironmentBehavior(): void {
    console.log('\n=== Environment Behavior ===');
    console.log('In Local/Development environments:');
    console.log('  - FakeCustomerService is active (returns mock data)');
    console.log('  - FakeAxiosService is active (returns mock API responses)');
    console.log('  - All other services are active in all environments');
    
    console.log('\nIn Production environment:');
    console.log('  - RealCustomerService is active (makes real API calls)');
    console.log('  - RealAxiosService is active (makes real HTTP requests)');
    console.log('  - All other services are active in all environments');
    
    console.log('\nConflict Prevention:');
    console.log('  - Only one implementation per service interface can be registered');
    console.log('  - Attempting to register multiple implementations throws an error');
    console.log('  - Clear error messages help identify configuration issues');
  }

  /**
   * Shows how to change environments (for demonstration purposes)
   */
  static showEnvironmentSwitching(): void {
    console.log('\n=== Environment Switching ===');
    console.log('To change environments, update CURRENT_ENVIRONMENT in Environment.ts:');
    console.log('');
    console.log('// For local development with mock services');
    console.log('export const CURRENT_ENVIRONMENT: Environment = Environment.Local;');
    console.log('');
    console.log('// For development environment with mock services');
    console.log('export const CURRENT_ENVIRONMENT: Environment = Environment.Development;');
    console.log('');
    console.log('// For production with real services');
    console.log('export const CURRENT_ENVIRONMENT: Environment = Environment.Production;');
    console.log('');
    console.log('The system will automatically register the correct services based on the environment.');
  }

  /**
   * Runs the complete demonstration
   */
  static runDemo(): void {
    this.showRegistrationInfo();
    this.testServiceResolution();
    this.showEnvironmentBehavior();
    this.showEnvironmentSwitching();
    console.log('\n=== Demo Complete ===\n');
  }
}

// Auto-run demo when this file is imported
// Comment out this line if you don't want automatic execution
EnvironmentDemo.runDemo();
