import LinearProgress from '@mui/material/LinearProgress';
import Typography from '@mui/material/Typography';
import NextLink from 'next/link';

import { routes } from '@/lib/config/routes';
import { formatPercent } from '@/lib/utils/format';

import type { TopicInsight } from '../types/insight.types';
import { TOPIC_PRESENTATION } from '../utils/topic-presentation';

const PERCENT = 100;

const reviewsLink = (keyword: string) =>
  `${routes.reviews}?maxStars=2&search=${encodeURIComponent(keyword)}`;

export function TopicList({ topics }: { topics: readonly TopicInsight[] }) {
  return (
    <ul className="m-0 flex list-none flex-col gap-3 p-0">
      {topics.map((topic) => {
        const { label, icon: Icon } = TOPIC_PRESENTATION[topic.topic];
        return (
          <li key={topic.topic}>
            <NextLink
              href={reviewsLink(topic.keyword)}
              className="-mx-2 flex items-center gap-3 rounded-xl px-2 py-1.5 text-inherit no-underline transition-colors hover:bg-container"
            >
              <span
                className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-error/10 text-error"
                aria-hidden
              >
                <Icon fontSize="small" />
              </span>
              <span className="flex min-w-0 flex-1 flex-col gap-1">
                <span className="flex items-baseline justify-between gap-2">
                  <Typography variant="body2" sx={{ fontWeight: 600 }}>
                    {label}
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    {topic.count}× · {formatPercent(topic.share)}
                  </Typography>
                </span>
                <LinearProgress
                  variant="determinate"
                  value={topic.share * PERCENT}
                  color="error"
                  aria-label={`${label}: ${formatPercent(topic.share)} negativních recenzí`}
                  sx={{ height: 5, bgcolor: 'action.hover' }}
                />
              </span>
            </NextLink>
          </li>
        );
      })}
    </ul>
  );
}
