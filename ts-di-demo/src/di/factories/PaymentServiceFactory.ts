import { getServiceFactory } from "../../hooks/use-service";
import { IPaymentService } from "../interfaces/IPaymentService";
import { IServiceFactory } from "../interfaces/IServiceFactory";
import { PaymentService } from "../services/PaymentService";

export class PaymentServiceFactory implements IServiceFactory<IPaymentService> {
  private static instance: IPaymentService | null = null;

  Create(): IPaymentService {
    // Implement as singleton to ensure consistent behavior across the application
    if (PaymentServiceFactory.instance === null) {
      console.log("🎭 Creating Fake Customer Service (mock data)");
      PaymentServiceFactory.instance = new PaymentService(
        getServiceFactory("CustomerServiceFactory").Create()
      );
    }

    return PaymentServiceFactory.instance;
  }
}
