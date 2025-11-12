import { describe, expect, it, vi } from 'vitest';
import { mockChannel, mockQuery } from '@shared/tests';
import { ChatAPI } from '@features/messaging';

describe('User Chat', () => {
  it('subscribe to chat', () => {
    mockChannel({
      on: vi.fn().mockReturnValue({
        subscribe: vi.fn(),
      }),
    });

    const user = { supabase_id: 'abc123' };
    let success = false;

    try {
      ChatAPI.subscribe(user, (_) => { /* empty */ });

      success = true;
    } catch (error: unknown) {
      console.error(error);
    }

    expect(success, 'subscribe() failed').toBe(true);
  });

  it('returns a user chat', async () => {
    mockQuery({
      select: vi.fn().mockReturnValue({
        eq: vi.fn().mockReturnValue({
          single: vi.fn().mockReturnValue({ data: { id: 0 }, error: null }),
        }),
      }),
    });

    const chat = { id: 0 };
    const query = ChatAPI.get(chat);
    const result = await query;

    expect(result.ok, 'get() failed').toBe(true);
  });

  it('returns a user chat by the given user', async () => {
    mockQuery({
      select: vi.fn().mockReturnValue({
        or: vi.fn().mockReturnValue({
          order: vi.fn().mockReturnValue({ data: new Array<object>(), error: null }),
        }),
      }),
    });

    const user = { supabase_id: 'abc123' };
    const query = ChatAPI.getByUser(user);
    const result = await query;

    expect(result.ok, 'getByUser() failed').toBe(true);
  });

  it('sets/changes the visibility of user chats', async () => {
    mockQuery({
      update: vi.fn().mockReturnValue({
        in: vi.fn().mockReturnValue({
          select: vi.fn().mockReturnValue({ data: new Array<object>(), error: null }),
        }),
      }),
    });

    const visible = false;
    const chats = [{ id: 0 }, { id: 1 }, { id: 2 }];
    const query = ChatAPI.show(visible, ...chats);
    const result = await query;

    expect(result.ok, 'show() failed').toBe(true);
  });

  it('creates a new user chat', async () => {
    mockQuery({
      insert: vi.fn().mockReturnValue({
        select: vi.fn().mockReturnValue({
          single: vi.fn().mockReturnValue({ data: { id: 0 }, error: null }),
        }),
      }),
    });

    const userA = { supabase_id: 'abc123' };
    const userB = { supabase_id: '123zxcv' };
    const query = ChatAPI.create(userA, userB);
    const result = await query;

    expect(result.ok, 'create() failed').toBe(true);
  });
});