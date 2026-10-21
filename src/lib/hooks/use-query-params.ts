'use client';

import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { useCallback, useMemo } from 'react';
import type { z } from 'zod';

type ParamValue = string | number | undefined;

export function useQueryParams<TSchema extends z.ZodType<object>>(
  schema: TSchema,
  defaults: Record<string, string> = {},
) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const params: z.output<TSchema> = useMemo(
    () => schema.parse(Object.fromEntries(searchParams.entries())),
    [schema, searchParams],
  );

  const update = useCallback(
    (changes: Record<string, ParamValue>) => {
      const next = new URLSearchParams(searchParams);
      for (const [key, value] of Object.entries(changes)) {
        const text = value === undefined ? '' : String(value);
        if (text === '' || defaults[key] === text) next.delete(key);
        else next.set(key, text);
      }
      const query = next.toString();
      router.replace(query ? `${pathname}?${query}` : pathname, { scroll: false });
    },
    [defaults, pathname, router, searchParams],
  );

  return { params, update };
}
