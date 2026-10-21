import ChatBubbleOutlineRounded from '@mui/icons-material/ChatBubbleOutlineRounded';
import CheckCircleOutlineRounded from '@mui/icons-material/CheckCircleOutlineRounded';
import Button from '@mui/material/Button';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';
import NextLink from 'next/link';

import { routes } from '@/lib/config/routes';

import type { InsightSummary } from '../services/recommendations';

const ASSISTANT_PROMPT =
  'Co zákazníkům nejvíc vadí a jak si stojím proti třem nejlepším konkurentům?';

export function InsightSummaryCard({ summary }: { summary: InsightSummary }) {
  return (
    <Card className="relative flex h-full flex-col overflow-hidden">
      <CardContent className="flex flex-1 flex-col gap-3">
        <div className="flex items-center gap-2">
          <span
            className="flex size-8 items-center justify-center rounded-lg bg-container text-muted"
            aria-hidden
          >
            <ChatBubbleOutlineRounded fontSize="small" />
          </span>
          <Typography variant="overline" color="text.secondary">
            Shrnutí a doporučení
          </Typography>
        </div>
        <Typography variant="h6" component="h2">
          {summary.headline}
        </Typography>
        {summary.sentences.map((sentence) => (
          <Typography key={sentence} variant="body2" color="text.secondary">
            {sentence}
          </Typography>
        ))}
        {summary.recommendations.length > 0 && (
          <ul className="m-0 flex list-none flex-col gap-2 p-0">
            {summary.recommendations.map((recommendation) => (
              <li key={recommendation} className="flex gap-2">
                <CheckCircleOutlineRounded fontSize="small" color="secondary" aria-hidden />
                <Typography variant="body2">{recommendation}</Typography>
              </li>
            ))}
          </ul>
        )}
        <Button
          component={NextLink}
          href={routes.assistantWithPrompt(ASSISTANT_PROMPT)}
          variant="contained"
          startIcon={<ChatBubbleOutlineRounded />}
          className="mt-auto self-start"
        >
          Zeptat se asistenta
        </Button>
      </CardContent>
    </Card>
  );
}
