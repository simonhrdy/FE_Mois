'use client';

import Search from '@mui/icons-material/Search';
import Button from '@mui/material/Button';
import InputAdornment from '@mui/material/InputAdornment';
import MenuItem from '@mui/material/MenuItem';
import Slider from '@mui/material/Slider';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import { useId } from 'react';

import { MAX_STARS, MIN_STARS, NEGATIVE_MAX_STARS, REVIEW_SORTS } from '../schemas/review.schema';
import type { ReviewQuery, ReviewSort } from '../types/review.types';

const SORT_LABELS: Record<ReviewSort, string> = {
  newest: 'Nejnovější',
  oldest: 'Nejstarší',
  lowest: 'Nejhorší hodnocení',
  highest: 'Nejlepší hodnocení',
  useful: 'Nejužitečnější',
};

const STAR_MARKS = [1, 2, 3, 4, 5].map((value) => ({ value, label: `${value}★` }));

export type ReviewFilterChange = Partial<Record<keyof ReviewQuery, string | number | undefined>>;

interface ReviewFiltersProps {
  query: ReviewQuery;
  search: string;
  onSearchChange: (value: string) => void;
  onChange: (changes: ReviewFilterChange) => void;
}

function toSort(value: string): ReviewSort | undefined {
  return REVIEW_SORTS.find((sort) => sort === value);
}

export function ReviewFilters({ query, search, onSearchChange, onChange }: ReviewFiltersProps) {
  const sliderLabelId = useId();
  const isNegativeOnly = query.minStars === MIN_STARS && query.maxStars === NEGATIVE_MAX_STARS;

  return (
    <div role="search" className="flex flex-col gap-4 p-4">
      <div className="grid gap-3 md:grid-cols-[2fr_1fr]">
        <TextField
          type="search"
          size="small"
          label="Hledat v textu recenzí"
          value={search}
          onChange={(event) => onSearchChange(event.target.value)}
          slotProps={{
            input: {
              startAdornment: (
                <InputAdornment position="start">
                  <Search />
                </InputAdornment>
              ),
            },
          }}
        />
        <TextField
          select
          size="small"
          label="Řazení"
          value={query.sort}
          onChange={(event) => onChange({ sort: toSort(event.target.value), page: undefined })}
        >
          {REVIEW_SORTS.map((sort) => (
            <MenuItem key={sort} value={sort}>
              {SORT_LABELS[sort]}
            </MenuItem>
          ))}
        </TextField>
      </div>

      <div className="grid gap-4 md:grid-cols-[2fr_1fr_1fr] md:items-end">
        <div className="px-2">
          <Typography id={sliderLabelId} variant="caption" color="text.secondary">
            Počet hvězdiček: {query.minStars}–{query.maxStars}
          </Typography>
          <Slider
            aria-labelledby={sliderLabelId}
            getAriaValueText={(value) => `${value} hvězdiček`}
            value={[query.minStars, query.maxStars]}
            min={MIN_STARS}
            max={MAX_STARS}
            step={1}
            marks={STAR_MARKS}
            onChangeCommitted={(_event, value) => {
              if (!Array.isArray(value)) return;
              onChange({ minStars: value[0], maxStars: value[1], page: undefined });
            }}
          />
        </div>
        <TextField
          type="date"
          size="small"
          label="Od"
          value={query.from ?? ''}
          onChange={(event) => onChange({ from: event.target.value, page: undefined })}
          slotProps={{ inputLabel: { shrink: true } }}
        />
        <TextField
          type="date"
          size="small"
          label="Do"
          value={query.to ?? ''}
          onChange={(event) => onChange({ to: event.target.value, page: undefined })}
          slotProps={{ inputLabel: { shrink: true } }}
        />
      </div>

      <div className="flex flex-wrap gap-2">
        <Button
          size="small"
          variant={isNegativeOnly ? 'contained' : 'outlined'}
          color="error"
          onClick={() =>
            onChange({ minStars: MIN_STARS, maxStars: NEGATIVE_MAX_STARS, page: undefined })
          }
        >
          Jen negativní (1–2★)
        </Button>
        <Button
          size="small"
          onClick={() =>
            onChange({
              minStars: undefined,
              maxStars: undefined,
              from: undefined,
              to: undefined,
              search: undefined,
              sort: undefined,
              page: undefined,
            })
          }
        >
          Zrušit filtry
        </Button>
      </div>
    </div>
  );
}
