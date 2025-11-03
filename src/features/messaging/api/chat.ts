import type {
  Chat,
  DatabaseQuery,
  DatabaseView,
  RequiredColumns,
  UserMessage,
} from '@shared/types';
import { supabase } from '@shared/api';
import {
  REALTIME_LISTEN_TYPES,
  type RealtimeChannel,
  type RealtimePostgresInsertPayload,
  type User,
} from '@supabase/supabase-js';
import { query, view } from '@shared/utils';

export async function get(
  chat: RequiredColumns<Chat, 'id'>,
): DatabaseView<Chat> {
  return view(
    await supabase.from('Chats').select('*').eq('id', chat.id).single(),
  );
}

export async function getByUser(
  user: RequiredColumns<User, 'id'>,
): DatabaseView<Chat[]> {
  const id = user.id;
  return view(
    await supabase
      .from('Chats')
      .select('*')
      .or(`user_id_1.eq.${id},user_id_2.eq.${id}`)
      .order('created_at', { ascending: false }),
  );
}

export async function setVisible(
  chat: RequiredColumns<Chat, 'id'>,
  visible: boolean,
): DatabaseQuery<Chat, 'id'> {
  return query(
    await supabase
      .from('Chats')
      .update({ visible })
      .eq('id', chat.id)
      .select('id')
      .single(),
  );
}

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

export async function create(
  a: RequiredColumns<User, 'id'>,
  b: RequiredColumns<User, 'id'>,
): DatabaseQuery<Chat, 'id'> {
  return query(
    await supabase
      .from('Chats')
      .insert({
        user_id_1: a.id,
        user_id_2: b.id,
      })
      .select()
      .single(),
  );
}
