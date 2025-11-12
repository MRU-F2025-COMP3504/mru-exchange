import { useState, useEffect, useCallback } from 'react';
import { MessageAPI } from '@features/messaging';
import type {
  Chat,
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
export default function (
  sender: RequiredColumns<UserProfile, 'supabase_id'>,
  chat: RequiredColumns<Chat, 'id'>,
): UseChatReturn {
  const [loading, setLoading] = useState(true);
  const [messages, setMessages] = useState<UserMessage[]>([]);

  const refresh = useCallback(async () => {
    return HookUtils.load(setLoading, MessageAPI.getByChat(chat)).then(
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
        MessageAPI.show(chat, sender, flag, ...array),
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
      return HookUtils.load(setLoading, MessageAPI.send(chat, sender, message));
    },
    [chat, sender],
  );

  useEffect(() => {
    void refresh().then((result) => {
      if (!result.ok) {
        console.error(result.error);
      }
    });

    const subscription = MessageAPI.subscribe(chat, (payload) => {
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
