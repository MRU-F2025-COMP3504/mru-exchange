import type {
  UserChat,
  DatabaseQuery,
  RequiredColumns,
  UserMessage,
  UserProfile,
} from '@shared/types';
import { query, supabase } from '@shared/api';
import {
  REALTIME_LISTEN_TYPES,
  type RealtimeChannel,
  type RealtimePostgresInsertPayload,
} from '@supabase/supabase-js';

interface UserChatting {
  /**
   * Subscribes to the user's chat.
   *
   * @param user the given user's identifier
   * @param callback the callback function to handle chat information
   * @returns the established channel
   */
  subscribe: (
    user: RequiredColumns<UserProfile, 'supabase_id'>,
    callback: (payload: RealtimePostgresInsertPayload<UserChat>) => void,
  ) => RealtimeChannel;

  /**
   * Retrieves the given chat by its identifier.
   *
   * @param chat the given chat identifier
   * @returns a promise that resolves to the corresponding chat
   */
  get: (chat: RequiredColumns<UserChat, 'id'>) => DatabaseQuery<UserChat, '*'>;

  /**
   * Retrieves chat that involves the given user.
   *
   * @param user the given user's identifier
   * @returns a promise that resolves to the corresponding chat
   */
  getByUser: (
    user: RequiredColumns<UserProfile, 'supabase_id'>,
  ) => DatabaseQuery<UserChat[], '*'>;

  /**
   * Modifies the visibility of the given chat.
   *
   * @param visible the visibility flag
   * @param chats the given chat identifier(s)
   * @returns a promise that resolves to the corresponding chat(s)
   */
  show: (
    visible: boolean,
    chats: RequiredColumns<UserChat, 'id'>[],
  ) => DatabaseQuery<UserChat[], 'id'>;

  /**
   * Establishes chat connection between two users.
   * Only one connection per two given users are allowed.
   *
   * @param a a user's identifier
   * @param b a user's identifier
   * @returns a promise that resolves to chat registration
   */
  register: (
    a: RequiredColumns<UserProfile, 'supabase_id'>,
    b: RequiredColumns<UserProfile, 'supabase_id'>,
  ) => DatabaseQuery<UserChat, 'id'>;
}

export const UserChatting: UserChatting = {
  subscribe: (
    user: RequiredColumns<UserProfile, 'supabase_id'>,
    callback: (payload: RealtimePostgresInsertPayload<UserChat>) => void,
  ): RealtimeChannel => {
    const id = user.supabase_id;
    return supabase
      .channel(`user-chat-${id}`)
      .on(
        REALTIME_LISTEN_TYPES.POSTGRES_CHANGES,
        {
          event: 'INSERT',
          schema: 'mru_dev',
          table: 'Chats',
          filter: `user_id_1=eq.${id}&user_id_2=eq.${id}`,
        },
        callback,
      )
      .subscribe();
  },
  get: async (
    chat: RequiredColumns<UserChat, 'id'>,
  ): DatabaseQuery<UserChat, '*'> => {
    return query(
      await supabase.from('Chats').select('*').eq('id', chat.id).single(),
    );
  },
  getByUser: async (
    user: RequiredColumns<UserProfile, 'supabase_id'>,
  ): DatabaseQuery<UserChat[], '*'> => {
    const id = user.supabase_id;
    return query(
      await supabase
        .from('Chats')
        .select('*')
        .or(`user_id_1.eq.${id},user_id_2.eq.${id}`)
        .order('created_at', { ascending: false }),
    );
  },
  show: async (
    visible: boolean,
    chats: RequiredColumns<UserChat, 'id'>[],
  ): DatabaseQuery<UserChat[], 'id'> => {
    return query(
      await supabase
        .from('Chats')
        .update({ visible })
        .in(
          'id',
          chats.map((chat) => chat.id),
        )
        .select('id'),
    );
  },
  register: async (
    a: RequiredColumns<UserProfile, 'supabase_id'>,
    b: RequiredColumns<UserProfile, 'supabase_id'>,
  ): DatabaseQuery<UserChat, 'id'> => {
    return query(
      await supabase
        .from('Chats')
        .insert({
          user_id_1: a.supabase_id,
          user_id_2: b.supabase_id,
        })
        .select()
        .single(),
    );
  },
};

interface UserMessaging {
  /**
   * Subscribes to user messages by the given chat.
   *
   * @param chat the given chat identifier
   * @param callback the callback function to handle incoming user messages
   */
  subscribe: (
    chat: RequiredColumns<UserChat, 'id'>,
    callback: (payload: RealtimePostgresInsertPayload<UserMessage>) => void,
  ) => RealtimeChannel;

  /**
   * Retrieves user messages from the given chat.
   *
   * @param chat the given chat identifier
   * @returns a promise that resolves to the corresponding user messages
   */
  getByChat: (
    chat: RequiredColumns<UserChat, 'id'>,
  ) => DatabaseQuery<UserMessage[], '*'>;

  /**
   * Sends the given user message from the given chat.
   *
   * @param chat the given chat identifier
   * @param user the given user linked to the given chat
   * @param message the given user message data
   * @returns a promise that resolves to the corresponding sent user message
   */
  send: (
    chat: RequiredColumns<UserChat, 'id'>,
    user: RequiredColumns<UserProfile, 'supabase_id'>,
    message: string,
  ) => DatabaseQuery<UserMessage, 'id'>;

  /**
   * Modifies the visibility of the given user message(s) from the given chat.
   *
   * @param chat the given chat identifier
   * @param user the given user identifier linked to the given chat
   * @param visible the visibility flag
   * @param messages the given user message identifier(s) from the given chat
   * @returns a promise that resolves to the corresponding modified user message(s)
   */
  show: (
    chat: RequiredColumns<UserChat, 'id'>,
    user: RequiredColumns<UserProfile, 'supabase_id'>,
    visible: boolean,
    messages: RequiredColumns<UserMessage, 'id'>[],
  ) => DatabaseQuery<UserMessage[], 'id'>;

  /**
   * Removes the given user message(s) from the given chat.
   *
   * @param chat the given chat identifier
   * @param user the given user identifier
   * @param messages the given user message identifier(s) from the given chat
   * @returns a promise that resolves to the corresponding deleted user message(s)
   */
  remove: (
    chat: RequiredColumns<UserChat, 'id'>,
    user: RequiredColumns<UserProfile, 'supabase_id'>,
    messages: RequiredColumns<UserMessage, 'id'>[],
  ) => DatabaseQuery<UserMessage[], 'id'>;
}

export const UserMessaging: UserMessaging = {
  subscribe: (
    chat: RequiredColumns<UserChat, 'id'>,
    callback: (payload: RealtimePostgresInsertPayload<UserMessage>) => void,
  ): RealtimeChannel => {
    const id = chat.id.toString();
    return supabase
      .channel(`chat-${id}`)
      .on(
        REALTIME_LISTEN_TYPES.POSTGRES_CHANGES,
        {
          event: 'INSERT',
          schema: 'mru_dev',
          table: 'Messages',
          filter: `chat_id=eq.${id}`,
        },
        callback,
      )
      .subscribe();
  },
  getByChat: async (
    chat: RequiredColumns<UserChat, 'id'>,
  ): DatabaseQuery<UserMessage[], '*'> => {
    return query(
      await supabase
        .from('Messages')
        .select('*')
        .eq('chat_id', chat.id)
        .eq('visible', true)
        .order('created_at', { ascending: true }),
    );
  },
  send: async (
    chat: RequiredColumns<UserChat, 'id'>,
    user: RequiredColumns<UserProfile, 'supabase_id'>,
    message: string,
  ): DatabaseQuery<UserMessage, 'id'> => {
    return query(
      await supabase
        .from('Messages')
        .insert({
          chat_id: chat.id,
          sender_id: user.supabase_id,
          logged_message: message,
        })
        .select('id')
        .single(),
    );
  },
  show: async (
    chat: RequiredColumns<UserChat, 'id'>,
    user: RequiredColumns<UserProfile, 'supabase_id'>,
    visible: boolean,
    messages: RequiredColumns<UserMessage, 'id'>[],
  ): DatabaseQuery<UserMessage[], 'id'> => {
    return query(
      await supabase
        .from('Messages')
        .update({ visible })
        .eq('chat_id', chat.id)
        .eq('sender_id', user.supabase_id)
        .in(
          'id',
          messages.map((message) => message.id),
        )
        .select('id'),
    );
  },
  remove: async (
    chat: RequiredColumns<UserChat, 'id'>,
    user: RequiredColumns<UserProfile, 'supabase_id'>,
    messages: RequiredColumns<UserMessage, 'id'>[],
  ): DatabaseQuery<UserMessage[], 'id'> => {
    return query(
      await supabase
        .from('Messages')
        .delete()
        .eq('chat_id', chat.id)
        .eq('sender_id', user.supabase_id)
        .in(
          'id',
          messages.map((message) => message.id),
        )
        .select('id'),
    );
  },
};
