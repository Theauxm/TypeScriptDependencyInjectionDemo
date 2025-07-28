import { IServiceFactory } from '../interfaces/IServiceFactory';
import { INwycService } from '../interfaces/INwycService';
import { IAxiosService } from '../interfaces/IAxiosService';
import { NwycService } from '../services/NwycService';

/**
 * Factory for creating NwycService instances.
 * Implements singleton pattern and handles dependency injection of the IAxiosService.
 * The axios service dependency is injected via constructor to enable testing and flexibility.
 */
export class NwycServiceFactory implements IServiceFactory<INwycService> {
  private static instance: INwycService | null = null;

  constructor(private readonly axiosServiceFactory: IServiceFactory<IAxiosService>) {}

  Create(): INwycService {
    if (NwycServiceFactory.instance === null) {
      console.log('🏛️ Creating NWYC Service (Business logic layer)');
      const axiosService = this.axiosServiceFactory.Create();
      NwycServiceFactory.instance = new NwycService(axiosService);
    }

    return NwycServiceFactory.instance;
  }
}
