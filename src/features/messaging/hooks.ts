import { UserChatting, UserMessaging } from '@features/messaging';
import { useAuth } from '@shared/contexts';
import type {
  DatabaseQuery,
  DatabaseQueryResult,
  RequireProperty,
  Result,
  UserChat,
  UserMessage,
  UserProfile,
} from '@shared/types';
import { err, HookUtils } from '@shared/utils';
import type { RealtimeChannel } from '@supabase/supabase-js';
import { useCallback, useEffect, useState } from 'react';

/**
 * The return type for the {@link useChat()} hook.
 */
interface UseChat {
  /**
   * The current loading state indicates data in transit or processing to completion.
   *
   * @returns true, if currently loading
   */
  loading: boolean;

  /**
   * The current collection of user messages from the user chat.
   *
   * @returns the {@link DatabaseQueryResult} of user messages
   */
  messages: UserMessage[];

  /**
   * Force refreshes the state to the latest update.
   *
   * @returns the {@link DatabaseQuery} that may contain a collection of user messages
   */
  refresh: () => DatabaseQuery<UserMessage[], '*'>;

  /**
   * Modifies the visibility of the given user message(s) from the user's chat.
   *
   * @param visible the visibility flag
   * @param messages the given user message identifier(s) from the user's chat
   * @returns the {@link Promise} that resolves to the corresponding modified user message(s)
   */
  show: (
    flag: boolean,
    messages: RequireProperty<UserMessage, 'id'>[],
  ) => DatabaseQuery<UserMessage[], 'id'>;

  /**
   * Sends the given user message from the user's chat.
   *
   * @param message the given user message data
   * @returns the {@link Promise} that resolves to the corresponding sent user message
   */
  send: (message: string) => DatabaseQuery<UserMessage, 'id'>;
}

/**
 * Hooks user messaging functionality.
 * The hook state updates when its dependency states changes.
 *
 * @author Sahil Grewal (SahilGrewalx)
 * @author Ramos Jacosalem (cjaco906)
 * @see {@link UserMessaging} for more information
 */
export function useChat(
  receiver: RequireProperty<UserProfile, 'supabase_id'>,
): UseChat {
  const [loading, setLoading] = useState(true);
  const [messages, setMessages] = useState<UserMessage[]>([]);
  const { profile: sender } = useAuth();
  const [chat, setChat] = useState<DatabaseQueryResult<UserChat, 'id'>>(() =>
    err('No user chat found', { sender, receiver }),
  );

  /**
   * Updates the callback state when its dependencies (i.e., chat) changes state.
   *
   * @see {@link UseChat.refresh()}
   */
  const refresh = useCallback(async () => {
    if (sender.ok) {
      setLoading(true);

      return await UserChatting.getByUsers(sender.data, receiver).then(
        async (chat) => {
          setChat(chat);

          if (chat.ok) {
            return HookUtils.load(
              setLoading,
              UserMessaging.getByChat(chat.data),
            ).then((messages) => {
              if (messages.ok) {
                setMessages(messages.data);
              }

              return messages;
            });
          }

          return err('No user chat found', chat) as DatabaseQueryResult<
            UserMessage[],
            '*'
          >;
        },
      );
    }

    return err('No user profile found', sender) as DatabaseQueryResult<
      UserMessage[],
      '*'
    >;
  }, [sender, receiver]);

  /**
   * Hooks the `show()` functionality.
   * Updates the callback state when its dependencies (i.e., chat, sender, messages, refresh) changes state.
   *
   * @see {@link UserMessaging.show()}
   */
  const show = useCallback(
    async (flag: boolean, array: RequireProperty<UserMessage, 'id'>[]) => {
      if (sender.ok && chat.ok) {
        return HookUtils.load(
          setLoading,
          UserMessaging.show(chat.data, sender.data, flag, array),
        ).then(async (result) => {
          if (!result.ok) {
            return result;
          } else if (flag) {
            return await refresh();
          }

          setMessages(
            messages.filter(
              (message) => !array.find((change) => message.id === change.id),
            ),
          );

          return result;
        });
      } else if (chat.error) {
        return chat;
      } else {
        return err('No user profile found', sender) as DatabaseQueryResult<
          UserMessage[],
          'id'
        >;
      }
    },
    [chat, sender, messages, refresh],
  );

  /**
   * Hooks the `send()` functionality.
   * Updates the callback state when its dependencies (i.e., chat, sender) changes state.
   *
   * @see {@link UserMessaging.send()}
   */
  const send = useCallback(
    async (message: string) => {
      if (sender.ok && chat.ok) {
        return HookUtils.load(
          setLoading,
          UserMessaging.send(chat.data, sender.data, message),
        );
      } else if (chat.error) {
        return chat;
      }

      return err('No user profile found', sender) as DatabaseQueryResult<
        UserMessage,
        'id'
      >;
    },
    [chat, sender],
  );

  /**
   * Loads the user's messages once per invocation.
   * Updates the hook state when its dependencies (i.e., chat, sender) changes state.
   * The {@link refresh()} callback dependency prevents infinite recursion recall.
   */
  useEffect(() => {
    void refresh();

    let subscription: RealtimeChannel;

    if (chat.ok) {
      /**
       * Adds new messages when received in real time.
       */
      subscription = UserMessaging.subscribe(chat.data, (payload) => {
        setMessages((previous) => [...previous, payload.new]);
      });
    }

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

/**
 * The return type for the {@link useChats()} hook.
 */
interface UseChats {
  /**
   * The current loading state indicates data in transit or processing to completion.
   *
   * @returns true, if currently loading
   */
  loading: boolean;

  /**
   * The current collection of user chats from the user.
   *
   * @returns the {@link DatabaseQueryResult} of user chats
   */
  chats: UserChat[];

  /**
   * Force refreshes the state to the latest update.
   *
   * @returns the {@link DatabaseQuery} that may contain a collection of user chats
   */
  refresh: () => DatabaseQuery<UserChat[], '*'>;

  /**
   * Establishes chat connection between the user and the given receiver.
   * Creates a new user chat, if it does not exist.
   *
   * @param receiver the given user identifier
   * @returns the {@link Promise} that resolves to the corresponding chat
   */
  connect: (
    receiver: RequireProperty<UserProfile, 'supabase_id'>,
  ) => DatabaseQuery<UserChat, '*'>;

  /**
   * Modifies the visibility the given user chat from the user.
   *
   * @param visible the visibility flag
   * @param chats the given chat identifier(s)
   * @returns the {@link Promise} that resolves to the corresponding chat(s)
   */
  show: (
    flag: boolean,
    chats: RequireProperty<UserChat, 'id'>[],
  ) => DatabaseQuery<UserChat[], 'id'>;
}

/**
 * Hooks user chatting functionality.
 * The hook state updates when its dependency state changes.
 *
 * @author Sahil Grewal (SahilGrewalx)
 * @author Ramos Jacosalem (cjaco906)
 * @see {@link UserChatting} for more information
 */
export function useChats(): UseChats {
  const [loading, setLoading] = useState(true);
  const [chats, setChats] = useState<UserChat[]>([]);
  const { profile: sender } = useAuth();

  /**
   * Updates the callback state when its dependencies (i.e., sender) changes state.
   *
   * @see {@link UseChats.refresh()}
   */
  const refresh = useCallback(async () => {
    if (sender.ok) {
      return HookUtils.load(
        setLoading,
        UserChatting.getByUser(sender.data),
      ).then((result) => {
        if (result.ok) {
          setChats(result.data);
        } else {
          console.error(result.error);
        }

        return result;
      });
    }

    return err('No user profile found', sender) as DatabaseQueryResult<
      UserChat[],
      '*'
    >;
  }, [sender]);

  /**
   * Hooks the `register()` and `getByUsers()` functionality.
   * Updates the callback state when its dependencies (i.e., sender) changes state.
   *
   * @see {@link UserChatting.register()}
   */
  const connect = useCallback(
    async (receiver: RequireProperty<UserProfile, 'supabase_id'>) => {
      if (sender.ok) {
        setLoading(true);

        return await UserChatting.getByUsers(sender.data, receiver).then(
          async (chat) => {
            if (chat.ok) {
              return chat;
            } else {
              return HookUtils.load(
                setLoading,
                UserChatting.register(sender.data, receiver),
              );
            }
          },
        );
      }

      return err('No user profile found', sender) as DatabaseQueryResult<
        UserChat,
        '*'
      >;
    },
    [sender],
  );

  /**
   * Hooks the `show()` functionality.
   * Updates the callback state when its dependencies (i.e., chats, refresh) changes state.
   *
   * @see {@link UserChatting.show()}
   */
  const show = useCallback(
    async (flag: boolean, array: RequireProperty<UserChat, 'id'>[]) => {
      return HookUtils.load(setLoading, UserChatting.show(flag, chats)).then(
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

  /**
   * Loads the user chats once per invocation.
   * Updates the hook state when its dependencies (i.e., sender) changes state.
   * The {@link refresh()} callback dependency prevents infinite recursion recall.
   */
  useEffect(() => {
    void refresh();

    let subscription: RealtimeChannel;

    if (sender.ok) {
      /**
       * Adds newly registered user chat from the user in real time.
       */
      subscription = UserChatting.subscribe(sender.data, (payload) => {
        setChats((previous) => [...previous, payload.new]);
      });
    }

    return () => {
      void subscription.unsubscribe().catch(console.error);
    };
  }, [sender, refresh]);

  return {
    loading,
    chats,
    refresh,
    connect,
    show,
  };
}
