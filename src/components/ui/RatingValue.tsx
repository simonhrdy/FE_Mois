import Rating from '@mui/material/Rating';
import Typography from '@mui/material/Typography';

import { formatRating } from '@/lib/utils/format';

const RATING_PRECISION = 0.1;

interface RatingValueProps {
  value: number | null;
  size?: 'small' | 'medium' | 'large';

  showValue?: boolean;
}

export function RatingValue({ value, size = 'small', showValue = true }: RatingValueProps) {
  const label = value === null ? 'Bez hodnocení' : `${formatRating(value)} z 5`;
  return (
    <span className="inline-flex items-center gap-1.5" role="img" aria-label={label}>
      <Rating value={value} precision={RATING_PRECISION} size={size} readOnly aria-hidden />
      {showValue && (
        <Typography component="span" variant="body2" sx={{ fontWeight: 500 }} aria-hidden>
          {formatRating(value)}
        </Typography>
      )}
    </span>
  );
}
