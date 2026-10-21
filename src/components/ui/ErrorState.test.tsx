import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';

import { ApiError } from '@/lib/api/errors';
import { renderWithProviders } from '@/test/render';

import { EmptyState } from './EmptyState';
import { ErrorState } from './ErrorState';

describe('ErrorState', () => {
  it('shows a friendly message as an alert and never the technical details', () => {
    renderWithProviders(<ErrorState error={new ApiError('server', 'SQLException: table users')} />);

    const alert = screen.getByRole('alert');
    expect(alert).toHaveTextContent('Data se nepodařilo načíst');
    expect(alert).toHaveTextContent(/na serveru došlo k chybě/i);
    expect(alert).not.toHaveTextContent('SQLException');
  });

  it('calls onRetry when the retry button is pressed', async () => {
    const onRetry = vi.fn();
    renderWithProviders(<ErrorState error={new Error('x')} onRetry={onRetry} />);

    await userEvent.click(screen.getByRole('button', { name: /zkusit znovu/i }));
    expect(onRetry).toHaveBeenCalledOnce();
  });
});

describe('EmptyState', () => {
  it('renders title, description and action', () => {
    renderWithProviders(
      <EmptyState title="No projects" description="Create one" action={<button>Create</button>} />,
    );

    expect(screen.getByRole('status')).toHaveTextContent('No projects');
    expect(screen.getByText('Create one')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Create' })).toBeInTheDocument();
  });
});
