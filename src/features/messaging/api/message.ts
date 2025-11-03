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

export async function getAll(
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
  message: RequiredColumns<UserMessage, 'id'>,
): DatabaseQuery<UserMessage, 'id'> {
  return query(
    await supabase
      .from('Messages')
      .update({ visible: false })
      .eq('id', message.id)
      .select('id')
      .single(),
  );
}

export async function hideAll(
  sender: MessageSender,
): DatabaseQueryArray<UserMessage, 'id'> {
  return query(
    await supabase
      .from('Messages')
      .update({ visible: false })
      .eq('sender_id', sender.user)
      .select('id'),
  );
}

export async function remove(
  message: RequiredColumns<UserMessage, 'id'>,
): DatabaseQuery<UserMessage, 'id'> {
  return query(
    await supabase
      .from('Messages')
      .delete()
      .eq('id', message.id)
      .select('id')
      .single(),
  );
}

export async function removeAll(
  sender: MessageSender,
): DatabaseQueryArray<UserMessage, 'id'> {
  return query(
    await supabase
      .from('Messages')
      .delete()
      .eq('sender_id', sender.user)
      .select('id'),
  );
}
