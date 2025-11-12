import type {
  Chat,
  DatabaseQuery,
  RequiredColumns,
  UserProfile,
} from '@shared/types';
import { query, supabase } from '@shared/api';
import {
  REALTIME_LISTEN_TYPES,
  type RealtimeChannel,
  type RealtimePostgresInsertPayload,
} from '@supabase/supabase-js';

export function subscribe(
  user: RequiredColumns<UserProfile, 'supabase_id'>,
  callback: (payload: RealtimePostgresInsertPayload<Chat>) => void,
): RealtimeChannel {
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
}

export async function get(
  chat: RequiredColumns<Chat, 'id'>,
): DatabaseQuery<Chat, '*'> {
  return query(
    await supabase.from('Chats').select('*').eq('id', chat.id).single(),
  );
}

export async function getByUser(
  user: RequiredColumns<UserProfile, 'supabase_id'>,
): DatabaseQuery<Chat[], '*'> {
  const id = user.supabase_id;
  return query(
    await supabase
      .from('Chats')
      .select('*')
      .or(`user_id_1.eq.${id},user_id_2.eq.${id}`)
      .order('created_at', { ascending: false }),
  );
}

export async function show(
  visible: boolean,
  ...chats: RequiredColumns<Chat, 'id'>[]
): DatabaseQuery<Chat[], 'id'> {
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
}

export async function create(
  a: RequiredColumns<UserProfile, 'supabase_id'>,
  b: RequiredColumns<UserProfile, 'supabase_id'>,
): DatabaseQuery<Chat, 'id'> {
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
}
