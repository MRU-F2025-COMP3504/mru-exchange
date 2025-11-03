import { describe, it, expect } from 'vitest';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.VITE_SUPABASE_URL!,
  process.env.VITE_SUPABASE_SERVICE_ROLE_KEY!
);

describe('Database Trigger Tests', () => {
  it('should create user_information row when new auth user is inserted', async () => {
    const userId = crypto.randomUUID();

    // Insert a mock user into auth.users (only service key can do this)
    const { error: insertError } = await supabase.from('auth.users').insert({
      id: userId,
      email: `test_${userId}@mtroyal.ca`,
    });
    expect(insertError).toBeNull();

    // Wait for the trigger to fire
    await new Promise((r) => setTimeout(r, 1000));

    // Check that user_information got populated
    const { data, error } = await supabase
      .from('User_Information')
      .select('*')
      .eq('user_id', userId);

    expect(error).toBeNull();
    expect(data?.length).toBe(1);
    expect(data?.[0].email).toBe(`test_${userId}@mtroyal.ca`);
  });
});
