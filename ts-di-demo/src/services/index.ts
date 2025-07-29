// Initialize DI container FIRST - before any services are imported
import '../config/DIInitialization';

// Import types first to extend the DI library types
import './types';

// Single place for importing all services
// and have them automatically registered
// thanks to the decorators

import './ColorService/ColorService';
import './CountService/CountService';
import './CustomerService/FakeCustomerService';
import './CustomerService/RealCustomerService';
import './PaymentService/PaymentService';
import './AxiosService/RealAxiosService';
import './AxiosService/FakeAxiosService';
import './NwycService/NwycService';
import './StorageService/MemoryStorageService';
import './AuthenticationService/AuthenticationService';
