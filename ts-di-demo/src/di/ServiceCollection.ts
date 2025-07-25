import { AppConfig } from "../config/AppConfig";

import { ColorService } from "./services/ColorService";
import { CountService } from "./services/CountService";
import { FakeCustomerService } from "./services/FakeCustomerService";
import { PaymentService } from "./services/PaymentService";
import { RealCustomerService } from "./services/RealCustomerService";

// Instances created along with the app making them globally
const SingletonServices = {
  ColorService: new ColorService(),
  CustomerService: AppConfig.USE_REAL_API
    ? new RealCustomerService()
    : new FakeCustomerService(),
};

type SingletonServicesType = {
  [K in keyof typeof SingletonServices]: () => typeof SingletonServices[K];
};

export const ServiceCollection = {
  // Maps singletons to a function that returns the global instance 
  Singleton: Object.fromEntries(
    Object.entries(SingletonServices).map(([key, service]) => [
      key,
      () => service,
    ])
  ) as SingletonServicesType,
  // We register them as functions that return a new instance of the service
  Transient: {
    CountService: () => new CountService(),
    PaymentService: () => new PaymentService(SingletonServices.CustomerService),
  },
};
