import { IColorService } from '../di/interfaces/IColorService';
import { ICountService } from '../di/interfaces/ICountService';
import { ICustomerService } from '../di/interfaces/ICustomerService';

/**
 * Service identifiers for Inversify dependency injection.
 * Using unique symbols with explicit typing for better TypeScript inference.
 */

export const IColorServiceId = Symbol('IColorService') as symbol & { __type: IColorService };
export const ICountServiceId = Symbol('ICountService') as symbol & { __type: ICountService };
export const ICustomerServiceId = Symbol('ICustomerService') as symbol & { __type: ICustomerService };

export const SERVICE_IDENTIFIERS = {
  IColorService: IColorServiceId,
  ICountService: ICountServiceId,
  ICustomerService: ICustomerServiceId,
} as const;

export type ServiceIdentifier = typeof SERVICE_IDENTIFIERS[keyof typeof SERVICE_IDENTIFIERS];
