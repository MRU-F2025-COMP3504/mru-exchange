import type { Result } from '@shared/types';

export function ok<T, E>(data: T): Result<T, E> {
  return { ok: true, data };
}

export function err<T, E>(error: E): Result<T, E> {
  return { ok: false, error };
}

export function present<T>(data: T | null | undefined): Result<T, Error> {
  if (data) {
    return ok(data);
  }

  return err(new Error('Specified data is not present'));
}