import InboxOutlined from '@mui/icons-material/InboxOutlined';
import type { ReactNode } from 'react';

import { FeedbackState, type FeedbackStateProps } from './FeedbackState';

type EmptyStateProps = Pick<FeedbackStateProps, 'title' | 'description' | 'action' | 'size'> & {
  icon?: ReactNode;
};

export function EmptyState({ icon = <InboxOutlined />, ...props }: EmptyStateProps) {
  return <FeedbackState icon={icon} tone="neutral" {...props} />;
}
