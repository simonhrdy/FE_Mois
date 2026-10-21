import ArrowForward from '@mui/icons-material/ArrowForward';
import Button from '@mui/material/Button';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardHeader from '@mui/material/CardHeader';
import Typography from '@mui/material/Typography';
import NextLink from 'next/link';

import { EmptyState } from '@/components/ui/EmptyState';
import { routes } from '@/lib/config/routes';

import type { TopicInsight } from '../types/insight.types';

import { TopicList } from './TopicList';

const VISIBLE_TOPICS = 5;

interface TopicInsightsCardProps {
  topics: readonly TopicInsight[];
  subheader: string;
}

export function TopicInsightsCard({ topics, subheader }: TopicInsightsCardProps) {
  const visible = topics.filter((topic) => topic.count > 0).slice(0, VISIBLE_TOPICS);
  const top = visible[0];

  return (
    <Card className="flex h-full flex-col">
      <CardHeader title="Co zákazníkům vadí" subheader={subheader} />
      <CardContent className="flex flex-1 flex-col gap-4">
        {visible.length === 0 ? (
          <EmptyState
            size="compact"
            title="Žádné stížnosti"
            description="V tomto období nejsou negativní recenze."
          />
        ) : (
          <>
            <TopicList topics={visible} />
            {top?.example && (
              <blockquote className="m-0 rounded-xl border-l-4 border-error/50 bg-container px-4 py-3">
                <Typography variant="body2" sx={{ fontStyle: 'italic' }}>
                  „{top.example.text}“
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  — {top.example.userName}, {top.example.stars} ★
                </Typography>
              </blockquote>
            )}
          </>
        )}
        <Button
          component={NextLink}
          href={`${routes.reviews}?maxStars=2`}
          endIcon={<ArrowForward />}
          className="mt-auto self-start"
        >
          Všechny negativní recenze
        </Button>
      </CardContent>
    </Card>
  );
}
