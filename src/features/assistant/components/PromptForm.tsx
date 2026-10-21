'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import Send from '@mui/icons-material/Send';
import CircularProgress from '@mui/material/CircularProgress';
import IconButton from '@mui/material/IconButton';
import { useForm } from 'react-hook-form';
import type { z } from 'zod';

import { FormTextField } from '@/components/ui/FormTextField';

import { promptSchema } from '../schemas/assistant.schema';

type PromptValues = z.infer<typeof promptSchema>;

interface PromptFormProps {
  onSubmit: (prompt: string) => Promise<void>;

  pending?: boolean;
}

export function PromptForm({ onSubmit, pending = false }: PromptFormProps) {
  const {
    control,
    handleSubmit,
    reset,
    formState: { isSubmitting },
  } = useForm<PromptValues>({
    resolver: zodResolver(promptSchema),
    defaultValues: { prompt: '' },
  });

  const busy = pending || isSubmitting;
  const submit = handleSubmit(async ({ prompt }) => {
    reset({ prompt: '' });
    await onSubmit(prompt);
  });

  return (
    <form
      onSubmit={submit}
      noValidate
      aria-label="Dotaz pro AI asistenta"
      className="flex flex-col gap-2"
    >
      <div className="flex items-start gap-2">
        <FormTextField
          control={control}
          name="prompt"
          label="Zeptejte se na svůj podnik…"
          sx={{ '& .MuiOutlinedInput-root': { borderRadius: 4 } }}
          multiline
          maxRows={4}
          disabled={busy}
          onKeyDown={(event) => {
            if (event.key === 'Enter' && !event.shiftKey) {
              event.preventDefault();
              void submit();
            }
          }}
        />
        <IconButton
          type="submit"
          aria-label="Odeslat dotaz"
          disabled={busy}
          sx={{
            mt: 0.5,
            width: 48,
            height: 48,
            color: 'primary.contrastText',
            bgcolor: 'primary.main',
            '&:hover': { bgcolor: 'primary.dark' },
          }}
        >
          {busy ? <CircularProgress size={22} /> : <Send />}
        </IconButton>
      </div>
    </form>
  );
}
