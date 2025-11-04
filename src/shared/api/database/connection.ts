import { createClient } from '@supabase/supabase-js';
import type { Database } from '@shared/types/database/schema.ts';

const url = import.meta.env.VITE_SUPABASE_URL as string;
const key = import.meta.env.VITE_SUPABASE_ANON_KEY as string;

if (!url || !key) {
  throw new Error('Missing Supabase environment variables');
}

export const supabase = createClient<Database>(url, key, {
  db: { schema: 'mru_dev' },
});
