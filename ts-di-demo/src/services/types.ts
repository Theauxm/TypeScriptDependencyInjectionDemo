import { ColorService } from "./ColorService/ColorService";
import { CountService } from "./CountService/CountService";
import { FakeCustomerService } from "./CustomerService/FakeCustomerService";
import { PaymentService } from "./PaymentService/PaymentService";
import { RealCustomerService } from "./CustomerService/RealCustomerService";
import { RealAxiosService } from "./AxiosService/RealAxiosService";
import { FakeAxiosService } from "./AxiosService/FakeAxiosService";
import { NwycService } from "./NwycService/NwycService";
import { AuthenticationService } from "./AuthenticationService/AuthenticationService";
import { MemoryStorageService } from "./StorageService/MemoryStorageService";

// Import all service interfaces
import { IColorService } from "./ColorService/IColorService";
import { ICountService } from "./CountService/ICountService";
import { ICustomerService } from "./CustomerService/ICustomerService";
import { IPaymentService } from "./PaymentService/IPaymentService";
import { IAxiosService } from "./AxiosService/IAxiosService";
import { INwycService } from "./NwycService/INwycService";
import { IAuthenticationService } from "./AuthenticationService/IAuthenticationService";
import { IStorageService } from "./StorageService/IStorageService";
import { IUserService } from "./interfaces/IUserService";
import { ILegislativeService } from "./interfaces/ILegislativeService";
import { ITopicsService } from "./interfaces/ITopicsService";
import { IPollingService } from "./interfaces/IPollingService";
import { IAlertsService } from "./interfaces/IAlertsService";
import { ICampaignsService } from "./interfaces/ICampaignsService";
import { IPublicationsService } from "./interfaces/IPublicationsService";
import { IContentService } from "./interfaces/IContentService";

// Extend the DI library types with our specific service mappings
declare module "../di-lib/types" {
  interface ServiceMap {
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

  interface ServiceInterfaceMap {
    ColorService: IColorService;
    CountService: ICountService;
    CustomerService: ICustomerService;
    PaymentService: IPaymentService;
    AxiosService: IAxiosService;
    NwycService: INwycService;
    
    // Semantic Services Layer
    StorageService: IStorageService;
    AuthenticationService: IAuthenticationService;
  }
}
