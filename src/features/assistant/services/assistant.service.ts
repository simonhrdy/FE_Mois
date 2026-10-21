import { assistantRepository, type AssistantRepository } from '../repositories';
import { promptSchema } from '../schemas/assistant.schema';
import type { AssistantResponse } from '../types/assistant.types';

export function createAssistantService(repository: AssistantRepository) {
  return {
    ask(prompt: string, businessId: string, signal?: AbortSignal): Promise<AssistantResponse> {
      const parsed = promptSchema.parse({ prompt });
      return repository.ask({ prompt: parsed.prompt, businessId }, signal);
    },
  };
}

export const assistantService = createAssistantService(assistantRepository);
