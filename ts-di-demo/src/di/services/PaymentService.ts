import { Injectable } from "../decorators";
import type { ICustomerService } from "../interfaces/ICustomerService";
import { IPaymentService } from "../interfaces/IPaymentService";
import { serviceContainer } from "../ServiceContainer";

@Injectable("PaymentService")
export class PaymentService implements IPaymentService {
  private customersService: ICustomerService;

  constructor() {
    this.customersService = serviceContainer.resolve("CustomerService");
  }

  async processPayment(): Promise<void> {
    if (!this.customersService) return;
    console.log("Processing payment...");
    const customers = await this.customersService.getCustomers();
    if (customers.success) {
      const customer =
        customers.data[Math.floor(Math.random() * customers.data.length)];
      console.log(`Payment processed for customer: ${customer.fullname}`);
    } else {
      console.error("Something went wrong");
    }
  }
}
