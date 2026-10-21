'use client';

import TextField, { type TextFieldProps } from '@mui/material/TextField';
import { useController, type Control, type FieldPath, type FieldValues } from 'react-hook-form';

type FormTextFieldProps<TValues extends FieldValues> = Omit<
  TextFieldProps,
  'name' | 'value' | 'onChange' | 'onBlur' | 'error' | 'inputRef'
> & {
  name: FieldPath<TValues>;
  control: Control<TValues>;
};

export function FormTextField<TValues extends FieldValues>({
  name,
  control,
  helperText,
  ...props
}: FormTextFieldProps<TValues>) {
  const { field, fieldState } = useController({ name, control });

  return (
    <TextField
      {...props}
      name={field.name}
      value={field.value ?? ''}
      onChange={field.onChange}
      onBlur={field.onBlur}
      inputRef={field.ref}
      error={Boolean(fieldState.error)}
      helperText={fieldState.error?.message ?? helperText}
    />
  );
}
