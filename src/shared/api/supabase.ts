import { createClient } from '@supabase/supabase-js';
import type { Database } from '@shared/types/database.types.ts';

const url = process.env.SUPABASE_URL;
const key = process.env.SUPABASE_ANON_KEY;

if (!url || !key) {
  throw new Error('Missing Supabase environment variables');
}

export default createClient<Database>(url, key, {
  db: {
    schema: 'mru_dev', // Use mru_dev schema instead of public
  },
});
