import { describe, expect, it, vi } from 'vitest';
import { mockQuery } from '@shared/tests';
import { UserInteractionAPI } from '@features/interact';

describe('User Interaction', () => {
  it('returns users interacting', async () => {
    mockQuery({
      select: vi.fn().mockReturnValue({
        or: vi.fn().mockReturnValue({
          single: vi.fn().mockResolvedValue({ data: {}, error: null }),
        }),
      }),
    });

    const userA = { supabase_id: 'abc123' };
    const userB = { supabase_id: '123zxcv' };
    const query = UserInteractionAPI.get(userA, userB);
    const result = await query;

    expect(result.ok, 'get() failed').toBe(true);
  });

  it('returns blocked users', async () => {
    mockQuery({
      select: vi.fn().mockReturnValue({
        or: vi.fn().mockReturnValue({
          or: vi.fn().mockResolvedValue({ data: new Array<object>(), error: null }),
        }),
      }),
    });

    const user = { supabase_id: 'abc123' };
    const query = UserInteractionAPI.getBlockedOnUser(user);
    const result = await query;

    expect(result.ok, 'getBlockedOnUser() failed').toBe(true);
  });

  it('returns muted users', async () => {
    mockQuery({
      select: vi.fn().mockReturnValue({
        or: vi.fn().mockReturnValue({
          or: vi.fn().mockResolvedValue({ data: new Array<object>(), error: null }),
        }),
      }),
    });

    const user = { supabase_id: 'abc123' };
    const query = UserInteractionAPI.getMutedOnUser(user);
    const result = await query;

    expect(result.ok, 'getMutedOnUser() failed').toBe(true);
  });

  it('establishes user interaction', async () => {
    mockQuery({
      insert: vi.fn().mockReturnValue({
        select: vi.fn().mockReturnValue({
          single: vi.fn().mockResolvedValue({ data: { id: 0 }, error: null }),
        }),
      }),
    });

    const userA = { supabase_id: 'abc123' };
    const userB = { supabase_id: '123zxcv' };
    const query = UserInteractionAPI.create(userA, userB);
    const result = await query;

    expect(result.ok, 'create() failed').toBe(true);
  });

  it('blocks user', async () => {
    mockQuery({
      select: vi.fn().mockReturnValue({
        or: vi.fn().mockReturnValue({
          single: vi.fn().mockResolvedValue({ data: { id: 0 }, error: null }),
        }),
      }),
      update: vi.fn().mockReturnValue({
        eq: vi.fn().mockReturnValue({
          select: vi.fn().mockReturnValue({
            single: vi.fn().mockResolvedValue({ data: { id: 0 }, error: null }),
          }),
        }),
      }),
    });

    const blocker = { supabase_id: 'abc123' };
    const target = { supabase_id: '123zxcv' };
    const query = UserInteractionAPI.block(blocker, target);
    const result = await query;

    expect(result.ok, 'block() failed').toBe(true);
  });

  it('mutes user', async () => {
    mockQuery({
      select: vi.fn().mockReturnValue({
        or: vi.fn().mockReturnValue({
          single: vi.fn().mockResolvedValue({ data: { id: 0 }, error: null }),
        }),
      }),
      update: vi.fn().mockReturnValue({
        eq: vi.fn().mockReturnValue({
          select: vi.fn().mockReturnValue({
            single: vi.fn().mockResolvedValue({ data: { id: 0 }, error: null }),
          }),
        }),
      }),
    });

    const muter = { supabase_id: 'abc123' };
    const target = { supabase_id: '123zxcv' };
    const query = UserInteractionAPI.mute(muter, target);
    const result = await query;

    expect(result.ok, 'mute() failed').toBe(true);
  });
});