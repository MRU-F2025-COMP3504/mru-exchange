import type {
  DatabaseQuery,
  RequireProperty,
  InteractingUsers,
  UserProfile,
} from '@shared/types';
import { supabase } from '@shared/api';
import { query } from '@shared/utils';

/**
 * See the implementation below for more information.
 */
interface UserInteraction {
  /**
   * Retrieves two interacting users by their identifier.
   * Selects all columns.
   *
   * To handle the query result:
   * - The {@link PromiseResult} must be awaited.
   * - The {@link Result} that contains either the corresponding data or error must be unwrapped using a conditional statement.
   *
   * @param a the given user identifier
   * @param b the given user identifier
   * @returns a promise that resolves to the corresponding user interaction
   */
  get: (
    a: RequireProperty<UserProfile, 'supabase_id'>,
    b: RequireProperty<UserProfile, 'supabase_id'>,
  ) => DatabaseQuery<InteractingUsers, '*'>;

  /**
   * Retrieves two interacting users by the given user that is currently blocked from the interaction.
   * If the query fails, the function returns an error result.
   *
   * To handle the query result:
   * - The {@link PromiseResult} must be awaited.
   * - The {@link Result} that contains either the corresponding data or error must be unwrapped using a conditional statement.
   *
   * @param user the given user identifier
   * @returns a promise that resolves to the corresponding user interaction
   */
  getBlockedOnUser: (
    user: RequireProperty<UserProfile, 'supabase_id'>,
  ) => DatabaseQuery<InteractingUsers[], 'id'>;

  /**
   * Retrieves two interacting users by the given user that is currently muted from the interaction.
   * If the query fails, the function returns an error result.
   *
   * To handle the query result:
   * - The {@link PromiseResult} must be awaited.
   * - The {@link Result} that contains either the corresponding data or error must be unwrapped using a conditional statement.
   *
   * @param user the given user identifier
   * @returns a promise that resolves to the corresponding user interaction
   */
  getMutedOnUser: (
    user: RequireProperty<UserProfile, 'supabase_id'>,
  ) => DatabaseQuery<InteractingUsers[], 'id'>;

  /**
   * Establishes an interaction between two users.
   * Selects all columns.
   *
   * To handle the query result:
   * - The {@link PromiseResult} must be awaited.
   * - The {@link Result} that contains either the corresponding data or error must be unwrapped using a conditional statement.
   *
   * @param a the given user identifier
   * @param b the given user identifier
   * @returns a promise that resolves to the corresponding user interaction.
   */
  create: (
    a: RequireProperty<UserProfile, 'supabase_id'>,
    b: RequireProperty<UserProfile, 'supabase_id'>,
  ) => DatabaseQuery<InteractingUsers, '*'>;

  /**
   * Blocks the user target by the blocker from the interaction.
   * If the query fails, the function returns an error result.
   *
   * To handle the query result:
   * - The {@link PromiseResult} must be awaited.
   * - The {@link Result} that contains either the corresponding data or error must be unwrapped using a conditional statement.
   *
   * @param blocker the given user identifier
   * @param target the given user identifier
   * @returns a promise that resolves to the corresponding user interaction
   */
  block: (
    blocker: RequireProperty<UserProfile, 'supabase_id'>,
    target: RequireProperty<UserProfile, 'supabase_id'>,
    flag: boolean,
  ) => DatabaseQuery<InteractingUsers, 'id'>;

  /**
   * Mutes the user target by the muter from the interaction.
   * If the query fails, the function returns an error result.
   *
   * To handle the query result:
   * - The {@link PromiseResult} must be awaited.
   * - The {@link Result} that contains either the corresponding data or error must be unwrapped using a conditional statement.
   *
   * @param blocker the given user identifier
   * @param target the given user identifier
   * @returns a promise that resolves to the corresponding user interaction
   */
  mute(
    muter: RequireProperty<UserProfile, 'supabase_id'>,
    target: RequireProperty<UserProfile, 'supabase_id'>,
    flag: boolean,
  ): DatabaseQuery<InteractingUsers, 'id'>;
}

/**
 * The user interaction feature is used establish chat connection and connect a pair that consists of the buyer and the seller.
 * When the buyer bookmarks a product, the seller of that product would be notified of the "order" and establish a new (or reuse existing) chat communication.
 * Users may block and mute recipients from receiving and silencing chat message notifications, respectively.
 *
 * @see {@link UserChatting} for user chat registration and fetching
 * @see {@link UserMessaging} for user messaging
 *
 * @author Sahil Grewal (SahilGrewalx)
 * @author Ramos Jacosalem (cjaco906)
 * @author Andrew Krawiec (AndrewTries)
 */
export const UserInteraction: UserInteraction = {
  get: async (
    a: RequireProperty<UserProfile, 'supabase_id'>,
    b: RequireProperty<UserProfile, 'supabase_id'>,
  ): DatabaseQuery<InteractingUsers, '*'> => {
    return query(
      await supabase
        .from('User_Interactions')
        .select('*')
        .or(
          `and(user_id_1.eq.${a.supabase_id},user_id_2.eq.${b.supabase_id}),and(user_id_1.eq.${b.supabase_id},user_id_2.eq.${a.supabase_id})`,
        )
        .single(),
    );
  },
  getBlockedOnUser: async (
    user: RequireProperty<UserProfile, 'supabase_id'>,
  ): DatabaseQuery<InteractingUsers[], 'id'> => {
    return query(
      await supabase
        .from('User_Interactions')
        .select('id')
        .or(`user_id_1.eq.${user.supabase_id},user_id_2.eq.${user.supabase_id}`)
        .or('user_1_is_blocked.eq.true,user_2_is_blocked.eq.true'),
    );
  },
  getMutedOnUser: async (
    user: RequireProperty<UserProfile, 'supabase_id'>,
  ): DatabaseQuery<InteractingUsers[], 'id'> => {
    return query(
      await supabase
        .from('User_Interactions')
        .select('id')
        .or(`user_id_1.eq.${user.supabase_id},user_id_2.eq.${user.supabase_id}`)
        .or('user_1_is_muted.eq.true,user_2_is_muted.eq.true'),
    );
  },
  create: async (
    a: RequireProperty<UserProfile, 'supabase_id'>,
    b: RequireProperty<UserProfile, 'supabase_id'>,
  ): DatabaseQuery<InteractingUsers, '*'> => {
    return query(
      await supabase
        .from('User_Interactions')
        .insert({
          user_id_1: a.supabase_id,
          user_id_2: b.supabase_id,
        })
        .select('id')
        .single(),
    );
  },
  block: async (
    blocker: RequireProperty<UserProfile, 'supabase_id'>,
    target: RequireProperty<UserProfile, 'supabase_id'>,
    flag = true,
  ): DatabaseQuery<InteractingUsers, 'id'> => {
    const interaction = await UserInteraction.get(blocker, target);
    if (!interaction.ok) {
      return interaction;
    }

    const data = interaction.data;
    const update =
      data.user_id_1 === target.supabase_id
        ? 'user_1_is_blocked'
        : 'user_2_is_blocked';

    return set(data, update, flag);
  },
  mute: async (
    muter: RequireProperty<UserProfile, 'supabase_id'>,
    target: RequireProperty<UserProfile, 'supabase_id'>,
    flag = true,
  ): DatabaseQuery<InteractingUsers, 'id'> => {
    const interaction = await UserInteraction.get(muter, target);
    if (!interaction.ok) {
      return interaction;
    }

    const data = interaction.data;
    const update =
      data.user_id_1 === target.supabase_id
        ? 'user_1_is_muted'
        : 'user_2_is_muted';

    return set(data, update, flag);
  },
};

/**
 * Modifies the given user interaction.
 *
 * @internal
 * @param interaction the given interaction identifier
 * @param field the given interaction property
 * @param flag the given modifier
 * @returns a promise that resolves to the corresponding user interaction
 */
async function set(
  interaction: RequireProperty<InteractingUsers, 'id'>,
  field: string,
  flag: boolean,
): DatabaseQuery<InteractingUsers, 'id'> {
  return query(
    await supabase
      .from('User_Interactions')
      .update({ [field]: flag })
      .eq('id', interaction.id)
      .select('id')
      .single(),
  );
}
