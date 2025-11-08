import { useState, useEffect } from 'react';
import { messagesApi } from '../api/messages.api';
import type { Chat, Message } from '@shared/types/database/schema.ts';

/**
 * Hook to manage a chat and its messages
 */
export const useChat = (chatId: number | null) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!chatId) {
      setLoading(false);
      return;
    }

    fetchMessages();

    // Subscribe to new messages
    const subscription = messagesApi.subscribeToChat(chatId, (payload) => {
      setMessages((prev) => [...prev, payload.new]);
    });

    return () => {
      subscription.unsubscribe();
    };
  }, [chatId]);

  const fetchMessages = async () => {
    if (!chatId) return;

    setLoading(true);
    setError(null);

    const { data, error: fetchError } =
      await messagesApi.getChatMessages(chatId);

    if (fetchError) {
      setError(fetchError.message);
    } else {
      setMessages(data || []);
    }

    setLoading(false);
  };

  const sendMessage = async (senderId: string, message: string) => {
    if (!chatId) return { data: null, error: { message: 'No chat selected' } };

    const result = await messagesApi.sendMessage(chatId, senderId, message);

    if (result.data) {
      // Message will be added via subscription
    }

    return result;
  };

  const hideMessage = async (messageId: number) => {
    const result = await messagesApi.hideMessage(messageId);

    if (!result.error) {
      setMessages((prev) => prev.filter((msg) => msg.id !== messageId));
    }

    return result;
  };

  return {
    messages,
    loading,
    error,
    sendMessage,
    hideMessage,
    refresh: fetchMessages,
  };
};

/**
 * Hook to get all chats for a user
 */
export const useChats = (userId: string | null) => {
  const [chats, setChats] = useState<Chat[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!userId) {
      setLoading(false);
      return;
    }

    fetchChats();

    // Subscribe to new chats
    const subscription = messagesApi.subscribeToUserChats(userId, () => {
      fetchChats();
    });

    return () => {
      subscription.unsubscribe();
    };
  }, [userId]);

  const fetchChats = async () => {
    if (!userId) return;

    setLoading(true);
    setError(null);

    const { data, error: fetchError } = await messagesApi.getUserChats(userId);

    if (fetchError) {
      setError(fetchError.message);
    } else {
      setChats(data || []);
    }

    setLoading(false);
  };

  const getOrCreateChat = async (otherUserId: string) => {
    if (!userId) return { data: null, error: { message: 'Not authenticated' } };

    const result = await messagesApi.getOrCreateChat(userId, otherUserId);

    if (result.data) {
      await fetchChats();
    }

    return result;
  };

  const hideChat = async (chatId: number) => {
    if (!userId) return { error: { message: 'Not authenticated' } };

    const result = await messagesApi.hideChat(chatId, userId);

    if (!result.error) {
      setChats((prev) => prev.filter((chat) => chat.id !== chatId));
    }

    return result;
  };

  return {
    chats,
    loading,
    error,
    getOrCreateChat,
    hideChat,
    refresh: fetchChats,
  };
};

/**
 * Hook to get unread message count
 */
export const useUnreadCount = (userId: string | null) => {
  const [count, setCount] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!userId) {
      setLoading(false);
      return;
    }

    fetchUnreadCount();

    // Poll for updates every 30 seconds
    const interval = setInterval(fetchUnreadCount, 30000);

    return () => {
      clearInterval(interval);
    };
  }, [userId]);

  const fetchUnreadCount = async () => {
    if (!userId) return;

    setLoading(true);

    const { count: unreadCount } = await messagesApi.getUnreadCount(userId);
    setCount(unreadCount || 0);

    setLoading(false);
  };

  return {
    count,
    loading,
    refresh: fetchUnreadCount,
  };
};
