import type { Result } from '@shared/types';

export function ok<T, E>(data: T): Result<T, E> {
  return { ok: true, data };
}

export function err<T, E>(error: E): Result<T, E> {
  return { ok: false, error };
}
