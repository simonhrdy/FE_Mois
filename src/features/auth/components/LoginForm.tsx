'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import Alert from '@mui/material/Alert';
import Button from '@mui/material/Button';
import CircularProgress from '@mui/material/CircularProgress';
import Stack from '@mui/material/Stack';
import { useForm } from 'react-hook-form';

import { FormTextField } from '@/components/ui/FormTextField';
import { applyApiErrorToForm } from '@/lib/utils/form-errors';

import { loginSchema } from '../schemas/auth.schema';
import type { LoginInput } from '../types/auth.types';

const FIELDS = ['email', 'password'] as const;

interface LoginFormProps {
  onSubmit: (values: LoginInput) => Promise<void>;

  demoCredentials?: LoginInput;
}

export function LoginForm({ onSubmit, demoCredentials }: LoginFormProps) {
  const {
    control,
    handleSubmit,
    setError,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<LoginInput>({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: '', password: '' },
    mode: 'onTouched',
  });

  const submit = handleSubmit(async (values) => {
    try {
      await onSubmit(values);
    } catch (error) {
      applyApiErrorToForm(error, FIELDS, setError);
    }
  });

  const serverError = errors.root?.serverError?.message;

  return (
    <form onSubmit={submit} noValidate aria-label="Přihlášení" aria-busy={isSubmitting}>
      <Stack spacing={2.5}>
        {serverError && (
          <Alert severity="error" role="alert">
            {serverError}
          </Alert>
        )}
        <FormTextField
          control={control}
          name="email"
          label="E-mail"
          type="email"
          autoComplete="username"
          required
        />
        <FormTextField
          control={control}
          name="password"
          label="Heslo"
          type="password"
          autoComplete="current-password"
          required
        />
        <Button
          type="submit"
          variant="contained"
          size="large"
          disabled={isSubmitting}
          startIcon={isSubmitting ? <CircularProgress size={16} color="inherit" /> : undefined}
        >
          {isSubmitting ? 'Přihlašování…' : 'Přihlásit se'}
        </Button>
        {demoCredentials && (
          <Button variant="text" disabled={isSubmitting} onClick={() => reset(demoCredentials)}>
            Vyplnit demo účet (Bella Pizza)
          </Button>
        )}
      </Stack>
    </form>
  );
}
