'use client';

import ChatBubbleOutlineRounded from '@mui/icons-material/ChatBubbleOutlineRounded';
import Typography from '@mui/material/Typography';

import { useTypewriter } from '@/lib/hooks/use-typewriter';

import type { ChatMessage } from '../types/assistant.types';

import { AssistantResultView } from './AssistantResultView';
import { ToolCallList } from './ToolCallList';

interface ChatMessageViewProps {
  message: ChatMessage;

  animate?: boolean;
}

export function AssistantAvatar() {
  return (
    <span
      aria-hidden
      className="flex size-9 shrink-0 items-center justify-center rounded-xl bg-container text-muted"
    >
      <ChatBubbleOutlineRounded fontSize="small" />
    </span>
  );
}

export function ChatMessageView({ message, animate = false }: ChatMessageViewProps) {
  const typed = useTypewriter(message.text, animate && message.role === 'assistant');
  const finished = typed.length === message.text.length;

  if (message.role === 'user') {
    return (
      <div className="flex animate-fade-up justify-end">
        <div className="max-w-[85%] rounded-3xl rounded-br-md bg-primary px-4 py-2.5 text-white dark:text-black">
          <Typography variant="body2">{message.text}</Typography>
        </div>
      </div>
    );
  }

  return (
    <div className="flex animate-fade-up gap-3">
      <AssistantAvatar />
      <div className="flex min-w-0 flex-1 flex-col gap-3 pt-1">
        <Typography
          variant="body1"
          color={message.isError ? 'error' : undefined}
          role={message.isError ? 'alert' : undefined}
          aria-label={message.text}
        >
          <span aria-hidden>{typed}</span>
          {!finished && (
            <span
              aria-hidden
              className="ml-0.5 inline-block h-4 w-1.5 animate-pulse bg-primary align-middle"
            />
          )}
        </Typography>
        {finished && message.response && <ToolCallList calls={message.response.toolCalls} />}
        {finished &&
          message.response?.results.map((result, index) => (
            <AssistantResultView key={`${result.type}-${index}`} result={result} />
          ))}
      </div>
    </div>
  );
}
