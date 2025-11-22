import { describe, expect, it, vi } from 'vitest';
import { mockChannel, mockQuery } from '@shared/tests';
import { UserChatting, UserMessaging } from '@features/messaging';

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
      UserChatting.subscribe(user, (_) => {
        /* empty */
      });

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
    const query = UserChatting.get(chat);
    const result = await query;

    expect(result.ok, 'get() failed').toBe(true);
  });

  it('returns a user chat by the given user', async () => {
    mockQuery({
      select: vi.fn().mockReturnValue({
        or: vi.fn().mockReturnValue({
          order: vi
            .fn()
            .mockReturnValue({ data: new Array<object>(), error: null }),
        }),
      }),
    });

    const user = { supabase_id: 'abc123' };
    const query = UserChatting.getByUser(user);
    const result = await query;

    expect(result.ok, 'getByUser() failed').toBe(true);
  });

  it('sets/changes the visibility of user chats', async () => {
    mockQuery({
      update: vi.fn().mockReturnValue({
        in: vi.fn().mockReturnValue({
          select: vi
            .fn()
            .mockReturnValue({ data: new Array<object>(), error: null }),
        }),
      }),
    });

    const visible = false;
    const chats = [{ id: 0 }, { id: 1 }, { id: 2 }];
    const query = UserChatting.show(visible, chats);
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
    const query = UserChatting.register(userA, userB);
    const result = await query;

    expect(result.ok, 'create() failed').toBe(true);
  });
});

describe('User Messaging', () => {
  it('subscribe to chat messages', () => {
    mockChannel({
      on: vi.fn().mockReturnValue({
        subscribe: vi.fn(),
      }),
    });

    const chat = { id: 0 };
    let success = false;

    try {
      UserMessaging.subscribe(chat, (_) => {
        /* empty */
      });

      success = true;
    } catch (error: unknown) {
      console.error(error);
    }

    expect(success, 'subscribe() failed').toBe(true);
  });

  it('returns user messages from a user chat', async () => {
    mockQuery({
      select: vi.fn().mockReturnValue({
        eq: vi.fn().mockReturnValue({
          eq: vi.fn().mockReturnValue({
            order: vi
              .fn()
              .mockReturnValue({ data: new Array<object>(), error: null }),
          }),
        }),
      }),
    });

    const chat = { id: 0 };
    const query = UserMessaging.getByChat(chat);
    const result = await query;

    expect(result.ok, 'getByChat() failed').toBe(true);
  });

  it('sends a user message', async () => {
    mockQuery({
      insert: vi.fn().mockReturnValue({
        select: vi.fn().mockReturnValue({
          single: vi.fn().mockReturnValue({ data: { id: 0 }, error: null }),
        }),
      }),
    });

    const chat = { id: 0 };
    const user = { supabase_id: 'abc123' };
    const message = 'this is a message';
    const query = UserMessaging.send(chat, user, message);
    const result = await query;

    expect(result.ok, 'send() failed').toBe(true);
  });

  it('sets/changes the visibility of user messages', async () => {
    mockQuery({
      update: vi.fn().mockReturnValue({
        eq: vi.fn().mockReturnValue({
          eq: vi.fn().mockReturnValue({
            in: vi.fn().mockReturnValue({
              select: vi
                .fn()
                .mockReturnValue({ data: new Array<object>(), error: null }),
            }),
          }),
        }),
      }),
    });

    const chat = { id: 0 };
    const user = { supabase_id: 'abc123' };
    const visible = false;
    const messages = [{ id: 0 }, { id: 1 }, { id: 2 }];
    const query = UserMessaging.show(chat, user, visible, messages);
    const result = await query;

    expect(result.ok, 'show() failed').toBe(true);
  });

  it('removes user messages', async () => {
    mockQuery({
      delete: vi.fn().mockReturnValue({
        eq: vi.fn().mockReturnValue({
          eq: vi.fn().mockReturnValue({
            in: vi.fn().mockReturnValue({
              select: vi
                .fn()
                .mockReturnValue({ data: new Array<object>(), error: null }),
            }),
          }),
        }),
      }),
    });

    const chat = { id: 0 };
    const user = { supabase_id: 'abc123' };
    const messages = [{ id: 0 }, { id: 1 }, { id: 2 }];
    const query = UserMessaging.remove(chat, user, messages);
    const result = await query;

    expect(result.ok, 'remove() failed').toBe(true);
  });
});
