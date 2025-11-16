import { vi } from 'vitest';
import { supabase } from '@shared/api';

vi.mock('@shared/api/database/connection');

export function mockQuery(value: unknown) {
  vi.spyOn(supabase, 'from').mockReturnValue(value as never);
}

export function mockChannel(value: unknown) {
  vi.spyOn(supabase, 'channel').mockReturnValue(value as never);
}
