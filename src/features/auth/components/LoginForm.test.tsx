import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';

import { ApiError } from '@/lib/api/errors';
import { renderWithProviders } from '@/test/render';

import { LoginForm } from './LoginForm';

const emailInput = () => screen.getByRole('textbox', { name: /e-mail/i });
const passwordInput = () => screen.getByLabelText(/heslo/i);

describe('LoginForm', () => {
  it('shows accessible Zod validation errors', async () => {
    const onSubmit = vi.fn();
    renderWithProviders(<LoginForm onSubmit={onSubmit} />);

    await userEvent.click(screen.getByRole('button', { name: 'Přihlásit se' }));

    expect(emailInput()).toHaveAccessibleDescription('Zadejte platný e-mail');
    expect(passwordInput()).toHaveAttribute('aria-invalid', 'true');
    expect(onSubmit).not.toHaveBeenCalled();
  });

  it('submits valid credentials', async () => {
    const onSubmit = vi.fn().mockResolvedValue(undefined);
    renderWithProviders(<LoginForm onSubmit={onSubmit} />);

    await userEvent.type(emailInput(), 'owner@test.dev');
    await userEvent.type(passwordInput(), 'password123');
    await userEvent.click(screen.getByRole('button', { name: 'Přihlásit se' }));

    expect(onSubmit).toHaveBeenCalledWith({ email: 'owner@test.dev', password: 'password123' });
  });

  it('fills the demo account in mock mode', async () => {
    const demo = { email: 'demo@test.dev', password: 'demo-password' };
    renderWithProviders(<LoginForm onSubmit={vi.fn()} demoCredentials={demo} />);

    await userEvent.click(screen.getByRole('button', { name: /demo účet/i }));

    expect(emailInput()).toHaveValue(demo.email);
  });

  it('shows a friendly message for wrong credentials', async () => {
    const onSubmit = vi
      .fn()
      .mockRejectedValue(new ApiError('unauthorized', 'Invalid', { status: 401 }));
    renderWithProviders(<LoginForm onSubmit={onSubmit} />);

    await userEvent.type(emailInput(), 'owner@test.dev');
    await userEvent.type(passwordInput(), 'password123');
    await userEvent.click(screen.getByRole('button', { name: 'Přihlásit se' }));

    expect(await screen.findByRole('alert')).toHaveTextContent(/přihlaste se prosím znovu/i);
  });
});
