import { supabase } from '@shared/api';
import { err, ok } from '@shared/utils';
import type {
  ChatTable,
  DatabaseQueryResult,
  MessageTable,
  PickOmit,
} from '@shared/types';
import {
  REALTIME_LISTEN_TYPES,
  type RealtimePostgresInsertPayload,
} from '@supabase/supabase-js';

export async function getUserChat(id: number, columns: string): DatabaseQueryResult<ChatTable> {
  const { data, error } = await supabase
    .from('Chats')
    .select(columns as '*')
    .eq('id', id)
    .single();

  return error ? err(error) : ok(data);
}

export async function getUserChats(id: string, columns: string): DatabaseQueryResult<ChatTable[]> {
  const { data, error } = await supabase
    .from('Chats')
    .select(columns as '*')
    .or(`user_id_1.eq.${id},user_id_2.eq.${id}`)
    .order('created_at', { ascending: false });

  return error ? err(error) : ok(data);
}

export async function createChat(chat: PickOmit<ChatTable, 'user_id_1' | 'user_id_2'>): DatabaseQueryResult<ChatTable> {
  const { data, error } = await supabase
    .from('Chats')
    .insert(chat)
    .select()
    .single();

  return error ? err(error) : ok(data);
}

export async function getChatMessages(id: number, columns: string): DatabaseQueryResult<MessageTable[]> {
  const { data, error } = await supabase
    .from('Messages')
    .select(columns as '*')
    .eq('chat_id', id)
    .eq('visible', true)
    .order('created_at', { ascending: true });

  return error ? err(error) : ok(data);
}

export async function sendMessage(message: PickOmit<MessageTable, 'chat_id' | 'sender_id' | 'logged_message'>): DatabaseQueryResult<MessageTable> {
  const { data, error } = await supabase
    .from('Messages')
    .insert(message)
    .select()
    .single();

  return error ? err(error) : ok(data);
}

export async function hideMessage(id: number): DatabaseQueryResult<MessageTable> {
  const { data, error } = await supabase
    .from('Messages')
    .update({ visible: false })
    .eq('id', id)
    .select()
    .single();

  return error ? err(error) : ok(data);
}

export async function deleteMessage(id: number): DatabaseQueryResult<unknown> {
  const { error } = await supabase
    .from('Messages')
    .delete()
    .eq('id', id);

  return error ? err(error) : ok({});
}

export async function setChatVisibility(chat: number, user: string, visibility: boolean): DatabaseQueryResult<ChatTable> {
  const users = await getUserChat(chat, 'user_id_1,user_id_2');

  if (!users.ok) {
    return users;
  }

  let visible: string;
  if (users.data.user_id_1 === user) {
    visible = 'visible_user_1';
  } else {
    visible = 'visible_user_2';
  }

  const { data, error } = await supabase
    .from('Chats')
    .update({ [visible]: visibility })
    .eq('id', chat)
    .select()
    .single();

  return error ? err(error) : ok(data);
}

export function subscribeToChat(chat: number, callback: (payload: RealtimePostgresInsertPayload<MessageTable>) => void) {
  const id = chat.toString();
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