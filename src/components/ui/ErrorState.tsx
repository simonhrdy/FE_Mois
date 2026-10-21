import ErrorOutlined from '@mui/icons-material/ErrorOutlined';
import Refresh from '@mui/icons-material/Refresh';
import Button from '@mui/material/Button';

import { getErrorMessage } from '@/lib/api/errors';

import { FeedbackState, type FeedbackStateProps } from './FeedbackState';

interface ErrorStateProps extends Pick<FeedbackStateProps, 'size'> {
  error: unknown;
  title?: string;
  onRetry?: () => void;
}

export function ErrorState({
  error,
  title = 'Data se nepodařilo načíst',
  onRetry,
  size,
}: ErrorStateProps) {
  return (
    <FeedbackState
      role="alert"
      tone="error"
      size={size}
      icon={<ErrorOutlined />}
      title={title}
      description={getErrorMessage(error)}
      action={
        onRetry && (
          <Button variant="outlined" startIcon={<Refresh />} onClick={onRetry}>
            Zkusit znovu
          </Button>
        )
      }
    />
  );
}
