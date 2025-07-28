import { ColorService } from "./services/ColorService";
import { CountService } from "./services/CountService";
import { FakeCustomerService } from "./services/FakeCustomerService";
import { PaymentService } from "./services/PaymentService";
import { RealCustomerService } from "./services/RealCustomerService";
import { RealAxiosService } from "./services/RealAxiosService";
import { FakeAxiosService } from "./services/FakeAxiosService";
import { NwycService } from "./services/NwycService";

export interface ServiceMap {
  ColorService: ColorService;
  CountService: CountService;
  CustomerService: FakeCustomerService | RealCustomerService;
  PaymentService: PaymentService;
  AxiosService: RealAxiosService | FakeAxiosService;
  NwycService: NwycService;
}

export type ServiceKey = keyof ServiceMap;
