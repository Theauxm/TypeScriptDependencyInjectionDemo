import { ColorService } from "./services/ColorService";
import { CountService } from "./services/CountService";
import { FakeCustomerService } from "./services/FakeCustomerService";
import { PaymentService } from "./services/PaymentService";
import { RealCustomerService } from "./services/RealCustomerService";
import { RealAxiosService } from "./services/RealAxiosService";
import { FakeAxiosService } from "./services/FakeAxiosService";
import { NwycService } from "./services/NwycService";
import { IColorService } from './interfaces/IColorService';
import { ICountService } from './interfaces/ICountService';
import { ICustomerService } from './interfaces/ICustomerService';
import { IPaymentService } from './interfaces/IPaymentService';
import { IAxiosService } from './interfaces/IAxiosService';
import { INwycService } from './interfaces/INwycService';

export interface ServiceMap {
  ColorService: ColorService;
  CountService: CountService;
  CustomerService: FakeCustomerService | RealCustomerService;
  PaymentService: PaymentService;
  AxiosService: RealAxiosService | FakeAxiosService;
  NwycService: NwycService;
}

export interface ServiceInterfaceMap {
  ColorService: IColorService;
  CountService: ICountService;
  CustomerService: ICustomerService;
  PaymentService: IPaymentService;
  AxiosService: IAxiosService;
  NwycService: INwycService;
}

export type ServiceKey = keyof ServiceMap;
