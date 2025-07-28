import { IColorService } from '../di/interfaces/IColorService';
import { ICountService } from '../di/interfaces/ICountService';
import { ICustomerService } from '../di/interfaces/ICustomerService';
import { IColorServiceId, ICountServiceId, ICustomerServiceId } from './serviceIdentifiers';

/**
 * Helper type to extract service type from service identifier.
 * This enables type-safe service resolution in the useInversifyService hook.
 */
export type ServiceType<T> = T extends typeof IColorServiceId
  ? IColorService
  : T extends typeof ICountServiceId
  ? ICountService
  : T extends typeof ICustomerServiceId
  ? ICustomerService
  : never;

/**
 * Valid service identifier type for type safety.
 */
export type ServiceKey = typeof IColorServiceId | typeof ICountServiceId | typeof ICustomerServiceId;
