import type {
  UserMessage,
  DatabaseQuery,
  RequiredColumns,
  UserProfile,
  UserChat,
} from '@shared/types';
import { HookUtils } from '@shared/utils';
import { useState, useCallback, useEffect } from 'react';
import { UserMessaging, UserChatting } from '@features/messaging';

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
   * @returns an unwrapped query result of user messages
   */
  messages: UserMessage[];

  /**
   * Force refreshes the state to the latest update.
   *
   ** To handle the query result:
   * - The {@link PromiseResult} must be awaited.
   * - The {@link Result} that contains either the corresponding data or error must be unwrapped using a conditional statement.
   *
   * @returns a wrapped query that may contain a collection of user messages
   */
  refresh: () => DatabaseQuery<UserMessage[], '*'>;

  /**
   * Modifies the visibility of the given user message(s) from the user's chat.
   *
   * To handle the query result:
   * - The {@link PromiseResult} must be awaited.
   * - The {@link Result} that contains either the corresponding data or error must be unwrapped using a conditional statement.
   *
   * @param visible the visibility flag
   * @param messages the given user message identifier(s) from the user's chat
   * @returns a promise that resolves to the corresponding modified user message(s)
   */
  show: (
    flag: boolean,
    messages: RequiredColumns<UserMessage, 'id'>[],
  ) => DatabaseQuery<UserMessage[], 'id'>;

  /**
   * Sends the given user message from the user's chat.
   *
   * To handle the query result:
   * - The {@link PromiseResult} must be awaited.
   * - The {@link Result} that contains either the corresponding data or error must be unwrapped using a conditional statement.
   *
   * @param message the given user message data
   * @returns a promise that resolves to the corresponding sent user message
   */
  send: (message: string) => DatabaseQuery<UserMessage, 'id'>;
}

/**
 * Hooks user messaging functionality.
 * The hook state updates when its dependency states changes.
 *
 * @see {@link UserMessaging} for more information
 *
 * @author Sahil Grewal (SahilGrewalx)
 * @author Ramos Jacosalem (cjaco906)
 */
export function useChat(
  sender: RequiredColumns<UserProfile, 'supabase_id'>,
  chat: RequiredColumns<UserChat, 'id'>,
): UseChat {
  const [loading, setLoading] = useState(true);
  const [messages, setMessages] = useState<UserMessage[]>([]);

  /**
   * Updates the callback state when its dependencies (i.e., chat) changes state.
   *
   * @see {@link UseChat.refresh()} for more information
   */
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

  /**
   * Hooks the show() functionality.
   * Updates the callback state when its dependencies (i.e., chat, sender, messages, refresh) changes state.
   *
   * @see {@link UserMessaging.show()}
   */
  const show = useCallback(
    async (flag: boolean, array: RequiredColumns<UserMessage, 'id'>[]) => {
      return HookUtils.load(
        setLoading,
        UserMessaging.show(chat, sender, flag, array),
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

  /**
   * Hooks the send() functionality.
   * Updates the callback state when its dependencies (i.e., chat, sender) changes state.
   *
   * @see {@link UserMessaging.send()}
   */
  const send = useCallback(
    async (message: string) => {
      return HookUtils.load(
        setLoading,
        UserMessaging.send(chat, sender, message),
      );
    },
    [chat, sender],
  );

  /**
   * Loads the user's messages once per invocation.
   * Updates the hook state when its dependencies (i.e., chat, sender) changes state.
   * The {@link refresh()} callback dependency prevents infinite recursion recall.
   */
  useEffect(() => {
    void refresh().then((result) => {
      if (!result.ok) {
        console.error(result.error);
      }
    });

    /**
     * Adds new messages when received in real time.
     */
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
   * @returns an unwrapped query result of user chats
   */
  chats: UserChat[];

  /**
   * Force refreshes the state to the latest update.
   *
   ** To handle the query result:
   * - The {@link PromiseResult} must be awaited.
   * - The {@link Result} that contains either the corresponding data or error must be unwrapped using a conditional statement.
   *
   * @returns a wrapped query that may contain a collection of user chats
   */
  refresh: () => DatabaseQuery<UserChat[], '*'>;

  /**
   * Modifies the visibility the given user chat from the user.
   *
   * To handle the query result:
   * - The {@link PromiseResult} must be awaited.
   * - The {@link Result} that contains either the corresponding data or error must be unwrapped using a conditional statement.
   *
   * @param visible the visibility flag
   * @param chats the given chat identifier(s)
   * @returns a promise that resolves to the corresponding chat(s)
   */
  show: (
    flag: boolean,
    chats: RequiredColumns<UserChat, 'id'>[],
  ) => DatabaseQuery<UserChat[], 'id'>;
}

/**
 * Hooks user chatting functionality.
 * The hook state updates when its dependency state changes.
 *
 * @see {@link UserChatting} for more information
 *
 * @author Sahil Grewal (SahilGrewalx)
 * @author Ramos Jacosalem (cjaco906)
 */
export function useChats(
  sender: RequiredColumns<UserProfile, 'supabase_id'>,
): UseChats {
  const [loading, setLoading] = useState(true);
  const [chats, setChats] = useState<UserChat[]>([]);

  /**
   * Updates the callback state when its dependencies (i.e., sender) changes state.
   *
   * @see {@link UseChats.refresh()} for more information
   */
  const refresh = useCallback(async () => {
    return HookUtils.load(setLoading, UserChatting.getByUser(sender)).then(
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

  /**
   * Hooks the show() functionality.
   * Updates the callback state when its dependencies (i.e., chats, refresh) changes state.
   *
   * @see {@link UserChatting.show()}
   */
  const show = useCallback(
    async (flag: boolean, array: RequiredColumns<UserChat, 'id'>[]) => {
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
    void refresh().then((result) => {
      if (!result.ok) {
        console.error(result.error);
      }
    });

    /**
     * Adds newly registered user chat from the user in real time.
     */
    const subscription = UserChatting.subscribe(sender, (payload) => {
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
