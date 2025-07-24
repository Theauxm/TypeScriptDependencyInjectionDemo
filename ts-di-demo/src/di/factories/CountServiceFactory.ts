import { IServiceFactory } from '../interfaces/IServiceFactory';
import { ICountService } from '../interfaces/ICountService';
import { CountService } from '../services/CountService';

/**
 * Factory for ICountService that implements scoped pattern.
 * This factory creates a new instance of CountService on each call,
 * demonstrating independent service instances.
 */
export class CountServiceFactory implements IServiceFactory<ICountService> {
  Create(): ICountService {
    return new CountService();
  }
}
