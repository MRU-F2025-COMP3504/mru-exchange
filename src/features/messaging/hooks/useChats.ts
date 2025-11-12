import { useState, useEffect, useCallback } from 'react';
import { ChatAPI } from '@features/messaging';
import type {
  Chat,
  DatabaseQuery,
  RequiredColumns,
  UserProfile,
} from '@shared/types';
import { HookUtils } from '@shared/utils';

interface UseChatsReturn {
  loading: boolean;
  chats: Chat[];
  refresh: () => DatabaseQuery<Chat[], '*'>;
  show: (
    flag: boolean,
    ...chats: RequiredColumns<Chat, 'id'>[]
  ) => DatabaseQuery<Chat[], 'id'>;
}

/**
 * Hook to get all chats for a user
 */
export default function (
  sender: RequiredColumns<UserProfile, 'supabase_id'>,
): UseChatsReturn {
  const [loading, setLoading] = useState(true);
  const [chats, setChats] = useState<Chat[]>([]);

  const refresh = useCallback(async () => {
    return HookUtils.load(setLoading, ChatAPI.getByUser(sender)).then(
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
    async (flag: boolean, ...array: RequiredColumns<Chat, 'id'>[]) => {
      return HookUtils.load(setLoading, ChatAPI.show(flag, ...chats)).then(
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

    const subscription = ChatAPI.subscribe(sender, (payload) => {
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
