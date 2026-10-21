'use client';

import { nanoid } from '@reduxjs/toolkit';
import { useCallback, useRef, useState } from 'react';

import { getErrorMessage, isAbortError } from '@/lib/api/errors';

import { assistantService } from '../services/assistant.service';
import type { ChatMessage } from '../types/assistant.types';

export function useAssistantChat(businessId: string) {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [pending, setPending] = useState(false);

  const controller = useRef<AbortController | null>(null);

  const append = (message: Omit<ChatMessage, 'id'>) =>
    setMessages((current) => [...current, { id: nanoid(), ...message }]);

  const send = useCallback(
    async (prompt: string) => {
      controller.current?.abort();
      const request = new AbortController();
      controller.current = request;
      append({ role: 'user', text: prompt });
      setPending(true);
      try {
        const response = await assistantService.ask(prompt, businessId, request.signal);
        append({ role: 'assistant', text: response.answer, response });
      } catch (error) {
        if (!isAbortError(error))
          append({ role: 'assistant', text: getErrorMessage(error), isError: true });
      } finally {
        if (controller.current === request) setPending(false);
      }
    },
    [businessId],
  );

  const clear = useCallback(() => {
    controller.current?.abort();
    setPending(false);
    setMessages([]);
  }, []);

  return { messages, pending, send, clear };
}
