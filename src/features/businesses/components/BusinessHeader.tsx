import PlaceOutlined from '@mui/icons-material/PlaceOutlined';
import Chip from '@mui/material/Chip';
import Typography from '@mui/material/Typography';
import type { ReactNode } from 'react';

import { RatingValue } from '@/components/ui/RatingValue';
import { formatNumber } from '@/lib/utils/format';

import type { Business } from '../types/business.types';

interface BusinessHeaderProps {
  business: Business;
  actions?: ReactNode;
  eyebrow?: ReactNode;
}

export function BusinessHeader({ business, actions, eyebrow }: BusinessHeaderProps) {
  return (
    <header className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
      <div className="flex min-w-0 flex-col gap-1">
        {eyebrow}
        <div className="flex flex-wrap items-center gap-2">
          <Typography variant="h4" component="h1">
            {business.name}
          </Typography>
          {!business.isOpen && <Chip size="small" color="warning" label="Uzavřeno" />}
        </div>
        <div className="flex flex-wrap items-center gap-x-3 gap-y-1">
          <RatingValue value={business.stars} />
          <Typography variant="body2" color="text.secondary">
            {formatNumber(business.reviewCount)} recenzí
          </Typography>
          <Typography
            variant="body2"
            color="text.secondary"
            className="inline-flex items-center gap-1"
          >
            <PlaceOutlined fontSize="inherit" aria-hidden />
            {business.address}, {business.city}, {business.state}
          </Typography>
        </div>
        <div className="flex flex-wrap gap-1 pt-1">
          {business.categories.map((category) => (
            <Chip key={category} label={category} size="small" variant="outlined" />
          ))}
        </div>
      </div>
      {actions && <div className="flex shrink-0 flex-wrap gap-2">{actions}</div>}
    </header>
  );
}
