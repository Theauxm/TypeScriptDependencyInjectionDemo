import { Injectable } from '../../di-lib/decorators';
import type { ICustomerService } from '../CustomerService/ICustomerService';
import { IPaymentService } from './IPaymentService';
import { demoServiceContainer } from '../../config/DIInitialization';

@Injectable("PaymentService")
export class PaymentService implements IPaymentService {
  private customersService: ICustomerService;

  constructor() {
    this.customersService = demoServiceContainer.resolve("CustomerService");
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
