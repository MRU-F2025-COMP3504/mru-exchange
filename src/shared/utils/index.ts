import { Result } from '@shared/types';

export enum SortingOrder {
  NATURAL,
  ASCENDING,
  DESCENDING,
}

export function ok<T>(data: T): Result<T> {
  return { ok: true, data };
}

export function err<T>(error: string): Result<T> {
  return { ok: false, error };
}
