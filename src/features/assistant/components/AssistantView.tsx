'use client';

import CompareArrowsRounded from '@mui/icons-material/CompareArrowsRounded';
import SentimentDissatisfiedOutlined from '@mui/icons-material/SentimentDissatisfiedOutlined';
import ShowChartRounded from '@mui/icons-material/ShowChartRounded';
import TipsAndUpdatesOutlined from '@mui/icons-material/TipsAndUpdatesOutlined';
import Button from '@mui/material/Button';
import ButtonBase from '@mui/material/ButtonBase';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Chip from '@mui/material/Chip';
import Divider from '@mui/material/Divider';
import Tooltip from '@mui/material/Tooltip';
import Typography from '@mui/material/Typography';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { useEffect, useRef, type ReactNode } from 'react';

import { PageContainer } from '@/components/ui/PageContainer';
import { env } from '@/lib/config/env';

import { useAssistantChat } from '../hooks/use-assistant-chat';

import { AssistantAvatar, ChatMessageView } from './ChatMessageView';
import { PromptForm } from './PromptForm';

const SUGGESTIONS: readonly { prompt: string; title: string; icon: ReactNode }[] = [
  {
    title: 'Negativní recenze a konkurence',
    prompt:
      'Ukaž mi negativní recenze mé restaurace a porovnej moje hodnocení se třemi nejlépe hodnocenými pizzeriemi v okolí.',
    icon: <CompareArrowsRounded />,
  },
  {
    title: 'Co zákazníkům vadí?',
    prompt: 'Co zákazníkům nejvíc vadí za posledních 90 dní?',
    icon: <SentimentDissatisfiedOutlined />,
  },
  { title: 'Vývoj hodnocení', prompt: 'Jak se vyvíjí moje hodnocení?', icon: <ShowChartRounded /> },
  {
    title: 'Srovnání s top 5',
    prompt: 'Porovnej mě s pěti nejlepšími konkurenty.',
    icon: <TipsAndUpdatesOutlined />,
  },
];

const PROMPT_PARAM = 'q';

function usePromptFromUrl(send: (prompt: string) => Promise<void>) {
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();
  const handled = useRef<string | null>(null);
  const prompt = searchParams.get(PROMPT_PARAM);

  useEffect(() => {
    if (!prompt || handled.current === prompt) return;
    handled.current = prompt;
    router.replace(pathname, { scroll: false });
    void send(prompt);
  }, [pathname, prompt, router, send]);
}

export function AssistantView({ businessId }: { businessId: string }) {
  const { messages, pending, send, clear } = useAssistantChat(businessId);
  const endRef = useRef<HTMLDivElement>(null);
  usePromptFromUrl(send);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: 'smooth', block: 'end' });
  }, [messages.length, pending]);

  const lastId = messages.at(-1)?.id;

  return (
    <PageContainer width="narrow">
      <header className="flex flex-col items-start gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-3">
          <AssistantAvatar />
          <div>
            <Typography variant="h4" component="h1">
              AI asistent
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Zeptejte se na recenze, hodnocení nebo konkurenci.
            </Typography>
          </div>
        </div>
        <div className="flex items-center gap-2">
          {env.apiMocking && (
            <Tooltip title="Ukázkové odpovědi nad demo daty.">
              <Chip size="small" variant="outlined" label="Demo režim" />
            </Tooltip>
          )}
          {messages.length > 0 && (
            <Button onClick={clear} size="small" sx={{ whiteSpace: 'nowrap' }}>
              Nová konverzace
            </Button>
          )}
        </div>
      </header>

      <Card>
        <CardContent className="flex min-h-[420px] flex-col gap-6" aria-live="polite">
          {messages.length === 0 ? (
            <div className="flex flex-1 flex-col items-center justify-center gap-6 py-6 text-center">
              <div>
                <Typography variant="h5" component="h2">
                  Jak vám mohu pomoci?
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Vyberte si příklad nebo napište vlastní dotaz.
                </Typography>
              </div>
              <div className="grid w-full gap-3 sm:grid-cols-2">
                {SUGGESTIONS.map((suggestion) => (
                  <ButtonBase
                    key={suggestion.title}
                    onClick={() => void send(suggestion.prompt)}
                    disabled={pending}
                    className="flex flex-col items-start gap-2 rounded-2xl border border-divider p-4 text-left transition-colors hover:border-primary/50 hover:bg-primary/5"
                  >
                    <span
                      className="flex size-9 items-center justify-center rounded-lg bg-primary/10 text-primary"
                      aria-hidden
                    >
                      {suggestion.icon}
                    </span>
                    <Typography variant="subtitle2" component="span">
                      {suggestion.title}
                    </Typography>
                    <Typography variant="caption" color="text.secondary" component="span">
                      {suggestion.prompt}
                    </Typography>
                  </ButtonBase>
                ))}
              </div>
            </div>
          ) : (
            messages.map((message) => (
              <ChatMessageView key={message.id} message={message} animate={message.id === lastId} />
            ))
          )}
          {pending && (
            <div role="status" className="flex animate-fade-in items-center gap-3">
              <AssistantAvatar />
              <span className="flex gap-1" aria-hidden>
                {[0, 1, 2].map((dot) => (
                  <span
                    key={dot}
                    className="size-2 animate-bounce rounded-full bg-primary"
                    style={{ animationDelay: `${dot * 120}ms` }}
                  />
                ))}
              </span>
              <Typography variant="body2" color="text.secondary">
                Zpracovávám dotaz…
              </Typography>
            </div>
          )}
          <div ref={endRef} />
        </CardContent>
        <Divider />
        <CardContent>
          <PromptForm onSubmit={send} pending={pending} />
        </CardContent>
      </Card>
    </PageContainer>
  );
}
