export type AsyncState<T> =
  { status: 'loading' } | { status: 'success'; data: T } | { status: 'error'; error: unknown };

export type Severity = 'success' | 'info' | 'warning' | 'error';
