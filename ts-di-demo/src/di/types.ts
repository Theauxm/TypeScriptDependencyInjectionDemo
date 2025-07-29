import { ColorService } from "./services/ColorService";
import { CountService } from "./services/CountService";
import { FakeCustomerService } from "./services/FakeCustomerService";
import { PaymentService } from "./services/PaymentService";
import { RealCustomerService } from "./services/RealCustomerService";
import { RealAxiosService } from "./services/RealAxiosService";
import { FakeAxiosService } from "./services/FakeAxiosService";
import { NwycService } from "./services/NwycService";
import { AuthenticationService } from "./services/AuthenticationService";
import { MemoryStorageService } from "./services/MemoryStorageService";

// Import semantic service interfaces
import { IAuthenticationService } from "./interfaces/IAuthenticationService";
import { IStorageService } from "./interfaces/IStorageService";
import { IUserService } from "./interfaces/IUserService";
import { ILegislativeService } from "./interfaces/ILegislativeService";
import { ITopicsService } from "./interfaces/ITopicsService";
import { IPollingService } from "./interfaces/IPollingService";
import { IAlertsService } from "./interfaces/IAlertsService";
import { ICampaignsService } from "./interfaces/ICampaignsService";
import { IPublicationsService } from "./interfaces/IPublicationsService";
import { IContentService } from "./interfaces/IContentService";

export interface ServiceMap {
  ColorService: ColorService;
  CountService: CountService;
  CustomerService: FakeCustomerService | RealCustomerService;
  PaymentService: PaymentService;
  AxiosService: RealAxiosService | FakeAxiosService;
  NwycService: NwycService;
  
  // Semantic Services Layer
  StorageService: IStorageService;
  AuthenticationService: IAuthenticationService;
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
