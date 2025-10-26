import { supabase } from '../utils/supabase';
import type { Chat, Message } from '../types/database.ts';

export const messagesApi = {
  getUserChats: async (userId: string) => {
    const { data, error } = await supabase
      .from('Chats')
      .select(
        `
        *,
        user1:user_id_1 (
          id,
          first_name,
          last_name,
          user_name,
          supabase_id
        ),
        user2:user_id_2 (
          id,
          first_name,
          last_name,
          user_name,
          supabase_id
        )
      `,
      )
      .or(`user_id_1.eq.${userId},user_id_2.eq.${userId}`)
      .order('created_at', { ascending: false });

    return { data, error };
  },

  getOrCreateChat: async (userId1: string, userId2: string) => {
    const { data: existingChat, error: searchError } = await supabase
      .from('Chats')
      .select('*')
      .or(
        `and(user_id_1.eq.${userId1},user_id_2.eq.${userId2}),and(user_id_1.eq.${userId2},user_id_2.eq.${userId1})`,
      )
      .single();

    if (existingChat) {
      return { data: existingChat, error: null };
    }

    const { data: newChat, error: createError } = await supabase
      .from('Chats')
      .insert({
        user_id_1: userId1,
        user_id_2: userId2,
        visible_to_user_1: true,
        visible_to_user_2: true,
      })
      .select()
      .single();

    return { data: newChat, error: createError };
  },

  getChatMessages: async (chatId: number) => {
    const { data, error } = await supabase
      .from('Messages')
      .select(
        `
        *,
        sender:sender_id (
          id,
          first_name,
          last_name,
          user_name,
          supabase_id
        )
      `,
      )
      .eq('chat_id', chatId)
      .eq('visible', true)
      .order('created_at', { ascending: true });

    return { data, error };
  },

  sendMessage: async (chatId: number, senderId: string, message: string) => {
    const { data, error } = await supabase
      .from('Messages')
      .insert({
        chat_id: chatId,
        sender_id: senderId,
        logged_message: message,
        visible: true,
      })
      .select()
      .single();

    return { data, error };
  },

  hideMessage: async (messageId: number) => {
    const { data, error } = await supabase
      .from('Messages')
      .update({ visible: false })
      .eq('id', messageId)
      .select()
      .single();

    return { data, error };
  },

  deleteMessage: async (messageId: number) => {
    const { error } = await supabase
      .from('Messages')
      .delete()
      .eq('id', messageId);

    return { error };
  },

  hideChat: async (chatId: number, userId: string) => {
    const { data: chat } = await supabase
      .from('Chats')
      .select('*')
      .eq('id', chatId)
      .single();

    if (!chat) {
      return { error: { message: 'Chat not found' } };
    }

    const updateField =
      chat.user_id_1 === userId ? 'visible_to_user_1' : 'visible_to_user_2';

    const { data, error } = await supabase
      .from('Chats')
      .update({ [updateField]: false })
      .eq('id', chatId)
      .select()
      .single();

    return { data, error };
  },

  showChat: async (chatId: number, userId: string) => {
    const { data: chat } = await supabase
      .from('Chats')
      .select('*')
      .eq('id', chatId)
      .single();

    if (!chat) {
      return { error: { message: 'Chat not found' } };
    }

    const updateField =
      chat.user_id_1 === userId ? 'visible_to_user_1' : 'visible_to_user_2';

    const { data, error } = await supabase
      .from('Chats')
      .update({ [updateField]: true })
      .eq('id', chatId)
      .select()
      .single();

    return { data, error };
  },

  getUnreadCount: async (userId: string) => {
    const { data: chats } = await supabase
      .from('Chats')
      .select('id')
      .or(`user_id_1.eq.${userId},user_id_2.eq.${userId}`);

    if (!chats) return { count: 0, error: null };

    const chatIds = chats.map((chat) => chat.id);

    const { count, error } = await supabase
      .from('Messages')
      .select('*', { count: 'exact', head: true })
      .in('chat_id', chatIds)
      .neq('sender_id', userId)
      .eq('visible', true);

    return { count, error };
  },

  subscribeToChat: (
    chatId: number,
    callback: (payload: { new: Message }) => void,
  ) => {
    return supabase
      .channel(`chat-${chatId}`)
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'mru_dev',
          table: 'Messages',
          filter: `chat_id=eq.${chatId}`,
        },
        callback,
      )
      .subscribe();
  },

  subscribeToUserChats: (
    userId: string,
    callback: (payload: { new: Chat }) => void,
  ) => {
    return supabase
      .channel(`user-chats-${userId}`)
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'mru_dev',
          table: 'Chats',
          filter: `user_id_1=eq.${userId}`,
        },
        callback,
      )
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'mru_dev',
          table: 'Chats',
          filter: `user_id_2=eq.${userId}`,
        },
        callback,
      )
      .subscribe();
  },
};
