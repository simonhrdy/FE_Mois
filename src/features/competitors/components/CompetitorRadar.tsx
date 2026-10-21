'use client';

import { RadarChart } from '@mui/x-charts/RadarChart';

import type { ComparisonRow } from '../types/competitor.types';
import { RADAR_METRICS, radarSeries } from '../utils/radar-profile';

const CHART_HEIGHT = 320;
const MAX = 100;

export function CompetitorRadar({
  rows,
  ownName,
}: {
  rows: readonly ComparisonRow[];
  ownName: string;
}) {
  const { own, competitors } = radarSeries(rows);

  return (
    <figure className="m-0" aria-label="Profil podniku ve srovnání s průměrem sledované konkurence">
      <RadarChart
        height={CHART_HEIGHT}
        radar={{ max: MAX, metrics: [...RADAR_METRICS] }}
        series={[
          {
            id: 'own',
            label: ownName,
            data: own,
            fillArea: true,
            color: 'var(--mui-palette-primary-main)',
          },
          {
            id: 'competitors',
            label: 'Průměr konkurence',
            data: competitors,
            fillArea: true,
            color: 'var(--mui-palette-tertiary-main)',
          },
        ]}
        sx={{ '& path': { fillOpacity: 0.22 } }}
      />
    </figure>
  );
}
