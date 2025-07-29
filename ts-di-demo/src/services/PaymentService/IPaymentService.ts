export interface IPaymentService {
  processPayment: () => Promise<void>;
}