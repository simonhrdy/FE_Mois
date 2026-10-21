import { defineConfig, globalIgnores } from 'eslint/config';
import nextVitals from 'eslint-config-next/core-web-vitals';
import nextTs from 'eslint-config-next/typescript';
import prettier from 'eslint-config-prettier/flat';

const eslintConfig = defineConfig([
  ...nextVitals,
  ...nextTs,
  prettier,
  {
    rules: {
      '@typescript-eslint/no-explicit-any': 'error',
      '@typescript-eslint/consistent-type-imports': ['error', { fixStyle: 'inline-type-imports' }],
      '@typescript-eslint/no-unused-vars': [
        'error',
        { argsIgnorePattern: '^_', varsIgnorePattern: '^_', ignoreRestSiblings: true },
      ],
      'no-console': ['warn', { allow: ['warn', 'error'] }],
      eqeqeq: ['error', 'always'],
      // Architecture guard: all HTTP traffic must go through the central API client.
      'no-restricted-globals': [
        'error',
        {
          name: 'fetch',
          message: 'Use a repository backed by @/lib/api/client instead of fetch().',
        },
      ],
    },
  },
  {
    // The API client is the only module allowed to perform raw HTTP requests.
    files: ['src/lib/api/client.ts', 'src/**/*.test.ts', 'src/**/*.test.tsx'],
    rules: { 'no-restricted-globals': 'off' },
  },
  {
    // Architecture guard: UI must not know how HTTP is implemented.
    files: ['src/components/**', 'src/features/*/components/**', 'src/app/**'],
    rules: {
      'no-restricted-imports': [
        'error',
        {
          patterns: [
            {
              group: ['@/lib/api/client', '@/features/*/repositories/*'],
              message: 'UI must use feature hooks/services, not the API client or repositories.',
            },
          ],
        },
      ],
    },
  },
  globalIgnores(['.next/**', 'out/**', 'build/**', 'coverage/**', 'next-env.d.ts']),
]);

export default eslintConfig;
