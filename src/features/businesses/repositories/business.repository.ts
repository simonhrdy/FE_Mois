import type { Business } from '../types/business.types';

export interface BusinessRepository {
  getById(id: string, signal?: AbortSignal): Promise<Business>;
}
