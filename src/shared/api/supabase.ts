import { createClient } from '@supabase/supabase-js';
import type { Database } from '@shared/types/database.ts';

const url = import.meta.env.VITE_SUPABASE_URL;
const key = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!url || !key) {
  throw new Error('Missing Supabase environment variables');
}

export const supabase = createClient<Database>(url, key);
