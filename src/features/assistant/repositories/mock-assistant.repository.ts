import { delay } from '@/mocks/mock-db';

import type { createAssistantExecutor } from '../services/assistant-executor';
import { planAssistantQuery } from '../services/assistant-planner';

import type { AssistantRepository } from './assistant.repository';

export function createMockAssistantRepository(
  execute: ReturnType<typeof createAssistantExecutor>,
): AssistantRepository {
  return {
    async ask({ prompt, businessId }, signal) {
      await delay(undefined, signal);
      return execute(planAssistantQuery(prompt), businessId, signal);
    },
  };
}
