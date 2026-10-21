'use client';

import { useCountUp } from '@/lib/hooks/use-count-up';

interface CountUpProps {
  value: number;
  format: (value: number) => string;
}

export function CountUp({ value, format }: CountUpProps) {
  const animated = useCountUp(value);
  return (
    <>
      <span aria-hidden>{format(animated)}</span>
      <span className="sr-only">{format(value)}</span>
    </>
  );
}
