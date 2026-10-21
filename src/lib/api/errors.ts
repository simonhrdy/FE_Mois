import { ConfigurationError } from '@/lib/config/env';
import type { ApiErrorBody } from '@/types/api';

export const HTTP_STATUS = {
  NO_CONTENT: 204,
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  CONFLICT: 409,
  UNPROCESSABLE_ENTITY: 422,
  TOO_MANY_REQUESTS: 429,
  INTERNAL_SERVER_ERROR: 500,
} as const;

export type ApiErrorKind =
  | 'bad_request'
  | 'unauthorized'
  | 'forbidden'
  | 'not_found'
  | 'conflict'
  | 'validation'
  | 'rate_limited'
  | 'server'
  | 'network'
  | 'invalid_response'
  | 'unknown';

export type FieldErrors = Record<string, string[]>;

interface ApiErrorOptions {
  status?: number;
  fieldErrors?: FieldErrors;
  cause?: unknown;
}

export class ApiError extends Error {
  override readonly name = 'ApiError';
  readonly kind: ApiErrorKind;
  readonly status: number | undefined;
  readonly fieldErrors: FieldErrors;

  constructor(kind: ApiErrorKind, message: string, options: ApiErrorOptions = {}) {
    super(message, { cause: options.cause });
    this.kind = kind;
    this.status = options.status;
    this.fieldErrors = options.fieldErrors ?? {};
  }

  static fromResponse(status: number, body: ApiErrorBody | undefined): ApiError {
    return new ApiError(
      kindFromStatus(status),
      body?.message ?? `Request failed with status ${status}`,
      { status, fieldErrors: body?.errors },
    );
  }
}

export function kindFromStatus(status: number): ApiErrorKind {
  switch (status) {
    case HTTP_STATUS.BAD_REQUEST:
      return 'bad_request';
    case HTTP_STATUS.UNAUTHORIZED:
      return 'unauthorized';
    case HTTP_STATUS.FORBIDDEN:
      return 'forbidden';
    case HTTP_STATUS.NOT_FOUND:
      return 'not_found';
    case HTTP_STATUS.CONFLICT:
      return 'conflict';
    case HTTP_STATUS.UNPROCESSABLE_ENTITY:
      return 'validation';
    case HTTP_STATUS.TOO_MANY_REQUESTS:
      return 'rate_limited';
    default:
      return status >= HTTP_STATUS.INTERNAL_SERVER_ERROR ? 'server' : 'unknown';
  }
}

const USER_MESSAGES: Record<ApiErrorKind, string> = {
  bad_request: 'Požadavek nelze zpracovat. Zkontrolujte zadané údaje.',
  unauthorized: 'Přihlášení vypršelo nebo údaje nejsou správné. Přihlaste se prosím znovu.',
  forbidden: 'K této akci nemáte oprávnění.',
  not_found: 'Požadovaný záznam nebyl nalezen.',
  conflict: 'Změna je v konfliktu s existujícími daty.',
  validation: 'Některá pole nejsou vyplněna správně.',
  rate_limited: 'Příliš mnoho požadavků. Zkuste to prosím za chvíli.',
  server: 'Na serveru došlo k chybě. Zkuste to prosím později.',
  network: 'Nelze se spojit se serverem. Zkontrolujte připojení.',
  invalid_response: 'Server vrátil neočekávanou odpověď. Zkuste to prosím později.',
  unknown: 'Něco se nepovedlo. Zkuste to prosím znovu.',
};

export const CONFIGURATION_ERROR_MESSAGE = 'Aplikace nemá nastavené připojení k backendu (API).';

export function getErrorMessage(error: unknown): string {
  if (error instanceof ApiError) return USER_MESSAGES[error.kind];
  if (error instanceof ConfigurationError) return CONFIGURATION_ERROR_MESSAGE;
  return USER_MESSAGES.unknown;
}

export function isApiError(error: unknown, kind?: ApiErrorKind): error is ApiError {
  return error instanceof ApiError && (kind === undefined || error.kind === kind);
}

export function isAbortError(error: unknown): boolean {
  return error instanceof DOMException && error.name === 'AbortError';
}
