'use client';

import Button, { type ButtonProps } from '@mui/material/Button';
import NextLink from 'next/link';

type LinkButtonProps = Omit<ButtonProps<typeof NextLink>, 'component'>;

export function LinkButton(props: LinkButtonProps) {
  return <Button component={NextLink} {...props} />;
}
