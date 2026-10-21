import Divider from '@mui/material/Divider';
import { Fragment } from 'react';

import type { Review } from '../types/review.types';

import { ReviewCard } from './ReviewCard';

export function ReviewList({ reviews }: { reviews: readonly Review[] }) {
  return (
    <div className="flex flex-col gap-4">
      {reviews.map((review, index) => (
        <Fragment key={review.id}>
          {index > 0 && <Divider />}
          <ReviewCard review={review} />
        </Fragment>
      ))}
    </div>
  );
}
