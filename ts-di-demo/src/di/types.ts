import { ColorService } from "./services/ColorService";
import { CountService } from "./services/CountService";
import { FakeCustomerService } from "./services/FakeCustomerService";
import { PaymentService } from "./services/PaymentService";
import { RealCustomerService } from "./services/RealCustomerService";

export interface ServiceMap {
  ColorService: ColorService;
  CountService: CountService;
  CustomerService: FakeCustomerService | RealCustomerService;
  PaymentService: PaymentService;
}

export type ServiceKey = keyof ServiceMap;