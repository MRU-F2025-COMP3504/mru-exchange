import { useState, useEffect, useCallback } from 'react';
import { UserMessaging } from '@features/messaging';
import type {
  UserChat,
  DatabaseQuery,
  RequiredColumns,
  UserMessage,
  UserProfile,
} from '@shared/types';
import { HookUtils } from '@shared/utils';

interface UseChatReturn {
  loading: boolean;
  messages: UserMessage[];
  refresh: () => DatabaseQuery<UserMessage[], '*'>;
  show: (
    flag: boolean,
    ...messages: RequiredColumns<UserMessage, 'id'>[]
  ) => DatabaseQuery<UserMessage[], 'id'>;
  send: (message: string) => DatabaseQuery<UserMessage, 'id'>;
}

/**
 * Hook to manage a chat and its messages
 */
export function useChat(
  sender: RequiredColumns<UserProfile, 'supabase_id'>,
  chat: RequiredColumns<UserChat, 'id'>,
): UseChatReturn {
  const [loading, setLoading] = useState(true);
  const [messages, setMessages] = useState<UserMessage[]>([]);

  const refresh = useCallback(async () => {
    return HookUtils.load(setLoading, UserMessaging.getByChat(chat)).then(
      (result) => {
        if (result.ok) {
          setMessages(result.data);
        } else {
          console.error(result.error);
        }

        return result;
      },
    );
  }, [chat]);

  const show = useCallback(
    async (flag: boolean, ...array: RequiredColumns<UserMessage, 'id'>[]) => {
      return HookUtils.load(
        setLoading,
        UserMessaging.show(chat, sender, flag, ...array),
      ).then((result) => {
        if (!result.ok) {
          return result;
        } else if (flag) {
          return refresh();
        }

        setMessages(
          messages.filter(
            (message) => !array.find((change) => message.id === change.id),
          ),
        );

        return result;
      });
    },
    [chat, sender, messages, refresh],
  );

  const send = useCallback(
    async (message: string) => {
      return HookUtils.load(
        setLoading,
        UserMessaging.send(chat, sender, message),
      );
    },
    [chat, sender],
  );

  useEffect(() => {
    void refresh().then((result) => {
      if (!result.ok) {
        console.error(result.error);
      }
    });

    const subscription = UserMessaging.subscribe(chat, (payload) => {
      setMessages((previous) => [...previous, payload.new]);
    });

    return () => {
      void subscription.unsubscribe().catch(console.error);
    };
  }, [chat, sender, refresh]);

  return {
    loading,
    messages,
    refresh,
    show,
    send,
  };
}

interface UseMessagesReturn {
  loading: boolean;
  chats: UserChat[];
  refresh: () => DatabaseQuery<UserChat[], '*'>;
  show: (
    flag: boolean,
    ...chats: RequiredColumns<UserChat, 'id'>[]
  ) => DatabaseQuery<UserChat[], 'id'>;
}

/**
 * Hook to get all chats for a user
 */
export function UseMessagesReturn(
  sender: RequiredColumns<UserProfile, 'supabase_id'>,
): UseMessagesReturn {
  const [loading, setLoading] = useState(true);
  const [chats, setChats] = useState<UserChat[]>([]);

  const refresh = useCallback(async () => {
    return HookUtils.load(setLoading, UserChat.getByUser(sender)).then(
      (result) => {
        if (result.ok) {
          setChats(result.data);
        } else {
          console.error(result.error);
        }

        return result;
      },
    );
  }, [sender]);

  const show = useCallback(
    async (flag: boolean, ...array: RequiredColumns<UserChat, 'id'>[]) => {
      return HookUtils.load(setLoading, UserChat.show(flag, ...chats)).then(
        (result) => {
          if (!result.ok) {
            return result;
          } else if (flag) {
            return refresh();
          }

          setChats(
            chats.filter(
              (chat) => !array.find((change) => chat.id === change.id),
            ),
          );

          return result;
        },
      );
    },
    [chats, refresh],
  );

  useEffect(() => {
    void refresh().then((result) => {
      if (!result.ok) {
        console.error(result.error);
      }
    });

    const subscription = UserChat.subscribe(sender, (payload) => {
      setChats((previous) => [...previous, payload.new]);
    });

    return () => {
      void subscription.unsubscribe().catch(console.error);
    };
  }, [sender, refresh]);

  return {
    loading,
    chats,
    refresh,
    show,
  };
}
