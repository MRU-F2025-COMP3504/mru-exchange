export * from '@shared/types/database.types';
export type Result<T, E> = { ok: true; data: T } | { ok: false; error: E };
