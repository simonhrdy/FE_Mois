import type { z } from 'zod';

import type { authUserSchema, loginSchema, sessionSchema } from '../schemas/auth.schema';

export type LoginInput = z.infer<typeof loginSchema>;
export type AuthUser = z.infer<typeof authUserSchema>;
export type Session = z.infer<typeof sessionSchema>;
