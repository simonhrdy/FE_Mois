import { cva, type VariantProps } from 'class-variance-authority';
import type { ComponentProps } from 'react';

import { cn } from '@/lib/utils/cn';

const pageContainerVariants = cva('mx-auto flex w-full flex-col', {
  variants: {
    width: {
      narrow: 'max-w-3xl',
      default: 'max-w-7xl',
      full: 'max-w-none',
    },
    spacing: {
      compact: 'gap-4',
      default: 'gap-6',
    },
  },
  defaultVariants: { width: 'default', spacing: 'default' },
});

type PageContainerProps = ComponentProps<'div'> & VariantProps<typeof pageContainerVariants>;

export function PageContainer({ width, spacing, className, ...props }: PageContainerProps) {
  return <div className={cn(pageContainerVariants({ width, spacing }), className)} {...props} />;
}
