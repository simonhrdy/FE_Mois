import CircularProgress from '@mui/material/CircularProgress';
import Skeleton from '@mui/material/Skeleton';
import Stack from '@mui/material/Stack';

const DEFAULT_SKELETON_ROWS = 5;

interface PageLoaderProps {
  label?: string;
}

export function PageLoader({ label = 'Načítání…' }: PageLoaderProps) {
  return (
    <div role="status" className="flex min-h-[40vh] flex-col items-center justify-center gap-3">
      <CircularProgress aria-label={label} />
    </div>
  );
}

interface TableSkeletonProps {
  rows?: number;
}

export function TableSkeleton({ rows = DEFAULT_SKELETON_ROWS }: TableSkeletonProps) {
  return (
    <Stack spacing={1} role="status" aria-label="Načítání tabulky" className="p-4">
      <Skeleton variant="rounded" height={40} />
      {Array.from({ length: rows }, (_, index) => (
        <Skeleton key={index} variant="rounded" height={48} />
      ))}
    </Stack>
  );
}

interface CardGridSkeletonProps {
  count: number;
  height?: number;
}

export function CardGridSkeleton({ count, height = 120 }: CardGridSkeletonProps) {
  return (
    <div
      role="status"
      aria-label="Načítání obsahu"
      className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4"
    >
      {Array.from({ length: count }, (_, index) => (
        <Skeleton key={index} variant="rounded" height={height} />
      ))}
    </div>
  );
}
