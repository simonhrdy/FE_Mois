const TOKEN_KEY = 'ms.auth.token';

export const sessionStorageAdapter = {
  getToken(): string | null {
    try {
      return globalThis.localStorage?.getItem(TOKEN_KEY) ?? null;
    } catch {
      return null;
    }
  },
  setToken(token: string): void {
    try {
      globalThis.localStorage?.setItem(TOKEN_KEY, token);
    } catch {
      return;
    }
  },
  clear(): void {
    try {
      globalThis.localStorage?.removeItem(TOKEN_KEY);
    } catch {
      return;
    }
  },
};
