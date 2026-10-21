import type { AuthUser, LoginInput, Session } from '../types/auth.types';

export interface AuthRepository {
  login(input: LoginInput): Promise<Session>;

  me(signal?: AbortSignal): Promise<AuthUser>;
}
