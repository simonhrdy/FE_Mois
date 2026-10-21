'use client';

import EmojiEmotionsOutlined from '@mui/icons-material/EmojiEmotionsOutlined';
import StarOutlineRounded from '@mui/icons-material/StarOutlineRounded';
import ThumbUpOutlined from '@mui/icons-material/ThumbUpOutlined';
import Avatar from '@mui/material/Avatar';
import Chip from '@mui/material/Chip';
import Typography from '@mui/material/Typography';
import type { ReactElement } from 'react';

import { RatingValue } from '@/components/ui/RatingValue';
import { formatDate } from '@/lib/utils/format';

import { NEGATIVE_MAX_STARS } from '../schemas/review.schema';
import type { Review } from '../types/review.types';

interface ReviewCardProps {
  review: Review;

  businessName?: string;
}

function Reaction({ icon, label, count }: { icon: ReactElement; label: string; count: number }) {
  return (
    <Chip
      size="small"
      variant="outlined"
      icon={icon}
      label={count}
      aria-label={`${label}: ${count}`}
    />
  );
}

export function ReviewCard({ review, businessName }: ReviewCardProps) {
  const isNegative = review.stars <= NEGATIVE_MAX_STARS;

  return (
    <article
      className={`flex flex-col gap-2 border-l-4 py-1 pl-4 ${isNegative ? 'border-error' : 'border-divider'}`}
      aria-label={`Recenze od ${review.userName}`}
    >
      <div className="flex flex-wrap items-center gap-x-3 gap-y-1">
        <Avatar sx={{ width: 32, height: 32, fontSize: 14 }} aria-hidden>
          {review.userName.charAt(0)}
        </Avatar>
        <Typography variant="subtitle2" component="p">
          {review.userName}
        </Typography>
        <RatingValue value={review.stars} showValue={false} />
        <Typography
          variant="caption"
          color="text.secondary"
          component="time"
          dateTime={review.date}
        >
          {formatDate(review.date)}
        </Typography>
        {businessName && <Chip size="small" label={businessName} />}
      </div>
      <Typography variant="body2">{review.text}</Typography>
      <div className="flex flex-wrap gap-1">
        <Reaction icon={<ThumbUpOutlined />} label="Užitečné" count={review.useful} />
        <Reaction icon={<EmojiEmotionsOutlined />} label="Vtipné" count={review.funny} />
        <Reaction icon={<StarOutlineRounded />} label="Cool" count={review.cool} />
      </div>
    </article>
  );
}
