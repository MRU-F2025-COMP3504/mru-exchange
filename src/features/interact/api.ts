import type {
  DatabaseQuery,
  RequiredColumns,
  InteractingUsers,
  UserProfile,
} from '@shared/types';
import { query, supabase } from '@shared/api';

interface UserInteraction {
  /**
   * Returns two users interacting from the database by their identifier.
   *
   * @param a a user's identifier
   * @param b a user's identifier
   * @returns a promise that contains information of two interacting users
   */
  get: (
    a: RequiredColumns<UserProfile, 'supabase_id'>,
    b: RequiredColumns<UserProfile, 'supabase_id'>,
  ) => DatabaseQuery<InteractingUsers, '*'>;

  /**
   * Returns an interaction from the database by the given user that is currently blocked from the interaction.
   *
   * @param user a user's identifier
   * @returns a promise that contains the interaction identifier
   */
  getBlockedOnUser: (
    user: RequiredColumns<UserProfile, 'supabase_id'>,
  ) => DatabaseQuery<InteractingUsers[], 'id'>;

  /**
   * Returns an interaction from the database by the given user that is currently muted from the interaction.
   *
   * @param user a user's authentication identifier
   * @returns a promise that contains the interaction identifier
   */
  getMutedOnUser: (
    user: RequiredColumns<UserProfile, 'supabase_id'>,
  ) => DatabaseQuery<InteractingUsers[], 'id'>;

  /**
   * Establishes an interaction between two users.
   *
   * @param a a user's identifier
   * @param b a user's identifier
   * @returns a promise that contains information of two interacting users.
   */
  create: (
    a: RequiredColumns<UserProfile, 'supabase_id'>,
    b: RequiredColumns<UserProfile, 'supabase_id'>,
  ) => DatabaseQuery<InteractingUsers, '*'>;

  /**
   * Blocks the user target by the blocker from the interaction.
   *
   * @param blocker the blocker's user identifier
   * @param target the target's user identifier
   * @returns a promise that contains the interaction identifier
   */
  block: (
    blocker: RequiredColumns<UserProfile, 'supabase_id'>,
    target: RequiredColumns<UserProfile, 'supabase_id'>,
    flag: boolean,
  ) => DatabaseQuery<InteractingUsers, 'id'>;

  /**
   * Mutes the user target by the muter from the interaction.
   *
   * @param blocker the muter's user identifier
   * @param target the target's user identifier
   * @returns a promise that contains the interaction identifier
   */
  mute(
    muter: RequiredColumns<UserProfile, 'supabase_id'>,
    target: RequiredColumns<UserProfile, 'supabase_id'>,
    flag: boolean,
  ): DatabaseQuery<InteractingUsers, 'id'>;
}

export const UserInteraction: UserInteraction = {
  get: async (
    a: RequiredColumns<UserProfile, 'supabase_id'>,
    b: RequiredColumns<UserProfile, 'supabase_id'>,
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
    user: RequiredColumns<UserProfile, 'supabase_id'>,
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
    user: RequiredColumns<UserProfile, 'supabase_id'>,
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
    a: RequiredColumns<UserProfile, 'supabase_id'>,
    b: RequiredColumns<UserProfile, 'supabase_id'>,
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
    blocker: RequiredColumns<UserProfile, 'supabase_id'>,
    target: RequiredColumns<UserProfile, 'supabase_id'>,
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
    muter: RequiredColumns<UserProfile, 'supabase_id'>,
    target: RequiredColumns<UserProfile, 'supabase_id'>,
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

async function set(
  interaction: RequiredColumns<InteractingUsers, 'id'>,
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
