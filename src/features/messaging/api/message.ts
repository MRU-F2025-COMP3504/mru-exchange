import type {
  Chat,
  DatabaseQuery,
  DatabaseQueryArray,
  DatabaseView,
  RequiredColumns,
  UserMessage,
} from '@shared/types';
import { supabase } from '@shared/api';
import type { MessageSender } from '@features/messaging/types';
import { query, view } from '@shared/utils';

export async function getByChat(
  chat: RequiredColumns<Chat, 'id'>,
): DatabaseView<UserMessage[]> {
  return view(
    await supabase
      .from('Messages')
      .select('*')
      .eq('chat_id', chat.id)
      .eq('visible', true)
      .order('created_at', { ascending: true }),
  );
}

export async function send(
  sender: MessageSender,
  message: string,
): DatabaseQuery<UserMessage, 'id'> {
  return query(
    await supabase
      .from('Messages')
      .insert({
        chat_id: sender.chat,
        sender_id: sender.user,
        logged_message: message,
      })
      .select('id')
      .single(),
  );
}

export async function hide(
  sender: MessageSender,
  ...messages: RequiredColumns<UserMessage, 'id'>[]
): DatabaseQueryArray<UserMessage, 'id'> {
  return query(
    await supabase
      .from('Messages')
      .update({ visible: false })
      .eq('chat_id', sender.chat)
      .eq('sender_id', sender.user)
      .in(
        'id',
        messages.map((message) => message.id),
      )
      .select('id'),
  );
}

export async function remove(
  sender: MessageSender,
  ...messages: RequiredColumns<UserMessage, 'id'>[]
): DatabaseQueryArray<UserMessage, 'id'> {
  return query(
    await supabase
      .from('Messages')
      .delete()
      .eq('chat_id', sender.chat)
      .eq('sender_id', sender.user)
      .in(
        'id',
        messages.map((message) => message.id),
      )
      .select('id'),
  );
}
