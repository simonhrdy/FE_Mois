import type { AssistantRequest, AssistantResponse } from '../types/assistant.types';

export interface AssistantRepository {
  ask(request: AssistantRequest, signal?: AbortSignal): Promise<AssistantResponse>;
}
