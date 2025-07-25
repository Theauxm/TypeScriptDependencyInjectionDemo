import { AppConfig } from "../config/AppConfig";
import { ColorServiceFactory } from "./factories/ColorServiceFactory";
import { CountServiceFactory } from "./factories/CountServiceFactory";
import { FakeCustomerServiceFactory } from "./factories/FakeCustomerServiceFactory";
import { PaymentServiceFactory } from "./factories/PaymentServiceFactory";
import { RealCustomerServiceFactory } from "./factories/RealCustomerServiceFactory";

export const ServiceCollection = {
  ColorServiceFactory: new ColorServiceFactory(),
  CountServiceFactory: new CountServiceFactory(),
  CustomerServiceFactory: AppConfig.USE_REAL_API
    ? new RealCustomerServiceFactory()
    : new FakeCustomerServiceFactory(),
  PaymentServiceFactory: new PaymentServiceFactory(),
};
