import type { Result } from '@shared/types';

export function ok<T, E extends Error>(data: T): Result<T, E> {
  return { ok: true, data };
}

export function err<T, E extends Error>(error: E | string): Result<T, E> {
  if (typeof error === 'string') {
    return { ok: false, error: new Error(error) as E };
  }

  return { ok: false, error }
}

export function empty<T, E extends Error>(): Result<T, E> {
  return { ok: false, error: new Error() as E }
}

export function present<T>(data: T | null | undefined): Result<T> {
  if (data) {
    return ok(data);
  }

  return err('Specified data is not present');
}