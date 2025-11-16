import type { Database } from '@shared/types';
import { createClient } from '@supabase/supabase-js';

const url = import.meta.env.VITE_SUPABASE_URL as string;
const key = import.meta.env.VITE_SUPABASE_ANON_KEY as string;
if (!url || !key) {
  throw new Error('Missing Supabase environment variables');
}

/**
 * References the Supabase client.
 *
 * @see {@link https://supabase.com/docs/reference/javascript/introduction} for more information
 */
export const supabase = createClient<Database>(url, key, {
  db: { schema: 'mru_dev' },
});
