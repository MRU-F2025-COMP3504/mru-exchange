import type {
  Chat,
  DatabaseQuery,
  RequiredColumns,
  UserMessage, UserProfile,
} from '@shared/types';
import { query, supabase } from '@shared/api';
import {
  REALTIME_LISTEN_TYPES,
  type RealtimeChannel,
  type RealtimePostgresInsertPayload,
} from '@supabase/supabase-js';

export function subscribe(
  chat: RequiredColumns<Chat, 'id'>,
  callback: (payload: RealtimePostgresInsertPayload<UserMessage>) => void,
): RealtimeChannel {
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
}

export async function getByChat(
  chat: RequiredColumns<Chat, 'id'>,
): DatabaseQuery<UserMessage[], '*'> {
  return query(
    await supabase
      .from('Messages')
      .select('*')
      .eq('chat_id', chat.id)
      .eq('visible', true)
      .order('created_at', { ascending: true }),
  );
}

export async function send(
  chat: RequiredColumns<Chat, 'id'>,
  user: RequiredColumns<UserProfile, 'supabase_id'>,
  message: string,
): DatabaseQuery<UserMessage, 'id'> {
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
}

export async function show(
  chat: RequiredColumns<Chat, 'id'>,
  user: RequiredColumns<UserProfile, 'supabase_id'>,
  visible: boolean,
  ...messages: RequiredColumns<UserMessage, 'id'>[]
): DatabaseQuery<UserMessage[], 'id'> {
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
}

export async function remove(
  chat: RequiredColumns<Chat, 'id'>,
  user: RequiredColumns<UserProfile, 'supabase_id'>,
  ...messages: RequiredColumns<UserMessage, 'id'>[]
): DatabaseQuery<UserMessage[], 'id'> {
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
}
