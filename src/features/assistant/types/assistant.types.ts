import type { z } from 'zod';

import type {
  ASSISTANT_TOOLS,
  assistantResponseSchema,
  assistantResultSchema,
  toolCallSchema,
} from '../schemas/assistant.schema';

export type AssistantToolName = (typeof ASSISTANT_TOOLS)[number];
export type ToolCall = z.infer<typeof toolCallSchema>;
export type AssistantResult = z.infer<typeof assistantResultSchema>;
export type AssistantResponse = z.infer<typeof assistantResponseSchema>;

export interface AssistantRequest {
  prompt: string;
  businessId: string;
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  text: string;
  response?: AssistantResponse;
  isError?: boolean;
}
