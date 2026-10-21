import type { FieldValues, Path, UseFormSetError } from 'react-hook-form';

import { getErrorMessage, isApiError } from '@/lib/api/errors';

export const ROOT_SERVER_ERROR = 'root.serverError';

export function applyApiErrorToForm<TValues extends FieldValues>(
  error: unknown,
  fields: readonly Path<TValues>[],
  setError: UseFormSetError<TValues>,
): void {
  if (isApiError(error)) {
    for (const field of fields) {
      const [message] = error.fieldErrors[field] ?? [];
      if (message) setError(field, { type: 'server', message });
    }
  }
  setError(ROOT_SERVER_ERROR, { type: 'server', message: getErrorMessage(error) });
}
