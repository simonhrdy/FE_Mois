import Typography from '@mui/material/Typography';
import { cva, type VariantProps } from 'class-variance-authority';
import type { ReactNode } from 'react';

import { cn } from '@/lib/utils/cn';

const feedbackStateVariants = cva('flex flex-col items-center justify-center text-center', {
  variants: {
    size: {
      compact: 'gap-2 px-4 py-8',
      default: 'gap-3 px-6 py-16',
    },
  },
  defaultVariants: { size: 'default' },
});

const iconVariants = cva('flex items-center justify-center rounded-full [&>svg]:text-4xl', {
  variants: {
    tone: {
      neutral: 'bg-muted/10 text-muted',
      error: 'bg-error/10 text-error',
    },
    size: {
      compact: 'size-14',
      default: 'size-20',
    },
  },
  defaultVariants: { tone: 'neutral', size: 'default' },
});

export type FeedbackStateProps = VariantProps<typeof feedbackStateVariants> &
  VariantProps<typeof iconVariants> & {
    icon: ReactNode;
    title: string;
    description?: string;
    action?: ReactNode;
    role?: 'status' | 'alert';
    className?: string;
  };

export function FeedbackState({
  icon,
  title,
  description,
  action,
  tone,
  size,
  role = 'status',
  className,
}: FeedbackStateProps) {
  return (
    <div role={role} className={cn(feedbackStateVariants({ size }), className)}>
      <div className={iconVariants({ tone, size })} aria-hidden>
        {icon}
      </div>
      <Typography variant="h6" component="p">
        {title}
      </Typography>
      {description && (
        <Typography variant="body2" color="text.secondary" className="max-w-md">
          {description}
        </Typography>
      )}
      {action && <div className="mt-2">{action}</div>}
    </div>
  );
}
