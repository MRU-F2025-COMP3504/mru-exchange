import type {
  Chat,
  DatabaseQuery,
  DatabaseView,
  PickOmit,
  UserMessage,
} from '@shared/types';
import { query, view } from '@shared/api/database.ts';
import { supabase } from '@shared/api';
import {
  REALTIME_LISTEN_TYPES,
  type RealtimeChannel,
  type RealtimePostgresInsertPayload,
} from '@supabase/supabase-js';

export async function get(id: number): DatabaseView<Chat> {
  return view(await supabase.from('Chats').select('*').eq('id', id).single());
}

export async function getByUser(id: string): DatabaseView<Chat[]> {
  return view(
    await supabase
      .from('Chats')
      .select('*')
      .or(`user_id_1.eq.${id},user_id_2.eq.${id}`)
      .order('created_at', { ascending: false }),
  );
}

export async function setVisible(
  chat: PickOmit<Chat, 'id'>,
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
  chat: PickOmit<Chat, 'id'>,
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

export async function create(a: string, b: string): DatabaseQuery<Chat, 'id'> {
  return query(
    await supabase
      .from('Chats')
      .insert({
        user_id_1: a,
        user_id_2: b,
      })
      .select()
      .single(),
  );
}
