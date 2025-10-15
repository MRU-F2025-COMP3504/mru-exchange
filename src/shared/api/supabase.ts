import { createClient } from '@supabase/supabase-js';
import type { Database } from '@shared/types/database.types.ts';

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseAnonKey = process.env.SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables');
}

export const supabase = createClient<Database>(supabaseUrl, supabaseAnonKey, {
  db: {
    schema: 'mru_dev', // Use mru_dev schema instead of public
  },
});
