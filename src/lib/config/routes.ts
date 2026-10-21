export const routes = {
  home: '/',
  login: '/login',
  loginWithReturn: (returnPath: string) => `/login?next=${encodeURIComponent(returnPath)}`,
  dashboard: '/dashboard',
  reviews: '/reviews',
  competitors: '/competitors',
  watchedCompetitors: '/competitors/watched',
  business: (id: string) => `/businesses/${encodeURIComponent(id)}`,
  analytics: '/analytics',
  assistant: '/assistant',
  assistantWithPrompt: (prompt: string) => `/assistant?q=${encodeURIComponent(prompt)}`,
  settings: '/settings',
} as const;
