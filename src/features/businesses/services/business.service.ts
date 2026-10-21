import { businessRepository, type BusinessRepository } from '../repositories';
import type { Business } from '../types/business.types';

export function createBusinessService(repository: BusinessRepository) {
  return {
    getBusiness(id: string, signal?: AbortSignal): Promise<Business> {
      return repository.getById(id, signal);
    },
  };
}

export const businessService = createBusinessService(businessRepository);
